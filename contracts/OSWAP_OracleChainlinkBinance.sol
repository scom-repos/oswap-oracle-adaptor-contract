// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./OSWAP_OracleChainlinkBase.sol";

contract OSWAP_OracleChainlinkBinance is OSWAP_OracleChainlinkBase {
    address public constant _WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    constructor() OSWAP_OracleChainlinkBase(_WBNB) public {
        // Using the list of Chainlink symbol to address from 
        // https://docs.chain.link/docs/binance-smart-chain-addresses
        // and token list from 
        // https://github.com/pancakeswap/pancake-swap-interface/blob/master/src/constants/token/pancakeswap.json

        priceFeedAddresses[0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47] = 0x2d5Fc41d1365fFe13d03d91E82e04Ca878D69f4B; // ADA
        priceFeedAddresses[0xa1faa113cbE53436Df28FF0aEe54275c13B40975] = 0x7bC032A7C19B1BdCb981D892854d090cfB0f238E; // ALPHA
        priceFeedAddresses[0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18] = 0x3334bF7ec892Ca03D1378B51769b7782EAF318C4; // BAND
        priceFeedAddresses[0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf] = 0x2a548935a323Bb7329a5E3F1667B979f16Bc890b; // BCH
        priceFeedAddresses[0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c] = 0x116EeB23384451C78ed366D4f67D5AD44eE771A0; // BTC
        priceFeedAddresses[0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56] = 0x87Ea38c9F24264Ec1Fff41B04ec94a97Caf99941; // BUSD
        priceFeedAddresses[0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82] = 0xcB23da9EA243f53194CBc2380A6d4d9bC046161f; // CAKE
        priceFeedAddresses[0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888] = 0x6f55DFAf098a813d87BB4e6392275b502360Bb9D; // CREAM
        priceFeedAddresses[0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3] = 0x8EC213E7191488C7873cEC6daC8e97cdbAdb7B35; // DAI
        priceFeedAddresses[0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402] = 0xBA8683E9c3B1455bE6e18E7768e8cAD95Eb5eD49; // DOT
        priceFeedAddresses[0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6] = 0xed93F3764334788f2f6628b30e505fe1fc5d1D7b; // EOS
        priceFeedAddresses[0x2170Ed0880ac9A755fd29B2688956BD959F933F8] = 0x63D407F32Aa72E63C7209ce1c2F5dA40b3AaE726; // ETH
        priceFeedAddresses[0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD] = 0xB38722F6A608646a538E882Ee9972D15c86Fc597; // LINK
        priceFeedAddresses[0x4338665CBB7B2485A8855A139b75D5e34AB0DB94] = 0x4e5a43A79f53c0a8e83489648Ea7e429278f8b2D; // LTC
        priceFeedAddresses[0x4B0F1812e5Df2A09796481Ff14017e6005508003] = 0x7E728dFA6bCa9023d9aBeE759fDF56BEAb8aC7aD; // TWT
        priceFeedAddresses[0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d] = 0x45f86CA2A8BC9EBD757225B19a1A0D7051bE46Db; // USDC
        priceFeedAddresses[0x55d398326f99059fF775485246999027B3197955] = 0xD5c40f5144848Bd4EF08a9605d860e727b991513; // USDT
        priceFeedAddresses[0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE] = 0x798A65D349B2B5E6645695912880b54dfFd79074; // XRP
        priceFeedAddresses[0x16939ef78684453bfDFb47825F8a5F714f12623a] = 0x8264d6983B219be65C4D62f1c82B3A2999944cF2; // XTZ
        priceFeedAddresses[0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e] = 0xF841761481DF19831cCC851A54D8350aE6022583; // YFI
    }
}