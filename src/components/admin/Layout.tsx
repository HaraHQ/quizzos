import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  PiCardsDuotone,
  PiFactoryDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";
import LanguageToggler from "../LanguageToggler";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";

const ADLayout: FC<PropsWithChildren> = ({ children }) => {
  const [menu, setMenu] = useState<boolean>(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const auth = useAuthStore();
  const l = useLocaleStore();

  useEffect(() => {
    if (auth.token === null) {
      setReady(false);
      router.push("/");
    }
    setReady(true);
  }, []);

  const handleLogout = () => {
    auth.clear();
    router.push("/");
  };

  if (!ready)
    return (
      <div className="h-screen w-full bg-gray-200 text-black flex justify-center items-center">
        {l.gt('loading')}
      </div>
    );
  return (
    <div className="bg-gray-200 min-h-screen w-full">
      {menu && (
        <div className="fixed h-screen inset-0 z-[2000]">
          <div
            className="fixed inset-0 bg-gradient-to-b from-black/80 via-gray-900/70 to-black/60"
            onClick={() => setMenu(false)}
          />
          <div className="flex justify-center items-center h-full">
            <div className="p-4 bg-white rounded-xl shadow-lg w-[500px] z-[2100] flex flex-col gap-6">
              <div className="flex justify-between">
                <div className="text-2xl font-semibold">{l.gt('configuration')}</div>
                <LanguageToggler />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold">
                  {l.gt('maxQuizAllocation')}
                </div>
                <div className="text-xl font-light">
                  1<span className="font-semibold" title="Dummy">/3</span>
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold">{l.gt('upgradeAccount')}</div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="border-2 border-yellow-400 rounded-lg flex flex-col justify-center items-center p-2">
                    <div>👑</div>
                    <div>{l.gt('gold')}</div>
                    <div>{l.gt('account')}</div>
                    <div className="text-sm">Unlimited Quizes</div>
                    <div className="mt-5">Rp 10.000</div>
                  </div>
                  <div className="border-2 border-gray-400 rounded-lg flex flex-col justify-center items-center p-2">
                    <div>⚔️</div>
                    <div>{l.gt('silver')}</div>
                    <div>{l.gt('account')}</div>
                    <div className="text-sm">10 Quizes</div>
                    <div className="mt-5">Rp 7.500</div>
                  </div>
                  <div className="border-2 border-black rounded-lg flex flex-col justify-center items-center p-2">
                    <div>🗿</div>
                    <div>{l.gt('basic')}</div>
                    <div>{l.gt('account')}</div>
                    <div className="text-sm">3 Quizes</div>
                    <div className="mt-5">{l.gt('free')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-black p-2 text-center text-white text-lg cursor-pointer" onClick={() => handleLogout()}>
                {l.gt('logout')}
              </div>
              <Link href={"/"}>
                <div className="bg-black p-2 text-center text-white text-lg cursor-pointer" onClick={() => handleLogout()}>
                  {l.gt('goToQuizPage')}
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md w-full py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href={"/admin/quiz"} className="flex items-center gap-2">
            <PiCardsDuotone className="text-2xl" />
            <div className="text-xl font-light">{l.gt('myQuizzes')}</div>
          </Link>
          <Link href={"/admin/quiz/create"} className="flex items-center gap-2">
            <PiFactoryDuotone className="text-2xl" />
            <div className="text-xl font-light">{l.gt('createQuiz')}</div>
          </Link>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setMenu(true)}
        >
          <div className="text-xl font-light">{auth.username}</div>
          <PiUserCircleDuotone className="text-2xl" />
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
};

export default ADLayout;
