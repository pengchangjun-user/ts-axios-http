import { isAbsoluteURL, buildURL, isURLSameOrigin, combineURL } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should suport null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(buildURL('/foo', { foo: 'bar', bar: 'foo' })).toBe('/foo?foo=bar&bar=foo')
    })

    test('should ignore if some param value is null', () => {
      expect(
        buildURL('/foo', {
          foo: 'bar',
          bar: null
        })
      ).toBe('/foo?foo=bar')
    })

    test('should support object params', () => {
      expect(
        buildURL('/foo', {
          foo: {
            bar: 'bar'
          }
        })
      ).toBe('/foo?foo=' + encodeURI('{"bar":"bar"}'))
    })

    test('should support date params', () => {
      const date = new Date()
      expect(buildURL('/foo', { date: date })).toBe('/foo?date=' + date.toISOString())
    })

    test('should support array params', () => {
      expect(
        buildURL('/foo', {
          foo: ['foo', 'bar']
        })
      ).toBe('/foo?foo[]=foo&foo[]=bar')
    })

    test('should support special char params', () => {
      expect(
        buildURL('/foo', {
          foo: '@:$, '
        })
      ).toBe('/foo?foo=@:$,+')
    })

    test('should support existing params', () => {
      expect(
        buildURL('/foo?foo=bar', {
          bar: 'bar'
        })
      ).toBe('/foo?foo=bar&bar=bar')
    })

    test('should correct discard url hash mark', () => {
      expect(
        buildURL('/foo?foo=bar#hash', {
          query: 'bar'
        })
      ).toBe('/foo?foo=bar&query=bar')
    })

    test('should use paramsSerializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = {
        foo: 'bar'
      }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if url begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://api.github.com/users')).toBeTruthy()
    })

    test('should return false if url begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })

    test('should return true if url is protocal-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })

    test('should return false if url is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    test('should combine url', () => {
      expect(combineURL('https://baidu.com', '/users')).toBe('https://baidu.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineURL('https://baidu.com/', '/users')).toBe('https://baidu.com/users')
    })

    test('should insert missing slash', () => {
      expect(combineURL('https://baidu.com', 'users')).toBe('https://baidu.com/users')
    })

    test('should not insert slash when relative url is missing or empty', () => {
      expect(combineURL('https://baidu.com/users', '')).toBe('https://baidu.com/users')
    })

    test('should allow a slash for relative url', () => {
      expect(combineURL('https://baidu.com/users', '/')).toBe('https://baidu.com/users/')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})
