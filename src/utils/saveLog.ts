import { promises as fs } from 'fs';
import path from 'path';

function formatLogLine(item: unknown, index: number): string {
	if (typeof item === 'string') {
		return `[${index}] ${item}`;
	}

	try {
		return `[${index}] ${JSON.stringify(item)}`;
	} catch {
		return `[${index}] ${String(item)}`;
	}
}

export async function saveLog(data: unknown[], fileName: string = 'log'): Promise<string> {
	const safeName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
	const dirPath = path.resolve(process.cwd(), '.log');
	const filePath = path.join(dirPath, safeName);

	await fs.mkdir(dirPath, { recursive: true });

	const header = `Generated at ${new Date().toISOString()}`;
	const body = data.map((item, index) => formatLogLine(item, index)).join('\n');
	const content = `${header}\n${body}\n`;

	await fs.writeFile(filePath, content, { encoding: 'utf-8' });

	return filePath;
}
