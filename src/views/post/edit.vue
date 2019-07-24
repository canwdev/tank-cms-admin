<template>
  <div class="common-content-view">

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="正文内容">
        <tinymce v-model="form.content" :height="300" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
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
      editMode: false
    }),
    watch: {
      '$route.query.id'(nv) {
        nv && this.fetchPostDetail(nv)
      }
    },
    mounted() {
      const id = this.$route.query.id
      id && this.fetchPostDetail(id)
    },
    methods: {
      formatTime,
      fetchPostDetail(id) {
        getDetail({ id }).then(res => {
          this.form = res.data
        }).catch(e => {
          console.error(e)
        })
      },
      onSubmit() {
        updatePost({
          editMode: this.editMode,
          title: this.form.title,
          content: this.form.content
        }).then(res => {
          console.log(res)
        }).catch(e => {
          console.error(e)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
