import Heading from '@/components/heading';
import SearchInput from '@/components/search-input';
import { Head, Link } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewPackageUnitSheet from '@/components/sheets/new-package-unit';

interface PackageUnitItem {
    uuid: string;
    name: string;
    products_count: number;
    is_active: boolean;
}

interface Props {
    packageUnits: {
        data: PackageUnitItem[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
    };
}

const PackageUnits = ({ packageUnits, filters }: Props) => {
    return (
        <>
            <Head title="Package Units Catalog" />

            <div className="space-y-6">
                {/* Header Action Grid */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Package Units"
                        description="Manage commercial packaging formats like Boxes, Strips, Packs, or Cartons."
                    />
                    <NewPackageUnitSheet
                        trigger={
                            <Button size="sm" className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" /> Add Package
                                Unit
                            </Button>
                        }
                    />
                </div>

                {/* Search Input Container */}
                <div className="max-w-sm">
                    <SearchInput
                        href={window.location.pathname}
                        filters={filters}
                        placeholder="Search package units..."
                    />
                </div>

                {/* Data Matrix */}
                <div className="rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Unit Name</TableHead>
                                <TableHead>Linked Products</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {packageUnits.data.length > 0 ? (
                                packageUnits.data.map((unit) => (
                                    <TableRow key={unit.uuid}>
                                        <TableCell className="font-medium text-foreground">
                                            {unit.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {unit.products_count}{' '}
                                                {unit.products_count === 1
                                                    ? 'product'
                                                    : 'products'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    unit.is_active
                                                        ? 'default'
                                                        : 'destructive'
                                                }
                                            >
                                                {unit.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No package configurations match your
                                        parameters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Dynamic Pagination Row */}
                {packageUnits.links.length > 3 && (
                    <div className="flex items-center justify-end space-x-2">
                        {packageUnits.links.map((link, index) => {
                            if (!link.url) return null;
                            return (
                                <Button
                                    key={index}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    asChild
                                >
                                    <Link
                                        href={link.url}
                                        preserveState
                                        preserveScroll
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default PackageUnits;

PackageUnits.layout = {
    breadcrumbs: [
        {
            title: 'Package Units',
            href: '#',
        },
    ],
};
