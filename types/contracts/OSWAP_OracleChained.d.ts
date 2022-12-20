import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
export interface IDeployParams {
    from: string[];
    to: string[];
    count: (number | BigNumber)[];
    paths: string[];
    oracles: string[];
}
export interface IGetLatestPriceParams {
    from: string;
    to: string;
    payload: string;
}
export interface IGetRatioParams {
    from: string;
    to: string;
    param3: number | BigNumber;
    param4: number | BigNumber;
    payload: string;
}
export interface IIsSupportedParams {
    from: string;
    to: string;
}
export interface IOraclesStoreParams {
    param1: string;
    param2: string;
    param3: number | BigNumber;
}
export interface IPathsStoreParams {
    param1: string;
    param2: string;
    param3: number | BigNumber;
}
export declare class OSWAP_OracleChained extends _Contract {
    static _abi: any;
    constructor(wallet: IWallet, address?: string);
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>;
    decimals: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    getLatestPrice: {
        (params: IGetLatestPriceParams, options?: TransactionOptions): Promise<BigNumber>;
    };
    getRatio: {
        (params: IGetRatioParams, options?: TransactionOptions): Promise<{
            numerator: BigNumber;
            denominator: BigNumber;
        }>;
    };
    isSupported: {
        (params: IIsSupportedParams, options?: TransactionOptions): Promise<boolean>;
    };
    oraclesStore: {
        (params: IOraclesStoreParams, options?: TransactionOptions): Promise<string>;
    };
    pathsStore: {
        (params: IPathsStoreParams, options?: TransactionOptions): Promise<string>;
    };
    priceFeedAddresses: {
        (param1: string, options?: TransactionOptions): Promise<string>;
    };
    private assign;
}
