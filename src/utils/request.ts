import axios from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { errorHandler, responseHandler } from './errorHandle'

const UMI_APP_API_URL = process.env.UMI_APP_API_URL

export const baseURL = `${UMI_APP_API_URL || ''}/api`

export const getToken = () => {
  return localStorage.getItem("token") as string
}

const config: AxiosRequestConfig = {
  baseURL,
  timeout: 60000
}

export const AuthAxios = axios.create({ ...config, baseURL: `${baseURL}/admin` })
export const PublicAxios = axios.create({ ...config, baseURL: `${baseURL}/server`})

AuthAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 一般会请求拦截里面加token，用于后端的验证
    const token = getToken();
    if (token)  {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err: any) => {
    // 请求错误，这里可以用全局提示框进行提示
    return err;
  }
)

const onSuccess = (res: AxiosResponse) => {
  // 直接返回res，当然你也可以只返回res.data
  // 系统如果有自定义code也可以在这里处理
  responseHandler(res.data);
  return res.data;
}

const onError = (err: any) => {
  errorHandler(err);
  // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
  return err.response;
}

AuthAxios.interceptors.response.use(onSuccess, onError);
PublicAxios.interceptors.response.use(onSuccess, onError);