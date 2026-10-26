import { publications } from '../data/publications';

export const prerender = true;

const bibText = (value: string) => value.replaceAll('&', '\\&').replaceAll('₂', '$_2$');
const authorName = (name: string) => {
  const parts = name.split(' ');
  return `${parts.pop()}, ${parts.join(' ')}`;
};

export function GET() {
  const entries = publications.map(paper => {
    const fields: [string, string][] = [
      ['title', `{${bibText(paper.title)}}`],
      ['author', paper.authors.map(authorName).join(' and ')],
      ['year', String(paper.year)],
    ];
    if (paper.kind === 'journal') fields.push(
      ['journal', paper.journal!], ['volume', paper.volume!],
      ['pages', paper.pages!], ['doi', paper.doi!],
    );
    fields.push(['eprint', paper.arxiv], ['archivePrefix', 'arXiv'],
      ['url', paper.doi ? `https://doi.org/${paper.doi}` : `https://arxiv.org/abs/${paper.arxiv}`]);
    return `@${paper.kind === 'journal' ? 'article' : 'misc'}{${paper.id},\n${fields.map(([key, value]) => `  ${key} = {${value}}`).join(',\n')}\n}`;
  }).join('\n\n');
  return new Response(entries + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
