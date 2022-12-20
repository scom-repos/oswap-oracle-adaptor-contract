import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./MockChainlink.json";

export class MockChainlink extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params:{decimals:number|BigNumber,description:string,version:number|BigNumber}): Promise<string>{
        return this._deploy(Utils.toString(params.decimals),params.description,Utils.toString(params.version));
    }
    async answer(): Promise<BigNumber>{
        let result = await this.call('answer');
        return new BigNumber(result);
    }
    async answeredInRound(): Promise<BigNumber>{
        let result = await this.call('answeredInRound');
        return new BigNumber(result);
    }
    async decimals(): Promise<BigNumber>{
        let result = await this.call('decimals');
        return new BigNumber(result);
    }
    async description(): Promise<string>{
        let result = await this.call('description');
        return result;
    }
    async getRoundData(roundId:number|BigNumber): Promise<{_roundId:BigNumber,_answer:BigNumber,_startedAt:BigNumber,_updatedAt:BigNumber,_answeredInRound:BigNumber}>{
        let result = await this.call('getRoundData',[Utils.toString(roundId)]);
        return {
            _roundId: new BigNumber(result._roundId),
            _answer: new BigNumber(result._answer),
            _startedAt: new BigNumber(result._startedAt),
            _updatedAt: new BigNumber(result._updatedAt),
            _answeredInRound: new BigNumber(result._answeredInRound)
        };
    }
    async latestRoundData(): Promise<{_roundId:BigNumber,_answer:BigNumber,_startedAt:BigNumber,_updatedAt:BigNumber,_answeredInRound:BigNumber}>{
        let result = await this.call('latestRoundData');
        return {
            _roundId: new BigNumber(result._roundId),
            _answer: new BigNumber(result._answer),
            _startedAt: new BigNumber(result._startedAt),
            _updatedAt: new BigNumber(result._updatedAt),
            _answeredInRound: new BigNumber(result._answeredInRound)
        };
    }
    async roundId(): Promise<BigNumber>{
        let result = await this.call('roundId');
        return new BigNumber(result);
    }
    async setRoundData_send(params:{roundId:number|BigNumber,answer:number|BigNumber,startedAt:number|BigNumber,updatedAt:number|BigNumber,answeredInRound:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('setRoundData',[Utils.toString(params.roundId),Utils.toString(params.answer),Utils.toString(params.startedAt),Utils.toString(params.updatedAt),Utils.toString(params.answeredInRound)]);
        return result;
    }
    async setRoundData_call(params:{roundId:number|BigNumber,answer:number|BigNumber,startedAt:number|BigNumber,updatedAt:number|BigNumber,answeredInRound:number|BigNumber}): Promise<void>{
        let result = await this.call('setRoundData',[Utils.toString(params.roundId),Utils.toString(params.answer),Utils.toString(params.startedAt),Utils.toString(params.updatedAt),Utils.toString(params.answeredInRound)]);
        return;
    }
    setRoundData: {
        (params:{roundId:number|BigNumber,answer:number|BigNumber,startedAt:number|BigNumber,updatedAt:number|BigNumber,answeredInRound:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{roundId:number|BigNumber,answer:number|BigNumber,startedAt:number|BigNumber,updatedAt:number|BigNumber,answeredInRound:number|BigNumber}) => Promise<void>;
    }
    async startedAt(): Promise<BigNumber>{
        let result = await this.call('startedAt');
        return new BigNumber(result);
    }
    async updatedAt(): Promise<BigNumber>{
        let result = await this.call('updatedAt');
        return new BigNumber(result);
    }
    async version(): Promise<BigNumber>{
        let result = await this.call('version');
        return new BigNumber(result);
    }
    private assign(){
        this.setRoundData = Object.assign(this.setRoundData_send, {call:this.setRoundData_call});
    }
}