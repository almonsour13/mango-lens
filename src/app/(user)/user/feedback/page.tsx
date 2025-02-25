"use client";
import AddFeedBackModel, {
    FeedBackModal,
} from "@/components/modal/feedback-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { useFeedback } from "@/hooks/use-feedback";
import { toast } from "@/hooks/use-toast";
import { submitFeedback } from "@/stores/feedback";
import { addResponse } from "@/stores/feedbackResponse";
import { Feedback as FB } from "@/types/types";
import { format } from "date-fns";
import { ArrowDownUp, MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { v4 } from "uuid";

type Feedback = FB & {
    responses: {
        feedbackResponseID: string;
        feedbackID: string;
        userID: string;
        content: string;
        status: number;
        feedbackResponseAt: Date;
    }[];
};
export default function Feedback() {
    const {feedbacks, setFeedbacks, loading} = useFeedback()
    const { userInfo } = useAuth();
    const [sortBy, setSortBy] = useState<"Newest" | "Oldest">("Newest");
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
        null
    );
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [isAddFeedbackModel, setIsAddFeedbackModel] = useState(false);

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
        
        setSelectedFeedback((prev) => ({
            ...prev!,
            responses: [...prev!.responses, newRes],
        }));

        setFeedbacks((prev) =>
            prev.map((fd) =>
                fd.feedbackID === selectedFeedback.feedbackID
                    ? { ...fd, responses: [...fd.responses, newRes] }
                    : fd
            )
        );
        await addResponse(newRes);
    };

    const onSubmitFeedback = async (content: string) => {
        if(!userInfo?.userID) return
        const newFeedback = {
            feedbackID: v4(),
            content,
            userID: userInfo.userID,
            status: 1,
            feedbackAt: new Date(),
        }
        setFeedbacks((prev) => [...prev, {...newFeedback, 
            responses:[]}])
        
        const res = await submitFeedback(newFeedback)

        toast({
            description:res.message
        });
        setIsAddFeedbackModel(false)
    }

    return (
        <>
            <div className="h-14 w-full px-4 flex items-center justify-between border-b">
                <div className="flex gap-2 h-5 items-center">
                    <h1 className="text-md">Feedback</h1>
                </div>
                <Button
                    variant="outline"
                    className="w-10 md:w-auto"
                    onClick={() => setIsAddFeedbackModel(true)}
                >
                    <Plus className="h-5 w-5" />
                    <span className="hidden md:block text-sm">
                        Add more feedback
                    </span>
                </Button>
            </div>
            <PageWrapper>
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
                <CardContent className="p-0 flex-1">
                    {loading && feedbacks.length === 0 ? (
                        <div className="flex-1 h-full w-full flex items-center justify-center">
                            loading
                        </div>
                    ) : filteredFeedbacks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                            {filteredFeedbacks.map((fd, index) => (
                                <Card
                                    key={index}
                                    className="hover:bg-card cursor-pointer shadow-none"
                                    onClick={() => viewFeedback(fd.feedbackID)}
                                >
                                    <CardContent className="p-2">
                                        <div className="w-full flex flex-col gap-1">
                                            <div className="w-full flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">
                                                        {format(
                                                            fd.feedbackAt,
                                                            "d MMM, y hh:mm a"
                                                        )}
                                                    </span>
                                                </div>
                                                <Badge
                                                    variant={
                                                        fd.status === 1
                                                            ? "destructive"
                                                            : fd.status === 2
                                                            ? "secondary"
                                                            : "default"
                                                    }
                                                >
                                                    {fd.status === 1
                                                        ? "pending"
                                                        : fd.status === 2
                                                        ? "Review"
                                                        : "Resolved"}
                                                </Badge>
                                            </div>
                                            <div className="w-full flex flex-col">
                                                <p className="mt-">
                                                    {fd.content}
                                                </p>
                                            </div>
                                            {fd.responses &&
                                                fd.responses.length > 0 && (
                                                    <div className="flex justify-end">
                                                        <div className="relative flex items-center gap-1">
                                                            <MessageSquare className="w-4" />
                                                            <span className="text-sm">
                                                                {
                                                                    fd.responses
                                                                        .length
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 h-full w-full flex items-center justify-center">
                            No feedbacks
                        </div>
                    )}
                </CardContent>
            </PageWrapper>

            <AddFeedBackModel
                open={isAddFeedbackModel}
                onSubmitFeedback={onSubmitFeedback}
                onClose={() => setIsAddFeedbackModel(false)}
            />
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
