interface OnboardingOption {
    image: string;
    description: string;
}

export default class OnboardingCase {
    id: string;
    question: string;
    A : OnboardingOption;
    B : OnboardingOption;

    constructor({id, question, A, B}: {
        id: string;
        question: string;
        A : OnboardingOption;
        B : OnboardingOption ;
    }) {
        this.id= id;
        this.question = question;
        this.A = A;
        this.B = B;
    }
}