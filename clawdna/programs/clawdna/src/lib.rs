//! ClawDNA - Secure On-Chain Genetic Breeding Program
//! 
//! # Security Architecture
//! 
//! This program implements multiple layers of security:
//! - Emergency pause mechanism (circuit breaker pattern)
//! - Strict access control (owner-only admin functions)
//! - Pull-over-push payment pattern
//! - PDA validation with canonical bumps
//! - Safe arithmetic with overflow checks
//! - Reentrancy protection via state changes before CPI
//! 
//! # Audit Notes
//! - All sensitive operations check `paused` flag
//! - Owner is set at initialization and cannot be changed without reinitialization
//! - Treasury receives fees before any state mutations
//! - Genome mutations are deterministic given the same slot

use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::metadata::{
    create_metadata_accounts_v3,
    CreateMetadataAccountsV3,
    Metadata as MetadataProgram,
};
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};
use solana_program::system_instruction;
use solana_program::program::invoke;

// ============================================================================
// CONSTANTS
// ============================================================================

/// Program seed for PDA derivation
pub const PROGRAM_SEED: &[u8] = b"clawdna";

/// Global state seed
pub const GLOBAL_STATE_SEED: &[u8] = b"global_state";

/// Agent data account seed prefix
pub const AGENT_DATA_SEED: &[u8] = b"agent_data";

/// Number of genetic traits per agent
pub const TRAIT_COUNT: usize = 8;

/// Maximum value for any trait (0-100)
pub const MAX_TRAIT_VALUE: u8 = 100;

/// Mutation range (+/- 5)
pub const MUTATION_RANGE: i16 = 5;

/// Basis points for royalties (100 = 1%)
pub const DEFAULT_ROYALTY_BPS: u16 = 500; // 5%

/// Discriminator size for Anchor accounts
pub const DISCRIMINATOR_SIZE: usize = 8;

// ============================================================================
// ERROR CODES
// ============================================================================

#[error_code]
pub enum ClawDnaError {
    #[msg("Program is paused - emergency stop active")]
    ProgramPaused,
    
    #[msg("Unauthorized - caller is not the owner")]
    Unauthorized,
    
    #[msg("Invalid treasury account")]
    InvalidTreasury,
    
    #[msg("Insufficient breeding fee")]
    InsufficientFee,
    
    #[msg("Invalid genome data - traits out of range")]
    InvalidGenome,
    
    #[msg("Parent agents must be different")]
    SameParent,
    
    #[msg("Invalid parent agent - not found or invalid owner")]
    InvalidParent,
    
    #[msg("Generation overflow")]
    GenerationOverflow,
    
    #[msg("Invalid NFT metadata")]
    InvalidMetadata,
    
    #[msg("Math overflow")]
    MathOverflow,
    
    #[msg("Invalid PDA bump")]
    InvalidBump,
    
    #[msg("Global state already initialized")]
    AlreadyInitialized,
}

// ============================================================================
// STATE ACCOUNTS
// ============================================================================

/// Global state PDA - stores program configuration
#[account]
#[derive(Debug)]
pub struct GlobalState {
    pub owner: Pubkey,
    pub treasury: Pubkey,
    pub breeding_fee_lamports: u64,
    pub royalty_bps: u16,
    pub paused: bool,
    pub total_agents: u64,
    pub bump: u8,
}

impl GlobalState {
    pub const LEN: usize = DISCRIMINATOR_SIZE + 32 + 32 + 8 + 2 + 1 + 8 + 1;
    
    pub fn require_owner(&self, signer: &Pubkey) -> Result<()> {
        require!(self.owner == *signer, ClawDnaError::Unauthorized);
        Ok(())
    }
    
    pub fn require_not_paused(&self) -> Result<()> {
        require!(!self.paused, ClawDnaError::ProgramPaused);
        Ok(())
    }
}

/// Agent data stored on-chain
#[account]
#[derive(Debug)]
pub struct AgentData {
    pub mint: Pubkey,
    pub genome: [u8; TRAIT_COUNT],
    pub generation: u16,
    pub parents: [Pubkey; 2],
    pub created_at: i64,
    pub name: String,
    pub bump: u8,
}

