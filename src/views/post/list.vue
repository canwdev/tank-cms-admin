<template>
  <div class="common-content-view">

    <el-table
      v-loading="loadingData"
      :data="tableData"
      style="min-width: 800px"
    >
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="create_time"
        width="150"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="update_time"
        width="150"
        label="更新时间"
      >
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleView(scope.row.id)">查看</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import { getList } from '@/api/post'
  import { parseTime } from '@/utils'

  export default {
    data: () => ({
      tableData: [],
      loadingData: false
    }),
    mounted() {
      this.fetchList()
    },
    methods: {
      fetchList() {
        this.loadingData = true
        getList().then(res => {
          this.tableData = res.data.map(v => {
            v.create_time = parseTime(new Date(v.create_time))
            v.update_time = v.update_time ? parseTime(new Date(v.update_time)) : '/'
            return v
          })
        }).catch(e => {
          console.error(e)
        }).finally(() => {
          this.loadingData = false
        })
      },
      handleView(id) {
        this.$router.push({
          name: 'postDetail',
          query: {
            id
          }
        })
      },
      handleEdit(index, data) {

      }
    }
  }
</script>

<style lang="scss">

</style>
