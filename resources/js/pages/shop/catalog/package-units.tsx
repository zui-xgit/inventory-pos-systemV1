import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';

const PackageUnits = () => {
    return <DashboardInnerLayout>PACKAGE UNITS</DashboardInnerLayout>;
};

export default PackageUnits;

PackageUnits.layout = {
    breadcrumbs: [
        {
            title: 'Package Units',
            href: '#',
        },
    ],
};
