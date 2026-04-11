import { Component, OnInit, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { ConversationService } from "../../services/chat.service";
import { UserService } from "../../services/user.service";
import { ModalService } from "../../services/modal.service";

import { ContactModal } from "../../components/contact-modal/contact-modal";
import { User } from "../../interfaces/user.interface";
import { SocketService } from "../../services/socket.service";
import { Observable } from "rxjs";
import { Conversation } from "../../interfaces/conversation.interface";
import { AppStateService } from "../../services/appstate.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat implements OnInit {

  /* ================= STATE ================= */

  conversations = signal<any[]>([]);
  users = signal<User[]>([]);

  selectedChat = signal<any | null>(null);
  messages = signal<any[]>([]);

  newMessage = signal('');
  isLoadingMessages = signal(false);
  isTyping = signal<boolean>(false);
  listOfUsersTyping = signal<{ userId: string, typing: boolean }[]>([]);

  currentUserId = '';

  /* ================= COMPUTED ================= */

  isMobile = computed(() => window.innerWidth < 768);

  /* ================= INIT ================= */

  constructor(
    private conversationService: ConversationService,
    private userService: UserService,
    private appState: AppStateService,
    private modal: ModalService,
    private router: Router,
    private socketService: SocketService
  ) { }

  async ngOnInit() {
    this.currentUserId = '';
    
    this.socketService.onTypingStatus().subscribe(
      (res: { userId: string; conversationId: string, typing: boolean }) => {
        console.log('typing status', res);
        this.conversations.update((conversations) => {
          const index = conversations.findIndex(con => con._id === res.conversationId);

          if (index == -1) return conversations;

          const conversation = conversations[index];
          conversation.isTyping = res.typing;

          return [...conversations, conversation];
        });

        console.log('updated conversations', this.conversations())
      }
    );

    await Promise.all([
      this.loadUsers(),
      this.loadConversations()
    ]);
  }

  /* ================= LOAD CONVERSATIONS ================= */

  async loadConversations() {
    try {
      const res = await this.conversationService.getConversations();

      const mapped = res.conversations.map((c: any) => ({
        _id: c._id,
        name: c.type === 'group' ? c.name : this.getChatUserName(c.participants),
        isOnline: c.type === 'group' ? c.participants?.some((p: any) => p.isOnline) : this.checkIsUserOnline(c.participants),
        lastMessage: c.lastMessage?.content || '',
        participants: c.participants,
        time: c.updatedAt,
        isTyping: false
      }));

      this.conversations.set(mapped);

    } catch (err) {
      console.error("Load conversations error:", err);
      this.conversations.set([]);
    }
  }

  getChatUserName(participants: any) {
    const user = participants?.find((u: any) => u._id !== this.currentUserId);
    return user?.name || '';
  }

  checkIsUserOnline(participants: any[]) {
    return participants.some((p: any) => p._id !== this.currentUserId && p.isOnline);
  }

  /* ================= LOAD USERS ================= */

  async loadUsers() {
    try {
      const res = await this.userService.getRegisteredUsers();
      this.users.set(res.users || []);
    } catch (err: any) {
      this.users.set([]);
    }
  }

  /* ================= SELECT CHAT ================= */

  async selectChat(conversation: any) {

    if (!conversation?._id) return;

    // Prevent unnecessary reload
    if (this.selectedChat()?._id === conversation._id) return;

    this.socketService.joinConversation(conversation._id, this.currentUserId);

    this.selectedChat.set(conversation);
    this.messages.set([]);
    this.isLoadingMessages.set(true);

    try {
      const res = await this.conversationService.getMessages(conversation._id);

      this.messages.set(res || []);

    } catch (err) {
      console.error("Select chat error:", err);
      this.messages.set([]);
    } finally {
      this.isLoadingMessages.set(false);
      this.scrollToBottom();
    }
  }

  /* ================= SEND MESSAGE ================= */
  typingTimeout: any;

  onTyping() {
    const conversationId = this.selectedChat()?._id;

    if (!conversationId) return;

    // Start typing
    this.socketService.onTypingStart(conversationId, this.currentUserId);

    // Clear previous timeout
    clearTimeout(this.typingTimeout);

    // Stop typing after 1 second of no input
    this.typingTimeout = setTimeout(() => {
      this.socketService.onTypingStop(conversationId, this.currentUserId);
    }, 50000000000000000);
  }

 isUserTyping(conversation: any) {
  const typingUsers = this.listOfUsersTyping();

  return conversation.participants.some((p: any) =>
    typingUsers.some(u => u.userId === p._id && u.typing)
  );
}

  async onSendMessage() {

    const content = this.newMessage().trim();
    const conversation = this.selectedChat();

    if (!content || !conversation?._id) return;

    try {
      const payload = {
        conversationId: conversation._id,
        senderId: this.currentUserId,
        content
      };

      this.socketService.sendMessage(payload);
      this.socketService.receiveMessage().subscribe({
        next: (res) => this.messages.update(prev => [...prev, res]),
        error: (error) => console.log(error)
      })

      this.newMessage.set('');
      this.scrollToBottom();

      this.updateChatPreview(conversation._id, content);

    } catch (err) {
      console.error("Send message error:", err);
    }
  }

  /* ================= UPDATE CHAT LIST ================= */

  updateChatPreview(conversationId: string, message: string) {

    this.conversations.update(conversation => {

      const index = conversation.findIndex(c => c._id === conversationId);
      if (index === -1) return conversation;

      const updated = {
        ...conversation[index],
        lastMessage: message,
        time: new Date()
      };

      return [
        updated,
        ...conversation.filter(c => c._id !== conversationId)
      ];
    });
  }

  /* ================= OPEN CONTACTS ================= */

  async openContacts() {

    try {
      const selectedUser = await this.modal.open(ContactModal, {
        contacts: this.users()
      });

      if (!selectedUser) return;

      const payload = {
        type: 'direct',
        receiverId: selectedUser._id,
        name: selectedUser.name
      };

      const res = await this.conversationService.createConversation(payload);

      const conversation = res.conversation;

      // Add to list if not exists
      this.addConversationIfMissing(conversation);

      // Select immediately
      await this.selectChat(conversation);

    } catch (err) {
      console.error("Open contacts error:", err);
    }
  }

  /* ================= ADD CONVERSATION ================= */

  addConversationIfMissing(convo: any) {

    const exists = this.conversations().some(c => c._id === convo._id);

    if (exists) return;

    const mapped = {
      _id: convo._id,
      name: convo.name,
      lastMessage: '',
      time: convo.updatedAt
    };

    this.conversations.update(prev => [mapped, ...prev]);
  }

  /* ================= UI ================= */

  scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector('.chat-messages');
      el?.scrollTo(0, el.scrollHeight);
    });
  }

  openCreateGroup() {
    this.router.navigate(['/groups']);
  }
}