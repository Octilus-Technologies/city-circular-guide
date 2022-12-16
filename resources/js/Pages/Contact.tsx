import BasicLayout from "@/Layouts/BasicLayout";
import React from "react";

function Contact() {
    return (
        <BasicLayout>
            <div className="bg-base flex min-h-screen items-center justify-start">
                <div className="mx-auto w-full max-w-lg">
                    <h1 className="text-4xl font-medium">Contact us</h1>
                    <p className="mt-3">
                        Email us at help@domain.com or message us here:
                    </p>

                    <form
                        action="https://api.web3forms.com/submit"
                        className="mt-10"
                    >
                        <input
                            type="hidden"
                            name="access_key"
                            value="YOUR_ACCESS_KEY_HERE"
                        />
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    name="name"
                                    className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                    placeholder=" "
                                />
                                <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                                    Your name
                                </label>
                            </div>
                            <div className="relative z-0">
                                <input
                                    type="text"
                                    name="email"
                                    className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                    placeholder=" "
                                />
                                <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                                    Your email
                                </label>
                            </div>
                            <div className="relative z-0 col-span-2">
                                <textarea
                                    name="message"
                                    rows={5}
                                    className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                    placeholder=" "
                                ></textarea>
                                <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
                                    Your message
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary btn mt-5">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </BasicLayout>
    );
}

export default Contact;