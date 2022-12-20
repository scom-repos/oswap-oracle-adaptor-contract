// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

contract MockChainlink {

    uint256 public decimals;
    string public description;
    uint256 public version;

    uint80 public roundId;
    int256 public answer;
    uint256 public startedAt;
    uint256 public updatedAt;
    uint80 public answeredInRound;

    constructor(uint256 _decimals, string memory _description, uint256 _version) public {
        decimals = _decimals;
        description = _description;
        version = _version;
    }


    function setRoundData(
        uint80 _roundId,
        int256 _answer,
        uint256 _startedAt,
        uint256 _updatedAt,
        uint80 _answeredInRound
    ) external {
        roundId = _roundId;
        answer =_answer;
        startedAt = _startedAt;
        updatedAt = _updatedAt;
        answeredInRound = _answeredInRound;
    }

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 __roundId)
        external
        view
    returns (
        uint80 _roundId,
        int256 _answer,
        uint256 _startedAt,
        uint256 _updatedAt,
        uint80 _answeredInRound
    ){
        __roundId;
        return (roundId, answer, startedAt, updatedAt, answeredInRound);
    }

    function latestRoundData()
        external
        view
    returns (
        uint80 _roundId,
        int256 _answer,
        uint256 _startedAt,
        uint256 _updatedAt,
        uint80 _answeredInRound
    ){
        return (roundId, answer, startedAt, updatedAt, answeredInRound);
    }
}
/*
contract MockChainlink_USDC_USDT {
    constructor() MockChainlink(18, "USDC/USDT", 1) public {}
}
contract MockChainlink_DAI_USDT {
    constructor() MockChainlink(18, "DAI/USDT", 1) public {}
}
contract MockChainlink_DAI_USDC {
    constructor() MockChainlink(18, "DAI/USDC", 1) public {}
}
*/