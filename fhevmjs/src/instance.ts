// src/instance.ts
import { FhevmInstanceConfig } from "./types";

export function createInstance(config: FhevmInstanceConfig) {
  const { publicKey, chainId, kmsAddress } = config;

  if (!kmsAddress || typeof kmsAddress !== "string") {
    throw new Error("KMS contract address is not valid or empty");
  }

  if (!chainId || typeof chainId !== "number") {
    throw new Error("Chain ID is not valid or empty");
  }

  return {
    encrypt32(value: number) {
      const buf = Buffer.alloc(32);               // 32 байта
      buf.writeUInt32BE(value, 28);               // пишем число в конец
      return {
        ciphertext: new Uint8Array(buf),          // ✅ возвращаем байты
        kmsAddress,
        chainId,
        publicKey,
      };
    },
  };
}
