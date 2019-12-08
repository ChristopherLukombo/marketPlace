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
        await marketplaceEngine.methods.addHouse('dedz',
        12,
        12,
        'zdzdz',
        [accounts[1]],
        accounts[1],
        1,
        1,
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
        await marketplaceEngine.methods.addHouse('dedz',
        12,
        12,
        'zdzdz',
        [accounts[1]],
        accounts[1],
        1,
        1,
        accounts[1]).send({
            from: accounts[0],
            gas:3000000
        });
        await marketplaceEngine.methods.addHouse('dedz',
        12,
        12,
        'zdzdz',
        [accounts[1]],
        accounts[1],
        1,
        1,
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
        await marketplaceEngine.methods.addHouse('dedz',
        12,
        12,
        'zdzdz',
        [accounts[1]],
        accounts[1],
        1,
        1,
        accounts[1]).send({
            from: accounts[0],
            gas:3000000
        });

        const house = await marketplaceEngine.methods.getHouseInfo(0).call({
                from: accounts[0]
            });

        assert(undefined !== house);
    });

    it('buys a house', async () => {
        await marketplaceEngine.methods.addHouse('dedz',
        1000000,
        12,
        'zdzdz',
        [accounts[1]],
        accounts[1],
        1,
        1,
        accounts[7]).send({
            from: accounts[0],
            gas:3000000,
        });

        const isBought = await marketplaceEngine.methods.buyHouse(0).call({
                from: accounts[0],
                value: web3.utils.toWei('0.01', 'ether')
            });

        assert.equal(isBought, true);
    });

    it ('has no money and is ready for a new marketplaceEngine', async () => {
        assert.equal(await web3.eth.getBalance(marketplaceEngine.options.address), 0);
    });

});