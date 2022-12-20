import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./MockPriceGuardFactory.json";

export class MockPriceGuardFactory extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(): Promise<string>{
        return this._deploy();
    }
    async getPair(params:{param1:string,param2:string}): Promise<string>{
        let result = await this.call('getPair',[params.param1,params.param2]);
        return result;
    }
    async minLotSize(param1:string): Promise<BigNumber>{
        let result = await this.call('minLotSize',[param1]);
        return new BigNumber(result);
    }
    async set_send(params:{token0:string,token1:string,pair:string}): Promise<TransactionReceipt>{
        let result = await this.send('set',[params.token0,params.token1,params.pair]);
        return result;
    }
    async set_call(params:{token0:string,token1:string,pair:string}): Promise<void>{
        let result = await this.call('set',[params.token0,params.token1,params.pair]);
        return;
    }
    set: {
        (params:{token0:string,token1:string,pair:string}): Promise<TransactionReceipt>;
        call: (params:{token0:string,token1:string,pair:string}) => Promise<void>;
    }
    private assign(){
        this.set = Object.assign(this.set_send, {call:this.set_call});
    }
}