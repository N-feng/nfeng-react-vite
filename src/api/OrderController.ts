import { PublicAxios } from "../utils/request";

export async function queryOrderList (
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
  return PublicAxios.post('order/findAll', params)
}

export async function addOrder(
  body?: any,
  options?: { [key: string]: any },
) {
  return PublicAxios<API.Result_UserInfo_>('/order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function modifyOrder(
  params: {
    // path
    id?: string;
  },
  body?: any,
  options?: { [key: string]: any },
) {
  return PublicAxios<API.Result_UserInfo_>(`/order/update/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function deleteOrder (
  params: {
    // path
    /** userId */
    id?: string;
  },
  options?: { [key: string]: any },
) {
  return PublicAxios<API.Result_string_>('order/remove', {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
