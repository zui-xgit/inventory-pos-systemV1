import Heading from '@/components/heading';
import SearchInput from '@/components/search-input'; // Adjust this import path to match your structure
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
import NewProductSheet from '@/components/sheets/new-product';
import { DosageForm, PackageUnit } from '@/types/type';

interface ProductItem {
    uuid: string;
    name: string;
    sku: string;
    is_active: boolean;
    dosage_form: { uuid: string; name: string };
    package_unit: { uuid: string; name: string };
}

interface Props {
    products: {
        data: ProductItem[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
    };
    dosage_forms: DosageForm[];
    package_units: PackageUnit[];
}

const Products = ({
    products,
    filters,
    dosage_forms,
    package_units,
}: Props) => {
    return (
        <>
            <Head title="Products Catalog" />

            <div className="space-y-6">
                {/* Header Action Row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Products Catalog"
                        description="Manage your pharmacy's master drug list and product blueprints."
                    />
                    <NewProductSheet
                        trigger={
                            <Button size="sm" className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" /> Add Product
                            </Button>
                        }
                        package_units={package_units}
                        dosage_forms={dosage_forms}
                    />
                </div>

                {/* Integrated Reusable Search Component */}
                <div className="max-w-sm">
                    <SearchInput
                        href={window.location.pathname}
                        filters={filters}
                        placeholder="Search products by name or SKU..."
                    />
                </div>

                {/* Data Matrix */}
                <div className="rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>SKU / Barcode</TableHead>
                                <TableHead>Dosage Form</TableHead>
                                <TableHead>Package Unit</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.length > 0 ? (
                                products.data.map((product) => (
                                    <TableRow key={product.uuid}>
                                        <TableCell className="font-medium text-foreground">
                                            {product.name}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {product.sku}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {product.dosage_form.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {product.package_unit.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    product.is_active
                                                        ? 'default'
                                                        : 'destructive'
                                                }
                                            >
                                                {product.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No catalog records matches your entry
                                        parameters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Contextual Pagination Controls */}
                {products.links.length > 3 && (
                    <div className="flex items-center justify-end space-x-2">
                        {products.links.map((link, index) => {
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

export default Products;

Products.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: '#',
        },
    ],
};
