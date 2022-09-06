import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

/**
 * 格式化headers里面的属性名，比如content-type转化为Content-Type
 * @param headers 请求头
 * @param normalizeName 需要格式化的属性
 */
function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 在把传递的data对象转化为字符串之前，需要根据data的类型来设置请求头的content-type，默认是text/plain，但是这个类型后端是无法识别的，所以需要设置为application/json
 * @param headers
 * @param data
 * @returns
 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * 后台返回的响应头是一个字符串，需要解析成对象的形式
 * @param headers 字符串的headers
 * @returns headers对象
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    const val = vals.join(':').trim()
    parsed[key] = val
  })
  return parsed
}

/**
 * 把header对象打平
 * @param headers
 * @param method
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
