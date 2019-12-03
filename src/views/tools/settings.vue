<template>
  <div class="common-content-view">


    <el-row :gutter="10">
      <el-col :span="24">
        <SettingsBanner/>
      </el-col>
    </el-row>

    <el-row :gutter="10">

      <el-col :span="14">
        <SettingsMenuTree/>
      </el-col>

      <el-col :span="10">
        <SettingsWebsiteMeta/>
      </el-col>

    </el-row>


  </div>
</template>

<script>
  import SettingsMenuTree from '@/components/SettingsMenuTree'
  import SettingsWebsiteMeta from '@/components/SettingsWebsiteMeta'
  import SettingsBanner from '@/components/SettingsBanner'

  export default {
    components: {
      SettingsMenuTree, SettingsWebsiteMeta, SettingsBanner
    }
  }
</script>

<style lang="stylus" scoped>
  .common-content-view {
  }
</style>
