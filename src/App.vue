<script setup lang="ts">
import MarkDownTextArea from './components/MarkDownTextArea.vue';
import { ref } from 'vue';
const insertedImageLink = ref('');
</script>

<template>
  <MarkDownTextArea
    v-model:insertedImageLink="insertedImageLink"
  ></MarkDownTextArea>
</template>

<style scoped></style>

