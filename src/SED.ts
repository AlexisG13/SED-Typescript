// #!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as fh from './file-handler';
import { validCommand, validFile } from './regex-handler';
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
	const files: string[] = [];
	if (argos._.length > 1) {
		let indexSlice = 0;
		if (validCommand(String(argos._[0]))) indexSlice = 1;
		argos._.slice(indexSlice).forEach(file => {
			files.push(String(file));
		});
	} else if (argos._.length === 1) {
		files.push(String(argos._[0]));
	} else {
		console.error('No files were entered');
		process.exit();
	}
	files.forEach(file => {
		parseCommands(argos, file);
	});

	function parseCommands(argos: Arguments, file: string) {
		const args: string[] = [];
		let lines: string[];
		lines = fh.readFile(file);
		let print = true;
		let save = false;
		if (argos.n) print = false;
		if (argos.i !== undefined) {
			print = false;
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
		if (save === true && yargs.argv.i !== '') {
			let backUp = file + '.' + yargs.argv.i;
			fs.copyFileSync(file, backUp);
		}
		let newLine: string = lines[0];
		lines.forEach(line => {
			args.forEach(arg => {
				newLine = Substitute(line, arg);
			});
			if (print) console.log(newLine);
			if (save) fh.saveLine(newLine, file);
		});
		// Delete the old file and rename the temporary file
		if (save === true) {
			fh.unlinkFile(file);
		}
	}
}
