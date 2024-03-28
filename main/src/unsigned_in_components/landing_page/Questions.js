import React, {useState} from 'react'
import Question from './Question'

const questionCollection = [
    {
        question: "Hello?",
        answer: "Yes I agree"
    },
    {
        question: "Hello?",
        answer: "Yes I agree"
    },
    {
        question: "Hello?",
        answer: "Yes I agree"
    },
    {
        question: "Hello?",
        answer: "Yes I agree"
    }
]

const Questions = () => {
    return(
        <section id="faqs">
            <div class=" mt-10 ">
                <div class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
                    <div class="max-w-3xl mx-auto divide-y-2 divide-gray-200">
                        <h2 class="text-center text-3xl font-bold text-slate-900 sm:text-4xl pb-8">Frequently Asked Questions</h2>
                        <Question question="What is your reselling service and how can it help me?" answer="Our reselling service is a comprehensive platform designed to help sellers automate their daily tasks, gain access to real-time sales data and analytics, and ultimately boost their revenue. Our platform allows you to manage your inventory, process orders, and track shipments in one place, so you can focus on growing your business."/>
                        <Question question="Can I integrate your reselling service with my existing e-commerce store?" answer="Yes, you can easily integrate our reselling service with your existing e-commerce store. Our platform is compatible with all major e-commerce platforms, including Shopify, Amazon, and eBay. Once integrated, you can manage all of your sales channels from a single dashboard, streamlining your operations and improving your efficiency."/>
                        <Question question="How will your reselling service help me to increase my revenue?" answer="Our reselling service offers a variety of tools and features that can help you increase your revenue. For example, our analytics dashboard provides real-time insights into your sales data, allowing you to identify trends and opportunities for growth. We also offer automated repricing tools that can help you stay competitive and win the Buy Box on Amazon, increasing your visibility and driving more sales."/>
                        <Question question="What level of support do you offer for your reselling service?" answer="We offer a range of support options to ensure that you have the assistance you need when you need it. Our customer support team is available via email, phone, and live chat to answer any questions or concerns you may have. We also provide a robust knowledge base and a community forum where you can connect with other sellers and share tips and advice."/>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Questions