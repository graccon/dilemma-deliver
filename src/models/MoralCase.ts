interface CaseOption {
    image: string;
    description: string;
    deaths: string[];
    note?: string;
}

export default class MoralCase {
    id: string;
    question: string;
    A: CaseOption;
    B: CaseOption;

    constructor({ id, question, A, B }: { id: string; question: string; A: CaseOption; B: CaseOption }) {
        this.id = id;
        this.question = question;
        this.A = A;
        this.B = B;
    }

    getAllDeaths() {
        return {
        A: this.A.deaths,
        B: this.B.deaths,
        };
    }

    hasNotes() {
        return (
        (this.A.note && this.A.note.trim() !== "") ||
        (this.B.note && this.B.note.trim() !== "")
        );
    }
}