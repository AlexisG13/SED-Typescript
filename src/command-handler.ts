import * as fh from './file-handler';

//Function for trying a command on a line
export function Substitute(line: string, command: string): string {
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
export function getScriptCommands(file: string, args: string[]) {
    let instructions;
    const newArray: string[] = [];
    fh.fileExists(file);
    instructions = fh.readScriptFile(file);
    instructions.map(instruction => {
        newArray.push(instruction);
    });
    return newArray;
}