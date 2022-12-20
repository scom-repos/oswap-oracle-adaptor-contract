
import { ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "@ethersproject/contracts";
const provider = waffle.provider;
import {BigNumber, BigNumberish, Contract, ContractFactory} from "ethers";
import {expect, use} from "chai";
import { toWei, toWeiInv, compare, print} from "./helper";

let accounts: SignerWithAddress[];

let ERC20: ContractFactory;
let OSWAP_OracleSetYourOwnPrice: ContractFactory;

describe('OSWAP_OracleSetYourOwnPrice', function() {
    before(async function(){
        accounts = await ethers.getSigners();
        ERC20 = await ethers.getContractFactory('MockERC20');
        OSWAP_OracleSetYourOwnPrice = await ethers.getContractFactory('OSWAP_OracleSetYourOwnPrice');
    });
    describe('TEST 1', function() {
        let token0: Contract, token1: Contract;
        let oracle: Contract;
        before(async function() {
            token0 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
            token1 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
            oracle = await (await OSWAP_OracleSetYourOwnPrice.deploy()).deployed();
        });
        function getPirce(value : BigNumber) : string {
            return ethers.utils.hexZeroPad(ethers.utils.hexValue(value), 32);
        }
        it('getRatio >1', async function(){
            let result = await oracle.getRatio(token0.address, token1.address, 0, 0, getPirce(toWei("1000")));
            compare(result, {numerator:toWei("1000"), denominator:toWei("1")});
        });
        it('getRatio <1', async function(){
            let result = await oracle.getRatio(token0.address, token1.address, 0, 0, getPirce(toWeiInv("1000")));
            compare(result, {numerator:toWeiInv("1000"), denominator:toWei("1")});
        });
        it('getLatestPrice >1', async function(){
            let result = await oracle.getLatestPrice(token0.address, token1.address, getPirce(toWei("1000")));
            compare(result, toWei("1000"));
        });
        it('getLatestPrice <1', async function(){
            let result = await oracle.getLatestPrice(token0.address, token1.address, getPirce(toWeiInv("1000")));
            compare(result, toWeiInv("1000"));
        });
    });
});
