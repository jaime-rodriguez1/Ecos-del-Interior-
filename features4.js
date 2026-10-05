/* ============================================
   ECOS DEL INTERIOR — Fase C final
   Resumen mensual + Mapa de influencias
   ============================================ */

(function(){
  'use strict';

  function toast(msg){ if(typeof showToast === 'function') showToast(msg); }
  function getLS(k, def){ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); }catch(e){ return def; } }
  function setLS(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  function esc(s){ return String(s||'').replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c];
  }); }

  /* ============================================
     ESTILOS
     ============================================ */
  try{
    var st = document.createElement('style');
    st.textContent = [
      '.resumen-modal{position:fixed;inset:0;background:rgba(5,5,7,.92);backdrop-filter:blur(6px);z-index:5000;display:none;align-items:center;justify-content:center;padding:1.5rem 1rem;overflow-y:auto}',
      '.resumen-modal.show{display:flex}',
      '.resumen-box{background:var(--surface);border:1px solid var(--accent);border-radius:18px;max-width:720px;width:100%;padding:1.8rem;position:relative;max-height:calc(100vh - 3rem);overflow-y:auto}',
      '.resumen-box h3{font-family:var(--font-serif);font-size:1.3rem;color:var(--accent);font-weight:400;margin-bottom:1rem;padding-right:2rem}',
      '.resumen-box .cerrar{position:absolute;top:1rem;right:1rem;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid var(--border);color:var(--text-dim);cursor:pointer;font-size:1rem;display:grid;place-items:center}',
      '.resumen-preview{border:1px solid var(--border);border-radius:10px;overflow:hidden;background:#fff;margin-bottom:1rem}',
      '.resumen-preview iframe{width:100%;height:400px;border:none;display:block}',
      '.influencias-panel{max-width:1500px;margin:0 auto 2rem;padding:0 1.5rem;display:none}',
      '.influencias-panel.activo{display:block}',
      '.influencia-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.2rem 1.4rem;margin-bottom:1rem}',
      '.influencia-card h4{font-family:var(--font-serif);font-size:1.15rem;color:var(--accent);margin-bottom:.3rem;font-weight:400}',
      '.influencia-escuela{font-size:.72rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-faint);margin-bottom:.7rem}',
      '.influencia-ecos{display:flex;flex-direction:column;gap:.4rem}',
      '.influencia-eco{background:var(--bg-soft);border:1px solid var(--border);border-radius:8px;padding:.6rem .9rem;font-size:.88rem;color:var(--text-dim);cursor:pointer;transition:all .25s}',
      '.influencia-eco:hover{border-color:var(--accent);color:var(--text);transform:translateX(4px)}',
      '.check-preferencia{display:flex;align-items:center;gap:.6rem;padding:.8rem 1rem;background:var(--surface);border:1px solid var(--border);border-radius:10px;margin:1rem 0}',
      '.check-preferencia input{width:18px;height:18px;cursor:pointer}',
      '.check-preferencia label{cursor:pointer;font-size:.88rem;color:var(--text)}'
    ].join('');
    document.head.appendChild(st);
  }catch(e){}

  /* ============================================
     1. FILÓSOFOS DE INFLUENCIA
     ============================================ */
  var FILOSOFOS = {
    'Nietzsche': {
      escuela: 'Vitalismo · Nihilismo activo',
      claves: ['voluntad de poder','superhombre','eterno retorno','nihilismo','caos','dionisíaco','abismo','transvaloración','muerte de dios']
    },
    'Schopenhauer': {
      escuela: 'Pesimismo metafísico',
      claves: ['voluntad','pesimismo','sufrimiento','dolor','insatisfacción','nada','renuncia','aburrimiento']
    },
    'Jung': {
      escuela: 'Psicología profunda',
      claves: ['arquetipo','sombra','inconsciente','sincronicidad','individuación','ánima','ánimus','sí mismo','proyección']
    },
    'Freud': {
      escuela: 'Psicoanálisis',
      claves: ['represión','pulsión','inconsciente','complejo','sublimación','deseo','trauma','neurosis']
    },
    'Sartre': {
      escuela: 'Existencialismo',
      claves: ['libertad','mala fe','angustia','absurdo','responsabilidad','autenticidad','elección','compromiso']
    },
    'Camus': {
      escuela: 'Absurdismo',
      claves: ['absurdo','rebeldía','sísifo','exilio','indiferencia','sol','mediterráneo']
    },
    'Kierkegaard': {
      escuela: 'Existencialismo cristiano',
      claves: ['angustia','desesperación','fe','salto','subjetividad','singular','estadios']
    },
    'Heidegger': {
      escuela: 'Fenomenología existencial',
      claves: ['ser-ahí','dasein','autenticidad','muerte','cuidado','tiempo','angustia']
    },
    'Marco Aurelio': {
      escuela: 'Estoicismo',
      claves: ['aceptación','virtud','razón','naturaleza','control','imperio','deber','serenidad']
    },
    'Epicteto': {
      escuela: 'Estoicismo',
      claves: ['libertad interior','juicio','opinión','deseo','indiferencia','esclavo']
    },
    'Séneca': {
      escuela: 'Estoicismo romano',
      claves: ['brevedad de la vida','tranquilidad','ira','ocio','fortuna','destino']
    },
    'Dostoievski': {
      escuela: 'Literatura existencial',
      claves: ['culpa','redención','libertad','dostoievski','subsuelo','crimen','castigo','hermanos']
    },
    'Kafka': {
      escuela: 'Literatura del absurdo',
      claves: ['kafka','absurdo','burocracia','proceso','metamorfosis','culpa','alienación']
    },
    'Byung-Chul Han': {
      escuela: 'Filosofía contemporánea',
      claves: ['sociedad del cansancio','transparencia','positividad','rendimiento','autoexplotación']
    }
  };

  function detectarInfluencias(){
    if(typeof posts === 'undefined' || !posts.length) return [];
    var resultado = [];
    Object.keys(FILOSOFOS).forEach(function(filo){
      var info = FILOSOFOS[filo];
      var ecosAfectados = [];
      posts.forEach(function(p){
        var text = ((p.title||'') + ' ' + (p.content||'')).toLowerCase();
        var match = info.claves.some(function(k){
          return text.indexOf(k.toLowerCase()) !== -1 || text.indexOf(filo.toLowerCase()) !== -1;
        });
        if(match) ecosAfectados.push(p);
      });
      if(ecosAfectados.length > 0){
        resultado.push({ nombre: filo, escuela: info.escuela, ecos: ecosAfectados });
      }
    });
    resultado.sort(function(a,b){ return b.ecos.length - a.ecos.length; });
    return resultado;
  }

  /* ============================================
     2. PANEL DE MAPA DE INFLUENCIAS
     ============================================ */
  function abrirInfluencias(){
    var panel = document.getElementById('influenciasPanelExt');
    if(!panel) return;
    var cont = document.getElementById('influenciasContenido');
    if(!cont) return;

    var lista = detectarInfluencias();
    cont.innerHTML = '';

    if(lista.length === 0){
      cont.innerHTML = '<div class="empty"><div class="empty-icon">🧭</div><p>Aún no hay suficientes ecos para detectar influencias filosóficas.</p></div>';
    } else {
      lista.forEach(function(f){
        var card = document.createElement('div');
        card.className = 'influencia-card';
        var ecosHtml = f.ecos.map(function(p){
          return '<div class="influencia-eco" data-eco-id="' + p.id + '">✦ ' + esc(p.title) + ' <span style="color:var(--text-faint);font-size:.75rem;">· ' + f.ecos.length + ' coincidencias</span></div>';
        }).join('');
        card.innerHTML =
          '<h4>' + esc(f.nombre) + '</h4>' +
          '<div class="influencia-escuela">' + esc(f.escuela) + ' · ' + f.ecos.length + ' eco' + (f.ecos.length>1?'s':'') + '</div>' +
          '<div class="influencia-ecos">' + ecosHtml + '</div>';
        cont.appendChild(card);
      });
      // Click en ecos
      cont.querySelectorAll('.influencia-eco').forEach(function(el){
        el.onclick = function(){
          var id = el.getAttribute('data-eco-id');
          if(id && typeof openReader === 'function') openReader(id);
        };
      });
    }

    panel.classList.add('activo');
    panel.scrollIntoView({behavior:'smooth', block:'start'});
  }

  /* ============================================
     3. RESUMEN MENSUAL
     ============================================ */
  function calcularResumen(){
    if(typeof posts === 'undefined' || !posts.length) return null;
    var ahora = new Date();
    var haceUnMes = new Date(ahora.getTime() - 30*24*60*60*1000);
    var haceUnMesStr = haceUnMes.toISOString().slice(0,10);

    var delMes = posts.filter(function(p){
      return (p.date || '') >= haceUnMesStr;
    });

    var totalComentarios = 0;
    var autores = {};
    delMes.forEach(function(p){
      totalComentarios += (p.comments ? p.comments.length : 0);
      autores[p.author] = (autores[p.author] || 0) + 1;
    });

    // Top 5 ecos por score
    var ordenados = delMes.slice().sort(function(a,b){
      var sA = (a.views||0) + (a.likes||0)*3 + (a.comments?a.comments.length:0)*5;
      var sB = (b.views||0) + (b.likes||0)*3 + (b.comments?b.comments.length:0)*5;
      return sB - sA;
    }).slice(0, 5);

    // Aforismo top
    var aforismoTop = '';
    if(typeof aforismos !== 'undefined' && aforismos.length){
      var afTop = aforismos.slice().reverse().find(function(a){
        return a.sourcePostId && delMes.some(function(p){ return p.id === a.sourcePostId; });
      });
      if(afTop) aforismoTop = afTop.text;
    }

    // Debates (ecos con más de 2 comentarios)
    var debates = delMes.filter(function(p){
      return (p.comments && p.comments.length >= 2);
    }).slice(0, 3).map(function(p){
      return { tema: p.title, resumen: p.comments.length + ' comentarios generados.' };
    });

    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

    return {
      mes: meses[ahora.getMonth()],
      anio: ahora.getFullYear(),
      ecosDestacados: ordenados,
      totalEcos: delMes.length,
      totalComentarios: totalComentarios,
      autoresActivos: Object.keys(autores).length,
      debates: debates,
      aforismoTop: aforismoTop
    };
  }

  function abrirResumenMensual(){
    var datos = calcularResumen();
    if(!datos){ toast('No hay datos suficientes'); return; }

    // Crear modal
    var overlay = document.createElement('div');
    overlay.className = 'resumen-modal show';
    overlay.innerHTML = '<div class="resumen-box"><button class="cerrar">✕</button><h3>✦ Resumen mensual — ' + datos.mes + ' ' + datos.anio + '</h3><div class="contenido"><div style="color:var(--accent);font-style:italic;padding:1rem 0">Generando previsualización…</div></div></div>';
    overlay.querySelector('.cerrar').onclick = function(){ overlay.remove(); };
    overlay.onclick = function(e){ if(e.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);

    // Llamar al backend para generar HTML
    fetch('/api/resumen-mensual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'generar', datos: datos })
    }).then(function(r){ return r.json(); }).then(function(resp){
      var cont = overlay.querySelector('.contenido');
      if(!resp.html){
        cont.innerHTML = '<p style="color:var(--danger)">Error generando resumen.</p>';
        return;
      }
      cont.innerHTML =
        '<div class="check-preferencia"><input type="checkbox" id="chkRecibirResumen" ' + (getLS('ecos_recibir_resumen', true) ? 'checked' : '') + '><label for="chkRecibirResumen">Quiero recibir este resumen cada mes en mi correo</label></div>' +
        '<div class="resumen-preview"><iframe srcdoc="' + esc(resp.html) + '"></iframe></div>' +
        '<div style="display:flex;gap:.5rem;justify-content:flex-end;flex-wrap:wrap"><button class="btn-ghost" id="btnResumenCerrar">Cerrar</button><button class="btn-primary" id="btnResumenEnviar">✉ Enviar a suscriptores</button></div>';

      var chk = overlay.querySelector('#chkRecibirResumen');
      if(chk){
        chk.onchange = function(){ setLS('ecos_recibir_resumen', chk.checked); };
      }
      overlay.querySelector('#btnResumenCerrar').onclick = function(){ overlay.remove(); };
      overlay.querySelector('#btnResumenEnviar').onclick = function(){ enviarResumen(datos, overlay); };
    }).catch(function(e){
      var cont = overlay.querySelector('.contenido');
      if(cont) cont.innerHTML = '<p style="color:var(--danger)">Error de conexión: ' + e.message + '</p>';
    });
  }

  async function enviarResumen(datos, overlay){
    // Obtener lista de destinatarios (solo los que tienen correo y aceptaron)
    var destinatarios = [];
    try{
      if(typeof supabaseClient !== 'undefined' && supabaseClient){
        var r = await supabaseClient.from('profiles').select('email, receive_monthly_summary');
        if(!r.error && r.data){
          destinatarios = r.data.filter(function(p){ return p.email && p.receive_monthly_summary !== false; }).map(function(p){ return p.email; });
        }
      }
    }catch(e){ console.warn(e); }

    if(destinatarios.length === 0){
      toast('No hay destinatarios suscritos');
      return;
    }

    if(!confirm('¿Enviar el resumen a ' + destinatarios.length + ' usuario(s)?')) return;

    var btn = overlay.querySelector('#btnResumenEnviar');
    if(btn){ btn.disabled = true; btn.textContent = 'Enviando…'; }

    try{
      var r = await fetch('/api/resumen-mensual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'enviar', datos: datos, destinatarios: destinatarios })
      });
      var resp = await r.json();
      if(resp.error){
        toast('Error: ' + resp.error);
      } else {
        var ok = resp.enviados.filter(function(x){ return x.ok; }).length;
        var fail = resp.enviados.length - ok;
        toast('Enviados: ' + ok + (fail ? ' · Fallidos: ' + fail : ''));
      }
    }catch(e){
      toast('Error de conexión');
    } finally {
      if(btn){ btn.disabled = false; btn.textContent = '✉ Enviar a suscriptores'; }
    }
  }

  /* ============================================
     4. INYECCIÓN DE ELEMENTOS EN EL FEED
     ============================================ */
  function inyectarElementos(){
    // Panel de influencias
    if(!document.getElementById('influenciasPanelExt')){
      var mainLayout = document.querySelector('.main-layout');
      if(mainLayout && mainLayout.parentNode){
        var panel = document.createElement('div');
        panel.id = 'influenciasPanelExt';
        panel.className = 'influencias-panel';
        panel.innerHTML = '<div class="biblioteca-header"><h2>🧭 Mapa de influencias</h2><button class="biblioteca-close" id="btnCerrarInfluencias">✕ Cerrar</button></div><div id="influenciasContenido"></div>';
        mainLayout.parentNode.insertBefore(panel, mainLayout);
        setTimeout(function(){
          var btnC = document.getElementById('btnCerrarInfluencias');
          if(btnC) btnC.onclick = function(){ panel.classList.remove('activo'); };
        }, 100);
      }
    }

    // Botones en el nav
    var nav = document.querySelector('nav');
    if(nav && !nav.dataset.iaFinal === 'true'){
      if(!document.getElementById('btnInfluenciasExt')){
        var bi = document.createElement('button');
        bi.id = 'btnInfluenciasExt';
        bi.className = 'view-btn';
        bi.textContent = '🧭 Influencias';
        bi.onclick = abrirInfluencias;
        nav.insertBefore(bi, nav.firstChild);
      }
      if(typeof currentRole !== 'undefined' && currentRole === 'admin' && !document.getElementById('btnResumenExt')){
        var br = document.createElement('button');
        br.id = 'btnResumenExt';
        br.className = 'view-btn';
        br.textContent = '✦ Resumen mensual';
        br.onclick = abrirResumenMensual;
        nav.insertBefore(br, nav.firstChild);
      }
    }
  }

  /* ============================================
     LOOP
     ============================================ */
  setInterval(inyectarElementos, 1200);

  /* ============================================
     API GLOBAL
     ============================================ */
  window.ecosFeaturesD = {
    abrirInfluencias: abrirInfluencias,
    abrirResumenMensual: abrirResumenMensual,
    detectarInfluencias: detectarInfluencias,
    calcularResumen: calcularResumen
  };
})();