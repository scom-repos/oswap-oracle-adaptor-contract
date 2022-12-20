// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

interface IPair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}
