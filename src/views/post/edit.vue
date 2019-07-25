<template>
  <div class="common-content-view">

    <el-form ref="form" v-loading="loading" :model="form" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="正文内容">
        <tinymce v-model="form.content" :height="300" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ editMode ? '更新文章' : '创建文章' }}</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
  import { getDetail, updatePost } from '@/api/post'
  import { formatTime } from '@/utils'
  import Tinymce from '@/components/Tinymce'

  export default {
    components: { Tinymce },
    data: () => ({
      form: {
        title: '',
        content: ''
      },
      editMode: false,
      id: null,
      loading: false
    }),
    watch: {
      '$route.query.id'(nv) {
        nv && this.fetchPostDetail(nv)
        if (!nv || nv === '') {
          this.form = {}
          this.editMode = false
          this.id = null
        }
      }
    },
    mounted() {
      const id = this.$route.query.id
      id && this.fetchPostDetail(id)
    },
    methods: {
      formatTime,
      fetchPostDetail(id) {
        this.startLoading()

        getDetail({ id }).then(res => {
          this.form = res.data
          this.editMode = true
          this.id = id
        }).catch(e => {
          console.error(e)
          this.form = {}
        }).finally(() => {
          this.stopLoading()
        })
      },
      onSubmit() {
        this.startLoading()
        updatePost({
          editMode: this.editMode,
          id: this.id,
          title: this.form.title,
          content: this.form.content
        }).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: res.message
          })
          if (this.editMode) {
            this.fetchPostDetail(this.id)
          } else {
            this.$router.push({
              name: 'postEdit',
              query: {
                id: res.data.id
              }
            })
          }
        }).catch(e => {
          console.error(e)
        }).finally(() => {
          this.stopLoading()
        })
      },
      startLoading() {
        this.loading = true /* this.$loading({
          lock: true,
          text: 'Loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })*/
      },
      stopLoading() {
        this.loading = false // .close()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
