import { Component, OnInit, OnDestroy, signal, computed, effect } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { SocketService } from "../../services/socket.service";
import { AppUiStateService } from "../../services/ui-state.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat implements OnInit, OnDestroy {

  /* ================= STATE ================= */

  chats = signal<any[]>([]);
  selectedChat = signal<any | null>(null);
  messages = signal<any[]>([]);

  newMessage = signal('');
  isTyping = signal(false);

  currentUserId = '';

  /* ================= COMPUTED ================= */

  isMobile = computed(() => window.innerWidth < 768);

  /* ================= INIT ================= */

  constructor(
    private chatService: ChatService,
    private socket: SocketService,
    private appUiStateService: AppUiStateService
  ) { }

  async ngOnInit() {
    this.currentUserId = this.appUiStateService.currentUser()._id;

    this.socket.connect(this.currentUserId);

    await this.loadChats();

    this.listenSocketEvents();
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  /* ================= LOAD CHATS ================= */

  async loadChats() {
    try {
      const res = await this.chatService.getChats();

      const mapped = res.map((convo: any) => {

        let name = convo.name;

        if (convo.type === 'direct') {
          const otherUser = convo.members.find(
            (m: any) => m._id !== this.currentUserId
          );
          name = otherUser?.name || 'Unknown';
        }

        return {
          id: convo._id,
          name,
          lastMessage: convo.lastMessage?.content || 'Start conversation...',
          unreadCount: 0,
          time: convo.updatedAt
        };
      });

      this.chats.set(mapped);
      console.log('chats', this.chats());

    } catch (err) {
      console.error("Load chats error:", err);
    }
  }

  /* ================= SOCKET EVENTS ================= */

  listenSocketEvents() {

    /* ===== RECEIVE MESSAGE ===== */
    this.socket.receiveMessage().subscribe((msg) => {

      // update messages
      if (msg.conversationId === this.selectedChat()?.id) {

        this.messages.update(prev => [...prev, msg]);
        this.scrollToBottom();

        // mark as read
        if (msg.senderId !== this.currentUserId) {
          this.socket.markRead(msg._id, this.currentUserId);
        }
      }

      this.updateChatPreview(msg);
    });

    /* ===== TYPING ===== */
    this.socket.onTyping().subscribe(() => {

      this.isTyping.set(true);

      setTimeout(() => this.isTyping.set(false), 1500);
    });

    /* ===== READ RECEIPT ===== */
    this.socket.onMessageRead().subscribe(({ messageId, userId }) => {

      this.messages.update(prev =>
        prev.map(msg =>
          msg._id === messageId
            ? { ...msg, readBy: [...(msg.readBy || []), userId] }
            : msg
        )
      );

    });
  }

  /* ================= SELECT CHAT ================= */

  async selectChat(chat: any) {

    this.selectedChat.set(chat);
    this.messages.set([]);

    try {
      this.socket.joinConversation(chat.id, this.currentUserId);

      const res = await this.chatService.getMessages(chat.id);

      this.messages.set(res);

      // mark all read
      res.forEach((msg: any) => {
        if (msg.senderId !== this.currentUserId) {
          this.socket.markRead(msg._id, this.currentUserId);
        }
      });

      this.scrollToBottom();

    } catch (err) {
      console.error("Select chat error:", err);
    }
  }

  /* ================= SEND MESSAGE ================= */

  onSendMessage() {

    const content = this.newMessage().trim();
    const chat = this.selectedChat();

    if (!content || !chat) return;

    this.socket.sendMessage({
      conversationId: chat.id,
      senderId: this.currentUserId,
      content
    });

    this.scrollToBottom();

    this.newMessage.set('');
  }

  /* ================= CHAT LIST UPDATE ================= */

  updateChatPreview(msg: any) {

    this.chats.update(prev => {

      const index = prev.findIndex(c => c.id === msg.conversationId);

      if (index === -1) return prev;

      const updatedChat = {
        ...prev[index],
        lastMessage: msg.content,
        time: new Date()
      };

      return [
        updatedChat,
        ...prev.filter(c => c.id !== updatedChat.id)
      ];
    });
  }

  /* ================= TYPING ================= */

  private typingTimeout: any;

  onTyping() {
    if (!this.selectedChat()) return;

    this.socket.typing({
      conversationId: this.selectedChat().id,
      userId: this.currentUserId
    });

    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      this.socket.stopTyping({
        conversationId: this.selectedChat().id,
        userId: this.currentUserId
      });
    }, 1000);
  }

  /* ================= UI ================= */

  scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector('.chat-messages');
      el?.scrollTo(0, el.scrollHeight);
    });
  }

  getMessageStatus(msg: any): 'sent' | 'delivered' | 'read' | 'none' {

    const isSender = msg.senderId === this.currentUserId;

    if (!isSender) return 'none';

    if (msg.readBy?.length > 1) return 'read';
    if (msg.deliveredTo?.length > 1) return 'delivered';

    return 'sent';
  }
}