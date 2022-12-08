import { Link } from "@inertiajs/inertia-react";
import React from "react";

function SmallHeader() {
    return (
        <header>
            <nav className="mx-1 mb-3">
                <Link href="/" className="flex items-center gap-2">
                    <div className="icon inline-block h-[36px] w-[36px] rounded-full bg-secondary"></div>
                    <div className="name flex flex-col items-start font-bold">
                        <h1 className="text-xl capitalize text-primary-content">
                            City Circular Project
                        </h1>
                        <span className="-mt-1 capitalize text-secondary">
                            Trivandrum
                        </span>
                    </div>
                </Link>
            </nav>
        </header>
    );
}

export default SmallHeader;
