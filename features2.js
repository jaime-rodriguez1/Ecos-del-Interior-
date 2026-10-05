/* ============================================
   ECOS DEL INTERIOR — Features Extendidas Fase B
   Marcadores, Notas, Reacciones, Seguir,
   Ranking, Búsqueda, Anuncios
   ============================================ */

(function(){
  'use strict';

  /* ============================================
     ESTILOS
     ============================================ */
  try{
    var st = document.createElement('style');
    st.textContent = [
      '.emoji-bar{display:flex;gap:.4rem;flex-wrap:wrap;margin:.6rem 0 1rem}',
      '.emoji-btn{background:var(--bg-soft);border:1px solid var(--border);color:var(--text-dim);padding:.35rem .7rem;border-radius:20px;font-size:.9rem;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:.3rem}',
      '.emoji-btn:hover{transform:translateY(-2px) scale(1.05);border-color:var(--accent)}',
      '.emoji-btn.active{background:var(--accent-glow);border-color:var(--accent);color:var(--accent)}',
      '.emoji-count{font-size:.72rem;font-weight:600}',
      '.search-bar{max-width:1500px;margin:0 auto 1rem;padding:0 1.5rem;display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}',
      '.search-input{flex:1;min-width:200px;background:var(--surface);border:1px solid var(--border);border-radius:30px;color:var(--text);padding:.6rem 1.2rem;font-size:.9rem;font-family:var(--font-sans);transition:all .3s}',
      '.search-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}',
      '.search-sort{background:var(--surface);border:1px solid var(--border);color:var(--text-dim);border-radius:30px;padding:.55rem 1rem;font-size:.82rem;cursor:pointer;font-family:var(--font-sans)}',
      '.banner-anuncios{max-width:1500px;margin:0 auto 1.5rem;padding:0 1.5rem;display:flex;flex-direction:column;gap:.7rem}',
      '.anuncio{background:linear-gradient(135deg,rgba(201,162,39,.15),rgba(201,162,39,.05));border:1px solid var(--accent);border-radius:14px;padding:1rem 1.2rem;position:relative}',
      '.anuncio.urgente{background:linear-gradient(135deg,rgba(194,91,91,.15),rgba(194,91,91,.05));border-color:var(--danger)}',
      '.anuncio.evento{background:linear-gradient(135deg,rgba(122,158,201,.15),rgba(122,158,201,.05));border-color:#7a9ec9}',
      '.anuncio h4{font-family:var(--font-serif);font-size:1.05rem;font-weight:400;color:var(--accent);margin-bottom:.35rem}',
      '.anuncio.urgente h4{color:var(--danger)}',
      '.anuncio.evento h4{color:#7a9ec9}',
      '.anuncio p{font-size:.9rem;color:var(--text-dim);line-height:1.6;margin:0}',
      '.anuncio .cerrar{position:absolute;top:.6rem;right:.7rem;background:transparent;border:none;color:var(--text-faint);cursor:pointer;font-size:.9rem;padding:.2rem .4rem;border-radius:4px}',
      '.anuncio .cerrar:hover{color:var(--danger);background:rgba(194,91,91,.1)}',
      '.notas-panel{background:var(--bg-soft);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1rem;margin-top:1rem}',
      '.notas-panel textarea{width:100%;min-height:100px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:.7rem;font-size:.9rem;font-family:var(--font-sans);resize:vertical}',
      '.notas-panel .acciones{display:flex;gap:.5rem;margin-top:.6rem;justify-content:flex-end}',
      '.notas-info{font-size:.72rem;color:var(--text-faint);margin-top:.5rem;font-style:italic}',
      '.follow-btn{background:var(--bg-soft);border:1px solid var(--border);color:var(--text-dim);padding:.35rem .8rem;border-radius:20px;font-size:.78rem;cursor:pointer;transition:all .25s}',
      '.follow-btn:hover{border-color:var(--accent);color:var(--accent)}',
      '.follow-btn.siguiendo{background:var(--accent-glow);border-color:var(--accent);color:var(--accent)}',
      '.biblioteca-panel{max-width:1500px;margin:0 auto 2rem;padding:0 1.5rem;display:none}',
      '.biblioteca-panel.activo{display:block}',
      '.biblioteca-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem}',
      '.biblioteca-header h2{font-family:var(--font-serif);font-size:1.4rem;font-weight:400;color:var(--text)}',
      '.biblioteca-close{background:transparent;border:1px solid var(--border);color:var(--text-dim);border-radius:20px;padding:.4rem .9rem;font-size:.82rem;cursor:pointer}',
      '.biblioteca-close:hover{color:var(--danger);border-color:var(--danger)}',
      '.ranking-panel{max-width:1500px;margin:0 auto 2rem;padding:0 1.5rem;display:none}',
      '.ranking-panel.activo{display:block}',
      '.ranking-item{display:flex;align-items:center;gap:.8rem;padding:.7rem 1rem;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:.5rem;transition:all .25s;cursor:pointer}',
      '.ranking-item:hover{border-color:var(--accent);transform:translateX(4px)}',
      '.ranking-pos{font-family:var(--font-serif);font-size:1.4rem;color:var(--accent);font-weight:400;min-width:32px}',
      '.ranking-info{flex:1;min-width:0}',
      '.ranking-title{font-family:var(--font-serif);font-size:1rem;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.ranking-meta{font-size:.72rem;color:var(--text-faint);margin-top:2px}',
      '.ranking-stats{font-size:.78rem;color:var(--accent);font-weight:600}',
      '.admin-anuncio-form{display:none;background:var(--surface);border:1px solid var(--accent);border-radius:14px;padding:1.2rem;margin-bottom:1rem}',
      '.admin-anuncio-form.activo{display:block}',
      '.admin-anuncio-form h4{font-family:var(--font-serif);font-size:1rem;color:var(--accent);margin-bottom:.8rem}',
      '.admin-anuncio-form input, .admin-anuncio-form textarea, .admin-anuncio-form select{width:100%;background:var(--bg-soft);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:.6rem .8rem;font-size:.88rem;font-family:var(--font-sans);margin-bottom:.6rem}',
      '.admin-anuncio-form textarea{min-height:70px;resize:vertical}',
      '.admin-anuncio-form .acciones{display:flex;gap:.5rem;justify-content:flex-end;margin-top:.4rem}'
    ].join('');
    document.head.appendChild(st);
  }catch(e){}

  /* ============================================
     UTILIDADES
     ============================================ */
  function getLS(k, def){ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); }catch(e){ return def; } }
  function setLS(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  function toast(msg){ if(typeof showToast === 'function') showToast(msg); }

  /* ============================================
     1. MARCADORES / BIBLIOTECA
     ============================================ */
  function getMarcadores(){ return getLS('ecos_marcadores', []); }
  function toggleMarcador(ecoId){
    var arr = getMarcadores();
    var idx = arr.indexOf(ecoId);
    if(idx === -1){ arr.push(ecoId); toast('Añadido a tu biblioteca 🔖'); }
    else { arr.splice(idx,1); toast('Quitado de tu biblioteca'); }
    setLS('ecos_marcadores', arr);
    actualizarBotonMarcador();
  }
  function esMarcador(ecoId){ return getMarcadores().indexOf(ecoId) !== -1; }

  function actualizarBotonMarcador(){
    var btn = document.getElementById('btnMarcadorExt');
    if(!btn || typeof currentPostId === 'undefined' || !currentPostId) return;
    var marcado = esMarcador(currentPostId);
    btn.textContent = marcado ? '🔖 En tu biblioteca' : '🔖 Guardar';
    btn.classList.toggle('liked', marcado);
  }

  /* ============================================
     2. NOTAS PRIVADAS
     ============================================ */
  function getNotas(){ return getLS('ecos_notas', {}); }
  function setNota(ecoId, texto){
    var notas = getNotas();
    if(texto.trim() === ''){ delete notas[ecoId]; }
    else { notas[ecoId] = texto; }
    setLS('ecos_notas', notas);
  }
  function getNota(ecoId){ var n = getNotas(); return n[ecoId] || ''; }

  /* ============================================
     3. REACCIONES CON EMOJIS
     ============================================ */
  var EMOJIS = ['🖤','🔥','💭','🤯'];
  function getReacciones(){ return getLS('ecos_reacciones', {}); }
  function toggleReaccion(ecoId, emoji){
    var r = getReacciones();
    if(!r[ecoId]) r[ecoId] = {};
    if(r[ecoId][emoji]) delete r[ecoId][emoji];
    else r[ecoId][emoji] = true;
    setLS('ecos_reacciones', r);
    renderEmojiBar();
  }
  function contarReaccion(ecoId, emoji){
    // Reacción propia (1 si el usuario la eligió, 0 si no)
    var r = getReacciones();
    return (r[ecoId] && r[ecoId][emoji]) ? 1 : 0;
  }
  function renderEmojiBar(){
    var cont = document.getElementById('emojiBarExt');
    if(!cont || typeof currentPostId === 'undefined' || !currentPostId) return;
    cont.innerHTML = '';
    var r = getReacciones();
    var misReac = r[currentPostId] || {};
    EMOJIS.forEach(function(e){
      var btn = document.createElement('button');
      btn.className = 'emoji-btn' + (misReac[e] ? ' active' : '');
      btn.innerHTML = e + ' <span class="emoji-count">' + contarReaccion(currentPostId, e) + '</span>';
      btn.onclick = function(ev){ ev.stopPropagation(); toggleReaccion(currentPostId, e); };
      cont.appendChild(btn);
    });
  }

  /* ============================================
     4. SEGUIR ESCRITORES
     ============================================ */
  function getSiguiendo(){ return getLS('ecos_siguiendo', []); }
  function sigoA(autor){ return getSiguiendo().indexOf(autor) !== -1; }
  function toggleSeguir(autor){
    var arr = getSiguiendo();
    var idx = arr.indexOf(autor);
    if(idx === -1){ arr.push(autor); toast('Ahora sigues a ' + autor); }
    else { arr.splice(idx,1); toast('Dejaste de seguir a ' + autor); }
    setLS('ecos_siguiendo', arr);
    actualizarBotonSeguir();
  }
  function actualizarBotonSeguir(){
    var btn = document.getElementById('btnSeguirExt');
    if(!btn || typeof currentPostId === 'undefined' || !currentPostId) return;
    if(typeof posts === 'undefined') return;
    var post = posts.find(function(p){ return p.id === currentPostId; });
    if(!post) return;
    if(typeof currentWriter !== 'undefined' && post.author === currentWriter){
      btn.style.display = 'none';
      return;
    }
    btn.style.display = '';
    var sigo = sigoA(post.author);
    btn.textContent = sigo ? '✓ Siguiendo a ' + post.author : '+ Seguir a ' + post.author;
    btn.classList.toggle('siguiendo', sigo);
  }

  /* ============================================
     5. RANKING SEMANAL
     ============================================ */
  function getRankingSemanal(){
    if(typeof posts === 'undefined') return [];
    var ahora = Date.now();
    var unaSemana = 7 * 24 * 60 * 60 * 1000;
    var recientes = posts.filter(function(p){
      var fecha = new Date(p.date + 'T00:00:00').getTime();
      return (ahora - fecha) < unaSemana * 4; // Últimas 4 semanas por si acaso
    });
    recientes.sort(function(a,b){
      var scoreA = (a.views||0) + (a.likes||0)*3 + (a.comments?a.comments.length:0)*5;
      var scoreB = (b.views||0) + (b.likes||0)*3 + (b.comments?b.comments.length:0)*5;
      return scoreB - scoreA;
    });
    return recientes.slice(0, 5);
  }

  /* ============================================
     6. BÚSQUEDA AVANZADA
     ============================================ */
  var busquedaActual = '';
  var ordenActual = 'recientes';

  function aplicarBusquedaYOrden(){
    if(typeof posts === 'undefined' || typeof renderPosts !== 'function') return;

    // Guardamos el estado original una sola vez
    if(!window._ecosOriginalRender){
      window._ecosOriginalRender = renderPosts;
    }

    // Filtramos/ordenamos los posts
    var original = window._ecosOriginalRender;
    // Simplemente reordenamos el array posts antes de que se renderice
    // (Esto es más limpio: interceptar el render)
  }

  function filtrarYOrdenarPosts(){
    if(typeof posts === 'undefined') return posts;
    var q = busquedaActual.trim().toLowerCase();
    var filtrados = posts;
    if(q){
      filtrados = posts.filter(function(p){
        return (p.title||'').toLowerCase().includes(q) ||
               (p.content||'').toLowerCase().includes(q) ||
               (p.author||'').toLowerCase().includes(q) ||
               (p.tag||'').toLowerCase().includes(q);
      });
    }
    var ordenados = filtrados.slice();
    if(ordenActual === 'recientes'){
      ordenados.sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
    } else if(ordenActual === 'antiguos'){
      ordenados.sort(function(a,b){ return (a.date||'').localeCompare(b.date||''); });
    } else if(ordenActual === 'leidos'){
      ordenados.sort(function(a,b){ return (b.views||0) - (a.views||0); });
    } else if(ordenActual === 'gustados'){
      ordenados.sort(function(a,b){ return (b.likes||0) - (a.likes||0); });
    } else if(ordenActual === 'comentados'){
      ordenados.sort(function(a,b){ return ((b.comments?b.comments.length:0) - (a.comments?a.comments.length:0)); });
    }
    return ordenados;
  }

  /* ============================================
     7. ANUNCIOS DEL ADMIN
     ============================================ */
  function getAnuncios(){ return getLS('ecos_anuncios', []); }
  function setAnuncios(arr){ setLS('ecos_anuncios', arr); }
  function publicarAnuncio(titulo, contenido, prioridad){
    var arr = getAnuncios();
    arr.unshift({
      id: 'an-' + Date.now(),
      titulo: titulo,
      contenido: contenido,
      prioridad: prioridad || 'normal',
      fecha: new Date().toISOString().slice(0,10)
    });
    setAnuncios(arr);
    renderAnuncios();
    toast('Anuncio publicado ✓');
  }
  function eliminarAnuncio(id){
    if(!confirm('¿Eliminar este anuncio?')) return;
    var arr = getAnuncios().filter(function(a){ return a.id !== id; });
    setAnuncios(arr);
    renderAnuncios();
  }
  function getAnunciosCerrados(){ return getLS('ecos_anuncios_cerrados', []); }
  function cerrarAnuncio(id){
    var arr = getAnunciosCerrados();
    if(arr.indexOf(id) === -1) arr.push(id);
    setLS('ecos_anuncios_cerrados', arr);
    renderAnuncios();
  }

  function renderAnuncios(){
    var cont = document.getElementById('bannerAnunciosExt');
    if(!cont) return;
    var anuncios = getAnuncios();
    var cerrados = getAnunciosCerrados();
    var visibles = anuncios.filter(function(a){ return cerrados.indexOf(a.id) === -1; });

    cont.innerHTML = '';
    if(visibles.length === 0) return;

    visibles.forEach(function(a){
      var div = document.createElement('div');
      div.className = 'anuncio ' + (a.prioridad || 'normal');
      var cerrar = document.createElement('button');
      cerrar.className = 'cerrar';
      cerrar.textContent = '✕';
      cerrar.title = 'Ocultar';
      cerrar.onclick = function(){ cerrarAnuncio(a.id); };
      div.appendChild(cerrar);
      var h4 = document.createElement('h4');
      h4.textContent = a.titulo;
      div.appendChild(h4);
      var p = document.createElement('p');
      p.textContent = a.contenido;
      div.appendChild(p);
      cont.appendChild(div);
    });
  }

  /* ============================================
     8. INYECCIÓN DE ELEMENTOS EN EL LECTOR
     ============================================ */
  var inyectado = false;
  function inyectarElementosLector(){
    var readerActions = document.getElementById('readerActions');
    if(!readerActions) return;

    // Botón Marcador
    if(!document.getElementById('btnMarcadorExt')){
      var btn = document.createElement('button');
      btn.id = 'btnMarcadorExt';
      btn.className = 'action-btn';
      btn.textContent = '🔖 Guardar';
      btn.onclick = function(e){ e.stopPropagation(); if(currentPostId) toggleMarcador(currentPostId); };
      readerActions.appendChild(btn);
    }

    // Botón Seguir
    if(!document.getElementById('btnSeguirExt')){
      var btnS = document.createElement('button');
      btnS.id = 'btnSeguirExt';
      btnS.className = 'action-btn follow-btn';
      btnS.textContent = '+ Seguir';
      btnS.onclick = function(e){
        e.stopPropagation();
        if(typeof currentPostId === 'undefined') return;
        var post = (typeof posts !== 'undefined') ? posts.find(function(p){ return p.id === currentPostId; }) : null;
        if(post) toggleSeguir(post.author);
      };
      readerActions.appendChild(btnS);
    }

    // Barra de emojis
    var readerStats = document.getElementById('readerStats');
    if(readerStats && !document.getElementById('emojiBarExt')){
      var bar = document.createElement('div');
      bar.id = 'emojiBarExt';
      bar.className = 'emoji-bar';
      readerStats.parentNode.insertBefore(bar, readerStats.nextSibling);
    }

    // Panel de notas
    if(!document.getElementById('notasPanelExt')){
      var readerContent = document.getElementById('readerContent');
      if(readerContent){
        var panel = document.createElement('div');
        panel.id = 'notasPanelExt';
        panel.className = 'notas-panel';
        panel.style.display = 'none';
        panel.innerHTML = '<div style="font-size:.85rem;color:var(--text-dim);margin-bottom:.5rem">📝 Notas privadas (solo tú las ves)</div><textarea id="notasTextoExt" placeholder="Escribe tus reflexiones sobre este eco..."></textarea><div class="notas-info">Se guardan automáticamente en este navegador.</div><div class="acciones"><button class="btn-ghost" id="btnCerrarNotas">Cerrar</button></div>';
        readerContent.parentNode.appendChild(panel);
      }
    }

    // Botón para abrir notas
    if(!document.getElementById('btnNotasExt')){
      var btnN = document.createElement('button');
      btnN.id = 'btnNotasExt';
      btnN.className = 'action-btn';
      btnN.textContent = '📝 Notas';
      btnN.onclick = function(e){
        e.stopPropagation();
        var panel = document.getElementById('notasPanelExt');
        var ta = document.getElementById('notasTextoExt');
        if(!panel || !ta) return;
        var visible = panel.style.display !== 'none';
        if(visible){ panel.style.display = 'none'; }
        else {
          ta.value = getNota(currentPostId);
          panel.style.display = 'block';
          setTimeout(function(){ ta.focus(); }, 100);
        }
      };
      readerActions.appendChild(btnN);
    }

    // Guardar notas al escribir
    var ta = document.getElementById('notasTextoExt');
    if(ta && !ta.dataset.bound){
      ta.dataset.bound = '1';
      ta.addEventListener('input', function(){
        if(typeof currentPostId !== 'undefined' && currentPostId){
          setNota(currentPostId, ta.value);
        }
      });
    }
    var btnCerrar = document.getElementById('btnCerrarNotas');
    if(btnCerrar && !btnCerrar.dataset.bound){
      btnCerrar.dataset.bound = '1';
      btnCerrar.onclick = function(){
        var panel = document.getElementById('notasPanelExt');
        if(panel) panel.style.display = 'none';
      };
    }

    // Actualizamos estados
    actualizarBotonMarcador();
    actualizarBotonSeguir();
    renderEmojiBar();
  }

  /* ============================================
     9. INYECCIÓN DE ELEMENTOS EN EL FEED
     ============================================ */
  function inyectarElementosFeed(){
    // Barra de anuncios arriba del feed
    if(!document.getElementById('bannerAnunciosExt')){
      var mainLayout = document.querySelector('.main-layout');
      if(mainLayout && mainLayout.parentNode){
        var banner = document.createElement('div');
        banner.id = 'bannerAnunciosExt';
        banner.className = 'banner-anuncios';
        mainLayout.parentNode.insertBefore(banner, mainLayout);
        renderAnuncios();
      }
    }

    // Barra de búsqueda arriba de los filtros
    if(!document.getElementById('searchBarExt')){
      var filtersBar = document.getElementById('filtersBar');
      if(filtersBar && filtersBar.parentNode){
        var bar = document.createElement('div');
        bar.id = 'searchBarExt';
        bar.className = 'search-bar';
        bar.innerHTML = '<input class="search-input" id="searchInputExt" type="text" placeholder="Buscar por título, autor, contenido o categoría..."><select class="search-sort" id="searchSortExt"><option value="recientes">Recientes</option><option value="antiguos">Antiguos</option><option value="leidos">Más leídos</option><option value="gustados">Más gustados</option><option value="comentados">Más comentados</option></select><button class="view-btn" id="btnBibliotecaExt">🔖 Mi biblioteca</button><button class="view-btn" id="btnRankingExt">🏆 Ranking</button>';
        filtersBar.parentNode.insertBefore(bar, filtersBar);
      }
    }

    // Panel biblioteca
    if(!document.getElementById('bibliotecaPanelExt')){
      var mainLayoutB = document.querySelector('.main-layout');
      if(mainLayoutB && mainLayoutB.parentNode){
        var bp = document.createElement('div');
        bp.id = 'bibliotecaPanelExt';
        bp.className = 'biblioteca-panel';
        bp.innerHTML = '<div class="biblioteca-header"><h2>🔖 Mi biblioteca</h2><button class="biblioteca-close" id="btnCerrarBiblioteca">✕ Cerrar</button></div><div id="bibliotecaContenido"></div>';
        mainLayoutB.parentNode.insertBefore(bp, mainLayoutB);
      }
    }

    // Panel ranking
    if(!document.getElementById('rankingPanelExt')){
      var mainLayoutR = document.querySelector('.main-layout');
      if(mainLayoutR && mainLayoutR.parentNode){
        var rp = document.createElement('div');
        rp.id = 'rankingPanelExt';
        rp.className = 'ranking-panel';
        rp.innerHTML = '<div class="biblioteca-header"><h2>🏆 Ranking semanal</h2><button class="biblioteca-close" id="btnCerrarRanking">✕ Cerrar</button></div><div id="rankingContenido"></div>';
        mainLayoutR.parentNode.insertBefore(rp, mainLayoutR);
      }
    }

    // Formulario de anuncio (solo admin)
    if(typeof currentRole !== 'undefined' && currentRole === 'admin' && !document.getElementById('adminAnuncioFormExt')){
      var banner = document.getElementById('bannerAnunciosExt');
      if(banner){
        var form = document.createElement('div');
        form.id = 'adminAnuncioFormExt';
        form.className = 'admin-anuncio-form';
        form.innerHTML = '<h4>✎ Publicar anuncio (solo admin)</h4><input id="anTitulo" placeholder="Título del anuncio" maxlength="80"><textarea id="anContenido" placeholder="Contenido del anuncio..." maxlength="500"></textarea><select id="anPrioridad"><option value="normal">Normal</option><option value="urgente">Urgente</option><option value="evento">Evento</option></select><div class="acciones"><button class="btn-ghost" id="btnCerrarAnuncioForm">Cancelar</button><button class="btn-primary" id="btnPublicarAnuncio">Publicar</button></div>';
        banner.parentNode.insertBefore(form, banner.nextSibling);
      }
      // Botón para abrir formulario
      if(!document.getElementById('btnAbrirAnuncioForm')){
        var nav = document.querySelector('nav');
        if(nav){
          var b = document.createElement('button');
          b.id = 'btnAbrirAnuncioForm';
          b.className = 'view-btn';
          b.textContent = '📢 Anunciar';
          b.onclick = function(){
            var f = document.getElementById('adminAnuncioFormExt');
            if(f) f.classList.toggle('activo');
          };
          nav.insertBefore(b, nav.firstChild);
        }
      }
      // Bind de botones
      var btnPub = document.getElementById('btnPublicarAnuncio');
      if(btnPub && !btnPub.dataset.bound){
        btnPub.dataset.bound = '1';
        btnPub.onclick = function(){
          var t = document.getElementById('anTitulo').value.trim();
          var c = document.getElementById('anContenido').value.trim();
          var p = document.getElementById('anPrioridad').value;
          if(!t || !c){ toast('Título y contenido obligatorios'); return; }
          publicarAnuncio(t, c, p);
          document.getElementById('anTitulo').value = '';
          document.getElementById('anContenido').value = '';
          document.getElementById('adminAnuncioFormExt').classList.remove('activo');
        };
      }
      var btnCerrarF = document.getElementById('btnCerrarAnuncioForm');
      if(btnCerrarF && !btnCerrarF.dataset.bound){
        btnCerrarF.dataset.bound = '1';
        btnCerrarF.onclick = function(){
          document.getElementById('adminAnuncioFormExt').classList.remove('activo');
        };
      }
    }
  }

  /* ============================================
     10. HANDLERS DE BÚSQUEDA Y PANELES
     ============================================ */
  document.addEventListener('input', function(e){
    if(e.target && e.target.id === 'searchInputExt'){
      busquedaActual = e.target.value;
      aplicarBusqueda();
    }
  });
  document.addEventListener('change', function(e){
    if(e.target && e.target.id === 'searchSortExt'){
      ordenActual = e.target.value;
      aplicarBusqueda();
    }
  });
  document.addEventListener('click', function(e){
    if(e.target && e.target.id === 'btnBibliotecaExt'){
      abrirBiblioteca();
    }
    if(e.target && e.target.id === 'btnCerrarBiblioteca'){
      document.getElementById('bibliotecaPanelExt').classList.remove('activo');
    }
    if(e.target && e.target.id === 'btnRankingExt'){
      abrirRanking();
    }
    if(e.target && e.target.id === 'btnCerrarRanking'){
      document.getElementById('rankingPanelExt').classList.remove('activo');
    }
  });

  function aplicarBusqueda(){
    // Reemplazamos temporalmente la función renderPosts
    if(typeof window.renderPosts !== 'function') return;
    var original = window._ecosOriginalRenderFn || window.renderPosts;
    if(!window._ecosOriginalRenderFn) window._ecosOriginalRenderFn = original;

    var grid = document.getElementById('postsGrid');
    if(!grid) return;
    grid.innerHTML = '';

    var filtrados = filtrarYOrdenarPosts();
    var filtered = (typeof currentFilter !== 'undefined' && currentFilter !== 'todos')
      ? filtrados.filter(function(p){ return p.tag === currentFilter; })
      : filtrados;

    if(filtered.length === 0){
      grid.innerHTML = '<div class="empty"><div class="empty-icon">◌</div><p>No hay ecos que coincidan.</p></div>';
      return;
    }

    filtered.forEach(function(post, i){
      var card = document.createElement('article');
      card.className = 'post-card revealed';
      card.style.transitionDelay = (i * 0.03) + 's';
      card.onclick = function(){ if(typeof openReader === 'function') openReader(post.id); };
      var initial = (post.author || 'A')[0].toUpperCase();
      card.innerHTML =
        '<div class="post-cover" style="background-image:url(\'' + post.cover + '\')"></div>' +
        '<div class="post-body">' +
          '<div class="post-tag">' + (post.tag||'') + '</div>' +
          '<h2 class="post-title">' + (post.title||'') + '</h2>' +
          '<p class="post-excerpt">' + (post.content||'') + '</p>' +
          '<div class="post-meta">' +
            '<div class="post-author"><div class="avatar">' + initial + '</div><span>' + (post.author||'') + '</span></div>' +
            '<div class="post-stats">' +
              '<span class="stat-badge"><span class="heart-icon">♡</span>' + (post.likes||0) + '</span>' +
              '<span>👁 ' + (post.views||0) + '</span>' +
              '<span>💬 ' + (post.comments?post.comments.length:0) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  function abrirBiblioteca(){
    var panel = document.getElementById('bibliotecaPanelExt');
    var cont = document.getElementById('bibliotecaContenido');
    if(!panel || !cont) return;

    var marcadores = getMarcadores();
    var lista = (typeof posts !== 'undefined') ? posts.filter(function(p){ return marcadores.indexOf(p.id) !== -1; }) : [];

    cont.innerHTML = '';
    if(lista.length === 0){
      cont.innerHTML = '<div class="empty"><div class="empty-icon">🔖</div><p>Aún no has guardado ningún eco.</p></div>';
    } else {
      lista.forEach(function(post){
        var item = document.createElement('div');
        item.className = 'ranking-item';
        item.onclick = function(){ if(typeof openReader === 'function') openReader(post.id); };
        item.innerHTML =
          '<div class="ranking-info">' +
            '<div class="ranking-title">' + (post.title||'') + '</div>' +
            '<div class="ranking-meta">' + (post.author||'') + ' · ' + (post.tag||'') + '</div>' +
          '</div>' +
          '<div class="ranking-stats">👁 ' + (post.views||0) + '</div>';
        cont.appendChild(item);
      });
    }
    panel.classList.add('activo');
    // Cerramos ranking si estaba abierto
    var rp = document.getElementById('rankingPanelExt');
    if(rp) rp.classList.remove('activo');
    panel.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function abrirRanking(){
    var panel = document.getElementById('rankingPanelExt');
    var cont = document.getElementById('rankingContenido');
    if(!panel || !cont) return;

    var lista = getRankingSemanal();

    cont.innerHTML = '';
    if(lista.length === 0){
      cont.innerHTML = '<div class="empty"><div class="empty-icon">🏆</div><p>Aún no hay datos suficientes.</p></div>';
    } else {
      lista.forEach(function(post, i){
        var item = document.createElement('div');
        item.className = 'ranking-item';
        item.onclick = function(){ if(typeof openReader === 'function') openReader(post.id); };
        item.innerHTML =
          '<div class="ranking-pos">' + (i+1) + '</div>' +
          '<div class="ranking-info">' +
            '<div class="ranking-title">' + (post.title||'') + '</div>' +
            '<div class="ranking-meta">' + (post.author||'') + ' · ' + (post.tag||'') + '</div>' +
          '</div>' +
          '<div class="ranking-stats">👁 ' + (post.views||0) + '<br>❤ ' + (post.likes||0) + '<br>💬 ' + (post.comments?post.comments.length:0) + '</div>';
        cont.appendChild(item);
      });
    }
    panel.classList.add('activo');
    var bp = document.getElementById('bibliotecaPanelExt');
    if(bp) bp.classList.remove('activo');
    panel.scrollIntoView({behavior:'smooth', block:'start'});
  }

  /* ============================================
     11. LOOP PRINCIPAL
     ============================================ */
  setInterval(function(){
    try{
      inyectarElementosFeed();
      var overlay = document.getElementById('readerOverlay');
      if(overlay && overlay.classList.contains('show')){
        inyectarElementosLector();
      }
    }catch(e){}
  }, 1000);

  /* ============================================
     12. INICIALIZACIÓN
     ============================================ */
  function init(){
    try{
      setTimeout(function(){
        inyectarElementosFeed();
        renderAnuncios();
      }, 1200);
    }catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ecosFeaturesB = {
    toggleMarcador: toggleMarcador,
    toggleSeguir: toggleSeguir,
    toggleReaccion: toggleReaccion,
    publicarAnuncio: publicarAnuncio,
    abrirBiblioteca: abrirBiblioteca,
    abrirRanking: abrirRanking
  };

})();