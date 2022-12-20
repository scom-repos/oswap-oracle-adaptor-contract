import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./MockPriceGuardPair.json";

export class MockPriceGuardPair extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params:{token0:string,token1:string}): Promise<string>{
        return this._deploy(params.token0,params.token1);
    }
    async __reserve0(): Promise<BigNumber>{
        let result = await this.call('__reserve0');
        return new BigNumber(result);
    }
    async __reserve1(): Promise<BigNumber>{
        let result = await this.call('__reserve1');
        return new BigNumber(result);
    }
    async getReserves(): Promise<{reserve0:BigNumber,reserve1:BigNumber,blockTimestampLast:BigNumber}>{
        let result = await this.call('getReserves');
        return {
            reserve0: new BigNumber(result.reserve0),
            reserve1: new BigNumber(result.reserve1),
            blockTimestampLast: new BigNumber(result.blockTimestampLast)
        };
    }
    async setReserves_send(params:{reserve0:number|BigNumber,reserve1:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('setReserves',[Utils.toString(params.reserve0),Utils.toString(params.reserve1)]);
        return result;
    }
    async setReserves_call(params:{reserve0:number|BigNumber,reserve1:number|BigNumber}): Promise<void>{
        let result = await this.call('setReserves',[Utils.toString(params.reserve0),Utils.toString(params.reserve1)]);
        return;
    }
    setReserves: {
        (params:{reserve0:number|BigNumber,reserve1:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{reserve0:number|BigNumber,reserve1:number|BigNumber}) => Promise<void>;
    }
    async token0(): Promise<string>{
        let result = await this.call('token0');
        return result;
    }
    async token1(): Promise<string>{
        let result = await this.call('token1');
        return result;
    }
    private assign(){
        this.setReserves = Object.assign(this.setReserves_send, {call:this.setReserves_call});
    }
}