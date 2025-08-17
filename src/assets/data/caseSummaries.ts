export type CaseSummary = {
    caseId: string;
    descriptionA: string;
    descriptionB: string;
    imageA: string;
    imageB: string;
    agentDecision: {
        stat: "A" | "B";
        rule: "A" | "B";
        narr: "A" | "B";
      };
  };
  
  export const caseSummaries: CaseSummary[] = [
    {
        caseId: "case_1",
        descriptionA: "The car continues straight and hits two pedestrians. \n(Deaths: 1 woman, 1 child)",
        descriptionB: "The car swerves and hits one pedestrian. \n(Death: 1 pregnant woman)",
        imageA: "/assets/images/case1_A.png",
        imageB: "/assets/images/case1_B.png",
        agentDecision: {
            stat: "B",
            rule: "A",
            narr: "A"
          }
    },
    {
        caseId: "case_2",
        descriptionA: "The car continues straight and hits three pedestrians. \n(Deaths: 3 criminal)",
        descriptionB: "The car swerves and hits five pedestrians. \n(Death: 1 man, 1 boy, 1 girl, 1 dog, 1 cat)",
        imageA: "/assets/images/case2_A.png",
        imageB: "/assets/images/case2_B.png",
        agentDecision: {
            stat: "A",
            rule: "B",
            narr: "A"
          }
    },
    {
        caseId: "case_3",
        descriptionA: "The car continues straight and hits five pedestrians. \n(Deaths: 3 female athlete, 1 man, 1 woman)",
        descriptionB: "The car swerves and crash into a barrier. \n(Death: 3 large woman, 1 large man, 1 woman)",
        imageA: "/assets/images/case3_A.png",
        imageB: "/assets/images/case3_B.png",
        agentDecision: {
            stat: "B",
            rule: "A",
            narr: "B"
          }
    },
    {
        caseId: "case_4",
        descriptionA: "The car continues straight and crash into a barrier. \n(Deaths: 1 elderly man, 1 elderly woman)",
        descriptionB: "The car swerves and hits one pedestrian. \n(Death: 1 doctor)",
        imageA: "/assets/images/case4_A.png",
        imageB: "/assets/images/case4_B.png", 
        agentDecision: {
            stat: "A",
            rule: "B",
            narr: "B"
          }
    },
    {
        caseId: "case_5",
        descriptionA: "The car continues straight and hits three pedestrians. (Deaths: 3 executive man)",
        descriptionB: "The car swerves and hits three pedestrians. (Death: 3 homeless)",
        imageA: "/assets/images/case5_A.png",
        imageB: "/assets/images/case5_B.png", 
        agentDecision: {
            stat: "B",
            rule: "A",
            narr: "A"
          }
      }
  ];