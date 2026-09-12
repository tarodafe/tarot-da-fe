import React,{useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Sparkles,Shuffle,RotateCcw,Hand,CheckCircle2}from'lucide-react';
import'./style.css';

const major=['O Louco','O Mago','A Sacerdotisa','A Imperatriz','O Imperador','O Hierofante','Os Enamorados','O Carro','A Justiça','O Eremita','A Roda da Fortuna','A Força','O Enforcado','A Morte','A Temperança','O Diabo','A Torre','A Estrela','A Lua','O Sol','O Julgamento','O Mundo'];

const minor=[];
for(const n of ['Ás','Dois','Três','Quatro','Cinco','Seis','Sete','Oito','Nove','Dez','Pajem','Cavaleiro','Rainha','Rei']){
  for(const s of ['Paus','Copas','Espadas','Ouros']) minor.push(`${n} de ${s}`);
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
  if(c.includes('Copas')) return 'emoções, relações, afeto e intuição';
  if(c.includes('Paus')) return 'ação, desejo, criatividade e movimento';
  if(c.includes('Espadas')) return 'pensamentos, decisões, conflitos e comunicação';
  return 'vida material, trabalho, dinheiro e segurança';
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

  if(/reconcilia|voltar com|volta comigo|ex\b|reatar|reaproxima/.test(p)) return 'Reconciliação';
  if(/emprego|trabalho|vaga|carreira|profissional|empresa|entrevista|serviço|servico/.test(p)) return 'Trabalho / Emprego';
  if(/dinheiro|financeiro|finanças|divida|dívida|prosperidade|renda|lucro|ganhar dinheiro|vender|vendas|cliente|negócio|negocio/.test(p)) return 'Dinheiro / Negócios';
  if(/amor|relacionamento|namoro|marido|esposa|sentimento|gosta de mim|ficar junto/.test(p)) return 'Amor / Relacionamento';
  if(/família|familia|filho|filha|mãe|mae|pai|irmão|irmao/.test(p)) return 'Família';

  return 'Geral';
}

function scoreCard(c,area){
  const positivos=['O Sol','A Estrela','O Mundo','O Mago','A Imperatriz','O Carro','A Força','A Temperança','O Julgamento','Ás de Ouros','Nove de Ouros','Dez de Ouros','Seis de Paus'];
  const desafiadores=['A Torre','O Diabo','A Lua','O Enforcado','A Morte','Sete de Espadas','Cinco de Espadas','Dez de Espadas','Cinco de Ouros'];

  let v=positivos.includes(c.name)?2:desafiadores.includes(c.name)?-2:0;

  if(area==='Trabalho / Emprego' && (c.name.includes('Ouros')||c.name.includes('Paus'))) v+=1;
  if(area==='Dinheiro / Negócios' && c.name.includes('Ouros')) v+=1;
  if((area==='Amor / Relacionamento'||area==='Reconciliação') && c.name.includes('Copas')) v+=1;

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
    if(score>=4) return 'Sim, a tendência é favorável para uma nova oportunidade profissional.';
    if(score>=1) return 'Pode acontecer, mas não parece totalmente imediato.';
    if(score<=-4) return 'Neste momento, a tendência não aponta para uma contratação rápida.';
    if(score<=-1) return 'Ainda não aparece como algo próximo, mas também não é uma negativa definitiva.';
    return 'Existe possibilidade de conseguir um emprego, mas o cenário ainda está aberto.';
  }

  if(area==='Dinheiro / Negócios'){
    if(score>=4) return 'Sim, a tendência financeira é favorável.';
    if(score>=1) return 'Há potencial de ganho, mas ele tende a crescer gradualmente.';
    if(score<=-4) return 'Neste momento, a leitura pede cautela com dinheiro ou negócios.';
    if(score<=-1) return 'Ainda não aparece um fluxo financeiro forte.';
    return 'O potencial financeiro existe, mas o resultado ainda está em construção.';
  }

  if(area==='Amor / Relacionamento'){
    if(score>=4) return 'Sim, a tendência afetiva é favorável, desde que exista reciprocidade.';
    if(score>=1) return 'Pode acontecer, mas depende de atitude, clareza e participação dos dois lados.';
    if(score<=-4) return 'Neste momento, há bloqueios emocionais importantes ou desgaste.';
    if(score<=-1) return 'Ainda não aparece como uma situação firme.';
    return 'A situação afetiva continua aberta.';
  }

  if(area==='Reconciliação'){
    if(score>=4) return 'Há uma tendência favorável para reaproximação ou reconciliação.';
    if(score>=1) return 'A reconciliação é possível, mas depende de diálogo, atitude e mudança de padrões.';
    if(score<=-4) return 'Neste momento, a reconciliação encontra obstáculos fortes e não parece próxima.';
    if(score<=-1) return 'Ainda não. Existe vínculo ou assunto em aberto, mas antes é preciso resolver bloqueios e mágoas.';
    return 'A reconciliação não está descartada, mas o cenário permanece indefinido.';
  }

  if(area==='Família'){
    if(score>=4) return 'A tendência é favorável para entendimento, aproximação ou resolução de questões familiares.';
    if(score>=1) return 'Há possibilidade de melhora, mas será importante ter paciência e diálogo.';
    if(score<=-4) return 'Existem tensões ou bloqueios familiares importantes neste momento.';
    if(score<=-1) return 'Ainda há questões mal resolvidas que precisam ser compreendidas antes de uma melhora mais clara.';
    return 'O cenário familiar está aberto e pode melhorar conforme houver diálogo e limites.';
  }

  if(score>=4) return 'A tendência geral é favorável e existe possibilidade clara de avanço.';
  if(score>=1) return 'Pode acontecer, mas depende de movimento, escolhas e aproveitamento das oportunidades.';
  if(score<=-4) return 'Há obstáculos importantes no momento.';
  if(score<=-1) return 'Ainda não. Existem bloqueios ou questões que precisam ser trabalhadas primeiro.';
  return 'O cenário está aberto e ainda pode mudar conforme suas próximas escolhas.';
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

  return lines.length
    ? lines.join(' ')
    : 'As cartas se complementam mostrando que o resultado depende da forma como você responde aos desafios e oportunidades deste momento.';
}

