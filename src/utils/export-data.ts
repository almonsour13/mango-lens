import { image$ } from "@/stores/image";
import { tree$ } from "@/stores/tree";
import { getUser } from "@/stores/user-store";
import { observable } from "@legendapp/state";
import { format } from "date-fns";

const userID = getUser()?.userID;
interface DateRange {
    from: string;
    to: string;
}
function generateDailyRange(from: string, to: string) {
    const startDate = new Date(from);
    const endDate = new Date(to);
    const days: { year: number; month: number; day: number }[] = [];

    while (startDate <= endDate) {
        days.push({
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1,
            day: startDate.getDate()
        });
        startDate.setDate(startDate.getDate() + 1); // Increment day
    }

    return days;
}
export const exportData = async (
    DateRange: DateRange | null
): Promise<Boolean> => {
    try {
        const trees = Object.values(observable(tree$).get() || {}).filter(
            (t) => t.userID === userID
        );

        const images = Object.values(observable(image$).get() || {}).filter(
            (i) => i.userID === userID
        );

        if (!DateRange) return false;

        // Create CSV header
        const header = ["Date", "Tree", "Image"];
        let csvContent = header.join(',') + '\n';

        // Generate daily range instead of monthly
        const dailyRange = generateDailyRange(
            DateRange.from,
            DateRange.to
        );

        // Generate content for each day
        let totalTree = 0
        let totalImages = 0
        const content = dailyRange.map(date => {
            const treeCount = trees.filter(
                (t) => 
                    new Date(t.addedAt).getFullYear() === date.year &&
                    new Date(t.addedAt).getMonth() + 1 === date.month &&
                    new Date(t.addedAt).getDate() === date.day
            ).length;

            const imageCount = images.filter(
                (t) =>
                    new Date(t.uploadedAt).getFullYear() === date.year &&
                    new Date(t.uploadedAt).getMonth() + 1 === date.month &&
                    new Date(t.uploadedAt).getDate() === date.day
            ).length;
            totalTree += treeCount;
            totalImages += imageCount;
            // Format date as YYYY-MM-DD
            const formattedDate = `${format(new Date(date.year, date.month - 1, date.day)," MMM dd yyyy")}`;
            return {
                date: formattedDate,
                treeCount,
                imageCount
            };
        });

        // Add each row to CSV content
        content.forEach(row => {
            csvContent += `${row.date},${row.treeCount},${row.imageCount}\n`;
        });
        csvContent += `Total,${totalTree},${totalImages}`
        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = `tree-image-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
    } catch (error) {
        console.error('Error exporting data:', error);
        return false;
    }
};