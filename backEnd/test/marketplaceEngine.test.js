const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile.js');

require('events').EventEmitter.defaultMaxListeners = 100

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    marketplaceEngine = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gasPrice: 8000000000, gas: 4700000});
});

describe('MarketplaceEngine Contract', () => {
    it('deploys a contract', () => {
        assert.ok(marketplaceEngine.options.address);
    });

    it('adds one house', async () => {
        await marketplaceEngine.methods.addHouse(
        'dedz',
        '28, avenue de la rue de Paris',
        17,
        12,
        'bien',
        1,
        1123,
        accounts[1]).send({
            from: accounts[3],
            gas:3000000
        });

        const houses = await marketplaceEngine.methods.getSaleHouses().call({
                from: accounts[0]
            });

        assert.equal(houses.length, 1);
    });

    it('adds two houses', async () => {
        await marketplaceEngine.methods.addHouse(
        'dedz',
        '28, avenue de la rue de Paris',
        17,
        12,
        'bien',
        1,
        1123,
        accounts[1]).send({
            from: accounts[0],
            gas:3000000
        });
        await marketplaceEngine.methods.addHouse(
        'dedz',
        '28, avenue de la rue de Paris',
        17,
        12,
        'bien',
        1,
        1123,
        accounts[1]).send({
            from: accounts[0],
            gas:3000000
        });

        const houses = await marketplaceEngine.methods.getSaleHouses().call({
                from: accounts[0]
            });

        assert.equal(houses.length, 2);
    });

    it('gets house infos', async () => {
        await marketplaceEngine.methods.addHouse(
        'dedz',
        '28, avenue de la rue de Paris',
        17,
        12,
        'bien',
        1,
        1123,
        accounts[1]).send({
            from: accounts[0],
            gas:3000000
        });

        const house = await marketplaceEngine.methods.getHouseInfo(1).call({
                from: accounts[0]
            });

        assert(undefined !== house);
    });

    it('buys a house', async () => {
        await marketplaceEngine.methods.addHouse(
        'dedz',
        '28, avenue de la rue de Paris',
        17,
        12,
        'bien',
        1,
        1123,
        accounts[1]).send({
            from: accounts[0],
            gas:3000000,
        });

        const isBought = await marketplaceEngine.methods.buyHouse(1).call({
                from: accounts[0],
                value: web3.utils.toWei('0.01', 'ether')
            });

        assert.equal(isBought, true);
    });

    it ('has no money and is ready for a new marketplaceEngine', async () => {
        assert.equal(await web3.eth.getBalance(marketplaceEngine.options.address), 0);
    });

    it('adds one material', async () => {
        const material = {
            fileName: 'text.txt',
            fileHash: 'jejedze',
            idHouse: 1
        };
        await marketplaceEngine.methods.addMaterial(material).send({
            from: accounts[3],
            gas:3000000
        });

        const materials = await marketplaceEngine.methods.getMaterialsByIdHouse(1).call({
                from: accounts[0]
            });

        assert.equal(materials.length, 1);
    });

    it('has no materials', async () => {
        try {
            await marketplaceEngine.methods.getMaterialsByIdHouse(1).call({
                from: accounts[0]
            });
        } catch (error) {
            assert(undefined !== error);
        }
    }).timeout(10000);

    it('has no houses', async () => {
        try {
            await marketplaceEngine.methods.getHouseInfo(1).call({
                from: accounts[0]
            });
        } catch (error) {
            assert(undefined !== error);
        }
    }).timeout(10000);

});