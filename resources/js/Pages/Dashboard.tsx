import Chart from "@/Components/Chart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import route from "ziggy-js";

type DashboardProps = {
    journeyCount: number;
    feedbackCount: number;
    userCount: number;
    usersChart?: ChartDTO;
    journeysChart?: ChartDTO;
} & CommonPageProps;

export default function Dashboard(props: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">
                                Welcome back {props.auth.user.name}!
                            </h2>
                        </div>
                    </div> */}

                    <div className="stats mt-3 w-full shadow">
                        <Link href={route('admin.journeys.index')} className="stat">
                            <div className="stat-title">Journeys</div>
                            <div className="stat-value">
                                {props.journeyCount}
                            </div>
                            <div className="stat-actions"></div>
                        </Link>
                        <Link href={route('admin.feedbacks.index')} className="stat">
                            <div className="stat-title">Feedbacks</div>
                            <div className="stat-value">
                                {props.feedbackCount}
                            </div>
                            <div className="stat-actions"></div>
                        </Link>
                        <Link href={route('admin.users.index')} className="stat">
                            <div className="stat-title">Users</div>
                            <div className="stat-value">{props.userCount}</div>
                            <div className="stat-actions"></div>
                        </Link>
                    </div>

                    {!!props?.journeysChart && <div className="card mt-3 bg-base-100 shadow">
                        <div className="card-body">
                            <div className="overflow-hidden">
                                <Chart data={props.journeysChart} />
                            </div>
                        </div>
                    </div>}

                    {!!props?.usersChart && <div className="card mt-3 bg-base-100 shadow">
                        <div className="card-body">
                            <div className="overflow-hidden">
                                <Chart data={props.usersChart} />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
