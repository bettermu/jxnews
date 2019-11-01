export const apiPath = process.env.NODE_ENV === 'production' ? 'http://10.4.186.162:8086/zhgl-rest' : '/zhgl-rest';
export const shPath = process.env.NODE_ENV === 'production' ? 'http://10.4.186.162:8086/shop-rest' : '/shop-rest';
//export const apiPath = process.env.NODE_ENV === 'production' ? 'www.iflyota.com:8086' : '';
//export const apiPath = process.env.NODE_ENV === 'production' ? 'http://112.35.23.17:9100' : '';
//http://www.iflysec.com
//export const shPath = process.env.NODE_ENV === 'production' ? 'http://ahjxly.iflysec.com/shop-rest' : '/shop-rest';
//export const apiPath = process.env.NODE_ENV === 'production' ? 'http://ahjxly.iflysec.com/zhgl-rest' : '/zhgl-rest';
export const pubPath = process.env.NODE_ENV === 'production' ? '/st-news/news' : '';
export const shopPath = process.env.NODE_ENV === 'production' ? 'http://10.4.186.162:8086/st-shopPortal/#/' : 'http://localhost:8081/#/';
//export const shopPath = process.env.NODE_ENV === 'production' ? 'http://ahjxly.iflysec.com/st-shopPortal/#/' : 'http://localhost:8080';