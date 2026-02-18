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
    // Get the top-actions area
    const topActions = document.querySelector('.top-actions');
    if (!topActions) return;

    // Store original content for later
    const mainContent = document.querySelector('main.content');
    if (mainContent) {
      originalContent = mainContent.innerHTML;
    }

    // Check for saved preference
    const savedMode = localStorage.getItem('ka-letra-view-mode');
    if (savedMode && MODES[savedMode]) {
      setTimeout(() => window.switchViewMode(savedMode), 100);
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

      /* Low Capacity Mode - Larger text, simpler */
      body.mode-lowCapacity main.content {
        font-size: 120% !important;
        line-height: 1.8 !important;
      }
      body.mode-lowCapacity main.content h2 {
        font-size: 1.5em !important;
        margin-bottom: 1em !important;
      }
      body.mode-lowCapacity main.content p {
        max-width: 60ch !important;
      }
      body.mode-lowCapacity .sidebar {
        max-width: 180px !important;
      }
      body.mode-lowCapacity .sidebar li {
        padding: 4px 6px !important;
        font-size: 11px !important;
      }

      /* High Capacity Mode - More compact */
      body.mode-highCapacity main.content {
        font-size: 90% !important;
      }
      body.mode-highCapacity main.content table {
        font-size: 11px !important;
      }
      body.mode-highCapacity main.content table td,
      body.mode-highCapacity main.content table th {
        padding: 4px 6px !important;
      }

      /* Simplified Mode - Show only essentials */
      body.mode-simplified main.content > * {
        display: none !important;
      }
      body.mode-simplified main.content > h1,
      body.mode-simplified main.content > blockquote,
      body.mode-simplified .simplified-summary {
        display: block !important;
      }
      body.mode-simplified .simplified-summary {
        background: #dcfce7 !important;
        border: 3px solid #22c55e !important;
        border-radius: 16px !important;
        padding: 24px !important;
        margin: 20px 0 !important;
      }
      body.mode-simplified .simplified-summary h2 {
        color: #166534 !important;
        font-size: 1.4em !important;
        margin-bottom: 12px !important;
      }
      body.mode-simplified .simplified-summary p {
        font-size: 1.1em !important;
        line-height: 1.6 !important;
      }

      /* Cognitive Load Mode - Collapsible sections */
      body.mode-cognitive main.content > h2 {
        cursor: pointer !important;
        padding: 8px 12px !important;
        background: #f3f4f6 !important;
        border-radius: 8px !important;
        margin-top: 16px !important;
      }
      body.mode-cognitive main.content > h2::before {
        content: "▶ " !important;
        font-size: 0.8em !important;
      }
      body.mode-cognitive main.content > h2.collapsed + * {
        display: none !important;
      }
      body.mode-cognitive main.content > h2::after {
        content: " (click to expand)" !important;
        font-size: 0.7em !important;
        color: #999 !important;
        font-weight: normal !important;
      }

      /* Attention Deficit Mode - Visual anchors */
      body.mode-attention main.content > h2::before {
        content: "📌 " !important;
      }
      body.mode-attention main.content {
        border-left: 4px solid #fbbf24 !important;
        padding-left: 16px !important;
      }

      /* Timeline Mode */
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
      return;
    }

    // Add mode class
    body.classList.add('mode-' + mode);

    // Apply mode-specific transformations
    if (mode === 'simplified') {
      applySimplifiedMode(mainContent);
    } else if (mode === 'cognitive') {
      applyCognitiveMode(mainContent);
    }
  };

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
      // Generic simplified view
      summaryContent = `
        <div class="simplified-summary">
          <h2>📄 ${pageTitle}</h2>
          <p>Página de información del caso legal.</p>
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
