<script setup lang="ts">
import { useMarkDownTextArea } from '../composable/markdownTextArea';

const props = withDefaults(defineProps<{
  insertedImageLink: string;
}>(), {
  insertedImageLink: '',
});

const emit = defineEmits<{
  (e: 'update:insertedImageLink', insertedImageLink: string): void;
}>();


const {
  inputMarkdown,
  markdownTextArea,
  markdownToHtml,
  addBoldBlock,
  addItalicBlock,
  addUnderlineBlock,
  addSlashLineBlock,
  addBlockQuoteBlock,
  unknownUsageBlock,
  addNumberListBlock,
  addDotListBlock,
  addHeaderBlock,
  addLinkBlock,
  addImgBlock,
} = useMarkDownTextArea()

</script>

<template>
  <section
    class="w-full box-border flex flex-col border border-gray-300 border-2"
  >
    <div
      class="w-full box-border px-3 py-2 border-b-2 border-gray-300 space-x-3 flex items-center"
    >
      <button
        @click="addBoldBlock"
        class="i-fa6-solid-b font-bold w-5 h-5 cursor-pointer"
      ></button>
      <button
        @click="addItalicBlock"
        class="i-ooui-italic-i font-bold w-5 h-5 cursor-pointer"
      >
      </button>
      <button
        @click="addUnderlineBlock"
        class="i-mdi-format-underline font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        @click="addSlashLineBlock"
        class="i-fluent-text-strikethrough-16-filled font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        @click="addBlockQuoteBlock"
        class="i-material-symbols-format-quote-rounded font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        @click="unknownUsageBlock"
        class="i-majesticons-underline-2 font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        @click="addNumberListBlock"
        class="i-material-symbols-format-list-numbered-rounded font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        @click="addDotListBlock"
        class="i-material-symbols-format-list-bulleted font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        @click="addHeaderBlock"
        class="i-ph-text-h-bold font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        @click="addLinkBlock"
        class="i-mingcute-link-fill font-bold w-6 h-6 cursor-pointer"
      >
      </button>
      <button
        @click="addImgBlock"
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
          w-full
          h-48 px-3 py-2
          focus:outline-none
          border-none
          box-border
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
