import { useAuthStore } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";

const LanguageToggler: FC = () => {
  const l = useLocaleStore();
  const auth = useAuthStore();
  const change = useMutation({
    mutationFn: async (locale: string) => {
      const req = await fetch("/api/admin/update-locale", {
        method: "POST",
        body: JSON.stringify({ locale }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const res = await req.json();
      return res;
    },
    onSuccess: (data) => {
      l.setLocale(data.locale);
    },
  });
  const handleChange = (locale: string) => {
    change.mutate(locale);
  };
  return (
    <div className="flex items-center gap-4">
      <div className={`text-xl font-light`}>{l.gt('locale')}</div>
      <div className={`flex items-center bg-gray-500 w-[50px] p-1 rounded-full`}>
        {l.locale === "EN" && (
          <div className="bg-white cursor-pointer rounded-full w-4 h-4" onClick={() => handleChange("AR")} />
        )}
        {l.locale === "AR" && (
          <div className="bg-white cursor-pointer rounded-full w-4 h-4" onClick={() => handleChange("EN")} />
        )}
      </div>
    </div>
  )
}

export default LanguageToggler;