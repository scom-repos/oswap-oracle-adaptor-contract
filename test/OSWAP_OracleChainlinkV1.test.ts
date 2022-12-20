import { ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "@ethersproject/contracts";
import {BigNumber, BigNumberish, Contract, ContractFactory} from "ethers";
import { toWei, toWeiInv, compare, print} from "./helper";
import {expect, use} from "chai";

let accounts: SignerWithAddress[];
let ERC20: ContractFactory;
let MockV3Aggregator: ContractFactory;
let OSWAP_OracleChainlinkTestnet: ContractFactory;
let weth: Contract;

describe('OracleChainlink', function() {
    before(async function() {
        accounts = await ethers.getSigners();
        let WETH9 = await ethers.getContractFactory('WETH9');
        ERC20 = await ethers.getContractFactory('MockERC20');
        MockV3Aggregator = await ethers.getContractFactory('MockV3Aggregator');
        OSWAP_OracleChainlinkTestnet = await ethers.getContractFactory('OSWAP_OracleChainlinkV1Testnet');
        weth = await (await WETH9.deploy()).deployed();
    });
    describe('TEST 1', function() {
        before(async function() {

            const DECIMALS = [6, 8, 18, 24];
            const NAMES = ["A", "B"];
            let TOKENS2 = [];
            let CHAINLINKS = [];
            this.TOKENS = {};
            for (let i = 0 ; i < DECIMALS.length ; i++) {
                for (let j = 0 ; j < NAMES.length ; j++) {
                    let name = "TOKEN" + DECIMALS[i] + NAMES[j];
                    let token = await (await ERC20.deploy(name, name, toWei("1000000"), 0, DECIMALS[i])).deployed();
                    this.TOKENS[name] = token;
                    TOKENS2.push(token.address);
                    let chainlink = await (await MockV3Aggregator.deploy(name + "/ETH", DECIMALS[i], toWei((DECIMALS[i]*(j+1)).toString(), DECIMALS[i]))).deployed();
                    CHAINLINKS.push(chainlink.address);
                }
            }

            this.oracle = await (await OSWAP_OracleChainlinkTestnet.deploy(weth.address, TOKENS2, CHAINLINKS)).deployed();
            // for (let i = 0 ; i < CHAINLINKS.length ; i++)
            //     console.log((await (await MockV3Aggregator.at(CHAINLINKS[i])).latestRoundData())._answer.toString());
        });

        it ("should able to get price from decimal 6 to decimal 6", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN6B"].address, "0x");
            // 6.000000 : 12.000000
            expect(price).to.equal(toWei("6").div(12));
        });

        it ("should able to get price from decimal 6 to decimal 18", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN18B"].address, "0x");
            // 6.000000 : 36.000000000000000000
            expect(price).to.equal(toWei("6").div(36));
        });
        it ("should able to get price from decimal 6 to decimal 24", async function() {
            await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN24B"].address, "0x");
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN24B"].address, "0x");
            // 6.000000 : 48.000000000000000000000000
            expect(price).to.equal(toWei("6").div(48));
        });

        it ("should able to get price from decimal 6 to decimal 8", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN6B"].address, "0x");
            // 6.000000 : 12.000000
            expect(price).to.equal(toWei("6").div(12));
        });
        it ("should able to get price from decimal 8 to decimal 6", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN6B"].address, "0x");
            // 6.000000 : 12.000000
            expect(price).to.equal(toWei("6").div(12));
        });
        it ("should able to get price from decimal 8 to decimal 18", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN18B"].address, "0x");
            // 6.000000 : 36.000000000000000000
            expect(price).to.equal(toWei("6").div(36));
        });
        it ("should able to get price from decimal 8 to decimal 24", async function() {
            await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN24B"].address, "0x");
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN6A"].address, this.TOKENS["TOKEN24B"].address, "0x");
            // 6.000000 : 48.000000000000000000000000
            expect(price).to.equal(toWei("6").div(48));
        });

        it ("should able to get price from decimal 18 to decimal 6", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN18A"].address, this.TOKENS["TOKEN6B"].address, "0x");
            // 18.000000000000000000 : 12.000000
            expect(price).to.equal(toWei("18").div(12));
        });
        it ("should able to get price from decimal 18 to decimal 18", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN18A"].address, this.TOKENS["TOKEN18B"].address, "0x");
            // 18.000000000000000000 : 36.000000000000000000
            expect(price).to.equal(toWei("18").div(36));
        });
        it ("should able to get price from decimal 18 to decimal 24", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN18A"].address, this.TOKENS["TOKEN24B"].address, "0x");
            // 18.000000000000000000 : 48.000000000000000000000000
            expect(price).to.equal(toWei("18").div(48));
        });
        it ("should able to get price from decimal 24 to decimal 6", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN24A"].address, this.TOKENS["TOKEN6B"].address, "0x");
            // 24.000000000000000000000000 : 12.000000
            expect(price).to.equal(toWei("24").div(12));
        });
        it ("should able to get price from decimal 24 to decimal 18", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN24A"].address, this.TOKENS["TOKEN18B"].address, "0x");
            // 24.000000000000000000000000 : 36.000000000000000000
            expect(price).to.equal(toWei("24").div(36));
        });
        it ("should able to get price from decimal 24 to decimal 24", async function() {
            let price = await this.oracle.getLatestPrice(this.TOKENS["TOKEN24A"].address, this.TOKENS["TOKEN24B"].address, "0x");
            // 24.000000000000000000000000 : 48.000000000000000000000000
            expect(price).to.equal(toWei("24").div(48));
        });
    });

    describe('TEST 2', function() {
        let token1: Contract, token2: Contract, token3: Contract, token4: Contract;
        let price1 = toWeiInv("1005"),
            price2 = toWei("1010");

        before(async function() {
            token1 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
            token2 = await (await ERC20.deploy("token2", "token2", 0, 0, 18)).deployed();
            token3 = await (await ERC20.deploy("token3", "token3", 0, 0, 18)).deployed();
            token4 = await (await ERC20.deploy("token4", "token4", 0, 0, 18)).deployed();

            let chainlink1 = await (await MockV3Aggregator.deploy("token1/ETH", 18, price1)).deployed();
            let chainlink2 = await (await MockV3Aggregator.deploy("token2/ETH", 18, price2)).deployed();

            this.oracle = await (await OSWAP_OracleChainlinkTestnet.deploy(weth.address, [token1.address, token2.address], [chainlink1.address, chainlink2.address]))  .deployed();
        });
        it ('price>1 forward', async function(){
            let {numerator, denominator} = await this.oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
            expect(numerator).to.equal(toWei("1"));
            expect(denominator).to.equal(toWeiInv("1005"));
        });
        it ('price>1 backward', async function(){
            let {numerator, denominator} = await this.oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
            expect(numerator).to.equal(toWeiInv("1005"));
            expect(denominator).to.equal(toWei("1"));
        });

        it ('price<1 forward', async function(){
            let {numerator, denominator} = await this.oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
            expect(numerator).to.equal(toWei("1"));
            expect(denominator).to.equal(toWei("1010"));
        });
        it ('price<1 backward', async function(){
            let {numerator, denominator} = await this.oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
            expect(numerator).to.equal(toWei("1010"));
            expect(denominator).to.equal(toWei("1"));
        });

        it ('token to token forward', async function(){
            let {numerator, denominator} = await this.oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
            expect(numerator).to.equal(toWeiInv("1005"));
            expect(denominator).to.equal(toWei("1010"));
        });
        it ('token to token backward', async function(){
            let {numerator, denominator} = await this.oracle.getRatio(token2.address, token1.address, 0, 0, "0x");
            expect(numerator).to.equal(toWei("1010"));
            expect(denominator).to.equal(toWeiInv("1005"));
        });

        it ('should revert if no price feed is specified for from token for eth-token pair', async function(){
            await expect(
                this.oracle.getLatestPrice(token3.address, weth.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });
        it ('should revert if no price feed is specified for to token for eth-token pair', async function(){
            await expect(
                this.oracle.getLatestPrice(weth.address, token3.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });

        it ('should revert if no price feed is specified for from token for token-token pair', async function(){
            await expect(
                this.oracle.getLatestPrice(token3.address, token2.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });
        it ('should revert if no price feed is specified for to token for token-token pair', async function(){
            await expect(
                this.oracle.getLatestPrice(token2.address, token3.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });

        it ('should revert if no price feed is specified for from/to token for token-token pair', async function(){
            await expect(
                this.oracle.getLatestPrice(token3.address, token4.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });
        it ('should revert if no price feed is specified for from/to token for token-token pair', async function(){
            await expect(
                this.oracle.getLatestPrice(token4.address, token3.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });

        it ('should revert when from and to are the same token getAmountIn', async function(){
            await expect(
                this.oracle.getLatestPrice(token1.address, token1.address, "0x")
            ).to.be.revertedWith("OSWAP: from and to addresses are the same");
        });            
        it ('should revert when from and to are the same token getAmountOut', async function(){
            await expect(
                this.oracle.getLatestPrice(token1.address, token1.address, "0x")
            ).to.be.revertedWith("OSWAP: from and to addresses are the same");
        });
    });
});
