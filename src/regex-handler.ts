const commandRegex = /^s\/[^\/]+\/[^\/]+\/(p|g|pg|gp)?$/;
const extensionRegex = /[^\.\/\;]/;

export function validateCommands(command:string):boolean{
	if(!commandRegex.test(command)) return false;
	return true;
}

export function validateExtension(extension:string):boolean{
	if(extensionRegex.test(extension)) return true;
	return false; 
}


