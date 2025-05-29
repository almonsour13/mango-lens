"use client";
import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Feedback as FB, User } from "@/types/types";
import { Dispatch, SetStateAction, useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import ModalDrawer from "./modal-drawer-wrapper";

import { GetFeedbackStatusBadge } from "@/helper/get-badge";
import { getUser } from "@/stores/user-store";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
interface AddPendingModalProps {
    open: boolean;
    onClose: (value: boolean) => void;
    onSubmitFeedback:(content: string) => void;
}

export default function AddFeedBackModel({
    open,
    onClose,
    onSubmitFeedback,
}: AddPendingModalProps) {
    const [feedback, setFeedback] = useState("");
    const onSubmit = async () => {
        onSubmitFeedback(feedback)
        setFeedback("")
    };
    return (
        <ModalDrawer open={open} onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle>Provide Feedback</DialogTitle>
                <DialogDescription>
                    Help us improve our app to best suit your needs by providing
                    feedback!.
                </DialogDescription>
            </DialogHeader>
            <div className=" flex flex-col">
                <div className="flex-1 flex flex-col justify-start items-start gap-2">
                    <Label htmlFor="description" className="text-right">
                        Can you tell us your experience?
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="add your feedback here..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="resize-none min-h-40"
                    />
                </div>
            </div>
            <div className="flex gap-2 flex-row">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose(false)}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    variant="default"
                    className="flex-1"
                    disabled={!feedback}
                    onClick={onSubmit}
                >
                    Submit
                </Button>
            </div>
        </ModalDrawer>
    );
}
type Feedback = FB & {
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
interface FeedBackModalProps {
    open: boolean;
    onClose: (value: boolean) => void;
    feedback: Feedback | null;
    setFeedback: Dispatch<SetStateAction<Feedback | null>>;
    onReply: (content: string) => void;
}
export function FeedBackModal({
    open,
    onClose,
    feedback,
    setFeedback,
    onReply,
}: FeedBackModalProps) {
    const [reply, setReply] = useState("");
    const userInfo = getUser();

    if (!feedback) return null;

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInfo?.userID) return;
        onReply(reply);
        setReply("");
    };

    return (
        <ModalDrawer open={open} onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle>Feedback Details</DialogTitle>
                {/* <DialogDescription>
                    View and respond to feedback to improve our application.
                </DialogDescription> */}
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
                <div className="space-y-2">
                    <Card className="shadow-none bg-primary/10">
                        <CardContent className="p-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    {userInfo?.userID === feedback.userID?"You":feedback.user?.fName+" "+feedback.user?.lName}
                                </span>
                                {GetFeedbackStatusBadge(feedback.status)}
                            </div>
                            <p className="text-sm">{feedback.content}</p>
                            <div className="flex justify-end">
                                <span className="text-xs text-muted-foreground">
                                    {format(
                                        feedback.feedbackAt,
                                        "d MMM, y hh:mm a"
                                    )}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {feedback.responses && feedback.responses.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold">
                                Responses
                            </h3>
                            <div className="space-y-2">
                                {feedback.responses.map((response, index) => (
                                    <Card
                                        key={response.feedbackResponseID}
                                        className={`${
                                            response.userID === userInfo?.userID
                                                ? "bg-primary/10"
                                                : ""
                                        } shadow-none`}
                                    >
                                        <CardContent className="p-2">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium text-sm">
                                                    {response.userID === feedback.userID
                                                        ?feedback.user ?feedback.user?.fName+" "+feedback.user?.lName:"You"
                                                        :"Mango Lens"}
                                                </h4>
                                            </div>
                                            <p className="text-sm">
                                                {response.content}
                                            </p>
                                            <div className="flex justify-end">
                                                <span className="text-xs text-muted-foreground">
                                                    {format(
                                                        response.feedbackResponseAt,
                                                        "d MMM, y hh:mm a"
                                                    )}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            {/* <Separator className="my-4" /> */}
            <form
                onSubmit={handleSubmitReply}
                className="flex items-center space-x-2"
            >
                <Input
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="flex-grow"
                />
                <Button type="submit" className="w-10" disabled={!reply.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send reply</span>
                </Button>
            </form>
        </ModalDrawer>
    );
}
