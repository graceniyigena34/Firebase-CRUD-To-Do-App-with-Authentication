"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password);
    router.push("/login");
  };

  return (
    <div className="p-6">
      <h1>Register</h1>
      <form onSubmit={register}>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} className="border p-2 mr-2" />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="border p-2 mr-2" />
        <button className="bg-blue-500 text-white px-4 py-2">Register</button>
      </form>
      <Link href="/login">Login</Link>
    </div>
  );
}
