import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export default function RecentScanTable(){
    const imageData = [
        { imageId: 1, treeId: 101, userId: 501, status: 'Healthy', disease: 'None', confidence: '95%', uploadedAt: '2023-07-12 10:42 AM' },
        { imageId: 2, treeId: 102, userId: 502, status: 'Infected', disease: 'Bacterial Blight', confidence: '89%', uploadedAt: '2023-10-18 03:21 PM' },
        { imageId: 3, treeId: 103, userId: 503, status: 'Infected', disease: 'Powdery Mildew', confidence: '92%', uploadedAt: '2023-11-29 08:15 AM' },
        { imageId: 4, treeId: 104, userId: 504, status: 'Healthy', disease: 'None', confidence: '98%', uploadedAt: '2023-12-25 11:59 PM' },
        { imageId: 5, treeId: 105, userId: 505, status: 'Infected', disease: 'Leaf Spot', confidence: '90%', uploadedAt: '2024-01-01 12:00 AM' },
        { imageId: 6, treeId: 106, userId: 506, status: 'Infected', disease: 'Anthracnose', confidence: '88%', uploadedAt: '2024-02-14 02:14 PM' }
    ];    
    return(
      <Card x-chunk="dashboard-06-chunk-0" className="flex-1">
        <CardHeader>
          <CardTitle>Recent Upload Image</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">
                          Image
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            Tree Code
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            User ID
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                            Disease
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            Confidence
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-sm">
                            Uploaded At
                        </TableHead>
                        <TableHead className="text-center">
                          Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {imageData.map((item,index) => (
                    <TableRow key={index}>
                        <TableCell className="">
                            <div className="h-10 w-10 rounded bg-gray-200"></div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {item.treeId}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {item.userId}
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell className="hidden md:table-cell">
                            {item.disease}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                            {item.confidence}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                            {item.uploadedAt}
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
            <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                products
            </div>
            </CardFooter>
      </Card>
    )
}