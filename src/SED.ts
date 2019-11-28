// #!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as fh from './file-handler';
import * as rh from './regex-handler';
import { getScriptCommands, Substitute } from './command-handler';

interface Arguments {
	e: (string | number)[] | undefined;
	f: (string | number)[] | undefined;
	[x: string]: unknown;
	_: (string | number)[];
	i: string | undefined;
	n: boolean;
}

const argv = yargs.options({
	e: { type: 'array', nargs: 1 },
	f: { type: 'array', nargs: 1 },
	i: { type: 'string', nargs: 1 },
	n: { type: 'boolean', default: false, nargs: 0 },
	_: { type: 'array' }
}).argv;

parseFiles(argv);

function parseFiles(argos: Arguments) {
	const files = argos._.map(String);
	if (argos.e || argos.f) {
		files.forEach(file => {
			if (fh.fileExists(file)) parseCommands(argos, file);
			else console.error(`File or directory: ${file} doesn't exist`);
		});
	} else {
		argos.e = [files[0]];
		files.slice(1).forEach(file => {
			if (fh.fileExists(file)) parseCommands(argos, file);
			else console.error(`File or directory: ${file} doesn't exist`);
		});
	}
}

function parseCommands(argos: Arguments, file: string) {
	const args: string[] = [];
	let lines: string[];
	lines = fh.readFile(file);
	let print = true;
	let istate = false;
	let save = false;
	if (argos.n) print = false;
	if (argos.i !== undefined) {
		if (argos.i !== '') {
			if (!rh.validateExtension(argos.i)) {
				console.error('Wrong extension format');
				process.exit();
			}
		}
		print = false;
		istate = true;
		save = true;
	}
	if (argos.e) {
		args.push(...argos.e.map(String));
	}
	if (argos.f) {
		argos.f.forEach(scriptfile => {
			args.push(...getScriptCommands(String(scriptfile), args));
		});
	}
	args.forEach(arg => {
		if (!rh.validateCommands(arg)) {
			console.error('Error: Unknown command entered');
			process.exit();
		}
	});
	if (save === true && argos.i !== '') {
		let backUp = file + '.' + yargs.argv.i;
		fs.copyFileSync(file, backUp);
	}
	let newLine: string;
	lines.forEach(line => {
		newLine = line;
		args.forEach(arg => {
			newLine = Substitute(newLine, arg, file, istate);
		});
		if (print) console.log(newLine);
		if (save) fh.saveLine(newLine, file);
	});
	// Delete the old file and rename the temporary file
	if (save === true) {
		fh.unlinkFile(file);
	}
}
