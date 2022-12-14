import BasicLayout from "@/Layouts/BasicLayout";
import React from "react";

const faqData = [
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dignissimos. Neque eos, dignissimos provident reiciendis debitis repudiandae commodi perferendis et itaque, similique fugiat cumque impedit iusto vitae dolorum. Nostrum, fugit!",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dignissimos. Neque eos, dignissimos provident reiciendis debitis repudiandae commodi perferendis et itaque, similique fugiat cumque impedit iusto vitae dolorum. Nostrum, fugit!",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dignissimos. Neque eos, dignissimos provident reiciendis debitis repudiandae commodi perferendis et itaque, similique fugiat cumque impedit iusto vitae dolorum. Nostrum, fugit!",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dignissimos. Neque eos, dignissimos provident reiciendis debitis repudiandae commodi perferendis et itaque, similique fugiat cumque impedit iusto vitae dolorum. Nostrum, fugit!",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dignissimos. Neque eos, dignissimos provident reiciendis debitis repudiandae commodi perferendis et itaque, similique fugiat cumque impedit iusto vitae dolorum. Nostrum, fugit!",
    },
    {
        question: "Lorem ipsum dolor sit amet?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dignissimos. Neque eos, dignissimos provident reiciendis debitis repudiandae commodi perferendis et itaque, similique fugiat cumque impedit iusto vitae dolorum. Nostrum, fugit!",
    },
];

const Faq = ({ faq }: { faq: { question: string; answer: string } }) => {
    return (
        <div className="mt-4 flex">
            <div>
                <div className="flex h-16 items-center border-l-4 border-primary">
                    <span className="px-4 text-4xl text-primary">Q.</span>
                </div>
                <div className="flex h-16 items-center border-l-4 border-base-100">
                    <span className="text-content px-4 text-4xl">A.</span>
                </div>
            </div>
            <div>
                <div className="flex h-16 items-center">
                    <span className="text-lg font-bold text-primary">
                        {faq.question}
                    </span>
                </div>
                <div className="flex items-center py-2">
                    <span className="text-content">{faq.answer}</span>
                </div>
            </div>
        </div>
    );
};

function Faqs() {
    return (
        <BasicLayout>
            <div className="p-8">
                <div className="mt-5 rounded-lg bg-base-200 p-4 py-8 shadow-xl">
                    <h4 className="text-center text-4xl font-bold uppercase tracking-widest text-primary-content">
                        FAQ
                    </h4>
                    <p className="mt-2 text-center text-sm text-secondary-content">
                        Here are some of the frequently asked questions
                    </p>
                    <div className="mt-12 space-y-12 px-2 xl:px-16">
                        {faqData.map((faq, index) => (
                            <Faq key={index} faq={faq} />
                        ))}
                    </div>
                </div>
            </div>
        </BasicLayout>
    );
}

export default Faqs;
