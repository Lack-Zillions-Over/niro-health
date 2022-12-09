import { setCookie, getCookie, deleteCookie } from 'cookies-next';

import options from '@/cache/cookies/options';

export default function GlobalCookies() {
  return {
    set: (key: string, value: string) => setCookie(key, value, options),
    get: (key: string) => getCookie(key, options),
    prune: (key: string) => deleteCookie(key, options)
  } as const;
}
