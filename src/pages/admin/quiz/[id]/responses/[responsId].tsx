import ADLayout from "@/components/admin/Layout";
import { useAuthStore } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PiExclamationMarkFill, PiSealCheckBold } from "react-icons/pi";

const QuizDetailById = () => {
  const router = useRouter();
  const { responsId, id } = router.query;

  const [data, setData] = useState<Record<string, any>>();

  const auth = useAuthStore();
  const l = useLocaleStore();
  const quizWithResponse = useQuery({
    queryKey: ["quiz", id, "response", responsId],
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
  });

  useEffect(() => {
    if (quizWithResponse.isSuccess) {
      const specific = quizWithResponse.data.responses.find((x: Record<string, any>) => `${x.answers.id}` === responsId)
      setData(specific);
    }
  }, [quizWithResponse.isSuccess, quizWithResponse.data])

  return (
    <ADLayout>
      <div className="grid grid-cols-8 gap-4 w-full">
        <div className="col-span-6 bg-white p-2 border-2 border-black rounded-xl">
          <div className="text-xl font-semibold">
            {
              data?.user && (
                <>
                {l.gt('submittedResponseBy')} {data?.user?.username} @ {data?.answers?.created_at}
                </>
              )
            }
            {/* Submitted Response by: {quizWithResponse.data.user.username} @ 27 Dec 2024 12:45 */}
          </div>
          <div className="grid grid-cols-2 gap-2 font-light mt-4">
            {data?.answers && data?.answers?.data?.map((ans: Record<string, any>) => (
              <div key={ans.id} className="bg-gray-200 p-3 border-2 border-black rounded-2xl space-y-1">
                <div>
                  <div className="font-bold">{l.gt('question')}</div>
                  <div>{ans.question || '-'}</div>
                </div>
                <div className="flex items-center font-light">
                  <span className="font-bold mr-1">{l.gt('answer')}</span> {ans.answer || '-'}
                  {ans.isCorrect && <PiSealCheckBold className="text-green-500" />}
                  {!ans.isCorrect && <PiExclamationMarkFill className="text-red-500" />}
                </div>
                <div className="flex items-center font-light">
                  <span className="font-bold mr-1">{l.gt('speed')}</span> {ans.time} {l.gt('seconds')}
                </div>
              </div>
            ))}
          </div>
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
                value={quizWithResponse.data?.quiz.desc}
                disabled
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
              {quizWithResponse.isSuccess && (
                <Link href={`/admin/quiz/${quizWithResponse.data.quiz.id}`}>
                  <div className="text-center bg-black text-white p-4 shadow-md cursor-pointer">
                    {l.gt('backToQuizDetail')}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </ADLayout>
  );
};

export default QuizDetailById;
