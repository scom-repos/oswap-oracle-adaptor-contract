import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
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
    param1: string;
    param2: string;
}
export interface IUpdateSequenceNumberParams {
    from: string;
    to: string;
    payload: string;
}
export declare class OSWAP_OracleSigned extends _Contract {
    static _abi: any;
    constructor(wallet: IWallet, address?: string);
    deploy(signer: string, options?: TransactionOptions): Promise<string>;
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
    sequenceNumber: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    signer: {
        (options?: TransactionOptions): Promise<string>;
    };
    updateSequenceNumber: {
        (params: IUpdateSequenceNumberParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IUpdateSequenceNumberParams, options?: TransactionOptions) => Promise<void>;
    };
    private assign;
}
