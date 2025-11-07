import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

//у меня чет дерьмово билдились jsки, где-то нашел способ и создал такой костыль
//я слышал о других билдерах, но пока решил еще больше всякого опционального не добавлять
function processDirectory(dir) {
  const items = readdirSync(dir, { withFileTypes: true });
  items.forEach(item => {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      processDirectory(fullPath);
    } 
    else if (item.isFile() && item.name.endsWith('.js')) {
      let content = readFileSync(fullPath, 'utf8');
      
      content = content.replace(
        /import\s+(['"])(.+?)\1;/g,
        (match, quote, path) => `import ${quote}${path}.js${quote};`
      );

      content = content.replace(
        /from\s+(['"])(.+?)\1;/g,
        (match, quote, path) => `from ${quote}${path}.js${quote};`
      );

      writeFileSync(fullPath, content);
    }
  });
}

processDirectory('./dist');