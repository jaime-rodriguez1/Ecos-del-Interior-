/* ============================================
   ECOS DEL INTERIOR — Features Extendidas v4
   ============================================ */

(function(){
  'use strict';

  // ============================================
  // 1. LOGROS
  // ============================================
  var LOGROS = {
    primer_paso:     { id:'primer_paso',     nombre:'Primer Paso',      icono:'🌱', desc:'Entraste a Ecos del Interior' },
    lector_curioso:  { id:'lector_curioso',  nombre:'Lector Curioso',   icono:'📖', desc:'Leíste tu primer eco' },
    lector_habitual: { id:'lector_habitual', nombre:'Lector Habitual',  icono:'📚', desc:'Leíste 5 ecos' },
    lector_maestro:  { id:'lector_maestro',  nombre:'Lector Maestro',   icono:'🎓', desc:'Leíste 20 ecos' },
    primer_eco:      { id:'primer_eco',      nombre:'Voz Emergente',    icono:'✍️', desc:'Publicaste tu primer eco' },
    autor_fecundo:   { id:'autor_fecundo',   nombre:'Autor Fecundo',    icono:'🖋️', desc:'Publicaste 5 ecos' },
    comentarista:    { id:'comentarista',    nombre:'Comentarista',     icono:'💬', desc:'Escribiste tu primer comentario' },
    racha_3:         { id:'racha_3',         nombre:'Racha de 3 Días',  icono:'🔥', desc:'3 días consecutivos leyendo' },
    racha_7:         { id:'racha_7',         nombre:'Constancia',       icono:'⚡', desc:'7 días consecutivos' },
    zen:             { id:'zen',             nombre:'Modo Zen',         icono:'🧘', desc:'Usaste el Modo Zen' },
    explorador:      { id:'explorador',      nombre:'Explorador',       icono:'🗺️', desc:'Exploraste el mapa mental' },
    nocturno:        { id:'nocturno',        nombre:'Espíritu Nocturno',icono:'🌙', desc:'Leíste después de medianoche' }
  };

  function getLogros(){ try{ return JSON.parse(localStorage.getItem('ecos_logros')||'[]'); }catch(e){ return []; } }
  function setLogros(a){ try{ localStorage.setItem('ecos_logros', JSON.stringify(a)); }catch(e){} }

  function desbloquearLogro(id){
    try{
      var arr = getLogros();
      if(arr.indexOf(id) !== -1) return;
      arr.push(id);
      setLogros(arr);
      var logro = LOGROS[id];
      if(logro) mostrarNotificacionLogro(logro);
    }catch(e){}
  }

  function mostrarNotificacionLogro(logro){
    try{
      var div = document.createElement('div');
      div.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;background:linear-gradient(135deg,rgba(201,162,39,.95),rgba(157,125,20,.95));color:#0a0a0c;padding:1rem 1.4rem;border-radius:14px;box-shadow:0 15px 40px rgba(0,0,0,.5),0 0 30px rgba(201,162,39,.4);display:flex;align-items:center;gap:.8rem;font-family:-apple-system,sans-serif;font-weight:600;max-width:320px;animation:slideInLogro .5s cubic-bezier(.2,.8,.2,1);cursor:pointer';
      div.innerHTML = '<div style="font-size:2rem;line-height:1">' + logro.icono + '</div><div><div style="font-size:.7rem;text-transform:uppercase;letter-spacing:1.5px;opacity:.8">Logro desbloqueado</div><div style="font-size:1rem;margin-top:2px">' + logro.nombre + '</div><div style="font-size:.75rem;font-weight:400;opacity:.85;margin-top:2px">' + logro.desc + '</div></div>';
      div.onclick = function(){ div.remove(); };
      document.body.appendChild(div);
      setTimeout(function(){
        div.style.animation = 'slideOutLogro .4s ease forwards';
        setTimeout(function(){ div.remove(); }, 400);
      }, 4500);
    }catch(e){}
  }

  // ============================================
  // 2. ESTILOS GLOBALES
  // ============================================
  try{
    var st = document.createElement('style');
    st.textContent = [
      '@keyframes slideInLogro{from{opacity:0;transform:translateX(120%)}to{opacity:1;transform:translateX(0)}}',
      '@keyframes slideOutLogro{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(120%)}}',
      '.modal.zen-mode .reader-cover,',
      '.modal.zen-mode .reader-meta,',
      '.modal.zen-mode .reader-stats,',
      '.modal.zen-mode .comments-section,',
      '.modal.zen-mode .reader-actions,',
      '.modal.zen-mode .modal-close{display:none!important}',
      '.modal.zen-mode{max-width:720px;background:#0a0a0c;border-color:rgba(201,162,39,.3);margin-top:2rem!important;margin-bottom:2rem!important;max-height:calc(100vh - 4rem)!important;overflow-y:auto}',
      '.modal.zen-mode .reader-body{padding:5rem 3rem 4rem}',
      '.modal.zen-mode .reader-title{font-size:clamp(1.8rem,5vw,2.6rem);text-align:center;margin-bottom:2rem;padding-top:.5rem}',
      '.modal.zen-mode .reader-content{font-size:1.2rem;line-height:2;max-width:600px;margin:0 auto;color:#e8e6e1}',
      '.zen-close-btn{position:fixed;top:1.2rem;right:1.2rem;width:44px;height:44px;border-radius:50%;background:rgba(10,10,12,.9);border:1px solid rgba(201,162,39,.5);color:#c9a227;font-size:1.3rem;cursor:pointer;display:grid;place-items:center;z-index:10000;transition:all .3s;font-family:Arial,sans-serif;font-weight:300;box-shadow:0 4px 20px rgba(0,0,0,.5);-webkit-tap-highlight-color:transparent}',
      '.zen-close-btn:hover{background:rgba(201,162,39,.2);border-color:#c9a227;transform:rotate(90deg) scale(1.08)}',
      '.zen-close-btn:active{transform:rotate(90deg) scale(.95)}'
    ].join('');
    document.head.appendChild(st);
  }catch(e){}

  // ============================================
  // 3. MODO ZEN
  // ============================================
  function toggleModoZen(){
    try{
      var reader = document.querySelector('#readerOverlay .modal');
      if(!reader) return;
      var yaZen = reader.classList.contains('zen-mode');
      reader.classList.toggle('zen-mode');
      if(!yaZen){
        desbloquearLogro('zen');
        if(!document.getElementById('zenCloseBtn')){
          var btn = document.createElement('button');
          btn.id = 'zenCloseBtn';
          btn.className = 'zen-close-btn';
          btn.innerHTML = '✕';
          btn.title = 'Salir del modo Zen';
          btn.onclick = function(e){
            e.stopPropagation();
            toggleModoZen();
          };
          document.body.appendChild(btn);
        }
      } else {
        var btnExistente = document.getElementById('zenCloseBtn');
        if(btnExistente) btnExistente.remove();
      }
    }catch(e){}
  }

  // ============================================
  // 4. TTS
  // ============================================
  var ttsActivo = false;
  function toggleTTS(){
    try{
      if(!('speechSynthesis' in window)){ alert('Tu navegador no soporta TTS'); return; }
      if(ttsActivo){ window.speechSynthesis.cancel(); ttsActivo = false; return; }
      var titulo = (document.getElementById('readerTitle')||{}).textContent || '';
      var contenido = (document.getElementById('readerContent')||{}).textContent || '';
      if(!titulo || !contenido) return;
      var texto = titulo + '. ' + contenido;
      var u = new SpeechSynthesisUtterance(texto);
      u.lang = 'es-ES';
      u.rate = 0.95;
      u.pitch = 0.95;
      var voces = window.speechSynthesis.getVoices();
      var vozEs = null;
      for(var i=0;i<voces.length;i++){ if(voces[i].lang && voces[i].lang.indexOf('es')===0){ vozEs=voces[i]; break; } }
      if(vozEs) u.voice = vozEs;
      u.onend = function(){ ttsActivo = false; };
      u.onerror = function(){ ttsActivo = false; };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      ttsActivo = true;
    }catch(e){}
  }

  // ============================================
  // 5. COMPARTIR IMAGEN (título + contenido)
  // ============================================
  function envolverTexto(ctx, texto, maxWidth){
    var palabras = String(texto).split(' ');
    var lineas = [];
    var linea = '';
    for(var i=0;i<palabras.length;i++){
      var test = linea + palabras[i] + ' ';
      if(ctx.measureText(test).width > maxWidth && linea !== ''){
        lineas.push(linea.trim());
        linea = palabras[i] + ' ';
      } else {
        linea = test;
      }
    }
    if(linea.trim()) lineas.push(linea.trim());
    return lineas;
  }

  function compartirImagen(titulo, contenido, autor){
    try{
      var canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      var ctx = canvas.getContext('2d');

      // Fondo degradado
      var grad = ctx.createLinearGradient(0,0,1080,1350);
      grad.addColorStop(0, '#0a0a0c');
      grad.addColorStop(1, '#1a1a20');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,1080,1350);

      // Puntos decorativos
      for(var i=0;i<50;i++){
        var x = Math.random()*1080, y = Math.random()*1350, r = Math.random()*2;
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(201,162,39,' + (Math.random()*.3) + ')';
        ctx.fill();
      }

      // Borde dorado
      ctx.strokeStyle = 'rgba(201,162,39,.5)';
      ctx.lineWidth = 3;
      ctx.strokeRect(40,40,1000,1270);

      // Marca superior
      ctx.fillStyle = '#c9a227';
      ctx.font = 'bold 26px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('✦  ECOS DEL INTERIOR  ✦', 540, 130);

      // TÍTULO
      ctx.fillStyle = '#c9a227';
      ctx.font = 'bold 42px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var lineasTitulo = envolverTexto(ctx, titulo || 'Sin título', 900);
      if(lineasTitulo.length > 3){
        lineasTitulo = lineasTitulo.slice(0, 3);
        lineasTitulo[2] = lineasTitulo[2].slice(0, -3) + '…';
      }
      var alturaTitulo = lineasTitulo.length * 56;
      var yTitulo = 230;
      for(var t=0;t<lineasTitulo.length;t++){
        ctx.fillText(lineasTitulo[t], 540, yTitulo + t*56);
      }

      // Línea separadora
      ctx.strokeStyle = 'rgba(201,162,39,.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(240, yTitulo + alturaTitulo + 10);
      ctx.lineTo(840, yTitulo + alturaTitulo + 10);
      ctx.stroke();

      // CONTENIDO
      ctx.fillStyle = '#e8e6e1';
      ctx.font = 'italic 30px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var contenidoRecortado = String(contenido || '');
      if(contenidoRecortado.length > 620){
        contenidoRecortado = contenidoRecortado.slice(0, 620).trim() + '…';
      }

      var lineasContenido = envolverTexto(ctx, contenidoRecortado, 900);
      if(lineasContenido.length > 16){
        lineasContenido = lineasContenido.slice(0, 16);
        lineasContenido[15] = lineasContenido[15].slice(0, -3) + '…';
      }

      var yContenido = yTitulo + alturaTitulo + 80;
      var lineHeightContenido = 44;
      for(var c2=0;c2<lineasContenido.length;c2++){
        ctx.fillText(lineasContenido[c2], 540, yContenido + c2*lineHeightContenido);
      }

      // Autor al pie
      if(autor){
        ctx.fillStyle = '#9a968e';
        ctx.font = 'italic 24px Georgia, serif';
        ctx.fillText('— ' + autor, 540, 1230);
      }

      // Descargar
      canvas.toBlob(function(blob){
        try{
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'eco-ecos-del-interior.png';
          a.click();
          setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
          if(typeof showToast === 'function') showToast('Imagen descargada ✦');
        }catch(e){}
      });
    }catch(e){ console.warn(e); }
  }

  // ============================================
  // 6. MODO POR HORA
  // ============================================
  function aplicarModoPorHora(){
    try{
      if(localStorage.getItem('ecos_theme_manual') === 'true') return;
      var h = new Date().getHours();
      var tema = (h >= 7 && h < 19) ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', tema);
      var tt = document.getElementById('themeToggle');
      if(tt) tt.textContent = tema === 'dark' ? '🌙' : '☀️';
    }catch(e){}
  }

  // ============================================
  // 7. ELIMINAR AFORISMO (admin)
  // ============================================
  function eliminarAforismo(id){
    if(!confirm('¿Eliminar este aforismo?')) return;
    try{
      var arr = JSON.parse(localStorage.getItem('ecos_aforismos_v1') || '[]');
      arr = arr.filter(function(a){ return a.id !== id; });
      localStorage.setItem('ecos_aforismos_v1', JSON.stringify(arr));
      if(typeof renderAforismos === 'function') renderAforismos();
      if(typeof showToast === 'function') showToast('Aforismo eliminado');
    }catch(e){}
  }

  // ============================================
  // 8. ACTIVIDAD
  // ============================================
  function registrarActividad(tipo){
    try{
      var lecturas = parseInt(localStorage.getItem('ecos_lecturas')||'0');
      if(tipo === 'lectura'){
        lecturas++;
        localStorage.setItem('ecos_lecturas', lecturas);
        if(lecturas >= 1) desbloquearLogro('lector_curioso');
        if(lecturas >= 5) desbloquearLogro('lector_habitual');
        if(lecturas >= 20) desbloquearLogro('lector_maestro');
      }
      if(tipo === 'eco'){
        var ecos = parseInt(localStorage.getItem('ecos_ecos_escritos')||'0') + 1;
        localStorage.setItem('ecos_ecos_escritos', ecos);
        if(ecos >= 1) desbloquearLogro('primer_eco');
        if(ecos >= 5) desbloquearLogro('autor_fecundo');
      }
      if(tipo === 'comentario'){
        var c = parseInt(localStorage.getItem('ecos_comentarios')||'0') + 1;
        localStorage.setItem('ecos_comentarios', c);
        if(c >= 1) desbloquearLogro('comentarista');
      }
      if(tipo === 'mapa') desbloquearLogro('explorador');

      var hoy = new Date().toISOString().slice(0,10);
      var ultima = localStorage.getItem('ecos_ultima_visita');
      var racha = parseInt(localStorage.getItem('ecos_racha')||'0');
      if(ultima !== hoy){
        var ayer = new Date(); ayer.setDate(ayer.getDate()-1);
        var ayerStr = ayer.toISOString().slice(0,10);
        if(ultima === ayerStr){
          racha++;
          localStorage.setItem('ecos_racha', racha);
          if(racha >= 3) desbloquearLogro('racha_3');
          if(racha >= 7) desbloquearLogro('racha_7');
        } else {
          localStorage.setItem('ecos_racha', '1');
        }
        localStorage.setItem('ecos_ultima_visita', hoy);
      }

      var h = new Date().getHours();
      if(h >= 0 && h < 5 && tipo === 'lectura') desbloquearLogro('nocturno');
    }catch(e){}
  }

  // ============================================
  // 9. INYECCIÓN DE BOTONES EN EL LECTOR
  // ============================================
  var readerAbierto = false;

  function inyectarBotonesEnLector(){
    try{
      var readerActions = document.getElementById('readerActions');
      if(!readerActions) return;
      if(readerActions.dataset.extended === 'true') return;
      readerActions.dataset.extended = 'true';

      var btnZen = document.createElement('button');
      btnZen.className = 'action-btn';
      btnZen.textContent = '🧘 Modo Zen';
      btnZen.onclick = function(e){ e.stopPropagation(); toggleModoZen(); };
      readerActions.appendChild(btnZen);

      var btnTTS = document.createElement('button');
      btnTTS.className = 'action-btn';
      btnTTS.textContent = '🔊 Escuchar';
      btnTTS.onclick = function(e){ e.stopPropagation(); toggleTTS(); };
      readerActions.appendChild(btnTTS);

      var btnImg = document.createElement('button');
      btnImg.className = 'action-btn';
      btnImg.textContent = '📸 Compartir imagen';
      btnImg.onclick = function(e){
        e.stopPropagation();
        var post = null;
        if(typeof posts !== 'undefined' && typeof currentPostId !== 'undefined'){
          post = posts.find(function(p){ return p.id === currentPostId; });
        }
        if(!post) return;
        // Enviar TÍTULO, CONTENIDO y AUTOR
        compartirImagen(post.title, post.content, post.author);
      };
      readerActions.appendChild(btnImg);
    }catch(e){}
  }

  function limpiarAlCerrarLector(){
    try{
      if(ttsActivo && 'speechSynthesis' in window){
        window.speechSynthesis.cancel();
        ttsActivo = false;
      }
      var modal = document.querySelector('#readerOverlay .modal');
      if(modal) modal.classList.remove('zen-mode');
      var btnZen = document.getElementById('zenCloseBtn');
      if(btnZen) btnZen.remove();
      var ra = document.getElementById('readerActions');
      if(ra){ ra.dataset.extended = ''; }
    }catch(e){}
  }

  // ============================================
  // 10. BOTONES ADMIN EN AFORISMOS
  // ============================================
  function actualizarBotonesAdminEnAforismos(){
    try{
      if(typeof currentRole === 'undefined' || currentRole !== 'admin') return;
      var lista = document.getElementById('aforismosList');
      if(!lista) return;
      var items = lista.querySelectorAll('.aforismo-item');
      var aforismosArr = (typeof aforismos !== 'undefined' ? aforismos : []);
      var recent = aforismosArr.slice().reverse();
      for(var i=0;i<items.length;i++){
        var item = items[i];
        if(item.dataset.adminBtn === 'true') continue;
        item.dataset.adminBtn = 'true';
        item.style.position = 'relative';
        var af = recent[i];
        if(!af) continue;
        (function(aforismo){
          var btn = document.createElement('button');
          btn.textContent = '✕';
          btn.title = 'Eliminar';
          btn.style.cssText = 'position:absolute;top:6px;right:0;background:transparent;border:none;color:var(--text-faint);cursor:pointer;font-size:.85rem;padding:2px 6px;border-radius:4px';
          btn.onmouseenter = function(){ btn.style.color = 'var(--danger)'; };
          btn.onmouseleave = function(){ btn.style.color = 'var(--text-faint)'; };
          btn.onclick = function(e){ e.stopPropagation(); eliminarAforismo(aforismo.id); };
          item.appendChild(btn);
        })(af);
      }
    }catch(e){}
  }

  // ============================================
  // 11. LOOP PRINCIPAL
  // ============================================
  setInterval(function(){
    try{
      var overlay = document.getElementById('readerOverlay');
      if(overlay && overlay.classList.contains('show')){
        if(!readerAbierto){
          readerAbierto = true;
          registrarActividad('lectura');
          setTimeout(inyectarBotonesEnLector, 200);
        }
      } else {
        if(readerAbierto){
          readerAbierto = false;
          limpiarAlCerrarLector();
        }
      }
      actualizarBotonesAdminEnAforismos();
    }catch(e){}
  }, 800);

  // ============================================
  // 12. CLICS GLOBALES
  // ============================================
  document.addEventListener('click', function(e){
    try{
      if(e.target && e.target.id === 'viewMap'){
        registrarActividad('mapa');
      }
      if(e.target && e.target.id === 'themeToggle'){
        localStorage.setItem('ecos_theme_manual', 'true');
      }
    }catch(e){}
  }, true);

  // ============================================
  // 13. INICIALIZACIÓN
  // ============================================
  function init(){
    try{
      aplicarModoPorHora();
      registrarActividad('visita');
      setInterval(aplicarModoPorHora, 30*60*1000);
      setTimeout(function(){ desbloquearLogro('primer_paso'); }, 1500);
    }catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ecosFeatures = {
    toggleModoZen: toggleModoZen,
    toggleTTS: toggleTTS,
    compartirImagen: compartirImagen,
    desbloquearLogro: desbloquearLogro,
    eliminarAforismo: eliminarAforismo
  };

})();