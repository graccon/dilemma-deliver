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
    const [canInteractSlider, setCanInteractSlider] = useState(false);


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
            console.log("missionStep : ", missionStep)
            if (missionStep === 1) {
              await appendChatsSequentially(step1Chats, "0");
              return;
            }
            const chats = await loadAgentChats("case_0", missionStep.toString(), "0"); 
            await appendChatsSequentially(chats, "0");

            if (missionStep === 2) {
              setCanInteractSlider(true);
            }
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
              message: "@ME Nice work ! 🥳 \nOne last step to go. \n**Tap ‘Got it’ again.**",
            },
        ]
        setAgentChats((prev) => [...prev, ...newChats]);
        setHasSentStep2Chat(true);
        }
      }, [sliderValue, missionStep]);

    function getLabelByMissionStep(step: number): string {
        switch (step) {
          case 1:
            return "Let’s get started";
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
        canInteractSlider,
        setMissionStep,
        advanceMission,
        getLabelByMissionStep,
        updateLikedIndex,
        shouldAnimate,
        setSliderValue,
        appendUserChat,
    };
}


const step1Chats: AgentChat[] = [
  {
    from: "stat",
    to: "me",
    type: "talk",
    message: "Hi there! Glad you’re here. You’ll be making some important decisions in this experiment.",
  },
  {
    from: "stat",
    to: "me",
    type: "talk",
    message: "But it’s a bit more complex than it looks... I might need some help explaining things. Let me call in some backup.",
  },
  {
    from: "stat",
    to: "narr",
    type: "talk",
    message: "Hey team, give me a hand!\n@agent1\n@agent2",
  },
  {
    from: "rule",
    to: "stat",
    type: "reply",
    message: "Sure thing. I’m here!",
  },
  {
    from: "narr",
    to: "stat",
    type: "reply",
    message: "Of course! I'm good at this kind of stuff. We will help you.",
  },
];