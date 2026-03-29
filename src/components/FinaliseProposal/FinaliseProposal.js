import React, { useState } from "react";
import { Card, CardTitle, Input, Btn, StatusBar, WalletGate } from "../UI";
import { finaliseProposal } from "../Soroban/Soroban";

export default function FinaliseProposal({ publicKey, onConnect }) {
  const [proposalId, setProposalId] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [status,     setStatus]     = useState(null);
  const [outcome,    setOutcome]    = useState(null); // true | false | null

  const handleFinalise = async () => {
    const id = parseInt(proposalId, 10);
    if (!proposalId || isNaN(id) || id < 1) {
      setStatus({ type: "error", message: "Please enter a valid Proposal ID." });
      return;
    }
    setLoading(true);
    setStatus(null);
    setOutcome(null);
    try {
      const passed = await finaliseProposal(publicKey, id);
      setOutcome(passed);
      setStatus({
        type: "success",
        message: `Proposal #${id} has been finalised. Result: ${passed ? "PASSED ✓" : "REJECTED ✗"}`,
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle icon="⚖️" subtitle="Step 3" title="Finalise Proposal" />

      <p className="font-mono text-xs text-dao-dim mb-5 leading-relaxed">
        Close voting on a proposal. The outcome is determined by simple majority —
        more YES votes than NO votes = <span className="text-green-400">PASSED</span>.
      </p>

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

          <Btn onClick={handleFinalise} loading={loading} variant="cyan">
            Finalise Proposal
          </Btn>

          <StatusBar status={status} />

          {outcome !== null && (
            <div
              className={`mt-4 rounded-xl border px-4 py-5 text-center ${
                outcome
                  ? "bg-green-900/20 border-green-700"
                  : "bg-red-900/20 border-red-800"
              }`}
            >
              <p className="font-syne font-extrabold text-3xl mb-1">
                {outcome ? "✅ PASSED" : "❌ REJECTED"}
              </p>
              <p className="font-mono text-xs text-dao-dim">
                {outcome
                  ? "The proposal has been approved by the community."
                  : "The proposal did not receive enough support."}
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
