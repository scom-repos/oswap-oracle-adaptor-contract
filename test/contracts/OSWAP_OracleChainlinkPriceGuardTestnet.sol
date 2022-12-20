// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "../../contracts/interfaces/IERC20.sol";
import "../../contracts/interfaces/IFactory.sol";
import "../../contracts/interfaces/IPair.sol";
import "../../contracts/OSWAP_OracleChainlinkPriceGuardBase.sol";
import "../../contracts/OSWAP_OracleChainlinkPriceGuardFiatBase.sol";
import "./OSWAP_OracleChainlinkTestnet.sol";

contract MockPriceGuardFactory is IFactory {
    mapping(address => mapping(address => address)) public override getPair;
    function set(address token0, address token1, address _pair) public {
        getPair[token0][token1] = _pair;
        getPair[token1][token0] = _pair;
    }
    function minLotSize(address /*token*/) external override view returns (uint256) {}
}

contract MockPriceGuardPair is IPair {
    address public immutable token0;
    address public immutable token1;
    uint112 public __reserve0;
    uint112 public __reserve1;
    constructor(address _token0, address _token1) public {
        require(_token0 != address(0) && _token0 < _token1);
        token0 = _token0;
        token1 = _token1;
    }
    function setReserves(uint112 _reserve0, uint112 _reserve1) public {
        __reserve0 = _reserve0;
        __reserve1 = _reserve1;
    }
    function getReserves() external override view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) {
        return (__reserve0, __reserve1, 0);
    }
}

contract OSWAP_OracleChainlinkPriceGuardKovan is OSWAP_OracleChainlinkKovan, OSWAP_OracleChainlinkPriceGuardBase {
    address constant kovanWethPriceFeed = 0x9326BFA02ADD2366b30bacB125260Af641031331;
    constructor(address dai, address usdc, address usdt, address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) 
        public
        OSWAP_OracleChainlinkKovan(dai, usdc, usdt)
        OSWAP_OracleChainlinkPriceGuardBase(kovanWethPriceFeed, _factory, _maxValue, _deviation, _returnAmmPrice)
    {}
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkBase, OSWAP_OracleChainlinkPriceGuardBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
}
contract OSWAP_OracleChainlinkPriceGuardBinanceTestnet is OSWAP_OracleChainlinkBinanceTestnet, OSWAP_OracleChainlinkPriceGuardBase {
    address constant bscWethPriceFeed = 0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526;
    constructor(address wbnb, address dai, address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) 
        public
        OSWAP_OracleChainlinkBinanceTestnet(wbnb, dai)
        OSWAP_OracleChainlinkPriceGuardBase(bscWethPriceFeed, _factory, _maxValue, _deviation, _returnAmmPrice)
    {
        // WBNB based
        decimals[dai] = 18;
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkBase, OSWAP_OracleChainlinkPriceGuardBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
}

contract OSWAP_OracleChainlinkPriceGuardFiatKovan is OSWAP_OracleChainlinkFiatKovan, OSWAP_OracleChainlinkPriceGuardFiatBase {
    constructor(address eth, address dai, address usdc, address usdt, address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) 
        OSWAP_OracleChainlinkFiatKovan(eth, dai, usdt, usdc)
        OSWAP_OracleChainlinkPriceGuardFiatBase(_factory, _maxValue, _deviation, _returnAmmPrice)
        public 
    {
        decimals[eth] = 18;
        decimals[dai] = 18;
        decimals[usdc] = 6;
        decimals[usdt] = 6;

    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (bool supported) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.isSupported(from, to);
    }
}
contract OSWAP_OracleChainlinkPriceGuardFiatBinanceTestnet is OSWAP_OracleChainlinkFiatBinanceTestnet, OSWAP_OracleChainlinkPriceGuardFiatBase {
    constructor(address wbnb, address busd, address usdt, address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) 
        OSWAP_OracleChainlinkFiatBinanceTestnet(wbnb, busd, usdt)
        OSWAP_OracleChainlinkPriceGuardFiatBase(_factory, _maxValue, _deviation, _returnAmmPrice)
        public 
    {
        // USD based
        decimals[wbnb] = 18;
        decimals[busd] = 18;
        decimals[usdt] = 6;

    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (bool supported) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.isSupported(from, to);
    }
}

contract OSWAP_OracleChainlinkPriceGuardFiatAvalancheTestnet is OSWAP_OracleChainlinkFiatAvalancheTestnet, OSWAP_OracleChainlinkPriceGuardFiatBase {
    constructor(address wavax, address usdt, address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) 
        OSWAP_OracleChainlinkFiatAvalancheTestnet(wavax, usdt)
        OSWAP_OracleChainlinkPriceGuardFiatBase(_factory, _maxValue, _deviation, _returnAmmPrice)
        public 
    {
        decimals[wavax] = 18;
        decimals[usdt] = 6;
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (uint256 numerator, uint256 denominator) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.getRatio(from, to, fromAmount, toAmount, payload);
    }
    function isSupported(address from, address to) public view override (OSWAP_OracleChainlinkFiatBase, OSWAP_OracleChainlinkPriceGuardFiatBase) returns (bool supported) {
        return OSWAP_OracleChainlinkPriceGuardFiatBase.isSupported(from, to);
    }
}