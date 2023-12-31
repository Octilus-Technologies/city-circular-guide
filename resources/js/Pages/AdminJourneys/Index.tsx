import Pagination from "@/Components/Pagination";
import Card from "@/Components/ui/Card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { HiOutlineEye } from "react-icons/hi";

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

            <div className="py-2 md:py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="table-zebra -table-compact table w-full">
                                <thead>
                                    <tr>
                                        <th>UUID</th>
                                        <th>Time</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Actions</th>
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

                                            <td>
                                                <a
                                                    href={route(
                                                        "journey",
                                                        journey.uuid
                                                    )}
                                                    target="_blank"
                                                    className="btn-ghost btn-square btn"
                                                >
                                                    <HiOutlineEye className="w-5" />
                                                </a>
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
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Index;
