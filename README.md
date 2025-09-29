# adf-to-markdown

A TypeScript library for converting Atlassian Document Format (ADF) to Markdown.

## Overview

This library provides a simple and reliable way to convert ADF JSON documents (used by Jira, Confluence, and other Atlassian products) into standard Markdown format.

## Installation

```bash
npm install adf-to-markdown
```

## Usage

### Basic Usage

```typescript
import { convertADFToMarkdown } from 'adf-to-markdown';

// Your ADF document (e.g., from Jira API)
const adfDocument = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello, World!'
        }
      ]
    }
  ]
};

// Convert to Markdown
const markdown = convertADFToMarkdown(adfDocument);
console.log(markdown); // Output: Hello, World!
```

### With Jira API

```typescript
import { convertADFToMarkdown } from 'adf-to-markdown';

// Fetch issue from Jira API
const response = await fetch('https://your-domain.atlassian.net/rest/api/3/issue/PROJ-123');
const issue = await response.json();

// Convert description to Markdown
const description = convertADFToMarkdown(issue.fields.description);
console.log(description);
```

### Using the Converter Class

```typescript
import { ADFToMarkdownConverter } from 'adf-to-markdown';

const converter = new ADFToMarkdownConverter();
const markdown = converter.convert(adfDocument);
```

## Supported ADF Node Types

### Block Nodes
- ✅ Paragraphs
- ✅ Headings (levels 1-6)
- ✅ Bullet lists (nested)
- ✅ Ordered lists (nested)
- ✅ Task lists (checkboxes)
- ✅ Code blocks (with language syntax)
- ✅ Blockquotes
- ✅ Horizontal rules
- ✅ Tables (with headers)
- ✅ Panels (info, warning, error, success)
- ✅ Media (images)
- ✅ Expand sections (collapsible)
- ✅ Decision lists

### Inline Nodes
- ✅ Text
- ✅ Hard breaks
- ✅ Mentions (@username)
- ✅ Emojis
- ✅ Dates
- ✅ Status badges
- ✅ Inline cards
- ✅ Block cards

### Text Marks
- ✅ **Bold** (strong)
- ✅ *Italic* (emphasis)
- ✅ `Inline code`
- ✅ ~~Strikethrough~~
- ✅ <u>Underline</u>
- ✅ [Links](url)
- ✅ <sub>Subscript</sub> / <sup>Superscript</sup>
- ✅ Text colors (HTML span)

## Conversion Examples

### Headings
```typescript
// ADF
{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Title' }] }

// Markdown
# Title
```

### Lists
```typescript
// ADF bulletList
{ type: 'bulletList', content: [
  { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item 1' }] }] }
]}

// Markdown
- Item 1
```

### Task Lists
```typescript
// ADF taskList
{ type: 'taskList', content: [
  { type: 'taskItem', attrs: { state: 'DONE' }, content: [{ type: 'text', text: 'Complete' }] }
]}

// Markdown
- [x] Complete
```

### Tables
```typescript
// ADF table converts to Markdown table format
| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |
```

### Code Blocks
```typescript
// ADF
{ type: 'codeBlock', attrs: { language: 'javascript' }, content: [{ type: 'text', text: 'console.log("Hello");' }] }

// Markdown
```javascript
console.log("Hello");
```
```

### Panels
```typescript
// ADF panel with type 'info'
// Markdown
> ℹ️ This is an info panel
```

### Expand Sections
```typescript
// ADF expand with title
// Markdown
<details>
<summary>Click to expand</summary>

Content here
</details>
```

## Limitations

- **Media nodes**: Converted to markdown image syntax with `media://` URLs. You may need to replace these with actual image URLs.
- **Text color**: Preserved using HTML `<span style="color: ...">` tags.
- **Underline**: Preserved using HTML `<u>` tags (not standard markdown).
- **Subscript/Superscript**: Preserved using HTML `<sub>` and `<sup>` tags.

## API Reference

### `convertADFToMarkdown(adf: ADFDocument): string`

Convert an ADF document to Markdown.

**Parameters:**
- `adf`: An ADF document object with `type: 'doc'` as root

**Returns:**
- A string containing the converted Markdown

**Throws:**
- Error if the root node is not of type 'doc'

### `ADFToMarkdownConverter`

A class providing ADF to Markdown conversion.

**Methods:**
- `convert(doc: ADFDocument): string` - Convert an ADF document to Markdown

## TypeScript Support

This library is written in TypeScript and includes type definitions out of the box.

```typescript
import type { ADFDocument, ADFNode } from 'adf-to-markdown';
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Related Resources

- [Atlassian Document Format Documentation](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/)
- [Jira Cloud REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Confluence Cloud REST API](https://developer.atlassian.com/cloud/confluence/rest/)