import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
export interface IDeployParams {
    weth: string;
    wethPriceFeed: string;
    tokens: string[];
    pricefeeds: string[];
    factory: string;
    maxValue: number | BigNumber;
    deviation: number | BigNumber;
    returnAmmPrice: boolean;
}
export interface IGetLatestPriceParams {
    from: string;
    to: string;
    payload: string;
}
export interface IGetPriceInfoParams {
    from: string;
    to: string;
    fromAmount: number | BigNumber;
    toAmount: number | BigNumber;
}
export interface IGetRatioParams {
    from: string;
    to: string;
    fromAmount: number | BigNumber;
    toAmount: number | BigNumber;
    payload: string;
}
export interface IIsSupportedParams {
    from: string;
    to: string;
}
export declare class OSWAP_OracleChainlinkPriceGuardGeneric extends _Contract {
    static _abi: any;
    constructor(wallet: IWallet, address?: string);
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>;
    WETH: {
        (options?: TransactionOptions): Promise<string>;
    };
    chainlinkDeicmals: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    decimals: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    decimals_1: {
        (param1: string, options?: TransactionOptions): Promise<BigNumber>;
    };
    factory: {
        (options?: TransactionOptions): Promise<string>;
    };
    getLatestPrice: {
        (params: IGetLatestPriceParams, options?: TransactionOptions): Promise<BigNumber>;
    };
    getPriceInfo: {
        (params: IGetPriceInfoParams, options?: TransactionOptions): Promise<{
            chainlinkPrice: BigNumber;
            ammPrice: BigNumber;
            usdAmount: BigNumber;
        }>;
    };
    getRatio: {
        (params: IGetRatioParams, options?: TransactionOptions): Promise<{
            numerator: BigNumber;
            denominator: BigNumber;
        }>;
    };
    high: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    isSupported: {
        (params: IIsSupportedParams, options?: TransactionOptions): Promise<boolean>;
    };
    low: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    maxValue: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    priceFeedAddresses: {
        (param1: string, options?: TransactionOptions): Promise<string>;
    };
    returnAmmPrice: {
        (options?: TransactionOptions): Promise<boolean>;
    };
    wethDecimals: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    wethPriceFeed: {
        (options?: TransactionOptions): Promise<string>;
    };
    private assign;
}
