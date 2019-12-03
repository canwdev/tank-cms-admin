<template>
  <div class="common-content-view">

    <el-row :gutter="10">
      <el-col :span="12">
        <ToolEncrypt/>
      </el-col>

      <el-col :span="12">
        <ToolHitokoto/>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="12">
        <ToolOSSUpload/>
      </el-col>
    </el-row>

    <Live2D
      class="l2d"
      model-path="https://zencode.top:81/live2d-models/suzukaze_aoba/index.json"
      :message="'Hello World!'"
      :show-message="true"
      @onLive2DClick="()=>{}"
    ></Live2D>
  </div>
</template>

<script>
  import ToolEncrypt from '@/components/Tools/ToolEncrypt'
  import ToolHitokoto from '@/components/Tools/ToolHitokoto'
  import ToolOSSUpload from '@/components/Tools/ToolOSSUpload'
  import 'live2d-vue-component/lib/live2d.css'
  import {Live2D} from 'live2d-vue-component'

  export default {
    components:{
      ToolEncrypt,
      ToolHitokoto,
      ToolOSSUpload,
      Live2D
    },
  }
</script>

<style scoped>
  .l2d {
    position: fixed;
    right: 0;
    bottom: 0;
  }
</style>
