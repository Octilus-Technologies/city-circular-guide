import { Link } from '@inertiajs/react';
import React from 'react';

function Stat({
    icon,
    link,
    title,
    children,
    actions,
}: {
    icon?: React.ReactNode;
    link?: string;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}) {
    return (
        <Link href={link ?? '#'} className="stat">
            {!!icon &&
                <div className="stat-figure text-secondary hidden sm:block">
                    {icon}
                </div>
            }

            <div className="stat-title">{title}</div>

            <div className="stat-value py-2">
                {children}
            </div>

            {!!actions &&
                <div className="stat-actions">
                    {actions}
                </div>
            }
        </Link>
    );
}

export default Stat;