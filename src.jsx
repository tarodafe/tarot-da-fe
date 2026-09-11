import React,{useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Sparkles,Shuffle,RotateCcw,Hand,CheckCircle2}from'lucide-react';
import'./style.css';

const major=['O Louco','O Mago','A Sacerdotisa','A Imperatriz','O Imperador','O Hierofante','Os Enamorados','O Carro','A Justiça','O Eremita','A Roda da Fortuna','A Força','O Enforcado','A Morte','A Temperança','O Diabo','A Torre','A Estrela','A Lua','O Sol','O Julgamento','O Mundo'];
const minor=[];
for(const n of ['Ás','Dois','Três','Quatro','Cinco','Seis','Sete','Oito','Nove','Dez','Pajem','Cavaleiro','Rainha','Rei']){
  for(const s of ['Paus','Copas','Espadas','Ouros']) minor.push(`${n} de ${s}`)
}
const cards=[...major,...minor];

const meanings={
'O Louco':'novos começos, liberdade e coragem para experimentar','O Mago':'iniciativa, habilidade e poder de transformar intenção em ação','A Sacerdotisa':'intuição, silêncio e algo que ainda precisa ser percebido','A Imperatriz':'crescimento, afeto, criatividade e abundância','O Imperador':'estrutura, limites, estabilidade e responsabilidade','O Hierofante':'valores, aprendizado, tradição e orientação','Os Enamorados':'escolhas, vínculos e alinhamento entre coração e valores','O Carro':'movimento, determinação e domínio da própria direção','A Justiça':'equilíbrio, verdade, consequências e decisões conscientes','O Eremita':'introspecção, prudência e busca de respostas internas','A Roda da Fortuna':'mudanças de ciclo, movimento e acontecimentos que alteram o cenário','A Força':'coragem serena, autocontrole e firmeza emocional','O Enforcado':'pausa, nova perspectiva e necessidade de soltar o controle','A Morte':'fim de ciclo, desapego e transformação necessária','A Temperança':'equilíbrio, cura, conciliação e tempo de maturação','O Diabo':'apegos, desejos intensos, padrões repetitivos e necessidade de consciência','A Torre':'ruptura, verdade repentina e reconstrução','A Estrela':'esperança, cura e confiança no caminho','A Lua':'incertezas, emoções profundas e necessidade de observar além das aparências','O Sol':'clareza, vitalidade, alegria e tendência favorável','O Julgamento':'despertar, avaliação, chamado e decisão importante','O Mundo':'conclusão, realização e passagem para uma nova etapa'};

function meaning(c){
 if(meanings[c]) return meanings[c];
 if(c.includes('Copas')) return'emoções, relações, afeto e intuição';
 if(c.includes('Paus')) return'ação, desejo, criatividade e movimento';
 if(c.includes('Espadas')) return'pensamentos, decisões, conflitos e comunicação';
 return'vida material, trabalho, dinheiro e segurança';
}

const layouts={
  1:['Resposta / Conselho'],
  3:['Raiz / Passado','Presente / Energia','Caminho / Conselho'],
  5:['Situação','Desafio','O que está oculto','Conselho','Tendência']
};

function cardText(c){
  if(!c?.name) return '';
  return `${meaning(c.name)}${c.rev?', porém essa energia pode aparecer bloqueada, atrasada, excessiva ou mais voltada para o mundo interior': ''}`;
}

function interpretation(draw,q){
  const chosen=draw.filter(c=>c?.name);
  if(!chosen.length) return null;
  const majors=chosen.filter(c=>major.includes(c.name)).length;
  const suits=['Copas','Paus','Espadas','Ouros'].map(s=>({s,n:chosen.filter(c=>c.name.includes(s)).length})).sort((a,b)=>b.n-a.n);
  const dominant=suits[0].n>=2?suits[0].s:null;
  const inverted=chosen.filter(c=>c.rev).length;
  let opening=q?`Para a pergunta “${q}”, `:'Nesta leitura, ';
  let pattern='';
  if(majors>=2) pattern+='há uma presença forte de Arcanos Maiores, indicando um tema importante de aprendizado ou mudança de ciclo. ';
  if(dominant==='Copas') pattern+='As Copas reforçam que sentimentos e relações têm grande peso na situação. ';
  if(dominant==='Paus') pattern+='Os Paus mostram forte impulso para agir, criar ou movimentar a situação. ';
  if(dominant==='Espadas') pattern+='As Espadas destacam pensamentos, conversas e decisões que precisam de clareza. ';
  if(dominant==='Ouros') pattern+='Os Ouros colocam foco em estabilidade, trabalho, dinheiro ou segurança prática. ';
  if(inverted>=2) pattern+='As cartas invertidas sugerem que parte da energia está travada ou precisa ser trabalhada internamente antes de avançar. ';
  const sequence=chosen.map((c,i)=>`${layouts[draw.length]?.[i]||`Carta ${i+1}`}: ${c.name}${c.rev?' invertida':''} fala de ${cardText(c)}`).join(' ');
  const last=chosen[chosen.length-1];
  const conclusion=`Como direção final, ${last.name}${last.rev?' invertida':''} pede atenção especial a ${cardText(last)}. A melhor leitura é observar como essa mensagem aparece na sua realidade e usar o Tarot como orientação para escolhas conscientes.`;
  return {opening,pattern,sequence,conclusion};
}

