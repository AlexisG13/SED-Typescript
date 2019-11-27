// #!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as fh from './file-handler';
import { validCommand, validFile } from './regex-handler';

interface Arguments {
	e: (string | number)[] | undefined;
	f: (string | number)[] | undefined;
	[x: string]: unknown;
	_: (string | number)[];
	i: boolean;
	n: boolean;
}

const argv = yargs.options({
	e: { type: 'array', nargs: 1 },
	f: { type: 'array', nargs: 1 },
	i: { type: 'boolean', default: false, nargs: 1 },
	n: { type: 'boolean', default: false, nargs: 0 },
	_: { type: 'array' }
}).argv;

// Define yargs keys with their respective conditions
yargs.nargs('e', 1);
yargs.boolean('n');
yargs.nargs('xd', 1);
yargs.nargs('i', 1);
yargs.nargs('f', 1);
multipleFiles();

//Function for trying a command on a line
function eOption(line: string, command: string): string {
	let commandList = command.split('/');
	let oldWord = commandList[1];
	let newWord = commandList[2];
	let flag = commandList[3];
	let regObj = new RegExp(oldWord);
	if (flag === 'g' || flag === 'pg' || flag === 'gp')
		regObj = new RegExp(oldWord, 'g');
	let newLine = line.replace(regObj, newWord);
	if ((flag === 'p' || flag === 'pg' || flag === 'gp') && newLine !== line)
		console.log(newLine);
	return newLine;
}

//Get all the commands from the script file
function fOption(file: string, args: string[]) {
	let instructions;
	fh.fileExists(file);
	instructions = fh.readScriptFile(file);
	for (let instruction of instructions) {
		args.push(instruction);
	}
}

//Checking if the first argument is either a file or a command (without -e)
function multipleFiles() {
	if (validFile(yargs.argv._[0])) {
		for (let file of yargs.argv._) {
			SED(file, false);
		}
		return;
	} else {
		validCommand(yargs.argv._[0]);
		for (let file of yargs.argv._.slice(1)) {
			SED(file, true);
		}
		return;
	}
	console.log('Wrong command or unexisting file entered!');
}

// "MAIN"
function SED(file: string, noEOption: boolean) {
	// Variables declaration
	let printable = true;
	let save: boolean = false;
	let args: string[] = [];
	// The n option was used, don't print.
	if (!(yargs.argv.n === undefined)) printable = false;
	// The i option was used, don't print an edit the file.
	if (!(yargs.argv.i === undefined)) {
		printable = false;
		save = true;
	}
	// If the length is greater than 1, the e option was called
	if (noEOption === true) {
		args.push(yargs.argv._[0]);
	}
	// Check if file exists
	fh.fileExists(file);
	let lines: string[];
	// Read the file into an array
	lines = fh.readFile(file);
	// Get all the commands from each e and f option entered
	if (typeof yargs.argv.e === 'string') {
		args.push(yargs.argv.e);
	} else if (Array.isArray(yargs.argv.e)) {
		let eScripts: string[] = yargs.argv.e;
		for (let script of eScripts) {
			args.push(script);
		}
	}
	if (typeof yargs.argv.f === 'string') {
		fOption(yargs.argv.f, args);
	} else if (Array.isArray(yargs.argv.f)) {
		let fScripts: string[] = yargs.argv.f;
		for (let scriptFiles of fScripts) {
			fOption(scriptFiles, args);
		}
	}
	//Create backup file if needed
	if (save === true && yargs.argv.i !== '') {
		let backUp = file + '.' + yargs.argv.i;
		fs.copyFileSync(file, backUp);
	}
	let newLine: string;
	// Execute all the commands on each line
	for (let line of lines) {
		newLine = substitute(args, line);
		if (printable === true) console.log(newLine);
		if (save === true) fh.saveLine(newLine, file);
	}
	// Delete the old file and rename the temporary file
	if (save === true) {
		fh.unlinkFile(file);
	}
}

//Try every command on a line
function substitute(args: string[], line: string): string {
	let newLine = line;
	for (let arg of args) {
		validCommand(arg);
		newLine = eOption(newLine, arg);
	}
	return newLine;
}
