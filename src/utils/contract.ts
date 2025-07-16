import { ethers } from 'ethers';

// TODO: замените на реальный адрес после деплоя
export const CONTRACT_ADDRESS = '0x8F3fCCccE97b4873003AB34AfF9053D1c64b5B61';

// Somnia Testnet configuration
export const SOMNIA_TESTNET = {
  chainId: '0x1a4', // 420 in hex
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.somnia.zone'],
  blockExplorerUrls: ['https://testnet-explorer.somnia.zone'],
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
    // Если сеть не добавлена, добавляем её
    if (switchError.code === 4902) {
      try {
        console.log('Adding Somnia Testnet to MetaMask...');
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SOMNIA_TESTNET],
        });
        console.log('Successfully added Somnia Testnet to MetaMask');
      } catch (addError: any) {
        console.error('Add network error:', addError);
        throw new Error(`Failed to add Somnia Testnet to MetaMask: ${addError.message || 'Unknown error'}`);
      }
    } else {
      console.error('Switch network error:', switchError);
      throw new Error(`Failed to switch to Somnia Testnet: ${switchError.message || 'Unknown error'}`);
    }
  }
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  
  console.log('Starting wallet connection...');
  
  // Сначала пытаемся переключиться на Somnia Testnet
  try {
    console.log('Attempting to switch to Somnia Testnet...');
    await switchToSomniaTestnet();
    console.log('Successfully switched to Somnia Testnet');
  } catch (switchError: any) {
    console.warn('Failed to switch to Somnia Testnet:', switchError.message);
    // Продолжаем подключение даже если переключение не удалось
  }
  
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
    // Пытаемся автоматически переключиться на нужную сеть
    try {
      await switchToSomniaTestnet();
      console.log('Successfully switched to Somnia Testnet during transaction');
    } catch (switchError: any) {
      console.warn('Failed to switch network during transaction:', switchError.message);
      // Не блокируем транзакцию, но предупреждаем пользователя
      throw new Error(`Please switch to Somnia Testnet in MetaMask. Current network: ${chainId}`);
    }
  }
}
