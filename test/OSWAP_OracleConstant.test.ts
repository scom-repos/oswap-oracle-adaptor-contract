
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
let OSWAP_OracleConstant: ContractFactory;
let weth: Contract;

describe('OSWAP_OracleConstant', function() {
    before(async function(){
        accounts = await ethers.getSigners();
        WETH9 = await ethers.getContractFactory('WETH9');
        ERC20 = await ethers.getContractFactory('MockERC20');
        OSWAP_OracleConstant = await ethers.getContractFactory('OSWAP_OracleConstant');
        weth = await (await WETH9.deploy()).deployed();
    });
    describe('TEST 1', function() {
        let tokens, token1: Contract, token2: Contract, token3: Contract, token4: Contract;
        let price1 = "1005", price2 = "1010", price3 = "1015", price4 = "1020";
        let oracle: Contract;
        before(async function() {
            token1 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
            token2 = await (await ERC20.deploy("token2", "token2", 0, 0, 18)).deployed();
            token3 = await (await ERC20.deploy("token3", "token3", 0, 0, 18)).deployed();
            token4 = await (await ERC20.deploy("token4", "token4", 0, 0, 18)).deployed();

            //constructor(address[] memory token0, address[] memory token1, uint256[] memory price0, uint256[] memory price1) public {
            oracle = await (await OSWAP_OracleConstant.deploy(
                [token1.address,  weth.address,    token3.address,  weth.address],
                [weth.address,    token2.address,  weth.address,    token4.address],
                [toWeiInv(price1), toWeiInv(price2), toWei(price3), toWei(price4)],
                [toWei(price1),   toWei(price2),   toWeiInv(price3),   toWeiInv(price4)]
            )).deployed();
        });
        it('backward price <1 getAmountOut', async function(){
            // 1000/(1/1005)
            let result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
            compare(result, {numerator:toWei("1005"), denominator:toWei("1")});
        });

        it('forward price <1 getAmountOut', async function(){
            // 1000/1005
            let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
            compare(result, {numerator:toWeiInv("1005"), denominator:toWei("1")});
        });
        it('forward price <1 getAmountOut', async function(){
            // 1000/1010
            let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
            compare(result, {numerator:toWeiInv("1010"), denominator:toWei("1")});
        });
        it('backward price <1 getAmountOut', async function(){
            // 1000/(1/1010)
            let result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
            compare(result, {numerator:toWei("1010"), denominator:toWei("1")});
        });
        it('backward price >1 getAmountOut', async function(){
            // 1000/1015
            let result = await oracle.getRatio(weth.address, token3.address, 0, 0, "0x");
            compare(result, {numerator:toWeiInv("1015"), denominator:toWei("1")});
        });
        it('forward price >1 getAmountOut', async function(){
            // 1000/(1/1015)
            let result = await oracle.getRatio(token3.address, weth.address, 0, 0, "0x");
            compare(result, {numerator:toWei("1015"), denominator:toWei("1")});
        });
        it('forward price >1 getAmountOut', async function(){
            // 1000/(1/1020)
            let result = await oracle.getRatio(weth.address, token4.address, 0, 0, "0x");
            compare(result, {numerator:toWei("1020"), denominator:toWei("1")});
        });
        it('backward price >1 getAmountOut', async function(){
            // 1000/1020
            let result = await oracle.getRatio(token4.address, weth.address, 0, 0, "0x");
            compare(result, {numerator:toWeiInv("1020"), denominator:toWei("1")});
        });
    });

    describe('TEST 2 - Should fail to create if condition failed', function() {
        let token1: Contract, token2: Contract;
        before(async function() {
            token1 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
            token2 = await (await ERC20.deploy("token2", "token2", 0, 0, 18)).deployed();
        }); 
        //constructor(address[] memory token0, address[] memory token1, uint256[] memory price0, uint256[] memory price1) public {
        it ('from and to addresses cannot be the same', async function(){
            await expect(
                OSWAP_OracleConstant.deploy(
                [token1.address],
                [token1.address],
                [toWeiInv("1")],
                [toWei("1")])
            ).to.be.revertedWith("OSWAP: from and to addresses cannot be the same");
        });
        it ('cannot have zero address', async function(){
            await expect(
                OSWAP_OracleConstant.deploy(
                ["0x0000000000000000000000000000000000000000"],
                [token1.address],
                [toWeiInv("1")],
                [toWei("1")])
            ).to.be.revertedWith("OSWAP: cannot have zero address");
        });
        it ('cannot have zero address', async function(){
            await expect(
                OSWAP_OracleConstant.deploy(
                [token1.address],
                ["0x0000000000000000000000000000000000000000"],
                [toWeiInv("1")],
                [toWei("1")])
            ).to.be.revertedWith("OSWAP: cannot have zero address");
        });
        it ('cannot have zero address', async function(){
            await expect(
                OSWAP_OracleConstant.deploy(
                ["0x0000000000000000000000000000000000000000"],
                ["0x0000000000000000000000000000000000000000"],
                [toWeiInv("1")],
                [toWei("1")])
            ).to.be.revertedWith("OSWAP: cannot have zero address");
        });
        it ('cannot have zero price', async function(){
            await expect(
                OSWAP_OracleConstant.deploy(
                [token1.address],
                [token2.address],
                [0],
                [toWei("1")])
            ).to.be.revertedWith("OSWAP: cannot have zero price");
        });
        it ('cannot have zero price', async function(){
            await expect(
                OSWAP_OracleConstant.deploy(
                [token1.address],
                [token2.address],
                [toWeiInv("1")],
                [0])
            ).to.be.revertedWith("OSWAP: cannot have zero price");
        });
    });

    describe('TEST 3 - Should revert if pair not exists', function() {
        let token1: Contract, token2: Contract, token3: Contract, token4: Contract;
        let price1 = 1005, price2 = 1010, price3 = 1015, price4 = 1020;
        before(async function() {
            token1 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
            token2 = await (await ERC20.deploy("token2", "token2", 0, 0, 18)).deployed();
            token3 = await (await ERC20.deploy("token3", "token3", 0, 0, 18)).deployed();
            token4 = await (await ERC20.deploy("token4", "token4", 0, 0, 18)).deployed();

            //constructor(address[] memory token0, address[] memory token1, uint256[] memory price0, uint256[] memory price1) public {
            this.oracle = await (await OSWAP_OracleConstant.deploy(
                [token1.address,  weth.address],
                [weth.address,    token2.address],
                [toWeiInv("1"), toWeiInv("1")],
                [toWei("1"),   toWei("1")]
            )).deployed();
        });
        it ('should revert if no price feed is specified for from token for eth-token pair', async function(){
            var amountOut = toWei("1000");
            await expect(
                this.oracle.getLatestPrice(token3.address, weth.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });
        it ('should revert if no price feed is specified for to token for eth-token pair', async function(){
            var amountOut = toWei("1000");
            await expect(
                this.oracle.getLatestPrice(weth.address, token3.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });
        it ('should revert if no price feed is specified for from token for token-token pair', async function(){
            var amountOut = toWei("1000");
            await expect(
                this.oracle.getLatestPrice(token3.address, token2.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });
        it ('should revert if no price feed is specified for to token for token-token pair', async function(){
            var amountOut = toWei("1000");
            await expect(
                this.oracle.getLatestPrice(token2.address, token3.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });
        it ('should revert if no price feed is specified for from/to token for token-token pair', async function(){
            var amountOut = toWei("1000");
            await expect(
                this.oracle.getLatestPrice(token3.address, token4.address, "0x")
            ).to.be.revertedWith("OSWAP: price feed not found");
        });
        it ('should revert when from and to are the same token getAmountIn', async function(){
            var amountOut = toWei("1000");
            await expect(
                this.oracle.getLatestPrice(token1.address, token1.address, "0x")
            ).to.be.revertedWith("OSWAP: from and to addresses are the same");
        });            
    });

    describe('TEST 4 - Asymmetric price', function() {
        let token1: Contract;
        let oracle: Contract;
        before(async function() {
            token1 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();

            //constructor(address[] memory token0, address[] memory token1, uint256[] memory price0, uint256[] memory price1) public {
            oracle = await (await OSWAP_OracleConstant.deploy(
                [token1.address],
                [weth.address],
                [toWeiInv("1000")],
                [toWei("900")]
            )).deployed();
        });
        it('getAmountOut forward', async function(){
            let result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
            compare(result, {numerator:toWei("900"), denominator:toWei("1")});
        });
        it('getAmountOut backward', async function(){
            let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
            compare(result, {numerator:toWeiInv("1000"), denominator:toWei("1")});
        });
    });

});
