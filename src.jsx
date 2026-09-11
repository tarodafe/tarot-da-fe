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
'O Louco':'novos começos, liberdade e coragem para experimentar',
'O Mago':'iniciativa, habilidade e poder de transformar intenção em ação',
'A Sacerdotisa':'intuição, silêncio e algo que ainda precisa ser percebido',
'A Imperatriz':'crescimento, afeto, criatividade e abundância',
'O Imperador':'estrutura, limites, estabilidade e responsabilidade',
'O Hierofante':'valores, aprendizado, tradição e orientação',
'Os Enamorados':'escolhas, vínculos e alinhamento entre coração e valores',
'O Carro':'movimento, determinação e domínio da própria direção',
'A Justiça':'equilíbrio, verdade, consequências e decisões conscientes',
'O Eremita':'introspecção, prudência e busca de respostas internas',
'A Roda da Fortuna':'mudanças de ciclo, movimento e acontecimentos que alteram o cenário',
'A Força':'coragem serena, autocontrole e firmeza emocional',
'O Enforcado':'pausa, nova perspectiva e necessidade de soltar o controle',
'A Morte':'fim de ciclo, desapego e transformação necessária',
'A Temperança':'equilíbrio, cura, conciliação e tempo de maturação',
'O Diabo':'apegos, desejos intensos, padrões repetitivos e necessidade de consciência',
'A Torre':'ruptura, verdade repentina e reconstrução',
'A Estrela':'esperança, cura e confiança no caminho',
'A Lua':'incertezas, emoções profundas e necessidade de observar além das aparências',
'O Sol':'clareza, vitalidade, alegria e tendência favorável',
'O Julgamento':'despertar, avaliação, chamado e decisão importante',
'O Mundo':'conclusão, realização e passagem para uma nova etapa'
};

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
  return `${meaning(c.name)}${c.rev?', porém essa energia pode aparecer bloqueada, atrasada, excessiva ou mais voltada para o mundo interior':''}`;
}

function detectArea(q){
  const p=(q||'').toLowerCase();
  if(/emprego|trabalho|vaga|carreira|profissional|empresa|entrevista|negócio|negocio|vender|vendas|cliente/.test(p)) return 'trabalho';
  if(/dinheiro|financeiro|finanças|divida|dívida|prosperidade|renda|lucro|ganhar dinheiro/.test(p)) return 'dinheiro';
  if(/amor|relacionamento|namoro|marido|esposa|ex|voltar|sentimento|gosta de mim|ficar junto|reconcilia/.test(p)) return 'amor';
  if(/família|familia|filho|filha|mãe|mae|pai|irmão|irmao/.test(p)) return 'familia';
  return 'geral';
}

function baseScore(c,area){
  const positivos=['O Sol','A Estrela','O Mundo','O Mago','A Imperatriz','O Carro','A Força','A Temperança','O Julgamento','Ás de Ouros','Nove de Ouros','Dez de Ouros','Seis de Paus','Três de Copas'];
  const desafiadores=['A Torre','O Diabo','A Lua','O Enforcado','A Morte','Sete de Espadas','Cinco de Espadas','Dez de Espadas','Cinco de Ouros'];
  let v=positivos.includes(c.name)?2:desafiadores.includes(c.name)?-2:0;
  if(area==='trabalho' && (c.name.includes('Ouros')||c.name.includes('Paus'))) v+=1;
  if(area==='dinheiro' && c.name.includes('Ouros')) v+=1;
  if(area==='amor' && c.name.includes('Copas')) v+=1;
  if(c.rev) v-=1;
  return v;
}

function tendencyLabel(score){
  if(score>=4) return 'Tendência favorável';
  if(score>=1) return 'Pode acontecer, mas depende de movimento e escolhas';
  if(score<=-4) return 'Há obstáculos importantes no momento';
  if(score<=-1) return 'Ainda não / há bloqueios antes do avanço';
  return 'Cenário aberto';
}

