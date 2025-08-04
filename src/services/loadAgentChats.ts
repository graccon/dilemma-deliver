import Papa from "papaparse";
import agentChatsCsv from "../assets/data/agentChats.csv?url";
import { agentMessageMap, MessageGroup, type MessageGroupKey } from "../models/agentMessageMap";
import { MessageGroupConfigMap } from "../models/messageGroupConfig";

export interface AgentChat {
  from: string;
  to: string;
  type: "talk" | "reply";
  message: string;
  liked?: boolean;
}

export interface AgentChatRow {
  case: string;
  turn: string;
  stat_to_me: string;
  rule_to_me: string;
  narr_to_me: string;
  stat_to_rule: string;
  rule_to_stat: string;
  narr_to_rule: string;
  stat_reply_to_rule: string;
  stat_reply_to_narr: string;
  rule_reply_to_stat: string;
  rule_reply_to_narr: string;
  narr_reply_to_stat: string;
  narr_reply_to_rule: string;
}

export async function loadAgentChats(caseId: string, turn: string = "1", groupId: string = "1"): Promise<AgentChat[]> {
  const response = await fetch(agentChatsCsv);
  const text = await response.text();

  const result = Papa.parse<AgentChatRow>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const normalize = (v: any) =>
    v?.toString().trim().replace(/^\uFEFF/, "");
  
  const filtered = result.data.find((row) => {
    const rowCase = normalize(row.case);
    const rowTurn = normalize(row.turn);
    const targetCase = normalize(caseId);
    const targetTurn = normalize(turn);
  
    const match = rowCase === targetCase && rowTurn === targetTurn;
    return match;
  });
  
  if (!filtered) return [];

  const groupIdToKeyMap: Record<string, MessageGroupKey> = {
    "0": MessageGroup.DirectToUserInOrder,
    "1": MessageGroup.DirectToUser,
    "2": MessageGroup.AgentRoundRobin,
    "3": MessageGroup.ToStatMerged,
    "4": MessageGroup.ToRuleMerged,
    "5": MessageGroup.ToNarrMerged,
    "6": MessageGroup.StatSpeakOthersDebate,
    "7": MessageGroup.RuleSpeakOthersDebate,
    "8": MessageGroup.NarrSpeakOthersDebate,
  };
  
  const groupKey = groupIdToKeyMap[groupId];
  const groupConfig = MessageGroupConfigMap[groupKey];

  if (!groupConfig || !groupConfig.candidates || groupConfig.candidates.length === 0) {
    console.warn(`⚠️ No valid group config found for groupId ${groupId}`);
    return [];
  }

  const randomCandidate = groupConfig.candidates[Math.floor(Math.random() * groupConfig.candidates.length)];
  type AgentMessageKey = keyof typeof agentMessageMap;
  const chats: AgentChat[] = randomCandidate.map((key) => {
    const message = (filtered as any)[key];
    const meta = agentMessageMap[key as AgentMessageKey];
  
    return {
      from: meta.from,
      to: meta.to,
      type: meta.type,
      message,
    };
  });
  return chats;
}