
export type SurveyQuestionType = "scale" | "text";

export type SurveyScale = 5 | 7;

export interface SurveyQuestion {
    id: string;
    type: SurveyQuestionType;
    question: string;
    scale?: SurveyScale;
    required?: boolean;
    placeholder?: string;
}