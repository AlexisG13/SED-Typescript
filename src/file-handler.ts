import * as fs from 'fs';

export function saveLine(line: string, file: string) {
	fs.appendFileSync(file + '-copy', line + '\n');
}

export function fileExists(file: string): boolean {
	if (fs.existsSync(file)) return true;
	return false;
}

//Delete temporary file
export function unlinkFile(file: string) {
	fs.unlink(file, function(err) {
		if (err) console.log('Error deleting the old file :(');
		return;
	});
	fs.rename(file + '-copy', file, function(err) {
		if (err) console.log('Error renaming the temporary file :(');
		return;
	});
}

//Get each line from a file
export function readFile(file: string): string[] {
	let instructions: string[];
	let data = fs.readFileSync(file);
	instructions = data.toString().split('\n');
	return instructions;
}
