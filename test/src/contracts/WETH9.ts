import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./WETH9.json";

export class WETH9 extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(): Promise<string>{
        return this._deploy();
    }
    parseApprovalEvent(receipt: TransactionReceipt): WETH9.ApprovalEvent[]{
        return this.parseEvents(receipt, "Approval").map(e=>this.decodeApprovalEvent(e));
    }
    decodeApprovalEvent(event: Event): WETH9.ApprovalEvent{
        let result = event.data;
        return {
            src: result.src,
            guy: result.guy,
            wad: new BigNumber(result.wad),
            _event: event
        };
    }
    parseDepositEvent(receipt: TransactionReceipt): WETH9.DepositEvent[]{
        return this.parseEvents(receipt, "Deposit").map(e=>this.decodeDepositEvent(e));
    }
    decodeDepositEvent(event: Event): WETH9.DepositEvent{
        let result = event.data;
        return {
            dst: result.dst,
            wad: new BigNumber(result.wad),
            _event: event
        };
    }
    parseTransferEvent(receipt: TransactionReceipt): WETH9.TransferEvent[]{
        return this.parseEvents(receipt, "Transfer").map(e=>this.decodeTransferEvent(e));
    }
    decodeTransferEvent(event: Event): WETH9.TransferEvent{
        let result = event.data;
        return {
            src: result.src,
            dst: result.dst,
            wad: new BigNumber(result.wad),
            _event: event
        };
    }
    parseWithdrawalEvent(receipt: TransactionReceipt): WETH9.WithdrawalEvent[]{
        return this.parseEvents(receipt, "Withdrawal").map(e=>this.decodeWithdrawalEvent(e));
    }
    decodeWithdrawalEvent(event: Event): WETH9.WithdrawalEvent{
        let result = event.data;
        return {
            src: result.src,
            wad: new BigNumber(result.wad),
            _event: event
        };
    }
    async allowance(params:{param1:string,param2:string}): Promise<BigNumber>{
        let result = await this.call('allowance',[params.param1,params.param2]);
        return new BigNumber(result);
    }
    async approve_send(params:{guy:string,wad:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('approve',[params.guy,Utils.toString(params.wad)]);
        return result;
    }
    async approve_call(params:{guy:string,wad:number|BigNumber}): Promise<boolean>{
        let result = await this.call('approve',[params.guy,Utils.toString(params.wad)]);
        return result;
    }
    approve: {
        (params:{guy:string,wad:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{guy:string,wad:number|BigNumber}) => Promise<boolean>;
    }
    async balanceOf(param1:string): Promise<BigNumber>{
        let result = await this.call('balanceOf',[param1]);
        return new BigNumber(result);
    }
    async decimals(): Promise<BigNumber>{
        let result = await this.call('decimals');
        return new BigNumber(result);
    }
    async deposit_send(_value:number|BigNumber): Promise<TransactionReceipt>{
        let result = await this.send('deposit', [], {value:_value});
        return result;
    }
    async deposit_call(_value:number|BigNumber): Promise<void>{
        let result = await this.call('deposit', [], {value:_value});
        return;
    }
    deposit: {
        (_value:number|BigNumber): Promise<TransactionReceipt>;
        call: (_value:number|BigNumber) => Promise<void>;
    }
    async name(): Promise<string>{
        let result = await this.call('name');
        return result;
    }
    async symbol(): Promise<string>{
        let result = await this.call('symbol');
        return result;
    }
    async totalSupply(): Promise<BigNumber>{
        let result = await this.call('totalSupply');
        return new BigNumber(result);
    }
    async transfer_send(params:{dst:string,wad:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('transfer',[params.dst,Utils.toString(params.wad)]);
        return result;
    }
    async transfer_call(params:{dst:string,wad:number|BigNumber}): Promise<boolean>{
        let result = await this.call('transfer',[params.dst,Utils.toString(params.wad)]);
        return result;
    }
    transfer: {
        (params:{dst:string,wad:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{dst:string,wad:number|BigNumber}) => Promise<boolean>;
    }
    async transferFrom_send(params:{src:string,dst:string,wad:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('transferFrom',[params.src,params.dst,Utils.toString(params.wad)]);
        return result;
    }
    async transferFrom_call(params:{src:string,dst:string,wad:number|BigNumber}): Promise<boolean>{
        let result = await this.call('transferFrom',[params.src,params.dst,Utils.toString(params.wad)]);
        return result;
    }
    transferFrom: {
        (params:{src:string,dst:string,wad:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{src:string,dst:string,wad:number|BigNumber}) => Promise<boolean>;
    }
    async withdraw_send(wad:number|BigNumber): Promise<TransactionReceipt>{
        let result = await this.send('withdraw',[Utils.toString(wad)]);
        return result;
    }
    async withdraw_call(wad:number|BigNumber): Promise<void>{
        let result = await this.call('withdraw',[Utils.toString(wad)]);
        return;
    }
    withdraw: {
        (wad:number|BigNumber): Promise<TransactionReceipt>;
        call: (wad:number|BigNumber) => Promise<void>;
    }
    private assign(){
        this.approve = Object.assign(this.approve_send, {call:this.approve_call});
        this.deposit = Object.assign(this.deposit_send, {call:this.deposit_call});
        this.transfer = Object.assign(this.transfer_send, {call:this.transfer_call});
        this.transferFrom = Object.assign(this.transferFrom_send, {call:this.transferFrom_call});
        this.withdraw = Object.assign(this.withdraw_send, {call:this.withdraw_call});
    }
}
export module WETH9{
    export interface ApprovalEvent {src:string,guy:string,wad:BigNumber,_event:Event}
    export interface DepositEvent {dst:string,wad:BigNumber,_event:Event}
    export interface TransferEvent {src:string,dst:string,wad:BigNumber,_event:Event}
    export interface WithdrawalEvent {src:string,wad:BigNumber,_event:Event}
}