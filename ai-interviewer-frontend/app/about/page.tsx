"use client";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-black text-gray-900 mb-8">Our Mission is to <br/><span className="text-blue-600">Democratize Hiring.</span></h1>
        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
          We believe that talent is equally distributed, but opportunity is not. We are building the tools to find the best engineers, regardless of their background, pedigree, or anxiety levels.
        </p>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team" className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition duration-500" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Who We Are</h3>
                <h2 className="text-3xl font-bold mb-6">Engineers building for Engineers.</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    Founded by Chitrank Tak, Interviewer.io was born out of frustration. After sitting on both sides of the table—as a nervous candidate and an exhausted interviewer—we knew there had to be a better way.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    We combine state-of-the-art LLMs with rigorous psychometric testing standards to create an evaluation that is fair, consistent, and deeply technical.
                </p>
             </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}