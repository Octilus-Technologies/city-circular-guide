import { Link, usePage } from "@inertiajs/inertia-react";
import React, { ReactNode } from "react";
import AppIcon from "./AppIcon";

const NavLink = ({
    href,
    children,
    ...props
}: {
    href: string;
    children: ReactNode;
} & Record<string, any>) => {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link
            href={href}
            className={
                isActive
                    ? "text-primary-content"
                    : "transition-all duration-100 hover:brightness-125"
            }
            {...props}
        >
            {children}
            {isActive && (
                <span className="mx-auto block h-[2px] w-[50%] rounded-lg bg-secondary ">
                    <span className="sr-only">(current)</span>
                </span>
            )}
        </Link>
    );
};

function SmallHeader() {
    return (
        <header className="hidden min-w-[35vw] md:block">
            <nav className="mx-1 mb-2 flex items-center justify-between gap-6">
                <Link href="/" className="flex items-center gap-2">
                    <AppIcon />
                </Link>

                <ul className="flex gap-3 text-sm font-bold">
                    <li>
                        <NavLink href="/journey">Journey</NavLink>
                    </li>
                    <li>
                        <NavLink href="/faq">FAQ</NavLink>
                    </li>
                    <li>
                        <NavLink href="/contact">Contact</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default SmallHeader;
