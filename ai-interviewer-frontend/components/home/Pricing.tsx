"use client";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">For Recruiters</span>
          <h2 className="text-4xl font-black text-gray-900 mt-2">Simple, Transparent Pricing.</h2>
          
          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${billing === "monthly" ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
            <button 
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-8 bg-blue-100 rounded-full p-1 relative transition-colors"
            >
              <motion.div 
                layout 
                className="w-6 h-6 bg-blue-600 rounded-full shadow-md"
                animate={{ x: billing === "monthly" ? 0 : 24 }}
              />
            </button>
            <span className={`text-sm font-bold ${billing === "yearly" ? "text-gray-900" : "text-gray-500"}`}>Yearly <span className="text-green-600 text-xs">(Save 20%)</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard 
            tier="Starter" 
            price="Free" 
            desc="Perfect for trying out the platform." 
            features={["3 AI Interviews / month", "Basic Scorecards", "Standard Anti-Cheat"]}
            btn="Start for Free"
          />
          <PricingCard 
            tier="Growth" 
            price={billing === "monthly" ? "$49" : "$39"} 
            period="/mo"
            desc="For growing teams hiring consistently." 
            features={["50 AI Interviews / month", "Detailed Analytics", "Custom Question Bank", "ATS Integration"]}
            btn="Get Started"
            popular
          />
          <PricingCard 
            tier="Enterprise" 
            price="Custom" 
            desc="Volume hiring for large orgs." 
            features={["Unlimited Interviews", "Dedicated Account Manager", "API Access", "SSO & Audit Logs"]}
            btn="Contact Sales"
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier, price, period, desc, features, btn, popular }: any) {
  return (
    <div className={`p-8 rounded-3xl border flex flex-col transition-all duration-300 hover:-translate-y-2 ${popular ? 'border-blue-600 shadow-2xl bg-white relative' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-xl'}`}>
      {popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase shadow-md">Most Popular</div>}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{tier}</h3>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>
      <div className="mb-8 flex items-baseline">
        <span className="text-4xl font-black text-gray-900">{price}</span>
        {period && <span className="text-gray-500 ml-1">{period}</span>}
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold text-sm transition ${popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
        {btn}
      </button>
    </div>
  );
}