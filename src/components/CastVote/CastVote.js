import React, { useState } from "react";
import { Card, CardTitle, Input, Btn, StatusBar, WalletGate } from "../UI";
import { castVote } from "../Soroban/Soroban";

export default function CastVote({ publicKey, onConnect }) {
  const [proposalId, setProposalId] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [status,     setStatus]     = useState(null);

  const handleVote = async (voteFor) => {
    const id = parseInt(proposalId, 10);
    if (!proposalId || isNaN(id) || id < 1) {
      setStatus({ type: "error", message: "Please enter a valid Proposal ID." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await castVote(publicKey, id, voteFor);
      setStatus({
        type: "success",
        message: `Your ${voteFor ? "YES ✓" : "NO ✗"} vote on Proposal #${id} has been recorded on-chain.`,
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle icon="🗳️" subtitle="Step 2" title="Cast Your Vote" />

      {!publicKey ? (
        <WalletGate onConnect={onConnect} />
      ) : (
        <>
          <Input
            label="Proposal ID"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
            placeholder="Enter the Proposal ID e.g. 1"
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => handleVote(true)}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-1 bg-green-900/20 border border-green-800 hover:bg-green-900/40 hover:border-green-600 text-green-400 rounded-xl py-4 font-syne font-semibold transition-all disabled:opacity-40"
            >
              <span className="text-2xl">👍</span>
              <span className="text-sm">Vote YES</span>
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-1 bg-red-900/20 border border-red-900 hover:bg-red-900/40 hover:border-red-600 text-red-400 rounded-xl py-4 font-syne font-semibold transition-all disabled:opacity-40"
            >
              <span className="text-2xl">👎</span>
              <span className="text-sm">Vote NO</span>
            </button>
          </div>

          {loading && (
            <p className="text-center font-mono text-xs text-dao-dim mt-4 animate-pulse">
              Signing transaction via Freighter…
            </p>
          )}

          <StatusBar status={status} />
        </>
      )}
    </Card>
  );
}
