import { Link } from "@inertiajs/inertia-react";
import React from "react";

type Props = {
    links: { url?: string; label: string; active?: boolean }[];
};

const Pagination = ({ links }: Props) => {
    return (
        <div className="btn-group">
            {links.map((link) => (
                <Link
                    key={link.label}
                    href={link.url ?? ""}
                    disabled={!link.url || link.active}
                    className="btn"
                >
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Link>
            ))}
        </div>
    );
};

export default Pagination;
