import ADLayout from "@/components/admin/Layout";
import { Quiz } from "@/pages/api/admin/quiz/[share_id]";
import { useAuthStore } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CiExport, CiViewTable } from "react-icons/ci";
import { PiEye } from "react-icons/pi";

const AdminQuizList = () => {
  const auth = useAuthStore();
  const l = useLocaleStore();
  const [showUrl, setShowUrl] = useState<string | null>(null);
  const list = useQuery({
    queryKey: ["quiz-list"],
    queryFn: async () => {
      const res = await fetch("/api/admin/quiz", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      return data;
    },
  });
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Quiz ID is copied')
  };
  return (
    <ADLayout>
      {showUrl && (
        <div className="fixed h-screen inset-0 z-[2000]">
          <div
            className="fixed inset-0 bg-gradient-to-b from-black/80 via-gray-900/70 to-black/60"
            onClick={() => setShowUrl(null)}
          />
          <div className="flex justify-center items-center h-full">
            <div className="p-4 bg-white rounded-xl shadow-lg w-[500px] z-[2100] flex flex-col gap-6 text-3xl font-semibold cursor-pointer active:text-blue-500 hover:text-red-500" onClick={() => copyToClipboard(showUrl)}>
              {l.gt('quidID')} {showUrl}
              <div className="text-xs">{l.gt('clickToCopy')}</div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end mb-4">
        <Link href="/admin/quiz/create">
          <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl">
          {l.gt('createQuiz')}
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {list.data?.map((item: Quiz) => (
          <div
            key={item.share_id}
            className="bg-gray-500 h-48 w-full rounded-xl relative"
          >
            <Image
              src={"/dummy.jpg"}
              fill
              alt="quiz image"
              className="rounded-xl z-[200]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent rounded-xl via-gray-800/70 to-black flex p-2 z-[201]">
              <div className="relative w-full h-full">
                <div className="absolute top-0 right-0">
                  <Link href={`/admin/quiz/${item.share_id}`}>
                    <CiViewTable className="text-white text-2xl z-[210] cursor-pointer" />
                  </Link>
                </div>
                <div className="absolute top-8 right-0">
                  <div onClick={() => setShowUrl(item.share_id as string)}>
                    <CiExport className="text-white text-2xl z-[210] cursor-pointer" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 text-white text-xl font-semibold z-[210] w-full">
                  <div className="text-2xl font-extrabold">{item.title}</div>
                  {/* <div className="text-base font-light flex items-center justify-between">
                    <div>{l.gt('createdAt')} {item.created_at}</div>
                    <div className="flex gap-1 items-center text-sm">
                      <div>0</div>
                      <PiEye className="text-lg" />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-gray-500 h-48 w-full rounded-xl" />
        <div className="bg-gray-500 h-48 w-full rounded-xl" />
        <div className="bg-gray-500 h-48 w-full rounded-xl" />
      </div>
    </ADLayout>
  );
};

export default AdminQuizList;
