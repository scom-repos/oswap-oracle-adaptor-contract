import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
export interface IDeployParams {
    token0: string[];
    token1: string[];
    price0: (number | BigNumber)[];
    price1: (number | BigNumber)[];
    limit0: (number | BigNumber)[];
    limit1: (number | BigNumber)[];
}
export interface IGetLatestPriceParams {
    from: string;
    to: string;
    param3: string;
}
export interface IGetRatioParams {
    from: string;
    to: string;
    fromAmount: number | BigNumber;
    toAmount: number | BigNumber;
    payload: string;
}
export interface IIsSupportedParams {
    param1: string;
    param2: string;
}
export interface ILimitsParams {
    param1: string;
    param2: string;
    param3: boolean;
}
export interface IPricesParams {
    param1: string;
    param2: string;
}
export declare class OSWAP_OracleConstantLimited extends _Contract {
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
    limits: {
        (params: ILimitsParams, options?: TransactionOptions): Promise<BigNumber>;
    };
    prices: {
        (params: IPricesParams, options?: TransactionOptions): Promise<BigNumber>;
    };
    private assign;
}
