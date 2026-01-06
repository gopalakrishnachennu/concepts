/**
 * Diagram Engine - Infographic-Quality Architecture Diagrams
 * A reusable, declarative diagram renderer with animated SVG arrows
 * 
 * Usage:
 *   new DiagramRenderer('#container', config).render();
 */

// ============================================
// ICON DEFINITIONS (Lucide-style SVG paths)
// ============================================
const ICONS = {
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`,

    scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
    <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
    <path d="M7 21h10"/>
    <path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>`,

    server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
    <line x1="6" x2="6.01" y1="6" y2="6"/>
    <line x1="6" x2="6.01" y1="18" y2="18"/>
  </svg>`,

    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>`,

    database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
    <path d="M3 12A9 3 0 0 0 21 12"/>
  </svg>`,

    cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="16" height="16" x="4" y="4" rx="2"/>
    <rect width="6" height="6" x="9" y="9" rx="1"/>
    <path d="M15 2v2"/>
    <path d="M15 20v2"/>
    <path d="M2 15h2"/>
    <path d="M2 9h2"/>
    <path d="M20 15h2"/>
    <path d="M20 9h2"/>
    <path d="M9 2v2"/>
    <path d="M9 20v2"/>
  </svg>`,

    kubernetes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2v4"/>
    <path d="M12 18v4"/>
    <path d="M4.93 4.93l2.83 2.83"/>
    <path d="M16.24 16.24l2.83 2.83"/>
    <path d="M2 12h4"/>
    <path d="M18 12h4"/>
    <path d="M4.93 19.07l2.83-2.83"/>
    <path d="M16.24 7.76l2.83-2.83"/>
  </svg>`,

    cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
  </svg>`,

    network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="16" y="16" width="6" height="6" rx="1"/>
    <rect x="2" y="16" width="6" height="6" rx="1"/>
    <rect x="9" y="2" width="6" height="6" rx="1"/>
    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/>
    <path d="M12 12V8"/>
  </svg>`
};

// ============================================
// COLOR THEMES
// ============================================
const THEMES = {
    'dark-glass': {
        background: 'rgba(15, 23, 42, 0.95)',
        nodeBg: 'rgba(255, 255, 255, 0.05)',
        nodeBorder: 'rgba(255, 255, 255, 0.1)',
        nodeText: '#e2e8f0',
        highlightBg: 'rgba(56, 189, 248, 0.15)',
        highlightBorder: 'rgba(56, 189, 248, 0.5)',
        groupBorder: 'rgba(255, 255, 255, 0.15)',
        primary: '#38bdf8',
        secondary: '#a78bfa',
        async: '#22c55e',
        error: '#ef4444'
    }
};

// ============================================
// DIAGRAM RENDERER CLASS
// ============================================
class DiagramRenderer {
    constructor(containerId, config) {
        this.container = typeof containerId === 'string'
            ? document.querySelector(containerId)
            : containerId;
        this.config = config;
        this.theme = THEMES[config.theme || 'dark-glass'];
        this.nodeElements = {};
        this.edgeElements = [];
        this.svg = null;

        // Grid settings
        this.cellWidth = 200;
        this.cellHeight = 150;
        this.nodeWidth = 160;
        this.nodeHeight = 100;

        // Global offset to prevent negative coordinates for groups
        this.offsetX = 60;
        this.offsetY = 60;
    }

    // Generate unique ID
    uid() {
        return 'dia-' + Math.random().toString(36).substr(2, 9);
    }

    // Render the complete diagram
    render() {
        this.container.innerHTML = '';
        this.container.classList.add('diagram-container');

        // Create SVG layer for edges (drawn first, behind nodes)
        this.createSvgLayer();

        // Render groups (background boxes)
        if (this.config.groups) {
            this.config.groups.forEach(group => this.renderGroup(group));
        }

        // Render nodes
        this.config.nodes.forEach(node => this.renderNode(node));

        // Render edges (after nodes, so we can calculate positions)
        setTimeout(() => {
            this.config.edges.forEach(edge => this.renderEdge(edge));
            // Start animations
            this.animateEdges();
        }, 100);

        return this;
    }

    // Create SVG layer for arrows
    createSvgLayer() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.classList.add('diagram-svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.pointerEvents = 'none';
        this.svg.style.zIndex = '1';

        // Define arrow markers and gradients
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Badge gradient
        const badgeGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        badgeGradient.setAttribute('id', 'badge-gradient');
        badgeGradient.setAttribute('x1', '0%');
        badgeGradient.setAttribute('y1', '0%');
        badgeGradient.setAttribute('x2', '100%');
        badgeGradient.setAttribute('y2', '100%');
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#38bdf8');
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#0ea5e9');
        badgeGradient.appendChild(stop1);
        badgeGradient.appendChild(stop2);
        defs.appendChild(badgeGradient);

        ['primary', 'secondary', 'async', 'error'].forEach(type => {
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', `arrow-${type}`);
            marker.setAttribute('viewBox', '0 0 10 10');
            marker.setAttribute('refX', '9');
            marker.setAttribute('refY', '5');
            marker.setAttribute('markerWidth', '6');
            marker.setAttribute('markerHeight', '6');
            marker.setAttribute('orient', 'auto-start-reverse');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
            path.setAttribute('fill', this.theme[type]);

            marker.appendChild(path);
            defs.appendChild(marker);
        });

        this.svg.appendChild(defs);
        this.container.appendChild(this.svg);
    }

    // Render a group (e.g., Control Plane box)
    renderGroup(group) {
        const groupEl = document.createElement('div');
        groupEl.classList.add('diagram-group');
        groupEl.id = group.id;

        // Find bounding box of nodes in this group
        const groupNodes = this.config.nodes.filter(n => group.nodes.includes(n.id));
        if (groupNodes.length === 0) return;

        const rows = groupNodes.map(n => n.row);
        const cols = groupNodes.map(n => n.col);
        const minRow = Math.min(...rows);
        const maxRow = Math.max(...rows);
        const minCol = Math.min(...cols);
        const maxCol = Math.max(...cols);

        const padding = 40;
        groupEl.style.position = 'absolute';
        groupEl.style.left = `${(minCol - 1) * this.cellWidth - padding + this.offsetX}px`;
        groupEl.style.top = `${(minRow - 1) * this.cellHeight - padding + this.offsetY}px`;
        groupEl.style.width = `${(maxCol - minCol + 1) * this.cellWidth + padding * 2}px`;
        groupEl.style.height = `${(maxRow - minRow + 1) * this.cellHeight + padding * 2}px`;

        // Label
        const label = document.createElement('span');
        label.classList.add('diagram-group-label');
        label.textContent = group.label;
        groupEl.appendChild(label);

        this.container.appendChild(groupEl);
    }

    // Render a single node
    renderNode(node) {
        const el = document.createElement('div');
        el.classList.add('diagram-node');
        el.id = node.id;

        if (node.highlight) {
            el.classList.add('diagram-node-highlight');
        }

        // Position using grid
        el.style.position = 'absolute';
        el.style.left = `${(node.col - 1) * this.cellWidth + (this.cellWidth - this.nodeWidth) / 2 + this.offsetX}px`;
        el.style.top = `${(node.row - 1) * this.cellHeight + (this.cellHeight - this.nodeHeight) / 2 + this.offsetY}px`;
        el.style.width = `${this.nodeWidth}px`;
        el.style.height = `${this.nodeHeight}px`;

        // Icon
        const iconEl = document.createElement('div');
        iconEl.classList.add('diagram-node-icon');
        iconEl.innerHTML = ICONS[node.icon] || ICONS.server;
        el.appendChild(iconEl);

        // Label
        const labelEl = document.createElement('div');
        labelEl.classList.add('diagram-node-label');
        labelEl.textContent = node.label;
        el.appendChild(labelEl);

        // Step badges are now rendered on edges, not nodes

        this.container.appendChild(el);
        this.nodeElements[node.id] = el;
    }

    // Get center point of a node
    getNodeCenter(nodeId) {
        const el = this.nodeElements[nodeId];
        if (!el) return { x: 0, y: 0 };

        const rect = el.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        return {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2
        };
    }

    // Render an edge (arrow) between nodes
    renderEdge(edge) {
        const from = this.getNodeCenter(edge.from);
        const to = this.getNodeCenter(edge.to);

        // Calculate direction and adjust start/end points to node edges
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const angle = Math.atan2(dy, dx);

        const nodeRadius = 50; // Half of node size
        const startX = from.x + Math.cos(angle) * nodeRadius;
        const startY = from.y + Math.sin(angle) * nodeRadius;
        const endX = to.x - Math.cos(angle) * nodeRadius;
        const endY = to.y - Math.sin(angle) * nodeRadius;

        // Create path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathId = this.uid();
        path.id = pathId;
        path.classList.add('diagram-edge');
        path.classList.add(`diagram-edge-${edge.type || 'primary'}`);

        // Straight line or curve based on direction
        let d;
        if (edge.direction === 'up' || edge.direction === 'down') {
            // Vertical movement
            d = `M ${startX} ${startY} L ${endX} ${endY}`;
        } else if (Math.abs(dx) > Math.abs(dy) * 2) {
            // Horizontal movement
            d = `M ${startX} ${startY} L ${endX} ${endY}`;
        } else {
            // Curved path for diagonal
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const ctrlX = midX;
            const ctrlY = startY;
            d = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
        }

        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', this.theme[edge.type || 'primary']);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('marker-end', `url(#arrow-${edge.type || 'primary'})`);

        // Animation setup
        const length = path.getTotalLength ? path.getTotalLength() : 100;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        this.svg.appendChild(path);
        this.edgeElements.push({ path, edge, length });

        // Calculate midpoint for badge/label
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        // Add step badge at edge midpoint
        if (edge.step) {
            const badgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            badgeGroup.classList.add('edge-step-badge');

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', midX);
            circle.setAttribute('cy', midY);
            circle.setAttribute('r', '12');
            circle.setAttribute('fill', 'url(#badge-gradient)');
            circle.setAttribute('stroke', '#0f172a');
            circle.setAttribute('stroke-width', '2');

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.setAttribute('fill', '#0f172a');
            text.setAttribute('font-size', '11');
            text.setAttribute('font-weight', '700');
            text.textContent = edge.step;

            badgeGroup.appendChild(circle);
            badgeGroup.appendChild(text);
            this.svg.appendChild(badgeGroup);
        }

        // Add edge label if present
        if (edge.label) {
            const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            labelText.classList.add('diagram-edge-label');
            labelText.setAttribute('x', midX);
            labelText.setAttribute('y', midY - 20);
            labelText.setAttribute('text-anchor', 'middle');
            labelText.setAttribute('fill', this.theme.nodeText);
            labelText.setAttribute('font-size', '12');
            labelText.textContent = edge.label;
            this.svg.appendChild(labelText);
        }
    }

    // Animate all edges in sequence
    animateEdges() {
        // Sort by step number
        const sorted = [...this.edgeElements].sort((a, b) =>
            (a.edge.step || 0) - (b.edge.step || 0)
        );

        sorted.forEach((item, index) => {
            const delay = index * 400; // 400ms between each
            const duration = 600;

            setTimeout(() => {
                item.path.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                item.path.style.strokeDashoffset = '0';
            }, delay);
        });
    }

    // Public method to replay animations
    replay() {
        this.edgeElements.forEach(item => {
            item.path.style.transition = 'none';
            item.path.style.strokeDashoffset = item.length;
        });
        setTimeout(() => this.animateEdges(), 50);
    }
}

// Export for use
window.DiagramRenderer = DiagramRenderer;
window.DIAGRAM_ICONS = ICONS;
