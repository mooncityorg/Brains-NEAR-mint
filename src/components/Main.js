import React from "react";
import { WalletContext, APP_CONTRACT_ID, MAX_GAS } from "../contexts/connection"
import { parseNearAmount } from 'near-api-js/lib/utils/format'

const Main = () => {
  const [nftSupply, setNftSupply] = React.useState(0);
  const { wallet, provider } = React.useContext(WalletContext);
  const walletAddress = wallet?.getAccountId();

  const signIn = () => {
    console.log("trying to siginin with wallet ...")
    wallet.requestSignIn(APP_CONTRACT_ID);
  };

  const signOut = () => {
    wallet.signOut();
    window.location = "/"
  };

  const onWallet = () => {
    // console.log("ss")
    if (wallet.isSignedIn()) {
      signOut();
    } else {
      signIn();
    }
  }
  const onMint = async () => {

    let mint_price = "0.16";

    console.log(parseNearAmount(mint_price), "mint price");
    // return;
    await wallet.account().functionCall(
      APP_CONTRACT_ID,
      "nft_mint",
      {
      },
      MAX_GAS,
      parseNearAmount(mint_price)
    )
  }

  const updateNftSupply = async () => {
    // const supply = await provider?.viewFunction(APP_CONTRACT_ID, "nft_total_supply");
    const rawResult = await provider.query({
      request_type: "call_function",
      account_id: APP_CONTRACT_ID,
      method_name: "nft_total_supply",
      args_base64: "e30=",
      finality: "optimistic"
    });
    var supply = JSON.parse(Buffer.from(rawResult.result).toString());

    setNftSupply(supply);
  }

  React.useEffect(() => {
    if (wallet && wallet.isSignedIn())
      updateNftSupply();
  }, [wallet]);

  React.useEffect(() => {
    if (!provider)
      updateNftSupply();
  }, [provider]);


  return (
    <div className="main-page flex flex-col aic aic jc">
      <div className="wrapWidth wrap flex flex-col aic jc">

        <div className="action flex aic jc">

        </div>
        <div className="meta flex aic jc">
          <div className="desc">
            A PFP collection of {nftSupply} / 6800 Monkai NFTs on
            <br /> the NEAR blockchain.
            <br />
            Fair Launch, No whitelists, Minting now!{" "}
          </div>
        </div>
      </div>
      <div className="action2 flex aic">
        <div className="action flex aic jc btn-group">
          {
            wallet && wallet.isSignedIn() &&
            <span className="btn2 pointer" onClick={onMint}>
              <img src="/images/btn1.png" />

            </span>
          }
          {
            wallet && wallet.isSignedIn() &&
            <span>
              {
                walletAddress
              }
            </span>

          }
          <span onClick={onWallet} className="pointer">
            {
              (!wallet || !wallet.isSignedIn()) ?
                "Connect Wallet" : "Disconnet Wallet"
            }
          </span>

        </div>
        {/* <div className="action flex aic jc">
          <img src="/images/btn2.png" className="btn2 pointer" />
        </div> */}
      </div>
    </div>
  );
};

export default Main;
