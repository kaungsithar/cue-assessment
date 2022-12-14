import { User } from "../queries/user";

const localStorageKey = "gh_token";

export function setAccessToken(token: string) {
  localStorage.setItem(localStorageKey, token);
}
export function getAccessToken() {
  return localStorage.getItem(localStorageKey);
}

export function clearAccessToken() {
  localStorage.removeItem(localStorageKey);
  localStorage.removeItem("user");
}


export const UserService = {
  saveInfo(data: User){
    localStorage.setItem("user",JSON.stringify(data));
  },
  get(){
    try { 
      const user = localStorage.getItem("user") ?? "";
      return JSON.parse(user) as User;
    }catch(e){
      console.error(e);
      return null;
    }
  }
}