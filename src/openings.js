import {useEffect,useMemo,useState} from 'react';
import {Chess} from 'chess.js';
const START=new Chess().fen();
let cache=null;
let pending=null;
function positionKey(fen){return fen.split(' ').slice(0,4).join(' ')}
export function useOpeningDatabase(){
 const [db,setDb]=useState(cache),[error,setError]=useState('');
 useEffect(()=>{let active=true;if(cache){setDb(cache);return}
 if(!pending)pending=fetch(import.meta.env.BASE_URL+'openings.json').then(r=>{if(!r.ok)throw Error('Opening database unavailable');return r.json()}).then(data=>{cache=data;return data}).catch(e=>{pending=null;throw e});
 pending.then(data=>{if(active)setDb(data)}).catch(e=>{if(active)setError(e.message)});
 return ()=>{active=false}
 },[]);
 return {db,error,count:db?Object.keys(db).length:0};
}
export function recognizeOpening(history,db,startFen=START){
 if(!db||!history.length||startFen!==START)return null;
 const game=new Chess(startFen);
 let latest=null;
 for(let i=0;i<history.length;i++){
  const u=history[i];
  try{game.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||'q'})}catch{break}
  const record=db[positionKey(game.fen())];
  if(record)latest={...record,matchedAt:i+1,transposition:i+1!==record.ply};
 }
 return latest;
}
