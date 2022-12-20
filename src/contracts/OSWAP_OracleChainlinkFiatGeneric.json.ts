export default {
"abi":[
{"inputs":[{"internalType":"address[]","name":"_tokens","type":"address[]"},{"internalType":"address[]","name":"_pricefeeds","type":"address[]"}],"stateMutability":"nonpayable","type":"constructor"},
{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"chainlinkDeicmals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"payload","type":"bytes"}],"name":"getLatestPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"fromAmount","type":"uint256"},{"internalType":"uint256","name":"toAmount","type":"uint256"},{"internalType":"bytes","name":"payload","type":"bytes"}],"name":"getRatio","outputs":[{"internalType":"uint256","name":"numerator","type":"uint256"},{"internalType":"uint256","name":"denominator","type":"uint256"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"}],"name":"isSupported","outputs":[{"internalType":"bool","name":"supported","type":"bool"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"priceFeedAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
],
"bytecode":"60a06040526001805460ff1916601217905534801561001d57600080fd5b50604051610fc9380380610fc98339818101604052604081101561004057600080fd5b810190808051604051939291908464010000000082111561006057600080fd5b90830190602082018581111561007557600080fd5b825186602082028301116401000000008211171561009257600080fd5b82525081516020918201928201910280838360005b838110156100bf5781810151838201526020016100a7565b50505050905001604052602001805160405193929190846401000000008211156100e857600080fd5b9083019060208201858111156100fd57600080fd5b825186602082028301116401000000008211171561011a57600080fd5b82525081516020918201928201910280838360005b8381101561014757818101518382015260200161012f565b50505050919091016040525050600060805250508051825183918391146101b5576040805162461bcd60e51b815260206004820152601660248201527f4172726179206c656e677468206e6f74206d6174636800000000000000000000604482015290519081900360640190fd5b815160005b8181101561029b5760008482815181106101d057fe5b6020908102919091018101516001600160a01b03808216600090815292839052604090922054909250161561024c576040805162461bcd60e51b815260206004820152601960248201527f7072696365206665656420616c72656164792065786973747300000000000000604482015290519081900360640190fd5b83828151811061025857fe5b6020908102919091018101516001600160a01b03928316600090815291829052604090912080546001600160a01b031916929091169190911790556001016101ba565b50506001805460ff191660081790555050505060805160601c610cea6102df6000398061035752806106155280610699528061080752806108a05250610cea6000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806388462c8d1161005b57806388462c8d146101a45780638e9e56ef146101f3578063ad5c4648146101fb578063d9da4fe6146102035761007d565b8063313ce56714610082578063495e4348146100a057806375aa417414610148575b600080fd5b61008a6102be565b6040805160ff9092168252519081900360200190f35b610136600480360360608110156100b657600080fd5b73ffffffffffffffffffffffffffffffffffffffff82358116926020810135909116918101906060810160408201356401000000008111156100f757600080fd5b82018360208201111561010957600080fd5b8035906020019184600183028401116401000000008311171561012b57600080fd5b5090925090506102c3565b60408051918252519081900360200190f35b61017b6004803603602081101561015e57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661030f565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101df600480360360408110156101ba57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516610337565b604080519115158252519081900360200190f35b61008a61034c565b61017b610355565b6102a5600480360360a081101561021957600080fd5b73ffffffffffffffffffffffffffffffffffffffff823581169260208101359091169160408201359160608101359181019060a08101608082013564010000000081111561026657600080fd5b82018360208201111561027857600080fd5b8035906020019184600183028401116401000000008311171561029a57600080fd5b509092509050610379565b6040805192835260208301919091528051918290030190f35b601290565b60008060006102d787876000808989610379565b9092509050610304816102f884670de0b6b3a764000063ffffffff61039a16565b9063ffffffff61040d16565b979650505050505050565b60006020819052908152604090205473ffffffffffffffffffffffffffffffffffffffff1681565b6000610343838361044f565b90505b92915050565b60015460ff1681565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008061038a88888888888861049f565b915091505b965096945050505050565b6000826103a957506000610346565b828202828482816103b657fe5b0414610343576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526021815260200180610c676021913960400191505060405180910390fd5b600061034383836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250610555565b600073ffffffffffffffffffffffffffffffffffffffff83161580610488575073ffffffffffffffffffffffffffffffffffffffff8216155b1561049557506000610346565b6103438383610611565b60008073ffffffffffffffffffffffffffffffffffffffff8816158015906104dc575073ffffffffffffffffffffffffffffffffffffffff871615155b61054757604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f4f535741503a204f7261636c653a20496e76616c696420616464726573730000604482015290519081900360640190fd5b61038a88888888888861077d565b600081836105fb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b838110156105c05781810151838201526020016105a8565b50505050905090810190601f1680156105ed5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50600083858161060757fe5b0495945050505050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610697575073ffffffffffffffffffffffffffffffffffffffff808216600090815260208190526040902054161515610346565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561071b575073ffffffffffffffffffffffffffffffffffffffff808316600090815260208190526040902054161515610346565b73ffffffffffffffffffffffffffffffffffffffff80841660009081526020819052604080822054858416835291205490821691168115801590610774575073ffffffffffffffffffffffffffffffffffffffff811615155b95945050505050565b6000808673ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff161415610805576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526029815260200180610c3e6029913960400191505060405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff16141561089e5773ffffffffffffffffffffffffffffffffffffffff80881660009081526020819052604081205490911661088c81610a25565b60ff16600a0a9450925061038f915050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff1614156109385773ffffffffffffffffffffffffffffffffffffffff80891660009081526020819052604081205490911661092581610a25565b90945060ff16600a0a925061038f915050565b73ffffffffffffffffffffffffffffffffffffffff8089166000908152602081905260408120549091169061096c82610a25565b73ffffffffffffffffffffffffffffffffffffffff808c1660009081526020819052604081205493975091935091909116906109a782610a25565b909550905060ff80841690821611156109ea576109e36109d360ff83811690861663ffffffff610b8c16565b8790600a0a63ffffffff61039a16565b9550610a16565b610a13610a0360ff85811690841663ffffffff610b8c16565b8690600a0a63ffffffff61039a16565b94505b50505050965096945050505050565b60008073ffffffffffffffffffffffffffffffffffffffff8316610aaa57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f4f535741503a2070726963652066656564206e6f7420666f756e640000000000604482015290519081900360640190fd5b60008373ffffffffffffffffffffffffffffffffffffffff1663feaf968c6040518163ffffffff1660e01b815260040160a06040518083038186803b158015610af257600080fd5b505afa158015610b06573d6000803e3d6000fd5b505050506040513d60a0811015610b1c57600080fd5b506020015160015460ff169250905060008113610b84576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602d815260200180610c88602d913960400191505060405180910390fd5b939092509050565b600061034383836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525060008184841115610c35576040517f08c379a00000000000000000000000000000000000000000000000000000000081526020600482018181528351602484015283519092839260449091019190850190808383600083156105c05781810151838201526020016105a8565b50505090039056fe4f535741503a2066726f6d20616e6420746f2061646472657373657320617265207468652073616d65536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f774f535741505f4f7261636c65436861696e6c696e6b3a204e65676174697665206f72207a65726f207072696365a2646970667358221220923a25b9e9c6043d9b4aeb3c375c23ccce1b1722fe3568478db71f0a6455259064736f6c634300060b0033"
}