"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSWAP_OracleChainlinkLimited = void 0;
const eth_contract_1 = require("@ijstech/eth-contract");
const OSWAP_OracleChainlinkLimited_json_1 = __importDefault(require("./OSWAP_OracleChainlinkLimited.json"));
class OSWAP_OracleChainlinkLimited extends eth_contract_1.Contract {
    constructor(wallet, address) {
        super(wallet, address, OSWAP_OracleChainlinkLimited_json_1.default.abi, OSWAP_OracleChainlinkLimited_json_1.default.bytecode);
        this.assign();
    }
    deploy(factory, options) {
        return this.__deploy([factory], options);
    }
    assign() {
        let WETH_call = async (options) => {
            let result = await this.call('WETH', [], options);
            return result;
        };
        this.WETH = WETH_call;
        let _WETH_call = async (options) => {
            let result = await this.call('_WETH', [], options);
            return result;
        };
        this._WETH = _WETH_call;
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
        let getRatioParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.fromAmount), this.wallet.utils.toString(params.toAmount), this.wallet.utils.stringToBytes(params.payload)];
        let getRatio_call = async (params, options) => {
            let result = await this.call('getRatio', getRatioParams(params), options);
            return {
                numerator: new eth_contract_1.BigNumber(result.numerator),
                denominator: new eth_contract_1.BigNumber(result.denominator)
            };
        };
        this.getRatio = getRatio_call;
        let isSupportedParams = (params) => [params.from, params.to];
        let isSupported_call = async (params, options) => {
            let result = await this.call('isSupported', isSupportedParams(params), options);
            return result;
        };
        this.isSupported = isSupported_call;
        let priceFeedAddresses_call = async (param1, options) => {
            let result = await this.call('priceFeedAddresses', [param1], options);
            return result;
        };
        this.priceFeedAddresses = priceFeedAddresses_call;
    }
}
exports.OSWAP_OracleChainlinkLimited = OSWAP_OracleChainlinkLimited;
OSWAP_OracleChainlinkLimited._abi = OSWAP_OracleChainlinkLimited_json_1.default.abi;
