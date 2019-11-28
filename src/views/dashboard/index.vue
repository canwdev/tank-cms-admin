<template>
  <div class="dashboard-container">
    <HelloWorld msg="TankCMS"/>
    <div class="dashboard-text"><strong>Welcome! {{ name }}</strong></div>
    <div>{{ parseTime(now) }}</div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'
  import { parseTime } from '@/utils'

  export default {
    data: () => ({
      now: new Date()
    }),
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    mounted() {
      setInterval(() => {
        this.now = new Date()
      }, 1000)
    },
    methods: {
      parseTime
    }
  }
</script>

<style lang="stylus" scoped>
  .dashboard-container {
    background: url("~@/assets/images/bg.png") no-repeat center / cover;
    color: #000;
    padding: 30px;
    min-height: calc(100vh - 50px);

    .dashboard-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

</style>
