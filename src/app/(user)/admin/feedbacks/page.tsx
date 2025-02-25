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
import { format } from "date-fns";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { ArrowDownUp, CheckCircle2, XCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FeedBackModal } from "@/components/modal/feedback-modal";
import { v4 } from "uuid";
import { GetFeedbackStatusBadge } from "@/helper/get-badge";

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

export default function Page() {
    const [feedbacks, setFeedbacks] = useState<Feedbacks[] | []>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo } = useAuth();

    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");

    const [feedbackModal, setFeedbackModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedbacks | null>(
        null
    );

    const filteredFeedbacks = feedbacks.sort((a, b) => {
        if (sortBy === "Newest") {
            return (
                new Date(b.feedbackAt).getTime() -
                new Date(a.feedbackAt).getTime()
            );
        } else {
            return (
                new Date(a.feedbackAt).getTime() -
                new Date(b.feedbackAt).getTime()
            );
        }
    });

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

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/admin/${userInfo?.userID}/feedbacks`
                );

                const data = await res.json();
                if (res.ok) {
                    setFeedbacks(data.data);
                    console.log(data.data);
                }
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [userInfo?.userID]);

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
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">User Feedbacks</h1>
                </div>
            </div>
            <PageWrapper>
                <CardHeader className="p-0">
                    <CardDescription>List of user feedbacks</CardDescription>
                </CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex w-full gap-2 justify-between">
                        <div className="flex gap-2 md:gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="gap-1 w-10 md:w-auto"
                                    >
                                        <ArrowDownUp className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            {sortBy}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>
                                        Sort by:{" "}
                                    </DropdownMenuLabel>
                                    <DropdownMenuCheckboxItem
                                        checked={sortBy == "Newest"}
                                        onCheckedChange={() => {
                                            setSortBy("Newest");
                                        }}
                                    >
                                        Newest to oldest
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={sortBy == "Oldest"}
                                        onCheckedChange={() => {
                                            setSortBy("Oldest");
                                        }}
                                    >
                                        Oldest to newest
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
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
                                ) : filteredFeedbacks &&
                                  filteredFeedbacks.length > 0 ? (
                                    filteredFeedbacks.map((feedback) => (
                                        <TableRow key={feedback.feedbackID}>
                                            <TableCell>
                                                {feedback.user &&
                                                    feedback.user.fName +
                                                        " " +
                                                        feedback.user.lName}
                                            </TableCell>
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
                                                    new Date(
                                                        feedback.feedbackAt
                                                    ),
                                                    "MMM dd, yyyy p"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {feedback.responses &&
                                                feedback.responses.length >
                                                    0 ? (
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
            </PageWrapper>
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
