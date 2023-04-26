import Chart from "@/Components/Chart";
import Card from "@/Components/ui/Card";
import Stat from "@/Components/ui/Stat";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { TbMessages } from "react-icons/tb";
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

            <div className="py-2 sm:py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="stats mt-3 w-full rounded-none shadow sm:rounded-2xl">
                        <Stat
                            link={route("admin.journeys.index")}
                            icon={<FaMapMarkerAlt className="inline-block text-3xl opacity-90" />}
                            title={"Journeys"}
                        >
                            {props.journeyCount}
                        </Stat>

                        <Stat
                            link={route("admin.feedbacks.index")}
                            icon={<TbMessages className="inline-block text-3xl opacity-90" />}
                            title={"Feedbacks"}
                        >
                            {props.feedbackCount}
                        </Stat>

                        <Stat
                            link={route("admin.users.index")}
                            icon={<FiUsers className="inline-block text-3xl opacity-90" />}
                            title={"Users"}
                        >
                            {props.userCount}
                        </Stat>
                    </div>

                    {!!props?.journeysChart && (
                        <Card>
                            <div className="overflow-hidden">
                                <Chart data={props.journeysChart} />
                            </div>
                        </Card>
                    )}

                    {!!props?.usersChart && (
                        <Card>
                            <div className="overflow-hidden">
                                <Chart data={props.usersChart} />
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
