import { Link } from "@inertiajs/inertia-react";
import React from "react";

type Props = {
    links: LinkDTO[];
} | {
    links: LinksSummaryDTO;
    meta: LinkMeta;
};

const Pagination = ({ links, meta }: Props) => {
    return (
        <div className="btn-group">
            {!meta ? links.map((link) => (
                <Link
                    key={link.label}
                    href={link.url ?? ""}
                    disabled={!link.url || link.active}
                    className="btn"
                >
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Link>
            )) :
                (<div className="btn-group">
                    <Link href={links.prev} disabled={!links.prev} className="btn">
                        «
                    </Link>
                    <button className="btn">
                        Page {meta.current_page} of {meta.last_page}
                    </button>
                    <Link href={links.next} disabled={!links.next} className="btn">
                        »
                    </Link>
                </div>)}


        </div>
    );
};

export default Pagination;
