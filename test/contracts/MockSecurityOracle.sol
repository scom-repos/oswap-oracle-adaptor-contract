// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import '../../contracts/interfaces/IOSWAP_OracleScoreOracleAdaptor.sol';

contract MockSecurityOracle is IOSWAP_OracleScoreOracleAdaptor {
    address public override oracleAddress;
    mapping (address => uint) scores;
    function setSecurityScore(address oracle, uint score) external {
        scores[oracle] = score;
    }
    function getSecurityScore(address oracle) external view override returns (uint) {
        return scores[oracle];
    }
}
