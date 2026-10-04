/* ============================================
   ECOS DEL INTERIOR — Features Extendidas
   Fase A: Modo Zen, TTS, Compartir Imagen,
   Modo por hora, Logros, Admin borra aforismos
   ============================================ */

(function(){
  'use strict';

  // ============================================
  // 1. SISTEMA DE LOGROS
  // ============================================
  const LOGROS = {
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

  function getLogrosDesbloqueados(){
    try{ return JSON.parse(localStorage.getItem('ecos_logros')||'[]'); }
    catch(e){ return []; }
  }
  function setLogrosDesbloqueados(arr){
    localStorage.setItem('ecos_logros', JSON.stringify(arr));
  }

  function desbloquearLogro(id){
    const desbloqueados = getLogrosDesbloqueados();
    if(desbloqueados.includes(id)) return;
    desbloqueados.push(id);
    setLogrosDesbloqueados(desbloqueados);

    const logro = LOGROS[id];
    if(!logro) return;

    // Notificación visual
    mostrarNotificacionLogro(logro);
  }

  function mostrarNotificacionLogro(logro){
    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 99999;
      background: linear-gradient(135deg, rgba(201,162,39,.95), rgba(157,125,20,.95));
      color: #0a0a0c; padding: 1rem 1.4rem; border-radius: 14px;
      box-shadow: 0 15px 40px rgba(0,0,0,.5), 0 0 30px rgba(201,162,39,.4);
      display: flex; align-items: center; gap: .8rem;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 600; max-width: 320px;
      animation: slideInLogro .5s cubic-bezier(.2,.8,.2,1);
      cursor: pointer;
    `;
    div.innerHTML = `
      <div style="font-size: 2rem; line-height: 1;">${logro.icono}</div>
      <div>
        <div style="font-size: .7rem; text-transform: uppercase; letter-spacing: 1.5px; opacity: .8;">Logro desbloqueado</div>
        <div style="font-size: 1rem; margin-top: 2px;">${logro.nombre}</div>
        <div style="font-size: .75rem; font-weight: 400; opacity: .85; margin-top: 2px;">${logro.desc}</div>
      </div>
    `;
    div.onclick = () => div.remove();
    document.body.appendChild(div);
    setTimeout(() => {
      div.style.animation = 'slideOutLogro .4s ease forwards';
      setTimeout(() => div.remove(), 400);
    }, 4500);
  }

  // Añadir estilos para animaciones
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInLogro { from{opacity:0; transform: translateX(120%);} to{opacity:1; transform: translateX(0);} }
    @keyframes slideOutLogro { from{opacity:1; transform: translateX(0);} to{opacity:0; transform: translateX(120%);} }
    .logro-badge { display:inline-flex; align-items:center; gap:.4rem; padding:.35rem .7rem; border-radius:20px; background:var(--accent-glow); color:var(--accent); font-size:.75rem; font-weight:600; margin:.2rem; }
    .logro-bloqueado { opacity:.35; filter:grayscale(1); }
    .reader-extra-actions { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1rem; }
  `;
  document.head.appendChild(style);

  // ============================================
  // 2. MODO ZEN
  // ============================================
  function toggleModoZen(){
    const reader = document.querySelector('#readerOverlay .modal');
    if(!reader) return;
    const yaZen = reader.classList.contains('zen-mode');
    reader.classList.toggle('zen-mode');
    
    if(!yaZen){
      desbloquearLogro('zen');
    }
  }

  // Inyectar estilos del modo zen
  const styleZen = document.createElement('style');
  styleZen.textContent = `
    .modal.zen-mode .reader-cover,
    .modal.zen-mode .reader-meta,
    .modal.zen-mode .reader-stats,
    .modal.zen-mode .comments-section,
    .modal.zen-mode .reader-actions,
    .modal.zen-mode .modal-close {
      display: none !important;
    }
    .modal.zen-mode {
      max-width: 720px;
      background: #0a0a0c;
      border-color: rgba(201,162,39,.3);
    }
    .modal.zen-mode .reader-body {
      padding: 4rem 3rem;
    }
    .modal.zen-mode .reader-title {
      font-size: clamp(1.8rem, 5vw, 2.6rem);
      text-align: center;
      margin-bottom: 2rem;
    }
    .modal.zen-mode .reader-content {
      font-size: 1.2rem;
      line-height: 2;
      max-width: 600px;
      margin: 0 auto;
      color: #e8e6e1;
    }
    .zen-exit {
      position: fixed;
      top: 1rem; right: 1rem;
      background: rgba(0,0,0,.6);
      border: 1px solid var(--border);
      color: var(--text-dim);
      width: 38px; height: 38px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.1rem;
      display: grid; place-items: center;
      z-index: 9999;
      transition: all .3s;
    }
    .zen-exit:hover { color: var(--accent); border-color: var(--accent); transform: rotate(90deg); }
  `;
  document.head.appendChild(styleZen);

  // ============================================
  // 3. VOZ NARRATIVA (TTS)
  // ============================================
  let ttsActivo = false;
  let ttsUtterance = null;

  function toggleTTS(){
    if(!('speechSynthesis' in window)){
      alert('Tu navegador no soporta lectura en voz alta.');
      return;
    }
    if(ttsActivo){
      window.speechSynthesis.cancel();
      ttsActivo = false;
      return;
    }
    const titulo = document.getElementById('readerTitle')?.textContent || '';
    const contenido = document.getElementById('readerContent')?.textContent || '';
    if(!titulo || !contenido) return;

    const texto = `${titulo}. ${contenido}`;
    ttsUtterance = new SpeechSynthesisUtterance(texto);
    ttsUtterance.lang = 'es-ES';
    ttsUtterance.rate = 0.95;
    ttsUtterance.pitch = 0.95;
    
    // Elegir la mejor voz en español
    const voces = window.speechSynthesis.getVoices();
    const vozEs = voces.find(v => v.lang.startsWith('es')) || voces[0];
    if(vozEs) ttsUtterance.voice = vozEs;

    ttsUtterance.onend = () => { ttsActivo = false; };
    ttsUtterance.onerror = () => { ttsActivo = false; };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(ttsUtterance);
    ttsActivo = true;
  }

  // ============================================
  // 4. COMPARTIR AFORISMO COMO IMAGEN
  // ============================================
  function compartirAforismoComoImagen(texto, autor){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1080;

    // Fondo degradado oscuro
    const grad = ctx.createLinearGradient(0,0,1080,1080);
    grad.addColorStop(0, '#0a0a0c');
    grad.addColorStop(1, '#1a1a20');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,1080,1080);

    // Puntos de luz decorativos
    for(let i=0; i<40; i++){
      const x = Math.random()*1080;
      const y = Math.random()*1080;
      const r = Math.random()*2;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle = `rgba(201,162,39,${Math.random()*.3})`;
      ctx.fill();
    }

    // Borde dorado
    ctx.strokeStyle = 'rgba(201,162,39,.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40,40,1000,1000);

    // Marca superior
    ctx.fillStyle = '#c9a227';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦  ECOS DEL INTERIOR  ✦', 540, 130);

    // Texto del aforismo (con word wrap)
    ctx.fillStyle = '#e8e6e1';
    ctx.font = 'italic 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const maxWidth = 900;
    const lineHeight = 70;
    const palabras = texto.split(' ');
    const lineas = [];
    let linea = '';
    
    for(let p of palabras){
      const testLinea = linea + p + ' ';
      const metrica = ctx.measureText(testLinea);
      if(metrica.width > maxWidth && linea !== ''){
        lineas.push(linea.trim());
        linea = p + ' ';
      } else {
        linea = testLinea;
      }
    }
    if(linea.trim()) lineas.push(linea.trim());

    const totalAltura = lineas.length * lineHeight;
    const yInicio = (1080 - totalAltura) / 2 + 30;

    lineas.forEach((l, i) => {
      ctx.fillText('"' + l + (i === lineas.length-1 ? '"' : ''), 540, yInicio + i*lineHeight);
    });

    // Autor
    if(autor){
      ctx.fillStyle = '#9a968e';
      ctx.font = 'italic 24px Georgia, serif';
      ctx.fillText('— ' + autor, 540, 960);
    }

    // Descargar
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aforismo-ecos-del-interior.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      if(typeof showToast === 'function') showToast('Imagen descargada ✦');
    });
  }

  // ============================================
  // 5. MODO AUTOMÁTICO POR HORA DEL DÍA
  // ============================================
  function aplicarModoPorHora(){
    // Si el usuario ya eligió un tema manual, no tocar
    if(localStorage.getItem('ecos_theme_manual') === 'true') return;
    
    const hora = new Date().getHours();
    let tema;
    if(hora >= 6 && hora < 10) tema = 'light';       // Amanecer
    else if(hora >= 10 && hora < 19) tema = 'light'; // Día
    else if(hora >= 19 && hora < 22) tema = 'dark';  // Atardecer
    else tema = 'dark';                              // Noche
    
    document.documentElement.setAttribute('data-theme', tema);
    const tt = document.getElementById('themeToggle');
    if(tt) tt.textContent = tema === 'dark' ? '🌙' : '☀️';
  }

  // Marcar cambio manual
  document.addEventListener('click', e => {
    if(e.target && e.target.id === 'themeToggle'){
      localStorage.setItem('ecos_theme_manual', 'true');
    }
  }, true);

  // ============================================
  // 6. ADMIN ELIMINA AFORISMOS
  // ============================================
  function eliminarAforismo(idAforismo){
    if(!confirm('¿Eliminar este aforismo?')) return;
    try{
      let aforismos = JSON.parse(localStorage.getItem('ecos_aforismos_v1') || '[]');
      aforismos = aforismos.filter(a => a.id !== idAforismo);
      localStorage.setItem('ecos_aforismos_v1', JSON.stringify(aforismos));
      if(typeof renderAforismos === 'function') renderAforismos();
      if(typeof showToast === 'function') showToast('Aforismo eliminado');
    }catch(e){ console.warn(e); }
  }

  // ============================================
  // 7. RASTREO DE ACTIVIDAD (para logros y racha)
  // ============================================
  function registrarActividad(tipo){
    // Contador de lecturas
    let lecturas = parseInt(localStorage.getItem('ecos_lecturas') || '0');
    if(tipo === 'lectura'){
      lecturas++;
      localStorage.setItem('ecos_lecturas', lecturas);
      if(lecturas >= 1) desbloquearLogro('lector_curioso');
      if(lecturas >= 5) desbloquearLogro('lector_habitual');
      if(lecturas >= 20) desbloquearLogro('lector_maestro');
    }
    if(tipo === 'eco'){
      let ecos = parseInt(localStorage.getItem('ecos_ecos_escritos') || '0');
      ecos++;
      localStorage.setItem('ecos_ecos_escritos', ecos);
      if(ecos >= 1) desbloquearLogro('primer_eco');
      if(ecos >= 5) desbloquearLogro('autor_fecundo');
    }
    if(tipo === 'comentario'){
      let comentarios = parseInt(localStorage.getItem('ecos_comentarios') || '0');
      comentarios++;
      localStorage.setItem('ecos_comentarios', comentarios);
      if(comentarios >= 1) desbloquearLogro('comentarista');
    }
    if(tipo === 'mapa'){
      desbloquearLogro('explorador');
    }

    // Racha diaria
    const hoy = new Date().toISOString().slice(0,10);
    const ultimaVisita = localStorage.getItem('ecos_ultima_visita');
    const rachaActual = parseInt(localStorage.getItem('ecos_racha') || '0');
    
    if(ultimaVisita !== hoy){
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);
      const ayerStr = ayer.toISOString().slice(0,10);
      
      if(ultimaVisita === ayerStr){
        const nuevaRacha = rachaActual + 1;
        localStorage.setItem('ecos_racha', nuevaRacha);
        if(nuevaRacha >= 3) desbloquearLogro('racha_3');
        if(nuevaRacha >= 7) desbloquearLogro('racha_7');
      } else {
        localStorage.setItem('ecos_racha', '1');
      }
      localStorage.setItem('ecos_ultima_visita', hoy);
    }

    // Logro nocturno
    const hora = new Date().getHours();
    if(hora >= 0 && hora < 5 && tipo === 'lectura'){
      desbloquearLogro('nocturno');
    }
  }

  // ============================================
  // 8. INYECCIÓN DE BOTONES EN EL LECTOR
  // ============================================
  function inyectarBotonesEnLector(){
    const readerActions = document.getElementById('readerActions');
    if(!readerActions) return;
    if(readerActions.dataset.extended === 'true') return;
    readerActions.dataset.extended = 'true';

    // Botón Modo Zen
    const btnZen = document.createElement('button');
    btnZen.className = 'action-btn';
    btnZen.innerHTML = '🧘 Modo Zen';
    btnZen.onclick = (e) => { e.stopPropagation(); toggleModoZen(); };
    readerActions.appendChild(btnZen);

    // Botón TTS
    const btnTTS = document.createElement('button');
    btnTTS.className = 'action-btn';
    btnTTS.innerHTML = '🔊 Escuchar';
    btnTTS.onclick = (e) => { e.stopPropagation(); toggleTTS(); };
    readerActions.appendChild(btnTTS);
  }

  // Observar cuando se abre el reader para inyectar botones
  const observer = new MutationObserver(() => {
    const readerOverlay = document.getElementById('readerOverlay');
    if(readerOverlay && readerOverlay.classList.contains('show')){
      setTimeout(inyectarBotonesEnLector, 100);
      registrarActividad('lectura');
    } else {
      // Detener TTS al cerrar
      if(ttsActivo && 'speechSynthesis' in window){
        window.speechSynthesis.cancel();
        ttsActivo = false;
      }
      // Quitar modo zen
      const modal = document.querySelector('#readerOverlay .modal');
      if(modal) modal.classList.remove('zen-mode');
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  // ============================================
  // 9. REEMPLAZAR "COMPARTIR" POR VERSIÓN IMAGEN
  // ============================================
  // Interceptar cuando se llame a sharePost
  const origSharePost = window.sharePost;
  window.sharePost = function(id){
    const post = (typeof posts !== 'undefined' ? posts : []).find(p => p.id === id);
    if(!post) return;
    
    // Menú simple de opciones
    const opcion = confirm('¿Compartir como imagen? (Cancelar = copiar texto)');
    if(opcion){
      const aforismo = (typeof aforismos !== 'undefined' ? aforismos : [])
        .find(a => a.sourcePostId === id);
      compartirAforismoComoImagen(aforismo ? aforismo.text : post.title, post.author);
    } else if(origSharePost){
      origSharePost(id);
    }
  };

  // ============================================
  // 10. ADMIN: BOTÓN DE BORRAR AFORISMOS
  // ============================================
  const observerAforismos = new MutationObserver(() => {
    if(typeof currentRole === 'undefined' || currentRole !== 'admin') return;
    const lista = document.getElementById('aforismosList');
    if(!lista) return;
    const items = lista.querySelectorAll('.aforismo-item');
    items.forEach((item, idx) => {
      if(item.dataset.adminBtn === 'true') return;
      item.dataset.adminBtn = 'true';
      item.style.position = 'relative';
      
      // Obtener el ID del aforismo desde el array global
      const aforismosArr = (typeof aforismos !== 'undefined' ? aforismos : []);
      const recent = aforismosArr.slice().reverse();
      const af = recent[idx];
      if(!af) return;

      const btn = document.createElement('button');
      btn.innerHTML = '✕';
      btn.title = 'Eliminar aforismo';
      btn.style.cssText = `
        position: absolute; top: 8px; right: 0;
        background: transparent; border: none;
        color: var(--text-faint); cursor: pointer;
        font-size: .85rem; padding: 2px 6px;
        border-radius: 4px; transition: all .2s;
      `;
      btn.onmouseenter = () => { btn.style.color = 'var(--danger)'; btn.style.background = 'rgba(194,91,91,.15)'; };
      btn.onmouseleave = () => { btn.style.color = 'var(--text-faint)'; btn.style.background = 'transparent'; };
      btn.onclick = (e) => { e.stopPropagation(); eliminarAforismo(af.id); };
      item.appendChild(btn);
    });
  });
  observerAforismos.observe(document.body, { childList: true, subtree: true });

  // ============================================
  // 11. ACTIVIDAD EN MAPA
  // ============================================
  document.addEventListener('click', e => {
    if(e.target && e.target.id === 'viewMap'){
      registrarActividad('mapa');
    }
  }, true);

  // ============================================
  // 12. INICIALIZACIÓN
  // ============================================
  function init(){
    aplicarModoPorHora();
    registrarActividad('visita');

    // Revisar hora cada 30 minutos
    setInterval(aplicarModoPorHora, 30 * 60 * 1000);

    // Primer logro
    setTimeout(() => desbloquearLogro('primer_paso'), 1500);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exponer funciones al scope global por si se necesitan
  window.ecosFeatures = {
    toggleModoZen,
    toggleTTS,
    compartirAforismoComoImagen,
    desbloquearLogro,
    eliminarAforismo
  };

})();