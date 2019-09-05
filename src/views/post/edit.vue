<template>
  <div class="common-content-view">

    <el-form ref="form" v-loading="loading" :model="form" label-width="80px">
      <el-form-item label="状态">
        {{ editMode ? '你正在编辑一篇已存在的文章' : '你正在创建一篇新文章' }}
      </el-form-item>

      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="模式">
        <el-tooltip content="Tip: 富文本和Markdown互不相通，只能存储一种内容" placement="top-start">
          <el-switch
            v-model="form.isMarkdown"
            active-color="#795548"
            inactive-color="#3f51b5"
            active-text="Markdown"
            inactive-text="富文本"
          >
          </el-switch>
        </el-tooltip>

      </el-form-item>

      <el-form-item v-if="form.isMarkdown" label="Markdown">
        <MarkdownEditor v-model="form.contentMarkdown"></MarkdownEditor>
      </el-form-item>

      <el-form-item v-else label="富文本">
        <tinymce v-model="form.content" :height="500"/>
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
  import MarkdownEditor from 'vue-simplemde'
  import 'simplemde/dist/simplemde.min.css'

  export default {
    components: { Tinymce, MarkdownEditor },
    data: () => ({
      form: {
        title: '',
        content: '',
        contentMarkdown: '',
        isMarkdown: true
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
          this.form.title = res.data.title
          this.form.content = res.data.content
          this.form.contentMarkdown = res.data.content
          this.editMode = true
          this.form.isMarkdown = res.data.isMarkdown
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

        const isMarkdown = this.form.isMarkdown

        updatePost({
          editMode: this.editMode,
          id: this.id,
          title: this.form.title,
          content: isMarkdown ? this.form.contentMarkdown : this.form.content,
          isMarkdown
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

<style lang="scss">
  .editor-toolbar.fullscreen,
  .CodeMirror-fullscreen,
  .editor-preview-side {
    z-index: 9999;
  }
</style>
