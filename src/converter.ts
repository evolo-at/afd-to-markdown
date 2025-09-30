import { ADFNode, ADFDocument, ConversionContext } from "./types";
import { applyMarks } from "./marks";

export class ADFToMarkdownConverter {
  private context: ConversionContext = {
    listDepth: 0,
    inTable: false,
    orderedListCounters: [],
  };

  /**
   * Convert ADF document to Markdown
   */
  public convert(doc: ADFDocument): string {
    if (!doc || doc.type !== "doc") {
      throw new Error('Root node must be of type "doc"');
    }

    const result = this.convertNodes(doc.content || []);
    return result.trim();
  }

  /**
   * Convert an array of nodes
   */
  private convertNodes(nodes: ADFNode[]): string {
    return nodes.map((node) => this.convertNode(node)).join("");
  }

  /**
   * Convert a single node
   */
  private convertNode(node: ADFNode): string {
    switch (node.type) {
      // Block nodes
      case "paragraph":
        return this.convertParagraph(node);
      case "heading":
        return this.convertHeading(node);
      case "bulletList":
        return this.convertBulletList(node);
      case "orderedList":
        return this.convertOrderedList(node);
      case "listItem":
        return this.convertListItem(node);
      case "taskList":
        return this.convertTaskList(node);
      case "taskItem":
        return this.convertTaskItem(node);
      case "codeBlock":
        return this.convertCodeBlock(node);
      case "blockquote":
        return this.convertBlockquote(node);
      case "rule":
        return this.convertRule();
      case "table":
        return this.convertTable(node);
      case "tableRow":
        return this.convertTableRow(node);
      case "tableHeader":
        return this.convertTableCell(node, true);
      case "tableCell":
        return this.convertTableCell(node, false);
      case "panel":
        return this.convertPanel(node);
      case "mediaSingle":
        return this.convertMediaSingle(node);
      case "media":
        return this.convertMedia(node);
      case "expand":
        return this.convertExpand(node);
      case "decisionList":
        return this.convertDecisionList(node);
      case "decisionItem":
        return this.convertDecisionItem(node);
      case "blockCard":
        return this.convertBlockCard(node);

      // Inline nodes
      case "text":
        return this.convertText(node);
      case "hardBreak":
        return this.convertHardBreak();
      case "mention":
        return this.convertMention(node);
      case "emoji":
        return this.convertEmoji(node);
      case "date":
        return this.convertDate(node);
      case "status":
        return this.convertStatus(node);
      case "inlineCard":
        return this.convertInlineCard(node);

      default:
        console.warn(`Unsupported node type: ${node.type}`);
        return "";
    }
  }

  // Block node converters

  private convertParagraph(node: ADFNode): string {
    if (!node.content || node.content.length === 0) {
      return "\n";
    }
    const content = this.convertNodes(node.content);
    return content + "\n\n";
  }

  private convertHeading(node: ADFNode): string {
    const level = node.attrs?.level || 1;
    const hashes = "#".repeat(level);
    const content = this.convertNodes(node.content || []);
    return `${hashes} ${content}\n\n`;
  }

  private convertBulletList(node: ADFNode): string {
    this.context.listDepth++;
    const result = this.convertNodes(node.content || []);
    this.context.listDepth--;
    return result + (this.context.listDepth === 0 ? "\n" : "");
  }

  private convertOrderedList(node: ADFNode): string {
    this.context.listDepth++;
    this.context.orderedListCounters.push(node.attrs?.order || 1);
    const result = this.convertNodes(node.content || []);
    this.context.orderedListCounters.pop();
    this.context.listDepth--;
    return result + (this.context.listDepth === 0 ? "\n" : "");
  }

  private convertListItem(node: ADFNode): string {
    const indent = "  ".repeat(this.context.listDepth - 1);
    const isOrdered =
      this.context.orderedListCounters.length >= this.context.listDepth;

    let marker: string;
    if (isOrdered) {
      const counterIndex = this.context.orderedListCounters.length - 1;
      const counter = this.context.orderedListCounters[counterIndex];
      marker = `${counter}.`;
      this.context.orderedListCounters[counterIndex]++;
    } else {
      marker = "-";
    }

    const content = node.content || [];
    let result = "";

    // Process the list item content
    for (let i = 0; i < content.length; i++) {
      const child = content[i];

      if (child.type === "paragraph") {
        const text = this.convertNodes(child.content || []).trim();
        if (i === 0) {
          result += `${indent}${marker} ${text}\n`;
        } else {
          result += `${indent}  ${text}\n`;
        }
      } else if (child.type === "bulletList" || child.type === "orderedList") {
        result += this.convertNode(child);
      }
    }

    return result;
  }

