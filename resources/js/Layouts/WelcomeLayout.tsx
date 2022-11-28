import React from "react";

function WelcomeLayout({ children }) {
    return (
        <div className="hero relative min-h-screen bg-base-200">
            <div className="bg-container absolute flex w-full">
                <div className="image-wrapper relative top-0 left-0 h-[100vh] w-full lg:w-[75vw]">
                    <div className="overlay absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-black via-transparent to-black opacity-70"></div>
                    <div className="overlay absolute top-0 left-0 right-0 h-full bg-black opacity-90"></div>
                    <img
                        src="/images/city.png"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="image-wrapper relative top-0 left-0 hidden h-[100vh] lg:block lg:w-[25vw]">
                    <div className="overlay absolute top-0 left-0 right-0 h-full w-full bg-gradient-to-b from-black via-transparent to-black opacity-20"></div>
                    <img
                        src="/images/map.png"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold text-white opacity-90 lg:text-9xl">
                        Explore <span className="text-primary">Trivandrum</span>
                    </h1>
                    <p className="max-w-2xl py-6 text-xl text-white opacity-70">
                        Thiruvananthapuram City Circular. A unique hop-on
                        hop-off solution.
                    </p>
                </div>

                <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
                    <div className="card-body">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeLayout;
