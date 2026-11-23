import {mkdir,writeFile} from 'node:fs/promises';
import {Chess} from 'chess.js';
const base='https://raw.githubusercontent.com/lichess-org/chess-openings/master/';
const files=['a.tsv','b.tsv','c.tsv','d.tsv','e.tsv'];
const records=new Map();
for(const file of files){
 const response=await fetch(base+file);
 if(!response.ok)throw Error('Failed to download '+file+': HTTP '+response.status);
 const lines=(await response.text()).trim().split(/\r?\n/);
 const header=lines.shift().split('\t');
 const ecoIdx=header.indexOf('eco'),nameIdx=header.indexOf('name'),uciIdx=header.indexOf('uci'),epdIdx=header.indexOf('epd');
 if([ecoIdx,nameIdx,uciIdx,epdIdx].some(i=>i<0))throw Error('Unexpected TSV columns in '+file+': '+header);
 for(const line of lines){
  const parts=line.split('\t'),uci=parts[uciIdx],epd=parts[epdIdx];
  if(!uci||!epd)continue;
  const moves=uci.trim().split(/\s+/);
  const key=epd.trim().split(/\s+/).slice(0,4).join(' ');
  const item={eco:parts[ecoIdx],name:parts[nameIdx],ply:moves.length};
  const existing=records.get(key);
  if(!existing||item.ply>existing.ply)records.set(key,item);
 }
}
if(records.size<1000)throw Error('Opening database unexpectedly small: '+records.size);
await mkdir('public',{recursive:true});
await writeFile('public/openings.json',JSON.stringify(Object.fromEntries(records)));
console.log('Generated',records.size,'opening positions from Lichess ECO dataset');
