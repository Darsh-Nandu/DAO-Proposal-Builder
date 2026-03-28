#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, log, Env, Symbol, String, symbol_short};


// Tracks aggregate proposal statistics across the DAO
#[contracttype]
#[derive(Clone)]
pub struct ProposalStats {
    pub total: u64,    // Total proposals ever submitted
    pub active: u64,   // Proposals currently open for voting
    pub passed: u64,   // Proposals that met quorum and were approved
    pub rejected: u64, // Proposals that were voted down or expired
}

// Global key to access the ProposalStats aggregate
const ALL_PROPOSALS: Symbol = symbol_short!("ALL_PROPS");

// Counter key for generating unique proposal IDs
const COUNT_PROP: Symbol = symbol_short!("C_PROP");

// Maps proposal_id -> Proposal struct
#[contracttype]
pub enum Proposalbook {
    Proposal(u64),
}

// Maps proposal_id -> VoteTally struct
#[contracttype]
pub enum Votebook {
    Votes(u64),
}

// Represents a DAO proposal submitted by a member
#[contracttype]
#[derive(Clone)]
pub struct Proposal {
    pub proposal_id: u64,    // Unique identifier for the proposal
    pub title: String,       // Short title of the proposal
    pub descrip: String,     // Detailed description / rationale
    pub proposed_by: String, // Identifier of the proposing member
    pub created_at: u64,     // Ledger timestamp when proposal was created
    pub is_active: bool,     // True while voting is open
    pub is_passed: bool,     // True if the proposal passed
}

// Stores the running vote counts for a proposal
#[contracttype]
#[derive(Clone)]
pub struct VoteTally {
    pub proposal_id: u64, // Links back to the parent Proposal
    pub votes_for: u64,   // Number of YES votes cast
    pub votes_against: u64, // Number of NO votes cast
}


#[contract]
pub struct DaoProposalContract;

#[contractimpl]
impl DaoProposalContract {

    // -----------------------------------------------------------------------
    // 1. CREATE PROPOSAL
    //    A DAO member submits a new proposal for community consideration.
    //    Returns the unique proposal_id assigned to the new proposal.
    // -----------------------------------------------------------------------
    pub fn create_proposal(
        env: Env,
        title: String,
        descrip: String,
        proposed_by: String,
    ) -> u64 {
        // Increment the global proposal counter
        let mut count: u64 = env.storage().instance().get(&COUNT_PROP).unwrap_or(0);
        count += 1;

        let timestamp = env.ledger().timestamp();

        // Build the Proposal record
        let proposal = Proposal {
            proposal_id: count,
            title,
            descrip,
            proposed_by,
            created_at: timestamp,
            is_active: true,
            is_passed: false,
        };

        // Initialise an empty VoteTally for this proposal
        let tally = VoteTally {
            proposal_id: count,
            votes_for: 0,
            votes_against: 0,
        };

        // Update aggregate stats
        let mut stats = Self::view_proposal_stats(env.clone());
        stats.total += 1;
        stats.active += 1;

        // Persist everything
        env.storage().instance().set(&Proposalbook::Proposal(count), &proposal);
        env.storage().instance().set(&Votebook::Votes(count), &tally);
        env.storage().instance().set(&ALL_PROPOSALS, &stats);
        env.storage().instance().set(&COUNT_PROP, &count);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "Proposal created with ID: {}", count);
        count // Return the new proposal's unique ID
    }


    // -----------------------------------------------------------------------
    // 2. CAST VOTE
    //    A DAO member casts a YES (vote_for = true) or NO (vote_for = false)
    //    vote on an active proposal.
    // -----------------------------------------------------------------------
    pub fn cast_vote(env: Env, proposal_id: u64, vote_for: bool) {
        let proposal = Self::view_proposal(env.clone(), proposal_id);

        // Voting is only allowed while the proposal is active
        if !proposal.is_active {
            log!(&env, "Voting is closed for Proposal-ID: {}", proposal_id);
            panic!("Voting is closed for this proposal.");
        }

        let mut tally = Self::view_vote_tally(env.clone(), proposal_id);

        if vote_for {
            tally.votes_for += 1;
            log!(&env, "YES vote cast on Proposal-ID: {}", proposal_id);
        } else {
            tally.votes_against += 1;
            log!(&env, "NO vote cast on Proposal-ID: {}", proposal_id);
        }

        env.storage().instance().set(&Votebook::Votes(proposal_id), &tally);
        env.storage().instance().extend_ttl(5000, 5000);
    }


    // -----------------------------------------------------------------------
    // 3. FINALISE PROPOSAL
    //    Admin / governance layer closes voting and records the outcome.
    //    A proposal passes when votes_for > votes_against (simple majority).
    // -----------------------------------------------------------------------
    pub fn finalise_proposal(env: Env, proposal_id: u64) {
        let mut proposal = Self::view_proposal(env.clone(), proposal_id);

        if !proposal.is_active {
            log!(&env, "Proposal-ID: {} is already finalised", proposal_id);
            panic!("Proposal is already finalised.");
        }

        let tally = Self::view_vote_tally(env.clone(), proposal_id);
        let mut stats = Self::view_proposal_stats(env.clone());

        // Determine outcome by simple majority
        proposal.is_active = false;
        if tally.votes_for > tally.votes_against {
            proposal.is_passed = true;
            stats.passed += 1;
            log!(&env, "Proposal-ID: {} PASSED", proposal_id);
        } else {
            proposal.is_passed = false;
            stats.rejected += 1;
            log!(&env, "Proposal-ID: {} REJECTED", proposal_id);
        }

        stats.active -= 1;

        env.storage().instance().set(&Proposalbook::Proposal(proposal_id), &proposal);
        env.storage().instance().set(&ALL_PROPOSALS, &stats);
        env.storage().instance().extend_ttl(5000, 5000);
    }


    // -----------------------------------------------------------------------
    // 4. VIEW PROPOSAL  (read-only)
    //    Returns the full Proposal record for a given proposal_id.
    // -----------------------------------------------------------------------
    pub fn view_proposal(env: Env, proposal_id: u64) -> Proposal {
        let key = Proposalbook::Proposal(proposal_id);
        env.storage().instance().get(&key).unwrap_or(Proposal {
            proposal_id: 0,
            title: String::from_str(&env, "Not_Found"),
            descrip: String::from_str(&env, "Not_Found"),
            proposed_by: String::from_str(&env, "Not_Found"),
            created_at: 0,
            is_active: false,
            is_passed: false,
        })
    }


    // -----------------------------------------------------------------------
    // VIEW VOTE TALLY  (read-only)
    //    Returns the current YES / NO counts for a given proposal_id.
    // -----------------------------------------------------------------------
    pub fn view_vote_tally(env: Env, proposal_id: u64) -> VoteTally {
        let key = Votebook::Votes(proposal_id);
        env.storage().instance().get(&key).unwrap_or(VoteTally {
            proposal_id: 0,
            votes_for: 0,
            votes_against: 0,
        })
    }


    // -----------------------------------------------------------------------
    // VIEW PROPOSAL STATS  (read-only)
    //    Returns aggregate statistics for all proposals on the platform.
    // -----------------------------------------------------------------------
    pub fn view_proposal_stats(env: Env) -> ProposalStats {
        env.storage().instance().get(&ALL_PROPOSALS).unwrap_or(ProposalStats {
            total: 0,
            active: 0,
            passed: 0,
            rejected: 0,
        })
    }
}