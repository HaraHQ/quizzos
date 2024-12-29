import FELayout from "@/components/fe/Layout";
import { useAuthStore } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";
import useQuizStore from "@/stores/quiz";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const HomePage = () => {
  const router = useRouter();
  const auth = useAuthStore();
  const quizStore = useQuizStore();
  const l = useLocaleStore();
  const [quiz, setQuiz] = useState<string | null>(null);

  const handleQuizId = () => {
    if (quiz||quiz!=="") {
      quizStore.setId(quiz as string);
      router.replace(`/actions?id=${quiz}`)
    }
  };
  return (
    <FELayout
      topBar={
        <>
          {auth.token ? (
            <div
              className="p-1 px-3 bg-yellow-500 hover:bg-white text-black rounded-full cursor-pointer"
              onClick={() => auth.clear()}
            >
              {l.gt('logoutButton')}
            </div>
          ) : (
            <Link
              href={"/login"}
              className="p-1 px-3 bg-yellow-500 hover:bg-white text-black rounded-full cursor-pointer"
            >
              {l.gt('loginButton')}
            </Link>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="p-2 border-black border-2 rounded-lg text-black"
          placeholder={l.gt('inputQuizID')}
          value={quiz as string}
          onChange={(e) => setQuiz(e.target.value)}
        />
        <div className="p-1 px-3 bg-yellow-500 hover:bg-blue-500 text-black rounded-full cursor-pointer text-center" onClick={() => handleQuizId()}>
          {l.gt('getQuiz')}
        </div>
        {auth.token && (
          <Link
            href={`/admin`}
            className="p-1 px-3 bg-yellow-500 hover:bg-blue-500 text-black rounded-full cursor-pointer text-center"
          >
            {l.gt('makeQuiz')}
          </Link>
        )}
      </div>
    </FELayout>
  );
};

export default HomePage;
