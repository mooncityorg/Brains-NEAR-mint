import * as nearAPI from "near-api-js";
import React, { useCallback, useEffect, useState, useMemo } from "react";

const { keyStores, connect, WalletConnection, providers } = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

export const APP_CONTRACT_ID = "monkai_test02.supernova11.testnet";



export const YOCTOS_PER_NEAR = 1000000000000000000000000;


export const GAS_FOR_FT_APPROVE = "20000000000000";
export const GAS_FOR_RESOLVE_TRANSFER = "5000000000000";
export const MAX_GAS = "300000000000000";
export const DEPOSIT = "450000000000000000000";

export const WalletContext = React.createContext({
    near: undefined,
    wallet: undefined,
    nftList: [],
    stakedNftList: [],
    provider: undefined,
    fetchNFTs: () => { },
    fetchStakedNFTs: () => { },
})
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
export const floor10 = (value, exp) => decimalAdjust('floor', value, exp);


// connect to NEAR
const WalletProvider = (props) => {
    const [near, setNear] = useState()
    const [wallet, setWallet] = useState()
    const [nftList, setNftList] = useState([])
    const [stakedNftList, setStakedNftList] = useState([])

    const config = {
        networkId: "testnet",
        keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };


    const provider = useMemo(
        () => new providers.JsonRpcProvider(config.nodeUrl),
        [config.nodeUrl]
    )
    const connectToNear = useCallback(async () => {
        try {
            const near = await connect(config);
            const wallet = new WalletConnection(near);
            setNear(near);
            setWallet(wallet);
        } catch (error) {
            console.log(error, "error")
        }
    }, [config])





    useEffect(() => {
    }, [connectToNear])

    useEffect(() => {
        connectToNear()
    }, [])

    return (
        <WalletContext.Provider
            value={{ near, wallet, provider }}
        >
            {props.children}
        </WalletContext.Provider>
    )
}

export default WalletProvider
