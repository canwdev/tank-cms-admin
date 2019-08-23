import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/post/list',
    method: 'get',
    params
  })
}

// {id}
export function getDetail(params) {
  return request({
    url: '/post/detail',
    method: 'get',
    params
  })
}

// {editMode, id, title, content}
export function updatePost(data) {
  return request({
    url: '/post/update',
    method: 'post',
    data
  })
}

export function deletePost(params) {
  return request({
    url: '/post/delete',
    method: 'get',
    params
  })
}
