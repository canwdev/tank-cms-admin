<template>
  <el-card
    v-loading="loading"
  >
    <div slot="header" class="card-header">
      <span class="__title">{{ title }}</span>
      <span>
        <el-button
          v-if="allowedActions['add']"
          size="mini"
          @click="dialogEditVisible=true"
        >新增
        </el-button><el-button
        v-if="allowedActions['reload']"
        size="mini"
        @click="loadDataList"
      >刷新
        </el-button>
      </span>
    </div>

    <!-- 搜索 -->
    <el-form
      v-if="allowedActions['search']"
      size="mini"
      :inline="true"
      :model="formSearch"
      class="my-form-inline"
    >

      <el-form-item
        v-for="(item,index) in configRow.filter(v=>v.searchable)"
        :key="index"
        :label="item.label"
      >
        <el-checkbox
          v-if="item.type==='boolean'"
          v-model="formSearch[item.prop]"
        />

        <el-select
          v-else-if="item.type==='select'"
          v-model="formSearch[item.prop]"
          :placeholder="'筛选 '+item.label"
          clearable
        >
          <el-option
            v-for="item in configRow[index].selectData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-input
          v-else
          v-model="formSearch[item.prop]"
          :placeholder="item.label"
          clearable
          @keyup.enter.native="handleSearch"
        />


      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      width="auto"
    >
      <el-table-column
        label="id"
        prop="id"
        :width="showId ? '50px' : '1px'"
      >
        <template v-if="showId" slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column
        v-for="(v,i) in configRow"
        :key="i"
        :prop="v.prop"
        :label="v.label"
      >
        <template slot-scope="scope">

          <el-checkbox
            v-if="v.type==='boolean'"
            v-model="scope.row[v.prop]"
            disabled
          />

          <span
            v-else-if="v.hidden"
          >***</span>

          <span
            v-else-if="v.type==='select'"
            :title="scope.row[v.prop]"
          >
            {{ selectTypeLabel(configRow[i].selectData, scope.row[v.prop]) }}
          </span>

          <span
            v-else
            class="limit-width"
            :title="scope.row[v.prop]"
          >{{ scope.row[v.prop] }}</span>

        </template>
      </el-table-column>

      <el-table-column
        v-if="allowedActions['edit'] || allowedActions['delete']"
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="allowedActions['edit']"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            v-if="allowedActions['delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="pagination" class="table-pagination-wrap">
      <span class="pagination-desc">共 {{ Math.ceil(dataCount / pageSize) }} 页，共 {{ dataCount }} 条信息</span>

      <el-pagination
        small
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="pageCurrent"
        :total="dataCount"
      >
      </el-pagination>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      :title="formEdit.id ? `编辑（id=${formEdit.id}）` : '新增'"
      :visible.sync="dialogEditVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="formEdit">
        <el-form-item
          v-for="(item,index) in configRow"
          :key="index"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-checkbox
            v-if="item.type==='boolean'"
            v-model="formEdit[item.prop]"
          />

          <el-select
            v-else-if="item.type==='select'"
            v-model="formEdit[item.prop]"
            placeholder="请选择"
          >
            <el-option
              v-for="item in configRow[index].selectData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-input
            v-else
            v-model="formEdit[item.prop]"
            :type="item.type==='textarea'?'textarea': null"
            :rows="5"
            :disabled="item.readOnly"
          ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseEdit">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
  // import {getSettings} from '@/api/tools'

  export default {
    props: {
      formName: { // 非必填，目前仅用于 router query
        type: String,
        default: 'autoform'
      },
      title: {
        type: String,
        default: 'AutoForm'
      },
      showId: {
        type: Boolean,
        default: false
      },
      configRow: {
        type: Array,
        default: () => [
          /**
           * label: '标签'
           * prop: '数据库对应字段'
           * readOnly: false
           * hidden: false
           * searchable: false
           * type: 'boolean' || 'textarea' || 'select'
           */
          { label: '标题', prop: 'title', readOnly: true },
          { label: '内容', prop: 'content', hidden: true, type: 'textarea' },
          { label: '隐藏', prop: 'hidden', type: 'boolean' },
          { label: '分类', prop: 'type', type: 'select', selectData: [{ value: 0, label: '标签' }] }
        ]
      },
      pagination: {
        type: Boolean,
        default: null
      },
      pageSize: {
        type: Number,
        default: 5
      },
      functionGetList: {
        type: Function,
        default: null // getSettings
      },
      functionUpdateItem: {
        type: Function,
        default: null
      },
      functionDeleteItem: {
        type: Function,
        default: null
      },
      functionSearch: {
        type: Function,
        default: null
      },
      allowAdd: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dataCount: 0,
        pageOffset: 0,
        pageCurrent: 0,
        loading: true,
        dialogEditVisible: false,
        dataList: [],
        formEdit: {},
        formLabelWidth: '100px',
        formSearch: {}
      }
    },
    computed: {
      allowedActions() {
        return {
          reload: !!this.functionGetList,
          edit: !!this.functionUpdateItem,
          delete: !!this.functionDeleteItem,
          search: !!this.functionSearch,
          add: this.allowAdd
        }
      }
    },
    watch: {
      pageCurrent(nv) {
        this.loadDataList()

        // 更新router query
        this.$router.replace({
          path: this.$route.path, query: {
            ...this.$route.query,
            [`${this.formName}_page`]: nv
          }
        })
      }
    },
    created() {
      // 获取 router query
      this.pageCurrent = parseInt(this.$route.query[`${this.formName}_page`]) || 1

      if (this.functionUpdateItem) {
        this.updateFormEditDefaults()
      }

      if (this.functionSearch) {
        this.updateFormSearchDefaults()
      }
    },
    mounted() {
      this.loadDataList()
    },
    methods: {
      /**
       * 初始化编辑表单
       * @param obj 编辑条目时，传入条目 scope.row 以获取初始值
       */
      updateFormEditDefaults(obj) {
        let newForm = {}

        if (obj) {
          newForm = JSON.parse(JSON.stringify(obj))
        } else {
          this.configRow.forEach(item => {
            newForm[item.prop] = undefined
          })
        }

        this.formEdit = newForm
      },
      /**
       * 初始化查询表单（初始值为空）
       */
      updateFormSearchDefaults() {
        const newForm = {}

        this.configRow.forEach(item => {
          if (item.searchable) {
            newForm[item.prop] = ''
          }
        })

        this.formSearch = newForm
      },
      /**
       * 加载数据列表
       */
      loadDataList() {
        this.loading = true

        const param = this.pagination ? {
          limit: this.pageSize,
          offset: (this.pageCurrent - 1) * this.pageSize
        } : {}

        this.functionGetList(param).then(res => {
          this.dataList = res.data
          if (this.pagination) {
            this.dataCount = res.count
          }
        }).catch(e => {
          console.error(e)
          this.$message.error(e.message)
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 提交更新修改
       */
      handleSubmit() {
        this.loading = true
        this.functionUpdateItem(this.formEdit).then(res => {
          this.loadDataList()
          this.$message({
            message: '更新成功！',
            type: 'success'
          })
          this.handleCloseEdit()
        }).catch(e => {
          console.error(e)
          this.$message.error(e.message)
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 处理编辑窗口弹出
       * @param index
       * @param item=scope.row
       */
      handleEdit(index, item) {
        this.updateFormEditDefaults(item)
        this.dialogEditVisible = true
      },
      /**
       * 关闭编辑窗口
       */
      handleCloseEdit() {
        this.updateFormEditDefaults()
        this.dialogEditVisible = false
      },
      /**
       * 删除条目
       * @param item
       */
      handleDelete(item) {
        this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.functionDeleteItem({ id: item.id }).then(res => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.loadDataList()
          }).catch(e => {
            console.log(e)
            this.$message.error(e.message)
          }).finally(() => {
            this.loading = false
          })
        }).catch(() => {
        })
      },
      /**
       * 搜索
       */
      handleSearch() {
        this.loading = true
        const searchProps = this.formSearch
        const paginateParam = this.pagination ? {
          limit: this.pageSize,
          offset: (this.pageCurrent - 1) * this.pageSize
        } : {}

        // console.log('handleSearch', { ...searchProps })

        this.functionSearch({
          ...paginateParam,
          ...searchProps
        }).then(res => {
          this.dataList = res.data
          if (this.pagination) {
            this.dataCount = res.count
          }
        }).catch(e => {
          console.error(e)
          this.$message.error(e.message)
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 获得下拉菜单的 label
       * @param arr=[{ value: 0, label: '标签' }]
       * @param value=0
       * @returns {string|*}
       */
      selectTypeLabel(arr, value) {
        if (!arr) return '-'

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value === value) {
            return arr[i].label
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .limit-width {
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width 100px
  }

  .card-header {
    .__title {
      font-weight: bold;
    }
    display flex
    align-items center
    justify-content space-between
  }
</style>
