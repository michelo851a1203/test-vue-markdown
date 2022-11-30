<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { ref, computed } from 'vue';
const inputMarkdown = ref('')

const markdownToHtml = computed(() => {
  const markdownResult = new MarkdownIt();
  const convertedStringFromMarkdown = markdownResult.render(inputMarkdown.value);
  return convertedStringFromMarkdown;
})

</script>

<template>
  <div>
    <textarea
      class="
        w-2/3 h-48 border border-gray-800 
        focus:outline-none
      "
      v-model="inputMarkdown"
    ></textarea>
  </div>
  <div
    class="w-full bg-gray-200 px-3 py-2 box-border markdown-limit"
    v-html="markdownToHtml">
  </div>
</template>

<style scoped></style>
