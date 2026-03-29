import React from "react";

export default function Navbar({ publicKey, connecting, onConnect, onDisconnect }) {
  const shortKey = publicKey
    ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`
    : null;

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-dao-border bg-dao-surface sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-dao-accent text-xl">⬡</span>
        <span className="font-syne font-bold text-dao-text text-base tracking-tight">
          DAO<span className="text-dao-accent">Builder</span>
        </span>
      </div>

      {/* Network pill */}
      <span className="hidden md:flex items-center gap-1.5 font-mono text-xs text-dao-dim border border-dao-border rounded-full px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
        Stellar Testnet
      </span>

      {/* Wallet button */}
      {publicKey ? (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-dao-accent bg-dao-accent/10 border border-dao-accent/30 rounded-full px-3 py-1">
            {shortKey}
          </span>
          <button
            onClick={onDisconnect}
            className="font-mono text-xs text-dao-dim hover:text-red-400 border border-dao-border hover:border-red-800 rounded-full px-3 py-1 transition-all"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          disabled={connecting}
          className="font-mono text-xs bg-dao-accent hover:bg-violet-700 text-white rounded-full px-4 py-2 transition-all glow-accent disabled:opacity-50"
        >
          {connecting ? "Connecting…" : "Connect Freighter"}
        </button>
      )}
    </nav>
  );
}
