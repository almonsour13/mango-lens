"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [from, setFrom] = React.useState<Date>();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span>From:</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {from ? (
                                format(from, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={from}
                            onSelect={setFrom}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex items-center gap-2">
                <span>To:</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {from ? (
                                format(from, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={from}
                            onSelect={setFrom}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
