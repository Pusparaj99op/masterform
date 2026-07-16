"use client";
import { useState } from "react";
import { User, Bell, Shield, Trash2, Loader2 } from "lucide-react";

interface Profile {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  twitterHandle: string | null;
  websiteUrl: string | null;
}

interface SettingsClientProps {
  initialProfile: Profile;
  userId: string;
}

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "danger", label: "Danger Zone", icon: Trash2 },
];

export default function SettingsClient({ initialProfile, userId }: SettingsClientProps) {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  async function saveProfile() {
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSavedMsg("Profile saved!");
    setTimeout(() => setSavedMsg(""), 2500);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        Settings
      </h1>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors"
                style={{
                  background: tab === id ? "var(--bg-elevated)" : "transparent",
                  color: tab === id ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: tab === id ? 500 : 400,
                }}
              >
                <Icon size={15} className="flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === "profile" && (
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Profile
              </h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold"
                  style={{
                    background: profile.avatarUrl
                      ? `url(${profile.avatarUrl}) center/cover`
                      : "var(--bg-elevated)",
                    border: "2px solid var(--bg-border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {!profile.avatarUrl && (profile.name?.[0]?.toUpperCase() ?? "?")}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                    Profile Photo
                  </p>
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                    Managed by Clerk — update in your account settings.
                  </p>
                </div>
              </div>

              {/* Fields */}
              {[
                { key: "name", label: "Display Name", type: "text", placeholder: "Your name" },
                { key: "bio", label: "Bio", type: "textarea", placeholder: "Tell attendees about yourself..." },
                { key: "twitterHandle", label: "Twitter / X Handle", type: "text", placeholder: "@yourhandle" },
                { key: "websiteUrl", label: "Website", type: "url", placeholder: "https://yourwebsite.com" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      className="input-base"
                      placeholder={field.placeholder}
                      value={(profile[field.key as keyof Profile] as string) ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className="input-base"
                      placeholder={field.placeholder}
                      value={(profile[field.key as keyof Profile] as string) ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center gap-3 pt-2">
                <button onClick={saveProfile} disabled={saving} className="btn btn-primary">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Save Profile"}
                </button>
                {savedMsg && (
                  <span className="text-sm" style={{ color: "var(--accent-success)" }}>
                    {savedMsg}
                  </span>
                )}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="card p-6">
              <h2 className="font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
                Email Notifications
              </h2>
              <div className="space-y-4">
                {[
                  { label: "New registration", desc: "Get notified when someone registers for your event" },
                  { label: "Event reminders", desc: "Receive reminders 24h before your events" },
                  { label: "Payment received", desc: "Get notified when a ticket is purchased" },
                  { label: "Product updates", desc: "News and announcements from EventFlow" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {item.label}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {item.desc}
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[var(--accent-primary)] w-4 h-4" />
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-6">Save Preferences</button>
            </div>
          )}

          {tab === "security" && (
            <div className="card p-6">
              <h2 className="font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
                Security
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Your account is secured by Clerk. Manage passwords, two-factor authentication, and connected
                social accounts from Clerk&apos;s user portal.
              </p>
              <a
                href="https://accounts.clerk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Manage Security Settings →
              </a>
            </div>
          )}

          {tab === "danger" && (
            <div className="card p-6" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
              <h2 className="font-semibold mb-2" style={{ color: "var(--accent-danger)" }}>
                Danger Zone
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Actions here are irreversible. Please be certain before proceeding.
              </p>
              <div
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <div>
                  <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                    Delete Account
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Permanently delete your account and all events
                  </p>
                </div>
                <button className="btn btn-danger btn-sm">Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
