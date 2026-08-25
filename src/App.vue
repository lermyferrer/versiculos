<script setup lang="ts">
import ControlView from './views/ControlView.vue'
import DisplayView from './views/DisplayView.vue'

const view = new URLSearchParams(location.search).get('view')
</script>

<template>
  <DisplayView v-if="view === 'display'" />
  <ControlView v-else />
</template>
