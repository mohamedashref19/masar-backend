/**
 * Navbar Component
 * Fixed top navigation bar with logo and navigation links
 */

import Button from "./Button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-[#f1f5f9]">Masar</span>
            <span className="text-2xl font-bold text-[#a3e635]">.</span>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#projects"
              className="text-[#94a3b8] hover:text-white transition-colors font-medium"
            >
              Projects
            </a>
            <a
              href="#freelancers"
              className="text-[#94a3b8] hover:text-white transition-colors font-medium"
            >
              Freelancers
            </a>
          </div>

          {/* Right Side: Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline">Login</Button>
            <Button variant="accent">Sign Up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
