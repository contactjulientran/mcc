// FidelityToken.sol
// SPDX-License-Identifier: MIT

pragma solidity >=0.6.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FidelityToken is ERC20, Ownable {
    event Burn(address account, uint256 value);

    constructor(uint256 initialSupply) public ERC20("Fidelity Token", "FTK") {
        _mint(msg.sender, initialSupply);
    }

    function burn(address account, uint256 value) external onlyOwner {
        emit Burn(account, value);

        // Avoiding Re-Entrancy attacks
        // Checks-Effects-Interactions Pattern: Interaction with other contracts should be the very last step in any function.
        _burn(account, value);
    }
}
