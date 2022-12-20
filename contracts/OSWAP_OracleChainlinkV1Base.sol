// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/AggregatorV3Interface.sol";
import "./interfaces/IOSWAP_OracleAdaptor.sol";
import './libraries/SafeMath.sol';

abstract contract OSWAP_OracleChainlinkV1Base is IOSWAP_OracleAdaptor {
	using SafeMath for uint256;

    uint8 constant _DECIMALS = 18;
    uint256 constant DECIMALS = uint256(_DECIMALS);
    uint256 constant WEI = 10**DECIMALS;
    uint256 constant WEI_SQ = 10**(DECIMALS*2);

    address WETH;

    mapping (address => address) public priceFeedAddresses;

    function _getLatestPrice(address priceFeedAddress, bytes calldata /*payload*/) internal view returns (uint256 price, uint8 decimals) {
        require(priceFeedAddress != address(0), "OSWAP: price feed not found");
        (,int256 price1,,,) = AggregatorV3Interface(priceFeedAddress).latestRoundData();
        decimals = AggregatorV3Interface(priceFeedAddress).decimals();
        require(price1 > 0, "OSWAP_OracleChainlink: Negative or zero price");
        price = uint256(price1);
    }
    function getRatio(address from, address to, uint256 /*fromAmount*/, uint256 /*toAmount*/, bytes calldata payload) public view override virtual returns (uint256 numerator, uint256 denominator) {
        require(from != to, "OSWAP: from and to addresses are the same");
        if (from == WETH) {
            uint8 decimals;
            address fromEth = priceFeedAddresses[to];
            (denominator, decimals) = _getLatestPrice(fromEth, payload);
            numerator = 10**uint256(decimals);
        } else if (to == WETH) {
            uint8 decimals;
            address toEth = priceFeedAddresses[from];
            (numerator, decimals) = _getLatestPrice(toEth, payload);
            denominator = 10**uint256(decimals);
        } else {
            address toEth = priceFeedAddresses[from];
            uint8 decimals1;
            (numerator, decimals1) = _getLatestPrice(toEth, payload);

            address fromEth = priceFeedAddresses[to];
            uint8 decimals2;
            (denominator, decimals2) = _getLatestPrice(fromEth,  payload);

            if (decimals2 > decimals1){
                numerator = uint256(numerator).mul(10**(uint256(decimals2).sub(decimals1)));
            } else {
                denominator = uint256(denominator).mul(10**(uint256(decimals1).sub(decimals2)));
            }
        }
    }
    function isSupported(address from, address to) public view override virtual returns (bool supported) {
        if (from == WETH) {
            address fromEth = priceFeedAddresses[to];
            supported = (fromEth != address(0));
        } else if (to == WETH) {
            address toEth = priceFeedAddresses[from];
            supported = (toEth != address(0));
        } else {
            address toEth = priceFeedAddresses[from];
            address fromEth = priceFeedAddresses[to];
            supported = (toEth != address(0) && fromEth != address(0));
        }
    }
    function getLatestPrice(address from, address to, bytes calldata payload) external view override returns (uint256 price) {
        (uint256 numerator, uint256 denominator) = getRatio(from, to, 0, 0, payload);
        price = numerator.mul(WEI).div(denominator);
    }
    function decimals() external view override returns (uint8) {
        return _DECIMALS;
    }
}
