import React,{useEffect,useMemo,useState} from 'react';
import {Chess} from 'chess.js';
const ENGINE='stockfish-19-lite-single.js';
function pvToSan(fen,pv){try{const c=new Chess(fen);return pv.slice(0,10).map(u=>{const m=c.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||'q'});return m?.san||u}).join(' ')}catch{return pv.join(' ')}}
export default function StockfishLab({fen,enabled,depth,setEnabled,setDepth}){
 const [state,setState]=useState('off'),[evaluation,setEvaluation]=useState(null),[line,setLine]=useState(''),[currentDepth,setCurrentDepth]=useState(0);
 const valid=useMemo(()=>{try{new Chess(fen);return true}catch{return false}},[fen]);
 useEffect(()=>{setEvaluation(null);setLine('');setCurrentDepth(0);if(!enabled){setState('off');return}if(!valid){setState('invalid');return}
 let disposed=false,worker=null,timeout=null;
 setState('loading');
 const boot=()=>{try{worker=new Worker(import.meta.env.BASE_URL+'engine/'+ENGINE);worker.onerror=()=>{if(!disposed)setState('error')};worker.onmessage=e=>{if(disposed)return;const lines=String(e.data).split(/\r?\n/);for(const text of lines){if(text.includes('uciok')){worker.postMessage('isready')}if(text.includes('readyok')){setState('analyzing');worker.postMessage('position fen '+fen);worker.postMessage('go depth '+depth)}if(!text.startsWith('info ')||!text.includes(' score ')||!text.includes(' pv '))continue;const depthMatch=text.match(/\bdepth (\d+)/),score=text.match(/\bscore (cp|mate) (-?\d+)/),pv=text.match(/\bpv (.+)$/);if(!score||!pv)continue;const turn=fen.split(' ')[1];const sign=turn==='w'?1:-1;setEvaluation({kind:score[1],value:Number(score[2])*sign});setCurrentDepth(Number(depthMatch?.[1]||0));setLine(pvToSan(fen,pv[1].trim().split(/\s+/)))}};worker.postMessage('uci')}catch{setState('error')}};
 timeout=setTimeout(boot,200);
 return ()=>{disposed=true;clearTimeout(timeout);if(worker){try{worker.postMessage('quit')}catch{}worker.terminate()}}
 },[fen,enabled,depth,valid]);
 const score=evaluation?(evaluation.kind==='mate'?(evaluation.value>0?'M'+evaluation.value:'-M'+Math.abs(evaluation.value)):(evaluation.value>=0?'+':'')+(evaluation.value/100).toFixed(2)):'—';
 return <div className="panel"><div className="eyebrow">STOCKFISH · CHESS LAB ONLY</div><h2 className="study-menu-title">Live analysis</h2><label className="study-engine-toggle"><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/> Enable Stockfish</label><label className="study-label">Search depth: {depth}<input type="range" min="8" max="20" value={depth} onChange={e=>setDepth(Number(e.target.value))}/></label><div className="study-eval"><strong>{score}</strong><span>{state==='off'?'Engine off':state==='loading'?'Loading engine…':state==='analyzing'?'Analyzing · depth '+currentDepth:state==='invalid'?'Invalid editor position':'Engine failed to load'}</span></div><div className="study-engine-line">{line||'Best line will appear here as the engine searches.'}</div><p className="study-hint">Evaluation is from White’s perspective. Analysis updates as moves change. The lightweight single-threaded engine runs locally in your browser, not on a server.</p></div>
}
