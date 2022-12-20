/*
check price against amm, use chainlink price
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
        // token1 < weth < token2
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
        let price0 = toWei("400", 8);
        chainlink0 = await MockV3Aggregator.deploy("Chainlink0", 8, price0);
        await chainlink0.deployed();
        chainlink1 = await MockV3Aggregator.deploy("Chainlink1", 18, 0);
        await chainlink1.deployed();
        chainlink2 = await MockV3Aggregator.deploy("Chainlink2", 18, 0);
        await chainlink2.deployed();

        maxValue = toWei("50000");
        deviation = toWei("0.02");

        let OSWAP_OracleChainlinkPriceGuardTestnet = await ethers.getContractFactory('OSWAP_OracleChainlinkPriceGuardGeneric');
        oracle = await OSWAP_OracleChainlinkPriceGuardTestnet.deploy(weth.address, chainlink0.address, [token1.address, token2.address], [chainlink1.address, chainlink2.address], factory.address, maxValue, deviation, false);
        await oracle.deployed();
    });
    async function setReserves(v1: BigNumber, v2: BigNumber) {
        return (await (pair.setReserves(v1, v2))).wait();
    }
    async function setPrice(oracle: Contract, price: BigNumber): Promise<any> {
        return (await oracle.updateAnswer(price)).wait();
    }

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
            beforeEach(async function() {
                price2 = toWeiInv((500).toString());
                await setPrice(chainlink2, price2);
            });
            it('exact', async function() {
                await setReserves(toWei("100"), toWei("50000", decimals));
                print(await oracle.getPriceInfo(weth.address, token2.address, 0, 0));
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                // console.log(result);
            });
            it('ETH drops within limit', async function() {
                await setReserves(toWeiInv("0.0102").add(1), toWei("50000", decimals)); // >= 100 / 1.02
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('ETH drops below limit', async function() {
                await setReserves(toWeiInv("0.0102"), toWei("50000", decimals));
                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('ETH raises within limit', async function() {
                await setReserves(toWeiInv("0.0098"), toWei("50000", decimals)); // <= 100 / 0.98
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('ETH raises above limit', async function() {
                await setReserves(toWeiInv("0.0098").add(1), toWei("50000", decimals));
                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token drops within limit', async function() {
                await setReserves(toWei("100"), toWei("49000", decimals)); // >= 50000 * 0.98
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token2 drops below limit', async function() {
                await setReserves(toWei("100"), toWei("49000", decimals).sub(1));
                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token2 raises within limit', async function() {
                await setReserves(toWei("100"), toWei("51000", decimals)); // <= 50000 * 1.02
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token2 raises above limit', async function() {
                await setReserves(toWei("100"), toWei("51000", decimals).add(1));
                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
        });
        describe('changing oracle price', function() {
            beforeEach(async function() {
                await setReserves(toWei("100"), toWei("50000", decimals));
            });
            describe('changing oracle price 1', function() {
                it('token2 drops within limit', async function() {
                    price2 = toWei("0.00196"); // >= 0.98/500
                    await setPrice(chainlink2, price2);
                    
                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token2 drops below limit', async function() {
                    price2 = toWei("0.00196").sub(1);
                    await setPrice(chainlink2, price2);
                    
                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token2 raises within limit', async function() {
                    price2 = toWei("0.00204"); // <= 1.02/500
                    await setPrice(chainlink2, price2);
                    
                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token2 raises above limit', async function() {
                    price2 = toWei("0.00204").add(1);
                    await setPrice(chainlink2, price2);
                    
                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
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
            beforeEach(async function() {
                price1 = toWeiInv((400).toString());
                await setPrice(chainlink1, price1);
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
            beforeEach(async function() {
                await setReserves(toWei("40000", decimals), toWei("100")); // await setReserves(toWei("100"), toWei("50000"));
            });
            describe('changing oracle price 1', function() {
                it('token1 drops within limit', async function() {
                    price1 = toWeiInv("408").add(1); // <= 400*1.02
                    await setPrice(chainlink1, price1);
                
                    let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 drops below limit', async function() {
                    price1 = toWeiInv("408");
                    await setPrice(chainlink1, price1);
                    
                    await expect(
                        oracle.getRatio(token1.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token1 raises within limit', async function() {
                    price1 = toWeiInv("392"); // >= 400*0.98
                    await setPrice(chainlink1, price1);
                    
                    let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 raises above limit', async function() {
                    price1 = toWeiInv("392").add(1);
                    await setPrice(chainlink1, price1);
                    
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
            beforeEach(async function() {
                price1 = toWeiInv((400).toString());
                await setPrice(chainlink1, price1);
                price2 = toWeiInv((500).toString());
                await setPrice(chainlink2, price2);
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
            beforeEach(async function() {
                await setReserves(toWei("40000", decimals1), toWei("50000", decimals2));
            });
            describe('changing oracle price 1', function() {
                beforeEach(async function() {
                    price2 = toWeiInv((500).toString());
                    await setPrice(chainlink2, price2);
                });
                it('token1 drops within limit', async function() {
                    price1 = toWeiInv("408").add(1); // <= 400*1.02
                    await setPrice(chainlink1, price1);
                
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 drops below limit', async function() {
                    price1 = toWeiInv("408");
                    await setPrice(chainlink1, price1);
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token1 raises within limit', async function() {
                    price1 = toWeiInv("392"); // >= 400*0.98
                    await setPrice(chainlink1, price1);
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 raises above limit', async function() {
                    price1 = toWeiInv("392").add(1);
                    await setPrice(chainlink1, price1);
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
            });
            describe('changing oracle price 1', function() {
                beforeEach(async function() {
                    price1 = toWeiInv((400).toString());
                    await setPrice(chainlink1, price1);
                });
                it('token1 drops within limit', async function() {
                    price2 = toWei("0.00204"); // <= 1.02/500
                    await setPrice(chainlink2, price2);
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 drops below limit', async function() {
                    price2 = toWei("0.00204").add(1);
                    await setPrice(chainlink2, price2);

                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token1 raises within limit', async function() {
                    price2 = toWei("0.00196"); // >= 0.98/500
                    await setPrice(chainlink2, price2);
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 raises above limit', async function() {
                    price2 = toWei("0.00196").sub(1);
                    await setPrice(chainlink2, price2);
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
            });
        });
    });
});
