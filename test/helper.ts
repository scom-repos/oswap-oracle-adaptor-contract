import { ethers, waffle } from "hardhat";
import {BigNumber, BigNumberish, Contract, ContractFactory} from "ethers";
import {expect, use} from "chai";

const provider = waffle.provider;

export function toWei(value: string, unit?: any): BigNumber {
    return ethers.utils.parseUnits(value, unit);
}
export function toWeiInv(n: string, unit?: any) {
    // return BigNumber.from("10").pow("18").div(n.toString());
    return BigNumber.from("10").pow(unit ? unit*2 : "36").div(ethers.utils.parseUnits(n, unit));
}
export function fromWei(v: BigNumberish): string {
    return ethers.utils.formatEther(v);
}
export function setTime(time: number){
    return provider.send(time > 1000000000 ? 'evm_mine' : 'evm_increaseTime',[time]);
}
export function compare(o1: any, o2: any) {
    for (let k in o2) {
        if (Array.isArray(o1[k])) {
            for (let i = 0 ; i < o1[k].length ; i++)
                compare(o1[k], o2[k]);
            // expect(o1[k]).to.deep.equal(o2[k]);
        } else
            expect(o1[k], k).to.equal(o2[k]);
    }
}
export function print(o: any, indent: string = "") {
    if (!o) {
        console.log(indent, o);
    } else if (BigNumber.isBigNumber(o)) {
        console.log(indent, o.gt("2000000000")?fromWei(o.toString()):o.toString());
    } else if (typeof o === "string") {
        console.log(indent, /\d{9,}/.test(o)?fromWei(o):o);
    } else if (typeof o === "number") {
        console.log(indent, o>2000000000?fromWei(o):o);
    } else if (typeof o === "boolean") {
        console.log(indent, o);
    } else if (typeof o === "object") {
         for (let k in o) {
            if (!o[k]){
                console.log(indent, k, ":", o[k]);
            } else if (BigNumber.isBigNumber(o[k])) {
                console.log(indent, k, ":", o[k].gt("2000000000")?fromWei(o[k].toString()):o[k].toString());
            } else if (Array.isArray(o[k])) {
                console.log(indent, k, ":", o[k].map((e:any) => BigNumber.isBigNumber(e) ? (e.gt("2000000000")?fromWei(e):e.toString()) : e));
            } else if (typeof o[k] === "number" || typeof o[k] === "string" || typeof o[k] === "boolean") {
                console.log(indent, k, ":", o[k]); 
            } else {
                //console.log(k, o[k]);
                console.log(indent, k, ": {");
                print(o[k], indent+"  ");
                console.log(indent, "}");
            }
        }
    } else {
        console.log(indent, o);
    }
}