
import { useState } from "react";
import AuthModel from "./components/AuthModel";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
      >
        Login / Sign Up
      </button>

      <AuthModel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </main>
  );
}
