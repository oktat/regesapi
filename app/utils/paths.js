import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = resolve(__dirname, '../..');
const UPLOAD_PATH = join(ROOT_DIR, 'public', 'uploads');

export { ROOT_DIR, UPLOAD_PATH }
