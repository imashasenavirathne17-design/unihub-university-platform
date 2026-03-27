import fs from 'fs';
import path from 'path';

const projectBase = process.cwd();

const EXCLUDE_DIRS = ['node_modules', 'dist', 'public', '.git', '.vscode', '.gemini'];
const EXCLUDE_FILES = [
  'package.json', 'package-lock.json', 'vite.config.js', 'eslint.config.js',
  'README.md', '.gitignore', 'rename_project.js', 'index.html'
];
const PREFIX = 'OnExam_';

function getFilesToProcess(dir, filesList = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(item)) {
        getFilesToProcess(fullPath, filesList);
      }
    } else {
      if (dir === projectBase && EXCLUDE_FILES.includes(item)) {
        continue;
      }
      if (item.startsWith(PREFIX)) {
        continue;
      }
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allFiles = getFilesToProcess(projectBase);
const fileMap = {};

allFiles.forEach(file => {
  const basename = path.basename(file);
  const ext = path.extname(file);
  const nameWithoutExt = path.basename(file, ext);
  
  const newBasename = PREFIX + basename;
  const newNameWithoutExt = PREFIX + nameWithoutExt;

  fileMap[basename] = newBasename;
  fileMap[nameWithoutExt] = newNameWithoutExt;
});

const filesToUpdate = [...allFiles];
if (fs.existsSync(path.join(projectBase, 'index.html'))) {
  filesToUpdate.push(path.join(projectBase, 'index.html'));
}

filesToUpdate.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    let dirty = false;

    const regexes = [
      /(from\s+['"])(.*?)(['"])/g,
      /(import\s+['"])(.*?)(['"])/g,
      /(import\(['"])(.*?)(['"]\))/g,
      /(export\s+.*?\s+from\s+['"])(.*?)(['"])/g,
      /(src=['"])(.*?)(['"])/g,
      /(href=['"])(.*?)(['"])/g,
    ];

    for (const r of regexes) {
      content = content.replace(r, (match, p1, p2, p3) => {
        if (!p2.startsWith('.') && !p2.startsWith('/src/')) {
           return match;
        }

        const dir = path.dirname(p2);
        let base = path.basename(p2);
        
        let suffix = '';
        if (base.includes('?')) {
          const parts = base.split('?');
          base = parts[0];
          suffix = '?' + parts[1];
        } else if (base.includes('#')) {
          const parts = base.split('#');
          base = parts[0];
          suffix = '#' + parts[1];
        }
        
        if (fileMap[base]) {
          dirty = true;
          const newBase = fileMap[base];
          return p1 + (dir === '.' ? './' + newBase : dir + '/' + newBase) + suffix + p3;
        }
        return match;
      });
    }

    if (dirty) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`Updated imports in: ${path.basename(file)}`);
    }
  } catch (e) {
    console.error(`Error processing file ${file}:`, e.message);
  }
});

// Rename the files themselves
let renameCount = 0;
allFiles.forEach(file => {
  const dir = path.dirname(file);
  const basename = path.basename(file);
  const newPath = path.join(dir, PREFIX + basename);
  fs.renameSync(file, newPath);
  renameCount++;
});

console.log(`Updated contents and renamed ${renameCount} files with prefix '${PREFIX}' successfully.`);
