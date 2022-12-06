<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { ref, Ref, computed } from 'vue';
const markdownTextArea: Ref<HTMLTextAreaElement | null> = ref(null);
const inputMarkdown = ref('');

const markdownToHtml = computed(() => {
  const markdownResult = new MarkdownIt();
  const convertedStringFromMarkdown = markdownResult.render(inputMarkdown.value);
  return convertedStringFromMarkdown;
});

const insertAtCursor = (insertText: string) => {
  const markdownTextAreaOrNull = markdownTextArea.value;
  if (markdownTextAreaOrNull === null) return;
  const textArea = markdownTextAreaOrNull as HTMLTextAreaElement;
  if (textArea.selectionStart || textArea.selectionStart === 0) {
    const startPosition = textArea.selectionStart;
    const endPosition = textArea.selectionEnd;
    inputMarkdown.value = `${textArea.value.substring(0, startPosition)}${insertText}${textArea.value.substring(endPosition, textArea.value.length)}`
    return;
  }
  inputMarkdown.value += insertText;
}

</script>

<template>
  <section
    class="w-full box-border flex flex-col border border-gray-300 border-2"
  >
    <div
      class="w-full box-border px-3 py-2 border-b-2 border-gray-300 space-x-3 flex items-center"
    >
      <button
        class="i-fa6-solid-b font-bold w-5 h-5 cursor-pointer"
      ></button>
      <button
        class="i-ooui-italic-i font-bold w-5 h-5 cursor-pointer"
      >
      </button>
      <button
        class="i-mdi-format-underline font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        class="i-fluent-text-strikethrough-16-filled font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        class="i-material-symbols-format-quote-rounded font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        class="i-majesticons-underline-2 font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        class="i-material-symbols-format-list-numbered-rounded font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        class="i-material-symbols-format-list-bulleted font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        class="i-mingcute-link-fill font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        class="i-material-symbols-broken-image-outline font-bold w-6 h-6 cursor-pointer"
      >
      </button>
    </div>
    <div
      class="box-border w-full"
    >
      <textarea
        ref="markdownTextArea"
        placeholder="請輸入內容"
        class="
          w-[calc(95%_+_2.6rem)]
          h-48 px-3 py-2
          focus:outline-none
          border-none
          text-lg
        "
        v-model="inputMarkdown"
      ></textarea>
    </div>
  </section>
  <div>
  </div>
  <div
    class="w-full bg-gray-200 px-3 py-2 box-border markdown-limit"
    v-html="markdownToHtml">
  </div>
</template>

<style scoped></style>

