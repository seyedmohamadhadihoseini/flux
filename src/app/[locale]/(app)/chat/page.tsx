import { useTranslations } from 'next-intl';

export default function ChatIndexPage() {
  const t = useTranslations('chat.sidebar'); // یا یک کلید general

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      color: 'var(--text-muted)',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        fontSize: '4rem', 
        opacity: 0.2
      }}>
        ✨
      </div>
      <h3>چتی را برای شروع انتخاب کنید</h3>
    </div>
  );
}