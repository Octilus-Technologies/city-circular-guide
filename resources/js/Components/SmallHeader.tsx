import AppIcon from "@/Components/AppIcon";
import { InertiaLinkProps, Link, usePage } from "@inertiajs/react";
import React, { ReactNode } from "react";

type NavLinkProps = {
    href: string;
    children: ReactNode;
    forceDark?: boolean;
} & InertiaLinkProps;

const NavLink = ({
    href,
    children,
    forceDark = false,
    ...props
}: NavLinkProps) => {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link
            href={href}
            className={
                isActive
                    ? "text-secondary"
                    : "opacity-60 transition-all duration-100 hover:opacity-90"
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

function SmallHeader({ forceDark = false }: { forceDark?: boolean }) {
    return (
        <div className={`${forceDark ? "" : "shadow-sm"}`}>
            <div className="container m-auto max-w-7xl">
                <header className="hidden min-w-[35vw] pt-2 pb-1 md:block">
                    <nav
                        className={`mx-1 mb-2 flex items-center justify-between gap-6 ${forceDark ? "text-white" : ""
                            }`}
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <AppIcon forceDark={forceDark} />
                        </Link>

                        <ul className="flex gap-3 text-sm font-bold">
                            <li>
                                <NavLink href="/faq" forceDark={forceDark}>
                                    FAQ
                                </NavLink>
                            </li>

                            <li>
                                <NavLink href="/contact" forceDark={forceDark}>
                                    Contact
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
        </div>
    );
}

export default SmallHeader;
