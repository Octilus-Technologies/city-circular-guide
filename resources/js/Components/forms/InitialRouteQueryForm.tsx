import React from "react";

function InitialRouteQueryForm(props) {
    return (
        <form action="#">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">From</span>
                </label>
                <input
                    type="text"
                    placeholder="From location"
                    className="input-bordered input"
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">To</span>
                </label>
                <input
                    type="text"
                    placeholder="To location"
                    className="input-bordered input"
                />
            </div>
            <div className="form-control mt-6">
                <button className="btn-primary btn">Find best route</button>
            </div>
        </form>
    );
}

export default InitialRouteQueryForm;
