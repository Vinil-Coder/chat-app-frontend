import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, from, takeUntil, switchMap, tap, filter } from "rxjs";

import { ConversationService } from "../../services/conversation.service";
import { UserService } from "../../services/user.service";
import { ModalService } from "../../services/modal.service";
import { SocketService } from "../../services/socket.service";
import { AppStateService } from "../../services/appstate.service";

import { ContactModal } from "../../components/contact-modal/contact-modal";
import { User } from "../../interfaces/user.interface";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat implements OnInit, OnDestroy {

  /* ================= STATE ================= */

  conversations = signal<any[]>([]);
  users = signal<User[]>([]);
  selectedChat = signal<any | null>(null);
  messages = signal<any[]>([]);

  newMessage = signal('');
  isLoadingMessages = signal(false);

  currentUserId = '';

  private destroy$ = new Subject<void>();

  /* ================= COMPUTED ================= */

  isMobile = computed(() => window.innerWidth < 768);

  constructor(
    private conversationService: ConversationService,
    private userService: UserService,
    private modal: ModalService,
    private router: Router,
    private socketService: SocketService,
    private appState: AppStateService
  ) { }

  /* ================= INIT ================= */

  ngOnInit() {

    // ensure socket exists
    if (!this.socketService.isConnected()) {
      this.socketService.connect();
    }

    this.currentUserId = this.appState.getUser()?._id || '';

    this.initData();
    this.listenToSocketEvents();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ================= INIT DATA ================= */

  initData() {
    this.userService.getRegisteredUsers()
      .pipe(
        tap(res => this.users.set(res.users || [])),
        switchMap(() => this.conversationService.getConversations()),
        tap(res => this.mapConversations(res.conversations || [])),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  mapConversations(conversations: any[]) {
    const mapped = conversations.map(c => ({
      _id: c._id,
      name: c.type === 'group'
        ? c.name
        : this.getChatUserName(c.participants),
      isOnline: this.checkIsUserOnline(c.participants),
      lastMessage: c.lastMessage?.content || '',
      participants: c.participants,
      time: c.updatedAt,
      isTyping: false,
      unreadCount: 0
    }));

    this.conversations.set(mapped);
  }

  /* ================= SOCKET LISTENERS ================= */
  listenToSocketEvents() {

    this.socketService.receiveMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.handleSocketEvent('message', res);
      });

    this.socketService.onTypingStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.handleSocketEvent('typing', res);
      });
  }

  private handleSocketEvent(eventType: 'message' | 'typing', payload: any) {

    switch (eventType) {

      case 'message':
        this.handleIncomingMessage(payload);
        break;

      case 'typing':
        this.handleTyping(payload);
        break;
    }
  }
  private handleIncomingMessage(res: any) {

    const activeChatId = this.selectedChat()?._id;
    const isActiveChat = activeChatId === res.conversationId;
    const isSender = res.senderId === this.currentUserId;

    // 1. Always update preview (safe)
    this.updateChatPreview(res.conversationId, res.content);

    // 2. If sender → ONLY update UI if chat is open
    if (isSender) {
      if (isActiveChat) {
        this.messages.update(prev => [...prev, res]);
        this.scrollToBottom();
      }
      return; // IMPORTANT STOP HERE
    }

    // 3. Receiver logic
    if (isActiveChat) {
      this.messages.update(prev => [...prev, res]);
      this.scrollToBottom();
      return;
    }

    // 4. Receiver not in chat → unread
    this.incrementUnreadCount(res.conversationId);
  }

  private handleTyping(res: any) {

    this.conversations.update(convos =>
      convos.map(c =>
        c._id === res.conversationId
          ? { ...c, isTyping: res.typing }
          : c
      )
    );
  }



  incrementUnreadCount(conversationId: string) {

    this.conversations.update(convos =>
      convos.map(c =>
        c._id === conversationId
          ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
          : c
      )
    );

    console.log('count', this.conversations());
  }

  /* ================= SELECT CHAT ================= */

  selectChat(conversation: any) {

    if (!conversation?._id) return;
    if (this.selectedChat()?._id === conversation._id) return;

    this.socketService.joinConversation(conversation._id);

    this.selectedChat.set(conversation);

    this.conversations.update(convos =>
      convos.map(c =>
        c._id === conversation._id
          ? { ...c, unreadCount: 0 }
          : c
      )
    );

    this.messages.set([]);
    this.isLoadingMessages.set(true);

    this.conversationService.getMessages(conversation._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.messages.set(res.messages || []);
          this.scrollToBottom();
        },
        error: () => this.messages.set([]),
        complete: () => this.isLoadingMessages.set(false)
      });
  }

  /* ================= TYPING ================= */

  private typingTimeout: any;

  onTyping() {
    const conversationId = this.selectedChat()?._id;
    if (!conversationId) return;

    this.socketService.onTypingStart(conversationId);

    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      this.socketService.onTypingStop(conversationId);
    }, 5000); // FIXED
  }

  /* ================= SEND MESSAGE ================= */

  onSendMessage() {

    const content = this.newMessage().trim();
    const convo = this.selectedChat();

    if (!content || !convo?._id) return;

    this.socketService.sendMessage({
      conversationId: convo._id,
      senderId: this.currentUserId,
      content
    });

    this.newMessage.set('');
  }

  /* ================= HELPERS ================= */

  getChatUserName(participants: any[]) {
    return participants.find(p => p._id !== this.currentUserId)?.name || '';
  }

  checkIsUserOnline(participants: any[]) {
    return participants.some(p => p._id !== this.currentUserId && p.isOnline);
  }

  updateChatPreview(conversationId: string, message: string) {
    this.conversations.update(convos => {
      const index = convos.findIndex(c => c._id === conversationId);
      if (index === -1) return convos;

      const updated = {
        ...convos[index],
        lastMessage: message,
        time: new Date()
      };

      return [updated, ...convos.filter(c => c._id !== conversationId)];
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector('.chat-messages');
      el?.scrollTo(0, el.scrollHeight);
    });
  }

  /* ================= CONTACT ================= */

  openContacts() {
    from(this.modal.open(ContactModal, {
      contacts: this.users()
    }))
      .pipe(
        filter(Boolean),
        switchMap((user: any) =>
          this.conversationService.createConversation({
            type: 'direct',
            receiverId: user._id,
            name: user.name
          })
        ),
        tap((res: any) => {
          this.addConversationIfMissing(res.conversation);
          this.selectChat(res.conversation);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  addConversationIfMissing(convo: any) {
    if (this.conversations().some(c => c._id === convo._id)) return;

    this.conversations.update(prev => [
      {
        _id: convo._id,
        name: convo.name,
        lastMessage: '',
        time: convo.updatedAt
      },
      ...prev
    ]);
  }

  openCreateGroup() {
    this.router.navigate(['/groups']);
  }
}