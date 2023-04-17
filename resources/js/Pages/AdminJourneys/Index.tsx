import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/inertia-react";
import React from "react";


type UserIndexProps = {
    journeys: Paginated<JourneyDTO>;
} & CommonPageProps;

function Index(props: UserIndexProps) {
    const { journeys } = props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Journeys
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="card mt-3 bg-base-100 shadow">
                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <table className="table-zebra -table-compact table w-full">
                                    <thead>
                                        <tr>
                                            <th>UUID</th>
                                            <th>Time</th>
                                            <th>From</th>
                                            <th>To</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {journeys.data.map((journey) => (
                                            <tr key={journey.uuid}>
                                                <td>
                                                    <small>
                                                        {journey.uuid}
                                                    </small>
                                                </td>
                                                <td>
                                                    <small>
                                                        {journey.time_ago}
                                                    </small>
                                                </td>
                                                <td className="w-[300px] !whitespace-pre-wrap">
                                                    <small>
                                                        {journey.from.name}
                                                    </small>
                                                </td>
                                                <td className="w-[300px] !whitespace-pre-wrap">
                                                    <small>
                                                        {
                                                            journey.destination
                                                                .name
                                                        }
                                                    </small>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination-container mt-5 flex w-full items-center justify-center">
                                <Pagination
                                    links={journeys.links}
                                    meta={journeys.meta}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;