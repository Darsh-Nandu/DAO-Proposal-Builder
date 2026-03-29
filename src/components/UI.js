import React from "react";

/* Dark card wrapper */
export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-dao-surface border border-dao-border rounded-2xl p-6 card-hover ${className}`}
    >
      {children}
    </div>
  );
}

/* Section heading inside a card */
export function CardTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-5">
      <p className="font-mono text-dao-accent text-xs tracking-widest uppercase mb-1">
        {icon} {subtitle}
      </p>
      <h2 className="font-syne font-bold text-xl text-dao-text">{title}</h2>
    </div>
  );
}

/* Text input */
export function Input({ label, value, onChange, placeholder, disabled }) {
  return (
    <div className="mb-4">
      <label className="block font-mono text-xs text-dao-dim mb-1 uppercase tracking-widest">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-dao-bg border border-dao-border rounded-xl px-4 py-2.5 font-mono text-sm text-dao-text placeholder-dao-muted focus:outline-none focus:border-dao-accent transition-colors disabled:opacity-40"
      />
    </div>
  );
}

/* Textarea */
export function Textarea({ label, value, onChange, placeholder, disabled }) {
  return (
    <div className="mb-4">
      <label className="block font-mono text-xs text-dao-dim mb-1 uppercase tracking-widest">
        {label}
      </label>
      <textarea
        rows={4}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-dao-bg border border-dao-border rounded-xl px-4 py-2.5 font-mono text-sm text-dao-text placeholder-dao-muted focus:outline-none focus:border-dao-accent transition-colors resize-none disabled:opacity-40"
      />
    </div>
  );
}

/* Primary action button */
export function Btn({ onClick, disabled, loading, children, variant = "primary" }) {
  const base = "w-full font-syne font-semibold text-sm rounded-xl px-4 py-3 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-dao-accent hover:bg-violet-700 text-white glow-accent",
    cyan:    "bg-dao-accent2 hover:bg-cyan-600 text-dao-bg glow-cyan",
    danger:  "bg-red-600 hover:bg-red-700 text-white",
    ghost:   "border border-dao-border text-dao-dim hover:border-dao-accent hover:text-dao-text",
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${styles[variant]}`}>
      {loading ? "Processing…" : children}
    </button>
  );
}

/* Status / feedback bar */
export function StatusBar({ status }) {
  if (!status) return null;
  const isErr = status.type === "error";
  return (
    <div
      className={`mt-4 font-mono text-xs rounded-xl px-4 py-3 border ${
        isErr
          ? "bg-red-900/20 border-red-800 text-red-400"
          : "bg-green-900/20 border-green-800 text-green-400"
      }`}
    >
      {isErr ? "✗ " : "✓ "}
      {status.message}
    </div>
  );
}

/* Wallet gate — shown instead of form when not connected */
export function WalletGate({ onConnect }) {
  return (
    <div className="text-center py-8">
      <p className="font-mono text-dao-dim text-sm mb-4">
        Connect your Freighter wallet to continue.
      </p>
      <button
        onClick={onConnect}
        className="font-mono text-xs bg-dao-accent hover:bg-violet-700 text-white rounded-full px-5 py-2 transition-all glow-accent"
      >
        Connect Freighter
      </button>
    </div>
  );
}
