import { useEffect, useState } from "react";
import { getOnboarding } from "./OnboardingSetting";
import type OnboardingCase from "../models/OnboardingCase";
import { saveMissionStep, loadMissionStep } from "../stores/missionStepStorage";
import type { AgentChat } from "../services/loadAgentChats";
import { loadAgentChats } from "./loadAgentChats";


export function useOnboardingLogic() {
    const [isAnswered, setIsAnswered] = useState(false);
    const [caseData, setCaseData] = useState<OnboardingCase | null>(null);
    const [missionStep, setMissionStepState] = useState<number>(() => loadMissionStep());
    const [agentChats, setAgentChats] = useState<AgentChat[]>([]);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [likedIndex, setLikedIndex] = useState<number | null>(null);
    const [sliderValue, setSliderValue] = useState<number>(50);
    const [hasSentStep2Chat, setHasSentStep2Chat] = useState(false);


    useEffect(() => {
        const data = getOnboarding();
        setCaseData(data);
    }, []);

    const setMissionStep = (step: number) => {
        setMissionStepState(step);
        saveMissionStep(step);
    };

    const advanceMission = () => {
        if (missionStep === 2 && !hasSentStep2Chat) {
            // console.log("hey", sliderValue)
          return;
        }
        setMissionStep(missionStep + 1);
      };

    useEffect(() => {
      if (sliderValue !== 50) {
        setIsAnswered(true);
      } else {
        setIsAnswered(false);
      }
    }, [sliderValue]);

    useEffect(() => {
        if (!caseData) return;
        const fetchChats = async () => {
          try {
            // if (missionStep < 4) setAgentChats([]);
            const chats = await loadAgentChats("case_0", missionStep.toString(), "0"); // caseId "0", step, groupId "0"
            console.log("💬 Loaded chats:", chats);
            await appendChatsSequentially(chats, "0");
          } catch (err) {
            console.error("❌ Error loading onboarding chats:", err);
          }
        };
    
        fetchChats();
      }, [missionStep, caseData]);

      useEffect(() => {
        if (hasSentStep2Chat) {return;}
        if (missionStep === 2 && sliderValue === 25) {
          const newChats: AgentChat[] = [
            {
              from: "stat",
              to: "me",
              type: "talk",
              message: "@ME Nice work !",
            },
        ]
        setAgentChats((prev) => [...prev, ...newChats]);
        setHasSentStep2Chat(true);
        }
      }, [sliderValue, missionStep]);

    function getLabelByMissionStep(step: number): string {
        switch (step) {
          case 4:
            return "I can’t decide yet";
          case 5:
            return "I can’t decide yet";
          case 6:
            return "I can’t decide yet";
          default:
            return "Got it !";
        }
      }
      // 채팅 순차 렌더링
        function appendChatsSequentially(chatsToAdd: AgentChat[], _caseId: string): Promise<void> {
                      return new Promise((resolve) => {
            let i = 0;
            const interval = setInterval(() => {
              if (i >= chatsToAdd.length) {
                clearInterval(interval);
                resolve();
                return;
              }
        
              const chat = chatsToAdd[i];
              if (!chat) {
                console.warn("⚠️ Null or undefined chat skipped:", chat);
                i++;
                return;
              }
              setAgentChats((prev) => {
                const updated = [...prev, chat];
                return updated;
              });
        
              i++;
            }, 1200);
            setShouldAnimate(true);
          });
        }
      
        // 좋아요 변경
        function updateLikedIndex(index: number) {
          setLikedIndex((prev) => {
            const newIndex = prev === index ? null : index;
            updateAndSaveChats((prevChats) =>
              prevChats.map((chat, i) => ({
                ...chat,
                liked: i === newIndex,
              }))
            );
            return newIndex;
          });
        }
      
        // 채팅 수정 및 저장
        function updateAndSaveChats(updater: (prev: AgentChat[]) => AgentChat[]) {
          setAgentChats((prev) => {
            const updated = updater(prev);
            return updated;
          });
        }

        function appendUserChat(message: string) {
          const newChat: AgentChat = {
            from: "me",
            to: "all",
            type: "talk",
            message,
          };
          setAgentChats((prev) => [...prev, newChat]);
        }

    return {
        caseData,
        agentChats,
        likedIndex,
        missionStep,
        isAnswered,
        setMissionStep,
        advanceMission,
        getLabelByMissionStep,
        updateLikedIndex,
        shouldAnimate,
        setSliderValue,
        appendUserChat,
    };
}