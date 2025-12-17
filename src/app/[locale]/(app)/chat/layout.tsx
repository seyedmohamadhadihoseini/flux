import ChatSidebar from '@/components/chat/Sidebar';
import ChatLayoutClient from '@/components/chat/ChatLayoutClient';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    // پاس دادن سایدبار به عنوان پراپ برای کنترل بهتر
    <ChatLayoutClient sidebar={<ChatSidebar />}>
      {children}
    </ChatLayoutClient>
  );
}