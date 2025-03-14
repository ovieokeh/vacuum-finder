declare module "redux-persist-cookie-storage" {
  export class CookieStorage {
    constructor(cookies: CookiesStatic, options?: any) {
      this.cookies = cookies;
      this.options = options;
    }
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    getAllKeys: () => string[];
  }
}
