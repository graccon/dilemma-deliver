export const agentMessageMap = {
    stat_to_me:             { from: "stat", to: "me", type: "talk" },
    rule_to_me:             { from: "rule", to: "me", type: "talk" },
    narr_to_me:             { from: "narr", to: "me", type: "talk" },
    stat_merged_to_me:      { from: "stat", to: "me", type: "talk" },
    rule_merged_to_me:      { from: "rule", to: "me", type: "talk" },
    narr_merged_to_me:      { from: "narr", to: "me", type: "talk" },
    stat_to_rule:           { from: "stat", to: "rule", type: "talk" },
    stat_to_narr:           { from: "stat", to: "narr", type: "talk" },
    stat_reply_to_rule:     { from: "stat", to: "rule", type: "reply" },
    stat_reply_to_narr:     { from: "stat", to: "narr", type: "reply" },
    rule_to_stat:           { from: "rule", to: "stat", type: "talk" },
    rule_to_narr:           { from: "rule", to: "narr", type: "talk" },
    rule_reply_to_stat:     { from: "rule", to: "stat", type: "reply" },
    rule_reply_to_narr:     { from: "rule", to: "narr", type: "reply" },
    narr_to_stat:           { from: "narr", to: "stat", type: "talk" },
    narr_to_rule:           { from: "narr", to: "rule", type: "talk" },
    narr_reply_to_stat:     { from: "narr", to: "stat", type: "reply" },
    narr_reply_to_rule:     { from: "narr", to: "rule", type: "reply" },
  } as const;


export const MessageGroup = {
    DirectToUserInOrder: "group0",
    DirectToUser: "group1",
    AgentRoundRobin: "group2",
    ToStatMerged: "group3",
    ToRuleMerged: "group4",
    ToNarrMerged: "group5",
    StatSpeakOthersDebate: "group6",
    RuleSpeakOthersDebate: "group7",
    NarrSpeakOthersDebate: "group8",
} as const;

export type MessageGroupKey = typeof MessageGroup[keyof typeof MessageGroup];