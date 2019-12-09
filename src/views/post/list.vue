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
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button v-if="searchOn" @click="handleClearSearch">清除搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tblPostList"
      style="min-width: 800px"
    >
      <el-table-column
        prop="id"
        label="id"
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
        <template slot-scope="scope">
          {{ parseTime(new Date(scope.row.createdAt)) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        width="150"
        label="更新时间"
      >
        <template slot-scope="scope">
          {{ scope.row.updatedAt ? parseTime(new Date(scope.row.updatedAt)) : '/' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="hidden"
        label="隐藏"
        width="50"
      >
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.hidden"
            disabled
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-link
            :href="`${frontendBaseUrl}/posts/`+scope.row.id"
            target="_blank"
            style="margin-right: 5px;"
            title="前端打开"
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
        :current-page.sync="tblPageCurrent"
        :total="tblAllCount"
      >
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { deletePost, getPostList, searchPostList } from '@/api/post'
  import { parseTime } from '@/utils'
  import { frontendBaseUrl } from '@/settings'

  const initFormSearch = {
    title: '',
    content: '',
    dateRange: null
  }

  export default {
    data: () => ({
      frontendBaseUrl,
      formSearch: { ...initFormSearch },
      searchOn: false,
      loading: false,
      tblPostList: [],
      tblPageCurrent: 1,
      tblPageSize: 12,
      tblAllCount: null
    }),
    watch: {
      tblPageCurrent(nv) {
        if (this.searchOn) {
          this.handleSearch()
        } else {
          this.fetchList()
        }

        // 更新router query
        this.$router.replace({
          path: this.$route.path, query: {
            ...this.$route.query,
            'posts_page': nv
          }
        })
      }
    },
    created() {
      // 获取 router query
      this.tblPageCurrent = parseInt(this.$route.query['posts_page']) || 1
    },
    mounted() {
      this.fetchList()
    },
    methods: {
      parseTime,
      fetchList() {
        this.loading = true

        const paginateParam = {
          limit: this.tblPageSize,
          offset: (this.tblPageCurrent - 1) * this.tblPageSize
        }

        getPostList(paginateParam).then(res => {
          this.tblAllCount = res.data.count
          this.tblPostList = res.data.rows
        }).catch(e => {
          console.error(e)
        }).finally(() => {
          this.loading = false
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
          this.loading = true

          deletePost({ id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchList()
          }).finally(() => {
            this.loading = false
          })
        }).catch(() => {
        })
      },
      handleSearch() {
        this.loading = true

        const paginateParam = {
          limit: this.tblPageSize,
          offset: (this.tblPageCurrent - 1) * this.tblPageSize
        }

        const { title, content, dateRange } = this.formSearch
        const timeQuery = dateRange ? {
          timeStart: dateRange[0].getTime(),
          timeEnd: dateRange[1].getTime()
        } : {}

        searchPostList({
          ...paginateParam,
          title,
          content,
          ...timeQuery
        }).then(res => {
          this.searchOn = true
          this.tblAllCount = res.count
          this.tblPostList = res.data
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          this.loading = false
        })
      },
      handleClearSearch() {
        this.searchOn = false
        this.formSearch = { ...initFormSearch }
        this.tblPageCurrent = 1
        this.fetchList()
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
</style>
