import { Mail, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <span className="font-bold text-lg text-gray-900">Interviewer.io</span>
          <p className="text-sm text-gray-500 mt-1">Empowering engineers to reach their potential.</p>
        </div>
        <div className="flex gap-4">
          <SocialIcon icon={<Mail className="w-5 h-5"/>} href="mailto:support@interviewer.io" />
          <SocialIcon icon={<Linkedin className="w-5 h-5"/>} href="#" />
          <SocialIcon icon={<Twitter className="w-5 h-5"/>} href="#" />
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: any) {
  return (
    <a href={href} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition">{icon}</a>
  )
}