import { Page } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import React from "react";

const FlashAlerts = () => {
    const { props } = usePage<Page<CommonPageProps>>();
    const { flash } = props;

    return (
        <div className="flash-messages">
            {flash.message && (
                <div className="alert alert-info text-white shadow-md">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-6 w-6 flex-shrink-0 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>

                        <span>{flash.message}</span>
                    </div>
                </div>
            )}

            {flash.error && (
                <div className="alert alert-error text-white shadow-md">
                    <div>
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
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>

                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            {flash.success && (
                <div className="alert alert-success text-white shadow-md">
                    <div>
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

                        <span>{flash.success}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashAlerts;
