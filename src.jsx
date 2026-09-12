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

function detectIntent(q){
  const p=(q||'').toLowerCase();

  if(/vai me procurar|me procura|vai mandar mensagem|vai falar comigo|entra em contato|contato/.test(p)) return 'contato';
  if(/voltar|reconciliar|reatar|ficar junto novamente/.test(p)) return 'reconciliacao';
  if(/vou conseguir|consigo|conseguir emprego|arrumar emprego|ser contratad|vaga/.test(p)) return 'conquista';
  if(/vai melhorar|melhora|ficar melhor/.test(p)) return 'melhora';
  if(/ganhar dinheiro|dar dinheiro|ter lucro|vai vender|vou vender|prosperar/.test(p)) return 'resultado_financeiro';
  if(/o que sente|sentimento|gosta de mim|me ama|ama ainda/.test(p)) return 'sentimentos';
  if(/quando|em quanto tempo|demora/.test(p)) return 'tempo';
  if(/devo|vale a pena|qual caminho|o que fazer|como agir/.test(p)) return 'decisao';
  return 'geral';
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

function directAnswer(area,score,intent){
  if(intent==='contato'){
    if(score>=4) return 'Sim, há boa tendência de contato ou aproximação.';
    if(score>=1) return 'Pode haver contato, mas ele não parece imediato nem totalmente espontâneo.';
    if(score<=-4) return 'Neste momento, o contato parece bloqueado ou pouco provável.';
    if(score<=-1) return 'Ainda não aparece uma procura próxima; há resistência ou distância antes disso.';
    return 'Existe possibilidade de contato, mas o cenário ainda está indefinido.';
  }

  if(intent==='sentimentos'){
    if(score>=4) return 'Há sentimentos presentes e uma tendência de abertura emocional.';
    if(score>=1) return 'Há sentimento, mas ele parece misturado com dúvidas, receios ou falta de atitude.';
    if(score<=-4) return 'A leitura mostra bloqueio emocional, desgaste ou dificuldade de entrega.';
    if(score<=-1) return 'Os sentimentos não aparecem de forma livre ou clara neste momento.';
    return 'Há emoção envolvida, mas ainda sem definição suficiente para afirmar uma direção.';
  }

  if(intent==='reconciliacao' || area==='Reconciliação'){
    if(score>=4) return 'Há uma tendência favorável para reaproximação ou reconciliação.';
    if(score>=1) return 'A reconciliação é possível, mas depende de diálogo, atitude e mudança de padrões.';
    if(score<=-4) return 'Neste momento, a reconciliação encontra obstáculos fortes e não parece próxima.';
    if(score<=-1) return 'Ainda não. Existe assunto em aberto, mas antes é preciso resolver bloqueios e mágoas.';
    return 'A reconciliação não está descartada, mas o cenário permanece indefinido.';
  }

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
    lines.push('A combinação mostra mudança de fase e indica que algo precisa se transformar para abrir espaço para o próximo passo.');

  if(names.some(n=>['A Temperança','O Enforcado','O Eremita'].includes(n)))
    lines.push('Também existe uma mensagem de tempo e maturação: nem tudo deve ser forçado agora.');

  if(names.some(n=>['O Mago','O Carro','A Força','Pajem de Paus','Cavaleiro de Paus'].includes(n)))
    lines.push('Há energia de ação e iniciativa, mostrando que sua postura pode acelerar o movimento.');

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
    return `No trabalho, ${last.name} aconselha ${base}. Transforme essa mensagem em atitude prática nos próximos passos profissionais.`;

  if(area==='Dinheiro / Negócios')
    return `${last.name} aconselha aplicar ${base} às decisões financeiras, vendas ou projetos, evitando agir apenas por ansiedade.`;

  if(area==='Amor / Relacionamento')
    return `${last.name} pede atenção a ${base}. Observe atitudes concretas, limites e reciprocidade no vínculo.`;

  if(area==='Reconciliação')
    return `${last.name} aconselha observar ${base} antes de tentar forçar uma reaproximação.`;

  if(area==='Família')
    return `${last.name} indica que ${base} pode ser o ponto mais importante para lidar com essa situação familiar.`;

  return `${last.name} reforça como conselho principal: ${base}.`;
}

function questionSpecificClose(area,intent,score){
  if(intent==='contato'){
    if(score>=1) return 'Se houver procura, ela tende a acontecer quando a situação ganhar mais movimento; evite tentar controlar o tempo da outra pessoa.';
    if(score<=-1) return 'A leitura aconselha não basear suas decisões na expectativa de uma mensagem ou procura imediata.';
    return 'O contato ainda depende de fatores que não estão totalmente definidos.';
  }

  if(intent==='sentimentos'){
    if(score>=1) return 'Existe emoção, mas o que realmente importa agora é verificar se ela se transforma em atitude.';
    if(score<=-1) return 'Mesmo que exista algum sentimento, ele não aparece com força suficiente para sustentar uma conclusão positiva neste momento.';
    return 'O sentimento pode existir, mas ainda não está claro o bastante para definir o rumo do vínculo.';
  }

  if(intent==='tempo'){
    return 'O Tarot não determina datas exatas; aqui a leitura fala mais sobre ritmo, bloqueios e condições para o acontecimento.';
  }

  if(intent==='decisao'){
    return 'A tiragem sugere usar o conselho das cartas como critério para decidir, sem entregar a decisão final ao Tarot.';
  }

  if(area==='Trabalho / Emprego'){
    if(score>=1) return 'A tendência melhora quando você amplia contatos, envia currículos, aceita entrevistas e considera oportunidades diferentes do plano inicial.';
    if(score<=-1) return 'Antes de esperar uma contratação, a leitura sugere rever estratégia, currículo, direção ou tipo de oportunidade buscada.';
    return 'O resultado profissional ainda pode mudar bastante conforme suas próximas atitudes.';
  }

  if(area==='Dinheiro / Negócios'){
    if(score>=1) return 'O crescimento tende a vir de constância, organização e repetição de boas decisões, mais do que de um ganho rápido.';
    if(score<=-1) return 'Antes de esperar retorno maior, vale revisar custos, preços, divulgação e estratégia.';
    return 'O resultado financeiro ainda está em construção.';
  }

  if(area==='Amor / Relacionamento'){
    if(score>=1) return 'Há potencial, mas ele precisa aparecer também em atitudes e reciprocidade.';
    if(score<=-1) return 'A leitura aconselha proteger suas expectativas e observar comportamentos concretos.';
    return 'O vínculo continua aberto e depende de clareza dos dois lados.';
  }

  return 'As cartas mostram tendências, não um destino imutável.';
}

function buildSummary(q,area,intent,score,chosen){
  const names=chosen.map(c=>c.name);
  const last=chosen[chosen.length-1];
  const answer=directAnswer(area,score,intent);
  const close=questionSpecificClose(area,intent,score);

  let link='';

  if(names.includes('A Roda da Fortuna'))
    link+=' A Roda da Fortuna acrescenta movimento e mudança de cenário.';
  if(names.includes('O Enforcado'))
    link+=' O Enforcado mostra que uma pausa ou mudança de perspectiva ainda pode ser necessária.';
  if(names.includes('O Sol'))
    link+=' O Sol fortalece a clareza e o potencial positivo da tiragem.';
  if(names.includes('A Estrela'))
    link+=' A Estrela favorece esperança, recuperação e confiança no caminho.';
  if(names.includes('A Torre'))
    link+=' A Torre indica que algo precisa ser rompido ou reorganizado antes de seguir.';
  if(names.includes('O Diabo'))
    link+=' O Diabo alerta para apego, ansiedade ou padrões repetitivos que podem interferir.';
  if(names.includes('A Imperatriz'))
    link+=' A Imperatriz favorece crescimento, criatividade e expansão.';
  if(names.includes('O Imperador'))
    link+=' O Imperador pede estrutura, limites e decisões práticas.';
  if(names.includes('O Carro'))
    link+=' O Carro reforça movimento, iniciativa e direção.';
  if(names.includes('Os Enamorados'))
    link+=' Os Enamorados mostram que uma escolha ou alinhamento de valores será decisivo.';

  return `${answer}${link} ${close} Como carta final, ${last.name}${last.rev?' invertida':' em pé'} reforça ${meaning(last.name)}.`;
}

function interpretation(draw,q){
  const chosen=draw.filter(c=>c?.name);
  if(!chosen.length) return null;

  const area=detectArea(q);
  const intent=detectIntent(q);
  const score=chosen.reduce((a,c)=>a+scoreCard(c,area),0);
  const label=tendency(score);
  const answer=directAnswer(area,score,intent);

  const sequence=chosen.map((c,i)=>{
    const pos=layouts[draw.length]?.[i]||`Carta ${i+1}`;
    return `${pos} — ${c.name}${c.rev?' (invertida)':' (em pé)'}: ${cardText(c)}.`;
  }).join(' ');

  const combination=comboNarrative(chosen);
  const last=chosen[chosen.length-1];

  return {
    area,
    label,
    answer,
    combination,
    sequence,
    advice:adviceFromLast(last,area),
    summary:buildSummary(q,area,intent,score,chosen)
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
