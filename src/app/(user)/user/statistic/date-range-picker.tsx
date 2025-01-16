"use client";

import * as React from "react";
import { format, isAfter } from "date-fns";
import { CalendarIcon, ArrowRightIcon } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import ModalDrawer from "@/components/modal/modal-drawer-wrapper";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface CustomDateRange {
    open: boolean;
    setOpen: (open: boolean) => void;
    setCustomDate: (value: { from: string; to: string } | null) => void;
}

export function CustomDateRange({
    open,
    setOpen,
    setCustomDate,
}: CustomDateRange) {
    const today = new Date();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    // Store temporary date selection
    const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date);

    const handleDateSelect = (newDate: DateRange | undefined) => {
        setTempDate(newDate);
    };

    const handleApply = () => {
        if (tempDate?.from && tempDate?.to) {
            setDate(tempDate);
            const formattedFromDate = tempDate.from.toISOString().split("T")[0];
            const formattedToDate = tempDate.to.toISOString().split("T")[0];
            setCustomDate({
                from: formattedFromDate,
                to: formattedToDate,
            });
            setOpen(false);
            setTempDate(undefined);
        }
    };

    const handleCancel = () => {
        setTempDate(date); // Reset to previously confirmed date
        setOpen(false);
    };

    // Reset temp date when modal opens
    React.useEffect(() => {
        if (open) {
            setTempDate(date);
        }
    }, [open, date]);

    return (
        <ModalDrawer open={open} onOpenChange={setOpen}>
            <div className="flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-6">
                        Select Date Range
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex-1 w-full">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !tempDate?.from &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {tempDate?.from ? (
                                                    format(tempDate.from, "PPP")
                                                ) : (
                                                    <span>Start date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <DayPicker
                                                initialFocus
                                                mode="range"
                                                defaultMonth={tempDate?.from}
                                                selected={tempDate}
                                                onSelect={handleDateSelect}
                                                numberOfMonths={1}
                                                disabled={(date) =>
                                                    isAfter(date, today)
                                                }
                                                className="rounded-md border"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <ArrowRightIcon className="h-4 w-4 text-muted-foreground hidden sm:block" />

                                <div className="flex-1 w-full">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !tempDate?.to &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {tempDate?.to ? (
                                                    format(tempDate.to, "PPP")
                                                ) : (
                                                    <span>End date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <DayPicker
                                                initialFocus
                                                mode="range"
                                                defaultMonth={tempDate?.to}
                                                selected={tempDate}
                                                onSelect={handleDateSelect}
                                                numberOfMonths={1}
                                                disabled={(date) =>
                                                    isAfter(date, today)
                                                }
                                                className="rounded-md border"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={!tempDate?.from || !tempDate?.to}
                    >
                        Apply
                    </Button>
                </div>
            </div>
        </ModalDrawer>
    );
}

export default CustomDateRange;
