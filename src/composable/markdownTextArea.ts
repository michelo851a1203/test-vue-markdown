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
  const defaultNoneText = '(這裡輸入文字)';

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
    const textArea = textAreaRef.value;
    if (textArea.selectionStart || textArea.selectionStart === 0) {
      const startPosition = textArea.selectionStart;
      const endPosition = textArea.selectionEnd;
      inputMarkdown.value = `${textArea.value.substring(0, startPosition)}${insertText}${textArea.value.substring(endPosition, textArea.value.length)}`
      return;
    }
    inputMarkdown.value += insertText;
  }

  const insertNotationBetweenText = (notationText: string) => {
    const textArea = textAreaRef.value;
    const startPosition = textArea.selectionStart;
    const endPosition = textArea.selectionEnd;
    const beforeString = textArea.value.substring(0, startPosition);
    const betweenString = textArea.value.substring(startPosition, endPosition);
    const afterString = textArea.value.substring(endPosition, textArea.value.length);
    inputMarkdown.value = `${beforeString}${notationText}${betweenString}${notationText}${afterString}`;
  }

  const getSelectionText = (): string => {
    const textArea = textAreaRef.value;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    return textArea.value.substring(start, end);
  }

  const checkIsMultipleLine = () => {
    const regularExpression = new RegExp('\n','gm')
    return regularExpression.test(inputMarkdown.value);
  }

  const getCurrentLineNumber = () => {
    const textArea = textAreaRef.value;
    const cursorStartPosition = textArea.selectionStart;
    const fromStartString = textArea.value
      .substring(0, cursorStartPosition)
      .split(/\r?\n|\r/);

    return fromStartString.length;
  }

  const getCurrentLineString = () => {
    const textArea = textAreaRef.value;
    const currentNumber = getCurrentLineNumber();
    const allStringArray = textArea.value
      .split(/\r?\n|\r/);

    return allStringArray[currentNumber -1];
  }

  const isSelectedTextAreaText = () => {
    const textArea = textAreaRef.value
    return textArea.selectionStart !== textArea.selectionEnd;
  }

  const appendBoldBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
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
    if (isSelectedTextAreaText()) {
      insertNotationBetweenText('**');
      return;
    }
    appendBoldBlockLastLine()
  }

  const appendItalicBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
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
    if (isSelectedTextAreaText()) {
      insertNotationBetweenText('*');
      return;
    }
    appendItalicBlockLastLine()
  }

  const appendUnderlineBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
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
    if (isSelectedTextAreaText()) {
      insertNotationBetweenText('_');
      return;
    }
    appendUnderlineBlockLastLine()
  }

  const appendSlashBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
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
    if (isSelectedTextAreaText()) {
      insertNotationBetweenText('~~');
      return;
    }
    appendSlashBlockLastLine()
  }

  const appendBlockQuoteBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
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
    if (isSelectedTextAreaText()) return;
    appendBlockQuoteBlockLastLine()
  }

  const unknownUsageBlock = () => {
  }


  const appendNumberListBlockLastLine = (currentNumber: number) => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `${currentNumber}. ${tip}`;
    } else {
      inputMarkdown.value += `  \n${currentNumber}. ${tip}`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length;
      const cursorStartPosition = inputMarkdown.value.length - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addNumberListBlock = () => {
    if (isSelectedTextAreaText()) return;
    appendNumberListBlockLastLine(1)
  }

  const appendDotListBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
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
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
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

  const isCurrentHeaderOnTagLine = (
    inputText: string,
    numberOfHeaderNotion: number,
  ) => {
    let currentSharpNotion = '';
    for (let i = 0; i < numberOfHeaderNotion; i++) {
      currentSharpNotion += '#'
    }

    const headerRegularExpression = new RegExp(`^${currentSharpNotion}`)
    return headerRegularExpression.test(inputText);
  }

  const getHeaderTagNumberOnCurrentLine = (maxHeaderNotionNumber: number): number => {
    const currentSelectedText = getCurrentLineString()
    let currentHeaderTagCountAddOne = 1;

    while(
      isCurrentHeaderOnTagLine(currentSelectedText, currentHeaderTagCountAddOne) && 
      currentHeaderTagCountAddOne <= (maxHeaderNotionNumber + 1)
    ) {
      currentHeaderTagCountAddOne++;
    }
    const currentHeaderTagCount= currentHeaderTagCountAddOne - 1;
    return currentHeaderTagCount;
  }

  const addHeaderBlock = () => {
    if (isSelectedTextAreaText()) return;
    const maxHeaderNotionNumber = 6;
    const currentHeaderTagCount = getHeaderTagNumberOnCurrentLine(maxHeaderNotionNumber);

    if (currentHeaderTagCount === 0) {
      appendHeaderBlockLastLine()
    }

    if (currentHeaderTagCount === maxHeaderNotionNumber) {
      // remove all headerTag
      return;
    }
    // append tag on 
  }

  const appendLinkBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.BoldTextInputTip ?? defaultNoneText;
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
    if (isSelectedTextAreaText()) return;
    appendLinkBlockLastLine()
  }

  const addImgBlock = () => {
    // insertAtCursor('hello testing');
    insertNotationBetweenText('testing cool');
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
