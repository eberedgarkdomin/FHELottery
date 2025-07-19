import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./FHELotteryABI.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>();
  const [contract, setContract] = useState<any>();
  const [value, setValue] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [winner, setWinner] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [targetSet, setTargetSet] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const prov = new ethers.BrowserProvider(window.ethereum);
      const signer = await prov.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      setProvider(prov);
      setSigner(signer);
      setContract(contract);

      try {
        const target = await contract.targetSet();
        setTargetSet(target);
      } catch (e) {
        console.error("Failed to read targetSet", e);
      }
    };
    init();
  }, []);

  const handleEncrypt = async (value: string) => {
    const res = await fetch(`${backendURL}/encryptTarget`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: Number(value) }),
    });
    const data = await res.json();
    return data.encrypted;
  };

  const handleSetTarget = async () => {
    try {
      const encrypted = await handleEncrypt(value);
      const tx = await contract.setTarget(encrypted);
      await tx.wait();
      setTargetSet(true);
      setMessage("✅ Target has been set.");
      setValue("");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleSubmitGuess = async () => {
    try {
      const encrypted = await handleEncrypt(value);
      const proof = "0x00"; // placeholder if not used
      const tx = await contract.submitGuess(encrypted, proof);
      await tx.wait();
      setMessage("✅ Guess submitted!");
      setValue("");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleSetWinner = async () => {
    const winnerAddress = prompt("Enter winner address:");
    if (!winnerAddress) return;
    try {
      const tx = await contract.setWinner(winnerAddress);
      await tx.wait();
      setMessage("✨ Winner has been set.");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleGetWinner = async () => {
    try {
      const result = await contract.getWinner();
      setWinner(result);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleGetPlayers = async () => {
    try {
      const result = await contract.getPlayers();
      setPlayers(result);
      const isSet = await contract.targetSet();
      setTargetSet(isSet);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleResetTarget = async () => {
    try {
      const tx = await contract.resetTarget();
      await tx.wait();
      setTargetSet(false);
      setMessage("♻ Target has been reset.");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial" }}>
      <h1>🎰 Zama FHE Lottery</h1>

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter number (1–100)"
        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: 10, flexWrap: "wrap" }}>
        <button onClick={handleSetTarget}>🎯 Set Target (Admin)</button>
        <button onClick={handleSubmitGuess}>🎲 Submit Guess</button>
        <button onClick={handleSetWinner}>🧍 Set Winner (manual)</button>
        <button onClick={handleGetWinner}>🏆 Get Winner</button>
        <button onClick={handleGetPlayers}>🗒 Show Players</button>
        {targetSet && <button onClick={handleResetTarget}>♻️ Reset Target</button>}
      </div>

      {message && (
        <p style={{ marginTop: 15, whiteSpace: "pre-wrap" }}>{message}</p>
      )}

      {players.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>🗒 Players</h3>
          <ul>
            {players.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {winner && (
        <div style={{ marginTop: 20 }}>
          <h3>🥇 Winner address:</h3>
          <p>{winner}</p>
        </div>
      )}
    </div>
  );
}
