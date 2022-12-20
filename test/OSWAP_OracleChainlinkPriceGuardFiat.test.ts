/*
check exact in / exact out equivalent USD value limit
*/
import { ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "@ethersproject/contracts";
const provider = waffle.provider;
import {BigNumber, BigNumberish, Contract, ContractFactory} from "ethers";
import {expect, use} from "chai";
import {toWei, toWeiInv, compare, print} from "./helper";

let accounts: SignerWithAddress[];

let weth: Contract;
let token1: Contract;
let token2: Contract;
let chainlink0: Contract;
let chainlink1: Contract;
let chainlink2: Contract;
let oracle: Contract;

let factory: Contract;
let pairWethToken1: Contract;
let pairWethToken2: Contract;
let pairToken1Token2: Contract;

let maxValue: BigNumber;
let deviation: BigNumber;

let price0: BigNumber;
let price1: BigNumber;
let price2: BigNumber;

describe('test', function() {
    before(async function() {
        accounts = await ethers.getSigners();
        let WETH9 = await ethers.getContractFactory('WETH9');
        let ERC20 = await ethers.getContractFactory('MockERC20');
        weth = await WETH9.deploy();
        await weth.deployed();
        token1 = await ERC20.deploy("token1", "token1", 0, 0, 18);
        await token1.deployed();
        token2 = await ERC20.deploy("token2", "token2", 0, 0, 18);
        await token2.deployed();


        let MockFactory = await ethers.getContractFactory('MockPriceGuardFactory');
        let MockPair = await ethers.getContractFactory('MockPriceGuardPair');

        factory = await MockFactory.deploy();
        await factory.deployed();

        pairWethToken1 = await (BigNumber.from(weth.address).lt(token1.address) ? MockPair.deploy(weth.address, token1.address) : MockPair.deploy(token1.address, weth.address));
        await pairWethToken1.deployed();
        await factory.set(weth.address, token1.address, pairWethToken1.address);

        pairWethToken2 = await (BigNumber.from(weth.address).lt(token2.address) ? MockPair.deploy(weth.address, token2.address) : MockPair.deploy(token2.address, weth.address));
        await pairWethToken2.deployed();
        await factory.set(weth.address, token2.address, pairWethToken2.address);

        pairToken1Token2 = await (BigNumber.from(token1.address).lt(token2.address) ? MockPair.deploy(token1.address, token2.address) : MockPair.deploy(token2.address, token1.address));
        await pairToken1Token2.deployed();
        await factory.set(token1.address, token2.address, pairToken1Token2.address);

        let MockV3Aggregator = await ethers.getContractFactory('MockV3Aggregator');
        price0 = toWei((400).toString(), 8);
        chainlink0 = await MockV3Aggregator.deploy("Chainlink0", 8, price0);
        await chainlink0.deployed();
        price1 = toWeiInv((300/400).toString(), 8);
        chainlink1 = await MockV3Aggregator.deploy("Chainlink1", 8, price1);
        await chainlink1.deployed();
        price2 = toWeiInv((500/400).toString(), 8);
        chainlink2 = await MockV3Aggregator.deploy("Chainlink2", 8, price2);
        await chainlink2.deployed();

        maxValue = toWei("50000");
        deviation = toWei("0.1");

        let OSWAP_OracleChainlinkPriceGuardFiatTestnet = await ethers.getContractFactory('OSWAP_OracleChainlinkPriceGuardFiatGeneric');
        oracle = await OSWAP_OracleChainlinkPriceGuardFiatTestnet.deploy([weth.address, token1.address, token2.address], [chainlink0.address, chainlink1.address, chainlink2.address], factory.address, maxValue, deviation, false);
        await oracle.deployed();
    });

    describe('', function() {
        it ('', async function(){
            let result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
            // print(result);
            print(result.numerator.mul("1000000000000000000").div(result.denominator));
            // 300.00000000000003
        });
        it ('', async function(){
            let result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
            // print(result);
            print(result.numerator.mul("1000000000000000000").div(result.denominator));
            // 0.002
        });
        it ('', async function(){
            let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
            // print(result);
            print(result.numerator.mul("1000000000000000000").div(result.denominator));
            // 0.003333333333333333
        });
        it ('', async function(){
            let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
            // print(result);
            print(result.numerator.mul("1000000000000000000").div(result.denominator));
            // 1.6666666666666665
        });
        it ('', async function(){
            let result = await oracle.getRatio(token2.address, token1.address, 0, 0, "0x");
            // print(result);
            print(result.numerator.mul("1000000000000000000").div(result.denominator));
            // 0.60000000000000006
        });
        describe('weth-token', async function() {
            it ('Exact ETH in: Within limit', async function(){
                let result = await oracle.getRatio(weth.address, token2.address, toWei("125"), 0, "0x");
                // 500
            });
            it ('Exact ETH in: Exceessive amount', async function(){
                await expect(
                    oracle.getRatio(weth.address, token2.address, toWei("125.1"), 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Exceessive amount");
                print(await oracle.getPriceInfo(weth.address, token2.address, toWei("125.1"), 0));
            });
            it ('Exact token out: Within limit', async function(){
                let result = await oracle.getRatio(weth.address, token2.address, 0, toWei("62500"), "0x");
                // 500
                print(await oracle.getPriceInfo(weth.address, token2.address, 0, toWei("62500")));
            });
            it ('Exact token out: Exceessive amount', async function(){
                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, toWei("62501"), "0x")
                ).to.be.revertedWith("OracleAdaptor: Exceessive amount");
                print(await oracle.getPriceInfo(weth.address, token2.address, 0, toWei("62501")));
            });
        });
        describe('token-weth', async function() {
            it ('Exact token in: Within limit', async function(){
                let result = await oracle.getRatio(token2.address, weth.address, toWei("62500"), 0, "0x");
                // 0.002
            });
            it ('Exact token in: Exceessive amount', async function(){
                await expect(
                    oracle.getRatio(token2.address, weth.address, toWei("62501"), 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Exceessive amount");
            });

            it ('Exact ETH out: Within limit', async function(){
                let result = await oracle.getRatio(token2.address, weth.address, 0, toWei("125"), "0x");
                // 0.002
            });
            it ('Exact ETH out: Exceessive amount', async function(){
                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, toWei("125.1"), "0x")
                ).to.be.revertedWith("OracleAdaptor: Exceessive amount");
            });

        });
        describe('token-token', async function() {
            it ('Exact token in: Within limit', async function(){
                let result = await oracle.getRatio(token2.address, token1.address, toWei("62500"), 0, "0x");
                // 0.60000000000000006
            });
            it ('Exact token in: Exceessive amount', async function(){
                await expect(
                    oracle.getRatio(token2.address, token1.address, toWei("62501"), 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Exceessive amount");
            });
            it ('Exact token out: Within limit', async function(){
                let result = await oracle.getRatio(token1.address, token2.address, 0, toWei("62500"), "0x");
                // 1.6666666666666665
            });
            it ('Exact token out: Exceessive amount', async function(){
                await expect(
                    oracle.getRatio(token1.address, token2.address, 0, toWei("62501"), "0x")
                ).to.be.revertedWith("OracleAdaptor: Exceessive amount");
            });
        });
    });
});

