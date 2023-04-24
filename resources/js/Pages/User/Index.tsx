import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/inertia-react";
import React from "react";
import { HiTrash } from "react-icons/hi";

type UserIndexProps = {
    users: Paginated<UserDTO>;
} & CommonPageProps;

function Index(props: UserIndexProps) {
    const { users } = props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="card mt-3 bg-base-100 shadow">
                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <table className="table-zebra table w-full">
                                    <thead>
                                        <tr>
                                            <th className="!relative">Name</th>
                                            <th>Email Id</th>
                                            <th>Created At</th>
                                            <th>
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user, k) => {
                                            return (
                                                <tr key={k}>
                                                    <td>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="avatar">
                                                                <div className="mask mask-squircle h-12 w-12">
                                                                    <img
                                                                        src={user.avatar}
                                                                        alt={`${user.name} avatar`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold">
                                                                    {user.name}
                                                                </div>

                                                                {user.is_admin && (
                                                                    <span className="badge-warning badge badge-sm">
                                                                        Admin
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="flex gap-2">
                                                            {user.email}

                                                            {user.email_verified_at && (
                                                                <span className="text-success">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-6 w-6 flex-shrink-0 stroke-current"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="tooltip"
                                                            data-tip={new Date(
                                                                user.created_at
                                                            ).toDateString()}
                                                        >
                                                            {
                                                                user.created_at_diff
                                                            }
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {/* TODO: Add View Button */}

                                                        {/* TODO: Add Edit Button */}

                                                        <Link
                                                            onClick={(e) => {
                                                                if (
                                                                    !confirm(
                                                                        "Are you sure you want to delete this user?"
                                                                    )
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                            href={route(
                                                                "admin.users.destroy",
                                                                {
                                                                    user,
                                                                }
                                                            )}
                                                            method="delete"
                                                            as="button"
                                                            type="button"
                                                            className="btn-ghost btn-square btn"
                                                        >
                                                            <HiTrash className="w-5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination-container mt-5 flex w-full items-center justify-center">
                                <Pagination
                                    links={users.links}
                                    meta={users.meta}
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
