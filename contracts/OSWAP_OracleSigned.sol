// SPDX-License-Identifier: GPL-3.0-only
pragma solidity =0.6.11;

import "./interfaces/IOSWAP_OracleAdaptor.sol";
import './libraries/SafeMath.sol';

contract OSWAP_OracleSigned is IOSWAP_OracleAdaptor {
	using SafeMath for uint256;

    uint8 constant _DECIMALS = 18;
    uint256 constant DECIMALS = uint256(_DECIMALS);
    uint256 constant WEI = 10**DECIMALS;

    address public immutable signer;
    uint256 public sequenceNumber;

    constructor(address _signer) public {
        signer = _signer;
    }
	function recoverSigner(bytes32 hash, bytes memory payload, uint256 offset) private pure returns (address) {
		bytes32 r;
		bytes32 s;
		uint8 v;

		// Divide the signature in r, s and v variables
		assembly {
			// first 32 bytes, after the length prefix
			r := mload(add(payload, offset))
			// second 32 bytes
			s := mload(add(payload, add(offset, 0x20)))
			// final byte (first byte of the next 32 bytes)
			v := byte(0, mload(add(payload, add(offset, 0x40))))
		}

		// Version of signature should be 27 or 28, but 0 and 1 are also possible versions
		if (v < 27) {
			v += 27;
		}

		// If the version is correct return the signer address
		if (v != 27 && v != 28) {
			return (address(0));
		} else {
			return ecrecover(hash, v, r, s);
		}
	}
    function updateSequenceNumber(address from, address to, bytes calldata payload) external {
        (,uint256 _sequenceNumber) = getVerifiedData(from, to, payload);
        require(_sequenceNumber > sequenceNumber, "OSWAP: Invalid sequence number");
        sequenceNumber = _sequenceNumber;
    }
    function isSupported(address /*from*/, address /*to*/) external view override returns (bool supported) {
        return true;
    }
    function getVerifiedData(address from, address to, bytes memory payload) internal view returns (uint256 price, uint256 _sequenceNumber) {
        require(payload.length == 0xa1, "OSWAP: Invalid payload size");
        bytes32 chainId;
        uint256 _timestamp;
        assembly {
            price := mload(add(payload, 0x20))
            _sequenceNumber := mload(add(payload, 0x40))
            _timestamp := mload(add(payload, 0x60))
            chainId := chainid()
        }
        require(_sequenceNumber >= sequenceNumber, "OSWAP: Invalid sequence number");
        require(block.timestamp < _timestamp, "OSWAP: Price expired");
        bytes32 hash = keccak256(abi.encodePacked(address(this), from, to, price, _sequenceNumber, _timestamp, chainId));
		hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));

        address _signer = recoverSigner(hash, payload, 0x80);
        require(_signer == signer, "OSWAP: Invalid signature");
    }
    function getRatio(address from, address to, uint256 /*fromAmount*/, uint256 /*toAmount*/, bytes calldata payload) external view override returns (uint256 numerator, uint256 denominator) {
        numerator = getLatestPrice(from, to, payload);
        denominator = WEI;
    }
    function getLatestPrice(address from, address to, bytes calldata payload) public view override returns (uint256 price) {
        (price,) = getVerifiedData(from, to, payload);
    }
    function decimals() external view override returns (uint8) {
        return _DECIMALS;
    }
}