pragma solidity >= 0.4.21 < 0.6.0;
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
        uint256 date;
		bool isSold;
    }

    // Dictionary idHouse with userAddress
	mapping(uint256 => address) public owners;
    House[] public houses;

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
			
        houses.push(House(houses.length + 1, _addressHouse, _price, _surface, _description, _documents, _salesman, _roomCount, _date, false));
		owners[houses.length + 1] = msg.sender;	
    }

    function buyHouse (uint256 _idHouse) external payable returns (bool)
    {
        for(uint i = 0; i < houses.length; i++)
        {
            if (houses[i].idHouse == _idHouse)
            {
                require(msg.value == houses[i].price);
                
                owners[_idHouse].transfer(msg.value);
                owners[_idHouse] = msg.sender; // Changement de proprio
                houses[i].isSold = true;
                
                return true;
            }
        }
        
        return false;
    }
    
    function getSaleHouses() public returns (House[])
    {
        House[] result;
        
        for(uint i = 0; i < houses.length; i++)
        {
            if (!houses[i].isSold)
            {
                result.push(houses[i]);
            }
        }
        
        return result;
    }
    
    function getHouseInfo(uint256 _idHouse) public returns (House)
    {
        for(uint i = 0; i < houses.length; i++)
        {
            if (houses[i].idHouse == _idHouse)
            {
                return houses[i];
            }
        }
    }

}