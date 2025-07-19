# 🎰 Zama FHE Lottery — Fully Homomorphic Encryption dApp

Zama FHE Lottery is a decentralized application built on FHEVM, where participants submit encrypted numbers and the winner is the one closest to a secret encrypted target number.

## ✨ Features

- 🔐 Fully private guesses (even the contract can't see them)
- 🎯 Encrypted target is set by the contract owner
- 🎲 Users submit encrypted numbers via frontend
- 🏆 Winner is manually selected (automatic logic can be added)
- 📋 Player list view
- ♻️ Reset Target button

## 🧱 Stack

- Solidity + FHEVM (Zama)
- React + Vite + ethers.js v6
- Express.js backend for encryption using `fhevmjs`
- Hardhat for contract deployment
- Sepolia Testnet

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourname/zama-fhe-lottery.git
cd zama-fhe-lottery
```

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure environment variables

Create `.env` in the root and in `frontend/`:

#### `.env`

```dotenv
PRIVATE_KEY=your_private_key
INFURA_API_KEY=your_infura_key
```

#### `frontend/.env`

```dotenv
VITE_CONTRACT_ADDRESS=0xB276bB4381d1e695E86d2d421bE74610AcFc2533
VITE_BACKEND_URL=http://localhost:3001
```

### 4. Run backend

```bash
cd backend
npm start
```

### 5. Run frontend

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open in your browser:  
📍 http://localhost:5173

---

## 🛠 Contract

Deployed to Sepolia:

```
Address: 0xB276bB4381d1e695E86d2d421bE74610AcFc2533
```

---

## 🧠 Author

Developed as a demo dApp for the Zama FHEVM showcase.
