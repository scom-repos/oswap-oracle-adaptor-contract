/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChained.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChained.json.ts" {
    const _default: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChained.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChained.ts" {
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
    export class OSWAP_OracleChained extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlink.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlink.json.ts" {
    const _default_1: {
        abi: ({
            inputs: any[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_1;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlink.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlink.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
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
        param5: string;
    }
    export interface IIsSupportedParams {
        from: string;
        to: string;
    }
    export class OSWAP_OracleChainlink extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        _WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        chainlinkDeicmals: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkBinance.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkBinance.json.ts" {
    const _default_2: {
        abi: ({
            inputs: any[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_2;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkBinance.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkBinance.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
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
        param5: string;
    }
    export interface IIsSupportedParams {
        from: string;
        to: string;
    }
    export class OSWAP_OracleChainlinkBinance extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        _WBNB: {
            (options?: TransactionOptions): Promise<string>;
        };
        chainlinkDeicmals: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiat.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiat.json.ts" {
    const _default_3: {
        abi: ({
            inputs: any[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_3;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiat.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiat.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IGetLatestPriceParams {
        from: string;
        to: string;
        payload: string;
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
    export class OSWAP_OracleChainlinkFiat extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        chainlinkDeicmals: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatAvalanche.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatAvalanche.json.ts" {
    const _default_4: {
        abi: ({
            inputs: any[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_4;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatAvalanche.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatAvalanche.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IGetLatestPriceParams {
        from: string;
        to: string;
        payload: string;
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
    export class OSWAP_OracleChainlinkFiatAvalanche extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        chainlinkDeicmals: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatBinance.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatBinance.json.ts" {
    const _default_5: {
        abi: ({
            inputs: any[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_5;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatBinance.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatBinance.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IGetLatestPriceParams {
        from: string;
        to: string;
        payload: string;
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
    export class OSWAP_OracleChainlinkFiatBinance extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(options?: TransactionOptions): Promise<string>;
        WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        chainlinkDeicmals: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatGeneric.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatGeneric.json.ts" {
    const _default_6: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_6;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatGeneric.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatGeneric.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
        tokens: string[];
        pricefeeds: string[];
    }
    export interface IGetLatestPriceParams {
        from: string;
        to: string;
        payload: string;
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
    export class OSWAP_OracleChainlinkFiatGeneric extends _Contract {
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkGeneric.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkGeneric.json.ts" {
    const _default_7: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_7;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkGeneric.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkGeneric.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
        weth: string;
        tokens: string[];
        pricefeeds: string[];
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
        param5: string;
    }
    export interface IIsSupportedParams {
        from: string;
        to: string;
    }
    export class OSWAP_OracleChainlinkGeneric extends _Contract {
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimitedGeneric.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimitedGeneric.json.ts" {
    const _default_8: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_8;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimitedGeneric.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimitedGeneric.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
        factory: string;
        weth: string;
        token: string[];
        pricefeeds: string[];
    }
    export interface IGetLatestPriceParams {
        from: string;
        to: string;
        payload: string;
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
    export class OSWAP_OracleChainlinkLimitedGeneric extends _Contract {
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
        factory: {
            (options?: TransactionOptions): Promise<string>;
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatGeneric.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatGeneric.json.ts" {
    const _default_9: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_9;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatGeneric.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatGeneric.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
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
    export class OSWAP_OracleChainlinkPriceGuardFiatGeneric extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardGeneric.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardGeneric.json.ts" {
    const _default_10: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_10;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardGeneric.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardGeneric.ts" {
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
    export class OSWAP_OracleChainlinkPriceGuardGeneric extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkV1Generic.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkV1Generic.json.ts" {
    const _default_11: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_11;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkV1Generic.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkV1Generic.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
        weth: string;
        tokens: string[];
        pricefeeds: string[];
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
    export class OSWAP_OracleChainlinkV1Generic extends _Contract {
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimited.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimited.json.ts" {
    const _default_12: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_12;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimited.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimited.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IGetLatestPriceParams {
        from: string;
        to: string;
        payload: string;
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
    export class OSWAP_OracleChainlinkLimited extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(factory: string, options?: TransactionOptions): Promise<string>;
        WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        _WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        chainlinkDeicmals: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        decimals: {
            (options?: TransactionOptions): Promise<BigNumber>;
        };
        factory: {
            (options?: TransactionOptions): Promise<string>;
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
        priceFeedAddresses: {
            (param1: string, options?: TransactionOptions): Promise<string>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardBinance.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardBinance.json.ts" {
    const _default_13: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_13;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardBinance.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardBinance.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
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
    export class OSWAP_OracleChainlinkPriceGuardBinance extends _Contract {
        static _abi: any;
        constructor(wallet: IWallet, address?: string);
        deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>;
        WETH: {
            (options?: TransactionOptions): Promise<string>;
        };
        _WBNB: {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatAvalanche.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatAvalanche.json.ts" {
    const _default_14: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_14;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatAvalanche.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatAvalanche.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
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
    export class OSWAP_OracleChainlinkPriceGuardFiatAvalanche extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatBinance.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatBinance.json.ts" {
    const _default_15: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_15;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatBinance.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatBinance.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
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
    export class OSWAP_OracleChainlinkPriceGuardFiatBinance extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstant.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstant.json.ts" {
    const _default_16: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_16;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstant.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstant.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IDeployParams {
        token0: string[];
        token1: string[];
        price0: (number | BigNumber)[];
        price1: (number | BigNumber)[];
    }
    export interface IGetLatestPriceParams {
        from: string;
        to: string;
        param3: string;
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
    export interface IPricesParams {
        param1: string;
        param2: string;
    }
    export class OSWAP_OracleConstant extends _Contract {
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
        prices: {
            (params: IPricesParams, options?: TransactionOptions): Promise<BigNumber>;
        };
        private assign;
    }
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstantLimited.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstantLimited.json.ts" {
    const _default_17: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_17;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstantLimited.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstantLimited.ts" {
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
    export class OSWAP_OracleConstantLimited extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSetYourOwnPrice.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSetYourOwnPrice.json.ts" {
    const _default_18: {
        abi: {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        }[];
        bytecode: string;
    };
    export default _default_18;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSetYourOwnPrice.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSetYourOwnPrice.ts" {
    import { IWallet, Contract as _Contract, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
    export interface IGetLatestPriceParams {
        param1: string;
        param2: string;
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
    export class OSWAP_OracleSetYourOwnPrice extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSigned.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSigned.json.ts" {
    const _default_19: {
        abi: ({
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            name?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        })[];
        bytecode: string;
    };
    export default _default_19;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSigned.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSigned.ts" {
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
    export class OSWAP_OracleSigned extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleUnity.json.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleUnity.json.ts" {
    const _default_20: {
        abi: {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
        }[];
        bytecode: string;
    };
    export default _default_20;
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/OSWAP_OracleUnity.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleUnity.ts" {
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
    export class OSWAP_OracleUnity extends _Contract {
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
}
/// <amd-module name="@scom/oracle-adaptor-contract/contracts/index.ts" />
declare module "@scom/oracle-adaptor-contract/contracts/index.ts" {
    export { OSWAP_OracleChained } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChained.ts";
    export { OSWAP_OracleChainlink } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlink.ts";
    export { OSWAP_OracleChainlinkBinance } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkBinance.ts";
    export { OSWAP_OracleChainlinkFiat } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiat.ts";
    export { OSWAP_OracleChainlinkFiatAvalanche } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatAvalanche.ts";
    export { OSWAP_OracleChainlinkFiatBinance } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatBinance.ts";
    export { OSWAP_OracleChainlinkFiatGeneric } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkFiatGeneric.ts";
    export { OSWAP_OracleChainlinkGeneric } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkGeneric.ts";
    export { OSWAP_OracleChainlinkLimitedGeneric } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimitedGeneric.ts";
    export { OSWAP_OracleChainlinkPriceGuardFiatGeneric } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatGeneric.ts";
    export { OSWAP_OracleChainlinkPriceGuardGeneric } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardGeneric.ts";
    export { OSWAP_OracleChainlinkV1Generic } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkV1Generic.ts";
    export { OSWAP_OracleChainlinkLimited } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkLimited.ts";
    export { OSWAP_OracleChainlinkPriceGuardBinance } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardBinance.ts";
    export { OSWAP_OracleChainlinkPriceGuardFiatAvalanche } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatAvalanche.ts";
    export { OSWAP_OracleChainlinkPriceGuardFiatBinance } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleChainlinkPriceGuardFiatBinance.ts";
    export { OSWAP_OracleConstant } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstant.ts";
    export { OSWAP_OracleConstantLimited } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleConstantLimited.ts";
    export { OSWAP_OracleSetYourOwnPrice } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSetYourOwnPrice.ts";
    export { OSWAP_OracleSigned } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleSigned.ts";
    export { OSWAP_OracleUnity } from "@scom/oracle-adaptor-contract/contracts/OSWAP_OracleUnity.ts";
}
/// <amd-module name="@scom/oracle-adaptor-contract" />
declare module "@scom/oracle-adaptor-contract" {
    export * as Contracts from "@scom/oracle-adaptor-contract/contracts/index.ts";
}
