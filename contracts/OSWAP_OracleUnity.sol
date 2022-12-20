// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IOSWAP_OracleAdaptor.sol";

contract OSWAP_OracleUnity is IOSWAP_OracleAdaptor {
    uint8 constant DECIMALS = 18;
    uint256 constant WEI = 10**uint256(DECIMALS);

    function isSupported(address /*from*/, address /*to*/) external view override returns (bool supported) {
        return true;
    }
    function getRatio(address /*from*/, address /*to*/, uint256 /*fromAmount*/, uint256 /*toAmount*/, bytes calldata /*payload*/) external view override returns (uint256 numerator, uint256 denominator) {
        numerator = 1;
        denominator = 1;
    }
    function getLatestPrice(address /*from*/, address /*to*/, bytes calldata /*payload*/) external view override returns (uint256 price){
        return WEI;
    }
    function decimals() external view override returns (uint8) {
        return DECIMALS;
    }
}
