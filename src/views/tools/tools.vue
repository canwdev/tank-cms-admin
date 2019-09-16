<template>
  <div class="common-content-view">

    <el-form ref="formEncrypt" :inline="true" :model="formEncrypt">
      <el-form-item :rules="{ required: true, message: '必填', trigger: 'blur' }" prop="text">
        <el-input v-model="formEncrypt.text" placeholder="请输入要加密的密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmitEncrypt">加密密码</el-button>
      </el-form-item>

      <el-form-item>
        <el-input :value="formEncrypt.result" readonly placeholder="加密结果"><el-button slot="append" @click="copyText(formEncrypt.result)" icon="el-icon-document-copy"></el-button></el-input>
      </el-form-item>
    </el-form>

    <el-row>
      <el-button @click="handleGetSettings">getSettings</el-button>
      <el-button type="primary" @click="startCrawling">启动一言爬虫</el-button>
      <el-button type="danger" @click="stopCrawling">停止一言爬虫</el-button>
      <el-button @click="queryHitokotoFromDB">queryHitokotoFromDB</el-button>
    </el-row>

  </div>
</template>

<script>
  import copyTextToClipboard from 'copy-text-to-clipboard'
  import { encryptText, getSettings, saveHitokoto, queryHitokoto, getHitokoto } from '@/api/tools'

  export default {
    data: () => ({
      formEncrypt: {
        text: '',
        result: ''
      }
    }),
    mounted() {
      this.crawlerInterval = null
    },
    methods: {
      copyText(text) {
        if (copyTextToClipboard(text)) {
          this.$message({
            message: '复制成功',
            type: 'success'
          })
        }
      },
      onSubmitEncrypt() {
        this.$refs.formEncrypt.validate(async(valid) => {
          if (valid) {
            this.formEncrypt.result = ''
            encryptText(this.formEncrypt.text).then(res => {
              this.formEncrypt.result = res.data
            }).catch(e => {})
          }
        })
      },
      handleGetSettings() {
        getSettings().then(res => {
          console.log(res)
        }).catch(e => {
          console.error(e)
        })
      },
      startCrawling() {
        clearInterval(this.crawlerInterval)
        this.crawlerInterval = setInterval(() => {
          this.handleCrawlingHitokoto()
        }, 1000)

        this.$message({
          type: 'warning',
          message: '爬虫已启动！'
        })
      },
      stopCrawling() {
        clearInterval(this.crawlerInterval)

        this.$message({
          type: 'warning',
          message: '爬虫已停止！'
        })
      },
      async handleCrawlingHitokoto() {
        try {
          let hitokoto = await getHitokoto()
          hitokoto = hitokoto.data

          // console.log(hitokoto)

          this.$message({
            type: 'success',
            message: hitokoto
          })

          const res = await saveHitokoto(hitokoto)
          // console.log(res)

          this.$message({
            type: 'success',
            message: res.message
          })
        } catch (e) {
          // console.error(e)
        }
      },
      queryHitokotoFromDB() {
        queryHitokoto().then(res => {
          console.log(res)
        }).catch(e => {
          console.error(e)
        })
      }
    }
  }
</script>
