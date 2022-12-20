// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

interface IFactory {

    function minLotSize(address token) external view returns (uint256);
    function getPair(address tokenA, address tokenB) external view returns (address pair);

}
