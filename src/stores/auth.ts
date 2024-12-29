export interface LoginPayload {
  username: string;
  password: string;
  confirm_password?: string;
}

interface AuthStore {
  token: string | null;
  message: string | null;
  error: string | null;
  username: string | null;
  userid: string | null;
  locale: string;
  setToken: (token: string) => void;
  login: (payload: LoginPayload, cb: () => void) => Promise<void>;
  register: (payload: LoginPayload, cb: () => void) => Promise<void>;
  clear: (messageOnly?: boolean) => void;
  verifyToken: (token: string) => Promise<JWTVerified>;
}

export interface JWTVerified {
  username: string;
  id: string;
  locale: string;
}

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import useRegister from './register';
import useLocaleStore from './locale';

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      token: null,
      username: null,
      userid: null,
      message: null,
      error: null,
      locale: 'EN',
      setToken: (token: string) => set({ token }),
      clear: (messageOnly) => {
        const where = { message: null, error: null };
        if (messageOnly) {
          set(where);
          return;
        }
        set({ ...where, token: null });
      },
      login: async (payload: LoginPayload, cb) => {
        get().clear();
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        const data = await response.json()
        
        if (data.error) {
          set({ error: data.error })
          return
        }

        if (data.token) {
          const decoded = await get().verifyToken(data.token);
          
          set({ token: data.token, username: decoded.username, userid: decoded.id, locale: decoded.locale })
          useRegister.getState().clear();
          useLocaleStore.getState().setLocale(decoded.locale);
          get().clear(true);
          return cb();
        }
      },
      register: async (payload, cb) => {
        get().clear();
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        const data = await response.json()

        if (data.error) {
          set({ error: data.error })
          return
        }

        if (data.message) {
          set({ message: data.message })
          useRegister.getState().clear();
          get().clear();
          return cb();
        }
      },
      verifyToken: async (token: string) => {
        const request = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const json = await request.json();

        return json.user as JWTVerified;
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)