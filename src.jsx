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
  if(/emprego|trabalho|vaga|carreira|profissional|empresa|entrevista|serviço|servico/.test(p)) return 'Trabalho / Emprego';
  if(/dinheiro|financeiro|finanças|divida|dívida|prosperidade|renda|lucro|ganhar dinheiro|vender|vendas|cliente|negócio|negocio/.test(p)) return 'Dinheiro / Negócios';
  if(/amor|relacionamento|namoro|marido|esposa|ex|voltar|sentimento|gosta de mim|ficar junto|reconcilia/.test(p)) return 'Amor / Relacionamento';
  if(/família|familia|filho|filha|mãe|mae|pai|irmão|irmao/.test(p)) return 'Família';
  return 'Geral';
}

function scoreCard(c,area){
  const positivos=['O Sol','A Estrela','O Mundo','O Mago','A Imperatriz','O Carro','A Força','A Temperança','O Julgamento','Ás de Ouros','Nove de Ouros','Dez de Ouros','Seis de Paus'];
  const desafiadores=['A Torre','O Diabo','A Lua','O Enforcado','A Morte','Sete de Espadas','Cinco de Espadas','Dez de Espadas','Cinco de Ouros'];
  let v=positivos.includes(c.name)?2:desafiadores.includes(c.name)?-2:0;
  if(area==='Trabalho / Emprego' && (c.name.includes('Ouros')||c.name.includes('Paus'))) v+=1;
  if(area==='Dinheiro / Negócios' && c.name.includes('Ouros')) v+=1;
  if(area==='Amor / Relacionamento' && c.name.includes('Copas')) v+=1;
  if(c.rev) v-=1;
  return v;
}

function tendency(score){
  if(score>=4) return 'Tendência favorável';
  if(score>=1) return 'Pode acontecer, mas depende de movimento e escolhas';
  if(score<=-4) return 'Há obstáculos importantes no momento';
  if(score<=-1) return 'Ainda não / há bloqueios antes do avanço';
  return 'Cenário aberto';
}

function directAnswer(area,score){
  if(area==='Trabalho / Emprego'){
    if(score>=4) return 'Sim, a tendência é favorável para surgir ou se concretizar uma oportunidade profissional.';
    if(score>=1) return 'Pode acontecer, mas depende de iniciativa, procura ativa e abertura para oportunidades diferentes.';
    if(score<=-4) return 'Neste momento, a tendência não é imediata; existem obstáculos ou atrasos importantes antes da concretização.';
    if(score<=-1) return 'Ainda não aparece como algo próximo; antes, será preciso ajustar estratégia, direção ou expectativas.';
    return 'A possibilidade existe, mas o cenário ainda está aberto e suas próximas ações terão bastante peso.';
  }
  if(area==='Dinheiro / Negócios'){
    if(score>=4) return 'Sim, há boa tendência de retorno financeiro, especialmente com constância e organização.';
    if(score>=1) return 'Há potencial de ganho, mas ele tende a crescer aos poucos e depende de estratégia e continuidade.';
    if(score<=-4) return 'Neste momento, há riscos ou bloqueios que pedem cautela antes de esperar retorno financeiro.';
    if(score<=-1) return 'Ainda não aparece um fluxo financeiro forte; vale revisar preço, estratégia, divulgação ou gastos.';
    return 'O potencial existe, mas o resultado ainda depende bastante de organização e ação prática.';
  }
  if(area==='Amor / Relacionamento'){
    if(score>=4) return 'Sim, a tendência afetiva é favorável, desde que exista reciprocidade.';
    if(score>=1) return 'Pode acontecer, mas depende de atitude, clareza e participação dos dois lados.';
    if(score<=-4) return 'Neste momento, há bloqueios fortes ou desgaste que dificultam a evolução da relação.';
    if(score<=-1) return 'Ainda não é um cenário firme; é melhor observar atitudes concretas antes de criar expectativas.';
    return 'A situação continua aberta e depende de escolhas, conversas e reciprocidade.';
  }
  if(score>=4) return 'A tendência geral é favorável.';
  if(score>=1) return 'Pode acontecer, mas depende de movimento e escolhas.';
  if(score<=-4) return 'Há obstáculos importantes antes do avanço.';
  if(score<=-1) return 'Ainda não; há bloqueios que precisam ser trabalhados primeiro.';
  return 'O cenário está aberto e ainda pode mudar.';
}

