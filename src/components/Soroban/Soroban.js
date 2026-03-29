import * as StellarSdk from "stellar-sdk";
import {
  isConnected,
  getPublicKey as freighterGetPublicKey,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";

export const CONTRACT_ADDRESS = "CCHVWSKJW2RXRPQIXB5UL5EKF3ORGKZSJANDTVVESIHWRBFH3ZJ3RTOH";

const RPC_URL        = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPH = "Test SDF Network ; September 2015";
const NETWORK_NAME   = "TESTNET";

const server = new StellarSdk.SorobanRpc.Server(RPC_URL);

// ── WALLET HELPERS ──────────────────────────────────────────
export const connectWallet = async () => {
  try {
    const connected = await isConnected();
    if (!connected) throw new Error("Freighter wallet is not installed.");
    const publicKey = await freighterGetPublicKey();
    if (!publicKey) throw new Error("Wallet access denied by user.");
    return publicKey;
  } catch (err) {
    console.error("connectWallet:", err);
    throw err;
  }
};

export const getPublicKey = async () => {
  try {
    return (await freighterGetPublicKey()) || null;
  } catch {
    return null;
  }
};

// ── CORE TX HELPER ───────────────────────────────────────────
const invokeContract = async (publicKey, method, params = []) => {
  const account  = await server.getAccount(publicKey);
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

  const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(tx, simResult).build();

  const signedTxXdr = await freighterSignTransaction(preparedTx.toXDR(), {
    network: NETWORK_NAME,
    networkPassphrase: NETWORK_PASSPH,
  });

  const submittedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPH);
  const sendResult  = await server.sendTransaction(submittedTx);

  if (sendResult.status === "ERROR") {
    throw new Error(`Transaction failed: ${sendResult.errorResult}`);
  }

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

// ── READ-ONLY HELPER ─────────────────────────────────────────
const simulateOnly = async (method, params = []) => {
  const dummyKeypair = StellarSdk.Keypair.random();
  const account      = new StellarSdk.Account(dummyKeypair.publicKey(), "0");
  const contract     = new StellarSdk.Contract(CONTRACT_ADDRESS);

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

// ── CONTRACT WRAPPERS ────────────────────────────────────────

export const createProposal = async (publicKey, title, descrip) => {
  const result = await invokeContract(publicKey, "create_proposal", [
    StellarSdk.nativeToScVal(title),    // plain string → scvString ✅
    StellarSdk.nativeToScVal(descrip),  // plain string → scvString ✅
  ]);
  // ✅ returnValue is directly on getTransaction response in stellar-sdk v12
  return StellarSdk.scValToNative(result.returnValue);
};

export const castVote = async (publicKey, proposalId, voteFor) => {
  await invokeContract(publicKey, "cast_vote", [
    StellarSdk.nativeToScVal(BigInt(proposalId), { type: "u64" }), // ✅ BigInt for u64
    StellarSdk.nativeToScVal(voteFor,            { type: "bool" }),
  ]);
};

export const finaliseProposal = async (publicKey, proposalId) => {
  const result = await invokeContract(publicKey, "finalise", [
    StellarSdk.nativeToScVal(BigInt(proposalId), { type: "u64" }), // ✅ BigInt for u64
  ]);
  return StellarSdk.scValToNative(result.returnValue);
};

export const viewProposal = async (proposalId) => {
  const simResult = await simulateOnly("view_proposal", [
    StellarSdk.nativeToScVal(BigInt(proposalId), { type: "u64" }), // ✅ BigInt for u64
  ]);
  const raw = StellarSdk.scValToNative(simResult.result.retval);
  return {
    id:            Number(raw.id),
    title:         raw.title,
    descrip:       raw.descrip,
    votes_for:     Number(raw.votes_for),
    votes_against: Number(raw.votes_against),
    is_active:     raw.is_active,
  };
};