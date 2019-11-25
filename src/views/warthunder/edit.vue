<template>
  <div class="common-content-view">
    <el-button type="primary" @click="updateJSON">保存</el-button>
    <JsonEditor v-model="value" v-loading="loading"></JsonEditor>
  </div>
</template>

<script>
  import JsonEditor from '@/components/JsonEditor'
  import { getDetail, updatePost } from '@/api/post'
  const DEMO_ID = 43

  export default {
    components: {
      JsonEditor
    },
    data: () => ({
      loading: false,
      value: ''
    }),
    mounted() {
      this.fetchJSON()
    },
    methods: {
      fetchJSON() {
        this.loading = true
        getDetail({ id: DEMO_ID }).then(res => {
          this.value = JSON.parse(res.data.content)
        }).finally(() => {
          this.loading = false
        })
      },
      updateJSON() {
        let errorFlag = false
        try {
          JSON.parse(this.value)
        } catch (e) {
          console.error(e)
          errorFlag = true
          this.$message({
            type: 'error',
            message: '请确认格式无误再提交!'
          })
        }
        if (errorFlag) return

        this.loading = true
        updatePost({
          editMode: true,
          id: DEMO_ID,
          title: 'WarThunder Demo API',
          content: this.value
        }).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.fetchJSON()
        }).catch(e => {
          console.log(e)
          this.$message({
            type: 'error',
            message: '修改失败!'
          })
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped>
  .common-content-view {
    padding: 0;
  }
</style>
