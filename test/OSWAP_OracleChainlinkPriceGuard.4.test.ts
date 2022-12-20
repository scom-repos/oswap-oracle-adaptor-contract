/*
check price against amm, use amm price
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
let chainlink: Contract;
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
        oracle = await OSWAP_OracleChainlinkPriceGuardTestnet.deploy(weth.address, chainlink0.address, [token1.address, token2.address], [chainlink1.address, chainlink2.address], factory.address, maxValue, deviation, true);
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
                await setReserves(toWei("98"), toWei("50000", decimals)); // >= 100 * 0.98
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('ETH drops below limit', async function() {
                await setReserves(toWei("98").sub(1), toWei("50000", decimals));
                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('ETH raises within limit', async function() {
                await setReserves(toWei("102"), toWei("50000", decimals)); // <= 100 * 1.02
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('ETH raises above limit', async function() {
                await setReserves(toWei("102").add(1), toWei("50000", decimals));
                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token2 drops within limit', async function() {
                await setReserves(toWei("100"), toWeiInv("0.0000204", decimals).add(1)); // >= 50000 / 1.02
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token2 drops below limit', async function() {
                await setReserves(toWei("100"), toWeiInv("0.0000204", decimals));
                await expect(
                    oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token2 raises within limit', async function() {
                await setReserves(toWei("100"), toWeiInv("0.0000196", decimals)); // <= 50000 / 0.98
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token2 raises above limit', async function() {
                await setReserves(toWei("100"), toWeiInv("0.0000196", decimals).add(1));
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
                    price2 = toWeiInv("510").add(1); // >= (1/500)/1.02 
                    await setPrice(chainlink2, price2);
                    
                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token2 drops below limit', async function() {
                    price2 = toWeiInv("510");
                    await setPrice(chainlink2, price2);
                    
                    await expect(
                        oracle.getRatio(weth.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token2 raises within limit', async function() {
                    price2 = toWeiInv("490"); // <= (1/500)/0.98
                    await setPrice(chainlink2, price2);
                    
                    let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token2 raises above limit', async function() {
                    price2 = toWeiInv("490").add(1);
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
                await setReserves(toWei("40000", decimals), toWei("98")); // >= 100 * 0.98
                let result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
                console.log(result);
            });
            it('ETH drops below limit', async function() {
                await setReserves(toWei("40000", decimals), toWei("98").sub(1));
                await expect(
                    oracle.getRatio(weth.address, token1.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('ETH raises within limit', async function() {
                await setReserves(toWei("40000", decimals), toWei("102")); // <= 100 * 1.02
                let result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
                console.log(result);
            }); 
            it('ETH raises above limit', async function() {
                await setReserves(toWei("40000", decimals), toWei("102").add(1));
                await expect(
                    oracle.getRatio(weth.address, token1.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token1 drops within limit', async function() {
                await setReserves(toWei("39200", decimals), toWei("100")); // >= 40000 * 0.98
                let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                console.log(result);
            });
            it('token1 drops below limit', async function() {
                await setReserves(toWei("39200", decimals).sub(1), toWei("100"));
                await expect(
                    oracle.getRatio(token1.address, weth.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token1 raises within limit', async function() {
                await setReserves(toWei("40800", decimals), toWei("100")); // <= 40000 * 1.02
                let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                console.log(result);
            });
            it('token1 raises above limit', async function() {
                await setReserves(toWei("40800", decimals).add(1), toWei("100"));
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
                    price1 = toWei("0.00245"); // <= 1/(400/0.98)
                    await setPrice(chainlink1, price1);
                
                    let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 drops below limit', async function() {
                    price1 = toWei("0.00245").sub(1);
                    await setPrice(chainlink1, price1);
                    
                    await expect(
                        oracle.getRatio(token1.address, weth.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token1 raises within limit', async function() {
                    price1 = toWei("0.00255"); // >= 1/(400/1.02)
                    await setPrice(chainlink1, price1);
                    
                    let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 raises above limit', async function() {
                    price1 = toWei("0.00255").add(1);
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
                await setReserves(toWei("39200", decimals1), toWei("50000", decimals2)); // >= 40000*0.98
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token1 drops below limit', async function() {
                await setReserves(toWei("39200", decimals1).sub(1), toWei("50000", decimals2));
                await expect(
                    oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token1 raises within limit', async function() {
                await setReserves(toWei("40800", decimals1), toWei("50000", decimals2)); // <= 40000 * 1.02
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token1 raises above limit', async function() {
                await setReserves(toWei("40800", decimals1).add(1), toWei("50000", decimals2));
                await expect(
                    oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token2 raises within limit', async function() {
                await setReserves(toWei("40000", decimals1), toWeiInv("0.0000196", decimals2)); // <= 50000 / 0.98
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token2 raises above limit', async function() {
                await setReserves(toWei("40000", decimals1), toWeiInv("0.0000196", decimals2).add(1));
                await expect(
                    oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
            });
            it('token2 drops within limit', async function() {
                await setReserves(toWei("40000", decimals1), toWeiInv("0.0000204", decimals2).add(1)); // >= 50000 / 1.02
                let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                console.log(result);
            });
            it('token2 drops below limit', async function() {
                await setReserves(toWei("40000", decimals1), toWeiInv("0.0000204", decimals2));
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
                    price1 = toWei("0.00245"); // <= 400 / 0.98
                    await setPrice(chainlink1, price1);
                
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 drops below limit', async function() {
                    price1 = toWei("0.00245").sub(1);
                    await setPrice(chainlink1, price1);
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token1 raises within limit', async function() {
                    price1 = toWei("0.00255"); // >= 400 / 1.02
                    await setPrice(chainlink1, price1);
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 raises above limit', async function() {
                    price1 = toWei("0.00255").add(1);
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
                    price2 = toWeiInv("490"); // <= 500 * 0.98
                    await setPrice(chainlink2, price2);
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 drops below limit', async function() {
                    price2 = toWeiInv("490").add(1);
                    await setPrice(chainlink2, price2);

                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
                it('token1 raises within limit', async function() {
                    price2 = toWeiInv("510").add(1); // >= 500 * 1.02
                    await setPrice(chainlink2, price2);
                    
                    let result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                    console.log(result);
                });
                it('token1 raises above limit', async function() {
                    price2 = toWeiInv("510");
                    await setPrice(chainlink2, price2);
                    
                    await expect(
                        oracle.getRatio(token1.address, token2.address, 0, 0, "0x")
                    ).to.be.revertedWith("OracleAdaptor: Price outside allowed range");
                });
            });
        });
    });
});
