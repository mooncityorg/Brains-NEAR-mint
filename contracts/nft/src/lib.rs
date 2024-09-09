use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet, Vector};
use near_sdk::json_types::{Base64VecU8, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, PromiseOrValue,
};
use std::collections::HashMap;
use std::convert::TryInto;
use std::iter::Extend;

pub use crate::approval::*;
pub use crate::events::*;
use crate::internal::*;
pub use crate::metadata::*;
pub use crate::mint::*;
pub use crate::nft_core::*;
pub use crate::royalty::*;

mod approval;
mod enumeration;
mod events;
mod internal;
mod metadata;
mod mint;
mod nft_core;
mod royalty;

/// This spec can be treated like a version of the standard.
pub const NFT_METADATA_SPEC: &str = "nft-1.0.0";
/// This is the name of the NFT standard we're using
pub const NFT_STANDARD_NAME: &str = "nep171";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    //contract owner
    pub owner_id: AccountId,

    //keeps track of all the token IDs for a given account
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,

    //keeps track of the token struct for a given token ID
    pub tokens_by_id: LookupMap<TokenId, Token>,

    //keeps track of the token metadata for a given token ID
    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,

    pub remain_ids: Vector<String>,

    //keeps track of the metadata for the contract
    pub metadata: LazyOption<NFTContractMetadata>,
    pub contributor_8: Vector<AccountId>,

}

/// Helper structure for keys of the persistent collections.
#[derive(BorshSerialize)]
pub enum StorageKey {
    TokensPerOwner,
    TokenPerOwnerInner { account_id_hash: CryptoHash },
    TokensById,
    TokenMetadataById,
    NFTContractMetadata,
    TokensPerType,
    TokensPerTypeInner { token_type_hash: CryptoHash },
    TokenTypesLocked,
    Contributor0,
    Contributor8,
    RemainIds,
}

#[near_bindgen]
impl Contract {
    /*
        initialization function (can only be called once).
        this initializes the contract with metadata that was passed in and
        the owner_id.
    */
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        //create a variable of type Self with all the fields initialized.
        let mut this = Self {
            //Storage keys are simply the prefixes used for the collections. This helps avoid data collision
            tokens_per_owner: LookupMap::new(StorageKey::TokensPerOwner.try_to_vec().unwrap()),
            tokens_by_id: LookupMap::new(StorageKey::TokensById.try_to_vec().unwrap()),
            token_metadata_by_id: UnorderedMap::new(
                StorageKey::TokenMetadataById.try_to_vec().unwrap(),
            ),
            //set the owner_id field equal to the passed in owner_id. 
            owner_id,
            metadata: LazyOption::new(
                StorageKey::NFTContractMetadata.try_to_vec().unwrap(),
                Some(&&NFTContractMetadata {
                    spec: "nft-1.0.0".to_string(),
                    name: "Monkai".to_string(),
                    symbol: "MONK".to_string(),
                    icon: None,
                    base_uri: Some("https://gateway.pinata.cloud/ipfs/QmWbnSj69LorKtA2cDNh8yLTCn526smdXzKUxGMK2Ve9qn".to_owned()),
                    reference: None,
                    reference_hash: None,
                })),
            
            remain_ids: Vector::new(StorageKey::RemainIds.try_to_vec().unwrap()),
            contributor_8: Vector::new(StorageKey::Contributor8.try_to_vec().unwrap()),

        };        

        for i in 1..1000 {
            this.remain_ids.push(&i.to_string());
        }
        this
    }

    pub fn add_remain_ids(&mut self) {
        self.assert_owner();
        for i in self.remain_ids.len()..self.remain_ids.len()+6000 {
            if self.remain_ids.len() >6800 {
                break;
            }
            self.remain_ids.push(&i.to_string());
        }
    }

    pub fn get_contributor_8(&self) -> Vec<AccountId> {
        self.contributor_8.to_vec()
    }

    #[payable]
    pub fn init_whitelist_8(
        &mut self,
    ) {
        assert_eq!(
            &env::predecessor_account_id(),
            &self.owner_id,
            "Owner's method"
        );
        self.contributor_8.push(&"supernova11.testnet".to_string().try_into().unwrap());

    }


}
