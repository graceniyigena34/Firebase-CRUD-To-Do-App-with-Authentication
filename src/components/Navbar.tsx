"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold">
          Firebase To-Do
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-200">Home</Link>
          <Link href="/todos" className="hover:text-gray-200">Todos</Link>
          <button className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col space-y-3 text-center">
          <Link href="/" className="hover:text-gray-200">Home</Link>
          <Link href="/todos" className="hover:text-gray-200">Todos</Link>
          <button className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium mx-auto">
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
