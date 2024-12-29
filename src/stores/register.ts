import { create } from "zustand";

interface Register {
  username: string;
  password: string;
  confirm_password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string, confirm?: boolean) => void;
  clear: () => void;
}

const useRegister = create<Register>((set) => ({
  username: "",
  password: "",
  confirm_password: "",
  setUsername: (username) => set({ username }),
  setPassword: (password, confirm) => set(confirm ? { confirm_password: password } : { password }),
  clear: () => set({ username: "", password: "", confirm_password: "" }),
}));

export default useRegister;