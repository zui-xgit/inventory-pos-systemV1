import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Search,
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    Receipt,
    X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Batch {
    id: string;
    batch_number: string;
    expiry_date: string;
    selling_price: number;
    quantity_available: number;
}

interface Product {
    id: string;
    name: string;
    sku: string;
    form: string;
    unit: string;
    batches: Batch[];
}

interface CartItem {
    product_id: string;
    batch_id: string;
    name: string;
    form: string;
    unit: string;
    batch_number: string;
    expiry_date: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

type PaymentMethod = 'cash' | 'card' | 'mobile';

// ─────────────────────────────────────────────────────────────────────────────
// Dummy data
// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Paracetamol 500mg',
        sku: 'PCM500',
        form: 'Tablet',
        unit: 'Strip',
        batches: [
            {
                id: 'b1',
                batch_number: 'PCM-2024-001',
                expiry_date: '2025-06-30',
                selling_price: 2500,
                quantity_available: 45,
            },
            {
                id: 'b2',
                batch_number: 'PCM-2024-002',
                expiry_date: '2026-01-15',
                selling_price: 2700,
                quantity_available: 100,
            },
        ],
    },
    {
        id: '2',
        name: 'Amoxicillin 250mg',
        sku: 'AMX250',
        form: 'Syrup',
        unit: 'Bottle',
        batches: [
            {
                id: 'b3',
                batch_number: 'AMX-2024-001',
                expiry_date: '2025-03-20',
                selling_price: 8500,
                quantity_available: 30,
            },
        ],
    },
    {
        id: '3',
        name: 'Ibuprofen 400mg',
        sku: 'IBU400',
        form: 'Tablet',
        unit: 'Strip',
        batches: [
            {
                id: 'b4',
                batch_number: 'IBU-2024-001',
                expiry_date: '2026-08-10',
                selling_price: 3000,
                quantity_available: 80,
            },
        ],
    },
    {
        id: '4',
        name: 'Metronidazole 200mg',
        sku: 'MTZ200',
        form: 'Tablet',
        unit: 'Strip',
        batches: [
            {
                id: 'b5',
                batch_number: 'MTZ-2024-001',
                expiry_date: '2025-11-05',
                selling_price: 1800,
                quantity_available: 60,
            },
        ],
    },
];

const CURRENCY_SYMBOL = 'TSh';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — pick earliest expiry batch (FEFO)
// ─────────────────────────────────────────────────────────────────────────────

