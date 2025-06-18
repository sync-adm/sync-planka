export const focusEnd = (element) => {
  element.focus();
  element.setSelectionRange(element.value.length + 1, element.value.length + 1);
};

export const isActiveTextElement = (element) =>
  ['input', 'textarea'].includes(element.tagName.toLowerCase()) &&
  element === document.activeElement;

export const isUsableMarkdownElement = (element) =>
  !!element.closest('.yfm a, .yfm-clipboard-button, .yfm-cut-title');
