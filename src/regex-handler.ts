const commandRegex = /^s\/[^\/]+\/[^\/]+\/(p|g)?$/;
const fileRegex = /^[^\/]+\.[^\/]+/;
const extensionRegex = /^[^\.\/]/;

export function validExtension(extension:string):boolean{
  if(extensionRegex.test(extension)) return true;
  else{
    return false;
  }
}

export function validCommand(command: string):boolean{
  if (commandRegex.test(command)) return true;
  else {
    return false;
  }
}

export function validFile(file: string): boolean {
  if (fileRegex.test(file)) return true;
  else return false;
}

