import {IWallet, Contract, Transaction, TransactionReceipt, Utils, BigNumber, Event} from "@ijstech/eth-wallet";
import Bin from "./MockERC20.json";

export class MockERC20 extends Contract{
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params:{symbol:string,name:string,initialSupply:number|BigNumber,cap:number|BigNumber,decimals:number|BigNumber}): Promise<string>{
        return this._deploy(params.symbol,params.name,Utils.toString(params.initialSupply),Utils.toString(params.cap),Utils.toString(params.decimals));
    }
    parseApprovalEvent(receipt: TransactionReceipt): MockERC20.ApprovalEvent[]{
        return this.parseEvents(receipt, "Approval").map(e=>this.decodeApprovalEvent(e));
    }
    decodeApprovalEvent(event: Event): MockERC20.ApprovalEvent{
        let result = event.data;
        return {
            owner: result.owner,
            spender: result.spender,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parseAuthEvent(receipt: TransactionReceipt): MockERC20.AuthEvent[]{
        return this.parseEvents(receipt, "Auth").map(e=>this.decodeAuthEvent(e));
    }
    decodeAuthEvent(event: Event): MockERC20.AuthEvent{
        let result = event.data;
        return {
            account: result.account,
            auth: new BigNumber(result.auth),
            _event: event
        };
    }
    parseTransferEvent(receipt: TransactionReceipt): MockERC20.TransferEvent[]{
        return this.parseEvents(receipt, "Transfer").map(e=>this.decodeTransferEvent(e));
    }
    decodeTransferEvent(event: Event): MockERC20.TransferEvent{
        let result = event.data;
        return {
            from: result.from,
            to: result.to,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    async allowance(params:{param1:string,param2:string}): Promise<BigNumber>{
        let result = await this.call('allowance',[params.param1,params.param2]);
        return new BigNumber(result);
    }
    async approve_send(params:{spender:string,value:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('approve',[params.spender,Utils.toString(params.value)]);
        return result;
    }
    async approve_call(params:{spender:string,value:number|BigNumber}): Promise<boolean>{
        let result = await this.call('approve',[params.spender,Utils.toString(params.value)]);
        return result;
    }
    approve: {
        (params:{spender:string,value:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{spender:string,value:number|BigNumber}) => Promise<boolean>;
    }
    async balanceOf(param1:string): Promise<BigNumber>{
        let result = await this.call('balanceOf',[param1]);
        return new BigNumber(result);
    }
    async burn_send(params:{account:string,value:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('burn',[params.account,Utils.toString(params.value)]);
        return result;
    }
    async burn_call(params:{account:string,value:number|BigNumber}): Promise<void>{
        let result = await this.call('burn',[params.account,Utils.toString(params.value)]);
        return;
    }
    burn: {
        (params:{account:string,value:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{account:string,value:number|BigNumber}) => Promise<void>;
    }
    async cap(): Promise<BigNumber>{
        let result = await this.call('cap');
        return new BigNumber(result);
    }
    async decimals(): Promise<BigNumber>{
        let result = await this.call('decimals');
        return new BigNumber(result);
    }
    async decreaseAllowance_send(params:{spender:string,subtractedValue:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('decreaseAllowance',[params.spender,Utils.toString(params.subtractedValue)]);
        return result;
    }
    async decreaseAllowance_call(params:{spender:string,subtractedValue:number|BigNumber}): Promise<boolean>{
        let result = await this.call('decreaseAllowance',[params.spender,Utils.toString(params.subtractedValue)]);
        return result;
    }
    decreaseAllowance: {
        (params:{spender:string,subtractedValue:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{spender:string,subtractedValue:number|BigNumber}) => Promise<boolean>;
    }
    async deny_send(account:string): Promise<TransactionReceipt>{
        let result = await this.send('deny',[account]);
        return result;
    }
    async deny_call(account:string): Promise<void>{
        let result = await this.call('deny',[account]);
        return;
    }
    deny: {
        (account:string): Promise<TransactionReceipt>;
        call: (account:string) => Promise<void>;
    }
    async increaseAllowance_send(params:{spender:string,addedValue:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('increaseAllowance',[params.spender,Utils.toString(params.addedValue)]);
        return result;
    }
    async increaseAllowance_call(params:{spender:string,addedValue:number|BigNumber}): Promise<boolean>{
        let result = await this.call('increaseAllowance',[params.spender,Utils.toString(params.addedValue)]);
        return result;
    }
    increaseAllowance: {
        (params:{spender:string,addedValue:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{spender:string,addedValue:number|BigNumber}) => Promise<boolean>;
    }
    async mint_send(params:{account:string,value:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('mint',[params.account,Utils.toString(params.value)]);
        return result;
    }
    async mint_call(params:{account:string,value:number|BigNumber}): Promise<void>{
        let result = await this.call('mint',[params.account,Utils.toString(params.value)]);
        return;
    }
    mint: {
        (params:{account:string,value:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{account:string,value:number|BigNumber}) => Promise<void>;
    }
    async name(): Promise<string>{
        let result = await this.call('name');
        return result;
    }
    async owners(param1:string): Promise<BigNumber>{
        let result = await this.call('owners',[param1]);
        return new BigNumber(result);
    }
    async rely_send(account:string): Promise<TransactionReceipt>{
        let result = await this.send('rely',[account]);
        return result;
    }
    async rely_call(account:string): Promise<void>{
        let result = await this.call('rely',[account]);
        return;
    }
    rely: {
        (account:string): Promise<TransactionReceipt>;
        call: (account:string) => Promise<void>;
    }
    async symbol(): Promise<string>{
        let result = await this.call('symbol');
        return result;
    }
    async totalSupply(): Promise<BigNumber>{
        let result = await this.call('totalSupply');
        return new BigNumber(result);
    }
    async transfer_send(params:{to:string,value:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('transfer',[params.to,Utils.toString(params.value)]);
        return result;
    }
    async transfer_call(params:{to:string,value:number|BigNumber}): Promise<boolean>{
        let result = await this.call('transfer',[params.to,Utils.toString(params.value)]);
        return result;
    }
    transfer: {
        (params:{to:string,value:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{to:string,value:number|BigNumber}) => Promise<boolean>;
    }
    async transferFrom_send(params:{from:string,to:string,value:number|BigNumber}): Promise<TransactionReceipt>{
        let result = await this.send('transferFrom',[params.from,params.to,Utils.toString(params.value)]);
        return result;
    }
    async transferFrom_call(params:{from:string,to:string,value:number|BigNumber}): Promise<boolean>{
        let result = await this.call('transferFrom',[params.from,params.to,Utils.toString(params.value)]);
        return result;
    }
    transferFrom: {
        (params:{from:string,to:string,value:number|BigNumber}): Promise<TransactionReceipt>;
        call: (params:{from:string,to:string,value:number|BigNumber}) => Promise<boolean>;
    }
    private assign(){
        this.approve = Object.assign(this.approve_send, {call:this.approve_call});
        this.burn = Object.assign(this.burn_send, {call:this.burn_call});
        this.decreaseAllowance = Object.assign(this.decreaseAllowance_send, {call:this.decreaseAllowance_call});
        this.deny = Object.assign(this.deny_send, {call:this.deny_call});
        this.increaseAllowance = Object.assign(this.increaseAllowance_send, {call:this.increaseAllowance_call});
        this.mint = Object.assign(this.mint_send, {call:this.mint_call});
        this.rely = Object.assign(this.rely_send, {call:this.rely_call});
        this.transfer = Object.assign(this.transfer_send, {call:this.transfer_call});
        this.transferFrom = Object.assign(this.transferFrom_send, {call:this.transferFrom_call});
    }
}
export module MockERC20{
    export interface ApprovalEvent {owner:string,spender:string,value:BigNumber,_event:Event}
    export interface AuthEvent {account:string,auth:BigNumber,_event:Event}
    export interface TransferEvent {from:string,to:string,value:BigNumber,_event:Event}
}