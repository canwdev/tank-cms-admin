<template>
  <div class="common-content-view">

    <!--传统文件上传-->
    <!--<form action="http://localhost:3001/api/tools/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="fileToUpload">
      <button type="submit">Submit</button>
    </form>-->

    <el-upload
      class="my-uploader"
      drag
      :headers="uploadHeaders"
      :action="uploadAction"
      name="fileToUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>

    <div class="actions-wrap">
      <el-button type="primary" icon="el-icon-refresh" @click="getList">刷新文件列表</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="uploadedList"
      style="width: 100%"
    >
      <el-table-column
        prop="serverPath"
        :label="`相对服务器地址 ${baseHost}`"
      >
        <template slot-scope="scope">
          <el-input :value="scope.row.serverPath" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="webPath"
        label="绝对服务器地址"
      >
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.webPath" target="_blank">{{ scope.row.webPath }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.serverPath)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deleteUploadedFile, getUploadedList } from '@/api/tools'

  const baseApi = process.env.VUE_APP_BASE_API
  // const baseHost = baseApi.substring(0, baseApi.lastIndexOf('/'))

  export default {
    data: () => ({
      loading: false,
      uploadAction: baseApi + '/tools/upload',
      uploadedList: [],
      baseHost: ''
    }),
    computed: {
      ...mapGetters([
        'token'
      ]),
      uploadHeaders() {
        return {
          authorization: this.token
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      handleSuccess(res, file, fileList) {
        // console.log(res, file, fileList)
        // const absPaht = 'http://' + res.data.host + res.data.path.substring('public'.length)
        this.$message({
          message: '上传成功！',
          type: 'success'
        })
        this.getList()
      },
      handleError(res, file, fileList) {
        this.$alert(res.message, '上传失败！', {
          type: 'error'
        })
      },
      getList() {
        this.loading = true
        getUploadedList().then(res => {
          // console.log(res)
          const { files, host } = res.data

          this.baseHost = host
          this.uploadedList = files.map(name => ({
            serverPath: name,
            webPath: host + name
          }))
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          this.loading = false
        })
      },
      handleDelete(serverPath) {
        this.$confirm('此操作将永久删除服务器上的文件, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true

          const fileName = serverPath.substring('/upload/'.length)
          deleteUploadedFile(fileName).then(res => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
          }).catch(e => {
            console.log(e)
          }).finally(() => {
            this.loading = false
            this.getList()
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .common-content-view {
    position: relative;

    >>> .my-uploader {
      .el-upload, .el-upload-dragger {
        width: 100%;
      }

      .el-upload-list__item {
        line-height: 2.2;
      }
    }
  }

  /**/
</style>
