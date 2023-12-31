import { Link } from "@inertiajs/react";
import React, { ReactNode } from "react";

type NavLinkProps = {
    href: string;
    active: boolean;
    children: ReactNode;
};

export default function NavLink({ href, active, children }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={
                active
                    ? "inline-flex items-center border-b-2 border-indigo-400 px-1 pt-1 text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-indigo-700 focus:outline-none"
                    : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
            }
        >
            {children}
        </Link>
    );
}
