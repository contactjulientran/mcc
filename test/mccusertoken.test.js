const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const MCCUserToken = artifacts.require("MCCUserToken");

contract("MCCUserToken", accounts => {
    const mccAccount = accounts[0];
    const user1 = accounts[1];
    const user1Email = "user1@mcc.com"; // in production, that is a hash that will be used

    beforeEach(async () => {
        this.contractInstance = await MCCUserToken.new({ from: mccAccount });
    });

    // Test de `function createUser(string memory email) external onlyOwner`
    it("should revert when the sender in not MCC", async () => {
        // GIVEN
        const sender = user1; // sender is not MCC
        const email = user1Email;
        const account = user1;

        // WHEN
        // THEN
        await expectRevert(this.contractInstance.createUser(email, account, { from: sender }), "Ownable: caller is not the owner");
    });
    it("should revert when the email has alredy been used", async () => {
        // GIVEN
        const sender = mccAccount;
        const email = user1Email;
        const account = user1;
        // email is used for the 1st time
        await this.contractInstance.createUser(email, account, { from: sender });

        // WHEN
        // the same email is used for the 2nd time
        // THEN
        await expectRevert(this.contractInstance.createUser(email, account, { from: sender }), "Email already used");
    });
    it("should create an User when the sender is MCC, and emit event `NewUser`", async () => {
        // GIVEN
        const sender = mccAccount;
        const email = user1Email;
        const account = user1;
        const expectedUserId = new BN(0);

        const userCountBefore = await this.contractInstance.balanceOf(sender);
        expect(userCountBefore).to.be.bignumber.equal(new BN(0));
        // WHEN
        const receipt = await this.contractInstance.createUser(email, account, { from: sender });

        // THEN
        const userCountAfter = await this.contractInstance.balanceOf(sender);
        expect(userCountAfter).to.be.bignumber.equal(new BN(1));
        expectEvent(receipt, 'NewUser', {
            userId: expectedUserId
        });
    });

    // Test de `function addSpentEUR(uint256 userId, uint256 amount, string memory typeSpent) external onlyOwner userExists(userId)`
    it("should revert when the sender in not MCC", async () => {
        // GIVEN
        const sender = user1; // sender is not MCC
        const userId = new BN(0);
        const amount = new BN(100);
        const typeSpent = "sport";

        // WHEN
        // THEN
        await expectRevert(this.contractInstance.addSpentEUR(userId, amount, typeSpent, { from: sender }), "Ownable: caller is not the owner");
    });
    it("should revert when the `userId` does not exist", async () => {
        // GIVEN
        const sender = mccAccount;
        const userId = new BN(123); // userId does not exist
        const amount = new BN(100);
        const typeSpent = "sport";

        // WHEN
        // THEN
        await expectRevert(this.contractInstance.addSpentEUR(userId, amount, typeSpent, { from: sender }), "User not exist");
    });
    it("should update `userId` total spent amount, and emit event `SpentEUR`", async () => {
        // GIVEN
        const sender = mccAccount;
        const email = user1Email;
        const account = user1;
        const userId = new BN(0);
        const amount = new BN(100);
        const typeSpent = "sport";

        await this.contractInstance.createUser(email, account, { from: sender });
        const totalSpentBefore = await this.contractInstance.totalSpentEUR(userId);
        expect(totalSpentBefore).to.be.bignumber.equal(new BN(0));
        // WHEN
        const receipt = await this.contractInstance.addSpentEUR(userId, amount, typeSpent, { from: sender });

        // THEN
        const totalSpenAfter = await this.contractInstance.totalSpentEUR(userId);
        expect(totalSpenAfter).to.be.bignumber.equal(amount);
        expectEvent(receipt, 'SpentEUR', {
            userId,
            amount,
            typeSpent
        });
    });

    // Test de `function totalSpentEUR(uint256 userId) external view userExists(userId) returns (uint256)`
    it("should revert when the `userId` does not exist", async () => {
        // GIVEN
        const sender = mccAccount;
        const userId = new BN(123);  // userId does not exist

        // WHEN
        // THEN
        await expectRevert(this.contractInstance.totalSpentEUR(userId, { from: sender }), "User not exist");
    });
    it("should return the total amount spent by `userId`", async () => {
        // GIVEN
        const sender = mccAccount;
        const email = user1Email;
        const account = user1;
        await this.contractInstance.createUser(email, account, { from: sender });
        const userId = new BN(0);

        // WHEN
        // THEN
        const totalSpent = await this.contractInstance.totalSpentEUR(userId);
        expect(totalSpent).to.be.bignumber.equal(new BN(0));
    });
});