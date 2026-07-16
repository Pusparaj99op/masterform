import Link from "next/link";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="border-t mt-20"
      style={{ borderColor: "var(--bg-border)", background: "var(--bg-base)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-primary)" }}
              >
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                EventFlow
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
              Host events, collect payments, and build community — with zero platform fees.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "https://twitter.com/eventflowapp", label: "Twitter" },
                { icon: Github, href: "https://github.com/eventflow", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/company/eventflow", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--bg-border)",
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
              Product
            </p>
            <ul className="space-y-3">
              {[
                { href: "/discover", label: "Discover Events" },
                { href: "/pricing", label: "Pricing" },
                { href: "/dashboard", label: "Dashboard" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
              Resources
            </p>
            <ul className="space-y-3">
              {[
                { href: "/docs", label: "Documentation" },
                { href: "/blog", label: "Blog" },
                { href: "/changelog", label: "Changelog" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
              Legal
            </p>
            <ul className="space-y-3">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/cookies", label: "Cookie Policy" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t gap-4"
          style={{ borderColor: "var(--bg-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} EventFlow. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            0% platform fees · Powered by Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}
