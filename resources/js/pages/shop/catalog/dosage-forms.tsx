import DashboardInnerLayout from '@/layouts/app/dashboard-inner-layout';

const DosageForms = () => {
    return <DashboardInnerLayout>DOSAGE FORMS</DashboardInnerLayout>;
};

export default DosageForms;

DosageForms.layout = {
    breadcrumbs: [
        {
            title: 'Dosage Forms',
            href: '#',
        },
    ],
};
