<template>
  <el-card
    v-loading="loading"
  >
    <div class="card-header" slot="header">
      <span class="__title">{{title}}</span>
      <span>
        <el-button
          v-if="allowedActions['add']"
          size="mini"
          @click="dialogEditVisible=true">新增
        </el-button><el-button
          v-if="allowedActions['reload']"
          size="mini"
          @click="loadDataList">刷新
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
        width="1px"
      >
        <template slot-scope="scope">
          {{ scope.id }}
        </template>
      </el-table-column>

      <el-table-column
        v-for="(v,i) in configRow"
        :key="i"
        :prop="v.prop"
        :label="v.label">
        <template slot-scope="scope">

          <el-checkbox
            v-if="v.type==='boolean'"
            v-model="scope.row[v.prop]"
            disabled
          />

          <span
            v-else-if="v.type==='hidden'"
          >***</span>

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
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button><el-button
            v-if="allowedActions['delete']"
            size="mini"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
          <el-input
            v-else
            v-model="form[v.prop]"
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
      title: {
        type: String,
        default: 'AutoForm'
      },
      configRow: {
        type: Array,
        default: () => [
          /**
           * label: ''标签
           * prop: '数据库对应字段'
           * readOnly: true || false
           * type: 'boolean' || 'hidden'
           */
          { label: '标题', prop: 'title', readOnly: true },
          { label: '隐藏', prop: 'hidden', type: 'boolean' }
        ]
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
    created() {
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
        this.functionGetList().then(res => {
          this.dataList = res.data
        }).catch(e => {
          console.error(e)
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
            this.$message({
              message: '删除失败！' + e.message,
              type: 'error'
            })
          }).finally(() => {
            this.loading = false
          })
        }).catch(() => {
        })
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
