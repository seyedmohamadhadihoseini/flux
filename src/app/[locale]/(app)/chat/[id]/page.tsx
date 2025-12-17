import ChatWindow from '@/components/chat/ChatWindow';

export default async function ChatPage({ params }: { params: Promise<{ id: string }>; }) {
  // اینجا می‌توانید در آینده دیتای چت را از دیتابیس بگیرید
  const id  = (await params).id
  return <ChatWindow chatId={id} />;
}