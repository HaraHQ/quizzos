import FELayout from "@/components/fe/Layout";
import useLocaleStore from "@/stores/locale";
import useQuizStore from "@/stores/quiz";
import { useEffect } from "react";

const ResultPage = () => {
  const quiz = useQuizStore();
  const l = useLocaleStore();

  useEffect(() => {
    if (!quiz.quiz || quiz.quiz.title === "") {
      window.location.replace("/");
    }
  })
  return (
    <FELayout>
      <div className="flex flex-col gap-16 items-center">
        <div className="flex flex-col gap-8">
          <div className="text-2xl font-bold text-center">{quiz.quiz.title}</div>
          <div className="text-sm flex flex-col items-center gap-1">
            <div className="font-semibold">{l.gt('timeResult')}</div>
            <div>{quiz.result.total_time} {l.gt('seconds')}</div>
          </div>
          <div className="text-3xl text-center">{l.gt('totalQuestions')} {quiz.result.question_counter}</div>
          <div className="text-sm flex flex-col items-center gap-1">
            <div className="font-semibold">{l.gt('answerResult')}</div>
            <div>{quiz.result.correct_counter}/{quiz.result.question_counter} {l.gt('outOfCorrectAnswers')}</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="text-xl">{l.gt('share')}</div>
          <div className="w-12 h-12 bg-green-300 cursor-pointer" />
          <div className="w-12 h-12 bg-red-300 cursor-pointer" />
          <div className="w-12 h-12 bg-white cursor-pointer" />
        </div>
      </div>
    </FELayout>
  );
};

export default ResultPage;
