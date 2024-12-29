import FELayout from "@/components/fe/Layout";
import { LoginPayload, useAuthStore } from "@/stores/auth";
import useLocaleStore from "@/stores/locale";
import useRegister from "@/stores/register";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();
  const register = useRegister();
  const l = useLocaleStore();
  const { register: registerFn, message, error } = useAuthStore();
  const reg = useMutation({
    mutationFn: async (data: LoginPayload) => {
      await registerFn(data, () => router.push('/login'));
    },
  });
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
              name="password"
              placeholder="********"
              value={register.password}
              onChange={(e) => register.setPassword(e.target.value)}
            />
          </div>
          <div>
            <div className="text-xs">{l.gt('confirmPassword')}</div>
            <input
              type="password"
              className="outline-none p-2 text-xl w-full"
              name="confirm_password"
              placeholder="********"
              value={register.confirm_password}
              onChange={(e) => register.setPassword(e.target.value, true)}
            />
          </div>
          <div className="flex justify-end items-center gap-4">
            <Link href="/login" className="text-sm underline text-red-400">
              {l.gt('haveAccount')}
            </Link>
            <button className="bg-blue-400 text-white p-2 px-4 rounded-xl min-w-[100px]" disabled={reg.isPending} onClick={() => reg.mutate({
              username: register.username,
              password: register.password,
              confirm_password: register.confirm_password
            })}>
              {reg.isPending ? l.gt('loading') : l.gt('registerButton')}
            </button>
          </div>
        </div>
      </div>
    </FELayout>
  );
};

export default RegisterPage;
