import type { SurveyQuestion } from "../../models/survey";

export const surveyDemographic: SurveyQuestion[] = [ 
  {
    id: "demographic_1",
    type: "radio",
    options: ["Male", "Female", "Non-binary"],
    question: "What is your gender?",
  },
  {
    id: "demographic_2",
    type: "number",
    options: ["Male", "Female", "Non-binary"],
    question: "What is your age?",
  },
  {
    id: "demographic_3",
    type: "radio",
    options: [
      "Elementary school or less",
      "Middle school",
      "High school",
      "Undergraduate degree (Bachelor's) or attending",
      "Graduate degree (Master's or Ph.D.) or attending"
    ],
    question: "What is the highest level of education you have completed?",
  },
  {
    id: "demographic_4",
    type: "dropdown",
    question: "what country are you currently residing in?",
  }
];

export const surveyQuestionsBFI: SurveyQuestion[] = [
  {
    id: "BFI-S_1",
    type: "scale",
    scale: 7,
    question: "dose a thorough job",
    required: true,
  },
  {
    id: "BFI-S_2",
    type: "scale",
    scale: 7,
    question: "is communicative, talkative",
  },
  {
    id: "BFI-S_3",
    type: "scale",
    scale: 7,
    question: "is sometimes somewhat rude to others",
  },
  {
    id: "BFI-S_4",
    type: "scale",
    scale: 7,
    question: "is original, comes up with new ideas",
  },
  {
    id: "BFI-S_5",
    type: "scale",
    scale: 7,
    question: "worries a lot",
  },
  {
    id: "BFI-S_6",
    type: "scale",
    scale: 7,
    question: "is reserved",
  },
  {
    id: "BFI-S_7",
    type: "scale",
    scale: 7,
    question: "has a forgiving nature",
  },
  {
    id: "BFI-S_8",
    type: "scale",
    scale: 7,
    question: "tends to be lazy",
  },
  {
    id: "BFI-S_9",
    type: "scale",
    scale: 7,
    question: "is outgoing, sociable",
  },
  {
    id: "BFI-S_10",
    type: "scale",
    scale: 7,
    question: "values artistic, aesthetic experiences",
  },
  {
    id: "BFI-S_11",
    type: "scale",
    scale: 7,
    question: "get nervous easily",
  },
  {
    id: "BFI-S_12",
    type: "scale",
    scale: 7,
    question: "is considerate and kind to others",
  },
  {
    id: "BFI-S_13",
    type: "scale",
    scale: 7,
    question: "does things effectively and efficiently",
  },
  {
    id: "BFI-S_14",
    type: "scale",
    scale: 7,
    question: "has an active imagination",
  },
  {
    id: "BFI-S_15",
    type: "scale",
    scale: 7,
    question: "is relaxed, handles stress well",
  }
];

export const surveyQuestionsLOC: SurveyQuestion[] = [
    {
      id: "LOC_1",
      type: "scale",
      scale: 5,
      question: "I’m my own boss",
    },
    {
        id: "LOC_2",
        type: "scale",
        scale: 5,
        question: "If I work hard, I will succeed",
      },
      {
        id: "LOC_3",
        type: "scale",
        scale: 5,
        question: "Whether at work or in my private life: What I do is mainly determined by others",
      },
      {
        id: "LOC_4",
        type: "scale",
        scale: 5,
        question: "Fate often gets in the way of my plans",
      },
];

export const surveyQuestionsAIUsed: SurveyQuestion[] = [
    {
      id: "AIUsed_1",
      type: "scale",
      scale: 5,
      question: "I often use conversational AI tools (e.g., chatGPT, Gemini, etc.) for various tasks, such as information retrieval, writing and others.",
      labels: {
        min: "Not at all",
        max: "Very often"
      },
    },
    {
        id: "AIUsed_2",
        type: "scale",
        scale: 5,
        question: "I heavily rely on conversational AI tools(e.g., chatGPT, gemini, etc.) for various tasks, such as information retrieval and writing.",
      },
      {
        id: "AIUsed_3",
        type: "scale",
        scale: 5,
        question: "I trust that the information provided by conversational AI services is accurate.",
      }
];

export const surveyFeaturePreference: SurveyQuestion[] = [
  {
    id: "FP_1",
    type: "slider",
    scale: 10,
    labels: {
      min: "Does Not Matter",
      max: "Matters a lot"
    },
    question: "Saving More Lives",
    labelImages: {
      min: "/assets/images/feature_man.png",
      max: "/assets/images/feature_many.png"
    }
  },
  {
    id: "FP_2",
    type: "slider",
    scale: 10,
    labels: {
      min: "Does Not Matter",
      max: "Matters a lot"
    },
    question: "Protecting Passengers",
    labelImages: {
      min: "/assets/images/feature_protecting_passengers_1.png",
      max: "/assets/images/feature_protecting_passengers_2.png"
    }
  },
  {
    id: "FP_3",
    type: "slider",
    scale: 10,
    labels: {
      min: "Does Not Matter",
      max: "Matters a lot"
    },
    question: "Upholding the Law",
    labelImages: {
      min: "/assets/images/feature_upholding_the_law_1.png",
      max: "/assets/images/feature_upholding_the_law_2.png"
    }
  },
  {
    id: "FP_4",
    type: "slider",
    scale: 10,
    labels: {
      min: "Does Not Matter",
      max: "Matters a lot"
    },
    question: "Avoiding Intervention",
    labelImages: {
      min: "/assets/icons/swerve_icon.png",
      max: "/assets/icons/stay_icon.png"
    }
  },
  {
    id: "FP_5",
    type: "slider",
    scale: 10,
    labels: {
      min: "Males",
      max: "Females"
    },
    question: "Gender Preference",
    labelImages: {
      min: "/assets/images/feature_man.png",
      max: "/assets/images/feature_woman.png"
    }
  },
  {
    id: "FP_6",
    type: "slider",
    scale: 10,
    labels: {
      min: "Hoomans",
      max: "Pets"
    },
    question: "Species Preference",
    labelImages: {
      min: "/assets/images/feature_protecting_passengers_1.png",
      max: "/assets/images/feature_pets.png"
    }
  },
  {
    id: "FP_7",
    type: "slider",
    scale: 10,
    labels: {
      min: "Younger",
      max: "Older"
    },
    question: "Age Preference",
    labelImages: {
      min: "/assets/images/feature_age_1.png",
      max: "/assets/images/feature_age_2.png"
    }
  },
  {
    id: "FP_8",
    type: "slider",
    scale: 10,
    labels: {
      min: "Fit People",
      max: "Large People"
    },
    question: "Fitness Preference",
    labelImages: {
      min: "/assets/images/feature_fitness_1.png",
      max: "/assets/images/feature_fitness_2.png"
    }
  },
  {
    id: "FP_9",
    type: "slider",
    scale: 10,
    labels: {
      min: "Higher",
      max: "Lower"
    },
    question: "Social Value Preference",
    labelImages: {
      min: "/assets/images/feature_social_value_1.png",
      max: "/assets/images/feature_social_value_2.png"
    }
  },
];

export const surveyQuestionsAfter: SurveyQuestion[] = [
  {
    id: "After_1",
    type: "scale",
    scale: 5,
    labels: {
      min: "Strongly disagree",
      max: "Strongly agree"
    },
    question: "My decision was influenced by the AI agent.",
  },
  {
    id: "After_2",
    type: "scale",
    scale: 5,
    labels: {
      min: "Strongly disagree",
      max: "Strongly agree"
    },
    question: "I found the AI’s advice unpleasant.",
  }
]