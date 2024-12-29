import { Quiz } from "@/pages/api/admin/quiz/[share_id]";
import { create } from "zustand";

type QuizStore = {
  quiz: Quiz;
  id: string;
  sequence: string[];
  result: {
    total_time: number;
    correct_counter: number;
    question_counter: number;
  };
  answer: Record<string, any>[];
  setAnswer: (answer: Record<string, any>) => void;
  resetAnswer: () => void;
  setResult: (time: number, counter: number, question: number) => void;
  setId: (id: string) => void;
  setQuiz: (quiz: any) => void;
  resetQuiz: () => void;
  getResponse: (id: string) => string | undefined;
};

const useQuizStore = create<QuizStore>((set, get) => ({
  quiz: {
    title: "",
    questions: [],
    share_id: "",
    desc: "",
    use_random: false,
    use_score: false,
  },
  id: "",
  sequence: [],
  result: {
    total_time: 0,
    correct_counter: 0,
    question_counter: 0,
  },
  answer: [],
  setAnswer: (answer: any) =>
    set({
      answer: [...get().answer, answer],
    }),
  resetAnswer: () => set({ answer: [] }),
  setResult: (time, counter, question) =>
    set({
      result: {
        total_time: time,
        correct_counter: counter,
        question_counter: question,
      },
    }),
  setId: (id: string) => set({ id }),
  setQuiz: (quiz: any) => {
    if (get().quiz.use_random) {
      const sequence = quiz.questions
        .map((q: any) => q.id)
        .sort(() => Math.random() - 0.5);
      set({ quiz, sequence });
    } else {
      const sequence = quiz.questions.map((q: any) => q.id);
      set({ quiz, sequence });
    }
  },
  resetQuiz: () =>
    set({
      quiz: {
        ...get().quiz,
        questions: [],
        share_id: "",
        use_random: false,
        use_score: false,
      },
    }),
  getResponse: (id: string) => {
    const answers = get().quiz.questions.find((q: any) => q.id === id)?.options;
    return answers?.find((a: any) => a.isCorrect)?.text;
  },
}));

export default useQuizStore;
