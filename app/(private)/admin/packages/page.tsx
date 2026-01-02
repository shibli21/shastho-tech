import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { getPackages } from "@/app/actions/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AdminPackagesPage() {
  const packages = await getPackages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Packages</h1>
          <p className="text-muted-foreground mt-1">Manage bundled health checkup packages</p>
        </div>
        <Link href="/admin/packages/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No packages created yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Bundle tests together to offer better value to patients
              </p>
              <Link href="/admin/packages/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Package
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tests Included</TableHead>
                  <TableHead>Popular</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">
                      {pkg.name}
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{pkg.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={pkg.discountPrice ? "line-through text-muted-foreground text-xs" : ""}>
                          ৳{pkg.price}
                        </span>
                        {pkg.discountPrice && <span className="font-bold text-green-600">৳{pkg.discountPrice}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{pkg.packageTests.length} Tests</Badge>
                    </TableCell>
                    <TableCell>{pkg.isPopular && <CheckCircle2 className="h-4 w-4 text-green-500" />}</TableCell>
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
                          <DropdownMenuItem className="text-red-500">Delete package</DropdownMenuItem>
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
