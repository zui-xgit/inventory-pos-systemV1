import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

interface Sale {
    id: string;
    receipt_number: string;
    cashier_name: string;
    items_count: number;
    total_amount: string;
    payment_method: 'cash' | 'card' | 'mobile';
    time: string;
}

interface RecentSalesProps {
    sales: Sale[];
    currencySymbol: string;
}

const paymentBadgeVariant = (method: Sale['payment_method']) => {
    if (method === 'cash') return 'secondary';
    if (method === 'card') return 'outline';
    return 'default';
};

const RecentSales = ({ sales, currencySymbol }: RecentSalesProps) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                    Recent Sales
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 text-xs">
                                Receipt
                            </TableHead>
                            <TableHead className="text-xs">Cashier</TableHead>
                            <TableHead className="text-xs">Items</TableHead>
                            <TableHead className="text-xs">Payment</TableHead>
                            <TableHead className="text-xs">Time</TableHead>
                            <TableHead className="pr-6 text-right text-xs">
                                Amount
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sales.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-8 text-center text-sm text-muted-foreground"
                                >
                                    No sales recorded today.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="pl-6 font-mono text-xs font-medium">
                                        {sale.receipt_number}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {sale.cashier_name}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {sale.items_count}{' '}
                                        {sale.items_count === 1
                                            ? 'item'
                                            : 'items'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={paymentBadgeVariant(
                                                sale.payment_method,
                                            )}
                                            className="text-[10px] capitalize"
                                        >
                                            {sale.payment_method}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {sale.time}
                                    </TableCell>
                                    <TableCell className="pr-6 text-right text-xs font-semibold">
                                        {currencySymbol} {sale.total_amount}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default RecentSales;
