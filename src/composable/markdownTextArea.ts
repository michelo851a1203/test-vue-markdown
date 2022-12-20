import { ref, Ref, computed, ComputedRef } from 'vue';
import MarkdownIt from 'markdown-it';
import { RenderRule } from 'markdown-it/lib/renderer';

export interface UseMarkdownTextAreaOptions {
  defaultTextInputTip?: string;
  defaultImageInputTipText?: string;
}

export function useMarkDownTextArea(
  textAreaOptions?: UseMarkdownTextAreaOptions,
) {
  const markdownTextArea: Ref<HTMLTextAreaElement | null> = ref(null);
  const inputMarkdown = ref('');
  const defaultNoneText = '(這裡輸入文字)';
  const defaultImageNoneText = '(請輸入圖片敘述)'

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

  const isMultipleLine = () => {
    const regularExpression = new RegExp('\n','gm')
    return regularExpression.test(inputMarkdown.value);
  }

  const getAllStringArraySplitWithLine = (): string[] => {
    const textArea = textAreaRef.value;
    const allStringArray = textArea.value
      .split(/\r?\n|\r/);
    return allStringArray;
  }

  const combineStringArrayToMultipleLine = (inputStringArray: string[]) => {
    const combinedString = inputStringArray.join('\n');
    return combinedString;
  }

  const getCurrentLineNumber = (): number => {
    const textArea = textAreaRef.value;
    const cursorStartPosition = textArea.selectionStart;
    const fromStartString = textArea.value
      .substring(0, cursorStartPosition)
      .split(/\r?\n|\r/);

    return fromStartString.length;
  }

  const getCurrentLineString = () => {
    const currentNumber = getCurrentLineNumber();
    const allStringArray = getAllStringArraySplitWithLine()
    return allStringArray[currentNumber -1];
  }

  const isSelectedTextAreaText = () => {
    const textArea = textAreaRef.value
    return textArea.selectionStart !== textArea.selectionEnd;
  }

  const getCurrentLinePositionFromCurrentLineStart = (): number => {
    const textArea = textAreaRef.value;
    const cursorStartPosition = textArea.selectionStart;
    const fromStartString = textArea.value
      .substring(0, cursorStartPosition)
      .split(/\r?\n|\r/);


    let beforeTotalStringLength = 0;
    let totalLength = 0;
    fromStartString.forEach((item, index) => {
      totalLength += item.length;
      if (index >= fromStartString.length - 1) return;
      beforeTotalStringLength += item.length;
    });

    const currentLinePosition = totalLength - beforeTotalStringLength;
    return currentLinePosition;
  }

  const checkCurrentInTagReturnIndex = (tag: string): number => {
    const currentLineString = getCurrentLineString();
    const splitStringArray = currentLineString.split(tag);
    const tagLength = tag.length;

    if (splitStringArray.length < 2) return -1;
    let currentPosition = getCurrentLinePositionFromCurrentLineStart()
    let currentIndex = -1;
    let sum = 0
    splitStringArray.forEach((item, index) => {
      sum += item.length + tagLength;
      if (sum > currentPosition && currentIndex === -1) {
        currentIndex = index;
        return;
      }
    });

    if (currentIndex === 0) return -1;
    if (currentIndex === splitStringArray.length - 1) return -1;
    return currentIndex;
  }

  const appendBoldBlockLastLine = (): void => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;

    if (!isCurrentLineEmpty()) {
      // inputMarkdown.value += `  \n**${tip}**`;
      const currentPosition = checkCurrentInTagReturnIndex('**')
      console.log(currentPosition);
      // getPosition and remove tag
      return;
    } else {
      inputMarkdown.value += `**${tip}**`;
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
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;

    if (!isCurrentLineEmpty()) {
      inputMarkdown.value += `  \n*${tip}*`;
    } else {
      inputMarkdown.value += `*${tip}*`;
    }

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length - 1;
      const cursorStartPosition = cursorEndPosition - tip.length;
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
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;

    if (!isCurrentLineEmpty()) {
      inputMarkdown.value += `  \n_${tip}_`;
    } else {
      inputMarkdown.value += `_${tip}_`;
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
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;

    if (!isCurrentLineEmpty()) {
      inputMarkdown.value += `  \n~~${tip}~~`;
    } else {
      inputMarkdown.value += `~~${tip}~~`;
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
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;

    if (!isCurrentLineEmpty()) {
      inputMarkdown.value += `  \n>${tip}`;
    } else {
      inputMarkdown.value += `>${tip}`;
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

  const isCurrentStringNumberList = (inputString: string) => {
    const numberListRegularExpression = new RegExp('^[1-9][0-9]{0,999999}\. |[1-9]\. ');
    return numberListRegularExpression.test(inputString);
  }

  const currentNumberListNumber = (inputString: string): number => {
    const replaceNumberListRegularExpression = new RegExp('^(([1-9][0-9]{0,999999})\. |([1-9])\. ).*$');
    const getCurrentString = inputString.replace(replaceNumberListRegularExpression, '$2');
    if (Number.isNaN(Number(getCurrentString))) return -1;
    return Number(getCurrentString);
  }

  const setPlainTextToLineNumberList = (setNumber: number) => {
    const currentLineNumber = getCurrentLineNumber();
    const allLineStringArray = getAllStringArraySplitWithLine();
    allLineStringArray[currentLineNumber - 1] = `${setNumber}. ${allLineStringArray[currentLineNumber - 1]}`;
    inputMarkdown.value = combineStringArrayToMultipleLine(allLineStringArray);
  }

  const numberListTagImplementation = (
    setNumberListTextHandler: (setNumber: number) => void,
  ) => {
    const currentLineNumber = getCurrentLineNumber();
    const allLineStringArray = getAllStringArraySplitWithLine();

    if (currentLineNumber === 1) {
      setNumberListTextHandler(1);
      return;
    }

    const previousLine = allLineStringArray[currentLineNumber - 2];

    if (!isCurrentStringNumberList(previousLine)) {
      setNumberListTextHandler(1);
      return;
    }

    const previousLineNumber = currentNumberListNumber(previousLine);
    if (previousLineNumber === -1) return;
    setNumberListTextHandler(previousLineNumber + 1);
  }

  const appendNumberListText = (setNumber: number) => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;
    inputMarkdown.value += `${setNumber}. ${tip}`;

    setTimeout(() => {
      const cursorEndPosition = inputMarkdown.value.length;
      const cursorStartPosition = inputMarkdown.value.length - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addNumberListBlock = () => {
    if (isSelectedTextAreaText()) return;
    if (!isCurrentLineEmpty()) {
      numberListTagImplementation(setPlainTextToLineNumberList);
      return
    }
    numberListTagImplementation(appendNumberListText);
  }

  const appendDotListBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;
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

  const addDotListBlock = (): void => {
    if (isSelectedTextAreaText()) return;
    appendDotListBlockLastLine()
  }

  const isCurrentLineEmpty = (): boolean => getCurrentLineString() === '';

  const appendHeaderBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;

    if (!isCurrentLineEmpty()) {
      addExtraTagOnHeaderTagLine(0);
      return;
    }

    inputMarkdown.value += `# ${tip}`;
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

  const addExtraTagOnHeaderTagLine = (numberOfHeaderTag: number) => {
    let currentHeaderTag = ''
    for (let i = 0; i < numberOfHeaderTag; i++) {
      currentHeaderTag += '#';
    }
    const currentLineNumber = getCurrentLineNumber();
    const currentLineString = getCurrentLineString();
    const allLineStringArray = getAllStringArraySplitWithLine();

    const startHeaderRegularExpression = new RegExp(`^${currentHeaderTag}`);
    const isEmptyStartWhiteSpace = /^ /.test(allLineStringArray[currentLineNumber - 1]);

    let HeaderString = '#';
    if (numberOfHeaderTag === 0 && !isEmptyStartWhiteSpace) {
      HeaderString = '# ';
    } else {
      HeaderString = `${currentHeaderTag}#`
    }

    allLineStringArray[currentLineNumber - 1] = currentLineString
      .replace(startHeaderRegularExpression, HeaderString);

    inputMarkdown.value = combineStringArrayToMultipleLine(allLineStringArray);
  }

  const removeExtraTagOnHeaderTagLine = (numberOfHeaderTag: number) => {
    let currentHeaderTag = ''
    for (let i = 0; i < numberOfHeaderTag; i++) {
      currentHeaderTag += '#';
    }
    const currentLineNumber = getCurrentLineNumber();
    const currentLineString = getCurrentLineString();
    const allLineStringArray = getAllStringArraySplitWithLine();

    const startHeaderRegularExpression = new RegExp(`^${currentHeaderTag}`);
    allLineStringArray[currentLineNumber - 1] = currentLineString
      .replace(startHeaderRegularExpression, '');

    inputMarkdown.value = combineStringArrayToMultipleLine(allLineStringArray);
  }

  const addHeaderBlock = () => {
    if (isSelectedTextAreaText()) return;
    const maxHeaderNotionNumber = 6;
    const currentHeaderTagCount = getHeaderTagNumberOnCurrentLine(maxHeaderNotionNumber);

    if (currentHeaderTagCount === 0) {
      appendHeaderBlockLastLine()
      return;
    }

    if (currentHeaderTagCount === maxHeaderNotionNumber) {
      removeExtraTagOnHeaderTagLine(currentHeaderTagCount);
      return;
    }

    addExtraTagOnHeaderTagLine(currentHeaderTagCount);
  }

  const appendLinkBlockLastLine = () => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.defaultTextInputTip ?? defaultNoneText;
    const linkContent = '(https://)';
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `[${tip}]${linkContent}`;
    } else {
      inputMarkdown.value += `  \n [${tip}]${linkContent}`;
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

  const appendImageLinkBlockLastLine = (inputImageLink: string) => {
    const textArea = textAreaRef.value;
    const tip = textAreaOptions?.defaultImageInputTipText ?? defaultImageNoneText;
    if (inputMarkdown.value.length === 0) {
      inputMarkdown.value += `![${tip}](${inputImageLink})`;
    } else {
      inputMarkdown.value += `  \n![${tip}](${inputImageLink})`;
    }

    setTimeout(() => {
      const linkLength = inputImageLink.length;
      const cursorEndPosition = inputMarkdown.value.length - linkLength - 3;
      const cursorStartPosition = cursorEndPosition - tip.length;
      textArea.setSelectionRange(cursorStartPosition, cursorEndPosition);
      textArea.focus();
    }, 0);
  }

  const addImgBlock = (inputImageLink: string) => {
    appendImageLinkBlockLastLine(inputImageLink);
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
    addNumberListBlock,
    addDotListBlock,
    addHeaderBlock,
    addLinkBlock,
    addImgBlock,
  }
}
