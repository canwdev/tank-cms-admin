import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}

// data={id?, title, pid, url, priority}
export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}

// params={id}
export function deleteMenu(params) {
  return request({
    url: '/menu/delete',
    method: 'get',
    params
  })
}
