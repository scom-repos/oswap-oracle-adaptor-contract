// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./OSWAP_OracleChainlinkPriceGuardBase.sol";
import "./OSWAP_OracleChainlinkBinance.sol";

contract OSWAP_OracleChainlinkPriceGuardBinance is OSWAP_OracleChainlinkBinance, OSWAP_OracleChainlinkPriceGuardBase {
    address constant bscWethPriceFeed = 0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE;
    constructor(address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) public
        OSWAP_OracleChainlinkBinance()
        OSWAP_OracleChainlinkPriceGuardBase(bscWethPriceFeed, _factory, _maxValue, _deviation, _returnAmmPrice)
    {
        decimals[0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47] = 18; // ADA
        decimals[0xa1faa113cbE53436Df28FF0aEe54275c13B40975] = 18; // ALPHA
        decimals[0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18] = 18; // BAND
        decimals[0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf] = 18; // BCH
        decimals[0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c] = 18; // BTC
        decimals[0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56] = 18; // BUSD
        decimals[0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82] = 18; // CAKE
        decimals[0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888] = 18; // CREAM
        decimals[0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3] = 18; // DAI
        decimals[0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402] = 18; // DOT
        decimals[0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6] = 18; // EOS
        decimals[0x2170Ed0880ac9A755fd29B2688956BD959F933F8] = 18; // ETH
        decimals[0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD] = 18; // LINK
        decimals[0x4338665CBB7B2485A8855A139b75D5e34AB0DB94] = 18; // LTC
        decimals[0x4B0F1812e5Df2A09796481Ff14017e6005508003] = 18; // TWT
        decimals[0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d] = 18; // USDC
        decimals[0x55d398326f99059fF775485246999027B3197955] = 18; // USDT
        decimals[0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE] = 18; // XRP
        decimals[0x16939ef78684453bfDFb47825F8a5F714f12623a] = 18; // XTZ
        decimals[0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e] = 18; // YFI
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkPriceGuardBase, OSWAP_OracleChainlinkBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
}
