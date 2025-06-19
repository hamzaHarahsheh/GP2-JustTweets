import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderUsername?: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  timestamp: string;
  isRead: boolean;
}

export interface ChatListItem {
  id: string;
  otherUser: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  lastMessage?: Message;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface ChatMessagesResponse {
  content: Message[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

class ChatServiceClass {
  private requestDeduplication = new Map<string, Promise<any>>();

  private async makeRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.requestDeduplication.has(key)) {
      return this.requestDeduplication.get(key) as Promise<T>;
    }

    const promise = requestFn().finally(() => {
      this.requestDeduplication.delete(key);
    });

    this.requestDeduplication.set(key, promise);
    return promise;
  }

  async createOrGetChat(otherUserId: string): Promise<ChatListItem> {
    const key = `createChat_${otherUserId}`;
    
    return this.makeRequest(key, async () => {
      if (this.requestDeduplication.has(key)) {
        return this.requestDeduplication.get(key);
      }

      const response = await axios.post(
        `${API_BASE_URL}/chat/create/${otherUserId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    });
  }

  async getUserChats(): Promise<ChatListItem[]> {
    const response = await axios.get(`${API_BASE_URL}/chat/list`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data as ChatListItem[];
  }

     async getChatMessages(
     chatId: string, 
     page: number = 0, 
     size: number = 50
   ): Promise<ChatMessagesResponse> {
     const response = await axios.get(
       `${API_BASE_URL}/chat/${chatId}/messages`,
       {
         params: { page, size },
         headers: {
           'Authorization': `Bearer ${getAuthToken()}`,
           'Content-Type': 'application/json'
         }
       }
     );

     return response.data as ChatMessagesResponse;
   }

     async sendMessage(
     chatId: string, 
     content: string, 
     type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT'
   ): Promise<Message> {
     const requestData = {
       content: content.trim(),
       type
     };

     const response = await axios.post(
       `${API_BASE_URL}/chat/${chatId}/send`,
       requestData,
       {
         headers: {
           'Authorization': `Bearer ${getAuthToken()}`,
           'Content-Type': 'application/json'
         }
       }
     );

     return response.data as Message;
   }

  async markAsRead(chatId: string): Promise<void> {
    await axios.put(
      `${API_BASE_URL}/chat/${chatId}/read`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  async deleteMessage(messageId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/chat/message/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getTotalUnreadCount(): Promise<number> {
    try {
      const chats = await this.getUserChats();
      return chats.reduce((total, chat) => total + chat.unreadCount, 0);
    } catch (error) {
      console.error('Error fetching total unread count:', error);
      return 0;
    }
  }
}

export const chatService = new ChatServiceClass(); 