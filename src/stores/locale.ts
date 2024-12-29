import { create } from "zustand";
import EN from "../locale/EN.json";
import AR from "../locale/AR.json";

interface QuizLocalization {
  myQuizzes: string;
  createQuiz: string;
  createQuizButton: string;
  createdAt: string;
  configuration: string;
  locale: string;
  maxQuizAllocation: string;
  upgradeAccount: string;
  gold: string;
  silver: string;
  basic: string;
  account: string;
  quizes: string;
  free: string;
  logout: string;
  submittedResponse: string;
  select: string;
  name: string;
  TEL: string;
  TELinfo: string;
  correctnessScore: string;
  quizTitle: string;
  description: string;
  backToMyQuizzes: string;
  editQuiz: string;
  answerOptions: string;
  maxOptions: string;
  useScore: string;
  useRandom: string;
  submitQuiz: string;
  remove: string;
  quizIsUpdated: string;
  quizIsCreated: string;
  quidID: string;
  clickToCopy: string;
  quizIsCopied: string;
  addQuestion: string;
  newQuiz: string;
  submittedResponseBy: string;
  question: string;
  answer: string;
  speed: string;
  goToQuizPage: string;
  username: string;
  registerNewAccount: string;
  loginButton: string;
  logoutButton: string;
  registerButton: string;
  haveAccount: string;
  inputQuizID: string;
  getQuiz: string;
  makeQuiz: string;
  timeResult: string;
  seconds: string;
  totalQuestions: string;
  answerResult: string;
  outOfCorrectAnswers: string;
  share: string;
  start: string;
  responseSavedSuccessfully: string;
  activeQuiz: string;
  latestQuizzesMade: string;
  questionTitle: string;
  score: string;
  backToQuizDetail: string;
  password: string;
  confirmPassword: string;
  loading: string;
  dropHere: string;
  dragNDrop: string;
  orClick: string;
}

interface LocaleState {
  locale: string;
  setLocale: (locale: string) => void;
  gt: (key: keyof QuizLocalization) => string;
  setTextDirection: (direction: "ltr" | "rtl") => void;
}

const useLocaleStore = create<LocaleState>((set, get) => ({
  locale: "EN", // EN | AR
  setLocale: (locale: string) => {
    set({ locale });
    const direction = locale === "AR" ? "rtl" : "ltr";
    get().setTextDirection(direction); // Update text direction based on locale
  },
  setTextDirection: (direction: "ltr" | "rtl") => {
    document.documentElement.dir = direction; // Set the dir attribute for text direction
  },
  gt: (key: keyof QuizLocalization) => {
    const locale = get().locale;
    // Ensure the translation object is typed correctly
    const translations = locale === "AR" ? (AR as unknown as QuizLocalization) : (EN as unknown as QuizLocalization);
    return translations[key] || key; // Return the translation or fallback to the key
  },
}));

export default useLocaleStore;
