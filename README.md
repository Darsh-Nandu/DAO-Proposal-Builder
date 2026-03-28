# DAO Proposal Builder

---

## Table of Contents

- [Project Title](#dao-proposal-builder)
- [Project Description](#project-description)
- [Project Vision](#project-vision)
- [Key Features](#key-features)
- [Future Scope](#future-scope)

---

## Project Description

A **DAO Proposal Builder** is an on-chain platform that enables members of a Decentralised Autonomous Organisation (DAO) to create, structure, and submit formal proposals for community voting and execution — governed entirely by smart-contract logic deployed on the **Stellar / Soroban** blockchain.

This smart contract provides the foundational layer for a fully on-chain proposal lifecycle: from creation by any DAO member, through an open voting period where the community casts YES/NO votes, to final resolution (passed or rejected). Every state transition is recorded immutably on-chain, ensuring complete transparency and auditability.

The contract is intentionally lean and efficient — a single `Proposal` struct captures all necessary state (title, description, vote counts, and active status), and a single `Datakey` enum handles all storage lookups. This design keeps compilation fast and on-chain storage costs minimal.

---

## Project Vision

The vision of the DAO Proposal Builder is to **democratise organisational decision-making** by replacing opaque, centralised governance structures with transparent, trustless, and censorship-resistant on-chain processes.

We believe that any community — whether a DeFi protocol, a social collective, or a decentralised enterprise — should be able to govern itself through verifiable rules rather than relying on a privileged few. By building the proposal lifecycle entirely on Soroban, we ensure that:

- No single actor can alter or suppress a proposal once it is submitted.
- Voting results are final and publicly verifiable by anyone.
- Governance participation is open to every wallet holding membership rights.
- Execution of passed proposals can be chained to further on-chain actions in future iterations.

---

## Key Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Create Proposal** | Any DAO member can submit a new proposal with a title and detailed description. Each proposal is assigned a unique auto-incremented on-chain ID and is immediately open for voting. |
| 2 | **Cast Vote** | Members cast a YES (`true`) or NO (`false`) vote on any active proposal. The contract enforces that voting is only allowed while the proposal remains open, keeping result integrity intact. |
| 3 | **Finalise Proposal** | A governance authority closes the voting window and triggers automatic outcome resolution. A simple majority rule (`votes_for > votes_against`) determines whether the proposal passes or is rejected. Returns `true` if passed, `false` if rejected. |
| 4 | **View Proposal** | Any participant can query the full details of a proposal — title, description, YES/NO vote counts, active status — using only its proposal ID. Returns a default `Not_Found` record for unknown IDs. |

---

## Future Scope

The current contract establishes a minimal, secure governance primitive. The following capabilities are planned for future iterations:

- **Token-weighted voting** — Replace one-member-one-vote with vote weight proportional to a member's DAO token holdings, giving larger stakeholders appropriately scaled influence.
- **Quorum enforcement** — Require a minimum participation threshold (e.g., 30% of total voting power) before a proposal can be finalised, preventing low-turnout manipulation.
- **Voting deadline / TTL** — Attach a ledger-timestamp-based deadline to each proposal so that voting closes automatically after a defined period without requiring manual admin intervention.
- **On-chain execution hooks** — Allow a passed proposal to automatically trigger subsequent smart-contract calls (treasury disbursements, parameter updates, contract upgrades) upon finalisation.
- **Proposal categories & tagging** — Support structured metadata (budget, protocol-upgrade, membership, etc.) to help members filter and prioritise proposals efficiently.
- **Delegation / liquid democracy** — Enable members to delegate their voting power to a trusted representative for any proposal they choose not to vote on directly.
- **Multi-sig admin roles** — Distribute the finalisation authority across a council of key holders, removing the single-point-of-failure risk inherent in a sole admin key.
- **Global proposal stats** — Re-introduce an aggregate dashboard tracking total, active, passed, and rejected proposal counts once compilation constraints are lifted.
