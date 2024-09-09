// Welcome to the Mass Key Deletion recipe.

// This tool allows you to
// 1. Delete all your functionCall Access Keys
// 2. Delete all but one specified Full Access Key
// 3. Delete all Full Access Keys and Lock an Account

/// STEP 1 Install near-api-js
// npm init (in directory where you stored this script)
// npm i near-api-js

const nearAPI = require("near-api-js"); // imports near api js

// Standard setup to connect to NEAR While using Node
const { keyStores, KeyPair, connect, utils } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
let config;

// STEP 2 Choose your configuration.
// set this variable to either "testnet" or "mainnet"
// if you haven't used this before use testnet to experiment so you don't lose real tokens by deleting all your access keys
const configSetting = "testnet";

const GAS_FOR_NFT_APPROVE = "20000000000000";
const GAS_FOR_RESOLVE_TRANSFER = "10000000000000";
const GAS_FOR_NFT_TRANSFER = "30000000000000";
const MAX_GAS = "300000000000000";
const DEPOSIT = "450000000000000000000";

// setting configuration based on input
switch (configSetting) {
  case "mainnet":
    config = {
      networkId: "mainnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    };
    console.log("configuration set to mainnet ");

    break;

  case "testnet":
    config = {
      networkId: "testnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    console.log("configuration set to testnet ");
    break;
  default:
    console.log(`please choose a configuration `);
}

const STAKING_CONTRACT_ID = "terraspace_stake_test_2.xuguangxia.near";
const NFT_CONTRACT_ID = "near_now_mint_06.supernova11.testnet";
// const KOKUMO_CONTRACT_ID = "kokumokongz.near"

const Test = async () => {
  //Load Your Account
  const near = await connect(config);


  // send money to another wallet
  const account = await near.account("near_now_mint_06.supernova11.testnet");
  // let result = await account.sendMoney("supernova11.testnet", utils.format.parseNearAmount("2"));
  // console.log(result)

  // result = await account.getAccessKeys();
  // let tokenKeyExist = false;
  // for (let i = 0; i < result.length; i++) {
  //  if (result[i].access_key.permission != 'FullAccess' && result[i].access_key.permission.FunctionCall.receiver_id == NFT_CONTRACT_ID) {
  //   tokenKeyExist = true;
  //   break;
  //  }
  // }
  // if (tokenKeyExist == false) {
  //  console.log("Adding AccessKey to Token");
  //  const keyPair = KeyPair.fromRandom("ed25519");
  //  const publicKey = keyPair.publicKey.toString();
  //  await keyStore.setKey(config.networkId, publicKey, keyPair);
  //  await account.addKey(publicKey, NFT_CONTRACT_ID, [], '250000000000000000000000');
  // }

  // result = await account.viewFunction(
  //   NFT_CONTRACT_ID,
  //   "nft_metadata",
  //   {
  //   }
  // ); 
  // console.log("ContractMetadata:", result);

  // result = await account.viewFunction(
  //   STAKING_CONTRACT_ID,
  //   "get_nft_contract_ids",
  //   {
  //   }
  // );
  // console.log("NFTs:", result);

  result = await account.functionCall(
    NFT_CONTRACT_ID,
    "add_remain_ids",
    {
    },
    "1"
  )
  console.log(result, "add remain ids");

  // STAKING
  // result = await account.functionCall({
  //   contractId: STAKING_CONTRACT_ID,
  //   methodName: "append_nft_contract_id",
  //   args: {
  //     nft_contract_id: "kokumokongz.near",
  //   },
  //   gas: GAS_FOR_NFT_TRANSFER,
  // });

};

Test();
