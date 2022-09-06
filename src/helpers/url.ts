import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

/**
 * 对字符进行encode，但是除了@ : $ , + [ ]等除外
 * @param val 待转化的字符串
 * @returns 转化后的字符串
 */
function encode(val: string): string {
  return window
    .encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 以https:// 或者 // 开头的都是绝对路径
 * @param url
 * @returns
 */
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

/**
 * 拼接为完整路径
 * @param baseURL
 * @param relativeURL
 * @returns
 */
export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * 把params根据拼接规则paramsSerializer生成一个完整的url地址
 * @param url url地址
 * @param params 传递的参数
 * @param paramsSerializer 拼接规则
 * @returns
 */
export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    // 如果是URLSearchParams对象实例
    serializedParams = params.toString()
  } else {
    // 默认的拼接规则
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        // foreach里面的return表示跳到下一个循环
        return
      }
      // 把val的不同格式统一为数组格式
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach(val => {
        // isDate使用了谓词保护，所以val就是Data类型
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    // 去掉hash
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 针对 ？的处理
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
