import { isPlainObject } from './util'

/**
 * 因为new XMLHttpRequest().send(data)，参数data只能是一个字符串或者是一个blob之类的二进制数据，如果你传递是一个对象，需要把传递的对象data转化为字符串
 * @param data
 * @returns
 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 如果后台返回的data是字符串，这里将自动的转化为对象
 * @param data
 * @returns
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
      // throw e
    }
  }
  return data
}
