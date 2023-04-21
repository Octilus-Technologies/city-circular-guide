import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/inertia-react";
import React from "react";


type FeedbackIndexProps = {
    feedbacks: Paginated<FeedbackDTO>;
} & CommonPageProps;

function Index(props: FeedbackIndexProps) {
    const { feedbacks } = props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Feedbacks
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="card mt-3 bg-base-100 shadow">
                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th className="!relative">ID</th>
                                            <th>Created At</th>
                                            <th>Name</th>
                                            <th>Email Id</th>
                                            <th>Message</th>
                                            <th>
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feedbacks.data.map((feedback, k) => {
                                            return (
                                                <tr key={k}>
                                                    <td>
                                                        <small>
                                                            {feedback.id}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <small
                                                            className="tooltip"
                                                            data-tip={new Date(
                                                                feedback.created_at
                                                            ).toDateString()}
                                                        >
                                                            {feedback.created_at_diff}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <small>
                                                            {feedback.name}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <small>
                                                            {feedback.email}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <small className="!whitespace-pre-wrap">
                                                            {feedback.message}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {/* TODO: Add View Button */}

                                                        {/* TODO: Add Edit Button */}

                                                        {/* <Link
                                                            href={route("feedbacks.destroy", {
                                                                feedback,
                                                            })}
                                                            method="delete"
                                                            as="button"
                                                            type="button"
                                                            className="btn btn-square btn-ghost"
                                                        >
                                                            <HiTrash className="w-5" />
                                                        </Link> */}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination-container mt-5 flex w-full items-center justify-center">
                                <Pagination
                                    links={feedbacks.links}
                                    meta={feedbacks.meta}
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