// #!/usr/bin/env node
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as fh from './file-handler';
import * as rh from './regex-handler';
import { getScriptCommands, Substitute } from './command-handler';

//Interface used for checking the structure of the yargs argv
interface Arguments {
	e: (string | number)[] | undefined;
	f: (string | number)[] | undefined;
	[x: string]: unknown;
	_: (string | number)[];
	i: string | undefined;
	n: boolean;
}

//Defining our argv object with the respective keys and options
const argv = yargs.options({
	e: { type: 'array', nargs: 1 },
	f: { type: 'array', nargs: 1 },
	i: { type: 'string', nargs: 1 },
	n: { type: 'boolean', default: false, nargs: 0 },
	_: { type: 'array' }
}).argv;

//Init
parseFiles(argv);

/*Function used for determining wether a single command was entered or not 
and getting all the files to process*/
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

//Function for getting all the options entered on a command
function parseCommands(argos: Arguments, file: string) {
	//Flags and variables declarations
	const args: string[] = [];
	let print = true;
	let istate = false;
	let save = false;
	if (argos.n) print = false;
	// Validate if the -i option was entered and if an extension was given.
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
	// Get all the commands from each -e option
	if (argos.e) {
		args.push(...argos.e.map(String));
	}
	//Get all the commands from each script file entered
	if (argos.f) {
		argos.f.forEach(scriptfile => {
			args.push(...getScriptCommands(String(scriptfile), args));
		});
	}
	//Assure every command entered is correct
	args.forEach(arg => {
		if (!rh.validateCommands(arg)) {
			console.error('Error: Unknown command entered');
			process.exit();
		}
	});
	// Create backup file if neccesary
	if (save === true && argos.i !== '') {
		let backUp = file + '.' + yargs.argv.i;
		fs.copyFileSync(file, backUp);
	}
	let newLine: string;
	//Getting all the lines on the file
	const lines = fh.readFile(file);
	//Use the substitute command on each line for each command entered
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
