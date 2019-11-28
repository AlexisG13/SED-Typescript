const commandRegex = /^s\/[^\/]+\/[^\/]+\/(p|g|pg|gp)?$/;
const extensionRegex = /[^\.\/\;]/;

//Validate a command
export function validateCommands(command: string): boolean {
	if (!commandRegex.test(command)) return false;
	return true;
}

//Validate a extension 
export function validateExtension(extension: string): boolean {
	if (extensionRegex.test(extension)) return true;
	return false;
}
