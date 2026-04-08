import { Component, OnInit, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { ConversationService } from "../../services/chat.service";
import { UserService } from "../../services/user.service";
import { ModalService } from "../../services/modal.service";
import { AppUiStateService, ToastrType } from "../../services/ui-state.service";

import { ContactModal } from "../../components/contact-modal/contact-modal";
import { User } from "../../interfaces/user.interface";

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

  currentUserId = '';

  /* ================= COMPUTED ================= */

  isMobile = computed(() => window.innerWidth < 768);

  /* ================= INIT ================= */

  constructor(
    private conversationService: ConversationService,
    private userService: UserService,
    private appUiStateService: AppUiStateService,
    private modal: ModalService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.currentUserId = this.appUiStateService.currentUser()._id;

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
        time: c.updatedAt
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
      this.appUiStateService.showToastr(
        err.message || 'Failed to load users',
        ToastrType.ERROR
      );
    }
  }

  /* ================= SELECT CHAT ================= */

  async selectChat(chat: any) {

    if (!chat?._id) return;

    // Prevent unnecessary reload
    if (this.selectedChat()?._id === chat._id) return;

    this.selectedChat.set(chat);
    this.messages.set([]);
    this.isLoadingMessages.set(true);

    try {
      const res = await this.conversationService.getMessages(chat._id);

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

  async onSendMessage() {

    // const content = this.newMessage().trim();
    // const chat = this.selectedChat();

    // if (!content || !chat?._id) return;

    // try {
    //   const payload = {
    //     conversationId: chat._id,
    //     senderId: this.currentUserId,
    //     content
    //   };

    //   const res = await this.conversationService.sendMessage(payload);

    //   // Append message locally
    //   this.messages.update(prev => [...prev, res.message]);

    //   // Update chat preview
    //   this.updateChatPreview(chat._id, content);

    //   this.newMessage.set('');
    //   this.scrollToBottom();

    // } catch (err) {
    //   console.error("Send message error:", err);
    //   this.appUiStateService.showToastr(
    //     'Failed to send message',
    //     ToastrType.ERROR
    //   );
    // }
  }

  /* ================= UPDATE CHAT LIST ================= */

  updateChatPreview(conversationId: string, message: string) {

    this.conversations.update(prev => {

      const index = prev.findIndex(c => c._id === conversationId);
      if (index === -1) return prev;

      const updated = {
        ...prev[index],
        lastMessage: message,
        time: new Date()
      };

      return [
        updated,
        ...prev.filter(c => c._id !== conversationId)
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