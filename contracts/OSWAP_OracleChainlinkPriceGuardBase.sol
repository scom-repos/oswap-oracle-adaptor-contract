// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IFactory.sol";
import "./interfaces/IPair.sol";
import "./OSWAP_OracleChainlinkBase.sol";
import "./interfaces/IOSWAP_OracleAdaptorPriceGuard.sol";

abstract contract OSWAP_OracleChainlinkPriceGuardBase is OSWAP_OracleChainlinkBase, IOSWAP_OracleAdaptorPriceGuard {
	using SafeMath for uint256;

    address public immutable wethPriceFeed;
    uint8 public wethDecimals = 8;

    address public immutable factory;
    uint256 public immutable maxValue;
    uint256 public immutable low;
    uint256 public immutable high;
    bool public immutable returnAmmPrice;

    mapping (address => uint8) public decimals;

    constructor(address _wethPriceFeed, address _factory, uint256 _maxValue, uint256 _deviation, bool _returnAmmPrice) public {
        require(_deviation <= WEI, "Invalid price range");
        wethPriceFeed = _wethPriceFeed;
        factory = _factory;
        maxValue = _maxValue;
        low = WEI.sub(_deviation);
        high = WEI.add(_deviation);
        returnAmmPrice = _returnAmmPrice;
    }

    function convertEthDecimals(uint256 amount, address token) internal view returns (uint256) {
        uint256 decimals2 = decimals[token];
        require(decimals2 > 0, "OracleAdaptor: token not supported");
        if (decimals2 > 18) {
            amount = amount.mul(10 ** uint256(decimals2-18));
        } else if (decimals2 < 18) {
            amount = amount.div(10 ** uint256(18-decimals2));
        }
        return amount;
    }

    function _getRatio(address from, address to, uint256 fromAmount, uint256 toAmount) internal view virtual returns (uint256 usdAmount, uint256 numerator, uint256 denominator, uint112 reserve0, uint112 reserve1) {
        require(from != to, "OSWAP: from and to addresses are the same");

        uint256 ethAmount;

        if (from == WETH) {
            // eth -> token
            ethAmount = fromAmount;
            uint8 _decimals;
            address fromEth = priceFeedAddresses[to];
            (denominator, _decimals) = _getLatestPrice(fromEth);
            numerator = 10**uint256(_decimals);

            if (ethAmount == 0) {
                // exact token out
                ethAmount = toAmount.mul(denominator).div(numerator);
                ethAmount = convertEthDecimals(ethAmount, to);
            }
        } else if (to == WETH) {
            // token -> eth
            ethAmount = toAmount;
            uint8 _decimals;
            address toEth = priceFeedAddresses[from];
            (numerator, _decimals) = _getLatestPrice(toEth);
            denominator = 10**uint256(_decimals);

            if (ethAmount == 0) {
                // exact token in
                ethAmount = fromAmount.mul(numerator).div(denominator);
                ethAmount = convertEthDecimals(ethAmount, from);
            }
        } else {
            address toEth = priceFeedAddresses[from];
            uint8 decimals1;
            (numerator, decimals1) = _getLatestPrice(toEth);

            address fromEth = priceFeedAddresses[to];
            uint8 decimals2;
            (denominator, decimals2) = _getLatestPrice(fromEth);

            if (fromAmount == 0) {
                // exact out: find equivalent ETH amount
                ethAmount = toAmount.mul(denominator).div(10**uint256(decimals2));
                ethAmount = convertEthDecimals(ethAmount, to);
            } else if (toAmount == 0) {
                // exact in: find equivalent ETH amount
                ethAmount = fromAmount.mul(numerator).div(10**uint256(decimals1));
                ethAmount = convertEthDecimals(ethAmount, from);
            } else {
                revert("OracleAdaptor: Invalid amount");
            }
        }

        (,int256 ethPrice,,,) =  AggregatorV3Interface(wethPriceFeed).latestRoundData();
        usdAmount = uint256(ethPrice).mul(ethAmount).div(10**uint256(wethDecimals));

        address pair = IFactory(factory).getPair(from, to);
        require(address(pair) != address(0), "pair not exists");

        // from < to: amountout = amountin * reserve1 / reserve0
        // to < from: amountout = amountin * reserve0 / reserve1
        (reserve0, reserve1, ) = IPair(pair).getReserves();
        if (to < from)
            (reserve0, reserve1) = (reserve1, reserve0);
    }
    function getPriceInfo(address from, address to, uint256 fromAmount, uint256 toAmount) public view override virtual returns (uint256 chainlinkPrice, uint256 ammPrice, uint256 usdAmount) {
        uint256 numerator;
        uint256 denominator;
        uint112 reserve0;
        uint112 reserve1;
        (usdAmount, numerator, denominator, reserve0, reserve1) = _getRatio(from, to, fromAmount, toAmount);

        chainlinkPrice = numerator.mul(WEI).div(denominator);

        if (reserve0 != 0) {
            uint8 decimals0 = decimals[from];
            uint8 decimals1 = decimals[to];

            ammPrice = uint256(reserve1).mul(WEI);
            if (decimals1 < decimals0) {
                ammPrice = ammPrice.mul(10**(uint256(decimals0-decimals1)));
            }
            ammPrice = ammPrice.div(reserve0);
            if (decimals0 < decimals1) {
                ammPrice = ammPrice.div(10**(uint256(decimals1-decimals0)));
            }
        }
    }
    function getRatio(address from, address to, uint256 fromAmount, uint256 toAmount, bytes calldata /*payload*/) public view override(IOSWAP_OracleAdaptor,OSWAP_OracleChainlinkBase) virtual returns (uint256 numerator, uint256 denominator) {
        uint256 usdAmount;
        uint112 reserve0;
        uint112 reserve1;
        (usdAmount, numerator, denominator, reserve0, reserve1) = _getRatio(from, to, fromAmount, toAmount);

        require(usdAmount <= maxValue, "OracleAdaptor: Exceessive amount");

        uint256 n1 = denominator.mul(reserve1);
        uint256 n2 = numerator.mul(reserve0);

        uint8 decimals0 = decimals[from];
        uint8 decimals1 = decimals[to];
        uint256 ratio;
        if (decimals1 < decimals0) {
            ratio = 10**(uint256(decimals0-decimals1));
            n1 = n1.mul(ratio);
        } else if (decimals0 < decimals1) {
            ratio = 10**(uint256(decimals1-decimals0));
            n2 = n2.mul(ratio);
        }

        if (returnAmmPrice) {
            // low < (reserve1 / reserve0) / (numerator / denominator) < high
            // low < (reserve1*denominator) / (reserve0*numerator) < high
            // low < n1 / n2 < high
            require(n1.mul(low) <= n2.mul(WEI) && n2.mul(WEI) <= n1.mul(high), "OracleAdaptor: Price outside allowed range");
            numerator = reserve1;
            denominator = reserve0;
            if (decimals1 < decimals0) {
                numerator = numerator.mul(ratio);
            } else if (decimals0 < decimals1) {
                denominator = denominator.mul(ratio);
            }
        } else {
            // low < (numerator / denominator) / (reserve1 / reserve0) < high
            // low < (reserve0*numerator) / (denominator*reserve1) < high
            // low < n2 / n1 < high
            require(n2.mul(low) <= n1.mul(WEI) && n1.mul(WEI) <= n2.mul(high), "OracleAdaptor: Price outside allowed range");
        }
    }
}