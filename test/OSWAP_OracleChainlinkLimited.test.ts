/*
test OSWAP_OracleChainlinkLimited with limit
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
let OSWAP_OracleChainlinkLimitedTestnet: ContractFactory;
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
        OSWAP_OracleChainlinkLimitedTestnet = await ethers.getContractFactory('OSWAP_OracleChainlinkLimitedGeneric');
        weth = await (await WETH9.deploy()).deployed();
        token = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
    });
    describe('symmetric', function () {
        before(async function(){
            let Factory = await ethers.getContractFactory('MockLimitedFactory');
            let factory = await (await Factory.deploy()).deployed();
            await (await factory.setMinLotSize(weth.address, toWei("2"))).wait();
            await (await factory.setMinLotSize(token.address, toWei("1000"))).wait();

            let MockV3Aggregator = await ethers.getContractFactory('MockV3Aggregator');
            let price = toWeiInv((400).toString());
            let chainlink = await (await MockV3Aggregator.deploy("Chainlink", 18, price)).deployed();

            oracle = await (await OSWAP_OracleChainlinkLimitedTestnet.deploy(factory.address, weth.address, [token.address], [chainlink.address])).deployed();
            console.log("oracle address " + oracle.address);
        })

        it ('should able to swap - swapExactETHForTokens', async function () {
            let result = await oracle.getRatio(weth.address, token.address, toWei("2").sub(1), "0", "0x");
            compare(result, {numerator:toWei("1"), denominator:toWeiInv("400")});
        });
        it ('should able to swap - swapExactTokensForETH' , async function () {
            let result = await oracle.getRatio(token.address, weth.address, toWei("1000").sub(1), "0", "0x");
            compare(result, {numerator:toWeiInv("400"), denominator:toWei("1")});
        });
        it ('should able to swap - swapTokensForExactETH', async function () {
            let result = await oracle.getRatio(token.address, weth.address, "0", toWei("2").sub(1), "0x");
            compare(result, {numerator:toWeiInv("400"), denominator:toWei("1")});
        });
        it ('should able to swap - swapETHForExactTokens', async function () {
            let result = await oracle.getRatio(weth.address, token.address, "0", toWei("1000").sub(1), "0x");
            compare(result, {numerator:toWei("1"), denominator:toWeiInv("400")});
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
});