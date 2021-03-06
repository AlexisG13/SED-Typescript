import * as fh from './file-handler';

//Function for trying a command on a line
export function Substitute(
	line: string,
	command: string,
	file: string,
	iState: boolean
): string {
	const [type, oldWord, newWord, flag] = command.split('/');
	let regObj = new RegExp(oldWord);
	if (flag.includes('g')) regObj = new RegExp(oldWord, 'g');
	let newLine = line.replace(regObj, newWord);
	if (flag.includes('p') && newLine !== line) {
		if (iState) fh.saveLine(newLine, file);
		else console.log(newLine);
	}
	return newLine;
}

//Get all the commands from the script file
export function getScriptCommands(file: string, args: string[]) {
	let instructions;
	const newArray: string[] = [];
	if (!fh.fileExists(file)) {
		console.error(`Couldn't open file ${file}: No such file or directory`);
		process.exit();
	}
	instructions = fh.readFile(file);
	instructions.forEach(instruction => {
		newArray.push(instruction);
	});
	return newArray;
}
