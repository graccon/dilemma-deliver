const CHAT_LOG_KEY_PREFIX = "chatLog_";

export function getChatLog(caseIndex: String): any[] | null {
  const raw = localStorage.getItem(`${CHAT_LOG_KEY_PREFIX}${caseIndex}`);
  return raw ? JSON.parse(raw) : null;
}

export function setChatLog(caseIndex: String, chats: any[]) {
  localStorage.setItem(`${CHAT_LOG_KEY_PREFIX}${caseIndex}`, JSON.stringify(chats));
}

export function clearChatLog(caseIndex: String) {
  localStorage.removeItem(`${CHAT_LOG_KEY_PREFIX}${caseIndex}`);
}