  private convertTaskList(node: ADFNode): string {
    this.context.listDepth++;
    const result = this.convertNodes(node.content || []);
    this.context.listDepth--;
    return result + (this.context.listDepth === 0 ? "\n" : "");
  }

  private convertTaskItem(node: ADFNode): string {
    const indent = "  ".repeat(this.context.listDepth - 1);
    const checked = node.attrs?.state === "DONE" ? "x" : " ";
    const content = this.convertNodes(node.content || []).trim();
    return `${indent}- [${checked}] ${content}\n`;
  }

  private convertCodeBlock(node: ADFNode): string {
    const language = node.attrs?.language || "";
    const code = node.content?.[0]?.text || "";
    return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
  }

  private convertBlockquote(node: ADFNode): string {
    const content = this.convertNodes(node.content || []).trim();
    const lines = content.split("\n");
    return lines.map((line) => `> ${line}`).join("\n") + "\n\n";
  }

  private convertRule(): string {
    return "---\n\n";
  }

  private convertTable(node: ADFNode): string {
    this.context.inTable = true;
    const rows = node.content || [];
    let result = "";

    for (let i = 0; i < rows.length; i++) {
      result += this.convertNode(rows[i]);

      // Add separator after header row
      if (i === 0) {
        const headerCells = rows[0].content?.length || 0;
        result += "| " + Array(headerCells).fill("---").join(" | ") + " |\n";
      }
    }

    this.context.inTable = false;
    return result + "\n";
  }

  private convertTableRow(node: ADFNode): string {
    const cells = (node.content || []).map((cell) => this.convertNode(cell));
    return "| " + cells.join(" | ") + " |\n";
  }

  private convertTableCell(node: ADFNode, isHeader: boolean): string {
    const content = this.convertNodes(node.content || []).trim();
    return content;
  }

  private convertPanel(node: ADFNode): string {
    const panelType = node.attrs?.panelType || "info";
    const icons: Record<string, string> = {
      info: "ℹ️",
      note: "📝",
      warning: "⚠️",
      error: "❌",
      success: "✅",
    };
    const icon = icons[panelType] || "ℹ️";
    const content = this.convertNodes(node.content || []).trim();
    const lines = content.split("\n");
    return lines.map((line) => `> ${icon} ${line}`).join("\n") + "\n\n";
  }

  private convertMediaSingle(node: ADFNode): string {
    const media = node.content?.[0];
    if (media) {
      return this.convertMedia(media);
    }
    return "";
  }

  private convertMedia(node: ADFNode): string {
    const alt = node.attrs?.alt || "image";
    const id = node.attrs?.id || "";
    const collection = node.attrs?.collection || "";

    // Generate a placeholder URL or use ID
    const url = id ? `![${alt}](media://${id})` : `![${alt}]()`;
    return url + "\n\n";
  }

  private convertExpand(node: ADFNode): string {
    const title = node.attrs?.title || "Expand";
    const content = this.convertNodes(node.content || []).trim();
    return `<details>\n<summary>${title}</summary>\n\n${content}\n</details>\n\n`;
  }

  private convertDecisionList(node: ADFNode): string {
    return this.convertNodes(node.content || []) + "\n";
  }

  private convertDecisionItem(node: ADFNode): string {
    const state = node.attrs?.state || "DECIDED";
    const marker = state === "DECIDED" ? "✓" : "○";
    const content = this.convertNodes(node.content || []).trim();
    return `- ${marker} ${content}\n`;
  }

  private convertBlockCard(node: ADFNode): string {
    const url = node.attrs?.url || "";
    return url ? `[${url}](${url})\n\n` : "";
  }

  // Inline node converters

  private convertText(node: ADFNode): string {
    const text = node.text || "";
    return applyMarks(text, node.marks);
  }

  private convertHardBreak(): string {
    return "  \n";
  }

  private convertMention(node: ADFNode): string {
    const text = node.attrs?.text || "@unknown";
    return text;
  }

  private convertEmoji(node: ADFNode): string {
    const emoji = node.attrs?.text || node.attrs?.shortName || "";
    return emoji;
  }

  private convertDate(node: ADFNode): string {
    const timestamp = node.attrs?.timestamp;
    if (timestamp) {
      const date = new Date(parseInt(timestamp));
      return date.toLocaleDateString();
    }
    return "";
  }

  private convertStatus(node: ADFNode): string {
    const text = node.attrs?.text || "";
    const color = node.attrs?.color || "neutral";
    return `[${text}]`;
  }

  private convertInlineCard(node: ADFNode): string {
    const url = node.attrs?.url || "";
    return url ? `[${url}](${url})` : "";
  }
}

/**
 * Convert ADF to Markdown
 */
export function convertADFToMarkdown(adf: ADFDocument): string {
  const converter = new ADFToMarkdownConverter();
  return converter.convert(adf);
}
