<template>
  <div class="common-content-view">

    <el-form ref="form" v-loading="loading" :model="form" label-width="80px">
      <el-form-item label="状态">
        <el-tag>{{ editMode ? `编辑文章 (id=${id})` : '创建文章' }}</el-tag>
        <template v-if="editMode">
          <el-tag>
            <el-link
              :href="`${frontendBaseUrl}/posts/`+id"
              target="_blank"
              title="前端打开"
            ><i class="el-icon-link"></i>
            </el-link>
          </el-tag>
          <el-tag>创建时间: {{ createdAt }}</el-tag>
          <el-tag>修改时间: {{ updatedAt }}</el-tag>
        </template>
      </el-form-item>

      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="内容格式">
        <el-tooltip content="一个字段，两种格式；分别干扰，互不存储。" placement="top-start">
          <el-switch
            v-model="form.isMarkdown"
            active-color="#10893E"
            inactive-color="#10893E"
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

      <el-form-item label="是否隐藏">
        <el-checkbox v-model="form.hidden"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ editMode ? '更新文章' : '创建文章' }}</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
  import { getPostDetail, updatePost } from '@/api/post'
  import { parseTime } from '@/utils'
  import Tinymce from '@/components/Tinymce'
  import MarkdownEditor from 'vue-simplemde'
  import 'simplemde/dist/simplemde.min.css'
  import { frontendBaseUrl } from '@/settings'

  export default {
    components: { Tinymce, MarkdownEditor },
    data: () => ({
      frontendBaseUrl,
      form: {
        title: '',
        content: '',
        contentMarkdown: '',
        hidden: false,
        isMarkdown: false
      },
      editMode: false,
      id: null,
      createdAt: null,
      updatedAt: null,
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
      fetchPostDetail(id) {
        this.startLoading()

        getPostDetail({ id }).then(res => {
          const { title, content, isMarkdown, hidden, createdAt, updatedAt } = res.data

          this.form.title = title
          this.form.content = content
          this.form.contentMarkdown = content
          this.editMode = true
          this.form.isMarkdown = isMarkdown
          this.form.hidden = hidden
          this.id = id
          this.createdAt = parseTime(createdAt)
          this.updatedAt = parseTime(updatedAt)
        }).catch(e => {
          console.error(e)
          this.form = {}
        }).finally(() => {
          this.stopLoading()
        })
      },
      onSubmit() {
        this.startLoading()

        const { title, isMarkdown, hidden } = this.form

        updatePost({
          editMode: this.editMode,
          id: this.id,
          title: title,
          content: isMarkdown ? this.form.contentMarkdown : this.form.content,
          isMarkdown,
          hidden: hidden
        }).then(res => {
          // console.log(res)
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

<style>
  .editor-toolbar.fullscreen,
  .CodeMirror-fullscreen,
  .editor-preview-side {
    z-index: 9999;
  }
</style>
