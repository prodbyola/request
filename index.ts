import { API_URL } from 'src/env'
import axios, { AxiosError } from 'axios'

export class ApiService {
    private static instance: ApiService

    static find(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService()
        }

        return ApiService.instance
    }

    async request(opts: {
        path: string
        method: 'GET' | 'POST' | 'PUT' | 'PATCH'
        data?: unknown
        token?: string
    }) {
        const { method, data, path, token } = opts
        const config = {
            headers: {
                'X-Access-Token': token,
                'Content-Type': 'application/json'
            }
        }

        const url = this.buildUrl(path)
        let req = undefined

        if (method === 'POST') req = axios.post(url, JSON.stringify(data), config)
        else if (method === 'GET') req = axios.get(url, config)
        else if (method === 'PUT') req = axios.put(url, data, config)
        else if (method === 'PATCH') req = axios.patch(url, data, config)


        return await req
    }

    private buildUrl(path: string) {
        return API_URL + path
    }

    static extractErrorMessage(err: AxiosError): string {
        const resp = err.response
        let msg: string | undefined

        if (resp) msg = (resp.data as { message: string }).message
        else msg = err.message

        return msg
    }
}
