<script setup>
import { RouterView } from 'vue-router'
import AppToasts from './views/system/AppToasts.vue'
import AiVoiceWidget from './views/system/AiVoiceWidget.vue';
</script>

<template>
  <RouterView />
  <AppToasts />
  <AiVoiceWidget />
</template>

<style>
/* App style */
</style>