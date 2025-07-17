import { ethers } from 'ethers';

// TODO: замените на реальный адрес после деплоя
export const CONTRACT_ADDRESS = '0x70701f7Cb11B06aD50b468aE71dE60895947e7Ec';

// Somnia Testnet configuration
export const SOMNIA_TESTNET = {
  chainId: '0xc488', // 50312 in hex
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: ['https://dream-rpc.somnia.network/'],
  blockExplorerUrls: ['https://dream-rpc.somnia.network/'],
};
export const CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "nickname",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BetPlaced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "BetReset",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "profit",
				"type": "uint256"
			}
		],
		"name": "CashedOut",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "profit",
				"type": "uint256"
			}
		],
		"name": "cashout",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newNickname",
				"type": "string"
			}
		],
		"name": "changeNickname",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "nickname",
				"type": "string"
			}
		],
		"name": "placeBet",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "resetBet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "nickname",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLeaderboard",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "addr",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "nickname",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "totalWinnings",
						"type": "uint256"
					}
				],
				"internalType": "struct SnakesGame.Player[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "leaderboard",
		"outputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "nickname",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalWinnings",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "nicknames",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function switchToSomniaTestnet() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  
  try {
    // Сначала проверяем текущую сеть
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('Current chainId:', currentChainId);
    console.log('Target chainId:', SOMNIA_TESTNET.chainId);
    
    // Если уже на нужной сети, ничего не делаем
    if (currentChainId === SOMNIA_TESTNET.chainId) {
      console.log('Already on Somnia Testnet');
      return;
    }
    
    // Попытка переключиться на сеть Somnia Testnet
    console.log('Switching to Somnia Testnet...');
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SOMNIA_TESTNET.chainId }],
    });
    console.log('Successfully switched to Somnia Testnet');
  } catch (switchError: any) {
    console.log('Switch error:', switchError);
    console.log('Switch error code:', switchError.code);
    console.log('Switch error message:', switchError.message);
    
    // Если сеть не найдена, просто предупреждаем пользователя
    if (switchError.code === 4902 || switchError.message?.includes('Unrecognized chain ID')) {
      console.warn('Somnia Testnet not found in MetaMask. Please add it manually.');
      throw new Error('Somnia Testnet not found in your wallet. Please add it manually or switch to it if already added.');
    } else {
      console.error('Switch network error:', switchError);
      throw new Error(`Failed to switch to Somnia Testnet: ${switchError.message || 'Unknown error'}`);
    }
  }
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  
  console.log('Starting wallet connection...');
  
  // Запрашиваем аккаунты
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found. Please connect your wallet.');
  }
  
  console.log('Accounts found:', accounts);
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  
  // Проверяем текущую сеть
  const network = await provider.getNetwork();
  console.log('Current network:', network);
  
  // Проверяем, что мы на правильной сети
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (chainId !== SOMNIA_TESTNET.chainId) {
    console.warn(`Warning: Connected on wrong network. Current: ${chainId}, Expected: ${SOMNIA_TESTNET.chainId}`);
    console.warn('Please switch to Somnia Testnet manually for full functionality.');
  }
  
  return { provider, signer };
}

export function getContract(signerOrProvider: any) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

export async function placeBet(signer: any, nickname: string, amount: string) {
  const contract = getContract(signer);
  const tx = await contract.placeBet(nickname, { value: ethers.utils.parseEther(amount) });
  return tx;
}

export async function cashout(signer: any, profit: string) {
  const contract = getContract(signer);
  const tx = await contract.cashout(ethers.utils.parseEther(profit));
  return tx;
}

export async function resetBet(signer: any) {
  const contract = getContract(signer);
  const tx = await contract.resetBet();
  return tx;
}

export async function getLeaderboard(provider: any) {
  const contract = getContract(provider);
  const leaderboard = await contract.getLeaderboard();
  
  // Преобразуем данные из контракта в удобный формат
  return leaderboard.map((player: any) => ({
    addr: player.addr,
    nickname: player.nickname,
    totalWinnings: ethers.utils.formatEther(player.totalWinnings)
  }));
}

export async function getContractBalance(provider: any) {
  const contract = getContract(provider);
  const balance = await contract.getContractBalance();
  return ethers.utils.formatEther(balance);
}

export async function changeNickname(signer: any, newNickname: string) {
  const contract = getContract(signer);
  const tx = await contract.changeNickname(newNickname);
  await tx.wait();
  return tx;
}

export async function checkNetwork() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  console.log('Current chainId:', chainId);
  console.log('Expected chainId:', SOMNIA_TESTNET.chainId);
  
  if (chainId !== SOMNIA_TESTNET.chainId) {
    console.warn(`Warning: Not on Somnia Testnet. Current: ${chainId}, Expected: ${SOMNIA_TESTNET.chainId}`);
    throw new Error(`Please switch to Somnia Testnet in MetaMask. Current network: ${chainId}`);
  }
}
