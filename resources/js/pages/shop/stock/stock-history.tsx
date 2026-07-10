import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';

const PurchasesHistory = () => {
    return (
        <DashboardInnerLayout>
            <h1>Purchases History</h1>
        </DashboardInnerLayout>
    );
};

export default PurchasesHistory;

PurchasesHistory.layout = {
    breadcrumbs: [
        {
            title: 'Purchases History',
            href: '#',
        },
    ],
};
