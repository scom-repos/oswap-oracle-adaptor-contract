import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./MockV3Aggregator.json";

export class MockV3Aggregator extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params:{description:string,decimals:number|BigNumber,initialAnswer:number|BigNumber}): Promise<string>{
        return this._deploy(params.description,Utils.toString(params.decimals),Utils.toString(params.initialAnswer));
    }
    parseAnswerUpdatedEvent(receipt: TransactionReceipt): MockV3Aggregator.AnswerUpdatedEvent[]{
        return this.parseEvents(receipt, "AnswerUpdated").map(e=>this.decodeAnswerUpdatedEvent(e));
    }
    decodeAnswerUpdatedEvent(event: Event): MockV3Aggregator.AnswerUpdatedEvent{
        let result = event.data;
        return {
            current: new BigNumber(result.current),
            roundId: new BigNumber(result.roundId),
            updatedAt: new BigNumber(result.updatedAt),
            _event: event
        };
    }
    parseNewRoundEvent(receipt: TransactionReceipt): MockV3Aggregator.NewRoundEvent[]{
        return this.parseEvents(receipt, "NewRound").map(e=>this.decodeNewRoundEvent(e));
    }
    decodeNewRoundEvent(event: Event): MockV3Aggregator.NewRoundEvent{
        let result = event.data;
        return {
            roundId: new BigNumber(result.roundId),
            startedBy: result.startedBy,
            startedAt: new BigNumber(result.startedAt),
            _event: event
        };
    }
    async decimals(): Promise<BigNumber>{
        let result = await this.call('decimals');
        return new BigNumber(result);
    }
    async description(): Promise<string>{
        let result = await this.call('description');
        return result;
    }
    async getAnswer(param1:number|BigNumber): Promise<BigNumber>{
        let result = await this.call('getAnswer',[Utils.toString(param1)]);
        return new BigNumber(result);
    }
    async getRoundData(roundId:number|BigNumber): Promise<{roundId:BigNumber,answer:BigNumber,startedAt:BigNumber,updatedAt:BigNumber,answeredInRound:BigNumber}>{
        let result = await this.call('getRoundData',[Utils.toString(roundId)]);
        return {
            roundId: new BigNumber(result.roundId),
            answer: new BigNumber(result.answer),
            startedAt: new BigNumber(result.startedAt),
            updatedAt: new BigNumber(result.updatedAt),
            answeredInRound: new BigNumber(result.answeredInRound)
        };
    }
    async getTimestamp(param1:number|BigNumber): Promise<BigNumber>{
        let result = await this.call('getTimestamp',[Utils.toString(param1)]);
        return new BigNumber(result);
    }
    async latestAnswer(): Promise<BigNumber>{
        let result = await this.call('latestAnswer');
        return new BigNumber(result);
    }
    async latestRound(): Promise<BigNumber>{
        let result = await this.call('latestRound');
        return new BigNumber(result);
    }
    async latestRoundData(): Promise<{roundId:BigNumber,answer:BigNumber,startedAt:BigNumber,updatedAt:BigNumber,answeredInRound:BigNumber}>{
        let result = await this.call('latestRoundData');
        return {
            roundId: new BigNumber(result.roundId),
            answer: new BigNumber(result.answer),
            startedAt: new BigNumber(result.startedAt),
            updatedAt: new BigNumber(result.updatedAt),
            answeredInRound: new BigNumber(result.answeredInRound)
        };
    }
    async latestTimestamp(): Promise<BigNumber>{
        let result = await this.call('latestTimestamp');
        return new BigNumber(result);
    }
    async updateAnswer_send(answer:number|BigNumber): Promise<TransactionReceipt>{
        let result = await this.send('updateAnswer',[Utils.toString(answer)]);
        return result;
    }
    async updateAnswer_call(answer:number|BigNumber): Promise<void>{
        let result = await this.call('updateAnswer',[Utils.toString(answer)]);
        return;
    }
    updateAnswer: {
        (answer:number|BigNumber): Promise<TransactionReceipt>;
        call: (answer:number|BigNumber) => Promise<void>;
    }
    async updateRoundData_send(params:{roundId:number|BigNumber,answer:number|BigNumber,timestamp:number|BigNumber,startedAt:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('updateRoundData',[Utils.toString(params.roundId),Utils.toString(params.answer),Utils.toString(params.timestamp),Utils.toString(params.startedAt)]);
        return result;
    }
    async updateRoundData_call(params:{roundId:number|BigNumber,answer:number|BigNumber,timestamp:number|BigNumber,startedAt:number|BigNumber}): Promise<void>{
        let result = await this.call('updateRoundData',[Utils.toString(params.roundId),Utils.toString(params.answer),Utils.toString(params.timestamp),Utils.toString(params.startedAt)]);
        return;
    }
    updateRoundData: {
        (params:{roundId:number|BigNumber,answer:number|BigNumber,timestamp:number|BigNumber,startedAt:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{roundId:number|BigNumber,answer:number|BigNumber,timestamp:number|BigNumber,startedAt:number|BigNumber}) => Promise<void>;
    }
    async version(): Promise<BigNumber>{
        let result = await this.call('version');
        return new BigNumber(result);
    }
    private assign(){
        this.updateAnswer = Object.assign(this.updateAnswer_send, {call:this.updateAnswer_call});
        this.updateRoundData = Object.assign(this.updateRoundData_send, {call:this.updateRoundData_call});
    }
}
export module MockV3Aggregator{
    export interface AnswerUpdatedEvent {current:BigNumber,roundId:BigNumber,updatedAt:BigNumber,_event:Event}
    export interface NewRoundEvent {roundId:BigNumber,startedBy:string,startedAt:BigNumber,_event:Event}
}