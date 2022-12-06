import { ref, Ref, computed } from 'vue';
import MarkdownIt from 'markdown-it';


export function useMarkDownTextArea() {
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

  return {
    markdownTextArea,
    markdownToHtml,
    insertAtCursor,
  }
}
