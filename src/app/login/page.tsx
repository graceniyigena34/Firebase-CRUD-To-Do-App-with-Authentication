"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500">
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-lg">Sign in to your account</p>
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={login} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border-2 border-gray-200 p-3 w-full rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🔒 Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border-2 border-gray-200 p-3 w-full rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              required
            />
          </div>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-4 w-full rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all shadow-lg">
            🚀 Sign In
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold hover:underline">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
