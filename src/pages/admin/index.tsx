import ADLayout from "@/components/admin/Layout"
import LanguageToggler from "@/components/LanguageToggler"
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react"
import { Quiz } from "../api/admin/quiz/[share_id]";
import useLocaleStore from "@/stores/locale";

const AdminPage = () => {
  const auth = useAuthStore();
  const l = useLocaleStore();
  const quiz = useQuery({
    queryKey: ["quiz"],
    queryFn: async () => {
      const res = await fetch("/api/admin/quiz", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return res.json();
    }
  })
  return (
    <ADLayout>
      <div className="w-full bg-white rounded-2xl h-full p-8 shadow-lg relative md:w-[60vw] mx-auto">
        <div className="flex justify-between">
          <div className="text-2xl font-semibold">{l.gt('activeQuiz')}</div>
          <LanguageToggler />
        </div>
        <div className="py-8">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-200 h-36 w-full" />
            <div className="bg-gray-200 h-36 w-full" />
            <div className="bg-gray-200 h-36 w-full" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{l.gt('latestQuizzesMade')}</div>
        </div>
        <div className="flex flex-col gap-1 py-2">
          {quiz.isSuccess && quiz.data?.map((item: Quiz) => (
            <Link key={item.id} href={`/admin/quiz/${item.share_id}`} className="text-xl font-light flex justify-between items-center hover:bg-gray-200">
              <div>{item.title}</div>
              <div>{item.created_at}</div>
            </Link>
          ))}
        </div>
      </div>
    </ADLayout>
  )
}

export default AdminPage