<script>
  export default {
    name: 'MenuItem',
    functional: true,
    props: {
      icon: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    render(h, context) {
      const { icon, title } = context.props
      const vnodes = []

      if (icon) {
        vnodes.push(h('svg-icon', {
          props: {
            'icon-class': icon
          }
        }))
      }

      if (title) {
        vnodes.push(
          h('span', {
            slot: 'title',
            domProps: {
              innerText: title
            }
          }))
      }
      return vnodes
    }
  }
</script>

<style lang="stylus" scoped>
  .svg-icon {
    transform: scale(1.2);
  }
</style>
