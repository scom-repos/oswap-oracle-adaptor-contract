// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IERC20.sol";
import "./OSWAP_OracleChainlinkBase.sol";
import "./OSWAP_OracleChainlinkFiatBase.sol";
import "./OSWAP_OracleChainlinkPriceGuardBase.sol";
import "./OSWAP_OracleChainlinkPriceGuardFiatBase.sol";
import "./OSWAP_OracleChainlinkV1Base.sol";
import "./OSWAP_OracleChainlinkLimitedBase.sol";

abstract contract OSWAP_OracleChainlinkGenericBase is OSWAP_OracleChainlinkBase {
    constructor(address[] memory _tokens, address[] memory _pricefeeds) 
        public 
    {
        require(_tokens.length == _pricefeeds.length, "Array length not match");
        uint256 length = _tokens.length;
        for (uint256 i = 0 ; i < length ; i++ ) {
            address token = _tokens[i];
            require(priceFeedAddresses[token] == address(0), "price feed already exists");
            priceFeedAddresses[token] = _pricefeeds[i];
        }
    }
}

contract OSWAP_OracleChainlinkGeneric is OSWAP_OracleChainlinkGenericBase {
    constructor(address _weth, address[] memory _tokens, address[] memory _pricefeeds) 
        OSWAP_OracleChainlinkBase(_weth) 
        OSWAP_OracleChainlinkGenericBase(_tokens, _pricefeeds)
        public 
    {
    }
}

contract OSWAP_OracleChainlinkFiatGeneric is OSWAP_OracleChainlinkGenericBase, OSWAP_OracleChainlinkFiatBase {
    constructor(address[] memory _tokens, address[] memory _pricefeeds) public 
        OSWAP_OracleChainlinkGenericBase(_tokens, _pricefeeds)
        OSWAP_OracleChainlinkFiatBase()
    {
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view virtual override (OSWAP_OracleChainlinkBase, OSWAP_OracleChainlinkFiatBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkFiatBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view virtual override (OSWAP_OracleChainlinkBase, OSWAP_OracleChainlinkFiatBase) returns (bool supported) {
        return OSWAP_OracleChainlinkFiatBase.isSupported(from, to);
    }
}

contract OSWAP_OracleChainlinkPriceGuardGeneric is OSWAP_OracleChainlinkGeneric, OSWAP_OracleChainlinkPriceGuardBase {
    constructor(address _weth, address wethPriceFeed, address[] memory _tokens, address[] memory _pricefeeds, address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) 
        public
        OSWAP_OracleChainlinkGeneric(_weth, _tokens, _pricefeeds)
        OSWAP_OracleChainlinkPriceGuardBase(wethPriceFeed, _factory, _maxValue, _deviation, _returnAmmPrice)
    {
        decimals[_weth] = IERC20(_weth).decimals();
        uint256 length = _tokens.length;
        for (uint256 i = 0 ; i < length ; i++) {
            address token = _tokens[i];
            decimals[token] = IERC20(token).decimals();
        }
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkBase, OSWAP_OracleChainlinkPriceGuardBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
}

contract OSWAP_OracleChainlinkPriceGuardFiatGeneric is OSWAP_OracleChainlinkFiatGeneric, OSWAP_OracleChainlinkPriceGuardFiatBase {
    constructor(address[] memory _tokens, address[] memory _pricefeeds, address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) 
        public 
        OSWAP_OracleChainlinkFiatGeneric(_tokens, _pricefeeds)
        OSWAP_OracleChainlinkPriceGuardFiatBase(_factory, _maxValue, _deviation, _returnAmmPrice)
    {
        uint256 length = _tokens.length;
        for (uint256 i = 0 ; i < length ; i++) {
            address token = _tokens[i];
            decimals[token] = IERC20(token).decimals();
        }
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkFiatGeneric, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view override (OSWAP_OracleChainlinkFiatGeneric, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (bool supported) {
        return OSWAP_OracleChainlinkFiatBase.isSupported(from, to);
    }
}

contract OSWAP_OracleChainlinkV1Generic is OSWAP_OracleChainlinkV1Base {
    constructor(address _weth, address[] memory _tokens, address[] memory _pricefeeds) public {
        require(_tokens.length == _pricefeeds.length, "Array length not match");
        WETH = _weth;
        uint256 length = _tokens.length;
        for (uint256 i = 0 ; i < length ; i++ ) {
            address token = _tokens[i];
            require(priceFeedAddresses[token] == address(0), "price feed already exists");
            priceFeedAddresses[token] = _pricefeeds[i];
        }
    }
}

contract OSWAP_OracleChainlinkLimitedGeneric is OSWAP_OracleChainlinkLimitedBase {
    constructor(address factory, address _weth, address[] memory token, address[] memory _pricefeeds) 
        public 
        OSWAP_OracleChainlinkLimitedBase(factory) 
        OSWAP_OracleChainlinkBase(_weth) 
    {
        require(token.length == _pricefeeds.length, "Array length not match");
        for (uint256 i = 0 ; i < token.length ; i++ ) {
            require(priceFeedAddresses[token[i]] == address(0), "price feed already exists");
            priceFeedAddresses[token[i]] = _pricefeeds[i];
        }
    }
}
