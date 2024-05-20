import { AuthAxios } from "../utils/request";

export async function queryUserList (
  params: {
    // query
    /** keyword */
    keyword?: string;
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  },
) {
  return AuthAxios.post('user/findAll',  params)
}

export async function addUser(
  body?: API.UserInfo,
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_UserInfo_>('/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getUserDetail(
  params: {
    // path
    /** userId */
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return AuthAxios<API.Result_UserInfo_>(`/api/v1/user/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function modifyUser(
  params: {
    // path
    /** userId */
    userId?: string;
  },
  body?: API.UserInfo,
  options?: { [key: string]: any },
) {
  const { userId } = params;
  return AuthAxios<API.Result_UserInfo_>(`/user/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function deleteUser (
  params: {
    // path
    /** userId */
    id?: string;
  },
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_string_>('user/remove', {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}