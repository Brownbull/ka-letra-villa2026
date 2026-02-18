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
    const style = document.createElement('style');
    style.textContent = `
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
      /* Low Capacity Mode */
      .mode-lowCapacity main.content {
        font-size: 120%;
      }
      .mode-lowCapacity .sidebar {
        max-width: 200px;
      }
      .mode-lowCapacity .sidebar li {
        padding: 4px 8px;
        font-size: 12px;
      }
      /* High Capacity Mode */
      .mode-highCapacity main.content {
        font-size: 95%;
      }
      .mode-highCapacity .content table {
        font-size: 12px;
      }
      /* Simplified Mode */
      .mode-simplified .content > *:not(h1):not(blockquote):not(.status-summary):not(.critical-actions):not(.next-steps) {
        display: none;
      }
      .mode-simplified .status-summary,
      .mode-simplified .critical-actions {
        display: block !important;
        margin-bottom: 24px;
      }
      .mode-simplified .status-summary {
        background: #dcfce7;
        border: 2px solid #22c55e;
        border-radius: 12px;
        padding: 20px;
      }
      .mode-simplified .critical-actions {
        background: #fef2f2;
        border: 2px solid #dc2626;
        border-radius: 12px;
        padding: 20px;
      }
      /* Timeline Mode */
      .mode-timeline main.content > *:not(h1):not(blockquote):not(#estado-general) {
        display: none;
      }
      .mode-timeline .timeline-view {
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
    } else if (mode === 'timeline') {
      applyTimelineMode(mainContent);
    }
  };

  function applySimplifiedMode(mainContent) {
    // Create simplified view
    const simplified = `
      <div class="status-summary">
        <h2 style="color:#166534;margin-bottom:12px">Estado del Caso: BLINDADO (83/100)</h2>
        <p style="font-size:16px">El caso va muy bien. Tienes 3 acciones críticas esta semana.</p>
      </div>

      <div class="critical-actions">
        <h3 style="color:#dc2626;margin-bottom:12px">⚡ Acciones para HOY</h3>
        <ul style="list-style:none;padding:0">
          <li style="padding:8px 0;border-bottom:1px solid #fecaca">
            <strong>1.</strong> Preservar evidencia TikTok - <span style="color:#dc2626">HOY</span>
          </li>
          <li style="padding:8px 0;border-bottom:1px solid #fecaca">
            <strong>2.</strong> Certificar grabación - Esta semana
          </li>
          <li style="padding:8px 0">
            <strong>3.</strong> Contratar abogado - Esta semana
          </li>
        </ul>
      </div>

      <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:16px;margin-top:20px">
        <strong>📞 Contacto Urgente</strong>
        <p>Colegio de Abogados: +56 2 2633 6720</p>
      </div>
    `;

    if (mainContent) {
      mainContent.innerHTML = simplified;
    }
  }

  function applyTimelineMode(mainContent) {
    const timeline = `
      <div class="timeline-view" style="padding:20px">
        <h2>Línea de Tiempo del Caso</h2>

        <div style="display:flex;flex-direction:column;gap:16px;margin-top:24px">
          <div style="display:flex;align-items:center;gap:16px">
            <div style="width:40px;height:40px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold">✓</div>
            <div>
              <strong>Investigación</strong>
              <p style="color:#666;font-size:14px">Feb 2026 - Completado</p>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px">
            <div style="width:40px;height:40px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold">✓</div>
            <div>
              <strong>Estrategia</strong>
              <p style="color:#666;font-size:14px">Feb 2026 - Completado</p>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px">
            <div style="width:40px;height:40px;background:#f59e0b;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold">▶</div>
            <div>
              <strong>Acciones Críticas</strong>
              <p style="color:#f59e0b;font-size:14px">Feb 17 - En progreso</p>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px;opacity:0.5">
            <div style="width:40px;height:40px;background:#e5e7eb;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#666;font-weight:bold">4</div>
            <div>
              <strong>Medida Cautelar</strong>
              <p style="color:#666;font-size:14px">Mar 2026 - Pendiente</p>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px;opacity:0.5">
            <div style="width:40px;height:40px;background:#e5e7eb;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#666;font-weight:bold">5</div>
            <div>
              <strong>Demanda/Juicio</strong>
              <p style="color:#666;font-size:14px">May 2026 - Pendiente</p>
            </div>
          </div>
        </div>
      </div>
    `;

    if (mainContent) {
      mainContent.innerHTML = timeline;
    }
  }

  // Global function for select onchange
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
    } else if (mode === 'timeline') {
      applyTimelineMode(mainContent);
    } else if (mode === 'lowCapacity') {
      applyLowCapacityMode(mainContent);
    } else if (mode === 'highCapacity') {
      applyHighCapacityMode(mainContent);
    } else if (mode === 'cognitive') {
      applyCognitiveMode(mainContent);
    }
  };

  function applySimplifiedMode(mainContent) {
    const simplified = `
      <div class="status-summary">
        <h2 style="color:#166534;margin-bottom:12px">Estado del Caso: BLINDADO (83/100)</h2>
        <p style="font-size:16px">El caso va muy bien. Tienes 3 acciones críticas esta semana.</p>
      </div>

      <div class="critical-actions">
        <h3 style="color:#dc2626;margin-bottom:12px">⚡ Acciones para HOY</h3>
        <ul style="list-style:none;padding:0">
          <li style="padding:8px 0;border-bottom:1px solid #fecaca">
            <strong>1.</strong> Preservar evidencia TikTok - <span style="color:#dc2626">HOY</span>
          </li>
          <li style="padding:8px 0;border-bottom:1px solid #fecaca">
            <strong>2.</strong> Certificar grabación - Esta semana
          </li>
          <li style="padding:8px 0">
            <strong>3.</strong> Contratar abogado - Esta semana
          </li>
        </ul>
      </div>

      <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:16px;margin-top:20px">
        <strong>📞 Contacto Urgente</strong>
        <p>Colegio de Abogados: +56 2 2633 6720</p>
      </div>
    `;

    if (mainContent) {
      mainContent.innerHTML = simplified;
    }
  }

  function applyTimelineMode(mainContent) {
    const timeline = `
      <div class="timeline-view" style="padding:20px">
        <h2>Línea de Tiempo del Caso</h2>

        <div style="display:flex;flex-direction:column;gap:16px;margin-top:24px">
          <div style="display:flex;align-items:center;gap:16px">
            <div style="width:40px;height:40px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold">✓</div>
            <div>
              <strong>Investigación</strong>
              <p style="color:#666;font-size:14px">Feb 2026 - Completado</p>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px">
            <div style="width:40px;height:40px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold">✓</div>
            <div>
              <strong>Estrategia</strong>
              <p style="color:#666;font-size:14px">Feb 2026 - Completado</p>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px">
            <div style="width:40px;height:40px;background:#f59e0b;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold">▶</div>
            <div>
              <strong>Acciones Críticas</strong>
              <p style="color:#f59e0b;font-size:14px">Feb 17 - En progreso</p>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px;opacity:0.5">
            <div style="width:40px;height:40px;background:#e5e7eb;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#666;font-weight:bold">4</div>
            <div>
              <strong>Medida Cautelar</strong>
              <p style="color:#666;font-size:14px">Mar 2026 - Pendiente</p>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:16px;opacity:0.5">
            <div style="width:40px;height:40px;background:#e5e7eb;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#666;font-weight:bold">5</div>
            <div>
              <strong>Demanda/Juicio</strong>
              <p style="color:#666;font-size:14px">May 2026 - Pendiente</p>
            </div>
          </div>
        </div>
      </div>
    `;

    if (mainContent) {
      mainContent.innerHTML = timeline;
    }
  }

  function applyLowCapacityMode(mainContent) {
    // Just add larger text - sidebar will be styled via CSS
    if (mainContent) {
      mainContent.style.fontSize = '120%';
    }
  }

  function applyHighCapacityMode(mainContent) {
    // Just add smaller text - tables will be styled via CSS
    if (mainContent) {
      mainContent.style.fontSize = '95%';
    }
  }

  function applyCognitiveMode(mainContent) {
    // Add collapsible sections
    if (mainContent) {
      const tables = mainContent.querySelectorAll('table');
      tables.forEach((table, i) => {
        const h2 = mainContent.querySelectorAll('h2')[i];
        if (h2) {
          h2.style.cursor = 'pointer';
          h2.onclick = function() {
            const next = this.nextElementSibling;
            if (next) next.style.display = next.style.display === 'none' ? 'table' : 'none';
          };
        }
      });
    }
  }

  // Initialize
  init();
})();
