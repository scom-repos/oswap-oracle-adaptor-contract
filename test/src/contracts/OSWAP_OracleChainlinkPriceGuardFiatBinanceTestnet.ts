import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./OSWAP_OracleChainlinkPriceGuardFiatBinanceTestnet.json";

export class OSWAP_OracleChainlinkPriceGuardFiatBinanceTestnet extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params:{wbnb:string,busd:string,usdt:string,factory:string,maxValue:number|BigNumber,deviation:number|BigNumber,returnAmmPrice:boolean}): Promise<string>{
        return this._deploy(params.wbnb,params.busd,params.usdt,params.factory,Utils.toString(params.maxValue),Utils.toString(params.deviation),params.returnAmmPrice);
    }
    async WETH(): Promise<string>{
        let result = await this.call('WETH');
        return result;
    }
    async chainlinkDeicmals(): Promise<BigNumber>{
        let result = await this.call('chainlinkDeicmals');
        return new BigNumber(result);
    }
    async decimals(): Promise<BigNumber>{
        let result = await this.call('decimals');
        return new BigNumber(result);
    }
    async decimals_1(param1:string): Promise<BigNumber>{
        let result = await this.call('decimals',[param1]);
        return new BigNumber(result);
    }
    async factory(): Promise<string>{
        let result = await this.call('factory');
        return result;
    }
    async getLatestPrice(params:{from:string,to:string,payload:string}): Promise<BigNumber>{
        let result = await this.call('getLatestPrice',[params.from,params.to,params.payload]);
        return new BigNumber(result);
    }
    async getPriceInfo(params:{from:string,to:string,fromAmount:number|BigNumber,toAmount:number|BigNumber}): Promise<{chainlinkPrice:BigNumber,ammPrice:BigNumber,usdAmount:BigNumber}>{
        let result = await this.call('getPriceInfo',[params.from,params.to,Utils.toString(params.fromAmount),Utils.toString(params.toAmount)]);
        return {
            chainlinkPrice: new BigNumber(result.chainlinkPrice),
            ammPrice: new BigNumber(result.ammPrice),
            usdAmount: new BigNumber(result.usdAmount)
        };
    }
    async getRatio(params:{from:string,to:string,fromAmount:number|BigNumber,toAmount:number|BigNumber,payload:string}): Promise<{numerator:BigNumber,denominator:BigNumber}>{
        let result = await this.call('getRatio',[params.from,params.to,Utils.toString(params.fromAmount),Utils.toString(params.toAmount),params.payload]);
        return {
            numerator: new BigNumber(result.numerator),
            denominator: new BigNumber(result.denominator)
        };
    }
    async high(): Promise<BigNumber>{
        let result = await this.call('high');
        return new BigNumber(result);
    }
    async isSupported(params:{from:string,to:string}): Promise<boolean>{
        let result = await this.call('isSupported',[params.from,params.to]);
        return result;
    }
    async low(): Promise<BigNumber>{
        let result = await this.call('low');
        return new BigNumber(result);
    }
    async maxValue(): Promise<BigNumber>{
        let result = await this.call('maxValue');
        return new BigNumber(result);
    }
    async priceFeedAddresses(param1:string): Promise<string>{
        let result = await this.call('priceFeedAddresses',[param1]);
        return result;
    }
    async returnAmmPrice(): Promise<boolean>{
        let result = await this.call('returnAmmPrice');
        return result;
    }
    async wethDecimals(): Promise<BigNumber>{
        let result = await this.call('wethDecimals');
        return new BigNumber(result);
    }
    async wethPriceFeed(): Promise<string>{
        let result = await this.call('wethPriceFeed');
        return result;
    }
    private assign(){
    }
}