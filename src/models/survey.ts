
export type SurveyQuestionType = "scale" | "text" | "slider";

export type SurveyScale = 5 | 7 | 10;

export interface SurveyQuestion {
    id: string;
    type: SurveyQuestionType;
    question: string;
    scale?: SurveyScale;
    labels?: {
        min: string;
        max: string;
    };
    required?: boolean;
    placeholder?: string;
    labelImages?: {
        min: string;
        max: string;
    };
}