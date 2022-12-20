// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IFactory.sol";
import "./interfaces/IPair.sol";
import "./OSWAP_OracleChainlinkFiatBase.sol";
import "./OSWAP_OracleChainlinkPriceGuardBase.sol";

abstract contract OSWAP_OracleChainlinkPriceGuardFiatBase is OSWAP_OracleChainlinkPriceGuardBase, OSWAP_OracleChainlinkFiatBase {
	using SafeMath for uint256;

    constructor(address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) 
        public 
        OSWAP_OracleChainlinkPriceGuardBase(address(0), _factory, _maxValue, _deviation, _returnAmmPrice)
    {
    }

    function _getRatio(address from, address to, uint256 fromAmount, uint256 toAmount) internal override view returns (uint256 usdAmount, uint256 numerator, uint256 denominator, uint112 reserve0, uint112 reserve1) {
        require(from != to, "OSWAP: from and to addresses are the same");
        require(from != address(0) && to != address(0), "OSWAP: Oracle: Invalid address");

        address toUsd = priceFeedAddresses[from];
        (numerator, ) = _getLatestPrice(toUsd);

        address fromUsd = priceFeedAddresses[to];
        (denominator, ) = _getLatestPrice(fromUsd);

        if (fromAmount == 0) {
            usdAmount = toAmount.mul(denominator).div(10**uint256(chainlinkDeicmals));
            usdAmount = convertEthDecimals(usdAmount, to);
        } else if (toAmount == 0) {
            usdAmount = fromAmount.mul(numerator).div(10**uint256(chainlinkDeicmals));
            usdAmount = convertEthDecimals(usdAmount, from);
        } else {
            revert("OracleAdaptor: Invalid amount");
        }

        address pair = IFactory(factory).getPair(from, to);
        require(address(pair) != address(0), "pair not exists");

        // from < to: amountout = amountin * reserve1 / reserve0
        // to < from: amountout = amountin * reserve0 / reserve1
        (reserve0, reserve1, ) = IPair(pair).getReserves();
        if (to < from)
            (reserve0, reserve1) = (reserve1, reserve0);
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override(OSWAP_OracleChainlinkPriceGuardBase, OSWAP_OracleChainlinkFiatBase) virtual returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view override(OSWAP_OracleChainlinkBase, OSWAP_OracleChainlinkFiatBase) virtual returns (bool supported) {
        return OSWAP_OracleChainlinkFiatBase.isSupported(from, to);
    }
}