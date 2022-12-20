"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSWAP_OracleChainlinkPriceGuardBinance = void 0;
const eth_contract_1 = require("@ijstech/eth-contract");
const OSWAP_OracleChainlinkPriceGuardBinance_json_1 = __importDefault(require("./OSWAP_OracleChainlinkPriceGuardBinance.json"));
class OSWAP_OracleChainlinkPriceGuardBinance extends eth_contract_1.Contract {
    constructor(wallet, address) {
        super(wallet, address, OSWAP_OracleChainlinkPriceGuardBinance_json_1.default.abi, OSWAP_OracleChainlinkPriceGuardBinance_json_1.default.bytecode);
        this.assign();
    }
    deploy(params, options) {
        return this.__deploy([params.factory, this.wallet.utils.toString(params.maxValue), this.wallet.utils.toString(params.deviation), params.returnAmmPrice], options);
    }
    assign() {
        let WETH_call = async (options) => {
            let result = await this.call('WETH', [], options);
            return result;
        };
        this.WETH = WETH_call;
        let _WBNB_call = async (options) => {
            let result = await this.call('_WBNB', [], options);
            return result;
        };
        this._WBNB = _WBNB_call;
        let chainlinkDeicmals_call = async (options) => {
            let result = await this.call('chainlinkDeicmals', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.chainlinkDeicmals = chainlinkDeicmals_call;
        let decimals_call = async (options) => {
            let result = await this.call('decimals', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.decimals = decimals_call;
        let decimals_1_call = async (param1, options) => {
            let result = await this.call('decimals', [param1], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.decimals_1 = decimals_1_call;
        let factory_call = async (options) => {
            let result = await this.call('factory', [], options);
            return result;
        };
        this.factory = factory_call;
        let getLatestPriceParams = (params) => [params.from, params.to, this.wallet.utils.stringToBytes(params.payload)];
        let getLatestPrice_call = async (params, options) => {
            let result = await this.call('getLatestPrice', getLatestPriceParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.getLatestPrice = getLatestPrice_call;
        let getPriceInfoParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.fromAmount), this.wallet.utils.toString(params.toAmount)];
        let getPriceInfo_call = async (params, options) => {
            let result = await this.call('getPriceInfo', getPriceInfoParams(params), options);
            return {
                chainlinkPrice: new eth_contract_1.BigNumber(result.chainlinkPrice),
                ammPrice: new eth_contract_1.BigNumber(result.ammPrice),
                usdAmount: new eth_contract_1.BigNumber(result.usdAmount)
            };
        };
        this.getPriceInfo = getPriceInfo_call;
        let getRatioParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.fromAmount), this.wallet.utils.toString(params.toAmount), this.wallet.utils.stringToBytes(params.payload)];
        let getRatio_call = async (params, options) => {
            let result = await this.call('getRatio', getRatioParams(params), options);
            return {
                numerator: new eth_contract_1.BigNumber(result.numerator),
                denominator: new eth_contract_1.BigNumber(result.denominator)
            };
        };
        this.getRatio = getRatio_call;
        let high_call = async (options) => {
            let result = await this.call('high', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.high = high_call;
        let isSupportedParams = (params) => [params.from, params.to];
        let isSupported_call = async (params, options) => {
            let result = await this.call('isSupported', isSupportedParams(params), options);
            return result;
        };
        this.isSupported = isSupported_call;
        let low_call = async (options) => {
            let result = await this.call('low', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.low = low_call;
        let maxValue_call = async (options) => {
            let result = await this.call('maxValue', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.maxValue = maxValue_call;
        let priceFeedAddresses_call = async (param1, options) => {
            let result = await this.call('priceFeedAddresses', [param1], options);
            return result;
        };
        this.priceFeedAddresses = priceFeedAddresses_call;
        let returnAmmPrice_call = async (options) => {
            let result = await this.call('returnAmmPrice', [], options);
            return result;
        };
        this.returnAmmPrice = returnAmmPrice_call;
        let wethDecimals_call = async (options) => {
            let result = await this.call('wethDecimals', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.wethDecimals = wethDecimals_call;
        let wethPriceFeed_call = async (options) => {
            let result = await this.call('wethPriceFeed', [], options);
            return result;
        };
        this.wethPriceFeed = wethPriceFeed_call;
    }
}
exports.OSWAP_OracleChainlinkPriceGuardBinance = OSWAP_OracleChainlinkPriceGuardBinance;
OSWAP_OracleChainlinkPriceGuardBinance._abi = OSWAP_OracleChainlinkPriceGuardBinance_json_1.default.abi;