function adviceFromLast(last,area){
  if(!last?.name) return '';

  const base=meaning(last.name);

  if(area==='Trabalho / Emprego')
    return `O conselho é agir de forma prática no trabalho: ${base}. Use essa energia para decidir seus próximos passos profissionais.`;

  if(area==='Dinheiro / Negócios')
    return `O conselho é aplicar ${base} às suas decisões financeiras e ao modo como você conduz seus projetos ou vendas.`;

  if(area==='Amor / Relacionamento')
    return `O conselho é observar como ${base} aparece no vínculo. Priorize atitudes concretas, limites e reciprocidade.`;

  if(area==='Reconciliação')
    return `O conselho é não forçar a reconciliação. Observe como ${base} pode ajudar a entender se existe espaço real para uma reaproximação saudável.`;

  if(area==='Família')
    return `O conselho é levar ${base} para as relações familiares, preservando diálogo e limites.`;

  return `O conselho principal das cartas é observar ${base} antes de tomar sua próxima decisão.`;
}

function naturalSummary(area,score,chosen){
  const answer=directAnswer(area,score);
  const last=chosen[chosen.length-1];

  let extra='';

  if(area==='Trabalho / Emprego'){
    extra=score>=1
      ?' As cartas favorecem movimento e abertura para oportunidades, mas mostram que a concretização depende também da sua procura, contatos e disposição para considerar caminhos novos.'
      :score<=-1
      ?' Isso não significa impossibilidade: a leitura aponta primeiro uma fase de ajuste, preparação ou mudança de estratégia antes de uma oportunidade mais concreta.'
      :' O resultado ainda não está definido e pode mudar bastante conforme suas próximas atitudes profissionais.';
  }

  if(area==='Dinheiro / Negócios'){
    extra=score>=1
      ?' O retorno tende a ser construído com constância, divulgação, organização e repetição de boas decisões, não como dinheiro rápido.'
      :score<=-1
      ?' Antes de esperar crescimento, vale rever preço, custos, divulgação, planejamento ou forma de atuação.'
      :' O resultado material ainda está em construção e depende bastante de organização e continuidade.';
  }

  if(area==='Amor / Relacionamento'){
    extra=score>=1
      ?' Existe potencial, mas a evolução precisa aparecer também nas atitudes e na reciprocidade, não apenas nos sentimentos.'
      :score<=-1
      ?' A leitura pede cautela com expectativas e aconselha observar atitudes concretas, comunicação e limites.'
      :' O vínculo permanece aberto e o próximo passo depende de clareza e participação dos dois lados.';
  }

  if(area==='Reconciliação'){
    extra=score>=1
      ?' Há espaço para reaproximação, mas ela só tende a funcionar se houver conversa sincera e mudança do que causou o afastamento.'
      :score<=-1
      ?' Antes de uma volta, existem questões emocionais ou padrões que precisam ser resolvidos; forçar contato agora pode repetir o mesmo problema.'
      :' O vínculo ainda pode ter algo em aberto, mas a leitura não mostra uma definição imediata.';
  }

  if(area==='Família'){
    extra=score>=1
      ?' A melhora tende a vir com diálogo, paciência e disposição para rever expectativas.'
      :score<=-1
      ?' A leitura pede tempo, limites e cuidado para não ampliar conflitos já existentes.'
      :' O cenário pode mudar conforme houver mais clareza e comunicação.';
  }

  if(area==='Geral'){
    extra=' O Tarot mostra tendências e possibilidades, não uma certeza absoluta.';
  }

  return `${answer}${extra} A carta de conselho é ${last.name}${last.rev?' invertida':''}.`;
}

