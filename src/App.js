import React, { useState, useEffect, useCallback } from "react";
import Navbar           from "./components/Navbar/Navbar";
import CreateProposal   from "./components/CreateProposal/CreateProposal";
import CastVote         from "./components/CastVote/CastVote";
import FinaliseProposal from "./components/FinaliseProposal/FinaliseProposal";
import ViewProposal     from "./components/ViewProposal/ViewProposal";
import Footer           from "./components/Footer/Footer";
import { connectWallet, getPublicKey } from "./components/Soroban/Soroban";

const TABS = [
  { id: "create",   label: "📝 Create Proposal" },
  { id: "vote",     label: "🗳️  Cast Vote"       },
  { id: "finalise", label: "⚖️  Finalise"         },
  { id: "view",     label: "🔍 View Proposal"    },
];

export default function App() {
  const [activeTab,  setActiveTab]  = useState("create");
  const [publicKey,  setPublicKey]  = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [walletErr,  setWalletErr]  = useState("");

  // Check if already connected on mount
  useEffect(() => {
    getPublicKey().then((key) => { if (key) setPublicKey(key); });
  }, []);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    setWalletErr("");
    try {
      const key = await connectWallet();
      setPublicKey(key);
    } catch (err) {
      setWalletErr(err.message);
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = () => {
    setPublicKey(null);
  };

  return (
    <div className="min-h-screen bg-dao-bg flex flex-col">
      {/* ── Navbar ── */}
      <Navbar
        publicKey={publicKey}
        connecting={connecting}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {/* ── Hero ── */}
      <header className="text-center px-4 pt-14 pb-8 fade-up">
        <p className="font-mono text-dao-accent text-xs tracking-widest uppercase mb-3">
          Stellar Testnet · Soroban Smart Contract
        </p>
        <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-dao-text leading-tight">
          DAO Proposal Builder
        </h1>
        <p className="mt-3 text-dao-dim font-mono text-sm max-w-xl mx-auto">
          Create, vote on, and finalise community proposals — fully on-chain.
        </p>

        {walletErr && (
          <p className="mt-4 text-red-400 font-mono text-xs bg-red-900/20 border border-red-800 rounded-lg px-4 py-2 inline-block">
            ⚠ {walletErr}
          </p>
        )}
      </header>

      {/* ── Tab bar ── */}
      <nav className="flex justify-center gap-2 px-4 pb-6 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200
              ${activeTab === tab.id
                ? "bg-dao-accent border-dao-accent text-white glow-accent"
                : "bg-dao-surface border-dao-border text-dao-dim hover:border-dao-accent hover:text-dao-text"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Main panel ── */}
      <main className="flex-1 flex justify-center px-4 pb-16">
        <div className="w-full max-w-xl fade-up">
          {activeTab === "create"   && <CreateProposal   publicKey={publicKey} onConnect={handleConnect} />}
          {activeTab === "vote"     && <CastVote         publicKey={publicKey} onConnect={handleConnect} />}
          {activeTab === "finalise" && <FinaliseProposal publicKey={publicKey} onConnect={handleConnect} />}
          {activeTab === "view"     && <ViewProposal />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
