import request from '@/utils/request'

export function getBanner() {
  return request({
    url: '/banner/list',
    method: 'get',
    params: {
      showAll: true
    }
  })
}

// data={id?, title, img, desc, url, hidden, priority}
export function updateBanner(data) {
  return request({
    url: '/banner/update',
    method: 'post',
    data
  })
}

// params={id}
export function deleteBanner(params) {
  return request({
    url: '/banner/delete',
    method: 'get',
    params
  })
}

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
