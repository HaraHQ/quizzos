import { useAuthStore } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect, useState } from "react";

interface Layout extends PropsWithChildren {
  timeBar?: any;
  time?: number;
  timeFn?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topBar?: any;
}

const FELayout: FC<Layout> = ({ children, timeBar, topBar }) => {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const auth = useAuthStore();
  const l = useLocaleStore();

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (auth.token === null && !['/login', '/register'].includes(router.asPath)) {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, [ready, auth.token, router]);

  if (!ready) return (
    <div className="h-screen w-full bg-black text-yellow-400 flex justify-center items-center">
      {l.gt('loading')}
    </div>
  )

  return (
    <div className="h-screen w-full bg-black text-white relative">
      <div className="fixed w-full p-6 px-8 bg-black justify-between items-center border-b-4 border-yellow-400 z-[1100] flex">
        <div className="text-3xl font-semibold">
          <Link href="/">QUIZZOS</Link>
        </div>
        <div className="flex gap-4 items-center">
          {timeBar}
          <div className="text-xl font-semibold">
            {topBar}
          </div>
        </div>
      </div>
      <div className="fixed top-0 left-0 right-0 h-[50vh] z-[1000] bg-red-300">
        <div className="inset-0 relative w-full h-full">
          <Image src="/dummy.jpg" fill alt="Quiz Name" />
          <div className="fixed inset-0 bg-gradient-to-b from-transparent via-gray-900 to-black" />
        </div>
      </div>
      <div className="fixed flex justify-center items-center inset-0 z-[1050]">
        <div className="p-16 bg-black border-4 border-yellow-400 shadow-xl rounded-xl">
          {children}
        </div>
      </div>
    </div>
  )
}

export default FELayout;
