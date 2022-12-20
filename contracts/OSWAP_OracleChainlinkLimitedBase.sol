// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IFactory.sol";
import "./OSWAP_OracleChainlinkBase.sol";

abstract contract OSWAP_OracleChainlinkLimitedBase is OSWAP_OracleChainlinkBase {
    address public immutable factory;
    constructor(address _factory) public {
        factory = _factory;
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view virtual override returns (uint256 numerator, uint256 denominator) {
        if (fromAmount==0) {
            uint256 lotsize = IFactory(factory).minLotSize(to);
            if (lotsize != 0)
                require(toAmount < lotsize, "OSWAP: Over Limit");
        } else if (toAmount==0) {
            uint256 lotsize = IFactory(factory).minLotSize(from);
            if (lotsize != 0)
                require(fromAmount < lotsize, "OSWAP: Over Limit");
        }

        return OSWAP_OracleChainlinkBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
}
