import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "bg-[var(--bg-surface)] border border-[var(--bg-border)] shadow-none rounded-2xl",
          headerTitle: "text-[var(--text-primary)] font-semibold",
          headerSubtitle: "text-[var(--text-secondary)]",
          socialButtonsBlockButton:
            "bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors rounded-xl",
          socialButtonsBlockButtonText: "text-[var(--text-primary)] font-medium",
          dividerLine: "bg-[var(--bg-border)]",
          dividerText: "text-[var(--text-muted)]",
          formFieldLabel: "text-[var(--text-secondary)] text-sm",
          formFieldInput: "input-base",
          formButtonPrimary:
            "btn btn-primary w-full justify-center text-base py-3 rounded-xl mt-1",
          footerActionLink: "text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]",
          footerActionText: "text-[var(--text-muted)]",
          alertText: "text-[var(--accent-danger)]",
          alertIcon: "text-[var(--accent-danger)]",
          otpCodeFieldInput:
            "bg-[var(--bg-muted)] border-[var(--bg-border)] text-[var(--text-primary)] rounded-lg",
        },
      }}
    />
  );
}
