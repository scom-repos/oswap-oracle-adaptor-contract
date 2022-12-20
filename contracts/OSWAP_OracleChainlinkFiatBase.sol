// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./OSWAP_OracleChainlinkBase.sol";

abstract contract OSWAP_OracleChainlinkFiatBase is OSWAP_OracleChainlinkBase {
    constructor() OSWAP_OracleChainlinkBase(address(0)) public {
        chainlinkDeicmals = 8;
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override virtual returns (uint256 numerator, uint256 denominator) {
        require(from != address(0) && to != address(0), "OSWAP: Oracle: Invalid address");
        return super.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view override virtual returns (bool supported) {
        if (from == address(0) || to == address(0)) {
            return false;
        }
        return super.isSupported(from, to);
    }
}
