import React, { ReactNode } from 'react';

interface DashboardInnerLayoutProps {
    children: ReactNode;
}

const DashboardInnerLayout = ({ children }: DashboardInnerLayoutProps) => {
    return (
        <main className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 md:p-6">
            {children}
        </main>
    );
};

export default DashboardInnerLayout;
