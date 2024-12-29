import ADLayout from "@/components/admin/Layout";
import { useAuthStore } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  PiCaretLeftFill,
  PiCaretRightFill,
  PiCursorClickBold,
} from "react-icons/pi";

const QuizDetailById = () => {
  const router = useRouter();

  const { id } = router.query;

  const auth = useAuthStore();
  const l = useLocaleStore();
  const quizWithResponse = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const req = await fetch(`/api/admin/quiz/${id}/with-responses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const res = await req.json();
      return res;
    },
    refetchOnMount: false
  })

  const getTotalTime = (answers: any[]) => {
    let count = 0;
    answers.map((x) => (count += x.time));
    return count;
  };
  const getTotalTrue = (answers: any[]) => {
    let count = 0;
    answers.map((x, index) => {
      if (x.isCorrect) {
        count += 1;
      }
    });
    return count;
  };
  return (
    <ADLayout>
      <div className="grid grid-cols-8 gap-4 w-full">
        <div className="col-span-6 bg-white p-2 border-2 border-black rounded-xl">
          <div className="text-3xl font-semibold">{l.gt('submittedResponse')}</div>
          <div className="my-4">
            <div className="grid grid-cols-8 text-lg">
              <div className="bg-gray-300 font-semibold p-2 col-span-1">{l.gt('select')}</div>
              <div className="bg-gray-300 font-semibold p-2 col-span-3">{l.gt('name')}</div>
              <div className="bg-gray-300 font-semibold p-2 col-span-2" title={l.gt('TELinfo')}>TEL*</div>
              <div className="bg-gray-300 font-semibold p-2 col-span-2">
                {l.gt('correctnessScore')}
              </div>
            </div>
            {quizWithResponse.isSuccess && quizWithResponse.data.responses.map((data: any, index: number) => (
              <div key={index} className="grid grid-cols-8 text-lg">
                <div className="bg-gray-200 p-2 col-span-1">
                  <Link href={`/admin/quiz/${quizWithResponse.data.quiz.id}/responses/${data.answers.id}`}>
                    <div className="bg-yellow-500 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer">
                      <PiCursorClickBold className="text-white" />
                    </div>
                  </Link>
                </div>
                <div className="bg-gray-200 p-2 col-span-3">{data.user.username}</div>
                <div className="bg-gray-200 p-2 col-span-2">
                  {getTotalTime(data.answers.data)} {l.gt('seconds')}
                  </div>
                <div className="bg-gray-200 p-2 col-span-2">
                  {getTotalTrue(data.answers.data)}/{data.answers.length} (-)
                </div>
              </div>
            ))}
          </div>
          {/* <div className="flex justify-end items-center">
            <div className="flex w-36 items-center justify-end gap-4">
              <div className="bg-yellow-400 text-white p-2 cursor-pointer">
                <PiCaretLeftFill />
              </div>
              <div className="bg-yellow-400 text-white p-2 cursor-pointer">
                <PiCaretRightFill />
              </div>
            </div>
          </div> */}
        </div>
        <div className="col-span-2 bg-white h-full p-2 border-2 border-black rounded-xl">
          <div className="flex flex-col gap-4 flex-1">
            <div>
              <div className="text-sm">{l.gt('quizTitle')}</div>
              <input
                type="text"
                className="outline-none p-2 text-xl w-full border-black border-2"
                name="title"
                value={quizWithResponse.data?.quiz.title}
                disabled
              />
            </div>
            <div>
              <div className="text-sm">{l.gt('description')}</div>
              <textarea
                className="outline-none p-2 text-xl w-full border-black border-2 h-[125px]"
                disabled
                value={quizWithResponse.data?.quiz.desc}
              />
            </div>
            {/* <div>
              <div className="text-sm">Featured Image:</div>
              <div className="w-full h-[150px] relative">
                <Image
                  src={"/dummy.jpg"}
                  fill
                  alt="quiz image"
                  className="rounded-lg"
                />
              </div>
            </div> */}

            <div className="flex flex-col gap-2">
              <Link href={`/admin/quiz`}>
                <div className="text-center bg-black text-white p-4 shadow-md cursor-pointer">
                  {l.gt('backToMyQuizzes')}
                </div>
              </Link>
              <Link href={`/admin/quiz/${id}/edit`}>
                <div className="text-center bg-red-700 text-white p-4 shadow-md cursor-pointer">
                  {l.gt('editQuiz')}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ADLayout>
  );
};

export default QuizDetailById;
