/**
 * Renders a Shopify `rich_text_field` metafield value (a JSON AST) to HTML.
 *
 * Shopify does not ship an HTML form of these fields over the Storefront API,
 * so this walks the documented node types and escapes every text value — the
 * output goes through `v-html`, so nothing may pass through unescaped.
 */

type RichTextNode = {
  type: string;
  value?: string;
  level?: number;
  url?: string;
  title?: string;
  target?: string;
  bold?: boolean;
  italic?: boolean;
  listType?: 'unordered' | 'ordered';
  children?: RichTextNode[];
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderChildren = (node: RichTextNode): string => (node.children ?? []).map(renderNode).join('');

function renderNode(node: RichTextNode): string {
  switch (node.type) {
    case 'root':
      return renderChildren(node);
    case 'paragraph':
      return `<p>${renderChildren(node)}</p>`;
    case 'heading': {
      const level = Math.min(Math.max(node.level ?? 3, 1), 6);
      return `<h${level}>${renderChildren(node)}</h${level}>`;
    }
    case 'list':
      return node.listType === 'ordered'
        ? `<ol>${renderChildren(node)}</ol>`
        : `<ul>${renderChildren(node)}</ul>`;
    case 'list-item':
      return `<li>${renderChildren(node)}</li>`;
    case 'link': {
      // Only http(s) and mailto survive, so a crafted value can't become javascript:.
      const safeUrl = /^(https?:|mailto:)/i.test(node.url ?? '') ? node.url! : '#';
      const target = node.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
      const title = node.title ? ` title="${escapeHtml(node.title)}"` : '';
      return `<a href="${escapeHtml(safeUrl)}"${title}${target}>${renderChildren(node)}</a>`;
    }
    case 'text': {
      let text = escapeHtml(node.value ?? '');
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      return text;
    }
    default:
      return renderChildren(node);
  }
}

/** Returns '' for empty, missing or unparseable values. */
export const shopifyRichTextToHtml = (value: string | null | undefined): string => {
  if (!value) return '';
  try {
    const parsed = JSON.parse(value) as RichTextNode;
    return renderNode(parsed);
  } catch {
    // Older metafields may hold plain text rather than the JSON AST.
    return `<p>${escapeHtml(value)}</p>`;
  }
};
