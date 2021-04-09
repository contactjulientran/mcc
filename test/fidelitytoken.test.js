const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const FidelityToken = artifacts.require('FidelityToken');

contract('Fidelity Token', function (accounts) {
    const _name = 'Fidelity Token';
    const _symbol = 'FTK';
    const _decimals = new BN(18);
    const _supply = new BN(1000);
    const mccAccount = accounts[0];
    const user1 = accounts[1];

    // Avant chaque test unitaire
    beforeEach(async function () {
        this.ERC20Instance = await FidelityToken.new(_supply, { from: mccAccount });
    });

    // Premier test unitaire
    it('a un nom', async function () {
        expect(await this.ERC20Instance.name()).to.equal(_name);
    });

    // Deuxième test unitaire
    it('a un symbole', async function () {
        expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
    });

    // Troisième test unitaire
    it('a un decimals', async function () {
        let expected = (await this.ERC20Instance.decimals()).toString();
        expect(expected).to.equal(_decimals.toString());
    });

    // 4eme test unitaire
    it('a un supply', async function () {
        let expected = (await this.ERC20Instance.totalSupply()).toString();
        expect(expected).to.equal(_supply.toString());
    });

    // Test de `function burn(address account, uint256 value) external onlyOwner`
    it('should revert when the sender in not MCC"', async function () {
        // GIVEN
        const sender = user1;  // sender is not MCC
        const account = user1;
        const value = new BN(10);

        // WHEN
        // THEN
        await expectRevert(this.ERC20Instance.burn(account, value, { from: sender }), "Ownable: caller is not the owner");
    });
    it('should burn tokens from `account`', async function () {
        // GIVEN
        const sender = mccAccount;
        const account = user1;
        const initialBalance = new BN(100);
        const value = new BN(10);

        await this.ERC20Instance.transfer(account, initialBalance, { from: sender });
        const balanceBefore = await this.ERC20Instance.balanceOf(account);
        expect(balanceBefore).to.be.bignumber.equal(initialBalance);
        // WHEN
        const receipt = await this.ERC20Instance.burn(account, value, { from: sender });

        // THEN
        const balanceAfter = await this.ERC20Instance.balanceOf(account);
        expect(balanceAfter).to.be.bignumber.equal(initialBalance.sub(value));
        expectEvent(receipt, 'Burn', {
            account,
            value
        });
    });


});