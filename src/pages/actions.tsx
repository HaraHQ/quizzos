import FELayout from "@/components/fe/Layout";
import CountdownTimer, {
  reset,
  start,
  getElapsedTime,
} from "@/components/CountdownTimer";
import { useEffect, useState } from "react";
import { Option } from "./admin/quiz/create";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/auth";
import useQuizStore from "@/stores/quiz";
import { useMutation, useQuery } from "@tanstack/react-query";
import useLocaleStore from "@/stores/locale";

interface Submission {
  quiz_id?: string;
  answers: Record<string, any>;
}

const ActionsPage = () => {
  const router = useRouter();
  const auth = useAuthStore();
  const quiz = useQuizStore();
  const l = useLocaleStore();
  const [isStarted, setIsStarted] = useState(false);
  const [active, setActive] = useState<string>("");
  const handleStartQuiz = () => {
    start();
    setIsStarted(true);
    quiz.resetAnswer();
  };

  useEffect(() => {
    quiz.resetQuiz();
  }, [])

  const handleAnswer = (question: string, answer: string, id: string) => {
    const generateData = () => {
      const currentSeconds = getElapsedTime();

      const payload = {
        id,
        time: currentSeconds,
        question,
        answer,
        isCorrect: quiz.quiz.questions
          .find((x) => x.id === active)
          ?.options.find((x) => x.id === id)?.isCorrect,
      };

      quiz.setAnswer(payload);
    };

    generateData(); // Ensure the answer is recorded immediately

    const nextSeq = quiz.sequence[quiz.sequence.indexOf(active) + 1];

    setActive(nextSeq); // Move to the next question
    reset(); // Reset timer for the next question
    start(); // Start timer for the next question
  };

  const handleEndQuiz = () => {
    // store data first then go to result

    const answers = quiz.answer;

    const getTotalTime = () => {
      let count = 0;
      answers.forEach((x) => (count += x.time));
      return count;
    };
    const getTotalTrue = () => {
      let count = 0;
      answers.forEach((x) => {
        if (x.isCorrect) {
          count += 1;
        }
      });
      return count;
    };
    const total_time = getTotalTime();
    const total_true = getTotalTrue();

    quiz.setResult(total_time, total_true, quiz.quiz.questions.length);

    const payload: Submission = {
      quiz_id: quiz.quiz.share_id,
      answers: answers,
    };

    submit.mutate(payload);
  };

  const submit = useMutation({
    mutationFn: async (payload: Submission) => {
      quiz.resetQuiz();
      quiz.resetAnswer();
      const req = await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      });
      const res = await req.json();
      if (res.error) console.log(res.error);
      if (res.message) alert(res.message);
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push("/result");
      }, 1000);
    },
  });

  const q = useQuery({
    refetchOnMount: false,
    queryKey: ["quizzes", quiz.id],
    queryFn: async () => {
      const res = await fetch(`/api/quiz?share_id=${quiz.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })

      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    if (q.data && q.isSuccess) {
      quiz.setQuiz(q.data);
      setActive(quiz.sequence[0]);
    }
  }, [q.data, q.isSuccess])

  useEffect(() => {
    if ((quiz.answer.length === quiz.sequence.length) && quiz.answer.length) handleEndQuiz();
  }, [quiz.answer.length, quiz.sequence.length]);

  return (
    <FELayout
      topBar={
        isStarted ? (
          <div>{quiz.quiz.title}</div>
        ) : (
          <div
            className="p-1 px-3 bg-yellow-500 hover:bg-white text-black rounded-full cursor-pointer"
            onClick={() => handleStartQuiz()}
          >
            {l.gt('start')}
          </div>
        )
      }
      timeBar={
        <div className="text-xl font-light text-yellow-400">
          <CountdownTimer onEnd={() => handleEndQuiz()} onReset={() => {}} />
        </div>
      }
    >
      {isStarted ? (
        <div className="flex flex-col gap-6 text-yellow-400">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold">{l.gt('question')}</div>
            <div className="text-base font-light">
              {quiz.quiz.questions.find((x) => x.id === active)?.title}
            </div>
          </div>
          <div
            className={`grid grid-cols-${
              quiz.quiz.questions.find((x) => x.id === active)?.options.length
            } gap-4 font-light`}
          >
            {quiz.quiz.questions
              .find((x) => x.id === active)
              ?.options?.map((o: Option) => (
                <div
                  key={o.id}
                  className="h-56 cursor-pointer p-4 border-4 border-yellow-400 text-white font-bold rounded-xl flex justify-center items-center"
                  onClick={() => handleAnswer(quiz.quiz.questions.find((x) => x.id === active)?.title as string, o.text, o.id)}
                >
                  {o.text}
                </div>
              ))}
            {/* <div className="h-56 cursor-pointer p-4 border-4 border-yellow-400 bg-green-400 text-black font-bold rounded-xl flex justify-center items-center">
              Answer #2 Correct
            </div>
            <div className="h-56 cursor-pointer p-4 border-4 border-yellow-400 bg-red-500 text-black font-bold rounded-xl flex justify-center items-center">
              Answer #1 Wrong
            </div> */}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="text-2xl font-bold text-center">
              {quiz.quiz.title}
            </div>
            <div className="text-sm flex flex-col items-center gap-1">
              <div className="font-semibold">{l.gt('description')}</div>
              <div>{quiz.quiz.desc}</div>
            </div>
            <div className="text-3xl">
              {l.gt('totalQuestions')} {quiz.quiz.questions.length}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-xl">{l.gt('share')}</div>
            <div className="w-12 h-12 bg-green-300 cursor-pointer" />
            <div className="w-12 h-12 bg-red-300 cursor-pointer" />
            <div className="w-12 h-12 bg-white cursor-pointer" />
          </div>
        </div>
      )}
    </FELayout>
  );
};

export default ActionsPage;
