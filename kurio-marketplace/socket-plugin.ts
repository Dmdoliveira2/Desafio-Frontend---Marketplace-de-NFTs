import type { Plugin } from "vite";
import { Server } from "socket.io";

export function socketPlugin(): Plugin {
  return {
    name: "socket-io-plugin",
    configureServer(server) {
      const io = new Server(server.httpServer!, {
        cors: { origin: "*" },
      });

      io.on("connection", (socket) => {
        console.log("[Socket.IO] cliente conectado:", socket.id);

        // Simula alteração de preço/disponibilidade quando o cliente pede
        socket.on("simulate:nft-update", (nftId: string) => {
          io.emit("nft.updated", {
            id: nftId,
            newPrice: +(Math.random() * 2 + 0.5).toFixed(2),
            available: Math.random() > 0.2,
            version: Date.now(),
          });
        });

        socket.on("simulate:order-update", (orderId: string) => {
          io.emit("order.updated", {
            id: orderId,
            status: Math.random() > 0.3 ? "confirmed" : "declined",
            version: Date.now(),
          });
        });
      });
    },
  };
}
