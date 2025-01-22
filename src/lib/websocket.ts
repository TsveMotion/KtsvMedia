import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

interface Room {
  id: string;
  participants: Map<WebSocketClient, string>;
}

type MessageData = {
  roomId?: string;
  name?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  target?: string;
  sender?: string;
  userId?: string;
};

interface WebSocketMessage {
  type: 'join' | 'leave' | 'offer' | 'answer' | 'ice-candidate' | 'participant-joined' | 'participant-left';
  data?: MessageData;
}

interface WebSocketClient extends WebSocket {
  isAlive: boolean;
  userId?: string;
  roomId?: string;
}

const rooms = new Map<string, Room>();

export function initializeWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    const client = ws as WebSocketClient;
    client.isAlive = true;
    let currentRoom: Room | null = null;

    client.on('pong', () => {
      client.isAlive = true;
    });

    client.on('message', async (message: string) => {
      try {
        const data: WebSocketMessage = JSON.parse(message);
        const messageData = data.data;

        if (!messageData) {
          console.warn('Message received without data');
          return;
        }

        switch (data.type) {
          case 'join': {
            const { roomId, name } = messageData;
            if (roomId && name) {
              if (!rooms.has(roomId)) {
                rooms.set(roomId, {
                  id: roomId,
                  participants: new Map([[client, name]])
                });
              }
              currentRoom = rooms.get(roomId)!;
              currentRoom.participants.set(client, name);

              // Notify other participants
              currentRoom.participants.forEach((participantName, participant) => {
                if (participant !== client) {
                  participant.send(JSON.stringify({
                    type: 'participant-joined',
                    data: { name }
                  }));
                }
              });
            }
            break;
          }

          case 'offer': {
            const { offer } = messageData;
            if (currentRoom && offer) {
              currentRoom.participants.forEach((participantName, participant) => {
                if (participant !== client) {
                  participant.send(JSON.stringify({
                    type: 'offer',
                    data: { offer }
                  }));
                }
              });
            }
            break;
          }

          case 'answer': {
            const { answer } = messageData;
            if (currentRoom && answer) {
              currentRoom.participants.forEach((participantName, participant) => {
                if (participant !== client) {
                  participant.send(JSON.stringify({
                    type: 'answer',
                    data: { answer }
                  }));
                }
              });
            }
            break;
          }

          case 'ice-candidate': {
            const { candidate } = messageData;
            if (currentRoom && candidate) {
              currentRoom.participants.forEach((participantName, participant) => {
                if (participant !== client) {
                  participant.send(JSON.stringify({
                    type: 'ice-candidate',
                    data: { candidate }
                  }));
                }
              });
            }
            break;
          }

          case 'leave':
            if (currentRoom) {
              const participantName = currentRoom.participants.get(client);
              currentRoom.participants.delete(client);

              if (currentRoom.participants.size === 0) {
                rooms.delete(currentRoom.id);
              } else {
                currentRoom.participants.forEach((name, participant) => {
                  participant.send(JSON.stringify({
                    type: 'participant-left',
                    data: { name: participantName }
                  }));
                });
              }
            }
            break;
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error handling WebSocket message:', error.message);
        }
      }
    });

    client.on('close', () => {
      if (currentRoom) {
        const participantName = currentRoom.participants.get(client);
        currentRoom.participants.delete(client);

        if (currentRoom.participants.size === 0) {
          rooms.delete(currentRoom.id);
        } else {
          currentRoom.participants.forEach((name, participant) => {
            participant.send(JSON.stringify({
              type: 'participant-left',
              data: { name: participantName }
            }));
          });
        }
      }
    });
  });

  const interval = setInterval(() => {
    for (const ws of wss.clients) {
      const client = ws as WebSocketClient;
      if (!client.isAlive) {
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    }
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
}
