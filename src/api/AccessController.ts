import { AuthAxios } from "../utils/request";

export async function queryAccessList (
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
  return AuthAxios.post('access/findAll', params)
}

export async function addAccess(
  body?: API.AccessInfo,
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_UserInfo_>('/access/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function modifyAccess(
  params: {
    // path
    id?: string;
  },
  body?: API.AccessInfo,
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_UserInfo_>(`/access/update/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function deleteAccess (
  params: {
    // path
    /** userId */
    id?: string;
  },
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_string_>('access/remove', {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
