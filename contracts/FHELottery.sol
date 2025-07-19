// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FHELottery {
    mapping(address => bytes) public guesses;
    mapping(address => bytes) public proofs;
    address[] public players;

    bytes public encryptedTarget;
    bool public targetSet;
    address public winner;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function setTarget(bytes calldata _encryptedTarget) external onlyOwner {
        require(!targetSet, "Target already set");
        encryptedTarget = _encryptedTarget;
        targetSet = true;
    }

    function resetTarget() external onlyOwner {
        require(targetSet, "Target not set");
        encryptedTarget = "";
        targetSet = false;
    }

    function submitGuess(bytes calldata encryptedGuess, bytes calldata proof) external {
        require(targetSet, "Target not set yet");

        if (guesses[msg.sender].length == 0) {
            players.push(msg.sender);
        }

        guesses[msg.sender] = encryptedGuess;
        proofs[msg.sender] = proof;
    }

    function getGuess(address player) external view returns (bytes memory) {
        return guesses[player];
    }

    function getProof(address player) external view returns (bytes memory) {
        return proofs[player];
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function setWinner(address _winner) external onlyOwner {
        winner = _winner;
    }

    function getWinner() external view returns (address) {
        return winner;
    }
}
