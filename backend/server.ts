import express from "express";
import cors from "cors";
import { createInstance, encrypt32 } from "./fhevm";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const kmsAddress = "0x0000000000000000000000000000000000000043"; // KMS Sepolia
const chainId = 11155111;

let fheInstance: Awaited<ReturnType<typeof createInstance>>;

async function init() {
  fheInstance = await createInstance({ kmsAddress, chainId });
  console.log("✅ FHE instance ready");
}

app.post("/encryptTarget", async (req, res) => {
  try {
    const { value } = req.body;
    if (typeof value !== "number" || isNaN(value)) {
      return res.status(400).json({ error: "Invalid number" });
    }

    const encrypted = await encrypt32(fheInstance, value);
    console.log("✅ encrypted result (target):", encrypted);
    res.json({ encrypted });
  } catch (e) {
    console.error("❌ encryptTarget error:", e);
    res.status(500).json({ error: "Encryption failed" });
  }
});

app.post("/encryptGuess", async (req, res) => {
  try {
    const { value } = req.body;
    if (typeof value !== "number" || isNaN(value)) {
      return res.status(400).json({ error: "Invalid number" });
    }

    const encrypted = await encrypt32(fheInstance, value);
    console.log("✅ encrypted result (guess):", encrypted);
    res.json({ encrypted, proof: "0x00" }); // можно передать proof если нужно
  } catch (e) {
    console.error("❌ encryptGuess error:", e);
    res.status(500).json({ error: "Encryption failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎯 FHELottery Encryptor API running on http://0.0.0.0:${PORT}`);
  init();
});

