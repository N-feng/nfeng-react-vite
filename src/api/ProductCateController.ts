import { AuthAxios } from "../utils/request";

export async function queryProductCateList (
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
  return AuthAxios.post('productCate/findAll', params)
}

export async function queryProductById(id:number) {
  return AuthAxios.get(`productCate/findOne/${id}`)
}

export async function addProductCate(
  body?: any,
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_UserInfo_>('/productCate/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function queryProductCateOptions() {
  return AuthAxios.get('productCate/options')
}

export async function modifyProductCate(
  params: {
    // path
    id?: string,
  },
  body?: any,
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_UserInfo_>(`/productCate/update?id=${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function deleteProductCate (
  params: {
    // path
    /** userId */
    id?: string;
  },
  options?: { [key: string]: any },
) {
  return AuthAxios<API.Result_string_>('productCate/remove', {
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
  // return AuthAxios<API.Result_UserInfo_>('/productCate/upload', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: body,
  //   ...(options || {}),
  // });
  return AuthAxios.post('/productCate/upload', params)
}
