import React from "react";

function Card({ children, className, ...props }: JSX.IntrinsicElements["div"]) {
    return (
        <div className="card mt-3 rounded-none bg-base-100 shadow sm:rounded-2xl">
            <div className={`card-body ${className}`} {...props}>
                {children}
            </div>
        </div>
    );
}

export default Card;
