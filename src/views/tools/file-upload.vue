<template>
  <div class="common-content-view">

    <!--传统文件上传-->
    <form v-if="false" action="http://localhost:3001/api/tools/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="fileToUpload">
      <button type="submit">Submit</button>
    </form>

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

    <el-table
      :data="uploadedList"
      style="width: 100%">
      <el-table-column
        prop="serverPath"
        label="Web相对路径">
        <template slot-scope="scope">
          <el-input :value="scope.row.serverPath" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="webPath"
        label="Web绝对路径">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.webPath" target="_blank">{{ scope.row.webPath }}</el-link>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getUploadedList } from '@/api/tools'

  const baseApi = process.env.VUE_APP_BASE_API
  const baseHost = baseApi.substring(0, baseApi.lastIndexOf('/'))

  export default {
    data: () => ({
      uploadAction: baseApi + '/tools/upload',
      uploadedList: []
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
        // this.$alert(absPaht, '上传成功！', {
        //   type: 'success'
        // })
        this.getList()
      },
      handleError(res, file, fileList) {
        this.$alert(res.message, '上传失败！', {
          type: 'error'
        })
      },
      getList() {
        getUploadedList().then(res => {
          // console.log(res)
          const files = []
          res.data.files.forEach(v => {
            files.push({
              serverPath: v,
              webPath: baseHost + v
            })
          })

          this.uploadedList = files.reverse()
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .common-content-view {
    /deep/ .my-uploader {
      .el-upload, .el-upload-dragger {
        width: 100%;
      }
    }
  }

  /**/
</style>
