/* ============================================
   ECOS DEL INTERIOR — Fase C (Features con IA)
   Compañero socrático, análisis junguiano,
   oráculo, contradicciones, traducción, debates
   ============================================ */

(function(){
  'use strict';

  /* ============================================
     ESTILOS
     ============================================ */
  try{
    var st = document.createElement('style');
    st.textContent = [
      '.ai-modal-overlay{position:fixed;inset:0;background:rgba(5,5,7,.92);backdrop-filter:blur(6px);z-index:5000;display:none;align-items:center;justify-content:center;padding:1.5rem 1rem;overflow-y:auto}',
      '.ai-modal-overlay.show{display:flex}',
      '.ai-modal{background:var(--surface);border:1px solid var(--accent);border-radius:18px;max-width:640px;width:100%;padding:1.8rem;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 40px rgba(201,162,39,.15);position:relative;max-height:calc(100vh - 3rem);overflow-y:auto}',
      '.ai-modal h3{font-family:var(--font-serif);font-size:1.3rem;color:var(--accent);font-weight:400;margin-bottom:1rem;padding-right:2rem}',
      '.ai-modal .cerrar{position:absolute;top:1rem;right:1rem;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid var(--border);color:var(--text-dim);cursor:pointer;font-size:1rem;display:grid;place-items:center}',
      '.ai-modal .cerrar:hover{color:var(--text);transform:rotate(90deg)}',
      '.ai-modal .loading{color:var(--accent);font-style:italic;font-size:.9rem;display:flex;align-items:center;gap:.6rem;padding:1rem 0}',
      '.ai-modal .loading .spin{width:14px;height:14px;border:2px solid var(--accent-glow);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}',
      '.ai-modal .pregunta{background:var(--bg-soft);border-left:3px solid var(--accent);padding:.9rem 1.1rem;border-radius:8px;margin-bottom:.8rem;font-family:var(--font-serif);font-style:italic;line-height:1.7;color:var(--text)}',
      '.ai-modal .campo{margin-bottom:1rem}',
      '.ai-modal .campo-label{font-size:.72rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);margin-bottom:.3rem;font-weight:600}',
      '.ai-modal .campo-valor{font-family:var(--font-serif);font-size:1rem;line-height:1.7;color:var(--text)}',
      '.ai-modal .idioma-bloque{background:var(--bg-soft);border:1px solid var(--border);border-radius:10px;padding:1rem;margin-bottom:.8rem}',
      '.ai-modal .idioma-titulo{font-size:.72rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);margin-bottom:.4rem;font-weight:600}',
      '.ai-modal .idioma-texto{font-family:var(--font-serif);font-size:.95rem;line-height:1.7;color:var(--text)}',
      '.ai-modal .idioma-titulo-texto{font-family:var(--font-serif);font-size:1.05rem;color:var(--accent-soft);margin-bottom:.3rem}',
      '.ai-modal .acciones{display:flex;gap:.5rem;justify-content:flex-end;margin-top:1.2rem;flex-wrap:wrap}',
      '.ai-input-area{width:100%;background:var(--bg-soft);border:1px solid var(--border);border-radius:10px;color:var(--text);padding:.8rem 1rem;font-family:var(--font-sans);font-size:.92rem;min-height:80px;resize:vertical;margin-bottom:.8rem}',
      '.ai-input-area:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}',
      '.ai-tools-lang{display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.6rem}',
      '.ai-lang-btn{background:var(--bg-soft);border:1px solid var(--border);color:var(--text-dim);padding:.3rem .7rem;border-radius:20px;font-size:.78rem;cursor:pointer;transition:all .2s}',
      '.ai-lang-btn.activo{background:var(--accent-glow);border-color:var(--accent);color:var(--accent)}'
    ].join('');
    document.head.appendChild(st);
  }catch(e){}

  /* ============================================
     HELPERS
     ============================================ */
  function toast(msg){ if(typeof showToast === 'function') showToast(msg); }
  function esc(s){ return String(s||'').replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c];
  }); }

  /* ============================================
     MODAL GENÉRICO
     ============================================ */
  function crearModal(id, titulo){
    var existing = document.getElementById(id);
    if(existing) existing.remove();
    var overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'ai-modal-overlay';
    overlay.innerHTML = '<div class="ai-modal"><button class="cerrar">✕</button><h3>' + esc(titulo) + '</h3><div class="contenido"></div></div>';
    overlay.querySelector('.cerrar').onclick = function(){ overlay.classList.remove('show'); };
    overlay.onclick = function(e){ if(e.target === overlay) overlay.classList.remove('show'); };
    document.body.appendChild(overlay);
    return overlay;
  }

  function abrirModal(overlay){
    overlay.classList.add('show');
  }

  function setContenidoModal(overlay, html){
    var cont = overlay.querySelector('.contenido');
    if(cont) cont.innerHTML = html;
  }

  function setLoadingModal(overlay, texto){
    setContenidoModal(overlay, '<div class="loading"><div class="spin"></div>' + esc(texto || 'Consultando la IA…') + '</div>');
  }

  /* ============================================
     LLAMADA AL BACKEND
     ============================================ */
  async function llamarIA(mode, datos){
    try{
      var resp = await fetch('/api/ai-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode,
          titulo: datos.titulo || '',
          contenido: datos.contenido || '',
          extra: datos.extra || ''
        })
      });
      if(!resp.ok) throw new Error('Backend status ' + resp.status);
      var data = await resp.json();
      if(data.error) throw new Error(data.error);
      return data.resultado;
    }catch(e){
      console.warn('llamarIA error:', e);
      return null;
    }
  }

  function parseJSONSeguro(texto){
    if(!texto) return null;
    try{ return JSON.parse(texto); }catch(e){}
    // Intentar extraer el primer bloque {...}
    var match = texto.match(/\{[\s\S]*\}/);
    if(match){
      try{ return JSON.parse(match[0]); }catch(e){}
    }
    return null;
  }

  /* ============================================
     1. COMPAÑERO SOCRÁTICO
     ============================================ */
  async function abrirSocratico(){
    var post = getPostActual();
    if(!post) return;
    var modal = crearModal('aiSocraticoModal', '🧠 Compañero Socrático');
    abrirModal(modal);
    setLoadingModal(modal, 'Formulando preguntas…');

    var texto = await llamarIA('socratico', {
      titulo: post.title,
      contenido: post.content
    });

    if(!texto){
      setContenidoModal(modal, '<p style="color:var(--danger)">No se pudo conectar con la IA. Intenta de nuevo.</p>');
      return;
    }

    var parsed = parseJSONSeguro(texto);
    if(parsed && parsed.preguntas && parsed.preguntas.length){
      var html = '<p style="font-size:.88rem;color:var(--text-dim);margin-bottom:1rem;font-family:var(--font-serif);font-style:italic">Estas preguntas no buscan respuestas rápidas. Son para pensar.</p>';
      parsed.preguntas.forEach(function(p, i){
        html += '<div class="pregunta"><strong style="color:var(--accent);font-style:normal">' + (i+1) + '.</strong> ' + esc(p) + '</div>';
      });
      setContenidoModal(modal, html);
    } else {
      setContenidoModal(modal, '<div class="campo-valor">' + esc(texto).replace(/\n/g, '<br>') + '</div>');
    }
  }

  /* ============================================
     2. ANÁLISIS JUNGUIANO
     ============================================ */
  async function abrirJunguiano(){
    var post = getPostActual();
    if(!post) return;
    var modal = crearModal('aiJungModal', '🎭 Análisis Junguiano');
    abrirModal(modal);
    setLoadingModal(modal, 'Analizando arquetipos…');

    var texto = await llamarIA('junguiano', {
      titulo: post.title,
      contenido: post.content
    });

    if(!texto){
      setContenidoModal(modal, '<p style="color:var(--danger)">No se pudo conectar con la IA.</p>');
      return;
    }

    var parsed = parseJSONSeguro(texto);
    if(parsed && parsed.arquetipo){
      var html =
        '<div class="campo"><div class="campo-label">Arquetipo predominante</div><div class="campo-valor" style="color:var(--accent);font-size:1.15rem">' + esc(parsed.arquetipo) + '</div></div>' +
        (parsed.sombra ? '<div class="campo"><div class="campo-label">Sombra proyectada</div><div class="campo-valor">' + esc(parsed.sombra) + '</div></div>' : '') +
        (parsed.integracion ? '<div class="campo"><div class="campo-label">Sugerencia de integración</div><div class="campo-valor">' + esc(parsed.integracion) + '</div></div>' : '');
      setContenidoModal(modal, html);
    } else {
      setContenidoModal(modal, '<div class="campo-valor">' + esc(texto).replace(/\n/g, '<br>') + '</div>');
    }
  }

  /* ============================================
     3. ORÁCULO FILOSÓFICO
     ============================================ */
  function abrirOraculo(){
    var modal = crearModal('aiOraculoModal', '🔮 Oráculo Filosófico');
    abrirModal(modal);
    setContenidoModal(modal,
      '<p style="font-size:.88rem;color:var(--text-dim);margin-bottom:1rem;font-family:var(--font-serif);font-style:italic">Haz una pregunta personal. El oráculo responderá con sabiduría filosófica.</p>' +
      '<textarea id="oraculoPregunta" class="ai-input-area" placeholder="¿Qué te inquieta? ¿Qué buscas?" maxlength="300"></textarea>' +
      '<div class="acciones"><button class="btn-primary" id="btnOraculoEnviar">Consultar</button></div>'
    );

    var btn = document.getElementById('btnOraculoEnviar');
    var ta = document.getElementById('oraculoPregunta');
    if(btn && ta){
      btn.onclick = async function(){
        var pregunta = ta.value.trim();
        if(!pregunta){ toast('Escribe una pregunta'); return; }
        setLoadingModal(modal, 'El oráculo medita…');
        var texto = await llamarIA('oraculo', { contenido: pregunta });
        if(!texto){
          setContenidoModal(modal, '<p style="color:var(--danger)">El oráculo guarda silencio. Intenta de nuevo.</p>');
          return;
        }
        setContenidoModal(modal,
          '<div style="color:var(--text-dim);font-size:.8rem;margin-bottom:.8rem;font-style:italic">Preguntaste: "' + esc(pregunta) + '"</div>' +
          '<div class="campo-valor" style="color:var(--accent-soft);font-style:italic">' + esc(texto).replace(/\n/g, '<br>') + '</div>' +
          '<div class="acciones"><button class="btn-ghost" id="btnOraculoOtra">Hacer otra pregunta</button></div>'
        );
        var otra = document.getElementById('btnOraculoOtra');
        if(otra) otra.onclick = abrirOraculo;
      };
      setTimeout(function(){ ta.focus(); }, 200);
    }
  }

  /* ============================================
     4. CONTRADICCIONES
     ============================================ */
  async function abrirContradicciones(){
    if(typeof posts === 'undefined' || !posts.length){ toast('No hay ecos suficientes'); return; }
    var modal = crearModal('aiContraModal', '⚡ Contradicciones Internas');
    abrirModal(modal);
    setLoadingModal(modal, 'Revisando tus ecos…');

    // Tomar los últimos 6 ecos
    var ultimos = posts.slice(0, 6);
    var textos = ultimos.map(function(p){
      return '• "' + p.title + '": ' + p.content.slice(0, 300);
    }).join('\n\n');

    var texto = await llamarIA('contradicciones', { contenido: textos });
    if(!texto){
      setContenidoModal(modal, '<p style="color:var(--danger)">No se pudo conectar con la IA.</p>');
      return;
    }
    var parsed = parseJSONSeguro(texto);
    if(parsed && parsed.contradicciones && parsed.contradicciones.length){
      var html = '<p style="font-size:.88rem;color:var(--text-dim);margin-bottom:1rem;font-family:var(--font-serif);font-style:italic">Tensiones entre tus últimos ecos.</p>';
      parsed.contradicciones.forEach(function(c, i){
        html += '<div class="pregunta"><strong style="color:var(--accent);font-style:normal">' + (i+1) + '.</strong> ' + esc(c.frase) + '<br><span style="font-size:.88rem;color:var(--text-dim);font-style:normal">' + esc(c.explicacion) + '</span></div>';
      });
      setContenidoModal(modal, html);
    } else if(parsed){
      setContenidoModal(modal, '<p style="color:var(--text-dim);font-family:var(--font-serif);font-style:italic">No detecté contradicciones evidentes entre tus últimos ecos. Sigue escribiendo.</p>');
    } else {
      setContenidoModal(modal, '<div class="campo-valor">' + esc(texto).replace(/\n/g, '<br>') + '</div>');
    }
  }

  /* ============================================
     5. TRADUCCIÓN A 5 IDIOMAS
     ============================================ */
  async function abrirTraduccion(){
    var post = getPostActual();
    if(!post) return;
    var modal = crearModal('aiTraduccionModal', '🌍 Traducción a 5 idiomas');
    abrirModal(modal);
    setLoadingModal(modal, 'Traduciendo…');

    var texto = await llamarIA('traduccion', {
      titulo: post.title,
      contenido: post.content
    });
    if(!texto){
      setContenidoModal(modal, '<p style="color:var(--danger)">No se pudo conectar con la IA.</p>');
      return;
    }
    var parsed = parseJSONSeguro(texto);
    if(parsed){
      var idiomas = { en:'🇬🇧 Inglés', fr:'🇫🇷 Francés', pt:'🇧🇷 Portugués', it:'🇮🇹 Italiano', de:'🇩🇪 Alemán' };
      var html = '';
      Object.keys(idiomas).forEach(function(k){
        if(parsed[k]){
          html += '<div class="idioma-bloque"><div class="idioma-titulo">' + idiomas[k] + '</div><div class="idioma-texto">' + esc(parsed[k]).replace(/\n/g, '<br>') + '</div></div>';
        }
      });
      setContenidoModal(modal, html || '<p>No se pudo traducir.</p>');
    } else {
      setContenidoModal(modal, '<div class="campo-valor">' + esc(texto).replace(/\n/g, '<br>') + '</div>');
    }
  }

  /* ============================================
     6. DETECCIÓN DE DEBATES
     ============================================ */
  async function abrirDebates(){
    if(typeof posts === 'undefined' || !posts.length){ toast('No hay ecos'); return; }
    var modal = crearModal('aiDebatesModal', '🔥 Debates Emergentes');
    abrirModal(modal);
    setLoadingModal(modal, 'Analizando los ecos recientes…');

    // Tomar los últimos 4 ecos con más comentarios
    var ordenados = posts.slice().sort(function(a,b){
      return ((b.comments?b.comments.length:0) - (a.comments?a.comments.length:0));
    }).slice(0, 4);

    var html = '';
    for(var i=0; i<ordenados.length; i++){
      var p = ordenados[i];
      var texto = await llamarIA('debates', {
        titulo: p.title,
        contenido: p.content
      });
      var parsed = texto ? parseJSONSeguro(texto) : null;
      if(parsed && parsed.hayDebate){
        html += '<div class="idioma-bloque"><div class="idioma-titulo">' + esc(p.title) + '</div><div class="idioma-titulo-texto">' + esc(parsed.tema) + '</div><div class="idioma-texto">' + esc(parsed.resumen) + '</div></div>';
      }
    }

    if(html){
      setContenidoModal(modal, html);
    } else {
      setContenidoModal(modal, '<p style="color:var(--text-dim);font-family:var(--font-serif);font-style:italic">No se detectaron debates activos por ahora.</p>');
    }
  }

  /* ============================================
     HELPERS
     ============================================ */
  function getPostActual(){
    if(typeof currentPostId === 'undefined' || !currentPostId) return null;
    if(typeof posts === 'undefined') return null;
    return posts.find(function(p){ return p.id === currentPostId; }) || null;
  }

  /* ============================================
     INYECCIÓN DE BOTONES EN EL LECTOR
     ============================================ */
  function inyectarBotonesIA(){
    var readerActions = document.getElementById('readerActions');
    if(!readerActions) return;
    if(readerActions.dataset.iaInjected === 'true') return;
    readerActions.dataset.iaInjected = 'true';

    var botones = [
      { texto: '🧠 Socrático', fn: abrirSocratico },
      { texto: '🎭 Junguiano', fn: abrirJunguiano },
      { texto: '🌍 Traducir', fn: abrirTraduccion }
    ];

    botones.forEach(function(b){
      var btn = document.createElement('button');
      btn.className = 'action-btn';
      btn.textContent = b.texto;
      btn.onclick = function(e){ e.stopPropagation(); b.fn(); };
      readerActions.appendChild(btn);
    });
  }

  /* ============================================
     INYECCIÓN DE BOTONES GLOBALES EN EL HEADER
     ============================================ */
  function inyectarBotonesGlobales(){
    var nav = document.querySelector('nav');
    if(!nav) return;
    if(nav.dataset.iaGlobal === 'true') return;
    nav.dataset.iaGlobal = 'true';

    var btnOraculo = document.createElement('button');
    btnOraculo.className = 'view-btn';
    btnOraculo.textContent = '🔮 Oráculo';
    btnOraculo.onclick = abrirOraculo;
    nav.insertBefore(btnOraculo, nav.firstChild);

    // Botones que solo tienen sentido para el admin
    if(typeof currentRole !== 'undefined' && currentRole === 'admin'){
      var btnContra = document.createElement('button');
      btnContra.className = 'view-btn';
      btnContra.textContent = '⚡ Contradicciones';
      btnContra.onclick = abrirContradicciones;
      nav.insertBefore(btnContra, nav.firstChild);

      var btnDebates = document.createElement('button');
      btnDebates.className = 'view-btn';
      btnDebates.textContent = '🔥 Debates';
      btnDebates.onclick = abrirDebates;
      nav.insertBefore(btnDebates, nav.firstChild);
    }
  }

  /* ============================================
     LOOP
     ============================================ */
  setInterval(function(){
    try{
      var overlay = document.getElementById('readerOverlay');
      if(overlay && overlay.classList.contains('show')){
        inyectarBotonesIA();
      }
      inyectarBotonesGlobales();
    }catch(e){}
  }, 1000);

  /* ============================================
     API GLOBAL
     ============================================ */
  window.ecosFeaturesC = {
    abrirSocratico: abrirSocratico,
    abrirJunguiano: abrirJunguiano,
    abrirOraculo: abrirOraculo,
    abrirContradicciones: abrirContradicciones,
    abrirTraduccion: abrirTraduccion,
    abrirDebates: abrirDebates
  };

})();