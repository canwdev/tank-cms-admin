<template>
  <AutoForm
    title="Banner 设置"
    :config-row="[
      { label: '标题', prop: 'title' },
      { label: '简介', prop: 'desc' },
      { label: '图片', prop: 'img', type: 'hidden' },
      { label: '链接', prop: 'url' },
      { label: '隐藏', prop: 'hidden', type: 'boolean' },
      { label: '优先级', prop: 'priority' },
    ]"
    :function-get-list="getBanner"
    :function-update-item="updateBanner"
    :function-delete-item="deleteBanner"
    :allow-add="true"
  />
</template>

<script>
  import AutoForm from '@/components/AutoForm'
  import {getBanner, updateBanner, deleteBanner} from '@/api/website'

  export default {
    components: {
      AutoForm
    },
    methods: {
      getBanner,
      updateBanner,
      deleteBanner
    }
  }
</script>