function areaOpening(area,score){
  if(area==='trabalho'){
    if(score>=4) return 'As cartas mostram uma tendência positiva para avanço profissional, oportunidade ou crescimento.';
    if(score>=1) return 'Existe possibilidade de avanço profissional, mas o resultado depende de iniciativa, estratégia e timing.';
    if(score<=-4) return 'O caminho profissional mostra bloqueios fortes, atrasos ou necessidade de mudar a estratégia antes de avançar.';
    if(score<=-1) return 'Há alguma trava ou indefinição profissional; antes do avanço, algo precisa ser reorganizado.';
    return 'O cenário profissional está aberto e ainda pode mudar bastante conforme suas próximas decisões.';
  }
  if(area==='dinheiro'){
    if(score>=4) return 'A leitura é favorável para crescimento financeiro, desde que haja constância e decisões práticas.';
    if(score>=1) return 'Há potencial de ganho, mas ele tende a vir com planejamento, continuidade e aproveitamento de oportunidades reais.';
    if(score<=-4) return 'O momento pede cautela financeira; a leitura mostra riscos, perdas de energia ou necessidade de reestruturação.';
    if(score<=-1) return 'O dinheiro pode demorar mais a fluir; é importante rever estratégia, preço, gastos ou forma de atuação.';
    return 'A situação financeira ainda está em formação e depende muito de organização e escolhas concretas.';
  }
  if(area==='amor'){
    if(score>=4) return 'A energia afetiva é favorável para aproximação, entendimento ou evolução do vínculo.';
    if(score>=1) return 'Existe potencial afetivo, mas a relação precisa de clareza, reciprocidade e atitude.';
    if(score<=-4) return 'Há bloqueios emocionais importantes, desgaste ou padrões que dificultam a evolução neste momento.';
    if(score<=-1) return 'A situação afetiva ainda não está madura para avançar com segurança; é preciso observar melhor sentimentos e limites.';
    return 'O cenário afetivo permanece aberto e depende de escolhas e conversas sinceras.';
  }
  if(score>=4) return 'A leitura apresenta uma tendência construtiva e possibilidade clara de avanço.';
  if(score>=1) return 'Há sinais de avanço, mas ainda existem fatores que dependem das suas escolhas.';
  if(score<=-4) return 'A leitura mostra obstáculos fortes e necessidade de mudança antes que a situação avance.';
  if(score<=-1) return 'O momento pede cautela, revisão e paciência antes de esperar um resultado favorável.';
  return 'A situação está aberta e ainda pode se desenvolver em mais de uma direção.';
}

function comboNarrative(chosen,area){
  const names=chosen.map(c=>c.name);
  const hasChange=names.some(n=>['A Roda da Fortuna','A Morte','A Torre','O Julgamento'].includes(n));
  const hasPatience=names.some(n=>['A Temperança','O Enforcado','O Eremita'].includes(n));
  const hasAction=names.some(n=>['O Mago','O Carro','A Força'].includes(n));
  const hasChoice=names.includes('Os Enamorados');
  const hasClarity=names.some(n=>['O Sol','A Justiça','A Estrela'].includes(n));
  const hasFear=names.some(n=>['A Lua','O Diabo','Sete de Espadas'].includes(n));

  let parts=[];
  if(hasChange) parts.push('A combinação indica mudança de fase: algo precisa se transformar para que o resultado desejado ganhe espaço.');
  if(hasPatience) parts.push('Ao mesmo tempo, as cartas pedem paciência, maturação e observação do tempo certo, sem forçar o processo.');
  if(hasAction) parts.push('Também existe energia de ação: quando surgir a oportunidade, será importante agir com iniciativa e firmeza.');
  if(hasChoice) parts.push('Há uma escolha relevante no caminho, e ela pode alterar diretamente o rumo da situação.');
  if(hasClarity) parts.push('Há potencial de clareza e melhora quando as decisões forem tomadas de forma consciente.');
  if(hasFear) parts.push('Medos, dúvidas ou padrões repetitivos podem distorcer a percepção; vale separar receio de fato concreto.');

  if(!parts.length){
    if(area==='trabalho') parts.push('A combinação sugere que o resultado depende mais de estratégia e constância do que de um acontecimento repentino.');
    else if(area==='dinheiro') parts.push('A combinação mostra que o resultado material tende a ser construído aos poucos, com escolhas práticas e consistentes.');
    else if(area==='amor') parts.push('A combinação pede observar reciprocidade, comunicação e coerência entre sentimento e atitude.');
    else parts.push('As cartas se complementam mostrando que o resultado depende de como você responde aos desafios e oportunidades do momento.');
  }
  return parts.join(' ');
}

