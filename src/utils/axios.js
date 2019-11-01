import axios from 'axios'
import storage from './storage'

let instance = axios.create({})



instance.interceptors.request.use(
  config => {
    //在所有请求头部添加token值
    //console.log(config.url)
    const token = storage.get('token') || 0
    config.headers.token = token;
    
    return config
  },
  error => {
    return Promise.reject(error)
  })

export default instance
