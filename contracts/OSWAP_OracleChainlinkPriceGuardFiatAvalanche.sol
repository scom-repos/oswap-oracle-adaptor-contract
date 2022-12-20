// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./OSWAP_OracleChainlinkFiatAvalanche.sol";
import "./OSWAP_OracleChainlinkPriceGuardFiatBase.sol";

contract OSWAP_OracleChainlinkPriceGuardFiatAvalanche is OSWAP_OracleChainlinkFiatAvalanche, OSWAP_OracleChainlinkPriceGuardFiatBase {
    constructor(address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice)
        OSWAP_OracleChainlinkFiatAvalanche()
        OSWAP_OracleChainlinkPriceGuardFiatBase(_factory, _maxValue, _deviation, _returnAmmPrice)
        public 
    {
        decimals[0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7] = 18; // AVAX
        decimals[0x63a72806098Bd3D9520cC43356dD78afe5D386D9] = 18; // AAVE
        decimals[0x2147EFFF675e4A4eE1C2f918d181cDBd7a8E208f] = 18; // ALPHA
        decimals[0x027dbcA046ca156De9622cD1e2D907d375e53aa7] = 9; // AMPL
        decimals[0x50b7545627a5162F82A992c33b87aDc75187B218] = 8; // BTC
        decimals[0x19860CCB0A68fd4213aB9D8266F7bBf05A8dDe98] = 18; // BUSD.e
        decimals[0xd586E7F844cEa2F87f50152665BCbc2C279D8d70] = 18; // DAI
        decimals[0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB] = 18; // ETH
        decimals[0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd] = 18; // JOE
        decimals[0x5947BB275c521040051D82396192181b413227A3] = 18; // LINK
        decimals[0x130966628846BFd36ff31a822705796e8cb8C18D] = 18; // MIM
        decimals[0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5] = 18; // QI
        decimals[0xCE1bFFBD5374Dac86a2893119683F4911a2F7814] = 18; // SPELL
        decimals[0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc] = 18; // SUSHI
        decimals[0x1C20E891Bab6b1727d14Da358FAe2984Ed9B59EB] = 18; // TUSD
        decimals[0xf39f9671906d8630812f9d9863bBEf5D523c84Ab] = 18; // UNI
        decimals[0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664] = 6; // USDC.e
        decimals[0xc7198437980c041c805A1EDcbA50c1Ce5db95118] = 6; // USDT.e
        decimals[0x260Bbf5698121EB85e7a74f2E45E16Ce762EbE11] = 6; // UST
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (bool supported) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.isSupported(from, to);
    }
}