# DAO Proposal Builder

---

## Table of Contents

- [Project Title](#dao-proposal-builder)
- [Project Description](#project-description)
- [Project Vision](#project-vision)
- [Key Features](#key-features)
- [Future Scope](#future-scope)
<<<<<<< HEAD
=======
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
>>>>>>> ae9c51f (first commit)

---

## Project Description

A **DAO Proposal Builder** is an on-chain platform that enables members of a Decentralised Autonomous Organisation (DAO) to create, structure, and submit formal proposals for community voting and execution — governed entirely by smart-contract logic deployed on the **Stellar / Soroban** blockchain.

<<<<<<< HEAD
This smart contract provides the foundational layer for a fully on-chain proposal lifecycle: from creation by any DAO member, through an open voting period where the community casts YES/NO votes, to final resolution (passed or rejected). Every state transition is recorded immutably on-chain, ensuring complete transparency and auditability.

The contract is intentionally lean and efficient — a single `Proposal` struct captures all necessary state (title, description, vote counts, and active status), and a single `Datakey` enum handles all storage lookups. This design keeps compilation fast and on-chain storage costs minimal.
=======
This dApp provides a full on-chain proposal lifecycle: from creation by any DAO member, through an open voting period where the community casts YES/NO votes, to final resolution (passed or rejected). Every state transition is recorded immutably on-chain, ensuring complete transparency and auditability.
>>>>>>> ae9c51f (first commit)

---

## Project Vision

The vision of the DAO Proposal Builder is to **democratise organisational decision-making** by replacing opaque, centralised governance structures with transparent, trustless, and censorship-resistant on-chain processes.

We believe that any community — whether a DeFi protocol, a social collective, or a decentralised enterprise — should be able to govern itself through verifiable rules rather than relying on a privileged few. By building the proposal lifecycle entirely on Soroban, we ensure that:

- No single actor can alter or suppress a proposal once it is submitted.
- Voting results are final and publicly verifiable by anyone.
- Governance participation is open to every wallet holding membership rights.
<<<<<<< HEAD
- Execution of passed proposals can be chained to further on-chain actions in future iterations.
=======
>>>>>>> ae9c51f (first commit)

---

## Key Features

| # | Feature | Description |
|---|---------|-------------|
<<<<<<< HEAD
| 1 | **Create Proposal** | Any DAO member can submit a new proposal with a title and detailed description. Each proposal is assigned a unique auto-incremented on-chain ID and is immediately open for voting. |
| 2 | **Cast Vote** | Members cast a YES (`true`) or NO (`false`) vote on any active proposal. The contract enforces that voting is only allowed while the proposal remains open, keeping result integrity intact. |
| 3 | **Finalise Proposal** | A governance authority closes the voting window and triggers automatic outcome resolution. A simple majority rule (`votes_for > votes_against`) determines whether the proposal passes or is rejected. Returns `true` if passed, `false` if rejected. |
| 4 | **View Proposal** | Any participant can query the full details of a proposal — title, description, YES/NO vote counts, active status — using only its proposal ID. Returns a default `Not_Found` record for unknown IDs. |
=======
| 1 | **Create Proposal** | Any DAO member can submit a new proposal with a title and description. Each proposal gets a unique auto-incremented on-chain ID and is immediately open for voting. |
| 2 | **Cast Vote** | Members cast a YES or NO vote on any active proposal. The contract enforces that voting is only allowed while the proposal remains open. |
| 3 | **Finalise Proposal** | A governance authority closes the voting window. Simple majority (`votes_for > votes_against`) determines the outcome. Returns `true` if passed, `false` if rejected. |
| 4 | **View Proposal** | Anyone can query full proposal details — title, description, live YES/NO vote counts, and active status — using only the proposal ID. No wallet required. |
>>>>>>> ae9c51f (first commit)

---

## Future Scope

<<<<<<< HEAD
The current contract establishes a minimal, secure governance primitive. The following capabilities are planned for future iterations:

- **Token-weighted voting** — Replace one-member-one-vote with vote weight proportional to a member's DAO token holdings, giving larger stakeholders appropriately scaled influence.
- **Quorum enforcement** — Require a minimum participation threshold (e.g., 30% of total voting power) before a proposal can be finalised, preventing low-turnout manipulation.
- **Voting deadline / TTL** — Attach a ledger-timestamp-based deadline to each proposal so that voting closes automatically after a defined period without requiring manual admin intervention.
- **On-chain execution hooks** — Allow a passed proposal to automatically trigger subsequent smart-contract calls (treasury disbursements, parameter updates, contract upgrades) upon finalisation.
- **Proposal categories & tagging** — Support structured metadata (budget, protocol-upgrade, membership, etc.) to help members filter and prioritise proposals efficiently.
- **Delegation / liquid democracy** — Enable members to delegate their voting power to a trusted representative for any proposal they choose not to vote on directly.
- **Multi-sig admin roles** — Distribute the finalisation authority across a council of key holders, removing the single-point-of-failure risk inherent in a sole admin key.
- **Global proposal stats** — Re-introduce an aggregate dashboard tracking total, active, passed, and rejected proposal counts once compilation constraints are lifted.

## Contract Details:
Contract ID: CCHESM4RJ47Z64WLYK3IW3SQIFJLAJUE7LCJ74J4LFJYN4EDDZAJR2UH
<img width="1625" height="702" alt="image" src="https://github.com/user-attachments/assets/5d6c68fb-54cd-4f82-8374-5a9a1799df03" />
=======
- **Token-weighted voting** — Vote weight proportional to DAO token holdings.
- **Quorum enforcement** — Minimum participation threshold before finalisation.
- **Voting deadline / TTL** — Auto-close voting after a defined ledger timestamp.
- **On-chain execution hooks** — Trigger treasury disbursements or contract upgrades on pass.
- **Proposal categories & tagging** — Structured metadata for filtering.
- **Delegation / liquid democracy** — Delegate voting power to a trusted representative.
- **Multi-sig admin roles** — Distribute finalisation authority across a council.
- **Global proposal stats** — Aggregate dashboard for total, active, passed, and rejected counts.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Rust + Soroban SDK (Stellar) |
| Blockchain | Stellar Testnet |
| Wallet | Freighter Wallet |
| Frontend | React.js |
| Styling | Tailwind CSS |
| Stellar JS | stellar-sdk, @stellar/freighter-api |

---

## Project Structure

```
dao-proposal-builder/
│
├── package.json
├── tailwind.config.js
├── jsconfig.json
├── .gitignore
│
├── public/
│   └── index.html
│
├── src/
│   ├── index.js
│   ├── index.css
│   ├── App.js
│   └── components/
│       ├── UI.js                          ← Shared UI primitives
│       ├── Navbar/Navbar.js
│       ├── CreateProposal/CreateProposal.js
│       ├── CastVote/CastVote.js
│       ├── FinaliseProposal/FinaliseProposal.js
│       ├── ViewProposal/ViewProposal.js
│       ├── Footer/Footer.js
│       └── Soroban/Soroban.js             ← All blockchain interaction
│
└── smart-contract/
    ├── Cargo.toml                         ← Workspace root
    └── contracts/
        └── dao-proposal-builder/
            ├── Cargo.toml
            └── src/
                └── lib.rs                 ← Soroban smart contract
```

---

## Setup & Installation

### A) Prerequisites

- Install [Rust](https://www.rust-lang.org/tools/install)
- Install Soroban CLI:
  ```bash
  cargo install --locked soroban-cli
  ```
- Install wasm target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- Install [Node.js](https://nodejs.org/)
- Install [Freighter Wallet](https://www.freighter.app/) browser extension and switch it to **Testnet**

---

### B) Smart Contract Setup

Navigate into the smart-contract folder:

```bash
cd smart-contract
```

Build the contract:

```bash
stellar contract build
```

Optimize (optional but recommended):

```bash
cargo install --locked soroban-cli --features opt
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/dao_proposal_builder.wasm
```

Deploy to Testnet:

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/dao_proposal_builder.wasm \
  --source alice \
  --network testnet
```

Copy the deployed contract address — you'll need it next.

---

### C) Frontend Setup

Go back to the project root:

```bash
cd ..
```

Open `src/components/Soroban/Soroban.js` and replace:

```js
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
```

with your actual deployed contract address.

Also update `src/components/Footer/Footer.js` with the same address.

Install dependencies:

```bash
npm install
```

Start the dev server (HTTPS required for Freighter):

```bash
npm run start
```

The app will open at `https://localhost:3000`.

---

### D) Invoke Contract Functions via CLI

```bash
# Create a proposal
stellar contract invoke \
  --id <CONTRACT_ADDRESS> \
  --source alice \
  --network testnet \
  -- \
  create_proposal --title "Fund dev grants" --descrip "Allocate 1000 XLM to dev grants"

# Cast a vote (vote_for: true = YES, false = NO)
stellar contract invoke \
  --id <CONTRACT_ADDRESS> \
  --source alice \
  --network testnet \
  -- \
  cast_vote --id 1 --vote_for true

# Finalise a proposal
stellar contract invoke \
  --id <CONTRACT_ADDRESS> \
  --source alice \
  --network testnet \
  -- \
  finalise --id 1

# View a proposal (read-only)
stellar contract invoke \
  --id <CONTRACT_ADDRESS> \
  --source alice \
  --network testnet \
  -- \
  view_proposal --id 1
```

---

## Deployed Smart Contract Address

`YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE`

---

> Built with ❤️ on Stellar · Soroban SDK · React.js
>>>>>>> ae9c51f (first commit)
