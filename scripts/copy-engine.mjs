import {mkdir,copyFile} from 'node:fs/promises';
import {join} from 'node:path';
const root=process.cwd();
const source=join(root,'node_modules','stockfish','bin');
const dest=join(root,'dist','engine');
await mkdir(dest,{recursive:true});
for(const file of ['stockfish-19-lite-single.js','stockfish-19-lite-single.wasm']){
 await copyFile(join(source,file),join(dest,file));
 console.log('Copied engine asset:',file);
}
