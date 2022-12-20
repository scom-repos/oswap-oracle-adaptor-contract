import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./CertiKSecurityOracle.json";

export class CertiKSecurityOracle extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(): Promise<string>{
        return this._deploy();
    }
    parseBatchResultUpdateEvent(receipt: TransactionReceipt): CertiKSecurityOracle.BatchResultUpdateEvent[]{
        return this.parseEvents(receipt, "BatchResultUpdate").map(e=>this.decodeBatchResultUpdateEvent(e));
    }
    decodeBatchResultUpdateEvent(event: Event): CertiKSecurityOracle.BatchResultUpdateEvent{
        let result = event.data;
        return {
            length: new BigNumber(result.length),
            _event: event
        };
    }
    parseDefaultScoreChangedEvent(receipt: TransactionReceipt): CertiKSecurityOracle.DefaultScoreChangedEvent[]{
        return this.parseEvents(receipt, "DefaultScoreChanged").map(e=>this.decodeDefaultScoreChangedEvent(e));
    }
    decodeDefaultScoreChangedEvent(event: Event): CertiKSecurityOracle.DefaultScoreChangedEvent{
        let result = event.data;
        return {
            score: new BigNumber(result.score),
            _event: event
        };
    }
    parseInitEvent(receipt: TransactionReceipt): CertiKSecurityOracle.InitEvent[]{
        return this.parseEvents(receipt, "Init").map(e=>this.decodeInitEvent(e));
    }
    decodeInitEvent(event: Event): CertiKSecurityOracle.InitEvent{
        let result = event.data;
        return {
            defaultScore: new BigNumber(result.defaultScore),
            _event: event
        };
    }
    parseOwnershipTransferredEvent(receipt: TransactionReceipt): CertiKSecurityOracle.OwnershipTransferredEvent[]{
        return this.parseEvents(receipt, "OwnershipTransferred").map(e=>this.decodeOwnershipTransferredEvent(e));
    }
    decodeOwnershipTransferredEvent(event: Event): CertiKSecurityOracle.OwnershipTransferredEvent{
        let result = event.data;
        return {
            previousOwner: result.previousOwner,
            newOwner: result.newOwner,
            _event: event
        };
    }
    parseResultUpdateEvent(receipt: TransactionReceipt): CertiKSecurityOracle.ResultUpdateEvent[]{
        return this.parseEvents(receipt, "ResultUpdate").map(e=>this.decodeResultUpdateEvent(e));
    }
    decodeResultUpdateEvent(event: Event): CertiKSecurityOracle.ResultUpdateEvent{
        let result = event.data;
        return {
            target: result.target,
            functionSignature: result.functionSignature,
            score: new BigNumber(result.score),
            expiration: new BigNumber(result.expiration),
            _event: event
        };
    }
    async batchPushResult_send(params:{contractAddresses:string[],functionSignatures:string[],scores:(number|BigNumber)[],expirations:(number|BigNumber)[]}): Promise<TransactionReceipt>{
        let result = await this.send('batchPushResult',[params.contractAddresses,params.functionSignatures,Utils.toString(params.scores),Utils.toString(params.expirations)]);
        return result;
    }
    async batchPushResult_call(params:{contractAddresses:string[],functionSignatures:string[],scores:(number|BigNumber)[],expirations:(number|BigNumber)[]}): Promise<void>{
        let result = await this.call('batchPushResult',[params.contractAddresses,params.functionSignatures,Utils.toString(params.scores),Utils.toString(params.expirations)]);
        return;
    }
    batchPushResult: {
        (params:{contractAddresses:string[],functionSignatures:string[],scores:(number|BigNumber)[],expirations:(number|BigNumber)[]}): Promise<TransactionReceipt>;
        call: (params:{contractAddresses:string[],functionSignatures:string[],scores:(number|BigNumber)[],expirations:(number|BigNumber)[]}) => Promise<void>;
    }
    async defaultScore(): Promise<BigNumber>{
        let result = await this.call('defaultScore');
        return new BigNumber(result);
    }
    async getSecurityScore(contractAddress:string): Promise<BigNumber>{
        let result = await this.call('getSecurityScore',[contractAddress]);
        return new BigNumber(result);
    }
    async getSecurityScore_1(params:{contractAddress:string,functionSignature:string}): Promise<BigNumber>{
        let result = await this.call('getSecurityScore',[params.contractAddress,params.functionSignature]);
        return new BigNumber(result);
    }
    async getSecurityScoreBytes4(params:{contractAddress:string,functionSignature:string}): Promise<BigNumber>{
        let result = await this.call('getSecurityScoreBytes4',[params.contractAddress,params.functionSignature]);
        return new BigNumber(result);
    }
    async getSecurityScores(params:{addresses:string[],functionSignatures:string[]}): Promise<BigNumber[]>{
        let result = await this.call('getSecurityScores',[params.addresses,params.functionSignatures]);
        return result.map(e=>new BigNumber(e));
    }
    async initialize_send(): Promise<TransactionReceipt>{
        let result = await this.send('initialize');
        return result;
    }
    async initialize_call(): Promise<void>{
        let result = await this.call('initialize');
        return;
    }
    initialize: {
        (): Promise<TransactionReceipt>;
        call: () => Promise<void>;
    }
    async owner(): Promise<string>{
        let result = await this.call('owner');
        return result;
    }
    async pushResult_send(params:{contractAddress:string,functionSignature:string,score:number|BigNumber,expiration:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('pushResult',[params.contractAddress,params.functionSignature,Utils.toString(params.score),Utils.toString(params.expiration)]);
        return result;
    }
    async pushResult_call(params:{contractAddress:string,functionSignature:string,score:number|BigNumber,expiration:number|BigNumber}): Promise<void>{
        let result = await this.call('pushResult',[params.contractAddress,params.functionSignature,Utils.toString(params.score),Utils.toString(params.expiration)]);
        return;
    }
    pushResult: {
        (params:{contractAddress:string,functionSignature:string,score:number|BigNumber,expiration:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{contractAddress:string,functionSignature:string,score:number|BigNumber,expiration:number|BigNumber}) => Promise<void>;
    }
    async renounceOwnership_send(): Promise<TransactionReceipt>{
        let result = await this.send('renounceOwnership');
        return result;
    }
    async renounceOwnership_call(): Promise<void>{
        let result = await this.call('renounceOwnership');
        return;
    }
    renounceOwnership: {
        (): Promise<TransactionReceipt>;
        call: () => Promise<void>;
    }
    async transferOwnership_send(newOwner:string): Promise<TransactionReceipt>{
        let result = await this.send('transferOwnership',[newOwner]);
        return result;
    }
    async transferOwnership_call(newOwner:string): Promise<void>{
        let result = await this.call('transferOwnership',[newOwner]);
        return;
    }
    transferOwnership: {
        (newOwner:string): Promise<TransactionReceipt>;
        call: (newOwner:string) => Promise<void>;
    }
    async updateDefaultScore_send(score:number|BigNumber): Promise<TransactionReceipt>{
        let result = await this.send('updateDefaultScore',[Utils.toString(score)]);
        return result;
    }
    async updateDefaultScore_call(score:number|BigNumber): Promise<void>{
        let result = await this.call('updateDefaultScore',[Utils.toString(score)]);
        return;
    }
    updateDefaultScore: {
        (score:number|BigNumber): Promise<TransactionReceipt>;
        call: (score:number|BigNumber) => Promise<void>;
    }
    private assign(){
        this.batchPushResult = Object.assign(this.batchPushResult_send, {call:this.batchPushResult_call});
        this.initialize = Object.assign(this.initialize_send, {call:this.initialize_call});
        this.pushResult = Object.assign(this.pushResult_send, {call:this.pushResult_call});
        this.renounceOwnership = Object.assign(this.renounceOwnership_send, {call:this.renounceOwnership_call});
        this.transferOwnership = Object.assign(this.transferOwnership_send, {call:this.transferOwnership_call});
        this.updateDefaultScore = Object.assign(this.updateDefaultScore_send, {call:this.updateDefaultScore_call});
    }
}
export module CertiKSecurityOracle{
    export interface BatchResultUpdateEvent {length:BigNumber,_event:Event}
    export interface DefaultScoreChangedEvent {score:BigNumber,_event:Event}
    export interface InitEvent {defaultScore:BigNumber,_event:Event}
    export interface OwnershipTransferredEvent {previousOwner:string,newOwner:string,_event:Event}
    export interface ResultUpdateEvent {target:string,functionSignature:string,score:BigNumber,expiration:BigNumber,_event:Event}
}