import { MessageGroup } from "./agentMessageMap";
import type { MessageGroupKey } from "./agentMessageMap";

export interface MessageGroupConfig {
    name: string;               
    speakerToUser?: string;     // 사용자에게 말하는 발화자
    candidates?: string[][];    // 여러 후보 조합 중 하나를 랜덤으로 고를 수 있음
  }

export const MessageGroupConfigMap: Record<MessageGroupKey, MessageGroupConfig> = {
    [MessageGroup.DirectToUserInOrder]: {
        name: "0. 사용자에게 직접 순서대로 말하기",
        candidates: [
            ["stat_to_me", "rule_to_me", "narr_to_me"]
        ]
    },
    [MessageGroup.DirectToUser]: {
        name: "1. 사용자에게 직접 말하기",
        candidates: [
            ["stat_to_me", "rule_to_me", "narr_to_me"], 
            ["stat_to_me", "narr_to_me", "rule_to_me"], 
            ["rule_to_me", "stat_to_me", "narr_to_me"], 
            ["rule_to_me", "narr_to_me", "stat_to_me"], 
            ["narr_to_me", "stat_to_me", "rule_to_me"],
            ["narr_to_me", "rule_to_me", "stat_to_me"]
        ],
    },
    [MessageGroup.AgentRoundRobin]: {
        name: "2. 에이전트 간 순환 발화",
        candidates: [
            // stat 시작
            ["stat_to_rule", "rule_reply_to_stat", "rule_to_narr", "narr_reply_to_rule", "narr_to_stat", "stat_reply_to_narr"],
            ["stat_to_narr", "narr_reply_to_stat", "narr_to_rule", "rule_reply_to_narr", "rule_to_stat", "stat_reply_to_rule"],
            // rule 시작
            ["rule_to_narr", "narr_reply_to_rule", "narr_to_stat", "stat_reply_to_narr", "stat_to_rule", "rule_reply_to_stat"],
            ["rule_to_stat", "stat_reply_to_rule", "stat_to_narr", "narr_reply_to_stat", "narr_to_rule", "rule_reply_to_narr"],
            // narr 시작
            ["narr_to_stat", "stat_reply_to_narr", "stat_to_rule", "rule_reply_to_stat", "rule_to_narr", "narr_reply_to_rule"],
            ["narr_to_rule", "rule_reply_to_narr", "rule_to_stat", "stat_reply_to_rule", "stat_to_narr", "narr_reply_to_stat"],
        ],
    },
    [MessageGroup.ToStatMerged]: {
        name: "3. Stat에게 몰아서 말하기",
        candidates: [
            ["rule_to_stat", "narr_to_stat", "stat_merged_to_me"],
            ["narr_to_stat", "rule_to_stat", "stat_merged_to_me"]
        ],
    },
    [MessageGroup.ToRuleMerged]: {
        name: "4. Rule에게 몰아서 말하기",
        candidates: [
            ["stat_to_rule", "narr_to_rule", "rule_merged_to_me"],
            ["narr_to_rule", "stat_to_rule", "rule_merged_to_me"]
        ],
    },
    [MessageGroup.ToNarrMerged]: {
        name: "5. Narr에게 몰아서 말하기",
        candidates: [
            ["stat_to_narr", "rule_to_narr", "narr_merged_to_me"],
            ["rule_to_narr", "stat_to_narr", "narr_merged_to_me"]
        ],
    },
    [MessageGroup.StatSpeakOthersDebate]: {
        name: "6. Stat이 먼저 말하고 다른 에이전트가 토론",
        candidates: [
            ["stat_to_me", "rule_to_narr", "narr_reply_to_rule", "narr_to_rule", "rule_reply_to_narr"],
            ["rule_to_narr", "narr_reply_to_rule", "narr_to_rule", "rule_reply_to_narr", "stat_to_me"],
            ["stat_to_me", "narr_to_rule", "rule_reply_to_narr", "rule_to_narr", "narr_reply_to_rule"],
            ["narr_to_rule", "rule_reply_to_narr", "rule_to_narr", "narr_reply_to_rule", "stat_to_me"],
        ],
    },
    [MessageGroup.RuleSpeakOthersDebate]: {
        name: "7. Rule이 먼저 말하고 다른 에이전트가 토론",
        candidates: [
            ["rule_to_me", "stat_to_narr", "narr_reply_to_stat", "narr_to_stat", "stat_reply_to_narr"],
            ["stat_to_narr", "narr_reply_to_stat", "narr_to_stat", "stat_reply_to_narr", "rule_to_me"],
            ["rule_to_me", "narr_to_stat", "stat_reply_to_narr", "stat_to_narr", "narr_reply_to_stat"],
            ["narr_to_stat", "stat_reply_to_narr", "stat_to_narr", "narr_reply_to_stat", "rule_to_me"],
        ],
    },
    [MessageGroup.NarrSpeakOthersDebate]: {
        name: "8. Narr이 먼저 말하고 다른 에이전트가 토론",
        candidates: [
            ["narr_to_me", "stat_to_rule", "rule_reply_to_stat", "rule_to_stat", "stat_reply_to_rule"],
            ["stat_to_rule", "rule_reply_to_stat", "rule_to_stat", "stat_reply_to_rule", "narr_to_me"],
            ["narr_to_me", "rule_to_stat", "stat_reply_to_rule", "stat_to_rule", "rule_reply_to_stat"],
            ["rule_to_stat", "stat_reply_to_rule", "stat_to_rule", "rule_reply_to_stat", "narr_to_me"]
        ],
    },
};