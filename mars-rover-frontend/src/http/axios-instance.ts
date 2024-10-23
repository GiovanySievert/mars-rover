import axios, { AxiosInstance } from 'axios'

export const axiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
