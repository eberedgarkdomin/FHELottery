import { createInstance as baseCreateInstance } from "../fhevmjs/dist/node.js";
import type { Instance } from "../fhevmjs/dist/node.js";

export async function createInstance({
  kmsAddress,
  chainId,
}: {
  kmsAddress: string;
  chainId: number;
}): Promise<Instance> {
  return await baseCreateInstance({ kmsAddress, chainId });
}

export async function encrypt32(instance: Instance, value: number): Promise<`0x${string}`> {
  const encrypted = await instance.encrypt32(value);

  // ✅ Если это уже строка — возвращаем как есть
  if (typeof encrypted === "string" && encrypted.startsWith("0x")) {
    return encrypted;
  }

  // ✅ Если это объект с .serialize() — используем его
  if (typeof encrypted.serialize === "function") {
    return encrypted.serialize();
  }

  // ✅ Если это объект с .ciphertext — сериализуем вручную
  if (encrypted.ciphertext && typeof Buffer !== "undefined") {
    const hex = Buffer.from(encrypted.ciphertext).toString("hex");
    return `0x${hex}`;
  }

  throw new Error("Unsupported encrypted format returned from encrypt32()");
}
