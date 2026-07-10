import { InertiaLinkProps, Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

interface ChildrenLinks {
    href: NonNullable<InertiaLinkProps['href']>;
}

export function NavMain({
    groupLabel,
    items = [],
    childrenLinks,
}: {
    groupLabel?: string;
    items: NavItem[];
    childrenLinks?: ChildrenLinks[];
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item, index) => {
                    let isActive = isCurrentUrl(item.href);

                    if (
                        !isActive &&
                        childrenLinks &&
                        childrenLinks.length > 0
                    ) {
                        isActive = childrenLinks.some((child) =>
                            isCurrentUrl(child.href),
                        );
                    }
                    return (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span className="text-sm">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
