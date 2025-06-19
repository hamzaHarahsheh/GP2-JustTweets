import { Stomp, CompatClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from './chatService';

class WebSocketService {
  private stompClient: CompatClient | null = null;
  private connected: boolean = false;
  private connecting: boolean = false;

  async connect(userId: string, onMessageReceived: (message: Message) => void): Promise<void> {
    if (this.connecting) {
      return;
    }

    if (this.connected) {
      return;
    }

    this.connecting = true;
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const token = localStorage.getItem('token');

      await this.checkBackendHealth();

      const socket = new SockJS('http://localhost:8081/ws');
      this.stompClient = Stomp.over(socket);

      this.stompClient.debug = () => {};

      await new Promise<void>((resolve, reject) => {
        this.stompClient!.connect(
          {
            'Authorization': `Bearer ${token}`,
            'X-User-ID': userId
          },
          (frame: any) => {
            this.connected = true;
            this.connecting = false;

            const subscriptions = [
              `/user/${userId}/queue/messages`,
              `/user/queue/messages`,
              `/topic/messages`
            ];

            subscriptions.forEach(subscription => {
              const sub = this.stompClient!.subscribe(subscription, (message) => {
                try {
                  if (message.body.includes('test') && !message.body.includes('"chatId"')) {
                    return;
                  }

                  const receivedMessage: Message = JSON.parse(message.body);
                  
                  if (onMessageReceived) {
                    onMessageReceived(receivedMessage);
                  }
                } catch (error) {
                }
              });
            });

            resolve();
          },
          (error: any) => {
            this.connected = false;
            this.connecting = false;
            reject(error);
          }
        );

        this.stompClient!.onDisconnect = () => {
          this.connected = false;
          this.connecting = false;
        };

        this.stompClient!.onStompError = (frame) => {
          this.connected = false;
          this.connecting = false;
          reject(new Error(`STOMP error: ${frame.headers['message']}`));
        };
      });

    } catch (error) {
      this.connected = false;
      this.connecting = false;
      throw error;
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.stompClient = null;
      this.connected = false;
      this.connecting = false;
    }
  }

  testConnection(): void {
    if (this.stompClient && this.connected) {
      this.stompClient.send('/app/test', {}, JSON.stringify({
        test: 'connection-test',
        userId: localStorage.getItem('userId'),
        timestamp: new Date().toISOString()
      }));
    }
  }

  async forceReconnect(userId: string, onMessageReceived: (message: Message) => void): Promise<void> {
    this.disconnect();
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.connect(userId, onMessageReceived);
  }

  isConnected(): boolean {
    return this.connected;
  }

  async checkBackendHealth(): Promise<boolean> {
    const endpoints = [
      'http://localhost:8081/ws/info',
      'http://localhost:8081/api/chat/list'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok || response.status === 404) {
          return true;
        }
      } catch (error) {
      }
    }

    return false;
  }
}

export const webSocketService = new WebSocketService(); 