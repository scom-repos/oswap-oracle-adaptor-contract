// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./OSWAP_OracleChainlinkFiatBinance.sol";
import "./OSWAP_OracleChainlinkPriceGuardFiatBase.sol";

contract OSWAP_OracleChainlinkPriceGuardFiatBinance is OSWAP_OracleChainlinkFiatBinance, OSWAP_OracleChainlinkPriceGuardFiatBase {
    constructor(address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice)
        OSWAP_OracleChainlinkFiatBinance()
        OSWAP_OracleChainlinkPriceGuardFiatBase(_factory, _maxValue, _deviation, _returnAmmPrice)
        public 
    {
        decimals[0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c] = 18; // WBNB
        decimals[0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47] = 18; // ADA
        decimals[0x0Eb3a705fc54725037CC9e008bDede697f62F335] = 18; // ATOM
        decimals[0xa184088a740c695E156F91f5cC086a06bb78b827] = 18; // AUTO
        decimals[0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf] = 18; // BCH
        decimals[0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c] = 18; // BTC
        decimals[0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56] = 18; // BUSD
        decimals[0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82] = 18; // CAKE
        decimals[0x52CE071Bd9b1C4B00A0b92D298c512478CaD67e8] = 18; // COMP
        decimals[0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3] = 18; // DAI
        decimals[0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402] = 18; // DOT
        decimals[0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6] = 18; // EOS
        decimals[0x2170Ed0880ac9A755fd29B2688956BD959F933F8] = 18; // ETH
        decimals[0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153] = 18; // FIL
        decimals[0x762539b45A1dCcE3D36d080F74d1AED37844b878] = 18; // LINA
        decimals[0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD] = 18; // LINK
        decimals[0x4338665CBB7B2485A8855A139b75D5e34AB0DB94] = 18; // LTC
        decimals[0xFd7B3A77848f1C2D67E05E54d78d174a0C850335] = 18; // ONT
        decimals[0x8519EA49c997f50cefFa444d240fB655e89248Aa] = 18; // RAMP
        decimals[0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A] = 18; // SXP
        decimals[0xBf5140A22578168FD562DCcF235E5D43A02ce9B1] = 18; // UNI
        decimals[0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d] = 18; // USDC
        decimals[0x55d398326f99059fF775485246999027B3197955] = 18; // USDT
        decimals[0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7] = 18; // VAI
        decimals[0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE] = 18; // XRP
        decimals[0x16939ef78684453bfDFb47825F8a5F714f12623a] = 18; // XTZ
        decimals[0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63] = 18; // XVS
        decimals[0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e] = 18; // YFI
        decimals[0x7F70642d88cf1C4a3a7abb072B53B929b653edA5] = 18; // YFII
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (bool supported) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.isSupported(from, to);
    }
}