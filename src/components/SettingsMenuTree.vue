<template>
  <el-card
    v-loading="loading"
  >
    <div slot="header" class="clearfix">
      <span>菜单设置</span>
    </div>

    <el-button
      type="text"
      size="mini"
      @click="handleNodeAppend()">
      添加节点
    </el-button>
    <el-tree
      :data="menuTree"
      node-key="id"
      :props="{
        label:'title'
      }"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <span class="title">{{ data.title }}</span>
          <el-badge type="success" :value="'id:'+data.id"/>
          <el-badge type="warning" :value="'优先级:'+data.priority" @click.native="handleNodeEdit(data, 'priority')"/>
          <el-badge type="info" :value="data.url" @click.native="handleNodeEdit(data, 'url')"/>
          </span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="handleNodeEdit(data, 'title')">
            重命名
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="handleNodeEdit(data, 'url')">
            修改链接
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="handleNodeAppend(data.id)">
            添加子节点
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="handleNodeMove(data)">
            移动
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="handleNodeDelete(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
  </el-card>
</template>

<script>
  import { deleteMenu, getMenuTree, updateMenu } from '@/api/menu'

  export default {
    data() {
      return {
        loading: true,
        menuTree: []
      }
    },
    mounted() {
      this.loadMenuTree()
    },
    methods: {
      loadMenuTree() {
        this.loading = true
        getMenuTree().then(res => {
          this.menuTree = res.data
          this.loading = false
        })
      },
      handleNodeClick(node) {
        // console.log('click', node)
      },
      handleNodeEdit(node, type) {
        this.$prompt('修改 ' + type, '编辑菜单节点', {
          closeOnClickModal: false,
          inputValue: node[type]
        }).then(({ value }) => {
          this.loading = true
          updateMenu({ id: node.id, [type]: value }).then(res => {
            this.loadMenuTree()
          }).catch(e => {
            console.error(e)
          })

        }).catch(e => {
        })
      },
      handleNodeAppend(pid = 0) {
        this.$prompt('请输入节点标题', '添加节点，pid=' + pid, {
          closeOnClickModal: false,
          inputValue: '标题'
        }).then(({ value }) => {
          this.loading = true
          updateMenu({ pid, title: value }).then(res => {
            this.loadMenuTree()
          }).catch(e => {
            console.error(e)
          })

        }).catch(e => {
        })
      },
      handleNodeMove(node) {
        this.$prompt('请输入要移动到的父节点 id，0 为根节点', '移动节点', {
          closeOnClickModal: false,
          inputValue: node.pid
        }).then(({ value }) => {
          if (value === '' || !/\d+/i.test(value)) {
            this.$message.error('id 只能为数字，且不允许为空！')
            return
          }
          if (parseInt(value) === node.id) {
            this.$message.error('父节点 id 不允许与当前 id 相同！')
            return
          }

          this.loading = true
          updateMenu({ id: node.id, pid: value }).then(res => {
            this.loadMenuTree()
          }).catch(e => {
            console.error(e)
          })

        }).catch(e => {
        })
      },
      handleNodeDelete(node) {
        this.$confirm(`是否删除《${node.title}》及其子节点？此操作无法撤销！`, '警告', {
          type: 'warning'
        }).then(() => {

          this.loading = true
          deleteMenu({ id: node.id }).then(res => {
            this.loadMenuTree()
          }).catch(e => {
            console.error(e)
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .title {
      font-weight: bold;
    }

    >>> .el-badge sup {
      top unset
    }
  }
</style>
