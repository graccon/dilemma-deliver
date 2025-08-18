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
    const [canInteractSlider, setCanInteractSlider] = useState<boolean>(() => loadMissionStep() > 3);
    const [chatsLoaded, setChatsLoaded] = useState(true);

    useEffect(() => {
        const data = getOnboarding();
        setCaseData(data);
    }, []);

    const setMissionStep = (step: number) => {
        setMissionStepState(step);
        saveMissionStep(step);
    };

    const advanceMission = (nextStep?: number) => {
      if (missionStep === 3 && !hasSentStep2Chat) {
        return;
      }
    
      if (typeof nextStep === "number") {
        setMissionStep(nextStep);
      } else {
        setMissionStep(missionStep + 1);
      }
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
            if (missionStep === 5 || missionStep === 8) setAgentChats([]);
            console.log("missionStep : ", missionStep)
            if (missionStep === 1) {
              await appendChatsSequentially(step1Chats, "0");
              return;
            }
            if (missionStep === 2) {
              await appendChatsSequentially(step2Chats, "0");
              return;
            }
            if (missionStep === 8) {
              setCanInteractSlider(false);
              setLikedIndex(null);
              await appendChatsSequentially(step8Chats, "0");
              return;
            }

            const chats = await loadAgentChats("case_0", missionStep.toString(), "0"); 
            await appendChatsSequentially(chats, "0");
            if (missionStep === 3) {
              setCanInteractSlider(true);
            }

          } catch (err) {
            console.error("❌ Error loading onboarding chats:", err);
          }
        }; 
        fetchChats();
        setIsAnswered(false);
      }, [missionStep, caseData]);

      useEffect(() => {
        if (hasSentStep2Chat) {return;}
        if (missionStep === 3 && sliderValue === 25) {
          const newChats: AgentChat[] = [
            {
              from: "stat",
              to: "me",
              type: "talk",
              message: "@Me Nice work ! 🥳 \nOne last step to go. \n**Tap ‘Got it’ again.**",
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
          case 5:
            return "I can’t decide yet";
          case 6:
            return "I can’t decide yet";
          case 7:
            return "I can’t decide yet";
          default:
            return "Got it !";
        }
      }
      // 채팅 순차 렌더링
        function appendChatsSequentially(chatsToAdd: AgentChat[], _caseId: string): Promise<void> {
          return new Promise((resolve) => {
            let i = 0;
            setChatsLoaded(false); 
            const interval = setInterval(() => {
              if (i >= chatsToAdd.length) {
                clearInterval(interval);
                setChatsLoaded(true);
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
            }, 1800);
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
        chatsLoaded,
        canInteractSlider,
        setMissionStep,
        advanceMission,
        getLabelByMissionStep,
        updateLikedIndex,
        shouldAnimate,
        setSliderValue,
        appendUserChat,
        hasSentStep2Chat,
    };
}


const step1Chats: AgentChat[] = [
  {
    from: "stat",
    to: "me",
    type: "talk",
    message: "@Me Hi there! Glad you’re here. You’ll be making some important decisions in this experiment.",
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
    message: "Hey team, give me a hand!\n@agent2 @agent3",
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

const step2Chats: AgentChat[] = [
  {
    from: "stat",
    to: "me",
    type: "talk",
    message: "Alright, before we begin,\n Look at the image on the left. This is how we show who’s talking to whom.",
  },
  {
    from: "stat",
    to: "me",
    type: "talk",
    message: "If I’m looking at you, I’m only talking to you.",
  },
  {
    from: "rule",
    to: "narr",
    type: "talk",
    message: "Wait, if we’re looking at each other like this… does that mean we’re just talking to each other?",
  },
  {
    from: "rule",
    to: "narr",
    type: "reply",
    message: "Totally. We’re having a very important agent talk.",
  }
];

const step8Chats: AgentChat[] = [
  {
    from: "stat",
    to: "me",
    type: "talk",
    message: "Now it’s time to dive into the actual experiment.\nSometimes, a self-driving car has to make a difficult choice—for example, whether to save the passengers or the pedestrians.",
  },
  {
    from: "narr",
    to: "me",
    type: "talk",
    message: "You’ll act as **an observer** and decide which option seems more ethical based on the information given.",
  },
  {
    from: "rule",
    to: "me",
    type: "talk",
    message: "**Note**:\nIn this experiment, we assume the car already knows key details about each person involved — like their age, job, or criminal history.",
  },
  {
    from: "stat",
    to: "me",
    type: "talk",
    message: "Ready to try this experiment?\nWhen you’re ready, **tap ‘Next Session’ to begin.**",
  },
];