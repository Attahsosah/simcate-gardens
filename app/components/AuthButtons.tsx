"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { status } = useSession();

  if (status === "loading") return null;

  if (status === "authenticated") {
    return (
      <button
        className="text-sm px-3 py-1 rounded border"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      className="text-sm px-3 py-1 rounded border"
      onClick={() => signIn()}
    >
      Sign in
    </button>
  );
}



