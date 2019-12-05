<template>
  <AutoForm
    title="网站元数据"
    :config-row="[
      { label: '键', prop: 'key', readOnly: true },
      { label: '值', prop: 'value' },
    ]"

    :function-get-list="getSettings"
    :function-update-item="setSettings"
  />
</template>

<script>
  import AutoForm from '@/components/AutoForm'
  import { getSettings, setSettings } from '@/api/tools'

  export default {
    components: {
      AutoForm
    },
    methods: {
      getSettings,
      setSettings
    }
  }
</script>

<style lang="stylus" scoped>
</style>
