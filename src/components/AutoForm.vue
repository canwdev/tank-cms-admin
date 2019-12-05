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
            {{ selectTypeFilter(configRow[i].selectData, scope.row[v.prop]) }}
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
      :title="form.id ? `编辑（id=${form.id}）` : '新增'"
      :visible.sync="dialogEditVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form">
        <el-form-item
          v-for="(v,i) in configRow"
          :key="i"
          :label="v.label"
          :label-width="formLabelWidth"
        >
          <el-checkbox
            v-if="v.type==='boolean'"
            v-model="form[v.prop]"
          />

          <el-select
            v-else-if="v.type==='select'"
            v-model="form[v.prop]"
            placeholder="请选择"
          >
            <el-option
              v-for="item in configRow[i].selectData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-input
            v-else
            v-model="form[v.prop]"
            :type="v.type==='textarea'?'textarea': null"
            :rows="5"
            :disabled="v.readOnly"
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
           * label: ''标签
           * prop: '数据库对应字段'
           * readOnly: true || false
           * hidden: true
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
        form: {},
        formLabelWidth: '100px'
      }
    },
    computed: {
      allowedActions() {
        return {
          reload: !!this.functionGetList,
          edit: !!this.functionUpdateItem,
          delete: !!this.functionDeleteItem,
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

      this.updateFormDefaults()
    },
    mounted() {
      this.loadDataList()
    },
    methods: {
      updateFormDefaults(obj) {
        let newForm = {}

        if (obj) {
          newForm = JSON.parse(JSON.stringify(obj))
        } else {
          this.configRow.forEach(item => {
            newForm[item.prop] = undefined
          })
        }

        this.form = newForm
      },
      loadDataList() {
        this.loading = true

        let param = {}
        if (this.pagination) {
          param = {
            limit: this.pageSize,
            offset: (this.pageCurrent - 1) * this.pageSize
          }
        }

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
      handleSubmit(item) {
        this.loading = true
        this.functionUpdateItem(this.form).then(res => {
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
      handleEdit(index, item) {
        this.updateFormDefaults(item)
        this.dialogEditVisible = true
      },
      handleCloseEdit() {
        this.updateFormDefaults()
        this.dialogEditVisible = false
      },
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
      selectTypeFilter(arr, value) {
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
