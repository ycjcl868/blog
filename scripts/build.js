import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
dotenv.config({
  path: [
    path.join(rootDir, '.dev.vars'),
    path.join(rootDir, '.vars'),
    path.join(rootDir, '.env'),
  ],
});

const templatePath = path.join(rootDir, 'wrangler.toml.tpl');
const outputPath = path.join(rootDir, 'wrangler.toml');

try {
  let templateContent = fs.readFileSync(templatePath, 'utf8');

  const variables = {
    CLOUDFLARE_KV_ID: process.env.CLOUDFLARE_KV_ID,
  };

  // 替换所有变量
  Object.keys(variables).forEach((key) => {
    const placeholder =
      '\\${\\s*' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*}';
    templateContent = templateContent.replace(
      new RegExp(placeholder, 'g'),
      variables[key]
    );
  });

  //
  fs.writeFileSync(outputPath, templateContent);

  console.log('success build wrangler.toml');
} catch (error) {
  console.error('build wrangler.toml error:', error);
  process.exit(1);
}