const getEarliestBatch = (batches: Batch[]): Batch => {
    return [...batches].sort(
        (a, b) =>
            new Date(a.expiry_date).getTime() -
            new Date(b.expiry_date).getTime(),
    )[0];
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const ProductRow = ({
    product,
    onAdd,
}: {
    product: Product;
    onAdd: (product: Product) => void;
}) => {
    const batch = getEarliestBatch(product.batches);

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors hover:bg-muted/60">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                        {product.name}
                    </p>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {product.form}
                    </Badge>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>SKU: {product.sku}</span>
                    <span>Exp: {batch.expiry_date}</span>
                    <span>
                        Stock: {batch.quantity_available} {product.unit}s
                    </span>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                <p className="text-sm font-bold text-foreground">
                    {CURRENCY_SYMBOL} {batch.selling_price.toLocaleString()}
                </p>
                <Button
                    size="sm"
                    onClick={() => onAdd(product)}
                    className="h-8 w-8 rounded-lg p-0"
                    disabled={batch.quantity_available === 0}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

const CartRow = ({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}: {
    item: CartItem;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}) => (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
                {item.name}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[10px]">
                    {item.form}
                </Badge>
                <span className="truncate">Batch: {item.batch_number}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
                {CURRENCY_SYMBOL} {item.unit_price.toLocaleString()} /{' '}
                {item.unit}
            </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-1">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDecrease(item.batch_id)}
                    className="h-7 w-7 rounded-lg p-0"
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-bold">
                    {item.quantity}
                </span>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onIncrease(item.batch_id)}
                    className="h-7 w-7 rounded-lg p-0"
                >
                    <Plus className="h-3 w-3" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemove(item.batch_id)}
                    className="h-7 w-7 rounded-lg p-0 text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
            <p className="text-xs font-bold text-foreground">
                {CURRENCY_SYMBOL} {item.subtotal.toLocaleString()}
            </p>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main POS Page
// ─────────────────────────────────────────────────────────────────────────────

const NewSalePOS = () => {
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [discount, setDiscount] = useState<number>(0);
    const [amountPaid, setAmountPaid] = useState<number>(0);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // ── Search filter ─────────────────────────────────────────────────────────

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return DUMMY_PRODUCTS;
        const q = search.toLowerCase();
        return DUMMY_PRODUCTS.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q),
        );
    }, [search]);

    // ── Cart actions ──────────────────────────────────────────────────────────

    const addToCart = (product: Product) => {
        const batch = getEarliestBatch(product.batches);
        const existing = cart.find((item) => item.batch_id === batch.id);

        if (existing) {
            setCart((prev) =>
                prev.map((item) =>
                    item.batch_id === batch.id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                              subtotal: (item.quantity + 1) * item.unit_price,
                          }
                        : item,
                ),
            );
        } else {
            setCart((prev) => [
                ...prev,
                {
                    product_id: product.id,
                    batch_id: batch.id,
                    name: product.name,
                    form: product.form,
                    unit: product.unit,
                    batch_number: batch.batch_number,
                    expiry_date: batch.expiry_date,
                    quantity: 1,
                    unit_price: batch.selling_price,
                    subtotal: batch.selling_price,
                },
            ]);
        }
    };

    const increaseQty = (batchId: string) => {
        setCart((prev) =>
            prev.map((item) =>
                item.batch_id === batchId
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                          subtotal: (item.quantity + 1) * item.unit_price,
                      }
                    : item,
            ),
        );
    };

    const decreaseQty = (batchId: string) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.batch_id === batchId
                        ? {
                              ...item,
                              quantity: item.quantity - 1,
                              subtotal: (item.quantity - 1) * item.unit_price,
                          }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    const removeItem = (batchId: string) => {
        setCart((prev) => prev.filter((item) => item.batch_id !== batchId));
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setAmountPaid(0);
        setPaymentMethod('cash');
    };

    // ── Totals ────────────────────────────────────────────────────────────────

    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const total = Math.max(subtotal - discount, 0);
    const change = Math.max(amountPaid - total, 0);

    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <DashboardInnerLayout>
            {/* relative container gives us local context for positioning our fixed/absolute elements */}
            <div className="relative flex h-full flex-col gap-4">
                {/* ── 100% WIDTH SEARCH & PRODUCTS CARD ───────────────────── */}
                <Card className="flex flex-1 flex-col shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-3">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-xl pl-9"
                                autoFocus
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-2 overflow-y-auto">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Search className="mb-2 h-8 w-8 text-muted-foreground/40" />
                                <p className="text-sm text-muted-foreground">
                                    No products found for "{search}"
                                </p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onAdd={addToCart}
                                />
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* ── FLOATING ACTION CART TRIGGER & SHEET OVERLAY ─────────── */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            size="lg"
                            className="fixed right-6 bottom-6 z-40 h-14 w-14 rounded-full p-0 shadow-lg transition-transform hover:scale-105 active:scale-95"
                        >
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6" />
                                {totalItemsCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-3 -right-3 flex h-5 min-w-5 justify-center rounded-full px-1 text-[10px] font-bold shadow-sm"
                                    >
                                        {totalItemsCount}
                                    </Badge>
                                )}
                            </div>
                        </Button>
                    </SheetTrigger>

                    <SheetContent className="flex w-full flex-col border-l border-border p-0 sm:max-w-md">
                        {/* Header padded to the right via pr-12 to safeguard the default X icon */}
                        <SheetHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 border-b border-border p-4 pr-12">
                            <SheetTitle className="flex items-center gap-2 text-base font-semibold">
                                <ShoppingCart className="h-4 w-4" />
                                Cart Items
                            </SheetTitle>
                            {cart.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearCart}
                                    className="h-8 rounded-lg text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    Clear
                                </Button>
                            )}
                        </SheetHeader>

                        {/* Unified layout view - entirely scrollable context */}
                        <div className="flex-1 space-y-6 overflow-y-auto p-4">
                            {cart.length === 0 ? (
                                <div className="flex h-64 flex-col items-center justify-center text-center">
                                    <ShoppingCart className="mb-2 h-8 w-8 text-muted-foreground/30" />
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Cart is empty
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Select products to begin checkout
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Cart Rows Container */}
                                    <div className="space-y-2">
                                        {cart.map((item) => (
                                            <CartRow
                                                key={item.batch_id}
                                                item={item}
                                                onIncrease={increaseQty}
                                                onDecrease={decreaseQty}
                                                onRemove={removeItem}
                                            />
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Invoice Totals Calculation */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-foreground">
                                                {CURRENCY_SYMBOL}{' '}
                                                {subtotal.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground">
                                                Discount
                                            </span>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={subtotal}
                                                value={discount || ''}
                                                onChange={(e) =>
                                                    setDiscount(
                                                        Math.min(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                            subtotal,
                                                        ),
                                                    )
                                                }
                                                placeholder="0"
                                                className="h-8 w-28 rounded-lg text-right text-xs"
                                            />
                                        </div>

                                        <Separator className="my-1" />

                                        <div className="flex justify-between text-base font-bold text-foreground">
                                            <span>Total</span>
                                            <span>
                                                {CURRENCY_SYMBOL}{' '}
                                                {total.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Payment Tendering System Fields */}
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground">
                                                Payment Method
                                            </label>
                                            <Select
                                                value={paymentMethod}
                                                onValueChange={(val) =>
                                                    setPaymentMethod(
                                                        val as PaymentMethod,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="rounded-xl text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cash">
                                                        Cash
                                                    </SelectItem>
                                                    <SelectItem value="card">
                                                        Card
                                                    </SelectItem>
                                                    <SelectItem value="mobile">
                                                        Mobile Money
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {paymentMethod === 'cash' && (
                                            <div className="space-y-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-muted-foreground">
                                                        Amount Paid
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min={total}
                                                        value={amountPaid || ''}
                                                        onChange={(e) =>
                                                            setAmountPaid(
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        placeholder={`Min ${CURRENCY_SYMBOL} ${total.toLocaleString()}`}
                                                        className="rounded-xl text-xs"
                                                    />
                                                </div>
                                                {amountPaid >= total &&
                                                    amountPaid > 0 && (
                                                        <div className="flex justify-between rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
                                                            <span>
                                                                Change Due
                                                            </span>
                                                            <span>
                                                                {
                                                                    CURRENCY_SYMBOL
                                                                }{' '}
                                                                {change.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Transaction Finalization Action Button */}
                                    <Button
                                        className="h-11 w-full gap-2 rounded-xl pt-1 font-semibold"
                                        disabled={
                                            cart.length === 0 ||
                                            (paymentMethod === 'cash' &&
                                                amountPaid < total)
                                        }
                                        onClick={() => {
                                            console.log({
                                                cart,
                                                total,
                                                discount,
                                                amount_paid: amountPaid,
                                                change,
                                                payment_method: paymentMethod,
                                            });
                                            setIsSheetOpen(false);
                                        }}
                                    >
                                        <Receipt className="h-4 w-4" />
                                        Complete Sale
                                    </Button>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </DashboardInnerLayout>
    );
};

export default NewSalePOS;

NewSalePOS.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '#' },
        { title: 'New Sale', href: '#' },
    ],
};
