import * as fs from "fs";

export function saveLine(line: string, file: string) {
  fs.appendFileSync(file + "-copy", line + "\n");

}

export function fileExists(file: string){
  try {
    if (fs.existsSync(file)) {
      return;
    }
    else{
      console.error(new Error("Wrong file name or file doesn't exist"));
      process.exit();
    }

  } catch (err) {
    console.error(err);
    process.exit();
    return;
  }
}

export function readFile(file: string): string[] {
  let lines:string[] = [];
  try {
    let data = fs.readFileSync(file);
    lines = data.toString().split("\n");
    return lines;
  } catch (e) {
    console.log("Error when reading the file!");
    process.exit();
    return lines;
  }
}

export function unlinkFile(file: string) {
  fs.unlink(file, function(err) {
    if (err) console.log("Error deleting the old file :(");
    return;
  });
  fs.rename(file + "-copy", file, function(err) {
    if (err) console.log("Error renaming the temporary file :(");
    return;
  });
}

export function readScriptFile(file:string):string[]{
  let instructions:string[];
  let data = fs.readFileSync(file);
  instructions = data.toString().split("\n");
  return instructions;
}