import Card from '@/Components/ui/Card';
import DumpResource from '@/Components/ui/DumpResource';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

type FeedbackShowProps = {
    user: {
        data: UserDTO;
    }
};

function Show({ user }: FeedbackShowProps) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {`Feedback #${user.data.id}`}
                </h2>
            }
        >
            <Head title={`Feedback #${user.data.id}`} />

            <div className="py-2 md:py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <DumpResource data={user.data} />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Show;