use crate::*;

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn nft_mint(&mut self) {
        assert!(self.token_metadata_by_id.len() <= 6800, "Minting ended");

        let account_id = env::predecessor_account_id();

        let amount = env::attached_deposit();

        if amount != 160000000000000000000000 {
            env::panic(b"Require correct amount of Near attached");
        }

        let index = (env::block_timestamp() / 1000000) % self.remain_ids.len();
        let token_id = self.remain_ids.get(index).unwrap();
        self.remain_ids.swap_remove(index);

        //measure the initial storage being used on the contract
        let initial_storage_usage = env::storage_usage();

        // create a royalty map to store in the token
        let mut royalty = HashMap::new();
        royalty.insert("supernova11.testnet".to_string().try_into().unwrap(), 850);
        // royalty.insert("zerotime.near".to_string().try_into().unwrap(), 200);
        // royalty.insert("luciddream.near".to_string().try_into().unwrap(), 200);

        //specify the token struct that contains the owner ID
        let token = Token {
            //set the owner ID equal to the receiver ID passed into the function
            owner_id: account_id,
            //we set the approved account IDs to the default value (an empty map)
            approved_account_ids: Default::default(),
            //the next approval ID is set to 0
            next_approval_id: 0,
            //the map of perpetual royalties for the token (The owner will get 100% - total perpetual royalties)
            royalty,
        };

        //insert the token ID and token struct and make sure that the token doesn't exist
        assert!(
            self.tokens_by_id.insert(&token_id, &token).is_none(),
            "Token already exists"
        );

        //insert the token ID and metadata
        self.token_metadata_by_id.insert(
            &token_id,
            &TokenMetadata {
                title: Some("Monkai #".to_owned() + token_id.as_ref()),
                description: Some("Monkai are the first Multi-chain Generative GIF NFTs on ETH, SOL and NEAR bringing new DeFi stake + farm tokenomics to the Blockchain. Visit https://monkainft.com/".to_owned()),
                media: Some(token_id.clone() + ".png"),
                media_hash: None,
                copies: None,
                issued_at: Some(env::block_timestamp() / 1000000),
                expires_at: None,
                starts_at: None,
                updated_at: None,
                extra: None,
                reference: Some(token_id.clone() + ".json"),
                reference_hash: None,
            },
        );

        //call the internal method for adding the token to the owner
        self.internal_add_token_to_owner(&token.owner_id, &token_id);
        // Promise::new("supernova11.testnet".to_string().try_into().unwrap()).transfer(333000000000000000000000);

        // Construct the mint log as per the events standard.
        let nft_mint_log: EventLog = EventLog {
            // Standard name ("nep171").
            standard: NFT_STANDARD_NAME.to_string(),
            // Version of the standard ("nft-1.0.0").
            version: NFT_METADATA_SPEC.to_string(),
            // The data related with the event stored in a vector.
            event: EventLogVariant::NftMint(vec![NftMintLog {
                // Owner of the token.
                owner_id: token.owner_id.to_string(),
                // Vector of token IDs that were minted.
                token_ids: vec![token_id.to_string()],
                // An optional memo to include.
                memo: None,
            }]),
        };

        // Log the serialized json.
        env::log_str(&nft_mint_log.to_string());

        // //calculate the required storage which was the used - initial
        // let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;

        // //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
        // refund_deposit(required_storage_in_bytes);
    }
}
