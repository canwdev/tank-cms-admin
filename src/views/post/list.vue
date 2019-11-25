<template>
  <div class="common-content-view list-view">

    <el-form size="mini" :inline="true" :model="formSearch" class="my-form-inline">

      <el-form-item label="标题">
        <el-input v-model="formSearch.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="formSearch.content" clearable></el-input>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="formSearch.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSearchSubmit" icon="el-icon-search">占坑</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="tblLoading"
      :data="tblData"
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
        prop="createdAt"
        width="150"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        width="150"
        label="更新时间"
      >
      </el-table-column>

      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-link
            :href="`${frontendBaseUrl}/posts/`+scope.row.id"
            target="_blank"
            style="margin-right: 5px;"
            title="在前端网站打开"
          ><i class="el-icon-link"></i></el-link>
          <el-link
            target="_blank"
            style="margin-right: 5px;"
            title="查看预览"
            @click="handleView(scope.row.id)"
          ><i class="el-icon-view"></i></el-link>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="编辑条目"
            @click="handleEdit(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            title="删除条目"
            @click="handleDelete(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-pagination-wrap">
      <span class="pagination-desc">共 {{ Math.ceil(tblAllCount / tblPageSize) }} 页，共 {{ tblAllCount }} 条信息</span>

      <el-pagination
        small
        background
        layout="prev, pager, next"
        :page-size="tblPageSize"
        :current-page.sync="tblCurPage"
        :total="tblAllCount"
      >
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { deletePost, getList } from '@/api/post'
  import { parseTime } from '@/utils'
  import { frontendBaseUrl } from '@/settings'

  export default {
    data: () => ({
      frontendBaseUrl,
      formSearch: {
        title: '',
        content: '',
        dateRange: []
      },

      tblData: [],
      tblCurPage: 0,
      tblPageSize: 12,
      tblAllCount: null,

      tblLoading: false
    }),
    watch: {
      tblCurPage() {
        this.fetchList()
      }
    },
    mounted() {
      this.fetchList()
    },
    methods: {
      fetchList() {
        this.tblLoading = true
        getList({
          limit: this.tblPageSize,
          offset: (this.tblCurPage - 1) * this.tblPageSize
        }).then(res => {
          const rows = res.data.rows
          this.tblAllCount = res.data.count
          this.tblData = rows.map(v => {
            v.createdAt = parseTime(new Date(v.createdAt))
            v.updatedAt = v.updatedAt ? parseTime(new Date(v.updatedAt)) : '/'
            return v
          })
        }).catch(e => {
          console.error(e)
        }).finally(() => {
          this.tblLoading = false
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
      handleEdit(id) {
        this.$router.push({
          name: 'postEdit',
          query: {
            id
          }
        })
      },
      handleDelete(id) {
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tblLoading = true

          deletePost({ id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchList()
          }).finally(() => {
            this.tblLoading = false
          })
        }).catch(() => {
        })
      },
      onSearchSubmit() {

      }
    }
  }
</script>

<style lang="stylus">
  .list-view {
    .el-button + .el-button {
      margin-left: 0;
    }
  }

  .table-pagination-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;

    .pagination-desc {
      font-size: 14px;
      color: #9e9e9e;
    }
  }
</style>
