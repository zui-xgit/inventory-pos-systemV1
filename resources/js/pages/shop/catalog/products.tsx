import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';

const Products = () => {
    return <DashboardInnerLayout>PRODUCTS</DashboardInnerLayout>;
};

export default Products;

Products.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: '#',
        },
    ],
};
