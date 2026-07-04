/**
 * FrontendDocumentation.jsx
 * 
 * Interactive React component that documents and visualizes the frontend
 * architecture, file structure, data flow, and component hierarchy.
 * 
 * This component can be integrated into the app or run standalone to help
 * developers understand the codebase structure.
 * 
 * Usage:
 *   - Import into App.jsx or create a route to view it
 *   - Copy-paste styles from index.css or create a separate stylesheet
 */

import React, { useState, memo } from 'react';
import './FrontendDocumentation.css'; // See bottom for CSS

const FrontendDocumentation = memo(function FrontendDocumentation() {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    structure: true,
    components: false,
    dataFlow: false,
    animations: false,
    styling: false,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="frontend-docs">
      {/* Header */}
      <header className="docs-header">
        <h1>🍯 Frontend Documentation</h1>
        <p>Interactive guide to the Jars of Movies frontend architecture</p>
      </header>

      <div className="docs-content">
        {/* ========================================
            OVERVIEW SECTION
        ======================================== */}
        <section className="doc-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('overview')}
            aria-expanded={expandedSections.overview}
          >
            <span className="toggle-icon">
              {expandedSections.overview ? '▼' : '▶'}
            </span>
            📋 Project Overview
          </button>

          {expandedSections.overview && (
            <div className="section-content">
              <div className="info-box">
                <h3>What is Jars of Movies?</h3>
                <p>
                  An interactive React application that helps users discover movies
                  based on their mood. Users click on animated "jars" labeled with
                  moods (sad, happy, romantic, etc.), triggering a beautiful
                  paper-slip animation that reveals a random movie recommendation.
                </p>
              </div>

              <div className="tech-stack">
                <h3>Tech Stack</h3>
                <div className="stack-grid">
                  <div className="stack-item">
                    <strong>Framework:</strong> React 18.3.1
                  </div>
                  <div className="stack-item">
                    <strong>Build:</strong> Vite 5.4.2
                  </div>
                  <div className="stack-item">
                    <strong>Animation:</strong> Framer Motion 11.3.31
                  </div>
                  <div className="stack-item">
                    <strong>Effects:</strong> Canvas Confetti 1.9.3
                  </div>
                </div>
              </div>

              <div className="key-features">
                <h3>Key Features</h3>
                <ul>
                  <li>✨ Complex 3-phase animation pipeline</li>
                  <li>📱 Responsive grid layout (2→5 columns)</li>
                  <li>💾 LocalStorage persistence for custom movies</li>
                  <li>🎨 Beautiful design system with CSS variables</li>
                  <li>♿ Full accessibility support</li>
                  <li>⚡ Performance optimized with memoization</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* ========================================
            PROJECT STRUCTURE SECTION
        ======================================== */}
        <section className="doc-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('structure')}
            aria-expanded={expandedSections.structure}
          >
            <span className="toggle-icon">
              {expandedSections.structure ? '▼' : '▶'}
            </span>
            📁 Project Structure
          </button>

          {expandedSections.structure && (
            <div className="section-content">
              <FileTree />
            </div>
          )}
        </section>

        {/* ========================================
            COMPONENTS BREAKDOWN
        ======================================== */}
        <section className="doc-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('components')}
            aria-expanded={expandedSections.components}
          >
            <span className="toggle-icon">
              {expandedSections.components ? '▼' : '▶'}
            </span>
            🧩 Components Breakdown
          </button>

          {expandedSections.components && (
            <div className="section-content">
              <ComponentsBreakdown />
            </div>
          )}
        </section>

        {/* ========================================
            DATA FLOW SECTION
        ======================================== */}
        <section className="doc-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('dataFlow')}
            aria-expanded={expandedSections.dataFlow}
          >
            <span className="toggle-icon">
              {expandedSections.dataFlow ? '▼' : '▶'}
            </span>
            🔄 Data Flow & State
          </button>

          {expandedSections.dataFlow && (
            <div className="section-content">
              <DataFlowDiagram />
            </div>
          )}
        </section>

        {/* ========================================
            ANIMATION PIPELINE
        ======================================== */}
        <section className="doc-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('animations')}
            aria-expanded={expandedSections.animations}
          >
            <span className="toggle-icon">
              {expandedSections.animations ? '▼' : '▶'}
            </span>
            ✨ Animation Pipeline
          </button>

          {expandedSections.animations && (
            <div className="section-content">
              <AnimationPipeline />
            </div>
          )}
        </section>

        {/* ========================================
            STYLING & DESIGN SYSTEM
        ======================================== */}
        <section className="doc-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('styling')}
            aria-expanded={expandedSections.styling}
          >
            <span className="toggle-icon">
              {expandedSections.styling ? '▼' : '▶'}
            </span>
            🎨 Styling & Design System
          </button>

          {expandedSections.styling && (
            <div className="section-content">
              <StylingGuide />
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="docs-footer">
        <p>
          📚 For complete documentation, see FRONTEND_DOCUMENTATION.txt
        </p>
      </footer>
    </div>
  );
});

/**
 * FileTree Component
 * Displays project directory structure
 */
const FileTree = memo(function FileTree() {
  return (
    <div className="file-tree">
      <div className="tree-item tree-folder">
        📦 Jars-of-Movies/
        <div className="tree-children">
          <div className="tree-item tree-file">
            📄 index.html - HTML entry point, loads fonts
          </div>
          <div className="tree-item tree-file">
            ⚙️ vite.config.js - Vite build configuration
          </div>
          <div className="tree-item tree-file">
            📋 package.json - Dependencies &amp; scripts
          </div>

          <div className="tree-item tree-folder">
            📂 src/
            <div className="tree-children">
              <div className="tree-item tree-file">
                🚀 main.jsx - React bootstrap (mounts App)
              </div>
              <div className="tree-item tree-file">
                🎨 index.css - Global design system (colors, animations, layout)
              </div>
              <div className="tree-item tree-file">
                🏠 App.jsx - Root component (orchestrator, state management)
              </div>

              <div className="tree-item tree-folder">
                🧩 components/
                <div className="tree-children">
                  <div className="tree-item tree-file">
                    🏗️ JarGrid.jsx - Responsive grid layout
                  </div>
                  <div className="tree-item tree-file">
                    🏺 Jar.jsx - Individual jar with SVG &amp; shake animation
                  </div>
                  <div className="tree-item tree-file">
                    📜 PaperSlipAnimation.jsx - Complex 3-phase animation pipeline
                  </div>
                  <div className="tree-item tree-file">
                    ➕ AddMovieModal.jsx - Modal for adding custom movies
                  </div>
                </div>
              </div>

              <div className="tree-item tree-folder">
                🔧 hooks/
                <div className="tree-children">
                  <div className="tree-item tree-file">
                    🪝 useJarMovies.js - Jar data + localStorage management
                  </div>
                </div>
              </div>

              <div className="tree-item tree-folder">
                📊 data/
                <div className="tree-children">
                  <div className="tree-item tree-file">
                    🗃️ jars.js - Predefined mood jars &amp; movie data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * ComponentsBreakdown Component
 * Detailed breakdown of each component's responsibility
 */
const ComponentsBreakdown = memo(function ComponentsBreakdown() {
  const components = [
    {
      name: 'App.jsx',
      emoji: '🏠',
      responsibility: 'Root orchestrator',
      description:
        'Manages all state (activeJar, activeMovie, showAddModal). Handles jar clicks, modal open/close. Renders JarGrid + animation layers.',
      children: ['JarGrid', 'PaperSlipAnimation', 'AddMovieModal'],
    },
    {
      name: 'JarGrid.jsx',
      emoji: '🏗️',
      responsibility: 'Layout container',
      description:
        'Responsive CSS Grid layout for jars. Memoized to prevent re-renders when modals open. Maps jars array to Jar components.',
      children: ['Jar (×n)'],
    },
    {
      name: 'Jar.jsx',
      emoji: '🏺',
      responsibility: 'Interactive jar',
      description:
        'Renders custom SVG jar with glass effect, paper stubs, mood label. Handles hover lift &amp; click shake animations.',
      children: ['SVG'],
    },
    {
      name: 'PaperSlipAnimation.jsx',
      emoji: '✨',
      responsibility: 'Complex animation',
      description:
        'Orchestrates 3-phase animation: floating slips (0-800ms) → hero slip to center (400-1050ms) → content reveal (1050ms+). Fires confetti.',
      children: ['motion.div (×6 slips)', 'paper-card', 'overlay'],
    },
    {
      name: 'AddMovieModal.jsx',
      emoji: '➕',
      responsibility: 'Form dialog',
      description:
        'Modal for adding custom movies. Validates input, prevents duplicates. Calls addCustomMovie hook via parent callback.',
      children: ['input', 'buttons'],
    },
  ];

  return (
    <div className="components-grid">
      {components.map((comp, idx) => (
        <div key={idx} className="component-card">
          <div className="component-header">
            <span className="component-emoji">{comp.emoji}</span>
            <h4>{comp.name}</h4>
          </div>
          <div className="component-body">
            <p className="component-role">{comp.responsibility}</p>
            <p className="component-desc">{comp.description}</p>
            {comp.children && (
              <div className="component-children">
                <strong>Renders:</strong>
                <ul>
                  {comp.children.map((child, i) => (
                    <li key={i}>{child}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

/**
 * DataFlowDiagram Component
 * Visualizes how data flows through the app
 */
const DataFlowDiagram = memo(function DataFlowDiagram() {
  return (
    <div className="data-flow">
      <div className="info-box">
        <h3>State &amp; Data Flow</h3>
      </div>

      <div className="flow-diagram">
        <div className="flow-step">
          <div className="step-num">1</div>
          <div className="step-content">
            <strong>Page Load</strong>
            <p>useJarMovies reads JARS from jars.js + localStorage</p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        <div className="flow-step">
          <div className="step-num">2</div>
          <div className="step-content">
            <strong>JarGrid Renders</strong>
            <p>Displays 8-10 jars with merged (base + custom) movies</p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        <div className="flow-step">
          <div className="step-num">3</div>
          <div className="step-content">
            <strong>User Clicks Jar</strong>
            <p>Jar shakes 300ms, then calls onJarClick(jar, rect)</p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        <div className="flow-step">
          <div className="step-num">4</div>
          <div className="step-content">
            <strong>App Updates State</strong>
            <p>
              Sets activeJar, activeMovie (random), activeRect → triggers
              re-render
            </p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        <div className="flow-step">
          <div className="step-num">5</div>
          <div className="step-content">
            <strong>PaperSlipAnimation Mounts</strong>
            <p>Animation plays 1050ms total (3 phases)</p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        <div className="flow-step">
          <div className="step-num">6</div>
          <div className="step-content">
            <strong>Movie Title Revealed</strong>
            <p>
              User sees movie, mood badge, "Add Movie" button, confetti
            </p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        <div className="flow-step">
          <div className="step-num">7a</div>
          <div className="step-content">
            <strong>Add Custom Movie</strong>
            <p>AddMovieModal mounts, user enters title</p>
          </div>
        </div>

        <div className="flow-branch">
          <div className="branch-option">
            <strong>7b.1 - Submit</strong>
            <p>Validated &amp; deduplicated, written to localStorage</p>
          </div>
          <div className="branch-option">
            <strong>7b.2 - Close</strong>
            <p>Overlay clicked or close button pressed</p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        <div className="flow-step">
          <div className="step-num">8</div>
          <div className="step-content">
            <strong>Hook Re-reads Data</strong>
            <p>useJarMovies detects localStorage change, rebuilds jars list</p>
          </div>
        </div>

        <div className="flow-arrow">↓</div>

        <div className="flow-step">
          <div className="step-num">9</div>
          <div className="step-content">
            <strong>Back to Grid</strong>
            <p>App state cleared, animation unmounts, user ready for next jar</p>
          </div>
        </div>
      </div>

      <div className="state-box">
        <h3>App State Structure</h3>
        <pre>
{`{
  activeJar:    { id, mood, emoji, color, movies },
  activeRect:   { x, y, width, height },
  activeMovie:  "Movie Title",
  showAddModal: boolean
}`}
        </pre>
      </div>
    </div>
  );
});

/**
 * AnimationPipeline Component
 * Explains the complex 3-phase animation sequence
 */
const AnimationPipeline = memo(function AnimationPipeline() {
  return (
    <div className="animation-guide">
      <div className="info-box">
        <h3>3-Phase Animation Pipeline</h3>
        <p>
          Orchestrated by PaperSlipAnimation.jsx with precise timing via
          useEffect setTimeout calls
        </p>
      </div>

      <div className="animation-phases">
        <div className="phase-card">
          <div className="phase-header phase-1">
            <span className="phase-num">Phase 1</span>
            <span className="phase-name">Floating Slips</span>
          </div>
          <div className="phase-body">
            <p className="timing">⏱️ 0–800ms</p>
            <ul>
              <li>6 background paper slips spawn from jar center</li>
              <li>Each rises upward with x-drift &amp; rotation</li>
              <li>Staggered start: 80-170ms delays</li>
              <li>Opacity &amp; scale fade as they rise</li>
              <li>Disappear off-screen at ~800ms</li>
            </ul>
          </div>
        </div>

        <div className="animation-phases">
          <div className="phase-card">
            <div className="phase-header phase-2">
              <span className="phase-num">Phase 2</span>
              <span className="phase-name">Hero Slip to Center</span>
            </div>
            <div className="phase-body">
              <p className="timing">⏱️ 400–1050ms (650ms travel)</p>
              <ul>
                <li>One "hero" slip (index 0) moves to viewport center</li>
                <li>Starts at jar position with scale 0.5 (folded)</li>
                <li>Ends at center with scale 1.0 (unfolded)</li>
                <li>Follows easing curve for smooth acceleration</li>
                <li>Overlay fades in over 350ms (starts at 0ms)</li>
              </ul>
            </div>
          </div>

          <div className="phase-card">
            <div className="phase-header phase-3">
              <span className="phase-num">Phase 3</span>
              <span className="phase-name">Content Reveal</span>
            </div>
            <div className="phase-body">
              <p className="timing">⏱️ 1050ms+ (after hero slip arrives)</p>
              <ul>
                <li>Movie title fades in via paper-card component</li>
                <li>Mood badge appears</li>
                <li>Action buttons become visible</li>
                <li>Confetti animation fires (80 particles)</li>
                <li>Close hint appears at bottom</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="timing-chart">
        <h3>Timeline Visualization</h3>
        <div className="timeline">
          <div className="timeline-mark mark-0">
            <span>0ms</span>
            <span>Jar shake ends</span>
          </div>
          <div className="timeline-mark mark-400">
            <span>400ms</span>
            <span>Hero slip starts</span>
          </div>
          <div className="timeline-mark mark-1050">
            <span>1050ms</span>
            <span>Content reveals</span>
          </div>
        </div>

        <div className="timeline-bar">
          <div className="bar-phase phase-1" style={{ width: '30%' }}>
            Floating (0-300)
          </div>
          <div className="bar-phase phase-2" style={{ width: '48%' }}>
            Hero (300-1050)
          </div>
          <div className="bar-phase phase-3" style={{ width: '22%' }}>
            Content (1050+)
          </div>
        </div>
      </div>

      <div className="code-example">
        <h3>Timing Implementation</h3>
        <pre>
{`// In PaperSlipAnimation.jsx
useEffect(() => {
  // Start centering phase at 400ms
  const t1 = setTimeout(() => setPhase('centering'), 400);
  
  // Reveal content after slip reaches center
  const t2 = setTimeout(() => setPhase('revealing'), 1050);
  
  return () => { clearTimeout(t1); clearTimeout(t2); };
}, []);`}
        </pre>
      </div>
    </div>
  );
});

/**
 * StylingGuide Component
 * Design system colors, fonts, and patterns
 */
const StylingGuide = memo(function StylingGuide() {
  return (
    <div className="styling-guide">
      <div className="color-palette">
        <h3>Color Palette</h3>
        <div className="colors-grid">
          <div className="color-swatch">
            <div
              className="swatch"
              style={{ backgroundColor: '#f48fb1' }}
            />
            <span>Primary Pink: #f48fb1</span>
          </div>
          <div className="color-swatch">
            <div
              className="swatch"
              style={{ backgroundColor: '#ffe0b2' }}
            />
            <span>Peach: #ffe0b2</span>
          </div>
          <div className="color-swatch">
            <div
              className="swatch"
              style={{ backgroundColor: '#f3e5f5' }}
            />
            <span>Lavender: #f3e5f5</span>
          </div>
          <div className="color-swatch">
            <div
              className="swatch"
              style={{ backgroundColor: '#fffdf9' }}
              style={{ border: '1px solid #ddd' }}
            />
            <span>Cream: #fffdf9</span>
          </div>
          <div className="color-swatch">
            <div
              className="swatch"
              style={{ backgroundColor: '#4a3040' }}
            />
            <span>Dark Brown: #4a3040</span>
          </div>
          <div className="color-swatch">
            <div
              className="swatch"
              style={{ backgroundColor: '#7a5c6e' }}
            />
            <span>Mid Brown: #7a5c6e</span>
          </div>
        </div>
      </div>

      <div className="typography">
        <h3>Typography</h3>
        <div className="typo-grid">
          <div className="typo-item">
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: '2rem' }}>
              Caveat (Handwritten)
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Titles, mood labels, decorative text
            </p>
          </div>
          <div className="typo-item">
            <p style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '1rem' }}>
              Quicksand (UI)
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Buttons, inputs, body text, form labels
            </p>
          </div>
        </div>
      </div>

      <div className="spacing">
        <h3>Spacing &amp; Layout</h3>
        <ul>
          <li>
            <strong>Jar Grid:</strong> 2 cols (mobile) → 3 → 4 → 5 cols
            (desktop)
          </li>
          <li>
            <strong>Gap:</strong> 2rem (mobile) → 2.5rem (desktop)
          </li>
          <li>
            <strong>Padding:</strong> 1.5rem (mobile) → 3rem (desktop)
          </li>
          <li>
            <strong>Border Radius:</strong> 16px (jars), 999px (pills)
          </li>
          <li>
            <strong>Transitions:</strong> 0.35s cubic-bezier(0.4, 0, 0.2, 1)
          </li>
        </ul>
      </div>

      <div className="shadows">
        <h3>Shadows &amp; Depth</h3>
        <ul>
          <li>
            <strong>Soft:</strong> 4px 24px rgba(180,100,130,0.12)
          </li>
          <li>
            <strong>Hover:</strong> 12px 40px rgba(180,100,130,0.22)
          </li>
          <li>
            <strong>Card:</strong> 2px 16px rgba(140,80,110,0.10)
          </li>
        </ul>
      </div>
    </div>
  );
});

export default FrontendDocumentation;
