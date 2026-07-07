import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    Store,
    UsersRound,
    Package,
    Settings,
    Activity,
    LayoutDashboard,
    ShoppingCart,
    Boxes,
    BarChart3,
    LogOut,
    User,
    BarChart4,
    Receipt,
    CalendarClock,
    Wallet,
    TrendingUp,
    PackageCheck,
    ClipboardCheck,
    ArrowLeftRight,
    History,
    Truck,
    Ruler,
    TriangleAlert,
    AlarmClock,
    AlertTriangle,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import owner from '@/routes/owner';
import NavSubMain from './nav-sub-main';
import { logout, shopOverview } from '@/routes';
import sales from '@/routes/sales';

// OWNER NAVITEMS
const Overview: NavItem[] = [
    {
        title: 'Shops',
        href: owner.shops(),
        icon: Store,
    },
];
const Management: NavItem[] = [
    {
        title: 'Staff',
        href: owner.staff(),
        icon: UsersRound,
    },
    {
        title: 'Activity Logs',
        href: '#',
        icon: Activity,
    },
];
const Account: NavItem[] = [
    {
        title: 'Profile',
        href: owner.staff(),
        icon: UsersRound,
    },
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
    },
];

// SHOP NAVITEMS

const ShopOverview = (shop_uuid: string): NavItem[] => [
    {
        title: 'Dashboard',
        href: shopOverview({ shop: shop_uuid }),
        icon: LayoutDashboard,
    },
];

const ShopSales = (shop_uuid: string): NavItem[] => [
    {
        title: 'New Sale / POS',
        href: sales.newSalePos({ shop: shop_uuid }),
        icon: ShoppingCart,
    },
    {
        title: 'Sales History',
        href: sales.history({ shop: shop_uuid }),
        icon: History,
    },
];

const ShopInventory: NavItem[] = [
    {
        title: 'Products',
        href: '#',
        icon: Package,
    },
    {
        title: 'Batches',
        href: '#',
        icon: Boxes,
    },
    {
        title: 'Suppliers',
        href: '#',
        icon: Truck,
    },
    {
        title: 'Units',
        href: '#',
        icon: Ruler,
    },
];

const ShopStock: NavItem[] = [
    {
        title: 'Stock Levels',
        href: '#',
        icon: PackageCheck,
    },
    {
        title: 'Stock Taking',
        href: '#',
        icon: ClipboardCheck,
    },
    {
        title: 'Stock Movements',
        href: '#',
        icon: ArrowLeftRight,
    },
];

// const ShopReports: NavItem[] = [
//     {
//         title: 'Sales Report',
//         href: '#',
//         icon: BarChart3,
//     },
//     {
//         title: 'Profit & Loss',
//         href: '#',
//         icon: TrendingUp,
//     },
//     {
//         title: 'Stock Valuation',
//         href: '#',
//         icon: Wallet,
//     },
//     {
//         title: 'Expiry Report',
//         href: '#',
//         icon: CalendarClock,
//     },
//     {
//         title: 'Purchase History',
//         href: '#',
//         icon: Receipt,
//     },
//     {
//         title: 'Fast/Slow Movers',
//         href: '#',
//         icon: BarChart4,
//     },
// ];

const ShopSalesReports: NavItem[] = [
    {
        title: 'Sales Report',
        href: '#',
        icon: BarChart3,
    },
    {
        title: 'Profit & Loss',
        href: '#',
        icon: TrendingUp,
    },
    {
        title: 'Purchase History',
        href: '#',
        icon: Receipt,
    },
];

const ShopInventoryReports: NavItem[] = [
    {
        title: 'Stock Valuation',
        href: '#',
        icon: Wallet,
    },
    {
        title: 'Expiry Report',
        href: '#',
        icon: CalendarClock,
    },
    {
        title: 'Fast/Slow Movers',
        href: '#',
        icon: BarChart4,
    },
];

const ShopAlerts: NavItem[] = [
    {
        title: 'Low Stock',
        href: '#',
        icon: TriangleAlert,
    },
    {
        title: 'Expiring Soon',
        href: '#',
        icon: AlarmClock,
    },
];

const ShopManagement: NavItem[] = [
    {
        title: 'Staff',
        href: owner.staff(),
        icon: UsersRound,
    },
    {
        title: 'Shop Settings',
        href: '#',
        icon: Store,
    },
];

const ShopAccount: NavItem[] = [
    {
        title: 'Profile',
        href: '#',
        icon: User,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { activeShop, auth } = usePage<{
        activeShop: { uuid: string } | undefined;
    }>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={owner.shops()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* OWNER */}
            {auth.user.isOwner && activeShop === undefined && (
                <SidebarContent>
                    <NavMain groupLabel={'Overview'} items={Overview} />
                    <NavMain groupLabel={'Management'} items={Management} />
                    <NavMain groupLabel={'Account'} items={Account} />

                    {/* collapsible navs */}
                    {/* <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <NavSubMain title="Parent" Icon={LogOut} items={Overview} />
                </SidebarGroup> */}
                </SidebarContent>
            )}

            {activeShop !== undefined && (
                <SidebarContent>
                    <NavMain
                        groupLabel={'Overview'}
                        items={ShopOverview(activeShop.uuid)}
                    />
                    <NavMain
                        groupLabel={'Sales'}
                        items={ShopSales(activeShop.uuid)}
                    />
                    {/* <NavMain groupLabel={'Inventory'} items={ShopInventory} /> */}
                    <SidebarGroup className="py-0">
                        <SidebarGroupLabel>Inventory</SidebarGroupLabel>
                        <NavSubMain
                            title="Shop Inventory"
                            Icon={Package}
                            items={ShopInventory}
                        />
                    </SidebarGroup>
                    {/* <NavMain groupLabel={'Stock'} items={ShopStock} /> */}
                    <SidebarGroup className="py-0">
                        <SidebarGroupLabel>Stock</SidebarGroupLabel>
                        <NavSubMain
                            title="Shop Stock"
                            Icon={Package}
                            items={ShopStock}
                        />
                    </SidebarGroup>

                    <SidebarGroup className="py-0">
                        <SidebarGroupLabel>Reports</SidebarGroupLabel>
                        <NavSubMain
                            title="Sales Report"
                            Icon={BarChart3}
                            items={ShopSalesReports}
                        />
                        <NavSubMain
                            title="Inventory Report"
                            Icon={Package}
                            items={ShopInventoryReports}
                        />
                    </SidebarGroup>
                    <SidebarGroup className="py-0">
                        <SidebarGroupLabel>Alerts</SidebarGroupLabel>
                        <NavSubMain
                            title="Shop Alerts"
                            Icon={AlertTriangle}
                            items={ShopAlerts}
                        />
                    </SidebarGroup>

                    <SidebarGroup className="py-0">
                        <SidebarGroupLabel>Management</SidebarGroupLabel>
                        <NavSubMain
                            title="Shop Management"
                            Icon={Settings}
                            items={ShopManagement}
                        />
                    </SidebarGroup>

                    <NavMain groupLabel={'Account'} items={ShopAccount} />
                </SidebarContent>
            )}

            {/* MANAGER */}
            {/* CASHIER */}

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
