import { Link } from "@inertiajs/react";
import React from "react";

type Props = {
    links: LinkDTO[] | LinksSummaryDTO;
    meta?: LinkMetaDTO;
};

const Pagination = ({ links, meta }: Props) => {
    const { prev, next } = links as LinksSummaryDTO;

    return (
        <div className="btn-group">
            {!!meta && (<div className="btn-group">
                <Link href={prev ?? '#'} disabled={!prev} className="btn">
                    «
                </Link>
                <button className="btn">
                    Page {meta.current_page} of {meta.last_page}
                </button>
                <Link href={next ?? '#'} disabled={!next} className="btn">
                    »
                </Link>
            </div>)}

            {!!(links as [])?.length && ((links as LinkDTO[]).map((link) => (
                <Link
                    key={link.label}
                    href={link.url ?? ""}
                    disabled={!link.url || link.active}
                    className="btn"
                >
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Link>
            )))}
        </div>
    );
};

export default Pagination;
