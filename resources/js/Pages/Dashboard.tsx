import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/inertia-react";
import Pagination from "@/Components/Pagination";

export default function Dashboard(props: {
    errors: Record<string, string>;
    auth: {
        user: Record<string, string>;
    };
    journeyCount: number;
    feedbackCount: number;
    userCount: number;
    journeys: Paginated<JourneyDTO>;
}) {
    // console.log(props.journeys);
    
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">
                                Welcome back {props.auth.user.name}!
                            </h2>
                        </div>
                    </div>

                    <div className="stats mt-3 w-full shadow">
                        <div className="stat">
                            <div className="stat-title">Journeys</div>
                            <div className="stat-value">
                                {props.journeyCount}
                            </div>
                            <div className="stat-actions"></div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Feedbacks</div>
                            <div className="stat-value">
                                {props.feedbackCount}
                            </div>
                            <div className="stat-actions"></div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Users</div>
                            <div className="stat-value">{props.userCount}</div>
                            <div className="stat-actions"></div>
                        </div>
                    </div>

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
                                        {props.journeys.data.map((journey) => (
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
                                    links={props.journeys.links}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
