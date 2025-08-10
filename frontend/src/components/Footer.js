import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLeaf } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-700 to-emerald-600 text-white mt-10 font-semibold w-full overflow-hidden">
      {/* Top Section */}
      <div className="w-full px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaLeaf size={28} className="text-white" />
            <span className="text-2xl font-bold">Arvyax</span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed font-normal">
            Bringing peace, health, and mindfulness to your life with expert-guided wellness sessions.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-white/80 text-sm font-normal">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">My Sessions</li>
            <li className="hover:text-white transition cursor-pointer">Create Session</li>
            <li className="hover:text-white transition cursor-pointer">Contact Us</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">
            Resources
          </h3>
          <ul className="space-y-2 text-white/80 text-sm font-normal">
            <li className="hover:text-white transition cursor-pointer">Wellness Blog</li>
            <li className="hover:text-white transition cursor-pointer">Meditation Guides</li>
            <li className="hover:text-white transition cursor-pointer">Yoga Tutorials</li>
            <li className="hover:text-white transition cursor-pointer">FAQs</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">
            Subscribe
          </h3>
          <p className="text-sm text-white/80 mb-3 font-normal">
            Get the latest wellness tips and updates directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-full">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 min-w-0 px-3 py-2 rounded-lg text-black outline-none"
            />
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 w-full"></div>

      {/* Bottom Section */}
      <div className="w-full px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-white/80 font-medium">
        <p>© {new Date().getFullYear()} Arvyax Wellness.</p>
        <div className="flex gap-4 mt-3 sm:mt-0">
          <a
            href="https://www.facebook.com/profile.php?id=100041588465568&mibextid=qi2Omg&rdid=r41t2FYSBIcizn2h&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14yLkaTTBp%2F%3Fmibextid%3Dqi2Omg#"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            <FaFacebook size={18} />
          </a>
          <a
            href="https://www.instagram.com/_ig_azim/?igsh=MXcxbGNjZ2sxY3N1Nw%3D%3D#"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="https://x.com/Pirategamming24?t=qP-TM5I-jemGrTkPbyH3Vg&s=09"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            <FaTwitter size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
