import { ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "@ethersproject/contracts";
import {BigNumber, BigNumberish, Contract, ContractFactory} from "ethers";
import { toWei, toWeiInv, compare, print} from "./helper";
import {expect, use} from "chai";
const provider = waffle.provider;

let accounts: SignerWithAddress[];

let ERC20: ContractFactory;
let OSWAP_OracleSigned: ContractFactory;
let weth: Contract;
let token1: Contract;
let token2: Contract;
let oracle: Contract;

let price = "1000";
let seqNum = 1000;
let expire = 3600;
let chainId: number;

describe('OSWAP_OracleSigned', function() {
    async function getSignedPriceData(oracle: string, from: string, to: string, price: string, seqNum: number, expire: number, chainId: number, signer: SignerWithAddress){

        let now = (await provider.getBlock('latest')).timestamp;
        expire = now + Number(expire);

        let data = ethers.utils.hexConcat([
            oracle,
            from,
            to,
            ethers.utils.hexZeroPad(ethers.utils.hexValue(toWei(price)), 32),
            ethers.utils.hexZeroPad(ethers.utils.hexValue(seqNum), 32),
            ethers.utils.hexZeroPad(ethers.utils.hexValue(expire), 32),
            ethers.utils.hexZeroPad(ethers.utils.hexValue(chainId), 32)
        ]);

        data = ethers.utils.keccak256(data);
        let signature = await signer.signMessage(ethers.utils.arrayify(data));

        let payload = ethers.utils.hexConcat([
            ethers.utils.hexZeroPad(ethers.utils.hexValue(toWei(price)), 32),
            ethers.utils.hexZeroPad(ethers.utils.hexValue(seqNum), 32),
            ethers.utils.hexZeroPad(ethers.utils.hexValue(expire), 32),
            signature
        ]);

        return payload;
    }
    before(async function() {
        accounts = await ethers.getSigners();
        let WETH9 = await ethers.getContractFactory('WETH9');
        ERC20 = await ethers.getContractFactory('MockERC20');
        weth = await (await WETH9.deploy()).deployed();
        OSWAP_OracleSigned = await ethers.getContractFactory('OSWAP_OracleSigned');

        chainId = (await provider.getNetwork()).chainId;
        if (chainId == 1337) chainId = 1;

        token1 = await (await ERC20.deploy("token1", "token1", 0, 0, 18)).deployed();
        token2 = await (await ERC20.deploy("token2", "token2", 0, 0, 18)).deployed();

        oracle = await (await OSWAP_OracleSigned.deploy(accounts[0].address)).deployed();
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, price, seqNum, expire, chainId, accounts[0]);
        await oracle.updateSequenceNumber(weth.address, token1.address, signed);
    });
    it('should able to call getRatio', async function(){
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, price, seqNum, expire, chainId, accounts[0]);
        let result = await oracle.getRatio(weth.address, token1.address, 0, 0, signed);
        expect(result.numerator.toString()).to.equal(toWei("1000"));
        expect(result.denominator.toString()).to.equal(toWei("1"));
    });
    it('should not able to getPrice when the pair is different (pair reversed)', async function(){
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, price, seqNum, expire, chainId, accounts[0]);
        await expect(
            oracle.getLatestPrice(token1.address, weth.address, signed)
        ).to.be.revertedWith("OSWAP: Invalid signature");
    });
    it('should not able to getPrice when the pair is different (getLatestPrice using a different pair)', async function(){
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, price, seqNum, expire, chainId, accounts[0]);
        await expect(
            oracle.getLatestPrice(weth.address, token2.address, signed)
        ).to.be.revertedWith("OSWAP: Invalid signature");
    });
    it('should not able to getPrice when the pair is different (getSignedPriceData using a different pair)', async function(){
        let signed = await getSignedPriceData(oracle.address, weth.address, token2.address, price, seqNum, expire, chainId, accounts[0]);
        await expect(
            oracle.getLatestPrice(weth.address, token1.address, signed)
        ).to.be.revertedWith("OSWAP: Invalid signature");
    });
    it('should not able to getPrice when sequence number expired', async function(){
        let expire = 3600;
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, price, 999, expire, chainId, accounts[0]);
        await expect(
            oracle.getLatestPrice(weth.address, token1.address, signed)
        ).to.be.revertedWith("OSWAP: Invalid sequence number");
    });
    it('should not able to getPrice when the quote is expired', async function(){
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, price, seqNum, 10, chainId, accounts[0]);
        await new Promise<void>((resolve, reject) => { setTimeout(() => {resolve();}, 15000);});
        // mine one block for the new timestamp
        await provider.send("evm_mine", []);
        await expect(
            oracle.getLatestPrice(weth.address, token1.address, signed)
        ).to.be.revertedWith("OSWAP: Price expired");
    });
    it('should not able to getPrice when chainId is different', async function(){
        let expire = 3600;
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, price, seqNum, expire, 42, accounts[0]);
        await expect(
            oracle.getLatestPrice(weth.address, token1.address, signed)
        ).to.be.revertedWith("OSWAP: Invalid signature");
    });
    it('should not able to getPrice when the signer is different', async function(){
        let expire = 3600;
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, price, seqNum, expire, chainId, accounts[1]);
        await expect(
            oracle.getLatestPrice(weth.address, token1.address, signed)
        ).to.be.revertedWith("OSWAP: Invalid signature");
    });

    let newPrice = "1010";
    let newSeqNum = 1001;
    it('should able to update seqNum', async function(){
        let expire = 3600;
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, newPrice, newSeqNum, expire, chainId, accounts[0]);
        await oracle.updateSequenceNumber(weth.address, token1.address, signed);
    });
    it('should able to get new price with the updated seqNum', async function(){
        let expire = 3600;
        let signed = await getSignedPriceData(oracle.address, weth.address, token1.address, newPrice, newSeqNum, expire, chainId, accounts[0]);
        let result = await oracle.getRatio(weth.address, token1.address, 0, 0, signed);
        expect(result.numerator.toString()).to.equal(toWei("1010"));
        expect(result.denominator.toString()).to.equal(toWei("1"));
    });
});