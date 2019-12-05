<template>
  <div>
    <el-button
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible=true"
    >
      上传图片到OSS
    </el-button>
    <el-dialog
      :visible.sync="dialogVisible"
    >
      <el-upload
        v-loading="initializing"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="uploadHost"
        :data="uploadData"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击上传图片
        </el-button>
      </el-upload>

      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { getOSSPolicy } from '@/api/tools'

  export default {
    data: () => ({
      initializing: true,
      dialogVisible: false,
      listObj: {},
      fileList: [],
      uploadHost: '',
      uploadData: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        key: '',
        success_action_status: 200
        // file: ''
      }
    }),
    watch: {
      dialogVisible(nv) {
        if (nv) {
          this.initOSSData()
        }
      }
    },
    methods: {
      initOSSData() {
        this.initializing = true
        getOSSPolicy().then(res => {
          const { OSSAccessKeyId, host, policy, signature } = res.data
          this.uploadHost = host
          this.uploadData.OSSAccessKeyId = OSSAccessKeyId
          this.uploadData.policy = policy
          this.uploadData.signature = signature
          this.initializing = false
        }).catch(e => {
          this.$message.error('获取 OSS 信息失败！无法上传')
        })
      },
      checkAllSuccess() {
        return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
      },
      handleSubmit() {
        const arr = Object.keys(this.listObj).map(v => this.listObj[v])
        if (!this.checkAllSuccess()) {
          this.$message('请等待全部文件上传完成！如果存在问题请刷新页面。')
          return
        }
        this.$emit('successCBK', arr)
        this.listObj = {}
        this.fileList = []
        this.dialogVisible = false
      },
      handleSuccess(response, file) {
        // console.log('success', { response, file })
        // 阿里云oss上传成功没有 response
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            // this.listObj[objKeyArr[i]].url = ossUrl
            this.listObj[objKeyArr[i]].hasSuccess = true
            return
          }
        }
      },
      handleError(err, file, fileList) {
        console.log({ err, file, fileList })
        this.uploadData.key = ''
        this.$message.error('上传失败！')
      },
      handleRemove(file) {
        const uid = file.uid
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            delete this.listObj[objKeyArr[i]]
            return
          }
        }
      },
      beforeUpload(file) {
        const _self = this
        const MB = 1
        const limitSize = file.size / 1024 / 1024 < MB

        if (!limitSize) {
          this.$message.error(`上传大小限制在 ${MB}MB！`)
          return false
        }

        const fileName = 'testOSS/demo/' + new Date().getTime() + '_' + file.name.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]\,]/g, '_')

        this.uploadData.key = fileName

        // 设置文件列表
        const _URL = window.URL || window.webkitURL
        const uid = file.uid
        this.listObj[uid] = {}
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[uid] = {
            url: _self.uploadHost + '/' + fileName,
            hasSuccess: false,
            uid: uid,
            width: this.width,
            height: this.height
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;

    >>> .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
