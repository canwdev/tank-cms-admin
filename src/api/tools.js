import request from '@/utils/request'
import axios from 'axios'

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

export function getSettings() {
  return request({
    url: '/tools/getSettings',
    method: 'get'
  })
}

// {id?, key,value,type}
export function setSettings(settings) {
  return request({
    url: '/tools/setSettings',
    method: 'post',
    data: settings
  })
}

export function getHitokoto() {
  return axios.get('https://v1.hitokoto.cn/')
}

export function saveHitokoto(hitokoto) {
  return request({
    url: '/tools/saveHitokoto',
    method: 'post',
    data: hitokoto
  })
}

export function queryHitokoto() {
  return request({
    url: '/tools/queryHitokoto',
    method: 'get'
  })
}

export function getOSSPolicy() {
  return request({
    url: '/tools/oss-policy',
    method: 'get'
  })
}
