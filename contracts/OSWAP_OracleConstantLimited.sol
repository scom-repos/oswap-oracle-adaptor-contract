// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import './libraries/SafeMath.sol';
import "./OSWAP_OracleConstant.sol";

contract OSWAP_OracleConstantLimited is OSWAP_OracleConstant {
	using SafeMath for uint256;

    mapping(address => mapping (address => mapping(bool => uint256))) public limits;

    constructor(address[] memory token0, address[] memory token1, uint256[] memory price0, uint256[] memory price1, uint256[] memory limit0, uint256[] memory limit1) public 
        OSWAP_OracleConstant(token0, token1, price0, price1)
    {
        uint256 length = token0.length;
        require(length == token1.length && token1.length == price0.length && price0.length == price1.length && price1.length == limit0.length && limit0.length == limit1.length, "OSWAP: Array length not match");
        for (uint256 i = 0 ; i < length ; i++) {
            address _token0 = token0[i];
            address _token1 = token1[i];
            uint256 _price0 = price0[i];
            uint256 _price1 = price1[i];
            limits[_token0][_token1][true] = limit0[i];
            limits[_token0][_token1][false] = limit0[i].mul(_price0).div(WEI);
            limits[_token1][_token0][true] = limit1[i];
            limits[_token1][_token0][false] = limit1[i].mul(_price1).div(WEI);
        }
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata payload) external view override returns (uint256 numerator, uint256 denominator) {
        require((fromAmount == 0 && toAmount < limits[from][to][false]) || (toAmount == 0 && fromAmount < limits[from][to][true]), "OSWAP: Over Limit");
        numerator = getLatestPrice(from, to, payload);
        denominator = WEI;
    }
}
