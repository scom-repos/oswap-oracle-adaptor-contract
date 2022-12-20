import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./MockLimitedFactory.json";

export class MockLimitedFactory extends Contract{
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
    async setMinLotSize_send(params:{token:string,size:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('setMinLotSize',[params.token,Utils.toString(params.size)]);
        return result;
    }
    async setMinLotSize_call(params:{token:string,size:number|BigNumber}): Promise<void>{
        let result = await this.call('setMinLotSize',[params.token,Utils.toString(params.size)]);
        return;
    }
    setMinLotSize: {
        (params:{token:string,size:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{token:string,size:number|BigNumber}) => Promise<void>;
    }
    private assign(){
        this.setMinLotSize = Object.assign(this.setMinLotSize_send, {call:this.setMinLotSize_call});
    }
}