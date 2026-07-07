import { TrendingUp, Store, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface BusinessStatsBarProps {
    totalShops: number;
    totalSalesToday: number;
    totalStaff: number;
    totalAlerts: number;
    currencySymbol: string;
}

const StatItem = ({
    icon: Icon,
    label,
    value,
    alert = false,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    alert?: boolean;
}) => (
    <div className="flex items-center gap-3">
        <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${alert ? 'bg-destructive/10' : 'bg-primary/10'}`}
        >
            <Icon
                className={`h-4 w-4 ${alert ? 'text-destructive' : 'text-primary'}`}
            />
        </div>
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p
                className={`text-sm font-bold ${alert ? 'text-destructive' : 'text-foreground'}`}
            >
                {value}
            </p>
        </div>
    </div>
);

const BusinessStatsBar = ({
    totalShops,
    totalSalesToday,
    totalStaff,
    totalAlerts,
    currencySymbol,
}: BusinessStatsBarProps) => {
    return (
        <Card className="transition-all duration-300 hover:border-primary/60 hover:shadow-lg">
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatItem
                    icon={Store}
                    label="Total Shops"
                    value={`${totalShops} Shops`}
                />
                <StatItem
                    icon={TrendingUp}
                    label="Revenue Today"
                    value={`${currencySymbol} ${totalSalesToday.toLocaleString()}`}
                />
                <StatItem
                    icon={Users}
                    label="Total Staff"
                    value={`${totalStaff} Active`}
                />
                <StatItem
                    icon={AlertTriangle}
                    label="Total Alerts"
                    value={`${totalAlerts} Alerts`}
                    alert={totalAlerts > 0}
                />
            </CardContent>
        </Card>
    );
};

export default BusinessStatsBar;
