<template>
  <el-card>
    <div slot="header">OSS 直传 Demo</div>

    <div class="single">
      <strong>单文件上传</strong><br>
      <strong v-if="progress>0">已上传 {{progress}}%</strong><br>
      <input type="file" id="upload" @change="uploadfile">
      <button @click="handleGetOSSPolicy">log getOSSPolicy</button>
      <div class="imgDiv"><img :src="imgUrl" class="img" v-if="imgUrl"></div>
    </div>
  </el-card>
</template>

<script>
  import { getOSSPolicy } from '@/api/tools'

  export default {
    data() {
      return {
        imgUrl: '',
        progress: 0
      }
    },
    methods: {
      handleGetOSSPolicy() {
        getOSSPolicy().then(res=>{
          console.log(res)
        })
      },
      uploadfile() {
        const file = document.getElementById('upload').files[0]
        getOSSPolicy().then((res) => {
          console.log(res.data)
          const { OSSAccessKeyId, host, policy, signature, startsWith, saveName } = res.data
          const fd = new FormData()
          fd.append('OSSAccessKeyId', OSSAccessKeyId)
          fd.append('policy', policy)
          fd.append('signature', signature)
          fd.append('key', startsWith + saveName)
          fd.append('success_action_status', 200)
          fd.append('file', file, saveName)

          const xhr = new XMLHttpRequest()
          xhr.open('post', host, true)
          xhr.upload.addEventListener('progress', (evt) => {
            this.progress = Math.round((evt.loaded) * 100 / evt.total)
          }, false)
          xhr.addEventListener('load', (e) => {
            if (e.target.status !== 200) {
              console.log(e.target.response)
              console.log('上传失败！')
              return
            }
            if (e.target.status === 200) {
              this.imgUrl = host + '/' + startsWith + saveName
            }
          }, false)
          xhr.send(fd)
        })
      }
    }
  }
</script>
