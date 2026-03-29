import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-dao-border bg-dao-surface py-6 px-6 text-center">
      <p className="font-mono text-xs text-dao-dim">
        Built on{" "}
        <a
          href="https://stellar.org"
          target="_blank"
          rel="noreferrer"
          className="text-dao-accent hover:underline"
        >
          Stellar
        </a>{" "}
        ·{" "}
        <a
          href="https://developers.stellar.org/docs/smart-contracts"
          target="_blank"
          rel="noreferrer"
          className="text-dao-accent hover:underline"
        >
          Soroban SDK
        </a>{" "}
        · DAO Proposal Builder
      </p>
      <p className="font-mono text-xs text-dao-muted mt-1">
        Contract:{" "}
        <span className="text-dao-dim">YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE</span>
      </p>
    </footer>
  );
}
