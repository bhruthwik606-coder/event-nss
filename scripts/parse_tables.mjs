import fs from 'fs';

const html = fs.readFileSync('downloaded_tables.html', 'utf8');

// Match sections with h2 and table
const sectionRegex = /<h2\s+id="([^"]+)">([^<]+)<\/h2>\s*<div\s+id="([^"]+)">([\s\S]*?)<\/table>/gi;
let match;
const domains = [];

while ((match = sectionRegex.exec(html)) !== null) {
  const [_, anchorId, title, divId, tableContent] = match;
  const rows = [];
  const trRegex = /<tr>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(tableContent)) !== null) {
    const rowHtml = trMatch[1];
    if (rowHtml.includes('<th')) continue; // Skip header row
    const tdMatches = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    if (tdMatches.length >= 2) {
      rows.push({
        sno: parseInt(tdMatches[0]) || rows.length + 1,
        description: tdMatches[1],
        type: tdMatches[2] || 'Open Track / HW & SW'
      });
    }
  }
  domains.push({
    id: anchorId,
    name: title.trim(),
    divId: divId.trim(),
    statements: rows
  });
}

console.log('Parsed domains:', domains.length);
let totalStatements = 0;
domains.forEach(d => {
  console.log(`${d.name}: ${d.statements.length} statements`);
  totalStatements += d.statements.length;
});
console.log('Total statements:', totalStatements);

const fileContent = `// Auto-generated CMR HACKFEST 3.0 problem statements data
export const hackfestDomains = ${JSON.stringify(domains, null, 2)};
`;

fs.writeFileSync('src/data/hackfestData.js', fileContent);
