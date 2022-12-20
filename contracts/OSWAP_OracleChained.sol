// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IOSWAP_OracleAdaptor.sol";
import './libraries/SafeMath.sol';

contract OSWAP_OracleChained is IOSWAP_OracleAdaptor {
	using SafeMath for uint256;

    uint8 constant _DECIMALS = 18;
    uint256 constant DECIMALS = uint256(_DECIMALS);
    uint256 constant WEI = 10**DECIMALS;

    address WETH;

    mapping (address => address) public priceFeedAddresses;
    mapping (address => mapping (address => address[])) public pathsStore;
    mapping (address => mapping (address => address[])) public oraclesStore;

    constructor(address[] memory _from, address[] memory _to, uint256[] memory _count, address[] memory _paths, address[] memory _oracles) public {
        uint256 total = 0;
        require(_from.length == _to.length && _to.length == _count.length, "Array length not match");
        for (uint256 i = 0 ; i < _count.length ; i++) {
            total = total.add(_count[i]);
        }
        require(total == _paths.length && total.add(_paths.length) == _oracles.length, "Array length not match");

        uint256 k = 0;
        for (uint256 i = 0 ; i < _from.length ; i++) {
            uint256 count = _count[i];
            address[] memory path2 =  new address[](count);
            address[] memory oracles2 =  new address[](count+1);
            for (uint256 j = 0 ; j < count ; j++) {
                path2[j] = _paths[k];
                oracles2[j] = _oracles[k+i];
                k++;
            }
        }
    }
    function mulPrice(uint256 price1, uint8 decimals1, address oracle, address from, address to, bytes calldata payload) internal view returns (uint256 price, uint8 decimals) {
        uint256 price2 = IOSWAP_OracleAdaptor(oracle).getLatestPrice(from, to, payload);
        uint8 decimals2 = IOSWAP_OracleAdaptor(oracle).decimals();
        price = price1.mul(price2);
        if (DECIMALS > uint256(decimals1).add(decimals2)) {
            price = price.mul(10**(DECIMALS.sub(decimals1).sub(decimals2)));
        } else {
            price = price.div(10**(uint256(decimals1).add(decimals2).sub(DECIMALS)));
        }
        decimals = _DECIMALS;
    }
    function getRatio(address from, address to, uint256 /*fromAmount*/, uint256 /*toAmount*/, bytes calldata payload) public view override returns (uint256 numerator, uint256 denominator) {
    }
    function getLatestPrice(address from, address to, bytes calldata payload) public view override returns (uint256 price) {
        address[] memory path = pathsStore[from][to];
        address[] memory oracle = oraclesStore[from][to];
        uint256 i = 0;
        address t1;
        address t2 = path[i];
        price = IOSWAP_OracleAdaptor(oracle[i]).getLatestPrice(from, t2, payload);
        uint8 decimals = IOSWAP_OracleAdaptor(oracle[i]).decimals();

        for (i = 1 ; i < path.length ; i++) {
            t1 = t2;
            t2 = path[i];
            (price, decimals) = mulPrice(price, decimals, oracle[i], t1, t2, payload);
        }
        (price, decimals) = mulPrice(price, decimals, oracle[i], t2, to, payload);
    }
    function isSupported(address from, address to) external view override returns (bool supported) {
        address[] memory oracle = oraclesStore[from][to];
        return oracle.length != 0;
    }
    function decimals() external view override returns (uint8) {
        return _DECIMALS;
    }
}
