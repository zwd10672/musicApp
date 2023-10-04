<template>
<m-header></m-header>
 <!-- eslint-disable-next-line vue/multi-word-component-names -->
<Tab></Tab>
<router-view></router-view>
</template>

<script>
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab'
export default {
  components: {
    MHeader: Header,
    Tab
  }
}
</script>
<style lang="scss">
</style>
