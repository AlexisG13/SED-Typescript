# <center> SED Command using Node.js & TypeScript! ⌨ </center>

A simple imitation of the SED substitute command using Node.js and Typescript.


### Prerequisites

- Have npm (or yarn) installed on your system.

### Installing

- Install the neccesary dependencies listed on the package.json file.  Using the command:

```
npm install
```

### Using the substitute command

First, compile the SED.ts file, you can use ts-node to make this easier. Following this, you should include all the options 
and commands you wish to try on a given file, multiple files can be entered, though all of them must be at the end.

```
ts-node SED.ts <command> <file> 
```
- A substitute command is formed by the command (only the substitute command is available),a word to replace,the word that is going to replace the former word, and lastly and optional flag,every part is followed by a "/", except the flag part.

- A simple substitute command would be the following one: 
```
ts-node SED.ts 's/world/mundo/' prueba.txt
```

### Including a flag: 


```
ts-node SED.ts 's/world/mundo/g' prueba.txt
```

Currently the "g" and "p" flags are available, you can also use both if you wish by including either "pg" or "gp".


### Including an option
The following options are available:
  - -n : Don't print anything on the output. 
  - -i <extension> : Write the output into the file, erasing it's old content and creating a backup file with the given extension. 
    If a blank extension is given : '',the original file will be modified without any backup file. It doesn't print on the output too.
  - -f <scriptfile> : Read multiple substitute commands written on a file, each of them separated by a line break. 
  - -e <command> : Works like the normal substitute command, though you can include multiple commands by including various -e options.

## Built With

- Node.js
- Typescript
- Yargs 
- Prettier and Eslint where used, both for linting a formatting the code. 

## Authors

- Alexis Gómez
