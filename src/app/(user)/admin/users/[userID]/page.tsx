"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid, Clock, Calendar, UserCircle } from "lucide-react";
import PageWrapper from "@/components/wrapper/page-wrapper";
import Link from "next/link";
import React from "react";

interface User {
    userID: number;
    fName: string;
    lName: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}
interface Image {
    imageID: number;
    imageData: string;
    status: string;
    uploadedAt: string;
}
interface Log {
    logID: number;
    userID: number;
    activity: string;
    type: number;
    status: number;
    createdAt: Date;
}

export default function UserDetails({
    params,
}: {
    params: Promise<{ userID: string }>;
}) {
    const pathname = usePathname();
    const unwrappedParams = React.use(params);
    const { userID } = unwrappedParams;
    const [user, setUser] = useState<User | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);

    const fetchUserData = useCallback( async () => {
        try {
            const response = await fetch(`/api/users/${userID}`);
            if (!response.ok) {
                throw new Error("Failed to fetch image details");
            }
            const data = await response.json();
            setUser(data.details);
            setImages(data.images);
            setLogs(data.logs);
        } catch (error) {
            console.log(error)
        }
    },[userID]);
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="container mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between space-y-4 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row items-center space-x-4">
                        <Avatar className="w-32 h-32 bg-primary">
                            <AvatarFallback className="bg-primary text-4xl font-bold">
                                {user.fName[0]}
                                {user.lName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold">
                                    {user.fName} {user.lName}
                                    {userID}
                                </h1>
                                <p className="text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <UserCircle className="h-4 w-4 mr-2" />
                                    <span>{user.role}</span>
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className={`h-3 w-3 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-red-500"} mr-2`}
                                    />
                                    <span>{user.status}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>
                                        Joined{" "}
                                        {new Date(
                                            user.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-2">
                        <Button className="btn h-9" variant="outline">
                            Message
                        </Button>
                        <Link
                            className="flex px-4 rounded-md items-center btn h-9 bg-primary text-sm"
                            href={pathname + `/edit`}
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="images" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="images">
                            <Grid className="mr-2 h-4 w-4" /> Images
                        </TabsTrigger>
                        <TabsTrigger value="activity">
                            <Clock className="mr-2 h-4 w-4" /> Activity
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="images">
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 bg-card rounded-lg p-4">
                            {images.map((image) => (
                                <Link
                                    href= {`${pathname}/${image.imageID}`}
                                    key={image.imageID}
                                    className="relative overflow-hidden rounded-lg  bg-background aspect-square  w-full h-full"
                                >
                                    <Image
                                        src={image.imageData}
                                        alt={`Image ${image.imageID}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-all ease-in-out hover:scale-105"
                                    />
                                </Link>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="activity">
                        <Card className="">
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px] w-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Activity</TableHead>
                                                <TableHead>Timestamp</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {logs.map((log) => (
                                                <TableRow key={log.logID}>
                                                    <TableCell>
                                                        {log.activity}
                                                    </TableCell>
                                                    <TableCell>
                                                      
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </PageWrapper>
    );
}
