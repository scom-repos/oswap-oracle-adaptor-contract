/*
check price against amm
*/

import { ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "@ethersproject/contracts";
const provider = waffle.provider;
import {BigNumber, BigNumberish, Contract, ContractFactory} from "ethers";
import {expect, use} from "chai";
import {toWei, toWeiInv, compare, print} from "./helper";

let accounts: SignerWithAddress[];

let MockFactory: ContractFactory;
let MockPair: ContractFactory;

let weth: Contract;
let token1: Contract;
let token2: Contract;
let chainlink0: Contract;
let chainlink1: Contract;
let chainlink2: Contract;
let oracle: Contract;

let factory: Contract;
let pair: Contract;

let maxValue: BigNumber;
let deviation: BigNumber;

let price0: BigNumber;
let price1: BigNumber;
let price2: BigNumber;

describe('OSWAP_OraclePriceGuard', function() {
    before(async function() {
        accounts = await ethers.getSigners();
        let WETH9 = await ethers.getContractFactory('WETH9');
        let ERC20 = await ethers.getContractFactory('MockERC20');
        weth = await WETH9.deploy();
        await weth.deployed();
        do {
            token1 = await ERC20.deploy("token1", "token1", 0, 0, 8);
            await token1.deployed();
        } while (!BigNumber.from(token1.address.toLowerCase()).lt(weth.address.toLowerCase()));
        do {
            token2 = await ERC20.deploy("token2", "token2", 0, 0, 18);
            await token2.deployed();
        } while (!BigNumber.from(weth.address.toLowerCase()).lt(token2.address.toLowerCase()));

        MockFactory = await ethers.getContractFactory('MockPriceGuardFactory');
        MockPair = await ethers.getContractFactory('MockPriceGuardPair');

        factory = await MockFactory.deploy();
        await factory.deployed();

        let MockV3Aggregator = await ethers.getContractFactory('MockV3Aggregator');
        price0 = toWei("400", 8);
        chainlink0 = await MockV3Aggregator.deploy("Chainlink0", 8, price0);
        await chainlink0.deployed();
        chainlink1 = await MockV3Aggregator.deploy("Chainlink1", 8, 0);
        await chainlink1.deployed();
        chainlink2 = await MockV3Aggregator.deploy("Chainlink2", 8, 0);
        await chainlink2.deployed();

        maxValue = toWei("50000");
        deviation = toWei("0.02");

        let OSWAP_OracleChainlinkPriceGuardFiatTestnet = await ethers.getContractFactory('OSWAP_OracleChainlinkPriceGuardFiatGeneric');
        oracle = await OSWAP_OracleChainlinkPriceGuardFiatTestnet.deploy([weth.address, token1.address, token2.address], [chainlink0.address, chainlink1.address, chainlink2.address], factory.address, maxValue, deviation, false);
        await oracle.deployed();
    });
    async function setReserves(v1: BigNumber, v2: BigNumber) {
        return (await (pair.setReserves(v1, v2))).wait();
    }

    // within limit: before the first direction starts to fail
    // above/below limit 1: first direction starts to fail
    // above/below limit 2: before the other direction starts to fail
    // above/below limit 3: the other direction starts to fail
    describe('weth-token', function() {
        let decimals:number;
        before(async function() {
            pair = await MockPair.deploy(weth.address, token2.address);
            await pair.deployed();
            await (await factory.set(weth.address, token2.address, pair.address)).wait();
            decimals = await token2.decimals();
        });
        it ('check parameters', async function(){
            // print(await oracle.low());
            // print(await oracle.high());
        });

        describe('changing amm price', function() {
            before(async function() {
                price0 = toWei("400", 8);
                await (await chainlink0.updateAnswer(price0)).wait();
                price2 = toWeiInv((500/400).toString(), 8);
                await (await chainlink2.updateAnswer(price2)).wait();
                // numerator: toWei("400",8), denominator: toWei("0.8", 8);
            });

            it('exact', async function() {
                await setReserves(toWei("100"), toWei("50000", decimals));
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "500"
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("500"), usdAmount:0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.002"), usdAmount:0});
            });

            it('ETH drops within limit', async function() {
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(36).idiv(new BigNumber("1.02").shiftedBy(18)).plus(1)).shiftedBy(-18).toFixed();
                // "509.999999999999999999"
                await setReserves(toWeiInv("0.0102").add(1), toWei("50000", decimals)); // >= 100 / 1.02

                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("509.999999999999999999"), usdAmount:0});

                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.00196078431372549"), usdAmount:0});
            });
            it('ETH drops below limit 1', async function() {
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(36).idiv(new BigNumber("1.02").shiftedBy(18))).shiftedBy(-18).toFixed();
                // "510.000000000000000004"
                await setReserves(toWeiInv("0.0102"), toWei("50000", decimals)); // 98.039215686274509803

                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("510.000000000000000004"), usdAmount:0});

                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.00196078431372549"), usdAmount:0});
            });
            it('ETH drops below limit 2', async function() {
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").times("0.98").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "510.204081632653061224"
                await setReserves(toWei("98"), toWei("50000", decimals));

                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("510.204081632653061224"), usdAmount:0});

                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.00196"), usdAmount:0});
            });
            it('ETH drops below limit 3', async function() {
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").times("0.98").shiftedBy(18).minus(1)).shiftedBy(-18).toFixed();
                // "510.204081632653061229"
                await setReserves(toWei("98").sub(1), toWei("50000", decimals));

                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("510.204081632653061229"), usdAmount:0});

                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.001959999999999999"), usdAmount:0});
            });

            it('ETH raises within limit', async function() {
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").times("1.02").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "490.196078431372549019"
                await setReserves(toWei("102"), toWei("50000", decimals)); // <= 100 / 0.98

                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("490.196078431372549019"), usdAmount:0});

                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.002040000000000000"), usdAmount:0});
            });
            it('ETH raises above limit 1', async function() {
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").times("1.02").shiftedBy(18).plus(1)).shiftedBy(-18).toFixed();
                // "490.196078431372549014"
                await setReserves(toWei("102").add(1), toWei("50000", decimals));

                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("490.196078431372549014"), usdAmount:0});

                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.00204"), usdAmount:0});
            });
            it('ETH raises above limit 2', async function() {
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(36).idiv(new BigNumber("0.98").shiftedBy(18))).shiftedBy(-18).toFixed();
                // "490.000000000000000004"
                await setReserves(toWeiInv("0.0098"), toWei("50000", decimals)); // <= 100 / 0.98 // 102.040816326530612244

                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("490.000000000000000004"), usdAmount:0});

                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.002040816326530612"), usdAmount:0});
            });
            it('ETH raises above limit 3', async function() {
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(36).idiv(new BigNumber("0.98").shiftedBy(18)).plus(1)).shiftedBy(-18).toFixed();
                // "489.999999999999999999"
                await setReserves(toWeiInv("0.0098").add(1), toWei("50000", decimals));

                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("489.999999999999999999"), usdAmount:0});

                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.002040816326530612"), usdAmount:0});
            });

            it('token2 drops within limit', async function() {
                // new BigNumber("50000").shiftedBy(36).idiv(new BigNumber("1.02").shiftedBy(18)).plus(1).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "490.196078431372549019"
                await setReserves(toWei("100"), toWeiInv("0.0000204", decimals).add(1));

                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("490.196078431372549019"), usdAmount:0});
                
                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.002039999999999999"), usdAmount:0});
            });
            it('token2 drops below limit 1', async function() {
                // new BigNumber("50000").shiftedBy(36).idiv(new BigNumber("1.02").shiftedBy(18)).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "490.196078431372549019"
                await setReserves(toWei("100"), toWeiInv("0.0000204", decimals));

                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("490.196078431372549019"), usdAmount:0});

                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.00204"), usdAmount:0});
            });
            it('token2 drops below limit 2', async function() {
                // new BigNumber("50000").times("0.98").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "490"
                await setReserves(toWei("100"), toWei("49000", decimals)); // >= 50000 * 0.98

                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("490"), usdAmount:0});

                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.002040816326530612"), usdAmount:0});
            });
            it('token2 drops below limit 3', async function() {
                // new BigNumber("50000").times("0.98").shiftedBy(18).minus(1).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "489.999999999999999999"
                await setReserves(toWei("100"), toWei("49000", decimals).sub(1));

                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("489.999999999999999999"), usdAmount:0});

                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.002040816326530612"), usdAmount:0});
            });

            it('token2 raises within limit', async function() {
                // new BigNumber("50000").times("1.02").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "510"
                await setReserves(toWei("100"), toWei("51000", decimals)); // <= 50000 * 1.02

                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                compare(result, {numerator:price0, denominator:price2});
                result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("510"), usdAmount:0});

                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWeiInv("510"), usdAmount:0});
            });
            it('token2 raises above limit 1', async function() {
                // new BigNumber("50000").times("1.02").shiftedBy(18).plus(1).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "510"
                await setReserves(toWei("100"), toWei("51000", decimals).add(1));

                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("510"), usdAmount:0});

                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.001960784313725490"), usdAmount:0});
            });
            it('token2 raises above limit 2', async function() {
                // new BigNumber("50000").shiftedBy(36).idiv(new BigNumber("0.98").shiftedBy(18)).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "510.204081632653061224"
                await setReserves(toWei("100"), toWeiInv("0.0000196", decimals));

                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("510.204081632653061224"), usdAmount:0});

                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                compare(result, {numerator:price2, denominator:price0});
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.00196"), usdAmount:0});
            });
            it('token2 raises above limit 3', async function() {
                // new BigNumber("50000").shiftedBy(36).idiv(new BigNumber("0.98").shiftedBy(18)).plus(1).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "510.204081632653061224"
                await setReserves(toWei("100"), toWeiInv("0.0000196", decimals).add(1));

                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("500"), ammPrice:toWei("510.204081632653061224"), usdAmount:0});

                await expect(
                    oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                compare(result, {chainlinkPrice:toWei("0.002"), ammPrice:toWei("0.001959999999999999"), usdAmount:0});
            });
        });

        describe('changing oracle price', function() {
            before(async function() {
                await setReserves(toWei("100"), toWei("50000", decimals));
                // new BigNumber("50000").shiftedBy(18).shiftedBy(18).idiv(new BigNumber("100").shiftedBy(18)).shiftedBy(-18).toFixed();
                // "500"
            });
            describe('changing oracle price 0', function() {
                before(async function() {
                    price2 = toWeiInv((500/400).toString(), 8);
                    await (await chainlink2.updateAnswer(price2)).wait();
                    // numerator: toWei("400",8), denominator: toWei("0.8", 8);
                });
                it('ETH drops within limit', async function() {
                    // new BigNumber("0.8").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(16).idiv(new BigNumber("1.02").shiftedBy(8)).plus(1)).shiftedBy(-18).toFixed();
                    // "0.0020399999999745"
                    price0 = toWeiInv("0.00255", 8).add(1); // 400 / 1.02
                    await (await chainlink0.updateAnswer(price0)).wait();

                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    compare(result, {numerator:price0, denominator:price2});
                    result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("490.1960784375"), ammPrice:toWei("500"), usdAmount:0});

                    result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                    compare(result, {numerator:price2, denominator:price0});
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.0020399999999745"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('ETH drops below limit 1', async function() {
                    // new BigNumber("0.8").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(16).idiv(new BigNumber("1.02").shiftedBy(8))).shiftedBy(-18).toFixed();
                    // "0.00204000000002652"
                    price0 = toWeiInv("0.00255", 8); // 400 / 1.02
                    await (await chainlink0.updateAnswer(price0)).wait();

                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("490.196078425"), ammPrice:toWei("500"), usdAmount:0});

                    result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                    compare(result, {numerator:price2, denominator:price0});
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.00204000000002652"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('ETH drops below limit 2', async function() {
                    // new BigNumber("0.8").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").times("0.98").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.002040816326530612"
                    price0 = toWei("392", 8); // 400 * 0.98
                    await (await chainlink0.updateAnswer(price0)).wait();
    
                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("490"), ammPrice:toWei("500"), usdAmount:0});

                    result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                    compare(result, {numerator:price2, denominator:price0});
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.002040816326530612"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('ETH drops below limit 3', async function() {
                    // new BigNumber("0.8").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").times("0.98").shiftedBy(8).minus(1)).shiftedBy(-18).toFixed();
                    // "0.002040816326582673"
                    // new BigNumber("400").times("0.98").shiftedBy(8).minus(1).shiftedBy(18).idiv(new BigNumber("0.8").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "489.9999999875"
                    price0 = toWei("392", 8).sub(1); // 400 * 0.98
                    await (await chainlink0.updateAnswer(price0)).wait();
    
                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("489.9999999875"), ammPrice:toWei("500"), usdAmount:0});

                    await expect(
                        oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.002040816326582673"), ammPrice:toWei("0.002"), usdAmount:0});
                });

                it('ETH raise within limit', async function() {
                    // new BigNumber("0.8").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8).times("1.02")).shiftedBy(-18).toFixed();
                    // "0.00196078431372549"
                    // new BigNumber("400").shiftedBy(8).times("1.02").shiftedBy(18).idiv(new BigNumber("0.8").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "510"
                    price0 = toWei("408", 8); // 400 * 1.02
                    await (await chainlink0.updateAnswer(price0)).wait();

                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    compare(result, {numerator:price0, denominator:price2});
                    result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("510"), ammPrice:toWei("500"), usdAmount:0});

                    result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                    compare(result, {numerator:price2, denominator:price0});
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.00196078431372549"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('ETH raise below limit 1', async function() {
                    // new BigNumber("0.8").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8).times("1.02").plus(1)).shiftedBy(-18).toFixed();
                    // "0.001960784313677431"
                    // new BigNumber("400").shiftedBy(8).times("1.02").plus(1).shiftedBy(18).idiv(new BigNumber("0.8").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "510.0000000125"
                    price0 = toWei("408", 8).add(1);
                    await (await chainlink0.updateAnswer(price0)).wait();

                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    compare(result, {numerator:price0, denominator:price2});
                    result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("510.0000000125"), ammPrice:toWei("500"), usdAmount:0});

                    await expect(
                        oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.001960784313677431"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('ETH raise below limit 2', async function() {
                    // new BigNumber("0.8").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(16).idiv(new BigNumber("0.98").shiftedBy(8))).shiftedBy(-18).toFixed();
                    // "0.0019600000000294"
                    price0 = toWeiInv("0.00245", 8); // 400 / 0.98
                    await (await chainlink0.updateAnswer(price0)).wait();

                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    compare(result, {numerator:price0, denominator:price2});
                    result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("510.204081625"), ammPrice:toWei("500"), usdAmount:0});

                    await expect(
                        oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.0019600000000294"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('ETH raise below limit 3', async function() {
                    // new BigNumber("0.8").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(16).idiv(new BigNumber("0.98").shiftedBy(8)).plus(1)).shiftedBy(-18).toFixed();
                    // "0.00195999999998138"
                    price0 = toWeiInv("0.00245", 8).add(1); // 400 / 0.98
                    await (await chainlink0.updateAnswer(price0)).wait();

                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("510.204081637500000000"), ammPrice:toWei("500"), usdAmount:0});

                    await expect(
                        oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.00195999999998138"), ammPrice:toWei("0.002"), usdAmount:0});
                });
            });

            describe('changing oracle price 2', function() {
                before(async function() {
                    price0 = toWei("400", 8);
                    await (await chainlink0.updateAnswer(price0)).wait();
                });
                it('token2 drops within limit', async function() {
                    // new BigNumber("0.8").shiftedBy(16).idiv(new BigNumber("1.02").shiftedBy(8)).plus(1).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.001960784325"
                    price2 = toWeiInv("1.275", 8).add(1); // 
                    await (await chainlink2.updateAnswer(price2)).wait();

                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    compare(result, {numerator:price0, denominator:price2});
                    result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("509.999997067500016861"), ammPrice:toWei("500"), usdAmount:0});

                    result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                    compare(result, {numerator:price2, denominator:price0});
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.001960784325"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('token2 drops below limit 1', async function() {
                    // new BigNumber("0.8").shiftedBy(16).idiv(new BigNumber("1.02").shiftedBy(8)).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.0019607843"
                    price2 = toWeiInv("1.275", 8); // 
                    await (await chainlink2.updateAnswer(price2)).wait();

                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    compare(result, {numerator:price0, denominator:price2});
                    result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("510.000003570000024990"), ammPrice:toWei("500"), usdAmount:0});

                    await expect(
                        oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.0019607843"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('token2 drops below limit 2', async function() {
                    // new BigNumber("0.8").times("0.98").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.00196"
                    price2 = toWei("0.784", 8); // >= 0.98/(500/400)
                    await (await chainlink2.updateAnswer(price2)).wait();

                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    compare(result, {numerator:price0, denominator:price2});
                    result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("510.204081632653061224"), ammPrice:toWei("500"), usdAmount:0});

                    await expect(
                        oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.00196"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('token2 drops below limit 3', async function() {
                    // new BigNumber("0.8").times("0.98").shiftedBy(8).plus(1).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.001960000025"
                    price2 = toWei("0.784", 8).sub(1); // >= 0.98/(500/400)
                    await (await chainlink2.updateAnswer(price2)).wait();

                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("510.204088140358267096"), ammPrice:toWei("500"), usdAmount:0});

                    await expect(
                        oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.001959999975"), ammPrice:toWei("0.002"), usdAmount:0});
                });

                it('token2 raises within limit', async function() {
                    // new BigNumber("0.8").times("1.02").shiftedBy(8).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.00204"
                    price2 = toWei("0.816", 8); // <= 1.02/(500/400)
                    await (await chainlink2.updateAnswer(price2)).wait();

                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    // numerator: toWei("400",8), denominator: toWei("0.816", 8);
                    compare(result, {numerator:price0, denominator:price2});
                    result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("490.196078431372549019"), ammPrice:toWei("500"), usdAmount:0});

                    result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                    compare(result, {numerator:price2, denominator:price0});
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.00204"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('token2 raises above limit 1', async function() {
                    // new BigNumber("0.8").times("1.02").shiftedBy(8).plus(1).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.002040000025"
                    price2 = toWei("0.816", 8).add(1); // 0.8 * 1.02
                    await (await chainlink2.updateAnswer(price2)).wait();

                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("490.196072424067739901"), ammPrice:toWei("500"), usdAmount:0});

                    result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                    compare(result, {numerator:price2, denominator:price0});
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.002040000025"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('token2 raises above limit 2', async function() {
                    // new BigNumber("0.8").shiftedBy(16).idiv(new BigNumber("0.98").shiftedBy(8)).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.002040816325"
                    price2 = toWeiInv("1.225", 8); // 0.8 / 0.98
                    await (await chainlink2.updateAnswer(price2)).wait();

                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("490.000000367500000275"), ammPrice:toWei("500"), usdAmount:0});

                    result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                    compare(result, {numerator:price2, denominator:price0});
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.002040816325"), ammPrice:toWei("0.002"), usdAmount:0});
                });
                it('token2 raises above limit 3', async function() {
                    // new BigNumber("0.8").shiftedBy(16).idiv(new BigNumber("0.98").shiftedBy(8)).plus(1).shiftedBy(18).idiv(new BigNumber("400").shiftedBy(8)).shiftedBy(-18).toFixed();
                    // "0.00204081635"
                    price2 = toWeiInv("1.225", 8).add(1); // 0.8 / 0.98
                    await (await chainlink2.updateAnswer(price2)).wait();

                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    let result = await oracle.getPriceInfo(weth.address, token2.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("489.999994365000064802"), ammPrice:toWei("500"), usdAmount:0});

                    await expect(
                        oracle.getRatio(token2.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                    result = await oracle.getPriceInfo(token2.address, weth.address, 0, 0);
                    compare(result, {chainlinkPrice:toWei("0.00204081635"), ammPrice:toWei("0.002"), usdAmount:0});
                });
            });
        });
    });

    describe('token-weth', function() {
        let decimals:number;
        before(async function() {
            pair = await MockPair.deploy(token1.address, weth.address);
            await pair.deployed();
            await (await factory.set(token1.address, weth.address, pair.address)).wait();
            decimals = await token1.decimals();
        });
        describe('changing amm price', function() {
            before(async function() {
                price0 = toWei("400", 8);
                await (await chainlink0.updateAnswer(price0)).wait();
                price1 = toWeiInv((400/400).toString(), 8);
                await (await chainlink1.updateAnswer(price1)).wait();
            });
            it('exact', async function() {
                await setReserves(toWei("40000", decimals), toWei("100"));
                let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                // console.log(result);
            });
            it('ETH drops within limit', async function() {
                await setReserves(toWei("40000", decimals), toWeiInv("0.0102").add(1)); // >= 100 / 1.02
                let result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
                console.log(result);
            });
            it('ETH drops below limit', async function() {
                await setReserves(toWei("40000", decimals), toWeiInv("0.0102"));
                await expect(
                    oracle.getRatio(weth.address, token1.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('ETH raises within limit', async function() {
                await setReserves(toWei("40000", decimals), toWeiInv("0.0098")); // <= 100 / 0.98
                let result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
                console.log(result);
            });
            it('ETH raises above limit', async function() {
                await setReserves(toWei("40000", decimals), toWeiInv("0.0098").add(1));
                await expect(
                    oracle.getRatio(weth.address, token1.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token1 drops within limit', async function() {
                await setReserves(toWeiInv("0.0000255", decimals).add(1), toWei("100")); // >= 40000 / 1.02
                let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                console.log(result);
            });
            it('token1 drops below limit', async function() {
                await setReserves(toWeiInv("0.0000255", decimals), toWei("100"));
                await expect(
                    oracle.getRatio(token1.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token1 raises within limit', async function() {
                await setReserves(toWei("40000", decimals), toWei("102")); // <= 40000 * 1.02
                let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                console.log(result);
            });
            it('token1 raises above limit', async function() {
                await setReserves(toWei("40000", decimals), toWei("102").add(1));
                await expect(
                    oracle.getRatio(token1.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
        });
        describe('changing oracle price', function() {
            before(async function() {
                await setReserves(toWei("40000", decimals), toWei("100")); // await setReserves(toWei("100"), toWei("50000"));
            });
            describe('changing oracle price 1', function() {
                before(async function() {
                    price0 = toWei("400", 8);
                    await (await chainlink0.updateAnswer(price0)).wait();
                });
                it('token1 drops within limit', async function() {
                    price1 = toWeiInv((408/400).toString(), 8).add(1); // <= 400*1.02
                    await (await chainlink1.updateAnswer(price1)).wait();
                
                    let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 drops below limit', async function() {
                    price1 = toWeiInv((408/400).toString(), 8);
                    await (await chainlink1.updateAnswer(price1)).wait();
                    
                    await expect(
                        oracle.getRatio(token1.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token1 raises within limit', async function() {
                    price1 = toWeiInv((392/400).toString(), 8); // >= 400*0.98
                    await (await chainlink1.updateAnswer(price1)).wait();
                    
                    let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 raises above limit', async function() {
                    price1 = toWeiInv((392/400).toString(), 8).add(1);
                    await (await chainlink1.updateAnswer(price1)).wait();
                    
                    await expect(
                        oracle.getRatio(token1.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
            });
        });
    });

    describe('token-token', function() {
        let decimals1:number;
        let decimals2:number;
        before(async function() {
            pair = await MockPair.deploy(token1.address, token2.address);
            await pair.deployed();
            await (await factory.set(token1.address, token2.address, pair.address)).wait();
            decimals1 = await token1.decimals();
            decimals2 = await token2.decimals();
        });
        describe('changing amm price', function() {
            before(async function() {
                price1 = toWeiInv((400/400).toString(), 8);
                await (await chainlink1.updateAnswer(price1)).wait();
                price2 = toWeiInv((500/400).toString(), 8);
                await (await chainlink2.updateAnswer(price2)).wait();
            });
            it('exact', async function() {
                await setReserves(toWei("40000", decimals1), toWei("50000", decimals2));
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                // console.log(result);
            });
            it('token1 drops within limit', async function() {
                await setReserves(toWeiInv("0.0000255", decimals1).add(1), toWei("50000", decimals2)); // >= 40000 / 1.02
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token1 drops below limit', async function() {
                await setReserves(toWeiInv("0.0000255", decimals1), toWei("50000", decimals2));
                await expect(
                    oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token1 raises within limit', async function() {
                await setReserves(toWeiInv("0.0000245", decimals1), toWei("50000", decimals2)); // <= 40000 / 0.98
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token1 raises above limit', async function() {
                await setReserves(toWeiInv("0.0000245", decimals1).add(1), toWei("50000", decimals2));
                await expect(
                    oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token2 raises within limit', async function() {
                await setReserves(toWei("40000", decimals1), toWei("51000", decimals2)); // <= 50000 * 1.02
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token2 raises above limit', async function() {
                await setReserves(toWei("40000", decimals1), toWei("51000", decimals2).add(1));
                await expect(
                    oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token2 drops within limit', async function() {
                await setReserves(toWei("40000", decimals1), toWei("49000", decimals2)); // >= 50000 * 0.98
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token2 drops below limit', async function() {
                await setReserves(toWei("40000", decimals1), toWei("49000", decimals2).sub(1));
                await expect(
                    oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
        });

        describe('changing oracle price', function() {
            before(async function() {
                await setReserves(toWei("40000", decimals1), toWei("50000", decimals2));
            });
            describe('changing oracle price 1', function() {
                before(async function() {
                    price2 = toWeiInv((500/400).toString(), 8);
                    await (await chainlink2.updateAnswer(price2)).wait();
                });
                it('token1 drops within limit', async function() {
                    price1 = toWeiInv((408/400).toString(), 8).add(1); // <= 400*1.02
                    await (await chainlink1.updateAnswer(price1)).wait();
                
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 drops below limit', async function() {
                    price1 = toWeiInv((408/400).toString(), 8);
                    await (await chainlink1.updateAnswer(price1)).wait();
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token1 raises within limit', async function() {
                    price1 = toWeiInv((392/400).toString(), 8); // >= 400*0.98
                    await (await chainlink1.updateAnswer(price1)).wait();
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 raises above limit', async function() {
                    price1 = toWeiInv((392/400).toString(), 8).add(1);
                    await (await chainlink1.updateAnswer(price1)).wait();
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
            });
            describe('changing oracle price 2', function() {
                before(async function() {
                    price1 = toWeiInv((400/400).toString(), 8);
                    await (await chainlink1.updateAnswer(price1)).wait();
                });
                it('token2 drops within limit', async function() {
                    price2 = toWei("0.816", 8); // <= 1.02/(500/400)
                    await (await chainlink2.updateAnswer(price2)).wait();
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token2 drops below limit', async function() {
                    price2 = toWei("0.816", 8).add(1);
                    await (await chainlink2.updateAnswer(price2)).wait();
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token2 raises within limit', async function() {
                    price2 = toWei("0.784", 8); // >= 0.98/(500/400)
                    await (await chainlink2.updateAnswer(price2)).wait();
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token2 raises above limit', async function() {
                    price2 = toWei("0.784", 8).sub(1);
                    await (await chainlink2.updateAnswer(price2)).wait();
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
            });
        });
    });
});
