import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | EventFlow",
  description: "Sign in to your EventFlow account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-base"
          style={{ color: "var(--text-primary)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-primary)" }}
          >
            <Zap size={14} className="text-white" />
          </div>
          EventFlow
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
        By signing in, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-[var(--text-secondary)] transition-colors">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-[var(--text-secondary)] transition-colors">Privacy Policy</Link>.
      </div>
    </div>
  );
}
