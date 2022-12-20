
import { ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "@ethersproject/contracts";
const provider = waffle.provider;
import {BigNumber, BigNumberish, Contract, ContractFactory} from "ethers";
import {expect, use} from "chai";
import { toWei, toWeiInv, compare, print} from "./helper";

let accounts: SignerWithAddress[];

let weth: Contract;
let token1: Contract;
let token2: Contract;
let chainlink1: Contract;
let chainlink2: Contract;
let oracle: Contract;

let direction: boolean;

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

        
        let MockV3Aggregator = await ethers.getContractFactory('MockV3Aggregator');
        price1 = toWeiInv((300).toString());
        chainlink1 = await MockV3Aggregator.deploy("Chainlink1", 18, price1);
        await chainlink1.deployed();
        price2 = toWeiInv((500).toString());
        chainlink2 = await MockV3Aggregator.deploy("Chainlink2", 18, price2);
        await chainlink2.deployed();

        let OSWAP_OracleChainlinkTestnet = await ethers.getContractFactory('OSWAP_OracleChainlinkGeneric');
        oracle = await OSWAP_OracleChainlinkTestnet.deploy(weth.address, [token1.address, token2.address], [chainlink1.address, chainlink2.address]);
        await oracle.deployed();
    });

    describe('weth-token', function() {
        before(async function() {
            direction = BigNumber.from(weth.address.toLowerCase()).lt(token2.address.toLowerCase());
        });
        describe('changing amm price', function() {
            it('', async function() {
                let result = await oracle.getRatio(weth.address, token2.address, 0, 0, "0x");
                // print(result);
                print(result.numerator.mul("1000000000000000000").div(result.denominator));
                result = await oracle.getRatio(weth.address, token1.address, 0, 0, "0x");
                // print(result);
                print(result.numerator.mul("1000000000000000000").div(result.denominator));
                result = await oracle.getRatio(token2.address, weth.address, 0, 0, "0x");
                // print(result);
                print(result.numerator.mul("1000000000000000000").div(result.denominator));
                result = await oracle.getRatio(token1.address, weth.address, 0, 0, "0x");
                // print(result);
                print(result.numerator.mul("1000000000000000000").div(result.denominator));
                result = await oracle.getRatio(token1.address, token2.address, 0, 0, "0x");
                // print(result);
                print(result.numerator.mul("1000000000000000000").div(result.denominator));
                result = await oracle.getRatio(token2.address, token1.address, 0, 0, "0x");
                // print(result);
                print(result.numerator.mul("1000000000000000000").div(result.denominator));
            });
        });

    });

});
