import FELayout from "@/components/fe/Layout";
import { useAuthStore, LoginPayload } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";
import useRegister from "@/stores/register";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();
  const register = useRegister();
  const l = useLocaleStore();
  const { login: loginFn, message, error } = useAuthStore();
  const log = useMutation({
    mutationFn: async (data: LoginPayload) => {
      await loginFn(data, () => router.push("/"));
    },
  });
  useEffect(() => {
    register.clear();
  }, []);
  return (
    <FELayout>
      <div className="flex flex-col items-center gap-12">
        <Image src="/dummy.jpg" width={200} height={70} alt="Quizzos" />
        {message && <div className="text-yellow-400">{message}</div>}
        {error && <div className="text-red-400">{error}</div>}
        <div className="flex flex-col gap-6 w-[400px] text-black">
          <div>
            <div className="text-xs">{l.gt('username')}:</div>
            <input
              type="text"
              className="outline-none p-2 text-xl w-full"
              placeholder={l.gt('username')}
              value={register.username}
              onChange={(e) => register.setUsername(e.target.value)}
            />
          </div>
          <div>
            <div className="text-xs">{l.gt('password')}:</div>
            <input
              type="password"
              className="outline-none p-2 text-xl w-full"
              placeholder="********"
              value={register.password}
              onChange={(e) => register.setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end items-center gap-4">
            <Link href="/register" className="text-sm underline text-red-400">
              {l.gt('registerNewAccount')}
            </Link>
            <button className="bg-blue-400 text-white p-2 px-4 rounded-xl min-w-[100px]" disabled={log.isPending} onClick={() => log.mutate({
              username: register.username,
              password: register.password
            })}>
              {log.isPending ? l.gt('loading') : l.gt('loginButton')}
            </button>
            
          </div>
        </div>
      </div>
    </FELayout>
  );
};

export default LoginPage;