function finalSummary(area,score,last){
  const label=tendencyLabel(score);
  if(area==='trabalho'){
    return `${label}. ${score>=1?'Vale continuar se movimentando, se preparando e aproveitando oportunidades concretas.':score<=-1?'Antes do avanço, ajuste sua estratégia e não interprete demora como impossibilidade.':'O resultado ainda está aberto; suas próximas ações terão bastante peso.'} Carta-chave final: ${last.name}.`;
  }
  if(area==='dinheiro'){
    return `${label}. ${score>=1?'Há potencial de retorno, mas o crescimento tende a vir com planejamento, constância e boa gestão.':score<=-1?'Evite pressa e reveja estratégia, custos, preços ou forma de vender antes de esperar crescimento.':'O cenário ainda não está definido; organização e consistência serão decisivas.'} Carta-chave final: ${last.name}.`;
  }
  if(area==='amor'){
    return `${label}. ${score>=1?'A evolução é possível se houver reciprocidade e atitude dos dois lados.':score<=-1?'Não force o vínculo; observe limites, comunicação e sinais concretos antes de criar expectativas.':'A situação continua aberta e depende de escolhas e clareza emocional.'} Carta-chave final: ${last.name}.`;
  }
  return `${label}. O Tarot aponta tendências e possibilidades, não uma certeza absoluta. Carta-chave final: ${last.name}.`;
}

function interpretation(draw,q){
  const chosen=draw.filter(c=>c?.name);
  if(!chosen.length) return null;

  const area=detectArea(q);
  const score=chosen.reduce((acc,c)=>acc+baseScore(c,area),0);
  const majors=chosen.filter(c=>major.includes(c.name)).length;
  const inverted=chosen.filter(c=>c.rev).length;

  const opening=q?`Para a pergunta “${q}”, `:'Nesta tiragem, ';
  let pattern=areaOpening(area,score)+' ';
  if(majors>=2) pattern+='A presença de vários Arcanos Maiores mostra que este assunto marca uma fase importante de aprendizado ou mudança. ';
  if(inverted>=2) pattern+='Como há várias cartas invertidas, existem bloqueios, inseguranças ou questões internas interferindo no caminho. ';

  const combination=comboNarrative(chosen,area);

  const sequence=chosen.map((c,i)=>{
    const pos=layouts[draw.length]?.[i]||`Carta ${i+1}`;
    const orientacao=c.rev?'invertida':'em pé';
    return `${pos} — ${c.name} (${orientacao}): ${cardText(c)}.`;
  }).join(' ');

  const last=chosen[chosen.length-1];
  const conclusion=`Como direção final, ${last.name}${last.rev?' invertida':''} reforça ${cardText(last)}.`;
  const summary=finalSummary(area,score,last);

  return {opening,pattern,combination,sequence,conclusion,summary,label:tendencyLabel(score)};
}

function App(){
 const[q,setQ]=useState('');
 const[mode,setMode]=useState('manual');
 const[count,setCount]=useState(3);
 const[draw,setDraw]=useState(Array.from({length:3},()=>({name:'',rev:false})));
 const result=useMemo(()=>interpretation(draw,q),[draw,q]);

 function setLayout(n){setCount(n);setDraw(Array.from({length:n},()=>({name:'',rev:false})));}
 function jogar(){
   let pool=[...cards],out=[];
   for(let i=0;i<count;i++){
     let x=Math.floor(Math.random()*pool.length);
     out.push({name:pool.splice(x,1)[0],rev:Math.random()<.28})
   }
   setDraw(out)
 }
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
        <div className="orientation">
          <button className={!c.rev?'choice selected':''} onClick={()=>updateCard(i,'rev',false)}>Em pé</button>
          <button className={c.rev?'choice selected':''} onClick={()=>updateCard(i,'rev',true)}>Invertida</button>
        </div>
      </>:<><h3>{c.name||'Carta ainda não tirada'}</h3>{c.name&&<><em>{c.rev?'Invertida':'Em pé'}</em><p>{cardText(c)}.</p></>}</>}
    </article>)}
   </div>

   {complete&&result&&<div className="reading">
    <h2><Sparkles size={20}/> Interpretação da tiragem</h2>
    <p><strong>{result.label}</strong></p>
    <p>{result.opening}{result.pattern}</p>
    <p>{result.combination}</p>
    <p>{result.sequence}</p>
    <p>{result.conclusion}</p>

    <div className="finalSummary">
      <h3>Resumo final</h3>
      <p>{result.summary}</p>
    </div>
   </div>}

   {!complete&&mode==='manual'&&<p className="hint">Selecione todas as cartas para o app gerar a interpretação.</p>}

   <div className="actions">
     {mode==='auto'&&draw.some(c=>c.name)&&<button className="again" onClick={jogar}><RotateCcw size={17}/> Jogar novamente</button>}
     <button className="again" onClick={limpar}>Limpar leitura</button>
   </div>
  </section>
  <footer>Tarot da Fê • leitura simbólica e intuitiva</footer>
 </main>
}

createRoot(document.getElementById('root')).render(<App/>);
