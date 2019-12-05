<template>
  <div class="common-content-view">

    <el-row :gutter="10">
      <el-col :span="24">
        <el-card>
          <div slot="header">招聘分类</div>
          <div>

            <el-row :gutter="5">

              <el-col
                v-for="(types, index) of recruitTypes"
                :key="index"
                :span="8"
              >
                <h4>{{ types[0].type}}</h4>
                <div>
                  <el-tag
                    v-for="type in types"
                    :key="type.id"
                    size="small"
                  >
                    {{ type.title }}
                  </el-tag>
                </div>
              </el-col>

            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="24">

        <AutoForm
          form-name="recruit"
          title="招聘列表"
          :config-row="[
            { label: '职位名称', prop: 'title' },
            { label: '介绍', prop: 'desc', hidden: true, type: 'textarea'},
            { label: '招聘类别id', prop: 't_category_id', type: 'select' ,selectData: convertDropdownData(recruitTypes.category) },
            { label: '招聘地区id', prop: 't_area_id', type: 'select' ,selectData: convertDropdownData(recruitTypes.area) },
            { label: '职业分类id', prop: 't_job_id', type: 'select' ,selectData: convertDropdownData(recruitTypes.job) },
            { label: '隐藏', prop: 'hidden', type: 'boolean' },
            { label: '优先级', prop: 'priority' },
          ]"
          :pagination="true"
          :page-size="10"
          :function-get-list="getRecruit"
          :function-update-item="updateRecruit"
        />

      </el-col>
    </el-row>

  </div>
</template>

<script>
  import AutoForm from '@/components/AutoForm'
  import { getRecruit, getRecruitTypes, updateRecruit } from '@/api/website'

  export default {
    components: {
      AutoForm
    },
    data: () => ({
      recruitTypes: {}
    }),
    mounted() {
      getRecruitTypes().then(res => {
        this.recruitTypes = res.data
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    methods: {
      getRecruit,
      updateRecruit,
      convertDropdownData(arr) {
        if (!arr) return []
        return arr.map(v => ({
          value: v.id,
          label: v.title
        }))
      }
    }
  }
</script>
