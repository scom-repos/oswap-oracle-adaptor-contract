// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./OSWAP_OracleChainlinkLimitedBase.sol";
import "./OSWAP_OracleChainlink.sol";

contract OSWAP_OracleChainlinkLimited is OSWAP_OracleChainlink, OSWAP_OracleChainlinkLimitedBase {
    constructor(address factory) 
        public 
        OSWAP_OracleChainlink()
        OSWAP_OracleChainlinkLimitedBase(factory)
    {
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view 
        override (OSWAP_OracleChainlinkBase, OSWAP_OracleChainlinkLimitedBase) 
        returns (uint256 numerator, uint256 denominator) 
    {
        return OSWAP_OracleChainlinkLimitedBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
}