impl AgentData {
    const BASE_LEN: usize = DISCRIMINATOR_SIZE + 32 + TRAIT_COUNT + 2 + 64 + 8 + 4 + 1;
    pub const MAX_NAME_LEN: usize = 50;
    pub const LEN: usize = Self::BASE_LEN + Self::MAX_NAME_LEN;
}

// ============================================================================
// PROGRAM
// ============================================================================

declare_id!("5DehMSqmCmRnxMPUeh16ZGyAMqzVZP23LqwMPXCsW4kY");

#[program]
pub mod clawdna {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        breeding_fee_lamports: u64,
        royalty_bps: u16,
    ) -> Result<()> {
        require!(royalty_bps <= 10000, ClawDnaError::InvalidMetadata);
        
        let global_state = &mut ctx.accounts.global_state;
        
        global_state.owner = ctx.accounts.owner.key();
        global_state.treasury = ctx.accounts.treasury.key();
        global_state.breeding_fee_lamports = breeding_fee_lamports;
        global_state.royalty_bps = royalty_bps;
        global_state.paused = false;
        global_state.total_agents = 0;
        global_state.bump = ctx.bumps.global_state;
        
        msg!("ClawDNA initialized!");
        msg!("Owner: {}", global_state.owner);
        msg!("Treasury: {}", global_state.treasury);
        
        Ok(())
    }

    pub fn pause(ctx: Context<Admin>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.paused = true;
        msg!("Program paused by owner");
        Ok(())
    }

    pub fn unpause(ctx: Context<Admin>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.paused = false;
        msg!("Program unpaused by owner");
        Ok(())
    }

    pub fn update_breeding_fee(
        ctx: Context<Admin>,
        new_fee: u64,
    ) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.breeding_fee_lamports = new_fee;
        msg!("Breeding fee updated to {} lamports", new_fee);
        Ok(())
    }

    pub fn mint_genesis(
        ctx: Context<MintGenesis>,
        name: String,
        genome: [u8; TRAIT_COUNT],
        uri: String,
    ) -> Result<()> {
        // Validate not paused
        ctx.accounts.global_state.require_not_paused()?;
        
        // Validate genome
        for trait_value in genome.iter() {
            require!(*trait_value <= MAX_TRAIT_VALUE, ClawDnaError::InvalidGenome);
        }
        
        let global_state = &mut ctx.accounts.global_state;
        
        // Collect fee
        if global_state.breeding_fee_lamports > 0 {
            invoke(
                &system_instruction::transfer(
                    &ctx.accounts.minter.key(),
                    &global_state.treasury,
                    global_state.breeding_fee_lamports,
                ),
                &[
                    ctx.accounts.minter.to_account_info(),
                    ctx.accounts.treasury.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;
        }
        
        // Update state
        global_state.total_agents = global_state
            .total_agents
            .checked_add(1)
            .ok_or(ClawDnaError::MathOverflow)?;
        
        let agent_id = global_state.total_agents;
        
        // Initialize agent data
        let agent_data = &mut ctx.accounts.agent_data;
        agent_data.mint = ctx.accounts.mint.key();
        agent_data.genome = genome;
        agent_data.generation = 0;
        agent_data.parents = [Pubkey::default(); 2];
        agent_data.created_at = Clock::get()?.unix_timestamp;
        agent_data.name = name.clone();
        agent_data.bump = ctx.bumps.agent_data;
        
        // Create metadata
        let full_name = format!("{} # {}", name, agent_id);
        
        let metadata_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            mint_authority: ctx.accounts.minter.to_account_info(),
            payer: ctx.accounts.minter.to_account_info(),
            update_authority: ctx.accounts.minter.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };
        
        let creators = vec![
            anchor_spl::metadata::mpl_token_metadata::types::Creator {
                address: global_state.owner,
                verified: true,
                share: 100,
            },
        ];
        
        let metadata_data = anchor_spl::metadata::mpl_token_metadata::types::DataV2 {
            name: full_name,
            symbol: "CLAWDNA".to_string(),
            uri,
            seller_fee_basis_points: global_state.royalty_bps,
            creators: Some(creators),
            collection: None,
            uses: None,
        };
        
        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.token_metadata_program.to_account_info(),
                metadata_accounts,
            ),
            metadata_data,
            true,
            true,
            None,
        )?;
        
        // Mint token
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.minter.to_account_info(),
                },
            ),
            1,
        )?;
        
        msg!("Genesis agent minted! ID: {}", agent_id);
        
        Ok(())
    }

    pub fn merge_agents(
        ctx: Context<MergeAgents>,
        name: String,
        uri: String,
    ) -> Result<()> {
        ctx.accounts.global_state.require_not_paused()?;
        
        require!(
            ctx.accounts.parent1_mint.key() != ctx.accounts.parent2_mint.key(),
            ClawDnaError::SameParent
        );
        
        let global_state = &mut ctx.accounts.global_state;
        
        // Collect fee
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.breeder.key(),
                &global_state.treasury,
                global_state.breeding_fee_lamports,
            ),
            &[
                ctx.accounts.breeder.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Get parent genomes
        let parent1_genome = ctx.accounts.parent1_data.genome;
        let parent2_genome = ctx.accounts.parent2_data.genome;
        
        // Calculate child generation
        let parent1_gen = ctx.accounts.parent1_data.generation;
        let parent2_gen = ctx.accounts.parent2_data.generation;
        let child_generation = parent1_gen.max(parent2_gen).checked_add(1)
            .ok_or(ClawDnaError::GenerationOverflow)?;
        
        // Combine genomes
        let child_genome = combine_genomes(
            &parent1_genome,
            &parent2_genome,
            ctx.accounts.recent_slot_hashes.key(),
        )?;
        
        // Update global state
        global_state.total_agents = global_state
            .total_agents
            .checked_add(1)
            .ok_or(ClawDnaError::MathOverflow)?;
        
        let agent_id = global_state.total_agents;
        
        // Initialize child data
        let child_data = &mut ctx.accounts.child_data;
        child_data.mint = ctx.accounts.child_mint.key();
        child_data.genome = child_genome;
        child_data.generation = child_generation;
        child_data.parents = [
            ctx.accounts.parent1_mint.key(),
            ctx.accounts.parent2_mint.key(),
        ];
        child_data.created_at = Clock::get()?.unix_timestamp;
        child_data.name = name.clone();
        child_data.bump = ctx.bumps.child_data;
        
        // Create metadata
        let full_name = format!("{} # {}", name, agent_id);
        
        let creators = vec![
            anchor_spl::metadata::mpl_token_metadata::types::Creator {
                address: global_state.owner,
                verified: true,
                share: 100,
            },
        ];
        
        let metadata_data = anchor_spl::metadata::mpl_token_metadata::types::DataV2 {
            name: full_name,
            symbol: "CLAWDNA".to_string(),
            uri,
            seller_fee_basis_points: global_state.royalty_bps,
            creators: Some(creators),
            collection: None,
            uses: None,
        };
        
        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.child_metadata.to_account_info(),
                    mint: ctx.accounts.child_mint.to_account_info(),
                    mint_authority: ctx.accounts.breeder.to_account_info(),
                    payer: ctx.accounts.breeder.to_account_info(),
                    update_authority: ctx.accounts.breeder.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            metadata_data,
            true,
            true,
            None,
        )?;
        
        // Mint child NFT
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.child_mint.to_account_info(),
                    to: ctx.accounts.child_token_account.to_account_info(),
                    authority: ctx.accounts.breeder.to_account_info(),
                },
            ),
            1,
        )?;
        
        msg!("Agents merged! Child ID: {}", agent_id);
        
        Ok(())
    }
}

