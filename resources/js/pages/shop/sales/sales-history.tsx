import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';

const SalesHistory = () => {
    return <DashboardInnerLayout>test</DashboardInnerLayout>;
};

export default SalesHistory;

SalesHistory.layout = {
    breadcrumbs: [
        {
            title: 'Sales History',
            href: '#',
        },
    ],
};
