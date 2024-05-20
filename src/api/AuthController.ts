import { AuthAxios } from "../utils/request";

export async function login (
  params: {
    username: string;
    password: string;
  },
) {
  return AuthAxios.post('login', params)
}

export async function profile () {
  return AuthAxios.get('profile')
}

export async function doAuth (
  params: {
    roleId: string;
    accessIds: string[];
  },
) {
  return AuthAxios.post('doAuth', params)
}