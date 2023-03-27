import { Networks } from "../constants/blockchain";

// const switchRequest = () => {
//     return window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: "0x61" }],
//     });
// };
//
// const addChainRequest = () => {
//     return window.ethereum.request({
//         method: "wallet_addEthereumChain",
//         params: [
//             {
//                 chainId: "0x61",
//                 chainName: "BSC - Tesnet",
//                 rpcUrls: ["https://data-seed-prebsc-2-s2.binance.org:8545"],
//                 blockExplorerUrls: ["https://testnet.bscscan.com"],
//                 nativeCurrency: {
//                     name: "BSC",
//                     symbol: "BSC",
//                     decimals: 18,
//                 },
//             },
//         ],
//     });
// };
//
// export const swithNetwork = async () => {
//     if (window.ethereum) {
//         try {
//             await switchRequest();
//         } catch (error: any) {
//             if (error.code === 4902) {
//                 try {
//                     await addChainRequest();
//                     await switchRequest();
//                 } catch (addError) {
//                     console.log(error);
//                 }
//             }
//             console.log(error);
//         }
//     }
// };

const switchRequest = (provider: any) => provider.send('wallet_switchEthereumChain', [
    {
        chainId: "0x66EED"
    }
]);

const addChainRequest = (provider: any) => provider.send('wallet_addEthereumChain', [
    {
        chainId: "0x66EED",
        chainName: "Arbitrum - Goerli",
        rpcUrls: ["https://arbitrum-goerli.public.blastapi.io"],
        blockExplorerUrls: ["https://goerli.arbiscan.io/"],
        nativeCurrency: {
            name: "AGOR",
            symbol: "AGOR",
            decimals: 18,
        },
    },
]);

export const swithNetwork = async (provider: any) => {
    if (provider) {
        try {
            await switchRequest(provider);
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await addChainRequest(provider);
                    await switchRequest(provider);
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};
