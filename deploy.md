near create-account monkai_test01.supernova11.testnet --masterAccount supernova11.testnet --initialBalance 5

near deploy --accountId monkai_test01.supernova11.testnet --wasmFile out/nft.wasm --initFunction new --initArgs '{"owner_id": "supernova11.testnet"}' --initGas '300000000000000'
