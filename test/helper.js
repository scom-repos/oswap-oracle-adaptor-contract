"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.compare = exports.setTime = exports.fromWei = exports.toWeiInv = exports.toWei = void 0;
var hardhat_1 = require("hardhat");
var ethers_1 = require("ethers");
var chai_1 = require("chai");
var provider = hardhat_1.waffle.provider;
function toWei(value, unit) {
    return hardhat_1.ethers.utils.parseUnits(value, unit);
}
exports.toWei = toWei;
function toWeiInv(n, unit) {
    // return BigNumber.from("10").pow("18").div(n.toString());
    return ethers_1.BigNumber.from("10").pow(unit ? unit * 2 : "36").div(hardhat_1.ethers.utils.parseUnits(n, unit));
}
exports.toWeiInv = toWeiInv;
function fromWei(v) {
    return hardhat_1.ethers.utils.formatEther(v);
}
exports.fromWei = fromWei;
function setTime(time) {
    return provider.send(time > 1000000000 ? 'evm_mine' : 'evm_increaseTime', [time]);
}
exports.setTime = setTime;
function compare(o1, o2) {
    for (var k in o2) {
        if (Array.isArray(o1[k])) {
            for (var i = 0; i < o1[k].length; i++)
                compare(o1[k], o2[k]);
            // expect(o1[k]).to.deep.equal(o2[k]);
        }
        else
            (0, chai_1.expect)(o1[k], k).to.equal(o2[k]);
    }
}
exports.compare = compare;
function print(o, indent) {
    if (indent === void 0) { indent = ""; }
    if (!o) {
        console.log(indent, o);
    }
    else if (ethers_1.BigNumber.isBigNumber(o)) {
        console.log(indent, o.gt("2000000000") ? fromWei(o.toString()) : o.toString());
    }
    else if (typeof o === "string") {
        console.log(indent, /\d{9,}/.test(o) ? fromWei(o) : o);
    }
    else if (typeof o === "number") {
        console.log(indent, o > 2000000000 ? fromWei(o) : o);
    }
    else if (typeof o === "boolean") {
        console.log(indent, o);
    }
    else if (typeof o === "object") {
        for (var k in o) {
            if (!o[k]) {
                console.log(indent, k, ":", o[k]);
            }
            else if (ethers_1.BigNumber.isBigNumber(o[k])) {
                console.log(indent, k, ":", o[k].gt("2000000000") ? fromWei(o[k].toString()) : o[k].toString());
            }
            else if (Array.isArray(o[k])) {
                console.log(indent, k, ":", o[k].map(function (e) { return ethers_1.BigNumber.isBigNumber(e) ? (e.gt("2000000000") ? fromWei(e) : e.toString()) : e; }));
            }
            else if (typeof o[k] === "number" || typeof o[k] === "string" || typeof o[k] === "boolean") {
                console.log(indent, k, ":", o[k]);
            }
            else {
                //console.log(k, o[k]);
                console.log(indent, k, ": {");
                print(o[k], indent + "  ");
                console.log(indent, "}");
            }
        }
    }
    else {
        console.log(indent, o);
    }
}
exports.print = print;
