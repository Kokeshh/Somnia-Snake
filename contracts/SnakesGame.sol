// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SnakesGame {
    address public owner;
    
    struct Player {
        address addr;
        string nickname;
        uint256 totalWinnings;
    }

    struct Bet {
        uint256 amount;
        address player;
        string nickname;
        bool active;
    }

    mapping(address => Bet) public bets;
    mapping(address => string) public nicknames;
    Player[] public leaderboard;

    event BetPlaced(address indexed player, string nickname, uint256 amount);
    event CashedOut(address indexed player, uint256 profit);
    event BetReset(address indexed player);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function placeBet(string calldata nickname) external payable {
        require(msg.value > 0, "Bet must be > 0");
        
        // Сбросить предыдущую ставку, если она активна
        if (bets[msg.sender].active) {
            bets[msg.sender].active = false;
            emit BetReset(msg.sender);
        }
        
        string memory finalNickname;
        if (bytes(nicknames[msg.sender]).length == 0) {
            finalNickname = nickname;
        } else {
            finalNickname = nicknames[msg.sender];
        }
        bets[msg.sender] = Bet({
            amount: msg.value,
            player: msg.sender,
            nickname: finalNickname,
            active: true
        });
        if (bytes(nicknames[msg.sender]).length == 0) {
            nicknames[msg.sender] = nickname;
        }
        emit BetPlaced(msg.sender, bets[msg.sender].nickname, msg.value);
    }

    function cashout(uint256 profit) external {
        Bet storage bet = bets[msg.sender];
        require(bet.active, "No active bet");
        require(profit > 0 && profit <= bet.amount * 10, "Invalid profit");
        bet.active = false;
        payable(msg.sender).transfer(profit);
        _updateLeaderboard(msg.sender, bet.nickname, profit);
        emit CashedOut(msg.sender, profit);
    }

    function resetBet() external {
        require(bets[msg.sender].active, "No active bet to reset");
        bets[msg.sender].active = false;
        emit BetReset(msg.sender);
    }

    // Новая функция для смены никнейма
    function changeNickname(string calldata newNickname) external {
        require(bytes(newNickname).length > 0, "Nickname cannot be empty");
        nicknames[msg.sender] = newNickname;
        // Обновить ник в активной ставке
        if (bets[msg.sender].active) {
            bets[msg.sender].nickname = newNickname;
        }
        // Обновить ник в лидерборде
        for (uint i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].addr == msg.sender) {
                leaderboard[i].nickname = newNickname;
                break;
            }
        }
    }

    // Функция для вывода STT с контракта (только владелец)
    function withdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(amount);
        emit Withdrawn(owner, amount);
    }

    // Функция для смены владельца
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }

    // Функция для получения баланса контракта
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function _updateLeaderboard(address player, string memory nickname, uint256 profit) internal {
        bool found = false;
        for (uint i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].addr == player) {
                leaderboard[i].totalWinnings += profit;
                found = true;
                break;
            }
        }
        if (!found) {
            leaderboard.push(Player(player, nickname, profit));
        }
    }

    function getLeaderboard() external view returns (Player[] memory) {
        return leaderboard;
    }
}