function interpretation(draw,q){
  const chosen=draw.filter(c=>c?.name);
  if(!chosen.length) return null;

  const area=detectArea(q);
  const score=chosen.reduce((a,c)=>a+scoreCard(c,area),0);
  const label=tendency(score);
  const answer=directAnswer(area,score);

  const sequence=chosen.map((c,i)=>{
    const pos=layouts[draw.length]?.[i] || `Carta ${i+1}`;
    return `${pos} — ${c.name}${c.rev?' (invertida)':' (em pé)'}: ${cardText(c)}.`;
  }).join(' ');

  const combination=comboNarrative(chosen);
  const last=chosen[chosen.length-1];

  let abertura='';
  let fechamento='';

  if(area==='Trabalho / Emprego'){
    abertura=`As cartas mostram um cenário profissional que precisa ser observado como um processo, e não apenas como um “sim” ou “não”. ${answer}`;
    fechamento=`O ponto principal desta tiragem é que o resultado profissional ainda pode ser influenciado pelas suas atitudes, escolhas e oportunidades que surgirem daqui para frente.`;
  }else if(area==='Dinheiro / Negócios'){
    abertura=`Na área financeira, a tiragem mostra tendências importantes sobre movimento, estabilidade e possibilidades. ${answer}`;
    fechamento=`As cartas aconselham observar não apenas o resultado imediato, mas também as decisões práticas que podem fortalecer sua situação financeira.`;
  }else if(area==='Amor / Relacionamento'){
    abertura=`No campo afetivo, as cartas falam principalmente sobre sentimentos, atitudes e reciprocidade. ${answer}`;
    fechamento=`Mais do que esperar apenas pelo que a outra pessoa sente, esta tiragem pede atenção às atitudes concretas, à comunicação e à reciprocidade entre vocês.`;
  }else if(area==='Família'){
    abertura=`Sobre a situação familiar, as cartas mostram emoções e questões que ainda podem passar por mudanças. ${answer}`;
    fechamento=`O caminho indicado pelas cartas envolve diálogo, compreensão e limites claros para que a situação possa evoluir de maneira mais equilibrada.`;
  }else{
    abertura=`O conjunto das cartas mostra tendências e possibilidades para a sua pergunta. ${answer}`;
    fechamento=`A leitura não mostra um destino totalmente fechado. As próximas escolhas e acontecimentos ainda podem modificar o rumo dessa situação.`;
  }

  const resumo=`${abertura} ${combination} ${fechamento} A carta que encerra a leitura é ${last.name}${last.rev?' invertida':' em pé'}, reforçando o conselho final da tiragem.`;

  return {
    area,
    label,
    answer:abertura,
    combination,
    sequence,
    advice:adviceFromLast(last,area),
    summary:resumo
  };
}
function App(){
  const[q,setQ]=useState('');
  const[mode,setMode]=useState('manual');
  const[count,setCount]=useState(3);
  const[draw,setDraw]=useState(Array.from({length:3},()=>({name:'',rev:false})));
  const result=useMemo(()=>interpretation(draw,q),[draw,q]);

  function setLayout(n){
    setCount(n);
    setDraw(Array.from({length:n},()=>({name:'',rev:false})));
  }

  function jogar(){
    let pool=[...cards],out=[];
    for(let i=0;i<count;i++){
      let x=Math.floor(Math.random()*pool.length);
      out.push({name:pool.splice(x,1)[0],rev:Math.random()<.28});
    }
    setDraw(out);
  }

  function updateCard(i,key,value){
    setDraw(d=>d.map((c,idx)=>idx===i?{...c,[key]:value}:c));
  }

  function limpar(){
    setQ('');
    setDraw(Array.from({length:count},()=>({name:'',rev:false})));
  }

  const complete=draw.every(c=>c.name);

  return <main>
    <section className="hero">
      <div className="moon">☾</div>
      <h1>Tarot da Fê</h1>
      <p>Faça sua tiragem e deixe o app ajudar na interpretação.</p>
    </section>

    <section className="panel">
      <div className="modeTabs">
        <button className={mode==='manual'?'tab active':'tab'} onClick={()=>setMode('manual')}>
          <Hand size={17}/> Eu faço a tiragem
        </button>
        <button className={mode==='auto'?'tab active':'tab'} onClick={()=>setMode('auto')}>
          <Shuffle size={17}/> O app tira as cartas
        </button>
      </div>

      <label>Sua pergunta</label>
      <textarea
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder="Ex.: O que preciso entender sobre meu relacionamento neste momento?"
      />

      <div className="layoutRow">
        <span>Quantidade de cartas:</span>
        {[1,3,5].map(n=>
          <button key={n} className={count===n?'mini activeMini':'mini'} onClick={()=>setLayout(n)}>{n}</button>
        )}
      </div>

      {mode==='auto' &&
        <button className="primary" onClick={jogar}>
          <Shuffle size={18}/> Jogar {count} {count===1?'carta':'cartas'}
        </button>
      }

      {mode==='manual' &&
        <div className="manualIntro">
          <CheckCircle2 size={19}/>
          <span>Faça a tiragem com seu baralho físico e informe abaixo exatamente quais cartas saíram.</span>
        </div>
      }

      <div className="cards">
        {draw.map((c,i)=>
          <article className="card" key={i}>
            <div className="symbol">✦</div>
            <small>{layouts[count][i]}</small>

            {mode==='manual'
              ? <>
                  <select value={c.name} onChange={e=>updateCard(i,'name',e.target.value)}>
                    <option value="">Selecione a carta...</option>
                    <optgroup label="Arcanos Maiores">{major.map(x=><option key={x}>{x}</option>)}</optgroup>
                    <optgroup label="Arcanos Menores">{minor.map(x=><option key={x}>{x}</option>)}</optgroup>
                  </select>
                  <div className="orientation">
                    <button className={!c.rev?'choice selected':''} onClick={()=>updateCard(i,'rev',false)}>Em pé</button>
                    <button className={c.rev?'choice selected':''} onClick={()=>updateCard(i,'rev',true)}>Invertida</button>
                  </div>
                </>
              : <>
                  <h3>{c.name||'Carta ainda não tirada'}</h3>
                  {c.name&&<>
                    <em>{c.rev?'Invertida':'Em pé'}</em>
                    <p>{cardText(c)}.</p>
                  </>}
                </>
            }
          </article>
        )}
      </div>

      {complete&&result&&
        <div className="reading">
          <h2><Sparkles size={20}/> Interpretação da tiragem</h2>

          <p><strong>Área identificada:</strong> {result.area}</p>
          <p><strong>✨ {result.label}</strong></p>

          <h3>🔮 Resposta à sua pergunta</h3>
          <p>{result.answer}</p>

          <h3>Leitura em conjunto</h3>
          <p>{result.combination}</p>

          <p>{result.sequence}</p>

          <h3>🧭 Conselho das cartas</h3>
          <p>{result.advice}</p>

          <div className="finalSummary">
            <h3>⭐ Resumo final</h3>
            <p>{result.summary}</p>
          </div>
        </div>
      }

      {!complete&&mode==='manual'&&
        <p className="hint">Selecione todas as cartas para o app gerar a interpretação.</p>
      }

      <div className="actions">
        {mode==='auto'&&draw.some(c=>c.name)&&
          <button className="again" onClick={jogar}>
            <RotateCcw size={17}/> Jogar novamente
          </button>
        }
        <button className="again" onClick={limpar}>Limpar leitura</button>
      </div>
    </section>

    <footer>Tarot da Fê • leitura simbólica e intuitiva</footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
