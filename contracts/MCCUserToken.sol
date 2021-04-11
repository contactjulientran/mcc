// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MCCUserToken is ERC721, Ownable {
    using SafeMath for uint256;

    /**
     * @dev Emitted when a new User is created with `userId`.
     */
    event NewUser(uint256 userId);
    /**
     * @dev Emitted when `userId` has spent `amount` EUR for a `typeSpent` purchase.
     */
    event SpentEUR(uint256 userId, uint256 amount, string typeSpent);

    struct User {
        string emailHash; // the email is hashed to preserve anonimity
        address account; // account that holds FTK
        uint256 totalSpentEUR; // 3 decimals, 1 EUR = 1000
    }

    /**
     * @dev This mapping keeps track of emails already used for users. The hash of the email is used to preserve anonimity.
     */
    mapping(string => bool) private emailHashes;

    /**
     * @dev The list of MCC users.
     */
    User[] private users;

    constructor() public ERC721("MCC User Token", "MUT") {}

    function getUsers() external view returns (User[] memory){
        return users;
    }

    modifier userExists(uint256 userId) {
        require(userId < users.length, "User not exist");
        _;
    }

    function createUser(string memory emailHash, address addr) external onlyOwner {
        require(!emailHashes[emailHash], "Email already used");
        emailHashes[emailHash] = true;
        users.push(User(emailHash, addr, 0));
        uint256 userId = users.length - 1;
        emit NewUser(userId);

        // Avoiding Re-Entrancy attacks
        // Checks-Effects-Interactions Pattern: Interaction with other contracts should be the very last step in any function.
        _safeMint(owner(), userId, "");
    }

    function addSpentEUR(
        uint256 userId,
        uint256 amount,
        string memory typeSpent
    ) external onlyOwner userExists(userId) {
        users[userId].totalSpentEUR = users[userId].totalSpentEUR.add(amount);
        emit SpentEUR(userId, amount, typeSpent);
    }

    function totalSpentEUR(uint256 userId)
        external
        view
        userExists(userId)
        returns (uint256)
    {
        return users[userId].totalSpentEUR;
    }
}
