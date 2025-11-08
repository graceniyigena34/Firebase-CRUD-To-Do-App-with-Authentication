"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("testuser@gmail.com");
  const [password, setPassword] = useState("test1234");
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/");
  };

  return (
    <div className="p-6">
      <h1>Login</h1>
      <form onSubmit={login}>
        <input value={email} onChange={e => setEmail(e.target.value)} className="border p-2 mr-2" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 mr-2" />
        <button className="bg-green-600 text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
}
