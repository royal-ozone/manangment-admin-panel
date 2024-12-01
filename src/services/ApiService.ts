import axios, { AxiosError, AxiosRequestHeaders } from 'axios'
import cookie from 'react-cookies'
import { ParamsType } from 'src/types'
const api = process.env.REACT_APP_API
const managementAPI = process.env.REACT_APP_MANAGEMENT_API
import { isJwtExpired } from 'jwt-check-expiration'

axios.defaults.headers.common.locale = 'en'
export default class ApiService {
  constructor() {
    axios.interceptors.request.use(async (config) => {
      const locale = localStorage.getItem('i18nextLng') ?? 'en'
      if (config.headers?.Authorization) {
        config.headers.locale = locale
        return config
      }
      config.headers = this.bearer(await this.token())
      return config
    })
  }
  async get(
    path: { management: boolean; endpoint: string } | string,
    params?: ParamsType,
    header?: AxiosRequestHeaders,
  ) {
    try {
      let res = await axios({
        method: 'get',
        url:
          typeof path !== 'string' && path?.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path ?? ''}`,
        params: this.getPopulatedStore(params),
        headers: header,
      })
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }
  async post(
    path: string | { management: boolean; endpoint: string },
    data?: { [key: string]: any } | null | undefined,
    header?: AxiosRequestHeaders,
    params?: ParamsType,
  ) {
    try {
      let res = await axios({
        method: 'post',
        url:
          typeof path !== 'string' && path.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path}`,
        data: data,
        headers: header,
        params: params,
      })
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }

  async update(
    path: string | { management: boolean; endpoint: string },
    data: { [key: string]: any },
    params?: ParamsType,
  ) {
    try {
      let res = await axios({
        method: 'put',
        url:
          typeof path !== 'string' && path.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path}`,
        params: params,
        data: data,
      })
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }

  async patch(
    path: string | { management: boolean; endpoint: string },
    data: { [key: string]: any },
    params?: ParamsType,
  ) {
    try {
      let res = await axios({
        method: 'patch',
        url:
          typeof path !== 'string' && path.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path}`,
        params: params,
        data: data,
      })
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }

  async delete(
    path: string | { management: boolean; endpoint: string },
    data?: { [key: string]: any },
    params?: ParamsType,
  ) {
    try {
      let res = await axios({
        method: 'delete',
        url:
          typeof path !== 'string' && path.management
            ? `${managementAPI}/${path.endpoint}`
            : `${api}/${path}`,
        data: data,
        params: params,
      })
      return res.data
    } catch (error: AxiosError | any) {
      throw new Error(error.response.message)
    }
  }

  bearer(token?: string): AxiosRequestHeaders {
    if (!!token && typeof token === 'string') {
      return { Authorization: `Bearer ${token}` }
    } else return {}
  }

  basic(data: { email: string; password: string }) {
    return { Authorization: `Basic ${btoa(`${data.email}:${data.password}`)}` }
  }
  getPopulatedStore(data: { store_id?: string; duration?: string } & ParamsType = {}) {
    const extendedParams = { ...data }
    const store = cookie.load('populated-store')
    const duration = cookie.load('duration')
    if (store) {
      extendedParams.store_id = store.id
    }
    if (duration) {
      extendedParams.duration = duration
    }
    return extendedParams
  }
  async token(): Promise<string | undefined> {
    let token = cookie.load('access_token')
    if (!token) return
    if (!isJwtExpired(token)) {
      return token
    } else {
      await ApiService.refresh()
    }
  }
  static async refresh() {
    const api = new ApiService()
    try {
      const { refresh_token, access_token, status, message } = await api.post(
        { endpoint: 'refresh', management: true },
        null,
        api.bearer(cookie.load('refresh_token')),
      )
      if (status === 200) {
        cookie.save('access_token', access_token, { path: '/' })
        cookie.save('refresh_token', refresh_token, { path: '/' })
        return access_token
      } else throw new Error(message)
    } catch (error) {
      cookie.remove('access_token', { path: '/' })
      cookie.remove('refresh_token', { path: '/' })
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }
}
