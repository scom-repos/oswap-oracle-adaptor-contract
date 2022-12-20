// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IOSWAP_OracleAdaptor.sol";

contract OSWAP_OracleSetYourOwnPrice is IOSWAP_OracleAdaptor {
    uint8 constant _DECIMALS = 18;
    uint256 constant DECIMALS = uint256(_DECIMALS);
    uint256 constant WEI = 10**DECIMALS;

    function isSupported(address /*from*/, address /*to*/) external view override returns (bool supported) {
        return true;
    }
    function getRatio(address from, address to, uint256 /*fromAmount*/, uint256 /*toAmount*/, bytes memory payload) external view virtual override returns (uint256 numerator, uint256 denominator) {
        numerator = getLatestPrice(from, to, payload);
        denominator = WEI;
    }
    function getLatestPrice(address /*from*/, address /*to*/, bytes memory payload) public view override returns (uint256 price){
        assembly {
            price := mload(add(payload, 0x20))
        }
    }
    function decimals() external view override returns (uint8) {
        return _DECIMALS;
    }
}
