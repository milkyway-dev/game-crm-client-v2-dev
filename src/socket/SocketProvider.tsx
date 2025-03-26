"use client";

import {
  addPlayer,
  enterGame,
  exitGame,
  removePlayer,
  updateSpin,
} from "@/redux/features/activeUsersSlice";
import { setUsercredit } from "@/redux/features/userSlice";
import { CurrentGame, Events, EventType } from "@/utils/Types";
import { config } from "@/utils/config";
import { useAppDispatch } from "@/utils/hooks";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{
  token: string;
  children: React.ReactNode;
}> = ({ token, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      const socketInstance = io(`${config?.server}/control`, {
        auth: { token },
        transports: ["websocket"],
      });
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
      });

      socketInstance.on("data", (data: any) => {
        switch (data.type) {
          case Events.CONTROL_CREDITS:
            dispatch(setUsercredit(data?.payload?.credits == null ? "Infinite" : data?.payload?.credits))
            break;

          case Events.PLAYGROUND_ENTER:
            handleEnteredPlatform(data.payload);
            break;

          case Events.PLAYGROUND_EXIT:
            handleExitedPlatform(data.payload);
            break;

          case Events.PLAYGROUND_GAME_ENTER:
            handleEnteredGame(data.payload);
            break;

          case Events.PLAYGROUND_GAME_EXIT:
            console.log("PLAYGROUND GAME XIT : ", data.payload)
            handleExitedGame(data.payload);
            break;

          case Events.PLAYGROUND_GAME_SPIN:
            handleUpdatedSpin(data.payload);
            break;

          // {
          //   "username": "test",
          //   "status": "active",
          //   "currentCredits": 4787.91,
          //   "platformId": null,
          //   "managerName": "agent@RNG",
          //   "entryTime": "2025-03-20T08:31:45.492Z",
          //   "exitTime": null,
          //   "currentRTP": 0,
          //   "currentGame": null,
          //   "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
          // }

          case Events.PLAYGROUND_ALL:
            data.payload.forEach((player: any) => {
              console.log("Plauyer : ", player)
              dispatch(
                addPlayer({
                  playerId: player.playerId,
                  status: player?.status,
                  initialCredits: Number(player.initialCredits),
                  currentCredits: Number(player.currentCredits),
                  managerName: player.managerName,
                  entryTime: new Date(player.entryTime),
                  exitTime: player.exitTime ? new Date(player.exitTime) : null,
                  currentRTP: player.currentRTP,
                  currentGame: player.currentGame || {},
                })
              );
            });
            break;

          default:
        }
      });

      socketInstance.on("error", (error) => {
        toast.remove();
        toast.error(`Error from server: ${error.message}`);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token]);


  const handleEnteredPlatform = (payload: any) => {
    const {
      playerId,
      managerName,
      initialCredits,
      currentCredits,
      entryTime,
      exitTime,
      currentRTP,
      currentGame,
    } = payload;

    dispatch(
      addPlayer({
        playerId,
        status,
        managerName,
        initialCredits,
        currentCredits,
        entryTime: new Date(entryTime),
        exitTime: exitTime ? new Date(exitTime) : null,
        currentRTP,
        currentGame,
      })
    );
  };

  const handleExitedPlatform = (payload: any) => {
    const { playerId } = payload;
    dispatch(removePlayer({ playerId }));
  };

  const handleEnteredGame = (payload: any) => {
    const {
      playerId,
      gameId,
      gameName,
      sessionId,
      entryTime,
      exitTime,
      creditsAtEntry,
      creditsAtExit,
      totalSpins,
      totalBetAmount,
      totalWinAmount,
      spinData,
      sessionDuration,
    } = payload;

    dispatch(
      enterGame({
        playerId,
        gameId,
        gameName,
        sessionId,
        entryTime: new Date(entryTime), // Pass Date object directly
        exitTime: exitTime ? new Date(exitTime) : null, // Keep as Date or null
        creditsAtEntry,
        creditsAtExit,
        totalSpins,
        totalBetAmount,
        totalWinAmount,
        spinData,
        sessionDuration,
      })
    );

  };



  const handleExitedGame = (payload: any) => {
    const { playerId } = payload;
    dispatch(exitGame({ playerId, gameId: payload.gameId }));
  };

  const handleUpdatedSpin = (summary: CurrentGame) => {
    dispatch(updateSpin(summary)); // Use the full payload to ensure all fields are updat
  };



  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};