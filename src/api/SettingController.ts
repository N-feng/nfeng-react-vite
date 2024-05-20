import { AuthAxios } from "../utils/request";

export async function querySettingList (
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
  return AuthAxios.post('setting/findAll', params)
}

export async function querySettingById(id:number) {
  return AuthAxios.get(`setting/findOne?id=${id}`)
}

export async function addSetting(
  body?: any,
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_UserInfo_>('/setting/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function modifySetting(
  params: {
    // path
    id?: string,
  },
  body?: any,
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_UserInfo_>(`/setting/update?id=${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function deleteSetting (
  params: {
    // path
    /** userId */
    id?: string;
  },
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_string_>('setting/remove', {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function uploadFile(
  // body?: any,
  // options?: { [key: string]: any },
  params: any
) {
  // return AuthAxios<API.Result_UserInfo_>('/setting/upload', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: body,
  //   ...(options || {}),
  // });
  return AuthAxios.post('/setting/upload', params)
}
