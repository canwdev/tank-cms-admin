import request from '@/utils/request'

// 获取加密的字符串（无法解密）
export function encryptText(text) {
  return request({
    url: '/tools/encryptText',
    method: 'get',
    params: { text }
  })
}

export function getUploadedList() {
  return request({
    url: '/tools/listUploaded',
    method: 'get'
  })
}

export function deleteUploadedFile(fileName) {
  return request({
    url: '/tools/deleteUploaded',
    method: 'post',
    data: { fileName }
  })
}
