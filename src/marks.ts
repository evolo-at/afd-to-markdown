import { Mark } from './types';

/**
 * Apply markdown marks to text
 */
export function applyMarks(text: string, marks?: Mark[]): string {
  if (!marks || marks.length === 0) {
    return text;
  }

  let result = text;
  const opening: string[] = [];
  const closing: string[] = [];

  // Process marks in order to nest them correctly
  for (const mark of marks) {
    switch (mark.type) {
      case 'strong':
        opening.push('**');
        closing.unshift('**');
        break;
      case 'em':
        opening.push('*');
        closing.unshift('*');
        break;
      case 'code':
        opening.push('`');
        closing.unshift('`');
        break;
      case 'strike':
        opening.push('~~');
        closing.unshift('~~');
        break;
      case 'underline':
        opening.push('<u>');
        closing.unshift('</u>');
        break;
      case 'link':
        if (mark.attrs?.href) {
          opening.push('[');
          closing.unshift(`](${mark.attrs.href})`);
        }
        break;
      case 'subsup':
        if (mark.attrs?.type === 'sub') {
          opening.push('<sub>');
          closing.unshift('</sub>');
        } else if (mark.attrs?.type === 'sup') {
          opening.push('<sup>');
          closing.unshift('</sup>');
        }
        break;
      case 'textColor':
        if (mark.attrs?.color) {
          opening.push(`<span style="color: ${mark.attrs.color}">`);
          closing.unshift('</span>');
        }
        break;
    }
  }

  return opening.join('') + result + closing.join('');
}