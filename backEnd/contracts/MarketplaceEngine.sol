pragma solidity >=0.4.21 <0.6.0;

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
        uint256 date;
    }

     uint numCampaigns;


    mapping(address => House) public houseForSale;

    function addHouse(
        string memory _addressHouse,
        uint256 _price,
        uint256 _surface,
        string memory _description,
        address[] memory _documents,
        address _salesman,
        uint256 _roomCount,
        uint256 _date
        ) public {
        houseForSale[msg.sender] = House(1, _addressHouse, _price, _surface, _description, _documents, _salesman, _roomCount, _date);
    }

    function buyHouse() public {

    }

    function sellHouse() public {

    }

    function getSaleHouses() public {
        //return houseForSale[idHouse];
    }

    function getHouseInfo() public {

    }


}