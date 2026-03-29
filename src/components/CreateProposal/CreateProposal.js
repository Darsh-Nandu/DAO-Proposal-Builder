import React, { useState } from "react";
import { Card, CardTitle, Input, Textarea, Btn, StatusBar, WalletGate } from "../UI";
import { createProposal } from "../Soroban/Soroban";

export default function CreateProposal({ publicKey, onConnect }) {
  const [title,   setTitle]   = useState("");
  const [descrip, setDescrip] = useState("");
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState(null);
  const [newId,   setNewId]   = useState(null);

  const handleSubmit = async () => {
    if (!title.trim() || !descrip.trim()) {
      setStatus({ type: "error", message: "Title and description are required." });
      return;
    }
    setLoading(true);
    setStatus(null);
    setNewId(null);
    try {
      const id = await createProposal(publicKey, title.trim(), descrip.trim());
      setNewId(id);
      setStatus({
        type: "success",
        message: `Proposal #${id} created successfully! It is now open for voting.`,
      });
      setTitle("");
      setDescrip("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle icon="📝" subtitle="Step 1" title="Create a New Proposal" />

      {!publicKey ? (
        <WalletGate onConnect={onConnect} />
      ) : (
        <>
          <Input
            label="Proposal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Increase treasury allocation for dev grants"
            disabled={loading}
          />
          <Textarea
            label="Description / Rationale"
            value={descrip}
            onChange={(e) => setDescrip(e.target.value)}
            placeholder="Explain the proposal in detail — what, why, and expected outcome…"
            disabled={loading}
          />

          <Btn onClick={handleSubmit} loading={loading}>
            Submit Proposal →
          </Btn>

          <StatusBar status={status} />

          {newId && (
            <div className="mt-4 bg-dao-accent/10 border border-dao-accent/30 rounded-xl px-4 py-3 text-center">
              <p className="font-mono text-xs text-dao-dim uppercase tracking-widest mb-1">
                Your Proposal ID
              </p>
              <p className="font-syne font-extrabold text-4xl text-dao-accent">
                #{newId.toString()}
              </p>
              <p className="font-mono text-xs text-dao-dim mt-1">
                Save this ID — you'll need it to vote or finalise.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
