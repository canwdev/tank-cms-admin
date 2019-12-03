<template>
  <el-card>
    <div slot="header">单向加密文本</div>
    <el-form ref="formEncrypt" :inline="true" :model="formEncrypt">
      <el-form-item :rules="{ required: true, message: '必填', trigger: 'blur' }" prop="text">
        <el-input v-model="formEncrypt.text" placeholder="请输入要加密的密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmitEncrypt">加密</el-button>
      </el-form-item>

      <el-form-item>
        <el-input :value="formEncrypt.result" readonly placeholder="加密结果">
          <el-button slot="append" @click="copyText(formEncrypt.result)" icon="el-icon-document-copy"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

  import {encryptText} from '@/api/tools'
  import copyTextToClipboard from 'copy-text-to-clipboard'
  export default {

    data: () => ({
      formEncrypt: {
        text: '',
        result: ''
      }
    }),
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
            }).catch(e => {
            })
          }
        })
      },
    }
  }
</script>
