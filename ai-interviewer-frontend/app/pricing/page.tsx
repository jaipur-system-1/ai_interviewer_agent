"use client";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Pricing from "@/components/home/Pricing"; // Reuse your component!
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      <section className="pt-32 pb-10 px-6 text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-6">Simple, Transparent Pricing.</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Start for free, scale as you hire. No hidden implementation fees.
        </p>
      </section>

      {/* Reuse the Pricing Component */}
      <Pricing />

      {/* Comparison Table */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Compare Plans</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="py-4 px-6 text-gray-500 font-medium">Features</th>
                        <th className="py-4 px-6 font-bold">Starter</th>
                        <th className="py-4 px-6 font-bold text-blue-600">Growth</th>
                        <th className="py-4 px-6 font-bold">Enterprise</th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow label="AI Interviews" starter="3/mo" growth="50/mo" enterprise="Unlimited" />
                    <TableRow label="Anti-Cheat" starter={<Check className="w-4 h-4"/>} growth={<Check className="w-4 h-4"/>} enterprise={<Check className="w-4 h-4"/>} />
                    <TableRow label="Custom Questions" starter="-" growth={<Check className="w-4 h-4"/>} enterprise={<Check className="w-4 h-4"/>} />
                    <TableRow label="ATS Integration" starter="-" growth={<Check className="w-4 h-4"/>} enterprise={<Check className="w-4 h-4"/>} />
                    <TableRow label="API Access" starter="-" growth="-" enterprise={<Check className="w-4 h-4"/>} />
                </tbody>
            </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
                <FAQ question="Can I cancel anytime?" answer="Yes, we offer monthly billing with no long-term contracts for Starter and Growth plans." />
                <FAQ question="How accurate is the AI?" answer="Our models are fine-tuned on 10,000+ real engineering interviews and have a 94% alignment with human senior engineer ratings." />
                <FAQ question="Do you support System Design?" answer="Yes, our Enterprise plan includes a collaborative whiteboard environment where the AI can parse diagrams." />
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TableRow({ label, starter, growth, enterprise }: any) {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-4 px-6 text-gray-600">{label}</td>
            <td className="py-4 px-6">{starter}</td>
            <td className="py-4 px-6 font-medium bg-blue-50/50">{growth}</td>
            <td className="py-4 px-6">{enterprise}</td>
        </tr>
    )
}

function FAQ({ question, answer }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-lg mb-2">{question}</h3>
            <p className="text-gray-600">{answer}</p>
        </div>
    )
}