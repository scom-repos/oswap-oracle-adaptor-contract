// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./OSWAP_OracleChainlinkFiatBase.sol";

contract OSWAP_OracleChainlinkFiatAvalanche is OSWAP_OracleChainlinkFiatBase {
    constructor() OSWAP_OracleChainlinkFiatBase() public {

        // Using the list of Chainlink symbol to address from 
        // https://docs.chain.link/docs/avalanche-price-feeds
        // and token list from 
        // https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json
        // https://raw.githubusercontent.com/pangolindex/tokenlists/main/top15.tokenlist.json
        // https://raw.githubusercontent.com/pangolindex/tokenlists/main/aeb.tokenlist.json
        // https://raw.githubusercontent.com/pangolindex/tokenlists/main/stablecoin.tokenlist.json

        priceFeedAddresses[0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7] = 0x0A77230d17318075983913bC2145DB16C7366156; // AVAX
        priceFeedAddresses[0x63a72806098Bd3D9520cC43356dD78afe5D386D9] = 0x3CA13391E9fb38a75330fb28f8cc2eB3D9ceceED; // AAVE
        priceFeedAddresses[0x2147EFFF675e4A4eE1C2f918d181cDBd7a8E208f] = 0x7B0ca9A6D03FE0467A31Ca850f5bcA51e027B3aF; // ALPHA
        priceFeedAddresses[0x027dbcA046ca156De9622cD1e2D907d375e53aa7] = 0xcf667FB6Bd30c520A435391c50caDcDe15e5e12f; // AMPL
        priceFeedAddresses[0x50b7545627a5162F82A992c33b87aDc75187B218] = 0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743; // BTC
        priceFeedAddresses[0x19860CCB0A68fd4213aB9D8266F7bBf05A8dDe98] = 0x827f8a0dC5c943F7524Dda178E2e7F275AAd743f; // BUSD.e
        priceFeedAddresses[0xd586E7F844cEa2F87f50152665BCbc2C279D8d70] = 0x51D7180edA2260cc4F6e4EebB82FEF5c3c2B8300; // DAI
        priceFeedAddresses[0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB] = 0x976B3D034E162d8bD72D6b9C989d545b839003b0; // ETH
        priceFeedAddresses[0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd] = 0x02D35d3a8aC3e1626d3eE09A78Dd87286F5E8e3a; // JOE
        priceFeedAddresses[0x5947BB275c521040051D82396192181b413227A3] = 0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a; // LINK
        priceFeedAddresses[0x130966628846BFd36ff31a822705796e8cb8C18D] = 0x54EdAB30a7134A16a54218AE64C73e1DAf48a8Fb; // MIM
        priceFeedAddresses[0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5] = 0x36E039e6391A5E7A7267650979fdf613f659be5D; // QI
        priceFeedAddresses[0xCE1bFFBD5374Dac86a2893119683F4911a2F7814] = 0x4F3ddF9378a4865cf4f28BE51E10AECb83B7daeE; // SPELL
        priceFeedAddresses[0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc] = 0x449A373A090d8A1e5F74c63Ef831Ceff39E94563; // SUSHI
        priceFeedAddresses[0x1C20E891Bab6b1727d14Da358FAe2984Ed9B59EB] = 0x9Cf3Ef104A973b351B2c032AA6793c3A6F76b448; // TUSD
        priceFeedAddresses[0xf39f9671906d8630812f9d9863bBEf5D523c84Ab] = 0x9a1372f9b1B71B3A5a72E092AE67E172dBd7Daaa; // UNI
        priceFeedAddresses[0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664] = 0xF096872672F44d6EBA71458D74fe67F9a77a23B9; // USDC.e
        priceFeedAddresses[0xc7198437980c041c805A1EDcbA50c1Ce5db95118] = 0xEBE676ee90Fe1112671f19b6B7459bC678B67e8a; // USDT.e
        priceFeedAddresses[0x260Bbf5698121EB85e7a74f2E45E16Ce762EbE11] = 0xf58B78581c480caFf667C63feDd564eCF01Ef86b; // UST
   }
}