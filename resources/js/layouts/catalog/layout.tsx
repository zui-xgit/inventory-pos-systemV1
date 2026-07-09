import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';
import catalog from '@/routes/catalog';
import {
    Boxes,
    Layers,
    Package,
    Package2,
    Pill,
    Ruler,
    Truck,
} from 'lucide-react';

const sidebarNavItems = (shop_uuid: string): NavItem[] => [
    {
        title: 'Products',
        href: catalog.products({ shop: shop_uuid }),
        icon: Package,
    },
    {
        title: 'Batches',
        href: catalog.batches({ shop: shop_uuid }),
        icon: Layers,
    },
    {
        title: 'Dosage Forms',
        href: catalog.dosageForms({ shop: shop_uuid }),
        icon: Pill,
    },
    {
        title: 'Package Units',
        href: catalog.packageUnits({ shop: shop_uuid }),
        icon: Package2,
    },
];

export default function CatalogLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    const { activeShop } = usePage<{
        activeShop: { uuid: string } | undefined;
    }>().props;

    return (
        <div className="px-4 py-6">
            <Heading title="Catalog" description="Manage your catalog items" />

            <div className="flex flex-col lg:flex-row lg:space-x-4">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Catalog"
                    >
                        {activeShop !== undefined && (
                            <>
                                {sidebarNavItems(activeShop.uuid).map(
                                    (item, index) => (
                                        <Button
                                            key={`${toUrl(item.href)}-${index}`}
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className={cn(
                                                'w-full justify-start',
                                                {
                                                    'bg-muted':
                                                        isCurrentOrParentUrl(
                                                            item.href,
                                                        ),
                                                },
                                            )}
                                        >
                                            <Link href={item.href}>
                                                {item.icon && (
                                                    <item.icon className="h-4 w-4" />
                                                )}
                                                {item.title}
                                            </Link>
                                        </Button>
                                    ),
                                )}
                            </>
                        )}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1">
                    <section className="space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
