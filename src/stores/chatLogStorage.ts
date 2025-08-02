const CHAT_LOG_KEY_PREFIX = "chatLog_case_";

export function getChatLog(caseIndex: number): any[] | null {
  const raw = localStorage.getItem(`${CHAT_LOG_KEY_PREFIX}${caseIndex}`);
  return raw ? JSON.parse(raw) : null;
}

export function setChatLog(caseIndex: number, chats: any[]) {
  localStorage.setItem(`${CHAT_LOG_KEY_PREFIX}${caseIndex}`, JSON.stringify(chats));
}

export function clearChatLog(caseIndex: number) {
  localStorage.removeItem(`${CHAT_LOG_KEY_PREFIX}${caseIndex}`);
}