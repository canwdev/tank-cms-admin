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

// params={limit?, offset?}
export function getRecruit(params) {
  const { limit, offset } = params

  return request({
    url: '/recruit/list',
    method: 'get',
    params: {
      showAll: true,
      jobsOnly: true,
      limit,
      offset
    }
  })
}

// params={limit?, offset?, title, }
export function searchRecruit(params) {
  // const { limit, offset } = params

  return request({
    url: '/recruit/find',
    method: 'get',
    params: {
      showAll: true,
      ...params
    }
  })
}

export function getRecruitTypes() {
  return request({
    url: '/recruit/types',
    method: 'get',
    params: {
      grouped: true
    }
  })
}

// data={id?, title, desc, t_category_id, t_area_id, t_job_id, hidden, priority}
export function updateRecruit(data) {
  return request({
    url: '/recruit/update',
    method: 'post',
    data
  })
}

// params={id}
export function deleteRecruit(params) {
  return request({
    url: '/recruit/delete',
    method: 'get',
    params
  })
}
