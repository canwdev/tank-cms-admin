import request from '@/utils/request'

// params={limit, offset}
export function getList(params) {
  return request({
    url: '/post/list',
    method: 'get',
    params
  })
}

// params={id}
export function getDetail(params) {
  return request({
    url: '/post/detail',
    method: 'get',
    params
  })
}

// data={editMode, id, title, content}
export function updatePost(data) {
  return request({
    url: '/post/update',
    method: 'post',
    data
  })
}

// params={id}
export function deletePost(params) {
  return request({
    url: '/post/delete',
    method: 'get',
    params
  })
}
