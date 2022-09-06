import { AxiosTransformer } from '../types'

/**
 * 用户可以对请求和相应的data和headers修改
 * @param data 请求体或者相应数据
 * @param headers 请求头和相应头
 * @param fns 转换函数
 * @returns
 */
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  // 如果没有转换函数，则直接返回
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  // 所有的方法都是同步的
  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
