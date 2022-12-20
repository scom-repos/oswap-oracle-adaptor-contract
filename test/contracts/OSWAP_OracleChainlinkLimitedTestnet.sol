// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "../../contracts/OSWAP_OracleChainlinkLimitedBase.sol";


contract MockLimitedFactory is IFactory {
    mapping (address => uint256) public override minLotSize;
    function getPair(address /*tokenA*/, address /*tokenB*/) external override view returns (address pair) {}
    function setMinLotSize(address token, uint256 size) external {
        minLotSize[token] = size;
    }
}

contract OSWAP_OracleChainlinkLimitedKovan is OSWAP_OracleChainlinkLimitedBase {
    address public constant _WETH = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    constructor(address factory, address dai, address usdc, address usdt) 
        OSWAP_OracleChainlinkBase(_WETH) 
        OSWAP_OracleChainlinkLimitedBase(factory) 
        public 
    {
        priceFeedAddresses[dai] = 0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541; // DAI
        priceFeedAddresses[usdc] = 0x64EaC61A2DFda2c3Fa04eED49AA33D021AeC8838; // USDC
        priceFeedAddresses[usdt] = 0x0bF499444525a23E7Bb61997539725cA2e928138; // USDT
    }
}

contract OSWAP_OracleChainlinkLimitedRinkeby is OSWAP_OracleChainlinkLimitedBase {
    address public constant _WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    constructor(address factory, address dai, address usdc) 
        OSWAP_OracleChainlinkBase(_WETH) 
        OSWAP_OracleChainlinkLimitedBase(factory) 
        public 
    {
        priceFeedAddresses[dai] = 0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D; // DAI
        priceFeedAddresses[usdc] = 0xdCA36F27cbC4E38aE16C4E9f99D39b42337F6dcf; // USDC
    }
}

contract OSWAP_OracleChainlinkLimitedRopsten is OSWAP_OracleChainlinkLimitedBase {
    address public constant _WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    constructor(address factory, address dai, address usdc, address usdt) 
        OSWAP_OracleChainlinkBase(_WETH) 
        OSWAP_OracleChainlinkLimitedBase(factory) 
        public 
    {
        priceFeedAddresses[dai] = 0x24959556020AE5D39e5bAEC2bd6Bf12420C25aB5; // DAI
        priceFeedAddresses[usdc] = 0xB8784d2D77D3dbaa9cAC7d32D035A6d41e414e9c; // USDC
        priceFeedAddresses[usdt] = 0x14137fA0D2Cf232922840081166a6a05C957bA4c; // USDT
    }
}

contract OSWAP_OracleChainlinkLimitedRinkebyTestnet is OSWAP_OracleChainlinkLimitedBase {
    constructor(address factory, address weth, address dai) 
        OSWAP_OracleChainlinkBase(weth) 
        OSWAP_OracleChainlinkLimitedBase(factory) 
        public 
    {
        priceFeedAddresses[dai] = 0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D; // DAI
    }
}

