/**
 * Ka-Letra Villa - Mode Switcher
 * Allows switching between different cognitive-adaptive layouts
 */

(function() {
  // Mode configurations
  const MODES = {
    original: { name: 'Original', description: 'Default layout' },
    highCapacity: { name: 'Alta Capacidad', description: 'Máxima información visible' },
    mediumCapacity: { name: 'Capacidad Media', description: 'Información estructurada' },
    lowCapacity: { name: 'Baja Capacidad', description: 'Minimal, solo essentials' },
    attention: { name: 'Déficit Atención', description: 'Anclas visuales, iconos' },
    cognitive: { name: 'Carga Cognitiva', description: 'Vía guiada, progreso' },
    simplified: { name: 'Simplificado', description: 'Resumen ultra-simple' },
    timeline: { name: 'Línea de Tiempo', description: 'Progreso visual' }
  };

  // Store original content
  let originalContent = null;
  let currentMode = 'original';

  function init() {
    // Add styles first
    addModeStyles();

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupModeSwitcher);
    } else {
      setupModeSwitcher();
    }
  }

  function setupModeSwitcher() {
    // Store original content for later
    const mainContent = document.querySelector('main.content');
    if (mainContent) {
      originalContent = mainContent.innerHTML;
    }

    // Sync all view mode dropdowns
    const viewModeSelect = document.getElementById('viewMode');
    const sidebarViewModeSelect = document.getElementById('sidebarViewMode');

    // Check for saved preference and apply immediately
    const savedMode = localStorage.getItem('ka-letra-view-mode');
    if (savedMode && MODES[savedMode]) {
      // Set dropdown values first
      if (viewModeSelect) viewModeSelect.value = savedMode;
      if (sidebarViewModeSelect) sidebarViewModeSelect.value = savedMode;
      // Then apply the mode
      setTimeout(() => {
        window.switchViewMode(savedMode);
      }, 50);
    }

    // Sync dropdowns when either changes
    if (viewModeSelect) {
      viewModeSelect.addEventListener('change', function() {
        window.switchViewMode(this.value);
      });
    }
    if (sidebarViewModeSelect) {
      sidebarViewModeSelect.addEventListener('change', function() {
        window.switchViewMode(this.value);
      });
    }
  }

  function addModeStyles() {
    // Only add if not already added
    if (document.getElementById('mode-switcher-styles')) return;

    const style = document.createElement('style');
    style.id = 'mode-switcher-styles';
    style.textContent = `
      /* Mode Switcher UI */
      .mode-switcher {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-right: 16px;
      }
      .mode-label {
        font-size: 13px;
        color: #666;
      }
      .mode-select {
        padding: 6px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 13px;
        background: #fff;
        cursor: pointer;
      }
      .mode-select:hover {
        border-color: #4a9eff;
      }

      /* ==================== LOW CAPACITY MODE ==================== */
      /* Dramatically larger text for readability */
      body.mode-lowCapacity main.content {
        font-size: 150% !important;
        line-height: 2.0 !important;
      }
      body.mode-lowCapacity main.content h1 {
        font-size: 2em !important;
      }
      body.mode-lowCapacity main.content h2 {
        font-size: 1.6em !important;
        color: #1e40af !important;
        margin-top: 1.5em !important;
        border-bottom: 3px solid #3b82f6 !important;
        padding-bottom: 0.3em !important;
      }
      body.mode-lowCapacity main.content h3 {
        font-size: 1.3em !important;
        color: #1e40af !important;
      }
      body.mode-lowCapacity main.content p {
        max-width: 50ch !important;
        font-size: 1.1em !important;
      }
      body.mode-lowCapacity main.content li {
        font-size: 1.05em !important;
        margin-bottom: 0.5em !important;
      }
      body.mode-lowCapacity main.content table {
        font-size: 110% !important;
      }
      body.mode-lowCapacity .sidebar {
        max-width: 160px !important;
      }
      body.mode-lowCapacity .sidebar > *:not(.sidebar-mode-switcher) {
        display: none !important;
      }
      body.mode-lowCapacity .sidebar-mode-switcher {
        display: block !important;
      }
      /* Show only critical nav items */
      body.mode-lowCapacity .sidebar li a[href*="PANEL"],
      body.mode-lowCapacity .sidebar li a[href*="CASE"],
      body.mode-lowCapacity .sidebar li a[href*="strength"] {
        display: block !important;
      }

      /* ==================== HIGH CAPACITY MODE ==================== */
      /* More compact, all information visible */
      body.mode-highCapacity main.content {
        font-size: 75% !important;
        line-height: 1.3 !important;
      }
      body.mode-highCapacity main.content h2 {
        font-size: 1em !important;
        margin: 0.5em 0 !important;
      }
      body.mode-highCapacity main.content p {
        margin: 0.3em 0 !important;
      }
      body.mode-highCapacity main.content table {
        font-size: 70% !important;
      }
      body.mode-highCapacity main.content table td,
      body.mode-highCapacity main.content table th {
        padding: 2px 4px !important;
      }
      /* Expand sidebar to show more */
      body.mode-highCapacity .sidebar {
        max-width: 320px !important;
      }

      /* ==================== SIMPLIFIED MODE ==================== */
      /* Show only essentials with big summary */
      body.mode-simplified main.content > * {
        display: none !important;
      }
      body.mode-simplified main.content > h1,
      body.mode-simplified main.content > blockquote,
      body.mode-simplified .simplified-summary {
        display: block !important;
      }
      body.mode-simplified .simplified-summary {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%) !important;
        border: 4px solid #22c55e !important;
        border-radius: 20px !important;
        padding: 32px !important;
        margin: 24px 0 !important;
        font-size: 130% !important;
      }
      body.mode-simplified .simplified-summary h2 {
        color: #166534 !important;
        font-size: 1.5em !important;
        margin-bottom: 16px !important;
        border: none !important;
      }
      body.mode-simplified .simplified-summary p {
        font-size: 1.2em !important;
        line-height: 1.6 !important;
      }

      /* ==================== COGNITIVE LOAD MODE ==================== */
      /* Collapsible sections with progress indicator */
      body.mode-cognitive main.content > h2 {
        cursor: pointer !important;
        padding: 12px 16px !important;
        background: linear-gradient(90deg, #f0f9ff, #e0f2fe) !important;
        border-radius: 10px !important;
        margin-top: 20px !important;
        border-left: 5px solid #0ea5e9 !important;
        transition: all 0.3s ease !important;
      }
      body.mode-cognitive main.content > h2:hover {
        background: linear-gradient(90deg, #e0f2fe, #bae6fd) !important;
        transform: translateX(5px) !important;
      }
      body.mode-cognitive main.content > h2::before {
        content: "📖 " !important;
        font-size: 1.2em !important;
      }
      body.mode-cognitive main.content > h2.collapsed + * {
        display: none !important;
      }
      body.mode-cognitive main.content > h2::after {
        content: " (click para " + (document.querySelector('body.mode-cognitive main.content > h2.collapsed') ? 'ver más' : 'ocultar') + ")" !important;
        font-size: 0.7em !important;
        color: #64748b !important;
        font-weight: normal !important;
      }
      /* Add progress bar at top */
      body.mode-cognitive::before {
        content: "Modo: Carga Cognitiva - Click en secciones para expandir/colapsar" !important;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #0ea5e9;
        color: white;
        padding: 8px;
        text-align: center;
        font-weight: bold;
        z-index: 10000;
      }

      /* ==================== ATTENTION DEFICIT MODE ==================== */
      /* Visual anchors, icons, color coding everywhere */
      body.mode-attention main.content > h2::before {
        content: "🔔 " !important;
        font-size: 1.3em !important;
      }
      body.mode-attention main.content {
        border-left: 6px solid #fbbf24 !important;
        padding-left: 20px !important;
      }
      /* Highlight key paragraphs */
      body.mode-attention main.content p:has(strong) {
        background: #fef9c3 !important;
        padding: 8px 12px !important;
        border-radius: 8px !important;
        border-left: 4px solid #eab308 !important;
      }
      /* Add floating attention indicator */
      body.mode-attention::after {
        content: "✨ Modo Atención - Información destacada en amarillo" !important;
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #fbbf24;
        color: #000;
        padding: 12px 20px;
        border-radius: 30px;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(251, 191, 36, 0.4);
        z-index: 10000;
      }

      /* ==================== TIMELINE MODE ==================== */
      body.mode-timeline .timeline-view {
        display: block !important;
      }
    `;
    document.head.appendChild(style);
  }

  window.switchViewMode = function(mode) {
    currentMode = mode;
    localStorage.setItem('ka-letra-view-mode', mode);

    const mainContent = document.querySelector('main.content');
    const body = document.body;

    // Remove all mode classes
    Object.keys(MODES).forEach(m => body.classList.remove('mode-' + m));

    if (mode === 'original') {
      // Restore original
      if (mainContent && originalContent) {
        mainContent.innerHTML = originalContent;
      }
      // Update dropdowns
      syncDropdowns(mode);
      return;
    }

    // Add mode class
    body.classList.add('mode-' + mode);

    // Update dropdowns to reflect current mode
    syncDropdowns(mode);

    // Apply mode-specific transformations
    if (mode === 'simplified') {
      applySimplifiedMode(mainContent);
    } else if (mode === 'cognitive') {
      applyCognitiveMode(mainContent);
    }
  };

  function syncDropdowns(mode) {
    const viewModeSelect = document.getElementById('viewMode');
    const sidebarViewModeSelect = document.getElementById('sidebarViewMode');
    if (viewModeSelect) viewModeSelect.value = mode;
    if (sidebarViewModeSelect) sidebarViewModeSelect.value = mode;
  }

  function applySimplifiedMode(mainContent) {
    if (!mainContent) return;

    // Get page title
    const h1 = mainContent.querySelector('h1');
    const pageTitle = h1 ? h1.textContent : 'Caso Legal';

    // Create simplified summary based on page
    let summaryContent = '';

    if (pageTitle.includes('PANEL') || pageTitle.includes('Control')) {
      summaryContent = `
        <div class="simplified-summary">
          <h2>📊 Estado: BLINDADO (83/100)</h2>
          <p>El caso va muy bien. Tienes <strong>3 acciones críticas</strong> esta semana.</p>
          <ul style="margin-top:16px;padding-left:20px">
            <li>🎯 <strong>HOY:</strong> Preservar evidencia TikTok</li>
            <li>📅 <strong>Esta semana:</strong> Certificar grabación</li>
            <li>📅 <strong>Esta semana:</strong> Contratar abogado</li>
          </ul>
        </div>
      `;
    } else if (pageTitle.includes('TEORÍA') || pageTitle.includes('CASO')) {
      summaryContent = `
        <div class="simplified-summary">
          <h2>📋 Resumen de la Demanda</h2>
          <p>Demanda por negligencia contadora. La parte demandada cometió errores en la declaración de impuestos.</p>
          <p style="margin-top:12px"><strong>Monto:</strong> $24-27 millones CLP</p>
        </div>
      `;
    } else if (pageTitle.includes('STRENGTH') || pageTitle.includes('FORTALEZA')) {
      summaryContent = `
        <div class="simplified-summary">
          <h2>📈 Fortaleza del Caso: 83/100</h2>
          <p>El caso está <strong>muy bien fundamentado</strong>.</p>
          <ul style="margin-top:16px;padding-left:20px">
            <li>✅ Evidencia sólida</li>
            <li>✅ Jurisprudencia favorable</li>
            <li>✅ Documentación completa</li>
          </ul>
        </div>
      `;
    } else {
      // Generic simplified view - extract first paragraph
      const firstP = mainContent.querySelector('p');
      summaryContent = `
        <div class="simplified-summary">
          <h2>📄 ${pageTitle}</h2>
          <p>${firstP ? firstP.textContent.substring(0, 200) + '...' : 'Página de información del caso legal.'}</p>
        </div>
      `;
    }

    // Hide everything except h1, blockquote, and add summary
    const existingSummary = mainContent.querySelector('.simplified-summary');
    if (!existingSummary) {
      mainContent.insertAdjacentHTML('afterbegin', summaryContent);
    }
  }

  function applyCognitiveMode(mainContent) {
    if (!mainContent) return;

    // Make h2 sections collapsible
    const h2s = mainContent.querySelectorAll('h2');
    h2s.forEach((h2, index) => {
      h2.classList.add('collapsed');
      h2.onclick = function() {
        this.classList.toggle('collapsed');
      };
    });
  }

  // Initialize
  init();
})();
