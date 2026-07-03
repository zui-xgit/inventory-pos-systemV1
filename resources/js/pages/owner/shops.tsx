import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    MapPin,
    Phone,
    MailIcon,
    Search,
    Store,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';
import RegisterBranch from '@/components/dialogs/register-branch';
import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';
import owner from '@/routes/owner';
import RefreshButton from '@/components/refresh-button';
import SearchInput from '@/components/search-input';

interface Shop {
    uuid: string;
    name: string;
    location: string;
    address: string | null;
    phone: string | null;
    is_active: boolean;
    created_at: string;
}

interface ShopsProps {
    shops: Shop[];
    filters: {
        search?: string;
    };
}

export default function Shops({ shops, filters }: ShopsProps) {
    return (
        <>
            <Head title="Pharmacy Branches" />
            <DashboardInnerLayout>
                {/* Dashboard Header section inside AppLayout */}
                <div className="flex flex-col gap-4 border-b border-border/40 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Pharmacy Branches"
                        description="Manage and select pharmacy locations under your organization."
                    />
                    <RegisterBranch />
                </div>

                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                    <div className="flex w-full items-center space-x-2">
                        <SearchInput
                            href={owner.shops()}
                            filters={filters}
                            placeholder={
                                'Search by name or location...  (Live search)'
                            }
                        />
                        <RefreshButton href={owner.shops()} />
                    </div>
                </div>

                {shops.length < 1 ? (
                    <>
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <Store className="h-6 w-6" />
                            </div>
                            <h3 className="font-s emibold mt-4 text-sm text-foreground">
                                No shops found
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                There is no shop branch yet.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {shops.map((shop, index) => (
                                <Card
                                    key={index}
                                    className="group flex flex-col justify-between transition-all duration-300 hover:border-primary/60 hover:shadow-lg"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-1">
                                                <CardTitle className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                                                    {shop.name}
                                                </CardTitle>
                                                <Badge
                                                    variant="secondary"
                                                    className="px-2 py-0 font-mono text-[10px] tracking-wide uppercase"
                                                >
                                                    shop prefix
                                                </Badge>
                                            </div>
                                            <span className="flex shrink-0 items-center gap-1.5 rounded border border-emerald-500/10 bg-emerald-500/5 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                {shop.is_active === true
                                                    ? 'active'
                                                    : 'not_active'}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3 pb-3">
                                        <div className="space-y-2 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                <span className="truncate">
                                                    {shop.location}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MailIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                <span>{shop.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                <span>{shop.phone}</span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-2">
                                        <Button className="w-full items-center justify-between rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90">
                                            <span>Manage Outlet</span>
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </DashboardInnerLayout>
        </>
    );
}

Shops.layout = {
    breadcrumbs: [
        {
            title: 'Shops',
            href: '/owner/shop-select-or-create',
        },
    ],
};
