import request from '@/utils/request'

// params={limit, offset}
export function getPostList(params) {
  return request({
    url: '/post/list',
    method: 'get',
    params: {
      showAll: true,
      ...params
    }
  })
}

// params={limit, offset, title, content, timeStart, timeEnd}
export function searchPostList(params) {
  return request({
    url: '/post/find',
    method: 'get',
    params: {
      showAll: true,
      ...params
    }
  })
}

// params={id}
export function getPostDetail(params) {
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
