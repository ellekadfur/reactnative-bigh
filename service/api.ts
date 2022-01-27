import axios from 'axios'
import { Config } from './Config'

const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
})

export default api