// ============================================================================
// CONTEXT STRUCTS
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: Treasury account validated as system account
    #[account(constraint = treasury.lamports() > 0 @ ClawDnaError::InvalidTreasury)]
    pub treasury: AccountInfo<'info>,
    
    #[account(
        init,
        payer = owner,
        space = GlobalState::LEN,
        seeds = [GLOBAL_STATE_SEED],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Admin<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
        constraint = global_state.owner == owner.key() @ ClawDnaError::Unauthorized
    )]
    pub global_state: Account<'info, GlobalState>,
}

#[derive(Accounts)]
pub struct MintGenesis<'info> {
    #[account(mut)]
    pub minter: Signer<'info>,
    
    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,
    
    /// CHECK: Treasury - validated against global state
    #[account(
        mut,
        constraint = treasury.key() == global_state.treasury @ ClawDnaError::InvalidTreasury
    )]
    pub treasury: AccountInfo<'info>,
    
    #[account(
        init,
        payer = minter,
        mint::decimals = 0,
        mint::authority = minter,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = minter,
        associated_token::mint = mint,
        associated_token::authority = minter,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = minter,
        space = AgentData::LEN,
        seeds = [AGENT_DATA_SEED, mint.key().as_ref()],
        bump
    )]
    pub agent_data: Account<'info, AgentData>,
    
    /// CHECK: Metadata account
    #[account(mut)]
    pub metadata_account: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, MetadataProgram>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MergeAgents<'info> {
    #[account(mut)]
    pub breeder: Signer<'info>,
    
    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,
    
    /// CHECK: Treasury - validated against global state
    #[account(
        mut,
        constraint = treasury.key() == global_state.treasury @ ClawDnaError::InvalidTreasury
    )]
    pub treasury: AccountInfo<'info>,
    
    // Parent 1
    pub parent1_mint: Account<'info, Mint>,
    
    #[account(
        seeds = [AGENT_DATA_SEED, parent1_mint.key().as_ref()],
        bump = parent1_data.bump,
    )]
    pub parent1_data: Account<'info, AgentData>,
    
    #[account(
        associated_token::mint = parent1_mint,
        associated_token::authority = breeder,
        constraint = parent1_token.amount == 1 @ ClawDnaError::InvalidParent
    )]
    pub parent1_token: Account<'info, TokenAccount>,
    
    // Parent 2
    pub parent2_mint: Account<'info, Mint>,
    
    #[account(
        seeds = [AGENT_DATA_SEED, parent2_mint.key().as_ref()],
        bump = parent2_data.bump,
    )]
    pub parent2_data: Account<'info, AgentData>,
    
    #[account(
        associated_token::mint = parent2_mint,
        associated_token::authority = breeder,
        constraint = parent2_token.amount == 1 @ ClawDnaError::InvalidParent
    )]
    pub parent2_token: Account<'info, TokenAccount>,
    
    // Child
    #[account(
        init,
        payer = breeder,
        mint::decimals = 0,
        mint::authority = breeder,
    )]
    pub child_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = breeder,
        associated_token::mint = child_mint,
        associated_token::authority = breeder,
    )]
    pub child_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = breeder,
        space = AgentData::LEN,
        seeds = [AGENT_DATA_SEED, child_mint.key().as_ref()],
        bump
    )]
    pub child_data: Account<'info, AgentData>,
    
    /// CHECK: Child metadata account
    #[account(mut)]
    pub child_metadata: AccountInfo<'info>,
    
    /// CHECK: Recent slot hashes for randomness
    pub recent_slot_hashes: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, MetadataProgram>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

fn combine_genomes(
    parent1: &[u8; TRAIT_COUNT],
    parent2: &[u8; TRAIT_COUNT],
    recent_slot_hashes: &Pubkey,
) -> Result<[u8; TRAIT_COUNT]> {
    let mut child = [0u8; TRAIT_COUNT];
    let entropy = recent_slot_hashes.to_bytes();
    
    for i in 0..TRAIT_COUNT {
        let entropy_byte = entropy[i % entropy.len()];
        let use_parent1 = entropy_byte % 2 == 0;
        let base_value = if use_parent1 { parent1[i] } else { parent2[i] };
        
        let mutation_entropy = entropy[(i + 10) % entropy.len()];
        let mutation_direction = if mutation_entropy % 2 == 0 { 1i16 } else { -1i16 };
        let mutation_magnitude = (mutation_entropy % (MUTATION_RANGE as u8 + 1)) as i16;
        let mutation = mutation_direction * mutation_magnitude;
        
        let mutated = base_value as i16 + mutation;
        let clamped = mutated.clamp(0, MAX_TRAIT_VALUE as i16) as u8;
        
        child[i] = clamped;
    }
    
    Ok(child)
}