function comboNarrative(chosen){
  const names=chosen.map(c=>c.name);
  const lines=[];
  if(names.some(n=>['A Roda da Fortuna','A Morte','A Torre','O Julgamento'].includes(n)))
    lines.push('A combinação mostra mudança de fase: algo precisa se transformar para abrir espaço para o próximo passo.');
  if(names.some(n=>['A Temperança','O Enforcado','O Eremita'].includes(n)))
    lines.push('Há também uma mensagem de tempo e maturação; nem tudo deve ser forçado agora.');
  if(names.some(n=>['O Mago','O Carro','A Força','Pajem de Paus','Cavaleiro de Paus'].includes(n)))
    lines.push('Ao mesmo tempo, existe energia de ação e iniciativa, indicando que sua postura pode acelerar o movimento.');
  if(names.includes('Os Enamorados'))
    lines.push('Uma escolha importante aparece no caminho e pode mudar diretamente o resultado.');
  if(names.some(n=>['O Sol','A Estrela','A Justiça'].includes(n)))
    lines.push('Há potencial de clareza e melhora quando as decisões forem tomadas com consciência.');
  if(names.some(n=>['A Lua','O Diabo','Sete de Espadas'].includes(n)))
    lines.push('Medos, dúvidas ou padrões repetitivos podem interferir; vale separar receio de fato concreto.');
  return lines.length?lines.join(' '):'As cartas se complementam mostrando que o resultado depende da forma como você responde aos desafios e oportunidades deste momento.';
}

function interpretation(draw,q){
  const chosen=draw.filter(c=>c?.name);
  if(!chosen.length) return null;

  const area=detectArea(q);
  const score=chosen.reduce((a,c)=>a+scoreCard(c,area),0);
  const label=tendency(score);
  const direct=directAnswer(area,score);
  const majors=chosen.filter(c=>major.includes(c.name)).length;
  const inverted=chosen.filter(c=>c.rev).length;

  const opening=q?`Para a pergunta “${q}”, `:'Nesta tiragem, ';
  let context=direct+' ';
  if(majors>=2) context+='A presença de vários Arcanos Maiores mostra que o assunto representa uma fase importante de aprendizado ou mudança. ';
  if(inverted>=2) context+='As cartas invertidas indicam bloqueios, inseguranças ou questões internas interferindo no caminho. ';

  const sequence=chosen.map((c,i)=>{
    const pos=layouts[draw.length]?.[i]||`Carta ${i+1}`;
    return `${pos} — ${c.name} (${c.rev?'invertida':'em pé'}): ${cardText(c)}.`;
  }).join(' ');

  const combination=comboNarrative(chosen);
  const last=chosen[chosen.length-1];

  let summary=direct;
  if(area==='Trabalho / Emprego'){
    summary+=' ';
    summary+=score>=1
      ?'A leitura recomenda continuar procurando, conversando com pessoas, enviando currículos e aceitando considerar caminhos novos.'
      :score<=-1
      ?'Antes da concretização, vale rever estratégia, ampliar possibilidades e não interpretar demora como impossibilidade.'
      :'O resultado ainda não está fechado; iniciativa e constância podem alterar bastante o cenário.';
  }else if(area==='Dinheiro / Negócios'){
    summary+=' ';
    summary+=score>=1
      ?'O crescimento tende a vir mais pela constância, divulgação, organização e repetição de boas ações do que por dinheiro rápido.'
      :score<=-1
      ?'É melhor ajustar estratégia, custos, preços ou divulgação antes de esperar um retorno mais forte.'
      :'O resultado ainda está em construção; planejamento e consistência serão decisivos.';
  }else if(area==='Amor / Relacionamento'){
    summary+=' ';
    summary+=score>=1
      ?'A evolução é possível, mas precisa aparecer também nas atitudes e na reciprocidade.'
      :score<=-1
      ?'Não force o vínculo; observe limites, comunicação e sinais concretos antes de criar expectativas.'
      :'A situação continua aberta e depende de escolhas e clareza emocional.';
  }else{
    summary+=' O Tarot mostra tendências e possibilidades, não uma certeza absoluta.';
  }

  return {
    area,
    label,
    opening,
    context,
    combination,
    sequence,
    conclusion:`Como direção final, ${last.name}${last.rev?' invertida':''} reforça ${cardText(last)}.`,
    summary
  };
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
    <p><strong>Área identificada:</strong> {result.area}</p>
    <p><strong>✨ {result.label}</strong></p>
    <p>{result.opening}{result.context}</p>

    <h3>Leitura em conjunto</h3>
    <p>{result.combination}</p>

    <p>{result.sequence}</p>
    <p>{result.conclusion}</p>

    <div className="finalSummary">
      <h3>⭐ Resumo final</h3>
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
