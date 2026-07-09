import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PackagePlus, Plus, Loader2, X } from 'lucide-react';
import Heading from '@/components/heading';
import SearchInput from '@/components/search-input';
import purchases from '@/routes/purchases';
import NewProductSheet from '@/components/sheets/new-product';
import { DosageForm, PackageUnit, Product } from '@/types/type';
import { useForm, usePage } from '@inertiajs/react';
import DatePicker from '@/components/dashboard/date-picker';
import InputError from '@/components/input-error';
import { useState } from 'react';
import NewPackageUnitSheet from '@/components/sheets/new-package-unit';
import NewDosageFormSheet from '@/components/sheets/new-dosage-form';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface ReceiveStockProps {
    products: Product[];
    filters: {
        search?: string;
    };
    shop_uuid: string;
    search_input: string | null;
    package_units: PackageUnit[];
    dosage_forms: DosageForm[];
}
const ReceiveStock = ({
    products,
    filters,
    shop_uuid,
    search_input,
    package_units,
    dosage_forms,
}: ReceiveStockProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const { data, setData, processing, errors, clearErrors, reset, post } =
        useForm({
            product_name: '',
            product_uuid: '',
            expiry_date: '',
            manufactured_date: '',
            batch_number: '',
            quantity_received: '',
            cost_price: '',
            selling_price: '',
        });

    const { activeShop } = usePage<{ activeShop: { uuid: string } }>().props;

    const handleRecordStock = () => {
        setData({
            ...data, // Preserve other form fields
            product_name: selectedProduct?.name ?? '', // Fallback to '' instead of null to match initial state
            product_uuid: selectedProduct?.uuid ?? '',
        });
        post(purchases.newBatch({ shop: activeShop.uuid }).url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // reset();
                // clearErrors();
                toast.success(`Product Batch added successfully!`, {
                    position: 'top-right',
                });
            },
        });
    };
    return (
        <DashboardInnerLayout>
            <div className="space-y-6">
                {/* Page header */}
                <Heading
                    title="Receive Stock"
                    description="Record a new stock delivery from a supplier.."
                />

                {/* Main form */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* LEFT — Product + Supplier */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">
                                Product & Supplier
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Search for an existing product or add a new one.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Product Search Input with Datalist */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Product Name:
                                    <span className="text-destructive">*</span>
                                </Label>
                                <SearchInput
                                    href={purchases.receiveStock({
                                        shop: shop_uuid,
                                    })}
                                    filters={filters}
                                />
                                <InputError message={errors.product_name} />
                                {selectedProduct && (
                                    <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm">
                                        <div className="flex items-center gap-2 truncate overflow-hidden">
                                            <span className="truncate font-medium text-foreground">
                                                {selectedProduct.name}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="h-4 shrink-0 py-0 text-[10px]"
                                            >
                                                {
                                                    selectedProduct.dosage_form
                                                        .name
                                                }
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="h-4 shrink-0 py-0 text-[10px]"
                                            >
                                                {
                                                    selectedProduct.package_unit
                                                        .name
                                                }
                                            </Badge>
                                        </div>

                                        {/* Clear button to let them search again */}
                                        <button
                                            onClick={() =>
                                                setSelectedProduct(null)
                                            }
                                            type="button"
                                            className="pl-2 text-xs font-semibold text-destructive transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                {products && products.length > 0 ? (
                                    <div className="p-1">
                                        <p className="px-2 py-1 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                                            Available Products (
                                            {products.length})
                                        </p>
                                        <div className="space-y-0.5">
                                            {products.map((product, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    className="flex h-8 w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    onClick={() =>
                                                        setSelectedProduct(
                                                            product,
                                                        )
                                                    }
                                                >
                                                    <span className="font-medium text-foreground">
                                                        {product.name}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-background py-0 text-[10px]"
                                                        >
                                                            {
                                                                product
                                                                    .dosage_form
                                                                    .name
                                                            }
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-background py-0 text-[10px]"
                                                        >
                                                            {
                                                                product
                                                                    .package_unit
                                                                    .name
                                                            }
                                                        </Badge>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {search_input !== null && (
                                            <div className="p-1">
                                                <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                                                    No matching products found.
                                                </div>
                                                <div className="my-1 border-t" />
                                            </div>
                                        )}
                                    </>
                                )}
                                <NewDosageFormSheet
                                    trigger={
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="w-full cursor-pointer justify-start gap-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add New Dosage Form - If not
                                            available
                                        </Button>
                                    }
                                />
                                <NewPackageUnitSheet
                                    trigger={
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="w-full cursor-pointer justify-start gap-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add New Package Unit - If not
                                            available
                                        </Button>
                                    }
                                />
                                <NewProductSheet
                                    trigger={
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="w-full cursor-pointer justify-start gap-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add New Product - If not available
                                        </Button>
                                    }
                                    package_units={package_units}
                                    dosage_forms={dosage_forms}
                                />
                            </div>

                            {/* Supplier Input  */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Supplier{' '}
                                    <span className="ml-1 font-normal text-muted-foreground">
                                        (optional)
                                    </span>
                                </Label>
                                <Input
                                    type="text"
                                    list="suppliers-datalist"

                                    placeholder="Type to select supplier..."
                                    className="rounded-xl text-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* RIGHT — Batch details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">
                                Batch Details
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Enter the details from the delivery invoice.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">
                                        Batch Number{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        value={data.batch_number}
                                        onChange={(e) =>
                                            setData(
                                                'batch_number',
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="e.g. PCM-2024-001"
                                    />
                                    <InputError message={errors.batch_number} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">
                                        Quantity Received{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        value={data.quantity_received}
                                        onChange={(e) =>
                                            setData(
                                                'quantity_received',
                                                e.target.value,
                                            )
                                        }
                                        type="number"
                                        // min={1}
                                        placeholder="e.g. 100"
                                    />
                                    <InputError
                                        message={errors.quantity_received}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-xs font-semibold">
                                        Expiry Date
                                    </Label>
                                    <DatePicker
                                        value={data.expiry_date}
                                        onChange={(date) =>
                                            setData('expiry_date', date)
                                        }
                                    />
                                    <InputError message={errors.expiry_date} />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-xs font-semibold">
                                        Manufactured Date
                                    </Label>
                                    <DatePicker
                                        value={data.manufactured_date}
                                        onChange={(date) =>
                                            setData('manufactured_date', date)
                                        }
                                    />
                                    <InputError
                                        message={errors.manufactured_date}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">
                                        Cost Pric (Tsh)
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
                                            Tsh
                                        </span>
                                        <Input
                                            value={data.cost_price}
                                            onChange={(e) =>
                                                setData(
                                                    'cost_price',
                                                    e.target.value,
                                                )
                                            }
                                            className="rounded-xl pl-10 text-sm"
                                            type="number"
                                            placeholder="8,000"
                                        />
                                    </div>
                                    <InputError message={errors.cost_price} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">
                                        Selling Price (Tsh)
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
                                            Tsh
                                        </span>
                                        <Input
                                            value={data.selling_price}
                                            onChange={(e) =>
                                                setData(
                                                    'selling_price',
                                                    e.target.value,
                                                )
                                            }
                                            className="rounded-xl pl-10 text-sm"
                                            type="number"
                                            placeholder="12,000"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.selling_price}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                onClick={handleRecordStock}
                                className="w-full gap-2 rounded-xl font-semibold"
                            >
                                <PackagePlus className="h-4 w-4" />
                                Record Stock Receipt
                                {processing && <Spinner />}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardInnerLayout>
    );
};

export default ReceiveStock;

ReceiveStock.layout = {
    breadcrumbs: [{ title: 'Receive Stock', href: '#' }],
};
