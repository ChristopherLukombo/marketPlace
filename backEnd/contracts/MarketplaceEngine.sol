pragma solidity >=0.4.25 < 0.6.0;
pragma experimental ABIEncoderV2;

contract MarketplaceEngine {

    struct House {
        uint256 idHouse;
        string addressHouse;
        uint256 price;
        uint256 surface;
        string description;
        address[] documents;
        address salesman;
        uint256 roomCount;
        uint256 creationDate;
        bool isSold;
        address owner;
    }

    // Dictionary idHouse with userAddress
	mapping(uint256 => address) public owners;
    House[] public houses;

    address transferTo;
    address transferFrom;

    event Transfer(address _transferTo, address _transferFrom, uint amount);

    constructor() public {
        transferFrom = msg.sender;
    }

    function addHouse(
        string memory _addressHouse,
        uint256 _price,
        uint256 _surface,
        string memory _description,
        address[] memory _documents,
        address _salesman,
        uint256 _roomCount,
        uint256 _creationDate,
        address _owner
        ) public {
            houses.push(
                House(
                    houses.length,
                    _addressHouse,
                    _price,
                    _surface,
                    _description,
                    _documents,
                    _salesman,
                    _roomCount,
                    _creationDate,
                    false,
                    _owner));
    }

    function buyHouse(uint256 _idHouse) external payable returns (bool)
    {
        for (uint i = 0; i < houses.length; i++)
        {
            if (houses[i].idHouse == _idHouse)
            {
                require((msg.value - houses[i].price) > 0, "Le propriétaire doit disposé de suffisament d'argent");
                transferTo = houses[i].owner;
                houses[i].isSold = true;
                transferTo.transfer(msg.value);
                emit Transfer(transferTo, transferFrom, msg.value);
                houses[i].owner = msg.sender; // Changement de proprio
                return true;
            }
        }

        return false;
    }

    function getSaleHouses() public view returns (House[] memory)
    {
        uint count = 0;
        uint index = 0;

        for (uint i = 0; i < houses.length; i++)
        {
            if (!houses[i].isSold)
            {
                count++;
            }
        }

        House[] memory result = new House[](count);

        for (uint j = 0; j < houses.length; j++)
        {
            if (!houses[j].isSold)
            {
                result[index] = houses[j];
                index++;
            }
        }

        return result;
    }

    function getHouseInfo(uint256 _idHouse) public view returns (House memory)
    {
        for (uint k = 0; k < houses.length; k++)
        {
            if (houses[k].idHouse == _idHouse)
            {
                return houses[k];
            }
        }
    }

}