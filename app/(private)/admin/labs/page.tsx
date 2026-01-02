import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, MoreHorizontal } from "lucide-react";
import { getLabs } from "@/app/actions/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AdminLabsPage() {
  const labs = await getLabs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partner Labs</h1>
          <p className="text-muted-foreground mt-1">Manage diagnostic lab partners on the platform</p>
        </div>
        <Link href="/admin/labs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lab Partner
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Partner Labs</CardTitle>
        </CardHeader>
        <CardContent>
          {labs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No lab partners yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Add your first lab partner to start accepting orders</p>
              <Link href="/admin/labs/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lab Partner
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labs.map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell className="font-medium">{lab.name}</TableCell>
                    <TableCell className="text-muted-foreground">{lab.slug}</TableCell>
                    <TableCell>{lab.address}</TableCell>
                    <TableCell>
                      {lab.isVerified ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit details</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Delete lab</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
