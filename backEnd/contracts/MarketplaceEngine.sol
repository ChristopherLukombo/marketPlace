pragma solidity >=0.4.25 < 0.6.0;
pragma experimental ABIEncoderV2;

contract MarketplaceEngine {

    struct Material {
        string    fileName;
        string    fileHash;
        uint256   idHouse;
    }

    struct House {
        uint256 idHouse;
        string  title;
        string  addressHouse;
        uint256 price;
        uint256 surface;
        string  description;
        uint256 roomCount;
        uint256 creationDate;
        bool    isSold;
        address owner;
    }


    House[]    public houses;
    Material[] public materials;

    address transferTo;
    address transferFrom;

    event Transfer(address _transferTo, address _transferFrom, uint amount);

    constructor() public {
        transferFrom = msg.sender;
    }

    function addHouse (
        string memory _title,
        string memory _addressHouse,
        uint256       _price,
        uint256       _surface,
        string memory _description,
        uint256       _roomCount,
        uint256       _creationDate,
        address       _owner
        ) public {
            houses.push(House(
                    houses.length + 1,
                    _title,
                    _addressHouse,
                    _price,
                    _surface,
                    _description,
                    _roomCount,
                    _creationDate,
                    false,
                    _owner
                    ));
    }

    function addMaterial(Material material) public
    {
        materials.push(material);
    }

    function getMaterialsByIdHouse(uint256 _idHouse) public view returns (Material[] memory)
    {
        Material[] memory materialList = findMaterialsByIdHouse(_idHouse);
        require (materialList.length > 0, "No materials found !");
        return materialList;
    }

    function findMaterialsByIdHouse(uint256 _idHouse) private view returns (Material[] memory)
    {
        uint i = 0;
        uint index = 0;
        uint count = 0;

        while (i < materials.length)
        {
            if (_idHouse == materials[i].idHouse)
            {
                 count++;
            }
            i++;
        }

        i = 0;

        Material[] memory materialList = new Material[](count);
        while (i < materials.length)
        {
            if (_idHouse == materials[i].idHouse)
            {
                 materialList[index++] = materials[i];
            }
            i++;
        }
        return materialList;
    }

    function buyHouse(uint256 _idHouse) external payable returns (bool)
    {
        for (uint i = 0; i < houses.length; i++)
        {
            if (houses[i].idHouse == _idHouse)
            {
                require((msg.value - houses[i].price) > 0, "The owner must have enough money");
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
        House memory house = findHouseById(_idHouse);
        require (0 != house.idHouse, "The house does not exist.");
        return house;
    }

    function findHouseById(uint256 _idHouse) private view returns (House memory)
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