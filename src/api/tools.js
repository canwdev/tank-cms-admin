import request from '@/utils/request'

export function getUploadedList() {
  return request({
    url: '/tools/listUploaded',
    method: 'get'
  })
}
