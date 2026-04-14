import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, from, takeUntil, switchMap, tap, filter, combineLatest, EMPTY } from "rxjs";

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
    private appState: AppStateService,
    private route: ActivatedRoute
  ) { }

  /* ================= INIT ================= */

  ngOnInit() {

    // ensure socket exists
    if (!this.socketService.isConnected()) {
      this.socketService.connect();
    }

    this.currentUserId = this.appState.getUser()?.id || '';

    console.log('online users on app state', this.appState.onlineUsers());

    this.initData();
    this.listenToSocketEvents();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ================= INIT DATA ================= */

  initData() {
    combineLatest([
      this.userService.getRegisteredUsers(),
      this.conversationService.getConversations(),
      this.conversationService.getUnreadMessages()
    ])
      .pipe(
        tap(([usersRes, convoRes, unreadMessages]) => {
          this.users.set(usersRes.users || []);
          this.mapConversations(convoRes.conversations || [], unreadMessages.unreadCountMap);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  mapConversations(conversations: any[], unreadMessages: any) {
    const mapped = conversations.map(c => ({
      id: c._id,
      name: c.type === 'group'
        ? c.name
        : this.getChatUserName(c.participants),
      type: c.type,
      isOnline: c.type === 'group'
        ? false
        : this.appState.isUserOnline(c.participants),

      lastMessage: c.lastMessage?.content || '',
      participants: c.participants,
      time: c.updatedAt,
      isTyping: false,

      unreadCount:
        unreadMessages?.[c._id]?.senderId !== this.currentUserId
          ? unreadMessages?.[c._id]?.count || 0
          : 0
    }));

    console.log('conversations mapped', conversations, unreadMessages);
    this.conversations.set(mapped);

    this.route.queryParamMap.subscribe(params => {
      const conversationId = params.get('conversationId');
      const conversation = this.conversations().find(c => c.id === conversationId);
      this.selectChat(conversation);
    });
  }

  /* ================= SELECT CHAT ================= */

  selectChat(conversation: any) {

    if (!conversation?.id) return;
    if (this.selectedChat()?.id === conversation.id) return;

    this.socketService.joinConversation(conversation.id);

    this.selectedChat.set(conversation);

    this.messages.set([]);
    this.isLoadingMessages.set(true);

    const unreadMessagesExists = this.selectedChat()?.unreadCount > 0;

    if (unreadMessagesExists) this.socketService.readMessage(this.selectedChat().id);

    this.conversations.update(convos =>
      convos.map(c =>
        c.id === conversation.id
          ? { ...c, unreadCount: 0 }
          : c
      )
    );

    this.conversationService.getMessages(conversation.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.messages.set(res.messages || []);
          this.scrollToBottom();
        },
        error: () => this.messages.set([]),
        complete: () => this.isLoadingMessages.set(false)
      });

    console.log('selected chat messages', this.messages());
  }

  /* ================= SEND MESSAGE ================= */

  onSendMessage() {

    const content = this.newMessage().trim();
    const convo = this.selectedChat();

    if (!content || !convo?.id) return;

    this.socketService.sendMessage({
      conversationId: convo.id,
      senderId: this.currentUserId,
      receiverIds: convo.participants.map((p: any) => p._id),
      content
    });

    this.newMessage.set('');
  }


  /* ================= SOCKET LISTENERS ================= */
  listenToSocketEvents() {

    this.socketService.onUserOnline()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => this.handleUserOnlineStatus(res));

    this.socketService.onUserOffline()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => this.handleUserOnlineStatus(res));

    this.socketService.onMessageReceived()
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => this.handleIncomingMessage(message));

    this.socketService.onMessageDelivered()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.handleDeliveredMessage(res));

    this.socketService.onMessagesRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.handleMessageRead(res));

    this.socketService.onTypingStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.handleTyping(res));
  }

  private handleIncomingMessage(message: any) {

    console.log('received message', message);

    // update conversation preview
    this.updateConversationPreview(message);

    // update message preview
    this.updateMessages(message);

    this.scrollToBottom();

    if (message.senderId === this.currentUserId) return;

    console.log('message sender and logged user are not same');

    this.socketService.deliverMessage(message._id)

    if (this.selectedChat()?.id === message.conversationId) {
      this.socketService.readMessage(message.conversationId)
    } else {
      this.incrementUnread(message.conversationId);
    }
  }

  private updateConversationPreview(message: any) {
    this.conversations.update(conversations =>
      conversations.map(c =>
        c.id === message.conversationId
          ? {
            ...c,
            lastMessage: message.content,
            time: message.createdAt
          }
          : c
      )
    );
  }

  private updateMessages(message: any) {
    this.messages.update(prev => [...prev, message]);
  }

  private incrementUnread(conversationId: string) {
    this.conversations.update(conversations =>
      conversations.map(c =>
        c.id === conversationId
          ? {
            ...c,
            unreadCount: (c.unreadCount || 0) + 1,
          }
          : c
      )
    );
  }

  private handleDeliveredMessage(event: any) {

    console.log('delivered event', event);

    const { ids, userId } = event;

    // Update all messages that are read
    this.messages.update(messages =>
      messages.map(msg =>
        ids.includes(msg._id)
          ? {
            ...msg,
            status: 'delivered',
            deliversTo: [...(msg.deliversTo || []), userId]
          }
          : msg
      )
    );

    console.log('after message delivered update', this.messages());

    this.scrollToBottom();
  }

  private handleMessageRead(event: any) {

    console.log('read event', event);

    const { ids, userId } = event;

    // Update message status only
    this.messages.update(messages =>
      messages.map(msg =>
        ids.includes(msg._id)
          ? {
            ...msg,
            status: 'read',
            isRead: true,
            readBy: msg.readBy?.includes(userId)
              ? msg.readBy
              : [...(msg.readBy || []), userId]
          }
          : msg
      )
    );

    console.log('after read update', this.messages());

    this.scrollToBottom();
  }

  private handleTyping(event: any) {

    const { conversationId, typing } = event;

    this.conversations.update(conversations =>
      conversations.map(c =>
        c.id === conversationId
          ? {
            ...c,
            isTyping: typing
          } : c
      )
    )

    if (this.selectedChat()) {
      this.selectedChat().isTyping = typing;
    }
  }

  private handleUserOnlineStatus(users: string[]) {
    console.log('user online event', users);
    this.appState.setOnlineUsers(users);
    console.log('online users on online event', this.appState.onlineUsers())
    this.updateUserOnlineStatus(users);
  }

  private updateUserOnlineStatus(users: string[]) {
    const currentUserId = this.currentUserId;

    this.conversations.update(conversations =>
      conversations.map(c => {

        if (c.type !== 'direct') return c;

        const participants = c.participants.filter((p: any) => p._id !== currentUserId);

        console.log('participants', participants);

        const isOnline = participants?.some(
          (p: any) => users.includes(p._id)
        );

        return isOnline ? { ...c, isOnline } : { ...c, isOnline: false };
      })
    );

    console.log('after status update', this.conversations());
  }

  /* ================= TYPING ================= */

  private typingTimeout: any;

  onTyping() {
    const conversationId = this.selectedChat()?.id;
    if (!conversationId) return;

    this.socketService.typingStart(conversationId);

    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      this.socketService.typingStop(conversationId);
    }, 1000); // FIXED
  }

  /* ================= HELPERS ================= */

  private findExistingConversation(userId: string) {
    return this.conversations().find(conv =>
      conv.type !== 'group' &&
      conv.participants.map((p: any) => p._id).includes(this.currentUserId) &&
      conv.participants.map((p: any) => p._id).includes(userId)
    );
  }

  getChatUserName(participants: any[]) {
    return participants.find(p => p._id !== this.currentUserId)?.name || '';
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

        switchMap((user: any) => {
          const existing = this.findExistingConversation(user._id);

          // If already exists → return it as observable
          if (existing) {
            this.selectChat(existing);
            return EMPTY; // stop pipeline
          }

          // Else create new
          return this.conversationService.createConversation({
            participants: [this.currentUserId, user._id]
          });
        }),

        tap((res: any) => {
          if (res?.conversation) {
            this.addConversationIfMissing(res.conversation);
          }
        }),

        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  addConversationIfMissing(c: any) {
    if (this.conversations().some(conv => conv.id === c._id)) return;

    this.conversations.update(prev => [
      {
        id: c._id,
        name: c.type === 'group'
          ? c.name
          : this.getChatUserName(c.participants),
        type: c.type,
        isOnline: c.type === 'group'
          ? false
          : this.appState.isUserOnline(c.participants),

        lastMessage: c.lastMessage?.content || '',
        participants: c.participants,
        time: c.updatedAt,
        isTyping: false,

        unreadCount: 0
      },
      ...prev
    ]);

    this.selectChat(this.conversations().find(conv => conv.id === c._id));
  }

  openCreateGroup() {
    this.router.navigate(['/groups']);
  }
}