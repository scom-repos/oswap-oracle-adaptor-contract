// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IOSWAP_OracleAdaptor.sol";
import './libraries/SafeMath.sol';

contract OSWAP_OracleConstant is IOSWAP_OracleAdaptor {
	using SafeMath for uint256;

    uint8 constant _DECIMALS = 18;
    uint256 constant DECIMALS = uint256(_DECIMALS);
    uint256 constant WEI = 10**DECIMALS;

    mapping(address => mapping (address => uint256)) public prices;
    mapping(address => mapping (address => bool)) override public isSupported;

    constructor(address[] memory token0, address[] memory token1, uint256[] memory price0, uint256[] memory price1) public {
        uint256 length = token0.length;
        require(length == token1.length && token1.length == price0.length && price0.length == price1.length, "OSWAP: Array length not match");
        for (uint256 i = 0 ; i < length ; i++) {
            address _token0 = token0[i];
            address _token1 = token1[i];
            uint256 _price0 = price0[i];
            uint256 _price1 = price1[i];
            require(_token0 != address(0), "OSWAP: cannot have zero address");
            require(_token1 != address(0), "OSWAP: cannot have zero address");
            require(_token0 != _token1, "OSWAP: from and to addresses cannot be the same");
            require(_price0 != 0, "OSWAP: cannot have zero price");
            require(_price1 != 0, "OSWAP: cannot have zero price");
            prices[_token0][_token1] = _price0;
            prices[_token1][_token0] = _price1;
            isSupported[_token0][_token1] = true;
            isSupported[_token1][_token0] = true;
        }
    }
    function getRatio(address from, address to, uint256 /*fromAmount*/, uint256 /*toAmount*/, bytes calldata payload) external view virtual override returns (uint256 numerator, uint256 denominator) {
        numerator = getLatestPrice(from, to, payload);
        denominator = WEI;
    }
    function getLatestPrice(address from, address to, bytes calldata /*payload*/) public view override returns (uint256 price){
        require(from != to, "OSWAP: from and to addresses are the same");
        price = prices[from][to];
        require(price != 0, "OSWAP: price feed not found");
    }
    function decimals() external view override returns (uint8) {
        return _DECIMALS;
    }
}