function App(){
 const[q,setQ]=useState('');
 const[mode,setMode]=useState('manual');
 const[count,setCount]=useState(3);
 const[draw,setDraw]=useState(Array.from({length:3},()=>({name:'',rev:false})));
 const result=useMemo(()=>interpretation(draw,q),[draw,q]);

 function setLayout(n){setCount(n);setDraw(Array.from({length:n},()=>({name:'',rev:false})));}
 function jogar(){let pool=[...cards],out=[];for(let i=0;i<count;i++){let x=Math.floor(Math.random()*pool.length);out.push({name:pool.splice(x,1)[0],rev:Math.random()<.28})}setDraw(out)}
 function updateCard(i,key,value){setDraw(d=>d.map((c,idx)=>idx===i?{...c,[key]:value}:c))}
 function limpar(){setQ('');setDraw(Array.from({length:count},()=>({name:'',rev:false})));}
 const complete=draw.every(c=>c.name);

 return <main>
  <section className="hero"><div className="moon">☾</div><h1>Tarot da Fê</h1><p>Faça sua tiragem e deixe o app ajudar na interpretação.</p></section>
  <section className="panel">
   <div className="modeTabs">
    <button className={mode==='manual'?'tab active':'tab'} onClick={()=>setMode('manual')}><Hand size={17}/> Eu faço a tiragem</button>
    <button className={mode==='auto'?'tab active':'tab'} onClick={()=>setMode('auto')}><Shuffle size={17}/> O app tira as cartas</button>
   </div>
   <label>Sua pergunta</label>
   <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Ex.: O que preciso entender sobre meu relacionamento neste momento?"/>
   <div className="layoutRow"><span>Quantidade de cartas:</span>{[1,3,5].map(n=><button key={n} className={count===n?'mini activeMini':'mini'} onClick={()=>setLayout(n)}>{n}</button>)}</div>

   {mode==='auto' && <button className="primary" onClick={jogar}><Shuffle size={18}/> Jogar {count} {count===1?'carta':'cartas'}</button>}

   {mode==='manual' && <div className="manualIntro"><CheckCircle2 size={19}/><span>Faça a tiragem com seu baralho físico e informe abaixo exatamente quais cartas saíram.</span></div>}

   <div className="cards">
    {draw.map((c,i)=><article className="card" key={i}>
      <div className="symbol">✦</div>
      <small>{layouts[count][i]}</small>
      {mode==='manual'?<>
        <select value={c.name} onChange={e=>updateCard(i,'name',e.target.value)}>
          <option value="">Selecione a carta...</option>
          <optgroup label="Arcanos Maiores">{major.map(x=><option key={x}>{x}</option>)}</optgroup>
          <optgroup label="Arcanos Menores">{minor.map(x=><option key={x}>{x}</option>)}</optgroup>
        </select>
        <div className="orientation"><button className={!c.rev?'choice selected':''} onClick={()=>updateCard(i,'rev',false)}>Em pé</button><button className={c.rev?'choice selected':''} onClick={()=>updateCard(i,'rev',true)}>Invertida</button></div>
      </>:<><h3>{c.name||'Carta ainda não tirada'}</h3>{c.name&&<><em>{c.rev?'Invertida':'Em pé'}</em><p>{cardText(c)}.</p></>}</>}
    </article>)}
   </div>

   {complete&&result&&<div className="reading">
    <h2><Sparkles size={20}/> Interpretação da tiragem</h2>
    <p>{result.opening}{result.pattern}</p>
    <p>{result.sequence}</p>
    <p>{result.conclusion}</p>
   </div>}
   {!complete&&mode==='manual'&&<p className="hint">Selecione todas as cartas para o app gerar a interpretação.</p>}
   <div className="actions">{mode==='auto'&&draw.some(c=>c.name)&&<button className="again" onClick={jogar}><RotateCcw size={17}/> Jogar novamente</button>}<button className="again" onClick={limpar}>Limpar leitura</button></div>
  </section>
  <footer>Tarot da Fê • leitura simbólica e intuitiva</footer>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
