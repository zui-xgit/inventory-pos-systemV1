import type { InertiaLinkProps } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
    href: NonNullable<InertiaLinkProps['href']>;
    className?: string;
}

const RefreshButton = ({ href, className }: RefreshButtonProps) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        // setIsRefreshing(true);

        // We visit the base route without any 'filters' or 'search' data
        router.get(
            href,
            {},
            {
                replace: true,
                preserveState: false, // This is key: it wipes the React state
                preserveScroll: false,
                onStart: () => setIsRefreshing(true),
                onFinish: () => setIsRefreshing(false),
            },
        );
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn('h-9 w-9 cursor-pointer', className)}
            title="Reset Filters"
        >
            <RotateCw
                className={cn(
                    'h-4 w-4 text-muted-foreground',
                    isRefreshing && 'animate-spin', // Professional touch: spins while loading
                )}
            />
        </Button>
    );
};

export default RefreshButton;
