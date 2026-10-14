import axios from 'axios'

export const api = axios.create({
  baseURL: '/data',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})
