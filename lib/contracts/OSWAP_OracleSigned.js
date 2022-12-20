"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSWAP_OracleSigned = void 0;
const eth_contract_1 = require("@ijstech/eth-contract");
const OSWAP_OracleSigned_json_1 = __importDefault(require("./OSWAP_OracleSigned.json"));
class OSWAP_OracleSigned extends eth_contract_1.Contract {
    constructor(wallet, address) {
        super(wallet, address, OSWAP_OracleSigned_json_1.default.abi, OSWAP_OracleSigned_json_1.default.bytecode);
        this.assign();
    }
    deploy(signer, options) {
        return this.__deploy([signer], options);
    }
    assign() {
        let decimals_call = async (options) => {
            let result = await this.call('decimals', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.decimals = decimals_call;
        let getLatestPriceParams = (params) => [params.from, params.to, this.wallet.utils.stringToBytes(params.payload)];
        let getLatestPrice_call = async (params, options) => {
            let result = await this.call('getLatestPrice', getLatestPriceParams(params), options);
            return new eth_contract_1.BigNumber(result);
        };
        this.getLatestPrice = getLatestPrice_call;
        let getRatioParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.param3), this.wallet.utils.toString(params.param4), this.wallet.utils.stringToBytes(params.payload)];
        let getRatio_call = async (params, options) => {
            let result = await this.call('getRatio', getRatioParams(params), options);
            return {
                numerator: new eth_contract_1.BigNumber(result.numerator),
                denominator: new eth_contract_1.BigNumber(result.denominator)
            };
        };
        this.getRatio = getRatio_call;
        let isSupportedParams = (params) => [params.param1, params.param2];
        let isSupported_call = async (params, options) => {
            let result = await this.call('isSupported', isSupportedParams(params), options);
            return result;
        };
        this.isSupported = isSupported_call;
        let sequenceNumber_call = async (options) => {
            let result = await this.call('sequenceNumber', [], options);
            return new eth_contract_1.BigNumber(result);
        };
        this.sequenceNumber = sequenceNumber_call;
        let signer_call = async (options) => {
            let result = await this.call('signer', [], options);
            return result;
        };
        this.signer = signer_call;
        let updateSequenceNumberParams = (params) => [params.from, params.to, this.wallet.utils.stringToBytes(params.payload)];
        let updateSequenceNumber_send = async (params, options) => {
            let result = await this.send('updateSequenceNumber', updateSequenceNumberParams(params), options);
            return result;
        };
        let updateSequenceNumber_call = async (params, options) => {
            let result = await this.call('updateSequenceNumber', updateSequenceNumberParams(params), options);
            return;
        };
        this.updateSequenceNumber = Object.assign(updateSequenceNumber_send, {
            call: updateSequenceNumber_call
        });
    }
}
exports.OSWAP_OracleSigned = OSWAP_OracleSigned;
OSWAP_OracleSigned._abi = OSWAP_OracleSigned_json_1.default.abi;
