
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
        let token1: Contract;
        let price1 = "1000";
        let oracle: Contract;
        before(async function() {
            token1 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();

            //constructor(address[] memory token0, address[] memory token1, uint256[] memory price0, uint256[] memory price1) public {
            oracle = await (await OSWAP_OracleConstant.deploy(
                [token1.address],
                [weth.address],
                [toWeiInv(price1)],
                [toWei(price1)]
            )).deployed();
        });
        it('backward price <1 getAmountOut', async function(){
            // 1000/(1/1005)
            let result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
            compare(result, {numerator:toWei("1000"), denominator:toWei("1")});
            result = await oracle.getLatestPrice(weth.address, token1.address, "0x");
            console.log(result.toString());
        });

        it('forward price <1 getAmountOut', async function(){
            // 1000/1005
            let result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
            compare(result, {numerator:toWeiInv("1000"), denominator:toWei("1")});
            result = await oracle.getLatestPrice(token1.address, weth.address,"0x");
            console.log(result.toString());
        });
    });

});
