<template>
  <el-card
    v-loading="loading"
  >
    <div slot="header" class="clearfix">
      <span>网站元数据设置</span>
    </div>

    <el-table
      :data="settings"
      style="width: 100%">
      <el-table-column
        prop="key"
        label="键"
        width="180">
      </el-table-column>
      <el-table-column
        prop="value"
        label="值">
      </el-table-column>

      <el-table-column
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
  import { getSettings, setSettings } from '@/api/tools'

  export default {
    data() {
      return {
        loading: true,
        settings: []
      }
    },
    mounted() {
      this.loadSettings()
    },
    methods: {
      loadSettings() {
        this.loading = true
        getSettings().then(res => {
          this.settings = res.data
          console.log(res.data)
        }).catch(e => {
          console.error(e)
        }).finally(() => {
          this.loading = false
        })

      },
      handleEdit(index, item) {
        console.log(index, item)
        this.$prompt('键：' + item.key, '编辑', {
          closeOnClickModal: false,
          inputValue: item.value
        }).then(({ value }) => {

          this.loading = true
          setSettings({
            id: item.id,
            value
          }).then(res => {
            console.log(res)
            this.loadSettings()
          }).catch(e => {
            console.error(e)
            this.$message({
              message: '更新失败！' + e.message,
              type: 'error'
            })
          }).finally(() => {
            this.loading = false
          })

        }).catch(e => {
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
