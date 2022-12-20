/*
test OSWAP_OracleConstantLimited with limit
*/

import { ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "@ethersproject/contracts";
const provider = waffle.provider;
import {BigNumber, BigNumberish, Contract, ContractFactory} from "ethers";
import {expect, use} from "chai";
import { toWei, toWeiInv, compare, print} from "./helper";

let accounts: SignerWithAddress[];

let WETH9: ContractFactory;
let ERC20: ContractFactory;
let OSWAP_OracleConstantLimited: ContractFactory;
let MockLimitedFactory: ContractFactory;
let weth: Contract;
let oracle: Contract;
let token: Contract;

describe('OSWAP_OraclePair 4', function () {
    before(async function(){
        accounts = await ethers.getSigners();
        WETH9 = await ethers.getContractFactory('WETH9');
        ERC20 = await ethers.getContractFactory('MockERC20');
        MockLimitedFactory = await ethers.getContractFactory('MockLimitedFactory');
        OSWAP_OracleConstantLimited = await ethers.getContractFactory('OSWAP_OracleConstantLimited');
        weth = await (await WETH9.deploy()).deployed();
        token = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
    });
    describe('symmetric', function () {
        before(async function(){
            oracle = await (await OSWAP_OracleConstantLimited.deploy(
                [weth.address],
                [token.address],
                [toWei("400")],
                [toWeiInv("400")],
                [toWei("2.5")],
                [toWei("1000")]
            )).deployed();
            console.log("oracle address " + oracle.address);

            expect(await oracle.limits(weth.address, token.address, true)).to.equal(toWei("2.5"));
            expect(await oracle.limits(weth.address, token.address, false)).to.equal(toWei("1000"));
            expect(await oracle.limits(token.address, weth.address, true)).to.equal(toWei("1000"));
            expect(await oracle.limits(token.address, weth.address, false)).to.equal(toWei("2.5"));
        })

        it ('should able to swap - swapExactETHForTokens', async function () {
            let result = await oracle.getRatio(weth.address, token.address, toWei("2.5").sub(1), "0", "0x");
            compare(result, {numerator:toWei("400"), denominator:toWei("1")});
        });
        it ('should able to swap - swapExactTokensForETH' , async function () {
            let result = await oracle.getRatio(token.address, weth.address, toWei("1000").sub(1), "0", "0x");
            compare(result, {numerator:toWeiInv("400"), denominator:toWei("1")});
        });
        it ('should able to swap - swapTokensForExactETH', async function () {
            let result = await oracle.getRatio(token.address, weth.address, "0", toWei("2.5").sub(1), "0x");
            compare(result, {numerator:toWeiInv("400"), denominator:toWei("1")});
        });
        it ('should able to swap - swapETHForExactTokens', async function () {
            let result = await oracle.getRatio(weth.address, token.address, "0", toWei("1000").sub(1), "0x");
            compare(result, {numerator:toWei("400"), denominator:toWei("1")});
        });

        it ('should revert if amount is higher than the limit - swapExactETHForTokens', async function () {
            await expect(
                oracle.getRatio(weth.address, token.address, toWei("2.5"), "0", "0x")
            ).to.be.revertedWith('OSWAP: Over Limit');
        });
        it ('should revert if amount is higher than the limit - swapExactTokensForETH', async function () {
            await expect(
                oracle.getRatio(token.address, weth.address, toWei("1000"), "0", "0x")
            ).to.be.revertedWith('OSWAP: Over Limit');
        });
        it ('should revert if amount is higher than the limit - swapTokensForExactETH', async function () {
            await expect(
                oracle.getRatio(token.address, weth.address, "0", toWei("2.5"), "0x")
            ).to.be.revertedWith('OSWAP: Over Limit');
        });
        it ('should revert if amount is higher than the limit - swapETHForExactTokens', async function () {
            await expect(
                oracle.getRatio(weth.address, token.address, "0", toWei("1000"), "0x")
            ).to.be.revertedWith('OSWAP: Over Limit');
        });
    });
    describe('asymmetric', function () {
        before(async function(){
            oracle = await (await OSWAP_OracleConstantLimited.deploy(
                [weth.address],
                [token.address],
                [toWei("400")],
                [toWeiInv("500")],
                [toWei("2.5")],
                [toWei("800")]
            )).deployed();
            console.log("oracle address " + oracle.address);

            expect(await oracle.limits(weth.address, token.address, true)).to.equal(toWei("2.5"));
            expect(await oracle.limits(weth.address, token.address, false)).to.equal(toWei("1000"));
            expect(await oracle.limits(token.address, weth.address, true)).to.equal(toWei("800"));
            expect(await oracle.limits(token.address, weth.address, false)).to.equal(toWei("1.6"));
        });

        it ('should able to swap - swapExactETHForTokens', async function () {
            let result = await oracle.getRatio(weth.address, token.address, toWei("2.5").sub(1), "0", "0x");
            compare(result, {numerator:toWei("400"), denominator:toWei("1")});
        });
        it ('should able to swap - swapExactTokensForETH' , async function () {
            let result = await oracle.getRatio(token.address, weth.address, toWei("800").sub(1), "0", "0x");
            compare(result, {numerator:toWeiInv("500"), denominator:toWei("1")});
        });
        it ('should able to swap - swapTokensForExactETH', async function () {
            let result = await oracle.getRatio(token.address, weth.address, "0", toWei("1.6").sub(1), "0x"); // 500*(1/500)
            compare(result, {numerator:toWeiInv("500"), denominator:toWei("1")});
        });
        it ('should able to swap - swapETHForExactTokens', async function () {
            let result = await oracle.getRatio(weth.address, token.address, "0", toWei("1000").sub(1), "0x"); // 400*2.5
            compare(result, {numerator:toWei("400"), denominator:toWei("1")});
        });

        it ('should revert if amount is higher than the limit - swapExactETHForTokens', async function () {
            await expect(
                oracle.getRatio(weth.address, token.address, toWei("2.5"), "0", "0x")
            ).to.be.revertedWith('OSWAP: Over Limit');
        });
        it ('should revert if amount is higher than the limit - swapExactTokensForETH', async function () {
            await expect(
                oracle.getRatio(token.address, weth.address, toWei("800"), "0", "0x")
            ).to.be.revertedWith('OSWAP: Over Limit');
        });
        it ('should revert if amount is higher than the limit - swapTokensForExactETH', async function () {
            await expect(
                oracle.getRatio(token.address, weth.address, "0", toWei("1.6"), "0x")
            ).to.be.revertedWith('OSWAP: Over Limit');
        });
        it ('should revert if amount is higher than the limit - swapETHForExactTokens', async function () {
            await expect(
                oracle.getRatio(weth.address, token.address, "0", toWei("1000"), "0x")
            ).to.be.revertedWith('OSWAP: Over Limit');
        });
    });
});