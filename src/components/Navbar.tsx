"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Firebase To-Do
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          {user && <Link href="/dashboard" className="hover:text-gray-200">Dashboard</Link>}
          {user ? (
            <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col space-y-3 text-center">
          {user && <Link href="/dashboard" className="hover:text-gray-200">Dashboard</Link>}
          {user ? (
            <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium mx-auto">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
