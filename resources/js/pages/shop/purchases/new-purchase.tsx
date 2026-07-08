import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';

const NewPurchase = () => {
    return (
        <DashboardInnerLayout>
            <h1>New Purchase </h1>
        </DashboardInnerLayout>
    );
};

export default NewPurchase;

NewPurchase.layout = {
    breadcrumbs: [
        {
            title: 'New Purchase',
            href: '#',
        },
    ],
};
