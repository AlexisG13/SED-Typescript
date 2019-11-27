const commandRegex = /^s\/[^\/]+\/[^\/]+\/(g?p?|p?g?)?$/;
const fileRegex = /^[^\/]+\.[^\/]+/;

export function validCommand(command: string) {
  if (commandRegex.test(command)) return;
  else {
   console.error(new Error("Unknown command entered!"));
    process.exit();
  }
}

export function validFile(file: string): boolean {
  if (fileRegex.test(file)) return true;
  else return false;
}

