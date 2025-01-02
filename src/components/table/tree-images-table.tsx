import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Image as ImageType } from "@/type/types";
import { formatDate } from "date-fns";

type TreeImage = ImageType & {
    diseases: { likelihoodScore: number; diseaseName: string }[];
};

interface TreeImagesTableProps {
    images: TreeImage[];
}

export const TreeImagesTable = ({ images }: TreeImagesTableProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const diseaseColors = useMemo(
        () => [
            "bg-red-100 text-red-800 border-red-200",
            "bg-orange-100 text-orange-800 border-orange-200",
            "bg-yellow-100 text-yellow-800 border-yellow-200",
        ],
        []
    );

    const handleRowClick = (imageId: number) => {
        router.push(`${pathname}/${imageId}`);
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="table-cell">Image</TableHead>
                        <TableHead className="hidden md:table-cell">
                            Diseases
                        </TableHead>
                        <TableHead>Date Uploaded</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {images.map((image) => (
                        <TableRow
                            key={image.imageID}
                            onClick={() => handleRowClick(image.imageID)}
                            className="cursor-pointer"
                        >
                            <TableCell className="w-10">
                                <ImageIcon className="opacity-20" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex flex-wrap gap-2">
                                    {image.diseases.map((disease, index) => (
                                        <Badge
                                            key={disease.diseaseName}
                                            variant="outline"
                                            className={
                                                diseaseColors[
                                                    index % diseaseColors.length
                                                ]
                                            }
                                        >
                                            {disease.diseaseName}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                {formatDate(image.uploadedAt, "MMM dd, yyyy")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
