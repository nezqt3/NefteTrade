const CHAT_ACCESS_KEY = 'tg-chat-access';
const CHAT_ACCESS_EVENT = 'tg-chat-access-change';

export function hasChatAccess(): boolean {
  return localStorage.getItem(CHAT_ACCESS_KEY) === 'true';
}

export function unlockChatAccess(): void {
  localStorage.setItem(CHAT_ACCESS_KEY, 'true');
  window.dispatchEvent(new Event(CHAT_ACCESS_EVENT));
}

export function subscribeChatAccess(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CHAT_ACCESS_KEY) {
      listener();
    }
  };

  window.addEventListener(CHAT_ACCESS_EVENT, listener);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(CHAT_ACCESS_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
}
