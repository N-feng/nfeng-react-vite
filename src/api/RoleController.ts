import { AuthAxios } from "../utils/request";

export async function queryRoleList (
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
  return AuthAxios.post('role/findAll',  params)
}

export async function profile () {
  return AuthAxios.get('profile')
}
