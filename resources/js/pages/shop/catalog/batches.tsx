import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';

const Batches = () => {
    return <DashboardInnerLayout>BATCHES</DashboardInnerLayout>;
};

export default Batches;

Batches.layout = {
    breadcrumbs: [
        {
            title: 'Batches',
            href: '#',
        },
    ],
};
