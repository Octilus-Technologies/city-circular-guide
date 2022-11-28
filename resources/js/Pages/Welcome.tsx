import InitialRouteQueryForm from "@/Components/forms/InitialRouteQueryForm";
import WelcomeLayout from "@/Layouts/WelcomeLayout";
import { Head } from "@inertiajs/inertia-react";
import React from "react";

export default function Welcome({ mapAccessToken }) {
    return (
        <>
            <Head title="Welcome" />

            <WelcomeLayout>
                <InitialRouteQueryForm accessToken={mapAccessToken} />
            </WelcomeLayout>
        </>
    );
}
