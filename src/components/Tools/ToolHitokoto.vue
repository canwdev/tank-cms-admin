<template>
  <el-card>
    <div slot="header">一言爬虫</div>
    <el-row>
      <el-button type="primary" @click="startCrawling">启动一言爬虫</el-button>
      <el-button type="danger" @click="stopCrawling">停止一言爬虫</el-button>
      <el-button @click="queryHitokotoFromDB">console.log(queryHitokotoFromDB())</el-button>
    </el-row>
  </el-card>
</template>

<script>

  import { getHitokoto, queryHitokoto, saveHitokoto } from '@/api/tools'

  export default {
    mounted() {
      this.crawlerInterval = null
    },

    methods: {

      startCrawling() {
        clearInterval(this.crawlerInterval)
        this.crawlerInterval = setInterval(() => {
          this.handleCrawlingHitokoto()
        }, 1000)

        this.$message({
          type: 'warning',
          message: '爬虫已启动！'
        })
      },
      stopCrawling() {
        clearInterval(this.crawlerInterval)

        this.$message({
          type: 'warning',
          message: '爬虫已停止！'
        })
      },
      async handleCrawlingHitokoto() {
        try {
          let hitokoto = await getHitokoto()
          hitokoto = hitokoto.data

          // console.log(hitokoto)

          this.$message({
            type: 'success',
            message: hitokoto
          })

          const res = await saveHitokoto(hitokoto)
          // console.log(res)

          this.$message({
            type: 'success',
            message: res.message
          })
        } catch (e) {
          // console.error(e)
        }
      },
      queryHitokotoFromDB() {
        queryHitokoto().then(res => {
          console.log(res)
        }).catch(e => {
          console.error(e)
        })
      }
    }
  }
</script>
