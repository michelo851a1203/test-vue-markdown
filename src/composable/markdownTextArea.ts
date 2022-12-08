import { ref, Ref, computed, ComputedRef } from 'vue';
import MarkdownIt from 'markdown-it';
import { RenderRule } from 'markdown-it/lib/renderer';

export interface UseMarkdownTextAreaOptions {
  BoldTextInputTip?: string;
}

export function useMarkDownTextArea(
  textAreaOptions?: UseMarkdownTextAreaOptions,
) {
  const markdownTextArea: Ref<HTMLTextAreaElement | null> = ref(null);
  const inputMarkdown = ref('');

  const markdownUnderline = (renderHtml: string): RenderRule => {
    return (tokens, idx, opts, _, self) => {
      const token = tokens[idx];
      if (token.markup === '_') {
        token.tag = renderHtml;
      }
      return self.renderToken(tokens, idx, opts);
    }
  }

  const markDownUnderline = (md: MarkdownIt): void => {
    md.renderer.rules.em_open = markdownUnderline('u');
    md.renderer.rules.em_close = markdownUnderline('u');
  }

  const markdownToHtml = computed(() => {
    const markdownResult = new MarkdownIt();
    markdownResult.use(markDownUnderline);
    const convertedStringFromMarkdown = markdownResult.render(inputMarkdown.value);
    return convertedStringFromMarkdown;
  });

  const textAreaRef: ComputedRef<HTMLTextAreaElement>  = computed(() => {
    const markdownTextAreaOrNull = markdownTextArea.value;
    if (markdownTextAreaOrNull === null) throw 'not get textArea';
    const textArea = markdownTextAreaOrNull as HTMLTextAreaElement;
    return textArea;
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

  const checkIsMultipleLine = () => {
    const regularExpression = new RegExp('\n','gm')
    return regularExpression.test(inputMarkdown.value);
  }

  const isSelectedTextAreaText = () => {
    const textArea = textAreaRef.value
    return textArea.selectionStart !== textArea.selectionEnd;
  }

  const appendBoldBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? '(這裡輸入文字)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `**${tip}**`;
    } else {
      inputMarkdown.value += `  \n**${tip}**`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length - 2;
      const cursorStartPosition = inputMarkdown.value.length - 2 - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addBoldBlock = () => {
    const textArea = textAreaRef.value;
    if (isSelectedTextAreaText()) return;
    appendBoldBlockLastLine()
  }

  const appendItalicBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? '(這裡輸入文字)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `*${tip}*`;
    } else {
      inputMarkdown.value += `  \n*${tip}*`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length - 2;
      const cursorStartPosition = inputMarkdown.value.length - 2 - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addItalicBlock = () => {
    const textArea = textAreaRef.value;
    if (isSelectedTextAreaText()) return;
    appendItalicBlockLastLine()
  }

  const appendUnderlineBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? '(這裡輸入文字)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `_${tip}_`;
    } else {
      inputMarkdown.value += `  \n_${tip}_`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length - 1;
      const cursorStartPosition = inputMarkdown.value.length - 1 - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addUnderlineBlock = () => {
    const textArea = textAreaRef.value;
    if (isSelectedTextAreaText()) return;
    appendUnderlineBlockLastLine()
  }


  const appendSlashBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? '(這裡輸入文字)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `~~${tip}~~`;
    } else {
      inputMarkdown.value += `  \n~~${tip}~~`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length - 2;
      const cursorStartPosition = inputMarkdown.value.length - 2 - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addSlashLineBlock = () => {
    const textArea = textAreaRef.value;
    if (isSelectedTextAreaText()) return;
    appendSlashBlockLastLine()
  }

  const appendBlockQuoteBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? '(這裡輸入文字)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `>${tip}`;
    } else {
      inputMarkdown.value += `  \n>${tip}`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length;
      const cursorStartPosition = inputMarkdown.value.length - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }


  const addBlockQuoteBlock = () => {
    const textArea = textAreaRef.value;
    if (isSelectedTextAreaText()) return;
    appendBlockQuoteBlockLastLine()
  }

  const unknownUsageBlock = () => {
  }

  const addNumberListBlock = () => {

  }

  const appendDotListBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? '(這裡輸入文字)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `- ${tip}`;
    } else {
      inputMarkdown.value += `  \n- ${tip}`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length;
      const cursorStartPosition = inputMarkdown.value.length - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addDotListBlock = () => {
    const textArea = textAreaRef.value;
    if (isSelectedTextAreaText()) return;
    appendDotListBlockLastLine()
  }


  const appendHeaderBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? '(這裡輸入文字)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `# ${tip}`;
    } else {
      inputMarkdown.value += `  \n# ${tip}`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length;
      const cursorStartPosition = inputMarkdown.value.length - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addHeaderBlock = () => {
    const textArea = textAreaRef.value;
    if (isSelectedTextAreaText()) return;
    appendHeaderBlockLastLine()
  }

  const appendLinkBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? '(這裡輸入文字)';
    const linkContent = '(https://)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `[${tip}]${linkContent}`;
    } else {
      inputMarkdown.value += `  \n# [${tip}]${linkContent}`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length - linkContent.length -1;
      const cursorStartPosition = cursorEndPosition - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addLinkBlock = () => {
    const textArea = textAreaRef.value;
    if (isSelectedTextAreaText()) return;
    appendLinkBlockLastLine()
  }

  const addImgBlock = () => {

  }
  

  return {
    inputMarkdown,
    markdownTextArea,
    markdownToHtml,
    insertAtCursor,
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
  }
}
