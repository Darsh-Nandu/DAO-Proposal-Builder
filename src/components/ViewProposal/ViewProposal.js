import React, { useState } from "react";
import { Card, CardTitle, Input, Btn, StatusBar } from "../UI";
import { viewProposal } from "../Soroban/Soroban";

function VoteBar({ votesFor, votesAgainst }) {
  const total = votesFor + votesAgainst;
  const pct   = total === 0 ? 50 : Math.round((votesFor / total) * 100);
  return (
    <div className="mt-4">
      <div className="flex justify-between font-mono text-xs text-dao-dim mb-1">
        <span className="text-green-400">YES {votesFor}</span>
        <span className="text-red-400">NO {votesAgainst}</span>
      </div>
      <div className="w-full h-2 bg-dao-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-center font-mono text-xs text-dao-dim mt-1">
        {pct}% support · {total} total votes
      </p>
    </div>
  );
}

export default function ViewProposal() {
  const [proposalId, setProposalId] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [status,     setStatus]     = useState(null);
  const [proposal,   setProposal]   = useState(null);

  const handleFetch = async () => {
    const id = parseInt(proposalId, 10);
    if (!proposalId || isNaN(id) || id < 1) {
      setStatus({ type: "error", message: "Please enter a valid Proposal ID." });
      return;
    }
    setLoading(true);
    setStatus(null);
    setProposal(null);
    try {
      const data = await viewProposal(id);
      if (data.id === 0) {
        setStatus({ type: "error", message: `No proposal found with ID #${id}.` });
      } else {
        setProposal(data);
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle icon="🔍" subtitle="Read-only" title="View Proposal" />

      <p className="font-mono text-xs text-dao-dim mb-5">
        No wallet needed — fetch any proposal directly from the blockchain.
      </p>

      <Input
        label="Proposal ID"
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        placeholder="Enter the Proposal ID e.g. 1"
        disabled={loading}
      />

      <Btn onClick={handleFetch} loading={loading} variant="ghost">
        Fetch Proposal →
      </Btn>

      <StatusBar status={status} />

      {proposal && (
        <div className="mt-5 space-y-3 fade-up">
          {/* ID + status badge */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-dao-accent text-sm font-bold">
              Proposal #{proposal.id}
            </span>
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded-full border ${
                proposal.is_active
                  ? "text-cyan-400 border-cyan-800 bg-cyan-900/20"
                  : "text-dao-dim border-dao-border bg-dao-border/30"
              }`}
            >
              {proposal.is_active ? "● ACTIVE" : "○ CLOSED"}
            </span>
          </div>

          {/* Title */}
          <div className="bg-dao-bg border border-dao-border rounded-xl px-4 py-3">
            <p className="font-mono text-xs text-dao-dim uppercase tracking-widest mb-1">
              Title
            </p>
            <p className="font-syne font-semibold text-dao-text text-base">
              {proposal.title}
            </p>
          </div>

          {/* Description */}
          <div className="bg-dao-bg border border-dao-border rounded-xl px-4 py-3">
            <p className="font-mono text-xs text-dao-dim uppercase tracking-widest mb-1">
              Description
            </p>
            <p className="font-mono text-sm text-dao-text leading-relaxed">
              {proposal.descrip}
            </p>
          </div>

          {/* Vote counts + bar */}
          <div className="bg-dao-bg border border-dao-border rounded-xl px-4 py-3">
            <p className="font-mono text-xs text-dao-dim uppercase tracking-widest mb-2">
              Vote Tally
            </p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-green-900/20 border border-green-900 rounded-xl py-3">
                <p className="font-syne font-extrabold text-2xl text-green-400">
                  {proposal.votes_for}
                </p>
                <p className="font-mono text-xs text-dao-dim mt-0.5">YES</p>
              </div>
              <div className="bg-red-900/20 border border-red-900 rounded-xl py-3">
                <p className="font-syne font-extrabold text-2xl text-red-400">
                  {proposal.votes_against}
                </p>
                <p className="font-mono text-xs text-dao-dim mt-0.5">NO</p>
              </div>
            </div>
            <VoteBar
              votesFor={proposal.votes_for}
              votesAgainst={proposal.votes_against}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
