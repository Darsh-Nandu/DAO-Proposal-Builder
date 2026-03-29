import * as StellarSdk from "stellar-sdk";
import {
  isConnected,
  getPublicKey as freighterGetPublicKey,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";

// ─────────────────────────────────────────────────────────────
//  CONFIG  —  Replace CONTRACT_ADDRESS after deploying your contract
// ─────────────────────────────────────────────────────────────
export const CONTRACT_ADDRESS = "CCHESM4RJ47Z64WLYK3IW3SQIFJLAJUE7LCJ74J4LFJYN4EDDZAJR2UH";

const RPC_URL        = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPH = "Test SDF Network ; September 2015";
const NETWORK_NAME   = "TESTNET";

// Soroban RPC server instance
const server = new StellarSdk.SorobanRpc.Server(RPC_URL);

// ─────────────────────────────────────────────────────────────
//  WALLET HELPERS  (freighter-api v1.7.1)
// ─────────────────────────────────────────────────────────────

/** Connect wallet and return the public key */
export const connectWallet = async () => {
  try {
    const connected = await isConnected();
    if (!connected) {
      throw new Error(
        "Freighter wallet is not installed. Please install it from https://www.freighter.app/"
      );
    }
    // v1.7.1 — getPublicKey() triggers the access popup
    const publicKey = await freighterGetPublicKey();
    if (!publicKey) throw new Error("Wallet access denied by user.");
    return publicKey;
  } catch (err) {
    console.error("connectWallet:", err);
    throw err;
  }
};

/** Returns the currently connected public key (or null) */
export const getPublicKey = async () => {
  try {
    const publicKey = await freighterGetPublicKey();
    return publicKey || null;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
//  CORE TX HELPER — build → simulate → sign → submit
// ─────────────────────────────────────────────────────────────
const invokeContract = async (publicKey, method, params = []) => {
  const account   = await server.getAccount(publicKey);
  const contract  = new StellarSdk.Contract(CONTRACT_ADDRESS);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPH,
  })
    .addOperation(contract.call(method, ...params))
    .setTimeout(30)
    .build();

  // Simulate first to get the footprint / resource limits
  const simResult = await server.simulateTransaction(tx);
  if (StellarSdk.SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  // Assemble the real transaction with resource fees attached
  const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(
    tx,
    simResult
  ).build();

  // Sign via Freighter
  const signedTxXdr = await freighterSignTransaction(preparedTx.toXDR(), {
    network: NETWORK_NAME,
    networkPassphrase: NETWORK_PASSPH,
  });

  // Submit
  const submittedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedTxXdr,
    NETWORK_PASSPH
  );
  const sendResult = await server.sendTransaction(submittedTx);

  if (sendResult.status === "ERROR") {
    throw new Error(`Transaction failed: ${sendResult.errorResult}`);
  }

  // Poll until complete
  let getResult = await server.getTransaction(sendResult.hash);
  while (getResult.status === "NOT_FOUND") {
    await new Promise((r) => setTimeout(r, 1500));
    getResult = await server.getTransaction(sendResult.hash);
  }

  if (getResult.status === "FAILED") {
    throw new Error("Transaction was rejected by the network.");
  }

  return getResult;
};

// ─────────────────────────────────────────────────────────────
//  READ-ONLY HELPER — simulate only, no signing needed
// ─────────────────────────────────────────────────────────────
const simulateOnly = async (method, params = []) => {
  // Use a throwaway keypair just to build the tx for simulation
  const dummyKeypair = StellarSdk.Keypair.random();
  const account = new StellarSdk.Account(dummyKeypair.publicKey(), "0");
  const contract = new StellarSdk.Contract(CONTRACT_ADDRESS);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPH,
  })
    .addOperation(contract.call(method, ...params))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (StellarSdk.SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }
  return simResult;
};

// ─────────────────────────────────────────────────────────────
//  CONTRACT FUNCTION WRAPPERS
// ─────────────────────────────────────────────────────────────

/**
 * create_proposal(title: String, descrip: String) -> u64
 * Returns the new proposal's ID.
 */
export const createProposal = async (publicKey, title, descrip) => {
  const result = await invokeContract(publicKey, "create_proposal", [
    StellarSdk.nativeToScVal(title,   { type: "string" }),
    StellarSdk.nativeToScVal(descrip, { type: "string" }),
  ]);
  // The return value is the new proposal ID (u64)
  const retVal = result.returnValue;
  return StellarSdk.scValToNative(retVal);
};

/**
 * cast_vote(id: u64, vote_for: bool)
 */
export const castVote = async (publicKey, proposalId, voteFor) => {
  await invokeContract(publicKey, "cast_vote", [
    StellarSdk.nativeToScVal(BigInt(proposalId), { type: "u64" }),
    StellarSdk.nativeToScVal(voteFor,            { type: "bool" }),
  ]);
};

/**
 * finalise(id: u64) -> bool
 * Returns true if passed, false if rejected.
 */
export const finaliseProposal = async (publicKey, proposalId) => {
  const result = await invokeContract(publicKey, "finalise", [
    StellarSdk.nativeToScVal(BigInt(proposalId), { type: "u64" }),
  ]);
  return StellarSdk.scValToNative(result.returnValue);
};

/**
 * view_proposal(id: u64) -> Proposal struct
 * Read-only — no wallet needed.
 */
export const viewProposal = async (proposalId) => {
  const simResult = await simulateOnly("view_proposal", [
    StellarSdk.nativeToScVal(BigInt(proposalId), { type: "u64" }),
  ]);
  const raw = StellarSdk.scValToNative(simResult.result.retval);
  // raw is a JS object with the struct fields
  return {
    id:            Number(raw.id),
    title:         raw.title,
    descrip:       raw.descrip,
    votes_for:     Number(raw.votes_for),
    votes_against: Number(raw.votes_against),
    is_active:     raw.is_active,
  };
};