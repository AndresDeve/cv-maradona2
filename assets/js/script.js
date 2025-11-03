<script>
// ===== Datos de hitos (solo los más relevantes) =====
const TL_EVENTS = [
  // Internacional juveniles / selecciones
  { year: 1979, type:'intl',  title:'Campeón Mundial Sub-20', place:'Japón', team:'Argentina Sub-20',
    desc:'MVP (Balón de Oro) y Botín de Plata. Inicio del reconocimiento internacional.' },
  { year: 1986, type:'intl',  title:'Campeón Mundial', place:'México', team:'Argentina',
    desc:'Capitán. Autor del “Gol del Siglo” e icónico partido vs. Inglaterra.' },

  // Clubes
  { year: 1981, type:'club',  title:'Primera División (Metropolitano)', team:'Boca Juniors',
    desc:'Título local con Boca en su primera etapa (Metropolitano 1981).' },
  { year: 1983, type:'club',  title:'Copa del Rey & Copa de la Liga', team:'FC Barcelona',
    desc:'Doble copa doméstica en España (1982/83).' },
  { year: 1987, type:'club',  title:'Serie A + Coppa Italia', team:'Napoli',
    desc:'Histórico doblete 1986/87: primera liga en la historia del Napoli.' },
  { year: 1989, type:'club',  title:'Copa UEFA', team:'Napoli',
    desc:'Título continental europeo (1988/89).' },
  { year: 1990, type:'club',  title:'Serie A + Supercopa de Italia', team:'Napoli',
    desc:'Segundo scudetto (1989/90) y Supercopa 1990.' },

  // Intercontinental / Conmebol-UEFA
  { year: 1993, type:'intl',  title:'Copa Conmebol-UEFA (Artemio Franchi)', team:'Argentina',
    desc:'Torneo entre campeones de América y Europa, disputado en Mar del Plata.' },

  // Premios individuales mayores
  { year: 1986, type:'award', title:'Balón de Oro del Mundial', 
    desc:'Mejor jugador de la Copa del Mundo 1986.' },
  { year: 1995, type:'award', title:'Balón de Oro Honorífico',
    desc:'France Football le otorga el Balón de Oro honorario.' },
  { year: 2000, type:'award', title:'Jugador del Siglo (FIFA)',
    desc:'Reconocimiento de la FIFA compartido (votación popular).' },
  { year: 2002, type:'award', title:'Gol del Siglo (FIFA)',
    desc:'Reconocimiento oficial al gol a Inglaterra (1986) en la encuesta de la FIFA (2002).' },
  { year: 2004, type:'award', title:'FIFA 100',
    desc:'Listado honorífico de los 125 mejores futbolistas vivos.' },
  { year: 2017, type:'award', title:'Mejor de la historia (FourFourTwo)',
    desc:'La revista lo coloca como #1 histórico.' },
  { year: 2020, type:'award', title:'Once histórico del Balón de Oro',
    desc:'Incluido en el equipo ideal histórico de France Football.' }
];

// ===== Render =====
(function(){
  const rail   = document.getElementById('tlRail');
  const panel  = document.getElementById('tlDetail');
  const view   = document.getElementById('tlViewport');
  if(!rail || !panel || !view) return;

  // Ordenar por año
  TL_EVENTS.sort((a,b)=> a.year - b.year);

  TL_EVENTS.forEach((ev,i)=>{
    const li = document.createElement('li');
    li.className = `timeline-item tl--${ev.type}`;
    li.setAttribute('role','listitem');

    // Punto
    const dot = document.createElement('span');
    dot.className = 'timeline-dot';
    dot.setAttribute('aria-hidden','true');
    li.appendChild(dot);

    // Botón
    const btn = document.createElement('button');
    btn.className = 'timeline-btn';
    btn.type = 'button';
    btn.innerHTML = `
      <span class="tl-year">${ev.year}</span><br>
      <span class="tl-title">${ev.title}${ev.team?` — <strong>${ev.team}</strong>`:''}</span>
      <span class="tl-tag">${ev.type === 'club' ? 'Club' : ev.type === 'intl' ? 'Selección' : 'Premio'}</span>
    `;
    btn.addEventListener('click', ()=> showDetail(ev, li));
    li.appendChild(btn);

    rail.appendChild(li);
  });

  function showDetail(ev, li){
    // Marcar activo
    rail.querySelectorAll('.timeline-item').forEach(x=> x.classList.remove('is-active'));
    li.classList.add('is-active');

    panel.innerHTML = `
      <h4>${ev.title}${ev.team?` — <span class="meta">${ev.team}</span>`:''}</h4>
      <p class="meta"><strong>${ev.year}</strong>${ev.place?` · ${ev.place}`:''}</p>
      <p>${ev.desc || ''}</p>
    `;
  }

  // Drag-to-scroll (desktop y táctil)
  let isDown=false, startX=0, startScroll=0;
  const start = (x)=>{ isDown=true; startX=x; startScroll=view.scrollLeft; }
  const move  = (x)=>{ if(!isDown) return; const dx = x - startX; view.scrollLeft = startScroll - dx; }
  const end   = ()=>{ isDown=false; }

  view.addEventListener('mousedown', e=> start(e.pageX));
  view.addEventListener('mousemove', e=> move(e.pageX));
  view.addEventListener('mouseleave', end);
  view.addEventListener('mouseup', end);

  view.addEventListener('touchstart', e=> start(e.touches[0].pageX), {passive:true});
  view.addEventListener('touchmove',  e=> move(e.touches[0].pageX), {passive:true});
  view.addEventListener('touchend', end);

  // Foco inicial (opcional: abre el más icónico)
  const idxDefault = TL_EVENTS.findIndex(e=> e.year===1986 && e.type==='intl');
  if (idxDefault >= 0) rail.children[idxDefault]?.querySelector('button')?.click();
})();
</script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const rail = document.getElementById('tlRail');
  if (!rail) return;

  const syncLine = () => {
    rail.style.setProperty('--tl-line-width', rail.scrollWidth + 'px');
  };
  // Usamos una variable CSS en ::before si querés:
  // .timeline-rail::before { width: var(--tl-line-width); left:0; right:auto; }
  const style = document.createElement('style');
  style.textContent = `.timeline-rail::before{ left:0; right:auto; width:var(--tl-line-width); }`;
  document.head.appendChild(style);

  syncLine();
  new ResizeObserver(syncLine).observe(rail);
  window.addEventListener('resize', syncLine);
});
</script>