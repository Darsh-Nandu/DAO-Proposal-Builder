#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, log, Env, Symbol, String, symbol_short};

#[contracttype]
#[derive(Clone)]
pub struct Proposal {
    pub id: u64,
    pub title: String,
    pub descrip: String,
    pub votes_for: u64,
    pub votes_against: u64,
    pub is_active: bool,
}

#[contracttype]
pub enum Datakey {
    Proposal(u64),
}

#[contract]
pub struct DAOContract;

#[contractimpl]
impl DAOContract {

    // Creates a new proposal using ledger sequence as unique ID
    pub fn create_proposal(env: Env, title: String, descrip: String) -> u64 {
        let id: u64 = env.ledger().sequence() as u64;

        // Safety check — extremely unlikely but just in case
        if env.storage().instance()
            .get::<_, Proposal>(&Datakey::Proposal(id))
            .is_some()
        {
            panic!("Proposal already exists at this ledger sequence");
        }

        let proposal = Proposal {
            id,
            title,
            descrip,
            votes_for: 0,
            votes_against: 0,
            is_active: true,
        };

        env.storage().instance().set(&Datakey::Proposal(id), &proposal);
        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "Proposal created with ID: {}", id);
        id
    }

    // Cast a vote: true = YES, false = NO
    pub fn cast_vote(env: Env, id: u64, vote_for: bool) {
        let mut p: Proposal = env.storage().instance()
            .get(&Datakey::Proposal(id))
            .unwrap_or_else(|| panic!("Proposal not found"));

        if !p.is_active {
            panic!("Voting is closed");
        }

        if vote_for {
            p.votes_for += 1;
        } else {
            p.votes_against += 1;
        }

        env.storage().instance().set(&Datakey::Proposal(id), &p);
        env.storage().instance().extend_ttl(5000, 5000);
        log!(&env, "Vote cast on proposal: {}", id);
    }

    // Finalise proposal — passes if votes_for > votes_against
    pub fn finalise(env: Env, id: u64) -> bool {
        let mut p: Proposal = env.storage().instance()
            .get(&Datakey::Proposal(id))
            .unwrap_or_else(|| panic!("Proposal not found"));

        if !p.is_active {
            panic!("Already finalised");
        }

        p.is_active = false;
        let passed = p.votes_for > p.votes_against;
        env.storage().instance().set(&Datakey::Proposal(id), &p);
        env.storage().instance().extend_ttl(5000, 5000);
        log!(&env, "Proposal {} finalised. Passed: {}", id, passed);
        passed
    }

    // View a proposal by ID
    pub fn view_proposal(env: Env, id: u64) -> Proposal {
        env.storage().instance()
            .get(&Datakey::Proposal(id))
            .unwrap_or(Proposal {
                id: 0,
                title: String::from_str(&env, "Not_Found"),
                descrip: String::from_str(&env, "Not_Found"),
                votes_for: 0,
                votes_against: 0,
                is_active: false,
            })
    }
}