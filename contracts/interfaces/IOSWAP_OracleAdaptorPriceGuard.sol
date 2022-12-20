// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./IOSWAP_OracleAdaptor.sol";

interface IOSWAP_OracleAdaptorPriceGuard is IOSWAP_OracleAdaptor {
    function getPriceInfo(address from, address to, uint256 fromAmount, uint256 toAmount) external view returns (uint256 chainlinkPrice, uint256 ammPrice, uint256 usdAmount);
}