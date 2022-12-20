import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./MockSecurityOracle.json";

export class MockSecurityOracle extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(): Promise<string>{
        return this._deploy();
    }
    async getSecurityScore(oracle:string): Promise<BigNumber>{
        let result = await this.call('getSecurityScore',[oracle]);
        return new BigNumber(result);
    }
    async oracleAddress(): Promise<string>{
        let result = await this.call('oracleAddress');
        return result;
    }
    async setSecurityScore_send(params:{oracle:string,score:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('setSecurityScore',[params.oracle,Utils.toString(params.score)]);
        return result;
    }
    async setSecurityScore_call(params:{oracle:string,score:number|BigNumber}): Promise<void>{
        let result = await this.call('setSecurityScore',[params.oracle,Utils.toString(params.score)]);
        return;
    }
    setSecurityScore: {
        (params:{oracle:string,score:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{oracle:string,score:number|BigNumber}) => Promise<void>;
    }
    private assign(){
        this.setSecurityScore = Object.assign(this.setSecurityScore_send, {call:this.setSecurityScore_call});
    }
}