"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useEffect, useState } from "react";
import type { Feedback, User } from "@/types/types";
import { useAuth } from "@/context/auth-context";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GetFeedbackStatusBadge } from "@/helper/get-badge";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "@/hooks/use-toast";
import { FeedBackModal } from "@/components/modal/feedback-modal";
import { v4 } from "uuid";

type Feedbacks = Feedback & {
    user?: User;
    responses: {
        feedbackResponseID: string;
        feedbackID: string;
        userID: string;
        content: string;
        status: number;
        feedbackResponseAt: Date;
    }[];
};
export default function Page({
    params,
}: {
    params: Promise<{ userID: string }>;
}) {
    const [feedbacks, setFeedbacks] = useState<Feedbacks[]>([]);
    const [loading, setLoading] = useState(true);

    const unwrappedParams = React.use(params);
    const { userID } = unwrappedParams;
    const { userInfo } = useAuth();

    const [feedbackModal, setFeedbackModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedbacks | null>(
        null
    );

    useEffect(() => {
        const fetchFeedbacksByUserID = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/admin/${userInfo?.userID}/user/${userID}/feedbacks`
                );

                const data = await res.json();
                if (res.ok) {
                    setFeedbacks(data.data);
                } else {
                    toast({
                        description: `${data.error}`,
                    });
                }
            } catch (error) {
                toast({
                    description: `${error}`,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacksByUserID();
    }, []);
    const viewFeedback = async (feedbackID: string) => {
        const fd = feedbacks.filter((fd) => fd.feedbackID === feedbackID)[0];
        setFeedbacks((prev) =>
            prev.map((pr) =>
                pr.feedbackID === feedbackID ? { ...pr, status: 2 } : pr
            )
        );
        setSelectedFeedback(fd);
        setFeedbackModal(true);
    };
    const onReply = async (content: string) => {
        if (!selectedFeedback || !userInfo?.userID) return;

        const newRes = {
            feedbackResponseID: v4(),
            feedbackID: selectedFeedback.feedbackID,
            userID: userInfo.userID,
            content: content,
            status: 1,
            feedbackResponseAt: new Date(),
        };

        setSelectedFeedback((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                status: prev.status === 1 ? 3 : prev.status,
                responses: [...prev.responses, newRes],
            };
        });

        setFeedbacks((prev) =>
            prev.map((fd) =>
                fd.feedbackID === selectedFeedback.feedbackID
                    ? { ...fd, responses: [...fd.responses, newRes] }
                    : fd
            )
        );
        setFeedbacks((prev) =>
            prev.map((pr) =>
                pr.feedbackID === selectedFeedback.feedbackID
                    ? { ...pr, status: 3 }
                    : pr
            )
        );
        const res = await fetch(
            `/api/admin/${userInfo.userID}/feedbacks/${selectedFeedback.feedbackID}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    feedbackResponseID: v4(),
                    content: content,
                }),
            }
        );
        const data = await res.json();
        if (res.ok) {
            console.error("Failed to save feedback response");
            console.log(data);
        } else {
            console.log(data.data);
        }
    };

    return (
        <>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden md:table-cell">
                                    Feedback
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Feedback At
                                </TableHead>
                                <TableHead className="text-center">
                                    Response
                                </TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableSkeleton />
                            ) : feedbacks && feedbacks.length > 0 ? (
                                feedbacks.map((feedback) => (
                                    <TableRow key={feedback.feedbackID}>
                                        <TableCell className="hidden md:table-cell">
                                            {feedback.content}
                                        </TableCell>
                                        <TableCell>
                                            {GetFeedbackStatusBadge(
                                                feedback.status
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {format(
                                                new Date(feedback.feedbackAt),
                                                "MMM dd, yyyy p"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {feedback.responses &&
                                            feedback.responses.length > 0 ? (
                                                <CheckCircle2 className="inline-block text-green-500" />
                                            ) : (
                                                <XCircle className="inline-block text-red-500" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                onClick={() =>
                                                    viewFeedback(
                                                        feedback.feedbackID
                                                    )
                                                }
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center"
                                    >
                                        No Feedbacks found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <FeedBackModal
                open={feedbackModal}
                onClose={setFeedbackModal}
                feedback={selectedFeedback}
                setFeedback={setSelectedFeedback}
                onReply={onReply}
            />
        </>
    );
}
