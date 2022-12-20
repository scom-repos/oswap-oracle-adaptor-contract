import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
export interface IGetLatestPriceParams {
    param1: string;
    param2: string;
    param3: string;
}
export interface IGetRatioParams {
    param1: string;
    param2: string;
    param3: number | BigNumber;
    param4: number | BigNumber;
    param5: string;
}
export interface IIsSupportedParams {
    param1: string;
    param2: string;
}
export declare class OSWAP_OracleUnity extends _Contract {
    static _abi: any;
    constructor(wallet: IWallet, address?: string);
    deploy(options?: number | BigNumber | TransactionOptions): Promise<string>;
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
    private assign;
}
