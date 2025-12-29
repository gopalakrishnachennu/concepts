/**
 * Kubernetes Deep Dive - Application Logic
 * Advanced Learning Platform with Dynamic Content Loading
 */

// ============================================
// SIDEBAR FUNCTIONS
// ============================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function toggleSection(element) {
    const section = element.parentElement;
    section.classList.toggle('collapsed');
}

// ============================================
// CONTENT LOADING
// ============================================
function loadContent(contentId) {
    const heroSection = document.getElementById('hero');
    const contentContainer = document.getElementById('content-container');

    // Hide hero, show content
    heroSection.style.display = 'none';
    contentContainer.style.display = 'block';

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(contentId)) {
            link.classList.add('active');
        }
    });

    // Load content based on ID
    const content = getContent(contentId);
    contentContainer.innerHTML = content;

    // Initialize diagrams if DiagramRenderer is available
    setTimeout(() => initDiagrams(), 200);

    // Scroll to top
    window.scrollTo(0, 0);

    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// Initialize any diagrams on the page
function initDiagrams() {
    // API Server Diagram
    const apiDiagramContainer = document.getElementById('api-server-diagram');
    if (apiDiagramContainer && window.DiagramRenderer && !apiDiagramContainer.querySelector('.diagram-node')) {
        const config = {
            theme: 'dark-glass',
            nodes: [
                { id: 'user', label: 'User', icon: 'user', row: 1, col: 2 },
                { id: 'lb', label: 'Load Balancer', icon: 'scale', row: 2, col: 2 },
                { id: 'auth', label: 'Auth', icon: 'shield', row: 3, col: 1 },
                { id: 'api', label: 'API Server', icon: 'kubernetes', row: 3, col: 2, highlight: true },
                { id: 'etcd', label: 'etcd', icon: 'database', row: 3, col: 3 },
                { id: 'scheduler', label: 'Scheduler', icon: 'cpu', row: 4, col: 2 }
            ],
            edges: [
                { from: 'user', to: 'lb', type: 'primary', step: 1 },
                { from: 'lb', to: 'api', type: 'primary', step: 2 },
                { from: 'api', to: 'auth', type: 'secondary', step: 3, bidirectional: true },
                { from: 'api', to: 'etcd', type: 'primary', step: 4 },
                { from: 'scheduler', to: 'api', type: 'async', step: 5, direction: 'up' }
            ],
            groups: [
                { id: 'control-plane', label: 'Control Plane', nodes: ['auth', 'api', 'etcd', 'scheduler'] }
            ]
        };
        const diagram = new DiagramRenderer('#api-server-diagram', config);
        diagram.render();

        // Add replay button
        const btn = document.createElement('button');
        btn.className = 'diagram-replay-btn';
        btn.textContent = '↻ Replay Animation';
        btn.onclick = () => diagram.replay();
        apiDiagramContainer.appendChild(btn);
    }
}

// ============================================
// CONTENT DEFINITIONS
// ============================================
function getContent(id) {
    const contents = {
        // ========================
        // CONTROL PLANE
        // ========================
        'api-server': `
            <div class="content-card">
                <h2><span class="icon">📡</span> API Server (kube-apiserver)</h2>
                <p>The API Server is the <strong>central nervous system</strong> of Kubernetes. It is the only component that directly communicates with etcd and serves as the front door for all cluster operations.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What exactly is the API Server?</strong> Think of it like the receptionist at a five-star hotel. When you (whether it's kubectl, dashboard, or any controller) want to do something in the cluster — create a pod, scale a deployment, check status — you don't go directly to etcd or the scheduler. You must speak to the API Server first!</p>
                    <p>The API Server performs three critical tasks: <strong>Authentication</strong> (Who are you?), <strong>Authorization</strong> (Are you allowed to do this?), and <strong>Admission Control</strong> (Is this request valid, or does it need modification?).</p>
                    <p>Without the API Server, nothing works. It's like the brain receiving signals — every single communication in the cluster passes through it.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏢</span>
                            <span class="use-case-title">When It's Useful</span>
                        </div>
                        <div class="use-case-desc">Every single operation in Kubernetes! Whether you're doing <code>kubectl apply</code>, checking logs, or scaling — everything goes through API Server.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔒</span>
                            <span class="use-case-title">Security Gate</span>
                        </div>
                        <div class="use-case-desc">Enforces RBAC policies, validates all requests, and ensures only authorized users can make changes to the cluster.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔌</span>
                            <span class="use-case-title">Extension Point</span>
                        </div>
                        <div class="use-case-desc">Admission webhooks allow you to inject sidecars (like Istio), enforce policies (OPA Gatekeeper), or modify requests automatically.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: E-commerce Platform</div>
                    <p>Imagine you're running Flipkart or Amazon-like application on Kubernetes:</p>
                    <ul>
                        <li><strong>DevOps team</strong> does <code>kubectl apply -f deployment.yaml</code> → API Server validates the YAML, checks RBAC, runs admission controllers (maybe inject resource limits automatically), then saves to etcd</li>
                        <li><strong>Monitoring tool</strong> (like Prometheus) watches pods → API Server provides watch stream, pushing updates instantly when pods change</li>
                        <li><strong>Auto-scaler</strong> wants to scale pods → Sends PATCH request to API Server, which validates and persists the change</li>
                    </ul>
                </div>

                <h3>Visual Architecture Diagram v3</h3>
                <div id="api-server-diagram" style="min-height: 550px;"></div>


                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: The API Gateway</div>
                    <p>Every interaction with the cluster—whether from kubectl, the dashboard, or internal components—goes through the API Server. It acts as a RESTful interface that validates and configures data for API objects.</p>
                </div>

                <h3>Request Processing Pipeline</h3>
                <div class="animation-container" style="text-align: center; background: none; border: none;">
                    <img src="Images/kubernetes_flow.gif" alt="Kubernetes Request Flow" style="max-width: 100%; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.4);">
                </div>

                <h3>1. Authentication Phase</h3>
                <p>The API Server supports multiple authentication mechanisms that run in sequence:</p>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🔑</span>
                        <div class="name">X.509 Client Certs</div>
                        <div class="desc">TLS certificates signed by cluster CA</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🎫</span>
                        <div class="name">Bearer Tokens</div>
                        <div class="desc">Static tokens or ServiceAccount tokens</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🌐</span>
                        <div class="name">OIDC Tokens</div>
                        <div class="desc">Integration with identity providers</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔌</span>
                        <div class="name">Webhook Token</div>
                        <div class="desc">External authentication service</div>
                    </div>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Authentication Chain</div>
                    <p>Authentication plugins are evaluated in order. The first plugin to successfully authenticate the request wins. If all plugins fail, the request is rejected with 401 Unauthorized.</p>
                </div>

                <h3>2. Authorization Phase</h3>
                <p>Once authenticated, the API Server checks if the user can perform the requested action:</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Authorization Decision</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>User: developer@company.com
Verb: create
Resource: pods
Namespace: production
API Group: ""

Decision: RBAC → Check RoleBindings → Allow/Deny</pre>
                </div>

                <h3>3. Admission Controllers</h3>
                <p>These are plugins that intercept requests <strong>after</strong> authentication and authorization, but <strong>before</strong> persistence:</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Purpose</th>
                                <th>Examples</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Mutating</span></td>
                                <td>Modifies the request object</td>
                                <td>Inject sidecar, set defaults</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Validating</span></td>
                                <td>Validates without modification</td>
                                <td>Enforce policies, check quotas</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What happens when you run kubectl apply?" — Walk through the entire flow: kubectl sends HTTPS request → API Server authenticates (checks certificate/token) → authorizes (RBAC check) → runs mutating webhooks → runs validating webhooks → persists to etcd → returns success response.</p>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Webhook Admission</div>
                    <p>MutatingAdmissionWebhook and ValidatingAdmissionWebhook allow you to integrate external services. For example, a service mesh can inject sidecar proxies automatically!</p>
                </div>

                <h3>API Versioning - The Library Analogy</h3>
                <div class="real-world-box">
                    <div class="real-world-header">📚 The Public Library Analogy</div>
                    <p>Imagine the Kubernetes API Server is like a really big <strong>Public Library</strong>. To find a book, you need to know exactly which section and shelf to look at using these paths:</p>
                    
                    <h4>1. The "Main Section" (/api/v1)</h4>
                    <p><strong>Analogy: The "Bread and Milk" Aisle</strong></p>
                    <p>This is the main room. It contains the most basic and important things everyone uses constantly, like Pods and Services.</p>

                    <h4>2. The "Specialty Sections" (/apis/...)</h4>
                    <p>As the library got too big, they built new rooms (Groups) for specific topics:</p>
                    <ul>
                        <li><strong>/apis/apps/v1</strong> (Frozen Dinners Aisle): Complete meals ready to go, like Deployments or StatefulSets.</li>
                        <li><strong>/apis/batch/v1</strong> (Cleaning Supplies Aisle): Tools for specific chores like Jobs and CronJobs.</li>
                        <li><strong>/apis/networking.k8s.io/v1</strong> (Telephone Section): Help different parts talk to each other (Ingress).</li>
                    </ul>

                    <h4>3. What does "v1" mean?</h4>
                    <p><strong>v1</strong> = Version 1. It is a stamp of approval meaning "Finished, safe, and ready to use."</p>
                    <p><strong>v1beta1</strong> = "We are still testing this, it might break!"</p>
                    <p><strong>Why?</strong> Creating new versions allows old "maps" (your scripts) to still find books even if the library adds new rooms.</p>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">API Paths</span>
                    </div>
                    <pre>/api/v1                  # Core (Bread & Milk)
/apis/apps/v1            # Apps (Frozen Dinners)
/apis/batch/v1           # Batch (Cleaning Supplies)</pre>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 The "AAA-P" Guard Analogy</div>
                    <p>Imagine you are trying to get into a <strong>Super Secret Treehouse Club</strong>. The Guard (API Server) follows 4 strict steps:</p>
                    <ol style="margin-top: 10px; margin-left: 20px;">
                        <li><strong>Authentication (Who are you?):</strong> The Guard asks for the secret password or ID badge. (Checks digital ID/Certificate).</li>
                        <li><strong>Authorization (Are you allowed?):</strong> "I know who you are... but are you actually allowed inside?" (RBAC check).</li>
                        <li><strong>Admission (Is this safe?):</strong> "Wait! Put on these clean slippers first." (Safety checks, or adding defaults).</li>
                        <li><strong>Persist (Write it down!):</strong> The Guard writes your name in the permanent Logbook (etcd).</li>
                    </ol>
                    <p style="margin-top: 10px;"><strong>Summary:</strong> You must pass A, A, A before the Guard writes P!</p>
                </div>

                <h3>Watch Mechanism - The Smart Doorbell</h3>
                <div class="real-world-box">
                    <div class="real-world-header">🔔 The "Smart Doorbell" vs "Running to the Door"</div>
                    <p>Imagine waiting for a package. You have two options:</p>
                    
                    <p><strong>1. The "Annoying" Way (Polling)</strong><br>
                    You run to the door every 10 seconds. "Is it here?" -> No. "Is it here?" -> No.<br>
                    <em>Result:</em> You get tired, and the server gets annoyed.</p>

                    <p><strong>2. The "Watch" Way (Kubernetes)</strong><br>
                    You install a Smart Doorbell (Watch). You sit on the couch doing nothing. Suddenly... <strong>DING!</strong><br>
                    Your phone says: "Update: Package is here!"</p>

                    <p><strong>Technical Reality:</strong> When you run <code>kubectl get pods --watch</code>, your computer opens a long-lived phone line to the API Server. The server says nothing until something changes, then "shouts" the update down the line instantly.</p>
                </div>

                <h3>Common Example Commands</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Check API Server health
kubectl get --raw='/healthz'

# List all API resources
kubectl api-resources

# Check API versions
kubectl api-versions

# Direct API call with curl
kubectl proxy &
curl http://localhost:8001/api/v1/namespaces/default/pods</pre>
                </div>
            </div>
        `,

        'etcd': `
            <div class="content-card">
                <h2><span class="icon">🗄️</span> etcd - The Cluster's Memory</h2>
                <p>etcd is a distributed, reliable key-value store that serves as the <strong>single source of truth</strong> for all cluster data. Without etcd, Kubernetes cannot function.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What is etcd exactly?</strong> Think of it as Kubernetes' permanent memory — like a bank's central ledger book. Every pod, service, deployment, secret — everything is stored here.</p>
                    <p>Only the API Server communicates with etcd directly; no other component can access it. It's a <em>key-value store</em> — meaning data is stored in paths like <code>/registry/pods/default/nginx</code>.</p>
                    <p><strong>Critical point:</strong> etcd uses the <em>Raft consensus algorithm</em> — this means if you have 3 nodes and 1 goes down, the cluster still works. But if 2 go down, the cluster stops functioning (quorum failure).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💾</span>
                            <span class="use-case-title">Cluster State Storage</span>
                        </div>
                        <div class="use-case-desc">Every object you create (pod, deployment, service) gets stored here. When you <code>kubectl get pods</code>, data is fetched from etcd via API Server.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔒</span>
                            <span class="use-case-title">Secrets Storage</span>
                        </div>
                        <div class="use-case-desc">All Kubernetes secrets are stored here. Should be encrypted at rest for production clusters.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🎯</span>
                            <span class="use-case-title">Leader Election</span>
                        </div>
                        <div class="use-case-desc">Components like controller-manager use etcd for leader election. Only one leader handles work at a time.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Bank System Comparison</div>
                    <p>Imagine etcd as a bank's central ledger system:</p>
                    <ul>
                        <li><strong>Leader node</strong> = Main branch where transactions are recorded first</li>
                        <li><strong>Follower nodes</strong> = Other branches that get copies of the ledger</li>
                        <li><strong>Quorum</strong> = At least 2 out of 3 branches must agree before transaction is confirmed</li>
                        <li><strong>Backup (snapshot)</strong> = Daily backup of ledger — critical for disaster recovery!</li>
                    </ul>
                    <p style="margin-top: 15px;"><strong>Production tip:</strong> Always run odd number of etcd nodes (3 or 5). Even number (like 4) doesn't give you any extra fault tolerance over 3!</p>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 etcd Cluster with Raft Consensus</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                           <span class="highlight">ETCD CLUSTER (3 NODES)</span>                         │
└──────────────────────────────────────────────────────────────────────────┘

        ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
        │ <span class="success">etcd-1</span>       │     │ <span class="warning">etcd-2</span>       │     │ <span class="warning">etcd-3</span>       │
        │ <span class="success">(LEADER)</span>     │     │ (FOLLOWER)   │     │ (FOLLOWER)   │
        │              │     │              │     │              │
        │  ┌────────┐  │     │  ┌────────┐  │     │  ┌────────┐  │
        │  │  WAL   │  │     │  │  WAL   │  │     │  │  WAL   │  │
        │  │  Log   │  │     │  │  Log   │  │     │  │  Log   │  │
        │  └────────┘  │     │  └────────┘  │     │  └────────┘  │
        │  ┌────────┐  │     │  ┌────────┐  │     │  ┌────────┐  │
        │  │ State  │  │     │  │ State  │  │     │  │ State  │  │
        │  │Machine │  │     │  │Machine │  │     │  │Machine │  │
        │  └────────┘  │     │  └────────┘  │     │  └────────┘  │
        └──────┬───────┘     └───────┬──────┘     └───────┬──────┘
               │                     │                     │
               └─────────────────────┼─────────────────────┘
                                     │
                          <span class="ascii-flow">──────────▼──────────</span>
                          │   <span class="highlight">REPLICATION</span>   │
                          │   (Raft Protocol)  │
                                     │
                          ┌──────────┴──────────┐
                          │   <span class="success">QUORUM: 2 of 3</span>    │
                          │   (Majority must    │
                          │    agree for write) │
                          └─────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Why 3 or 5 nodes for etcd?" — Because Raft needs quorum (majority). 3 nodes = tolerate 1 failure (2/3 quorum). 5 nodes = tolerate 2 failures (3/5 quorum). 4 nodes still only tolerates 1 failure (needs 3/4), so no benefit over 3!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember etcd as <strong>"Everyone's Truth Center Database"</strong> — the single source of truth that every component relies on!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Why etcd?</div>
                    <p>etcd provides strong consistency guarantees using the Raft consensus algorithm. It ensures that even if nodes fail, the cluster state remains consistent and available.</p>
                </div>

                <h3>What etcd Stores</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📋</span>
                        <div class="name">Cluster State</div>
                        <div class="desc">All objects (Pods, Deployments, Services)</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔐</span>
                        <div class="name">Secrets</div>
                        <div class="desc">Sensitive data (encrypted at rest)</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⚙️</span>
                        <div class="name">ConfigMaps</div>
                        <div class="desc">Application configuration</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📊</span>
                        <div class="name">Leases</div>
                        <div class="desc">Leader election, node heartbeats</div>
                    </div>
                </div>

                <h3>Key Structure</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">etcd Key Hierarchy</span>
                    </div>
                    <pre>/registry/
├── pods/
│   └── default/
│       └── nginx-pod           → Pod JSON
├── deployments/
│   └── default/
│       └── my-app              → Deployment JSON
├── secrets/
│   └── default/
│       └── db-credentials      → Secret JSON (encrypted)
└── services/
    └── default/
        └── my-service          → Service JSON</pre>
                </div>

                <h3>Raft Consensus Algorithm</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Raft Consensus Flow</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📝</span> Client sends write to Leader</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📨</span> Leader appends to WAL (Write-Ahead Log)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔄</span> Leader replicates to Followers</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>✅</span> Quorum (majority) acknowledges</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>💾</span> Entry committed to state machine</div>
                    </div>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Quorum</div>
                    <p>For a cluster of N nodes, a quorum requires (N/2)+1 nodes. A 3-node cluster tolerates 1 failure. A 5-node cluster tolerates 2 failures. This is why etcd clusters should have an odd number of nodes!</p>
                </div>

                <h3>Leader Election</h3>
                <p>etcd nodes elect a leader through Raft. Only the leader handles writes; followers replicate:</p>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Responsibility</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Leader</span></td>
                                <td>Handles all write requests, replicates to followers</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Follower</span></td>
                                <td>Replicates leader's log, can serve reads</td>
                                <td>N-1</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Candidate</span></td>
                                <td>Node requesting votes during election</td>
                                <td>Transient</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Security Best Practices</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔐 Critical Security</div>
                    <ul style="color: var(--text-secondary); line-height: 2;">
                        <li><strong>Encryption at Rest:</strong> Enable --encryption-provider-config for secrets</li>
                        <li><strong>mTLS:</strong> All etcd communication should use mutual TLS</li>
                        <li><strong>Firewall:</strong> Restrict etcd ports (2379, 2380) to control plane only</li>
                        <li><strong>Backup:</strong> Regular snapshots with etcdctl snapshot save</li>
                    </ul>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Create etcd snapshot
etcdctl snapshot save /backup/etcd-snapshot.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify snapshot
etcdctl snapshot status /backup/etcd-snapshot.db</pre>
                </div>
            </div>
        `,

        'scheduler': `
            <div class="content-card">
                <h2><span class="icon">🎯</span> Scheduler (kube-scheduler)</h2>
                <p>The Scheduler is the <strong>"matchmaker"</strong> of Kubernetes. It watches for newly created Pods that have no assigned Node and selects the optimal Node for them to run on.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What does the Scheduler do?</strong> When you create a pod, it needs to run on some node, correct? The Scheduler is the one who decides exactly which node — "This pod will run on this particular node!"</p>
                    <p>It works like a matchmaking service for pods — check the pod's requirements (CPU, memory, affinity), check each node's capacity, and find the best match!</p>
                    <p><strong>Two phases:</strong> First, <em>Filter</em> (remove unsuitable nodes), then <em>Score</em> (rank the remaining nodes). The highest scoring node wins!</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚖️</span>
                            <span class="use-case-title">Resource Optimization</span>
                        </div>
                        <div class="use-case-desc">Scheduler ensures pods are spread across nodes efficiently, not all crammed into one node while others are idle.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔗</span>
                            <span class="use-case-title">Affinity Rules</span>
                        </div>
                        <div class="use-case-desc">Want frontend and backend pods on same node for low latency? Or keep replicas on different nodes for HA? Scheduler handles it!</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🎯</span>
                            <span class="use-case-title">GPU/Special Hardware</span>
                        </div>
                        <div class="use-case-desc">ML workloads need GPU? Scheduler finds nodes with available GPUs using node labels and selectors.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Food Delivery App</div>
                    <p>Imagine you're running Swiggy/Zomato-like application:</p>
                    <ul>
                        <li><strong>Order service pods</strong> need high CPU → Scheduler finds nodes with enough CPU allocatable</li>
                        <li><strong>Database pods</strong> need SSD storage → Scheduler checks node labels for <code>disktype=ssd</code></li>
                        <li><strong>Multiple replicas</strong> of same service → Anti-affinity spreads them across different nodes (if one node fails, other replicas survive!)</li>
                        <li><strong>Regional pods</strong> → Topology spread constraints ensure pods are distributed across availability zones</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Scheduler Decision Flow</div>
                    <div class="ascii-content">
┌─────────────────────────────────────────────────────────────────────────────┐
│                        <span class="highlight">SCHEDULER WORKFLOW</span>                                   │
└─────────────────────────────────────────────────────────────────────────────┘

   [NEW POD]                                                    
       │                                                        
       ▼                                                        
┌─────────────────┐    Available Nodes: [node-1, node-2, node-3, node-4, node-5]
│  <span class="warning">FILTER PHASE</span>   │                                            
│  (Predicates)   │    ❌ node-1: Not enough CPU                 
│                 │    ❌ node-4: Has taint pod can't tolerate   
└────────┬────────┘    ✅ node-2, node-3, node-5 pass filters    
         │                                                       
         ▼                                                       
┌─────────────────┐    Scoring:                                  
│  <span class="success">SCORE PHASE</span>    │    📊 node-2: 75/100 (less resources)       
│  (Priorities)   │    📊 node-3: 82/100 (has cached image)      
│                 │    📊 node-5: 68/100 (already has many pods) 
└────────┬────────┘                                              
         │                                                       
         ▼                                                       
┌─────────────────┐                                              
│  <span class="highlight">SELECT WINNER</span>   │    🏆 node-3 WINS with score 82!            
│                 │                                              
└────────┬────────┘                                              
         │                                                       
         ▼                                                       
┌─────────────────┐                                              
│   <span class="success">BIND TO NODE</span>   │    Pod.spec.nodeName = "node-3"            
│   (via API)     │    Update etcd via API Server               
└─────────────────┘                                              
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Pod is stuck in Pending state, how do you troubleshoot?" — First, check <code>kubectl describe pod</code> → Events section shows scheduler messages. Common reasons: insufficient resources, nodeSelector mismatch, taints without tolerations, PVC not bound.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember Scheduler as <strong>"Filter → Score → Bind"</strong> (FSB) — First filter out unsuitable nodes, then score the remaining ones, finally bind the pod to the winner!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: The Scheduling Decision</div>
                    <p>The Scheduler doesn't just pick any available node. It runs a sophisticated algorithm with filtering and scoring phases to find the best possible match for each Pod.</p>
                </div>

                <h3>Scheduling Phases</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Scheduling Pipeline</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>👁️</span> Watch: Detect unscheduled Pods</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔍</span> Filter: Remove unsuitable Nodes</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📊</span> Score: Rank remaining Nodes</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🎯</span> Select: Pick highest-scoring Node</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔗</span> Bind: Assign Pod to Node via API</div>
                    </div>
                </div>

                <h3>1. Filtering Phase (Predicates)</h3>
                <p>The Scheduler eliminates Nodes that cannot run the Pod:</p>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Filter</th>
                                <th>What It Checks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">PodFitsResources</span></td>
                                <td>Does the Node have enough CPU/Memory?</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">PodFitsHostPorts</span></td>
                                <td>Are the required host ports available?</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">CheckNodeMemoryPressure</span></td>
                                <td>Is the Node under memory pressure?</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">MatchNodeSelector</span></td>
                                <td>Does Node match Pod's nodeSelector?</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">CheckTaints</span></td>
                                <td>Does Pod tolerate Node's taints?</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>2. Scoring Phase (Priorities)</h3>
                <p>Remaining Nodes are ranked using priority functions:</p>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📉</span>
                        <div class="name">LeastRequested</div>
                        <div class="desc">Prefer nodes with more free resources</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⚖️</span>
                        <div class="name">BalancedResourceAllocation</div>
                        <div class="desc">Balance CPU/Memory usage ratio</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🖼️</span>
                        <div class="name">ImageLocality</div>
                        <div class="desc">Prefer nodes with cached images</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔄</span>
                        <div class="name">InterPodAffinity</div>
                        <div class="desc">Respect Pod affinity/anti-affinity</div>
                    </div>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Scoring Math</div>
                    <p>Each priority function scores nodes from 0-100. Scores are weighted and summed. The node with the highest total score wins. If tied, one is selected randomly.</p>
                </div>

                <h3>Advanced Scheduling Features</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Node Affinity Example
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - us-east-1a
            - us-east-1b
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        preference:
          matchExpressions:
          - key: node-type
            operator: In
            values:
            - high-memory</pre>
                </div>

                <h3>Pod Anti-Affinity</h3>
                <p>Spread replicas across failure domains:</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Ensure replicas are on different nodes
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: my-app
        topologyKey: kubernetes.io/hostname</pre>
                </div>
            </div>
        `,

        'controller-manager': `
            <div class="content-card">
                <h2><span class="icon">⚙️</span> Controller Manager (kube-controller-manager)</h2>
                <p>The Controller Manager is the <strong>"Brain"</strong> of Kubernetes. It's not just one thing—it's a single binary containing dozens of separate control loops that run forever.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Explanation</div>
                    <p>Every controller inside this manager follows the exactly same pattern. It compares the <strong>Desired State</strong> (what you asked for in YAML) with the <strong>Actual State</strong> (what is running right now).</p>
                    <p>If they don't match, it fires a function to fix it. Let's look at the code logic for the most important ones.</p>
                </div>

                <h3>1. Node Controller</h3>
                <p>Watches the health of nodes. It's the reason pods get moved when a server dies.</p>
                <div class="code-block">
                    <div class="code-header"><span class="code-lang">Micro-Logic (Pseudocode)</span></div>
                    <pre>
function monitorNodes() {
    for (node in cluster.nodes) {
        // Step 1: Check heartbeat
        timeSinceHeartbeat = now() - node.lastHeartbeatTime

        // Case A: Node is silent for 40 seconds
        if (timeSinceHeartbeat > 40 * seconds) {
            node.status.readiness = "Unknown"
            updateAPIServer(node) // Turn node red in dashboard
        }

        // Case B: Node is silent for 5 minutes (Eviction)
        if (timeSinceHeartbeat > 5 * minutes) {
            // "The node is dead. Move the workloads!"
            deleteAllPodsOnNode(node.id) 
            // Result: ReplicaSet controller notices missing pods 
            // and creates new ones on healthy nodes
        }
    }
}</pre>
                </div>

                <h3>2. ReplicaSet Controller</h3>
                <p>Accesses the API server to ensure the correct number of pods are running.</p>
                <div class="code-block">
                    <div class="code-header"><span class="code-lang">Micro-Logic (Pseudocode)</span></div>
                    <pre>
function reconcileReplicaSet(rs) {
    // Step 1: Count current pods for this ReplicaSet
    currentPods = getPods(labelSelector = rs.selector)
    desiredCount = rs.spec.replicas

    diff = currentPods.length - desiredCount

    // Case A: Too few pods (e.g., one crashed or node died)
    if (diff < 0) {
        missingCount = abs(diff)
        createPods(missingCount, rs.podTemplate)
    }
    
    // Case B: Too many pods (e.g., you scaled down)
    if (diff > 0) {
        // Kill the youngest pods first
        podsToKill = sortPodsByCreationTime(currentPods).take(diff)
        deletePods(podsToKill)
    }
}</pre>
                </div>

                <h3>3. Deployment Controller</h3>
                <p><strong>Correction:</strong> Deployments technically manage ReplicaSets, NOT Pods directly! This enables Rolling Updates.</p>
                <div class="code-block">
                    <div class="code-header"><span class="code-lang">Micro-Logic (Pseudocode)</span></div>
                    <pre>
function reconcileDeployment(deploy) {
    // When you update image from v1 to v2:
    
    // 1. Create a NEW ReplicaSet for v2
    newRS = createReplicaSet(image="v2", replicas=0)
    
    // 2. Rolling Update Logic (one by one)
    while (newRS.replicas < deploy.replicas) {
        
        // Scale UP new version
        newRS.replicas += 1
        
        // Scale DOWN old version
        oldRS.replicas -= 1
        
        // Wait for health check before continuing
        waitForPodReady(newRS)
    }
}</pre>
                </div>

                <h3>4. Endpoints Controller</h3>
                <p>Connects Services to Pods. Without this, Services don't know which IP addresses to send traffic to.</p>
                <div class="code-block">
                    <div class="code-header"><span class="code-lang">Micro-Logic (Pseudocode)</span></div>
                    <pre>
function syncService(service) {
    // 1. Find all pods matching the Service selector
    pods = getPods(selector = service.selector)
    
    healthyIPs = []
    
    for (pod in pods) {
        // Only add pods that are actually Running & Ready
        if (pod.status.phase == "Running" && pod.readinessProbe == true) {
            healthyIPs.add(pod.ipAddress)
        }
    }
    
    // 2. Update the Endpoints object (this updates kube-proxy rules)
    updateEndpointObject(service.name, healthyIPs)
}</pre>
                </div>

                <h3>5. Job Controller</h3>
                <p>Ensures a task runs to completion (like a database backup).</p>
                <div class="code-block">
                    <div class="code-header"><span class="code-lang">Micro-Logic (Pseudocode)</span></div>
                    <pre>
function monitorJob(job) {
    // Checking completion variables
    completedPods = countCompletedPods(job.selector)
    
    if (completedPods == job.spec.completions) {
        job.status.active = 0
        job.status.succeeded = 1
        job.status.conditions.add("Complete")
    } else if (activePods < job.spec.parallelism) {
        // Start more pods if we haven't reached parallelism limit
        createPod(job.template)
    }
}</pre>
                </div>

                <h3>6. ServiceAccount Controller</h3>
                <p>Simply ensures every namespace has a default identity.</p>
                <div class="code-block">
                    <div class="code-header"><span class="code-lang">Micro-Logic (Pseudocode)</span></div>
                    <pre>
function onNamespaceCreate(ns) {
    // Whenever a new namespace is created...
    if (!exists(ns, "default-token")) {
        createServiceAccount(name="default", namespace=ns)
        generateSecretToken(for="default")
    }
}</pre>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 The "Control Loop" Summary</div>
                    <p>It acts like a thermostat:</p>
                    <ul>
                        <li><strong>Thermostat (Controller):</strong> "I want room at 72°F (Desired)"</li>
                        <li><strong>Sensor (Watch):</strong> "Room is 68°F (Actual)"</li>
                        <li><strong>Action:</strong> Turn ON heater.</li>
                    </ul>
                    <p>All controllers above just do this simple check forever.</p>
                </div>
            </div>
        `,

        'ccm': `
            <div class="content-card">
                <h2><span class="icon">☁️</span> Cloud Controller Manager</h2>
                <p>The Cloud Controller Manager (CCM) embeds cloud-specific control logic, allowing Kubernetes to integrate with cloud provider APIs for nodes, routes, and load balancers.</p>

                <h3>Why Separate from Controller Manager?</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Decoupling</div>
                    <p>Before CCM, cloud code was embedded in kube-controller-manager. CCM allows cloud vendors to develop their controllers independently without modifying core Kubernetes.</p>
                </div>

                <h3>CCM Controllers</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🖥️</span>
                        <div class="name">Node Controller</div>
                        <div class="desc">Initializes nodes with cloud metadata (zone, type)</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🛤️</span>
                        <div class="name">Route Controller</div>
                        <div class="desc">Configures routes in cloud network for pod CIDR</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⚖️</span>
                        <div class="name">Service Controller</div>
                        <div class="desc">Creates cloud load balancers for type: LoadBalancer</div>
                    </div>
                </div>

                <h3>Example: LoadBalancer Service</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  type: LoadBalancer          # CCM creates cloud LB
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ What Happens Behind the Scenes</div>
                    <p>When you create a LoadBalancer service on AWS:<br>
                    1. CCM Service Controller detects new Service<br>
                    2. Calls AWS API to create an ELB/NLB<br>
                    3. Configures target group with node IPs<br>
                    4. Updates Service with external IP/hostname</p>
                </div>
            </div>
        `,

        // ========================
        // WORKER NODES
        // ========================
        'kubelet': `
            <div class="content-card">
                <h2><span class="icon">🧍</span> Kubelet - The Node Agent</h2>
                <p>The Kubelet is the primary <strong>"node agent"</strong> that runs on every worker node. It ensures containers described in PodSpecs are running and healthy.</p>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: The Bridge</div>
                    <p>Kubelet bridges the gap between the Kubernetes control plane and the actual container runtime. It translates high-level Pod specifications into low-level container operations.</p>
                </div>

                <h3>Kubelet Workflow</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Pod Sync Loop</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>👁️</span> Watch API for PodSpecs assigned to this node</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📊</span> Compare desired pods vs running pods</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📞</span> Call CRI to create/start/stop containers</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>💓</span> Run health probes (liveness/readiness)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📡</span> Report status back to API Server</div>
                    </div>
                </div>

                <h3>Container Runtime Interface (CRI)</h3>
                <p>Kubelet doesn't run containers directly. It uses the CRI to communicate with the container runtime:</p>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🐳</span>
                        <div class="name">containerd</div>
                        <div class="desc">Industry-standard runtime (default)</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔴</span>
                        <div class="name">CRI-O</div>
                        <div class="desc">Lightweight OCI runtime</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📦</span>
                        <div class="name">Docker (via cri-dockerd)</div>
                        <div class="desc">Legacy support</div>
                    </div>
                </div>

                <h3>CRI Calls</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">gRPC CRI Calls</span>
                    </div>
                    <pre>// RuntimeService
RunPodSandbox()       // Create pod network namespace
CreateContainer()     // Create container in sandbox
StartContainer()      // Start the container
StopContainer()       // Stop the container
RemoveContainer()     // Delete the container

// ImageService
PullImage()           // Pull container image
ListImages()          // List cached images
RemoveImage()         // Delete cached image</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Pod Sandbox</div>
                    <p>Before any containers start, Kubelet calls <code>RunPodSandbox()</code>. This creates a "pause" container that holds the Linux namespaces (network, IPC). All containers in the pod share these namespaces!</p>
                </div>

                <h3>Health Monitoring</h3>
                <p>Kubelet continuously monitors container health:</p>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Probe Type</th>
                                <th>Purpose</th>
                                <th>On Failure</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-green">Liveness</span></td>
                                <td>Is the container alive?</td>
                                <td>Restart container</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">Readiness</span></td>
                                <td>Is the container ready for traffic?</td>
                                <td>Remove from Service endpoints</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Startup</span></td>
                                <td>Has the container started?</td>
                                <td>Delay liveness/readiness probes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Node Status Reporting</h3>
                <p>Kubelet reports node conditions to the API Server:</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Node Conditions</span>
                    </div>
                    <pre>conditions:
- type: Ready              # Node is healthy and ready
  status: "True"
- type: MemoryPressure     # Node is low on memory
  status: "False"
- type: DiskPressure       # Node is low on disk
  status: "False"
- type: PIDPressure        # Node is low on PIDs
  status: "False"
- type: NetworkUnavailable # Node network not configured
  status: "False"</pre>
                </div>
            </div>
        `,

        'kube-proxy': `
            <div class="content-card">
                <h2><span class="icon">🔀</span> Kube-proxy - Network Traffic Manager</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>The <strong>kube-proxy</strong> is a network proxy that runs on each node in your cluster. It maintains network rules on nodes. These rules allow network communication to your Pods from network sessions inside or outside of your cluster.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Arre bhai, what does it actually do?</strong> It's the traffic cop of Kubernetes networking. When you create a Service, it gets a ClusterIP. But that IP is virtual — it doesn't exist on any interface!</p>
                    <p>Kube-proxy watches for Services and Endpoints. When it sees a Service, it writes iptables (or IPVS) rules on every node saying "If anyone tries to talk to this Service IP, forward packets to one of these Pod IPs".</p>
                    <p><strong>Key insight:</strong> Kube-proxy implements the "Service abstraction". Without it, Services wouldn't work, and you'd have to talk to pods directly by IP (which change all the time!).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚦</span>
                            <span class="use-case-title">Traffic Routing</span>
                        </div>
                        <div class="use-case-desc">Routes traffic destined for a Service ClusterIP to one of the healthy backend Pods.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚖️</span>
                            <span class="use-case-title">Load Balancing</span>
                        </div>
                        <div class="use-case-desc">Provides simple round-robin (random) load balancing across pods backing a service.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🌐</span>
                            <span class="use-case-title">NodePort Access</span>
                        </div>
                        <div class="use-case-desc">Opens high ports (30000+) on every node to expose services externally.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Office Reception</div>
                    <p>Imagine a big corporate office:</p>
                    <ul>
                        <li><strong>Caller:</strong> Client calling the main board number leads to...</li>
                        <li><strong>Service IP:</strong> The main company phone number (Virtual, not a real desk phone)</li>
                        <li><strong>Kube-proxy:</strong> The Receptionist (Switchboard)</li>
                        <li><strong>Pods:</strong> The 10 support agents at their desks</li>
                        <li><strong>Action:</strong> Call comes to main number → Receptionist (Kube-proxy Rule) → Redirects to Agent 3's desk extension. Next call → Agent 7.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Kube-proxy iptables Mode</div>
                    <div class="ascii-content">
                                    TRAFFIC INBOUND
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                               <span class="success">WORKER NODE</span>                                │
│                                                                          │
│   <span class="warning">KERNEL SPACE (iptables / IPVS)</span>                                         │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ RULE: Dest 10.96.0.10:80 (Service) → DNAT to 192.168.1.5 (Pod 1)   │  │
│  │                                   OR DNAT to 192.168.1.6 (Pod 2)   │  │
│  └───────────────────────────────────┬────────────────────────────────┘  │
│            ▲                         │                                   │
│            │ Programs Rules          ▼                                   │
│   ┌────────┴────────┐       ┌─────────────────┐    ┌─────────────────┐   │
│   │   <span class="highlight">KUBE-PROXY</span>    │       │     <span class="success">POD 1</span>       │    │     <span class="success">POD 2</span>       │   │
│   │  (Watcher)      │       │  192.168.1.5    │    │  192.168.1.6    │   │
│   └─────────────────┘       └─────────────────┘    └─────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "iptables vs IPVS mode?" — Kube-proxy defaults to <strong>iptables</strong> (reliable, standard linux). But for clusters with 1000s of services, iptables gets SLOW (O(n) lookups). <strong>IPVS</strong> is faster (O(1) hash table lookups) and supports better load balancing algorithms (least connections, etc). Use IPVS for large scale!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Kube-proxy = "The Network Glue"</strong>. It doesn't actually touch the data packets itself (in performance modes), it just tells the Linux Kernel HOW to route them via tables.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Service Abstraction</div>
                    <p>When you create a Service, it gets a stable virtual IP (ClusterIP). Kube-proxy programs the kernel to intercept traffic to this IP and redirect it to actual Pod IPs.</p>
                </div>

                <h3>How Services Work</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Packet Flow: Service to Pod</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📤</span> Pod A sends packet to Service IP</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔍</span> Kernel intercepts (iptables/IPVS)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🎯</span> DNAT: Rewrite destination to Pod B IP</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📨</span> Forward packet to Pod B</div>
                    </div>
                </div>

                <h3>Proxy Modes</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mode</th>
                                <th>Mechanism</th>
                                <th>Performance</th>
                                <th>Load Balancing</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">iptables</span></td>
                                <td>Linux netfilter rules</td>
                                <td>O(n) rule lookup</td>
                                <td>Random</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">IPVS</span></td>
                                <td>IP Virtual Server (L4 LB)</td>
                                <td>O(1) hash lookup</td>
                                <td>rr, lc, wrr, etc.</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">nftables</span></td>
                                <td>Next-gen netfilter</td>
                                <td>Better than iptables</td>
                                <td>Random</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>iptables Mode (Deep Dive)</h3>
                <p>Kube-proxy writes chains of iptables rules:</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">iptables rules (simplified)</span>
                    </div>
                    <pre># Traffic to ClusterIP 10.96.0.10:80
-A KUBE-SERVICES -d 10.96.0.10/32 -p tcp --dport 80 \\
    -j KUBE-SVC-XXXX

# Load balance across endpoints
-A KUBE-SVC-XXXX -m statistic --mode random --probability 0.33 \\
    -j KUBE-SEP-AAA  # Pod 1
-A KUBE-SVC-XXXX -m statistic --mode random --probability 0.50 \\
    -j KUBE-SEP-BBB  # Pod 2
-A KUBE-SVC-XXXX \\
    -j KUBE-SEP-CCC  # Pod 3

# DNAT to actual pod IP
-A KUBE-SEP-AAA -p tcp -j DNAT --to-destination 10.244.1.5:8080</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Connection Tracking</div>
                    <p>The Linux kernel's conntrack table remembers the NAT mapping. Return traffic is automatically un-DNATed back to the original source Pod without additional rules.</p>
                </div>

                <h3>IPVS Mode (Recommended for Scale)</h3>
                <p>For clusters with many Services, IPVS provides better performance:</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># View IPVS virtual servers
ipvsadm -Ln

# Example output
TCP  10.96.0.10:80 rr
  -> 10.244.1.5:8080          Masq    1      0          0
  -> 10.244.2.3:8080          Masq    1      0          0
  -> 10.244.3.7:8080          Masq    1      0          0

# Scheduling algorithms: rr (round-robin), lc (least-conn), 
# wrr (weighted-rr), sh (source-hash)</pre>
                </div>
            </div>
        `,

        'container-runtime': `
            <div class="content-card">
                <h2><span class="icon">🐳</span> Container Runtime</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>The <strong>Container Runtime</strong> is the software responsibility for running containers. Kubernetes supports several runtimes: containerd, CRI-O, Docker Engine, and others that implement the Kubernetes CRI (Container Runtime Interface).</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What is CRI?</strong> In the old days, Kubernetes only supported Docker. This was a problem. So they created CRI (Container Runtime Interface). Now, Kubelet speaks "CRI" to any runtime.</p>
                    <p>The Runtime's job is simple: Pull image, Create container namespace, Start process, Stop process. That's it.</p>
                    <p><strong>Key insight:</strong> Docker is actually too heavy for K8s! Docker includes CLI, build tools, volumes, swarm... Kubernetes doesn't need that. That's why Kubernetes deprecated DockerShim and now uses <strong>containerd</strong> or <strong>CRI-O</strong> directly.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⏬</span>
                            <span class="use-case-title">Image Management</span>
                        </div>
                        <div class="use-case-desc">Pulls container images from registries (Docker Hub, ECR, GCR) and caches them on local node.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏃</span>
                            <span class="use-case-title">Execution</span>
                        </div>
                        <div class="use-case-desc">Actually runs the container process, setting up namespaces for isolation (PID, Network, Mount).</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔒</span>
                            <span class="use-case-title">Low-Level Security</span>
                        </div>
                        <div class="use-case-desc">Applies Seccomp profiles, AppArmor/SELinux policies to sandbox the container process.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: DVD Player</div>
                    <p>Think of it like playing a movie:</p>
                    <ul>
                        <li><strong>DVD (Image):</strong> The static data (movie frames) on the disc.</li>
                        <li><strong>DVD Player (Runtime):</strong> The hardware/software that actually spins the disc and puts picture on screen.</li>
                        <li><strong>Remote (Kubelet):</strong> Tells the player "Play", "Pause", "Stop".</li>
                        <li><strong>User:</strong> You don't care how the laser works, you just want to watch the movie.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 CRI - Breaking Free from Docker</div>
                    <div class="ascii-content">
       ┌────────────────────────────┐
       │         <span class="highlight">KUBELET</span>            │
       └─────────────┬──────────────┘
                     │  Speaks gRPC (CRI)
                     ▼
       ┌────────────────────────────┐
       │   <span class="success">CRI RUNTIME (containerd)</span> │  ← High-Level Runtime
       │   (Manages Images/Life)    │
       └─────────────┬──────────────┘
                     │  Spawns
                     ▼
       ┌────────────────────────────┐
       │      <span class="warning">OCI RUNTIME (runc)</span>    │  ← Low-Level Runtime
       │   (Interacts with Kernel)  │
       └─────────────┬──────────────┘
                     │  Creates
                     ▼
       ┌────────────────────────────┐
       │        <span class="highlight">CONTAINER</span>           │
       │    (Namespace/Cgroups)     │
       └────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Why did K8s drop Docker support?" — They didn't drop Docker <em>images</em> (those are standard OCI). They dropped use of Docker <em>Engine</em> as the runtime because it doesn't implement CRI natively (needed a "shim"). Using containerd directly removes the middleman, making it lighter and more stable!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Runtime = "The Engine"</strong>. Kubelet is the driver, but the Runtime is the engine that actually turns the wheels.</p>
                </div>
                
                <h3>Runtime Architecture</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Container Execution Stack</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>🧍</span> Kubelet sends CRI request</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📦</span> High-level runtime (containerd/CRI-O)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>⚙️</span> Low-level runtime (runc/kata/gVisor)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🐧</span> Linux Kernel (namespaces, cgroups)</div>
                    </div>
                </div>

                <h3>Common Runtimes</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📦</span>
                        <div class="name">containerd</div>
                        <div class="desc">CNCF graduated, used by Docker, default for most K8s</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔴</span>
                        <div class="name">CRI-O</div>
                        <div class="desc">Lightweight, OCI-focused, used by OpenShift</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🏖️</span>
                        <div class="name">gVisor</div>
                        <div class="desc">User-space kernel for security isolation</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🛡️</span>
                        <div class="name">Kata Containers</div>
                        <div class="desc">Lightweight VMs for strong isolation</div>
                    </div>
                </div>

                <h3>Linux Primitives</h3>
                <p>Containers aren't magic—they're built on Linux kernel features:</p>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Primitive</th>
                                <th>Purpose</th>
                                <th>Container Use</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Namespaces</span></td>
                                <td>Isolate system resources</td>
                                <td>pid, net, mnt, uts, ipc, user</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">cgroups</span></td>
                                <td>Limit resource usage</td>
                                <td>CPU, memory, I/O limits</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Seccomp</span></td>
                                <td>Filter system calls</td>
                                <td>Block dangerous syscalls</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">AppArmor/SELinux</span></td>
                                <td>Mandatory access control</td>
                                <td>Restrict file/network access</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Container = Process</div>
                    <p>A container is just a regular Linux process with isolated namespaces and resource limits. There's no "container kernel"—it's the host kernel with isolation boundaries.</p>
                </div>
            </div>
        `,

        // ========================
        // WORKLOADS
        // ========================
        'pod': `
            <div class="content-card">
                <h2><span class="icon">🧱</span> Pod - The Atomic Unit</h2>
                <p>A Pod is the <strong>smallest deployable unit</strong> in Kubernetes. It represents a single instance of a running process and can contain one or more containers that share network and storage.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What is a Pod?</strong> In simple terms — a Pod is like an apartment where containers live! One apartment (Pod) can have one or more rooms (containers), and they all share the same address (IP).</p>
                    <p>Most important thing to remember: <strong>Pods are temporary!</strong> If it crashes, gets deleted, or is rescheduled — the new Pod gets a new IP. That's precisely why you should never use Pod IP directly — always use a Service!</p>
                    <p><strong>When to use multi-container pods?</strong> When containers need to be <em>tightly coupled</em> — sharing files with each other, communicating over localhost, or starting/stopping together (sidecar patterns).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📦</span>
                            <span class="use-case-title">Single Container Pod</span>
                        </div>
                        <div class="use-case-desc">Most common pattern! One application = one pod. Like nginx, redis, your backend API.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚗</span>
                            <span class="use-case-title">Sidecar Pattern</span>
                        </div>
                        <div class="use-case-desc">Main container + helper container. E.g., app + log shipper, app + Istio proxy.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔧</span>
                            <span class="use-case-title">Init Container</span>
                        </div>
                        <div class="use-case-desc">Runs before main container. Setup tasks like waiting for DB, downloading config, setting permissions.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: OTT Platform (Hotstar/Netflix)</div>
                    <p>Imagine you're running video streaming platform:</p>
                    <ul>
                        <li><strong>Video transcoder pod</strong> = Single container doing heavy FFmpeg processing with high GPU requirements</li>
                        <li><strong>API gateway pod</strong> = Main nginx container + sidecar Envoy for mTLS (Istio service mesh)</li>
                        <li><strong>Database pod</strong> = Main Postgres container + init container that restores backup on first boot</li>
                        <li><strong>Analytics pod</strong> = App container + log collector sidecar → both share volume where app writes logs</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Pod Internal Structure</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                              <span class="highlight">POD: my-app</span>                                  │
│                          IP: 10.244.1.15                                 │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
     ┌──────────────────────────────┼──────────────────────────────┐
     │                              │                              │
     ▼                              ▼                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   <span class="warning">INIT CONTAINER</span> │    │  <span class="success">MAIN CONTAINER</span>  │    │ <span class="highlight">SIDECAR CONTAINER</span>│
│   wait-for-db   │ →  │     my-app      │    │   log-shipper   │
│   (runs first)  │    │   Port: 8080    │    │  Port: 9090     │
└─────────────────┘    └────────┬────────┘    └────────┬────────┘
                                │                      │
                         ┌──────┴──────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   <span class="success">SHARED VOLUME</span>      │
              │   /var/log/app       │
              │   (emptyDir/PVC)     │
              └──────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   <span class="highlight">NETWORK NAMESPACE</span>  │
              │   localhost = same   │
              │   All ports shared   │
              └──────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What's the difference between container and pod?" — Container is the actual running process (nginx, redis). Pod is Kubernetes' wrapper that adds: shared network namespace, shared storage volumes, lifecycle management, and the ability to run multiple containers together!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember Pod as <strong>"Peas in a Pod"</strong> — Just like peas share the same pod shell, containers in a Kubernetes Pod share the same network (IP) and storage (volumes)!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Why Pods?</div>
                    <p>Pods exist because some applications need tightly-coupled containers. For example, a web server and log shipper that need to share files. Pods let you co-locate and co-schedule them.</p>
                </div>

                <h3>Pod Anatomy</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🌐</span>
                        <div class="name">Shared Network</div>
                        <div class="desc">All containers share same IP and ports</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">💾</span>
                        <div class="name">Shared Storage</div>
                        <div class="desc">Volumes mounted to multiple containers</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔧</span>
                        <div class="name">Init Containers</div>
                        <div class="desc">Run before app containers start</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🚗</span>
                        <div class="name">Sidecar Containers</div>
                        <div class="desc">Helper containers (logging, proxy)</div>
                    </div>
                </div>

                <h3>Pod YAML Structure</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: my-app
    tier: frontend
spec:
  # Init containers run first, in order
  initContainers:
  - name: init-db
    image: busybox
    command: ['sh', '-c', 'until nc -z db-service 5432; do sleep 1; done']
  
  # Main containers
  containers:
  - name: app
    image: my-app:v1
    ports:
    - containerPort: 8080
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "500m"
        memory: "512Mi"
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
    volumeMounts:
    - name: config
      mountPath: /etc/config
  
  - name: log-shipper   # Sidecar
    image: fluentd
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  
  volumes:
  - name: config
    configMap:
      name: app-config
  - name: logs
    emptyDir: {}</pre>
                </div>

                <h3>Pod Lifecycle</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Phase</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-orange">Pending</span></td>
                                <td>Pod accepted, waiting for scheduling or image pull</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Running</span></td>
                                <td>Pod bound to node, at least one container running</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">Succeeded</span></td>
                                <td>All containers terminated successfully (exit 0)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">Failed</span></td>
                                <td>All containers terminated, at least one failed</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">Unknown</span></td>
                                <td>Pod state cannot be determined</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'deployment': `
            <div class="content-card">
                <h2><span class="icon">🌀</span> Deployment - Declarative Updates</h2>
                <p>A Deployment provides <strong>declarative updates</strong> for Pods and ReplicaSets. You describe a desired state, and the Deployment Controller changes the actual state to match.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What is a Deployment?</strong> It's the most common way to run stateless applications in Kubernetes. Instead of managing pods directly, you tell Deployment what you want — "Run 5 copies of my app using this image" — and it handles everything else.</p>
                    <p>Deployments manage ReplicaSets which manage Pods. When you update the image, Deployment creates a new ReplicaSet and gradually shifts pods from old to new (rolling update). If something goes wrong, you can rollback instantly!</p>
                    <p><strong>Key insight:</strong> Never create bare pods in production. Always use Deployments — they provide rolling updates, rollbacks, and self-healing capabilities.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚀</span>
                            <span class="use-case-title">Zero-Downtime Deploys</span>
                        </div>
                        <div class="use-case-desc">Rolling updates ensure old pods run while new ones start. Traffic gradually shifts to new version.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⏪</span>
                            <span class="use-case-title">Easy Rollbacks</span>
                        </div>
                        <div class="use-case-desc">Found a bug after deployment? <code>kubectl rollout undo</code> instantly reverts to previous version.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📊</span>
                            <span class="use-case-title">Scaling</span>
                        </div>
                        <div class="use-case-desc">Change replica count anytime. HPA can automatically scale based on CPU/memory.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Banking Application</div>
                    <p>Imagine deploying updates to a banking application:</p>
                    <ul>
                        <li><strong>Initial deploy:</strong> 10 replicas of payment service v1.0 running across 5 nodes</li>
                        <li><strong>Update to v1.1:</strong> Deployment creates new ReplicaSet, starts 2 new pods while keeping 10 old</li>
                        <li><strong>Gradual transition:</strong> maxSurge=25% means up to 12 pods temporarily, maxUnavailable=25% means minimum 8</li>
                        <li><strong>Bug detected post-deploy:</strong> <code>kubectl rollout undo</code> → Old ReplicaSet scales up, new scales down</li>
                        <li><strong>Revision history:</strong> Kubernetes keeps last 10 ReplicaSets for quick rollback to any version</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Deployment → ReplicaSet → Pod Hierarchy</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                       <span class="highlight">DEPLOYMENT: my-app</span>                                │
│                       replicas: 3                                        │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              │                                           │
              ▼                                           ▼
     ┌─────────────────┐                        ┌─────────────────┐
     │ <span class="warning">ReplicaSet v1</span>   │                        │ <span class="success">ReplicaSet v2</span>   │
     │ replicas: 0     │  ← (after rollout) →   │ replicas: 3     │
     │ (old version)   │                        │ (current)       │
     └─────────────────┘                        └────────┬────────┘
                                                         │
                           ┌─────────────────────────────┼─────────────────────────────┐
                           │                             │                             │
                           ▼                             ▼                             ▼
                    ┌─────────────┐              ┌─────────────┐              ┌─────────────┐
                    │  <span class="success">Pod v2-a</span>   │              │  <span class="success">Pod v2-b</span>   │              │  <span class="success">Pod v2-c</span>   │
                    │  Running    │              │  Running    │              │  Running    │
                    └─────────────┘              └─────────────┘              └─────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "How does a rolling update work?" — Deployment creates a new ReplicaSet with new pod template. It gradually scales up new RS while scaling down old RS, ensuring minReadySeconds and maxSurge/maxUnavailable constraints are met. This ensures zero-downtime updates.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Deployment → ReplicaSet → Pods</strong> (D→R→P). Deployment manages ReplicaSets, ReplicaSets manage Pods. Each image update creates a new ReplicaSet while keeping old ones for rollback!</p>
                </div>

                <h3>Why Use Deployments?</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🔄</span>
                        <div class="name">Rolling Updates</div>
                        <div class="desc">Zero-downtime deployments</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⏪</span>
                        <div class="name">Rollbacks</div>
                        <div class="desc">Revert to previous versions</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📈</span>
                        <div class="name">Scaling</div>
                        <div class="desc">Scale replicas up/down</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⏸️</span>
                        <div class="name">Pause/Resume</div>
                        <div class="desc">Control rollout progression</div>
                    </div>
                </div>

                <h3>Rolling Update Strategy</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Rolling Update Animation</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>v1</span> 3 pods running version 1</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>+v2</span> Create 1 new v2 pod</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>-v1</span> Terminate 1 old v1 pod</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔄</span> Repeat until all v2</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>v2</span> 3 pods running version 2</div>
                    </div>
                </div>

                <h3>Deployment YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max pods over desired during update
      maxUnavailable: 0  # Max pods unavailable during update
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:v2
        ports:
        - containerPort: 8080</pre>
                </div>

                <h3>Useful Commands</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Watch rollout status
kubectl rollout status deployment/my-app

# View rollout history
kubectl rollout history deployment/my-app

# Rollback to previous version
kubectl rollout undo deployment/my-app

# Rollback to specific revision
kubectl rollout undo deployment/my-app --to-revision=2

# Pause rollout (for canary testing)
kubectl rollout pause deployment/my-app

# Resume rollout
kubectl rollout resume deployment/my-app</pre>
                </div>
            </div>
        `,

        // Add more content sections...
        'services': `
            <div class="content-card">
                <h2><span class="icon">🔗</span> Services - Stable Network Endpoints</h2>
                <p>A Service is an abstraction that provides a <strong>stable network endpoint</strong> for accessing a set of Pods. While Pods are ephemeral, Services provide a consistent way to reach them.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why do we need Services?</strong> Pods are temporary — they get new IPs when they restart, crash, or reschedule. If your frontend talks to your backend pods directly using IP addresses, it will break every time pods restart!</p>
                    <p>Services provide a stable virtual IP (ClusterIP) that never changes. Behind the scenes, kube-proxy maintains iptables/IPVS rules that route traffic to healthy pods. When pods change, Service automatically updates its endpoints.</p>
                    <p><strong>Key insight:</strong> Services use label selectors to find pods. Any pod matching the selector becomes a backend endpoint for that service. This is the foundation of loose coupling in Kubernetes!</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏠</span>
                            <span class="use-case-title">ClusterIP (Internal)</span>
                        </div>
                        <div class="use-case-desc">Default type. Internal-only access within the cluster. Frontend pod talks to backend-service:8080.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚪</span>
                            <span class="use-case-title">NodePort (External)</span>
                        </div>
                        <div class="use-case-desc">Exposes service on every node's IP at a specific port (30000-32767). Development and simple testing.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚖️</span>
                            <span class="use-case-title">LoadBalancer (Cloud)</span>
                        </div>
                        <div class="use-case-desc">Provisions cloud load balancer (AWS ELB, GCP LB). Production-grade external access.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Microservices Architecture</div>
                    <p>Imagine a typical 3-tier web application:</p>
                    <ul>
                        <li><strong>Frontend pods</strong> → Need to reach backend. They call <code>http://backend-service:8080/api</code></li>
                        <li><strong>Backend pods</strong> → Need to reach database. They call <code>http://db-service:5432</code></li>
                        <li><strong>External users</strong> → Need to reach frontend. You expose <code>frontend-service</code> as LoadBalancer</li>
                        <li><strong>Pod crashes:</strong> When backend pod restarts with new IP, Service endpoints update — frontend doesn't need to know!</li>
                        <li><strong>Scaling:</strong> Add more backend pods? Service automatically load-balances across all of them</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Service Traffic Flow</div>
                    <div class="ascii-content">
                                        <span class="highlight">EXTERNAL USER</span>
                                              │
                                              ▼
                               ┌───────────────────────────┐
                               │   <span class="warning">LoadBalancer Service</span>    │
                               │   frontend-svc (80)       │
                               │   External IP: 34.x.x.x   │
                               └──────────────┬────────────┘
                                              │
     ┌────────────────────────────────────────┼────────────────────────────────────────┐
     │                                        │                                        │
     ▼                                        ▼                                        ▼
┌───────────┐                          ┌───────────┐                          ┌───────────┐
│<span class="success">Frontend-1</span> │                          │<span class="success">Frontend-2</span> │                          │<span class="success">Frontend-3</span> │
│10.244.1.5 │                          │10.244.2.3 │                          │10.244.3.7 │
└─────┬─────┘                          └─────┬─────┘                          └─────┬─────┘
      │                                      │                                      │
      └──────────────────────────────────────┴──────────────────────────────────────┘
                                              │
                                              ▼
                               ┌───────────────────────────┐
                               │    <span class="success">ClusterIP Service</span>      │
                               │    backend-svc (8080)     │
                               │    10.96.50.100           │
                               └───────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What's the difference between ClusterIP, NodePort, and LoadBalancer?" — ClusterIP is internal-only, NodePort opens a port on every node (includes ClusterIP), LoadBalancer provisions external cloud LB (includes NodePort + ClusterIP). Each higher type includes features of lower types!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember Service types as a progression: <strong>C → N → L</strong> (ClusterIP → NodePort → LoadBalancer). Each one builds on top of the previous. C is inside-only, N adds node ports, L adds external load balancer!</p>
                </div>

                <h3>The Problem Services Solve</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Pod IP Churn</div>
                    <p>Pods get new IPs when they restart. If Pod A needs to talk to Pod B, it can't hardcode B's IP. Services provide a stable virtual IP (ClusterIP) that never changes, even as backend Pods churn.</p>
                </div>

                <h3>Service Types</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🏠</span>
                        <div class="name">ClusterIP</div>
                        <div class="desc">Internal only, default type</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🚪</span>
                        <div class="name">NodePort</div>
                        <div class="desc">External via node IP:port</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⚖️</span>
                        <div class="name">LoadBalancer</div>
                        <div class="desc">Cloud provider LB</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔍</span>
                        <div class="name">ExternalName</div>
                        <div class="desc">DNS CNAME to external service</div>
                    </div>
                </div>

                <h3>Service YAML Examples</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># ClusterIP (internal)
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP           # Default
  selector:
    app: my-app
  ports:
  - port: 80                # Service port
    targetPort: 8080        # Pod port

---
# NodePort (external via node)
apiVersion: v1
kind: Service
metadata:
  name: my-external
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080         # External port (30000-32767)

---
# LoadBalancer (cloud)
apiVersion: v1
kind: Service
metadata:
  name: my-public
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080</pre>
                </div>

                <h3>Service Discovery</h3>
                <p>Kubernetes provides two ways to discover Services:</p>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Method</th>
                                <th>How It Works</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">DNS</span></td>
                                <td>my-service.namespace.svc.cluster.local</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Environment Variables</span></td>
                                <td>MY_SERVICE_HOST, MY_SERVICE_PORT</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'replicaset': `
            <div class="content-card">
                <h2><span class="icon">📋</span> ReplicaSet</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>ReplicaSet</strong> is a Kubernetes controller that maintains a stable set of replica Pods running at any given time. It guarantees the availability of a specified number of identical Pods.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What does ReplicaSet do?</strong> It ensures that exactly N copies of your pod are running at all times. If a pod crashes, ReplicaSet creates a new one. If someone accidentally creates extra pods, ReplicaSet deletes them.</p>
                    <p>ReplicaSet uses label selectors to identify which pods belong to it. Any pod matching the selector counts towards the replica count. This is why labels are so important!</p>
                    <p><strong>Key insight:</strong> In practice, you rarely create ReplicaSets directly. Deployments create ReplicaSets automatically and manage them for rolling updates. ReplicaSets are the "middle layer" in Deployment → ReplicaSet → Pods.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔢</span>
                            <span class="use-case-title">Replica Count</span>
                        </div>
                        <div class="use-case-desc">Ensure exactly 5 copies of your backend service run at all times, across multiple nodes.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔄</span>
                            <span class="use-case-title">Self-Healing</span>
                        </div>
                        <div class="use-case-desc">Pod crashes? ReplicaSet controller notices and immediately creates replacement pod.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📈</span>
                            <span class="use-case-title">Scaling</span>
                        </div>
                        <div class="use-case-desc">Change replicas from 3 to 10 instantly. ReplicaSet creates 7 new pods to match.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Stateless Web Servers</div>
                    <p>Imagine running a stateless API backend:</p>
                    <ul>
                        <li><strong>Initial state:</strong> ReplicaSet with replicas=3, three pods running across nodes</li>
                        <li><strong>Pod crash:</strong> One pod OOMKilled → ReplicaSet sees only 2 pods → Creates pod #4</li>
                        <li><strong>Node failure:</strong> Node goes down with 1 pod → ReplicaSet creates replacement on healthy node</li>
                        <li><strong>Scaling:</strong> You change replicas to 5 → ReplicaSet creates 2 more pods</li>
                        <li><strong>Deployment update:</strong> Deployment creates NEW ReplicaSet with updated image, scales down old one</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 ReplicaSet Self-Healing Flow</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                    <span class="highlight">REPLICASET: backend-rs</span>                               │
│                    replicas: 3                                           │
│                    selector: app=backend                                 │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
     ┌──────────────┴──────────────┐               │
     │                              │               │
     ▼                              ▼               ▼
┌─────────────┐            ┌─────────────┐    ┌─────────────┐
│ <span class="success">backend-1</span>   │            │ <span class="success">backend-2</span>   │    │ <span class="warning">backend-3</span>   │
│  Running   │            │  Running   │    │  CRASHED    │ ← Pod failed!
│  app=back  │            │  app=back  │    │             │
└─────────────┘            └─────────────┘    └──────┬──────┘
                                                     │
                    ReplicaSet Controller notices    │
                    current=2, desired=3             │
                                                     ▼
                                              ┌─────────────┐
                                              │ <span class="success">backend-4</span>   │ ← NEW POD!
                                              │  Running   │
                                              │  app=back  │
                                              └─────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "ReplicaSet vs Deployment?" — ReplicaSet just maintains pod count. Deployment wraps ReplicaSet and adds rolling updates, rollback history, and update strategies. In production, always use Deployment. ReplicaSets are managed by Deployments behind the scenes.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>ReplicaSet = "Pod Counter"</strong>. Its only job is to ensure "desired replicas = actual running pods". Too few? Create more. Too many? Delete some. That's it!</p>
                </div>

                <h3>Reconciliation Loop</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ ReplicaSet Controller Animation</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>👁️</span> Watch: Monitor Pod count via label selector</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📊</span> Compare: Actual pods vs desired replicas</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>➕</span> Scale Up: Create pods if actual < desired</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>➖</span> Scale Down: Delete pods if actual > desired</div>
                    </div>
                </div>

                <h3>ReplicaSet YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-replicaset
  labels:
    app: nginx
spec:
  replicas: 3                    # Desired number of pods
  selector:
    matchLabels:
      app: nginx                 # Must match template labels
    matchExpressions:            # Set-based selector (optional)
    - key: environment
      operator: In
      values:
      - production
      - staging
  template:
    metadata:
      labels:
        app: nginx
        environment: production
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Owner References</div>
                    <p>When a ReplicaSet creates a Pod, it adds an <code>ownerReference</code> field to the Pod's metadata. This creates a parent-child relationship. If you delete the ReplicaSet, Kubernetes garbage collects all its owned Pods!</p>
                </div>

                <h3>Key Differences: ReplicaSet vs Deployment</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>ReplicaSet</th>
                                <th>Deployment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Rolling Updates</td>
                                <td><span class="badge badge-orange">No</span></td>
                                <td><span class="badge badge-green">Yes</span></td>
                            </tr>
                            <tr>
                                <td>Rollbacks</td>
                                <td><span class="badge badge-orange">Manual</span></td>
                                <td><span class="badge badge-green">Automatic</span></td>
                            </tr>
                            <tr>
                                <td>Revision History</td>
                                <td><span class="badge badge-orange">No</span></td>
                                <td><span class="badge badge-green">Yes</span></td>
                            </tr>
                            <tr>
                                <td>Direct Usage</td>
                                <td><span class="badge badge-orange">Rare</span></td>
                                <td><span class="badge badge-green">Recommended</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">💡 Interview Tip</div>
                    <p><strong>Q: When would you use a ReplicaSet directly instead of a Deployment?</strong><br>
                    A: Almost never! Deployments manage ReplicaSets for you. The only edge case is if you need custom update orchestration or are building a custom controller.</p>
                </div>
            </div>
        `,

        'statefulset': `
            <div class="content-card">
                <h2><span class="icon">🗃️</span> StatefulSet</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>StatefulSet</strong> manages stateful applications, providing guarantees about the ordering and uniqueness of Pods. Unlike Deployments, StatefulSets maintain a sticky identity for each Pod.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>When to use StatefulSet instead of Deployment?</strong> Deployments are for stateless apps — any pod can handle any request. But databases need persistent identity. MySQL primary must always be mysql-0, and it needs the same storage volume every time it restarts!</p>
                    <p>StatefulSets provide three guarantees: <strong>Stable network identity</strong> (mysql-0 is always mysql-0), <strong>Stable storage</strong> (same PVC reattaches), and <strong>Ordered operations</strong> (pods start/stop in order: 0, 1, 2).</p>
                    <p><strong>Key insight:</strong> StatefulSet pods get predictable DNS names like <code>mysql-0.mysql-headless.default.svc.cluster.local</code>. This allows apps to discover specific replicas!</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🗄️</span>
                            <span class="use-case-title">Databases</span>
                        </div>
                        <div class="use-case-desc">MySQL, PostgreSQL, MongoDB clusters where each replica has unique role (primary/replica) and data.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📨</span>
                            <span class="use-case-title">Message Queues</span>
                        </div>
                        <div class="use-case-desc">Kafka, RabbitMQ clusters where partition assignments must persist across restarts.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔍</span>
                            <span class="use-case-title">Distributed Storage</span>
                        </div>
                        <div class="use-case-desc">Elasticsearch, Cassandra clusters where node identity matters for data distribution.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: PostgreSQL Cluster</div>
                    <p>Imagine running a PostgreSQL HA cluster:</p>
                    <ul>
                        <li><strong>Primary (postgres-0):</strong> Handles all writes, has its own 100GB PVC</li>
                        <li><strong>Replica (postgres-1):</strong> Streams from postgres-0, has separate 100GB PVC</li>
                        <li><strong>Replica (postgres-2):</strong> Another read replica with its own storage</li>
                        <li><strong>Node failure:</strong> postgres-1 pod is rescheduled but still called postgres-1, same PVC reattaches</li>
                        <li><strong>Scaling down:</strong> Pods are terminated in reverse order (2, then 1) — preserving primary!</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 StatefulSet with Headless Service</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                    <span class="highlight">STATEFULSET: postgres</span>                                │
│                    replicas: 3                                           │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
     ┌──────────────────────────────┼──────────────────────────────────────┐
     │                              │                                      │
     ▼                              ▼                                      ▼
┌─────────────┐            ┌─────────────┐                      ┌─────────────┐
│ <span class="success">postgres-0</span>  │            │ <span class="warning">postgres-1</span>  │                      │ <span class="warning">postgres-2</span>  │
│  (PRIMARY)  │     →      │  (REPLICA)  │                      │  (REPLICA)  │
│  Ordinal: 0 │            │  Ordinal: 1 │                      │  Ordinal: 2 │
└──────┬──────┘            └──────┬──────┘                      └──────┬──────┘
       │                          │                                    │
       ▼                          ▼                                    ▼
┌─────────────┐            ┌─────────────┐                      ┌─────────────┐
│  <span class="success">PVC-0</span>      │            │  <span class="success">PVC-1</span>      │                      │  <span class="success">PVC-2</span>      │
│  100GB SSD  │            │  100GB SSD  │                      │  100GB SSD  │
└─────────────┘            └─────────────┘                      └─────────────┘

    DNS: postgres-0.postgres-headless.default.svc.cluster.local
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Deployment vs StatefulSet?" — Deployment for stateless apps (web servers, APIs) — pods are interchangeable. StatefulSet for stateful apps (databases, queues) — each pod has unique identity and storage. StatefulSet uses Headless Service for stable DNS.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember StatefulSet with <strong>"3 S's"</strong>: <strong>S</strong>table network identity, <strong>S</strong>table storage, <strong>S</strong>equential ordering. These are the 3 guarantees that make it different from Deployment!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Stable Identity</div>
                    <p>Each Pod in a StatefulSet gets a persistent identifier (ordinal index) that survives rescheduling. Pod names follow the pattern: <code>{statefulset-name}-{ordinal}</code> (e.g., mysql-0, mysql-1, mysql-2).</p>
                </div>

                <h3>StatefulSet Guarantees</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🔢</span>
                        <div class="name">Ordered Deployment</div>
                        <div class="desc">Pods created sequentially (0, 1, 2...)</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🏷️</span>
                        <div class="name">Stable Network ID</div>
                        <div class="desc">Predictable DNS: pod-0.svc.ns</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">💾</span>
                        <div class="name">Persistent Storage</div>
                        <div class="desc">PVC per pod, survives restarts</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔄</span>
                        <div class="name">Ordered Termination</div>
                        <div class="desc">Deleted in reverse order (N-1...0)</div>
                    </div>
                </div>

                <h3>Pod Lifecycle Animation</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Ordered Creation Sequence</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>0️⃣</span> Create mysql-0, wait for Ready</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>1️⃣</span> Create mysql-1, wait for Ready</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>2️⃣</span> Create mysql-2, wait for Ready</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>✅</span> All replicas running in order</div>
                    </div>
                </div>

                <h3>StatefulSet YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql-headless   # Required headless service
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:          # PVC per pod
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 10Gi</pre>
                </div>

                <h3>Headless Service Requirement</h3>
                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Why Headless Service?</div>
                    <p>A headless Service (clusterIP: None) is required for StatefulSets. It provides stable DNS entries for each Pod:<br>
                    • <code>mysql-0.mysql-headless.default.svc.cluster.local</code><br>
                    • <code>mysql-1.mysql-headless.default.svc.cluster.local</code><br>
                    This allows applications to connect to specific replicas (e.g., the primary database).</p>
                </div>

                <h3>Use Cases</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Application</th>
                                <th>Why StatefulSet?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Databases</span></td>
                                <td>MySQL, PostgreSQL need stable storage & identity</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Message Queues</span></td>
                                <td>Kafka, RabbitMQ need ordered deployment</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Distributed Systems</span></td>
                                <td>Zookeeper, etcd need stable network IDs</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'daemonset': `
            <div class="content-card">
                <h2><span class="icon">👹</span> DaemonSet</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>DaemonSet</strong> ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them. As nodes are removed, those Pods are garbage collected.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>When to use DaemonSet?</strong> When you need exactly one pod per node — not more, not less. Think of things that should run on every machine: log collectors, monitoring agents, CNI plugins, storage daemons.</p>
                    <p>Unlike Deployments (which care about total replica count), DaemonSets care about "one pod per matching node". Add a new node to the cluster? DaemonSet automatically creates a pod there. Remove a node? Pod gets cleaned up.</p>
                    <p><strong>Key insight:</strong> DaemonSet pods bypass the Scheduler by default — they run on nodes based on node selectors or tolerations you define, not Scheduler decisions.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📊</span>
                            <span class="use-case-title">Monitoring Agents</span>
                        </div>
                        <div class="use-case-desc">Prometheus node-exporter, Datadog agent, New Relic — collect metrics from every node.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📝</span>
                            <span class="use-case-title">Log Collectors</span>
                        </div>
                        <div class="use-case-desc">Fluentd, Fluent Bit, Filebeat — ship logs from /var/log on every node to central store.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🌐</span>
                            <span class="use-case-title">CNI Plugins</span>
                        </div>
                        <div class="use-case-desc">Calico, Cilium, Flannel — network plugins that must run on every node for pod networking.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Observability Stack</div>
                    <p>Imagine setting up full observability:</p>
                    <ul>
                        <li><strong>Log collection:</strong> DaemonSet runs Fluent Bit on every node, mounts /var/log to collect container logs</li>
                        <li><strong>Metrics:</strong> DaemonSet runs node-exporter on every node to expose hardware/OS metrics</li>
                        <li><strong>New node added:</strong> Auto-scaling adds a worker node → both DaemonSets automatically deploy their pods there</li>
                        <li><strong>Node decommissioned:</strong> Cluster shrinks → DaemonSet pods are cleaned up gracefully</li>
                        <li><strong>GPU nodes only:</strong> Use nodeSelector to run nvidia-device-plugin DaemonSet only on GPU-labelled nodes</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 DaemonSet Distribution Across Nodes</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                    <span class="highlight">DAEMONSET: fluentbit-logs</span>                             │
│                    Selector: all nodes                                   │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
     ┌──────────────────────────────┼──────────────────────────────────────┐
     │                              │                                      │
     ▼                              ▼                                      ▼
┌─────────────────┐        ┌─────────────────┐                ┌─────────────────┐
│    <span class="success">NODE-1</span>        │        │    <span class="success">NODE-2</span>        │                │    <span class="success">NODE-3</span>        │
│                 │        │                 │                │                 │
│  ┌───────────┐  │        │  ┌───────────┐  │                │  ┌───────────┐  │
│  │<span class="warning">fluentbit-1</span>│  │        │  │<span class="warning">fluentbit-2</span>│  │                │  │<span class="warning">fluentbit-3</span>│  │
│  │ (1 per n) │  │        │  │ (1 per n) │  │                │  │ (1 per n) │  │
│  └───────────┘  │        │  └───────────┘  │                │  └───────────┘  │
│                 │        │                 │                │                 │
│  [app pods]     │        │  [app pods]     │                │  [app pods]     │
└─────────────────┘        └─────────────────┘                └─────────────────┘

        NEW NODE ADDED → DaemonSet automatically creates fluentbit-4 on it!
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Deployment vs DaemonSet?" — Deployment says "I want N replicas spread by Scheduler". DaemonSet says "I want exactly ONE pod per matching node". Use Deployment for applications (web servers, APIs). Use DaemonSet for node-level infrastructure (logging, monitoring, networking).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>DaemonSet = "One Per Node"</strong>. Just like a daemon process that runs on every Linux machine, a DaemonSet pod runs on every Kubernetes node!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Node-Level Services</div>
                    <p>DaemonSets are perfect for node-level infrastructure: log collectors, monitoring agents, network plugins. The controller watches for node additions/removals and maintains exactly one Pod per eligible node.</p>
                </div>

                <h3>How DaemonSets Work</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ DaemonSet Controller Logic</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>🖥️</span> Node 1 joins → Create Pod on Node 1</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🖥️</span> Node 2 joins → Create Pod on Node 2</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🖥️</span> Node 3 joins → Create Pod on Node 3</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>❌</span> Node 2 removed → Pod auto-deleted</div>
                    </div>
                </div>

                <h3>Common Use Cases</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📊</span>
                        <div class="name">Node Monitoring</div>
                        <div class="desc">Prometheus node-exporter, Datadog agent</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📝</span>
                        <div class="name">Log Collection</div>
                        <div class="desc">Fluentd, Filebeat, Fluent Bit</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🌐</span>
                        <div class="name">Network Plugins</div>
                        <div class="desc">Calico, Cilium, Flannel CNI</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">💾</span>
                        <div class="name">Storage Daemons</div>
                        <div class="desc">GlusterFS, Ceph, CSI node plugins</div>
                    </div>
                </div>

                <h3>DaemonSet YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      tolerations:                    # Run on control plane too
      - key: node-role.kubernetes.io/control-plane
        effect: NoSchedule
      containers:
      - name: fluentd
        image: fluent/fluentd:v1.14
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: containers
          mountPath: /var/lib/docker/containers
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: containers
        hostPath:
          path: /var/lib/docker/containers</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Node Selector</div>
                    <p>Use <code>nodeSelector</code> or <code>nodeAffinity</code> to run DaemonSets on specific nodes only. For example, run GPU monitoring only on nodes with GPUs.</p>
                </div>
            </div>
        `,

        'job': `
            <div class="content-card">
                <h2><span class="icon">⚡</span> Job & CronJob</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>Job</strong> creates one or more Pods and ensures that a specified number of them successfully terminate. A <strong>CronJob</strong> creates Jobs on a schedule (like Unix cron).</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What's the difference?</strong> Deployments effectively say "Run this FOREVER" (web servers). Jobs say "Run this UNTIL DONE" (batch tasks). Once the task finishes (exit code 0), the Pod stops and the Job is marked complete.</p>
                    <p><strong>Retries:</strong> If the pod fails (exit code 1), the Job controller will start a new pod to try again, up to <code>backoffLimit</code> times. Helpful for flaky network tasks!</p>
                    <p><strong>CronJob:</strong> Just a wrapper around Job that triggers it at specific times (e.g., "5 4 * * *" for 4:05 AM daily).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💾</span>
                            <span class="use-case-title">Database Backups</span>
                        </div>
                        <div class="use-case-desc">CronJob runs every night at 2 AM to dump DB and upload to S3 bucket.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📧</span>
                            <span class="use-case-title">Email Batches</span>
                        </div>
                        <div class="use-case-desc">Job processes a queue of pending welcome emails and sends them out, then exits.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🎬</span>
                            <span class="use-case-title">Video Rendering</span>
                        </div>
                        <div class="use-case-desc">User uploads video → Job starts to transcode it to MP4 → Exits when done.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: End-of-Day Report</div>
                    <p>Imagine a bank's daily reconciliation:</p>
                    <ul>
                        <li><strong>CronJob:</strong> Scheduled for 23:59 daily.</li>
                        <li><strong>Job:</strong> Created by CronJob. Spawns a Pod.</li>
                        <li><strong>Pod:</strong> Reads all transactions for the day, calculates totals, generates PDF report, emails to manager.</li>
                        <li><strong>Completion:</strong> Task finishes, Pod exits with 0. Job marks as "Succeeded".</li>
                        <li><strong>Failure:</strong> If report generation crashes, Job retries 3 times before alerting admin.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 CronJob -> Job -> Pod Flow</div>
                    <div class="ascii-content">
                                ┌───────────────────────────┐
                                │   <span class="highlight">CRONJOB: backup-daily</span>   │
                                │   Schedule: "0 0 * * *"   │
                                └─────────────┬─────────────┘
                                              │ (At Midnight)
                                              ▼
                                ┌───────────────────────────┐
                                │      <span class="success">JOB: backup-123</span>      │
                                │      Completions: 1       │
                                └─────────────┬─────────────┘
                                              │ Creates
                                              ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                             <span class="warning">POD: backup-123-abc</span>                          │
│                                                                          │
│    1. Start Container  ──►  2. Do Work (Dump DB)  ──►  3. Exit(0)        │
│                                                                          │
└─────────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
                                <span class="success">JOB COMPLETE!</span>
                       (Pod remains for logs, but not running)
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "How to clean up finished Jobs?" — Finished Jobs (and their pods) stick around so you can check logs. This clutters the cluster over time! Use <code>ttlSecondsAfterFinished</code> in the Job spec to automatically delete them after X seconds (e.g., 3600 for 1 hour).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Job = "One Cross"</strong> (Run once). <strong>Deployment = "Infinity Loop"</strong> (Run forever). <strong>CronJob = "Alarm Clock"</strong> for Jobs.</p>
                </div>

                <h3>Job Types</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">1️⃣</span>
                        <div class="name">Single Completion</div>
                        <div class="desc">completions: 1, parallelism: 1</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔢</span>
                        <div class="name">Fixed Completions</div>
                        <div class="desc">completions: N, run N pods total</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⚡</span>
                        <div class="name">Parallel Jobs</div>
                        <div class="desc">parallelism: N, run N pods at once</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔁</span>
                        <div class="name">Work Queue</div>
                        <div class="desc">No completions, pods coordinate</div>
                    </div>
                </div>

                <h3>Job Lifecycle</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Job Execution Flow</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📝</span> Job created → Controller spawns Pod</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🏃</span> Pod runs to completion (exit 0)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>✅</span> Job marked as "Complete"</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🧹</span> TTL controller cleans up (optional)</div>
                    </div>
                </div>

                <h3>Job YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  completions: 5           # Total pods to complete
  parallelism: 2           # Run 2 pods at a time
  backoffLimit: 3          # Retry 3 times on failure
  activeDeadlineSeconds: 600  # Timeout after 10 min
  ttlSecondsAfterFinished: 3600  # Cleanup after 1 hour
  template:
    spec:
      restartPolicy: Never   # Required for Jobs
      containers:
      - name: migrate
        image: migration-tool:v1
        command: ["./migrate.sh"]</pre>
                </div>

                <h3>CronJob Schedule</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-backup
spec:
  schedule: "0 2 * * *"    # Every day at 2 AM
  concurrencyPolicy: Forbid  # Don't overlap runs
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: backup-tool:v1
            command: ["/backup.sh"]</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Cron Schedule Format</div>
                    <p><code>* * * * *</code> = minute hour day-of-month month day-of-week<br>
                    Examples:<br>
                    • <code>*/5 * * * *</code> = Every 5 minutes<br>
                    • <code>0 */2 * * *</code> = Every 2 hours<br>
                    • <code>0 9 * * 1-5</code> = 9 AM on weekdays</p>
                </div>
            </div>
        `,

        'ingress': `
            <div class="content-card">
                <h2><span class="icon">🚪</span> Ingress</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>An <strong>Ingress</strong> is an API object that manages external access to services in a cluster, typically HTTP/HTTPS. It provides load balancing, SSL termination, and name-based virtual hosting.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why Ingress instead of LoadBalancer Services?</strong> Each LoadBalancer service creates a separate cloud load balancer, which costs money. If you have 20 services, that means 20 load balancers! Ingress consolidates all HTTP routing rules behind a single entry point.</p>
                    <p>Ingress is just an API object — it doesn't do anything by itself. You need an <strong>Ingress Controller</strong> (nginx-ingress, traefik, haproxy, etc.) that watches Ingress resources and configures the actual routing.</p>
                    <p><strong>Key insight:</strong> Ingress works at Layer 7 (HTTP/HTTPS), so it can route based on hostnames, path prefixes, headers, etc. Services work at Layer 4 (TCP/UDP).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🌐</span>
                            <span class="use-case-title">Virtual Hosting</span>
                        </div>
                        <div class="use-case-desc">api.myapp.com → API service, web.myapp.com → Frontend service. One IP, multiple domains.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔀</span>
                            <span class="use-case-title">Path Routing</span>
                        </div>
                        <div class="use-case-desc">myapp.com/api → API service, myapp.com/static → CDN service. Route by URL path prefix.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔒</span>
                            <span class="use-case-title">SSL/TLS Termination</span>
                        </div>
                        <div class="use-case-desc">Terminate HTTPS at ingress, forward plain HTTP to backend pods. Store certificates as Secrets.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Multi-Tenant SaaS Platform</div>
                    <p>Imagine running a SaaS platform with multiple customer domains:</p>
                    <ul>
                        <li><strong>customer1.myapp.com</strong> → Routes to customer1's isolated backend pods</li>
                        <li><strong>customer2.myapp.com</strong> → Routes to customer2's isolated backend pods</li>
                        <li><strong>api.myapp.com/v1/*</strong> → Routes to API v1 service</li>
                        <li><strong>api.myapp.com/v2/*</strong> → Routes to API v2 service (canary deployment)</li>
                        <li><strong>TLS certificates</strong> → cert-manager automatically provisions Let's Encrypt certs for each domain</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Ingress Traffic Flow</div>
                    <div class="ascii-content">
                                    <span class="highlight">INTERNET USERS</span>
                                          │
                                          ▼
                           ┌───────────────────────────┐
                           │     <span class="warning">CLOUD LOAD BALANCER</span>   │
                           │     (Single IP)           │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │    <span class="success">INGRESS CONTROLLER</span>     │
                           │    (nginx/traefik)        │
                           │                           │
                           │  Rules:                   │
                           │  - api.app.com → svc-api  │
                           │  - web.app.com → svc-web  │
                           │  - /admin → svc-admin     │
                           └────────────┬──────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         │                              │                              │
         ▼                              ▼                              ▼
   ┌───────────┐                  ┌───────────┐                  ┌───────────┐
   │ <span class="success">svc-api</span>   │                  │ <span class="success">svc-web</span>   │                  │ <span class="success">svc-admin</span> │
   │  (Pods)   │                  │  (Pods)   │                  │  (Pods)   │
   └───────────┘                  └───────────┘                  └───────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Service vs Ingress?" — Service provides load balancing at L4 (TCP/UDP). Ingress provides L7 (HTTP) features like path-based routing, virtual hosts, and SSL termination. You need an Ingress Controller to make Ingress work — common choices are nginx-ingress, traefik, or cloud-provider controllers (ALB Ingress on AWS).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Ingress = HTTP Router + SSL + Virtual Hosts</strong>. It's like having nginx as a managed Kubernetes resource. The Ingress object defines rules, the Ingress Controller enforces them!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Why Ingress?</div>
                    <p>While Services expose applications, each LoadBalancer Service creates a separate cloud LB (expensive!). Ingress consolidates routing rules into a single entry point, using one LB for multiple services. It operates at Layer 7 (HTTP) while Services operate at Layer 4 (TCP/UDP).</p>
                </div>

                <h3>How Ingress Works</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Ingress Traffic Flow</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>🌐</span> Client → DNS → Load Balancer IP</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🚪</span> Ingress Controller (nginx/traefik)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📋</span> Match host/path to Ingress rules</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔗</span> Forward to backend Service</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📦</span> Service routes to Pod</div>
                    </div>
                </div>

                <h3>Ingress YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: tls-secret
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80</pre>
                </div>

                <h3>Popular Ingress Controllers</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🟢</span>
                        <div class="name">NGINX Ingress</div>
                        <div class="desc">Most popular, full-featured, production-ready</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔷</span>
                        <div class="name">Traefik</div>
                        <div class="desc">Cloud-native, auto-config, great UI</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔶</span>
                        <div class="name">HAProxy</div>
                        <div class="desc">High performance, battle-tested</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">☁️</span>
                        <div class="name">Cloud ALB/ELB</div>
                        <div class="desc">AWS ALB, GCP LB, Azure AG</div>
                    </div>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: pathType</div>
                    <p><strong>Exact:</strong> Matches the URL path exactly.<br>
                    <strong>Prefix:</strong> Matches on a URL path prefix split by /.<br>
                    <strong>ImplementationSpecific:</strong> Matching depends on IngressClass.</p>
                </div>
            </div>
        `,

        'cni': `
            <div class="content-card">
                <h2><span class="icon">🔌</span> CNI Plugins</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>The <strong>Container Network Interface (CNI)</strong> is a standard that defines how plugins should configure networking for containers. It works like a driver that connects Kubernetes Pods to the underlying network.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>The Problem:</strong> Docker/Containerd creates containers, but they are isolated. They need IPs. They need to talk to each other across nodes.</p>
                    <p><strong>The Solution:</strong> Kubernetes calls the CNI plugin (e.g., Calico, Flannel) and says "I just made a container, please give it an IP and wire it up".</p>
                    <p><strong>Overlay Networks:</strong> Most CNIs create a "Virtual Network" (Overlay) on top of your physical nodes. This is why every Pod gets a unique IP in the cluster.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔒</span>
                            <span class="use-case-title">Security (Calico)</span>
                        </div>
                        <div class="use-case-desc">Use Calico or Cilium if you need Network Policies (Firewall). Flannel does NOT support policies.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚀</span>
                            <span class="use-case-title">Performance (Cilium)</span>
                        </div>
                        <div class="use-case-desc">Use Cilium (eBPF) for super-fast networking that bypasses heavy Linux iptables rules.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">☁️</span>
                            <span class="use-case-title">Cloud Native (VPC CNI)</span>
                        </div>
                        <div class="use-case-desc">AWS VPC CNI gives Pods real AWS IP addresses, so they are first-class citizens in your VPC.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Home Wiring</div>
                    <p>Think of building a house (A Node):</p>
                    <ul>
                        <li><strong>Kubelet:</strong> The General Contractor. Builds the room (Container).</li>
                        <li><strong>CNI Plugin:</strong> The Electrician. comes in AFTER the room is built to run the wires (Network Interface) and install the outlet (IP Address).</li>
                        <li><strong>Result:</strong> If the Electrician (CNI) is missing or broken, the room exists but the lights don't turn on (Network unreachable).</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 CNI Workflow</div>
                    <div class="ascii-content">
       ┌────────────────────────────┐
       │        <span class="highlight">KUBELET</span>             │
       │   "Creating Pod..."        │
       └─────────────┬──────────────┘
                     │ 1. Calls CNI Binary (ADD)
                     ▼
       ┌────────────────────────────┐
       │      <span class="success">CNI PLUGIN</span>            │
       │   (Calico / Flannel)       │
       └─────────────┬──────────────┘
                     │ 2. Allocates IP (IPAM)
                     │ 3. Creates veth pair
                     │ 4. Configures Bridge
                     ▼
       ┌────────────────────────────┐
       │   <span class="highlight">POD NETWORK NAMESPACE</span>    │
       │     eth0: 10.244.1.5       │
       └────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What happens if I don't install a CNI?" — Your Nodes will be NotReady, or Pods will be stuck in <code>ContainerCreating</code> state forever because Kubelet is waiting for the CNI to assign an IP network.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>CNI = Cable/Connectivity Network Interface</strong>. It's the cable guy!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Kubernetes Network Model</div>
                    <p>Kubernetes requires that:<br>
                    • Every Pod gets its own IP address<br>
                    • Pods on any node can communicate with all other Pods without NAT<br>
                    • Agents on a node can communicate with all Pods on that node<br>
                    CNI plugins implement this model using various technologies.</p>
                </div>

                <h3>How CNI Works</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Pod Network Setup</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📦</span> Kubelet creates Pod sandbox</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔌</span> Calls CNI plugin with ADD command</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔗</span> Create veth pair (pod ↔ host)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🌉</span> Connect to bridge or overlay</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🏷️</span> Assign IP from IPAM</div>
                    </div>
                </div>

                <h3>Popular CNI Plugins</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>CNI</th>
                                <th>Network Type</th>
                                <th>Key Features</th>
                                <th>Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Calico</span></td>
                                <td>BGP / VXLAN</td>
                                <td>Network Policies, high performance</td>
                                <td>Large clusters, security-focused</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Flannel</span></td>
                                <td>VXLAN overlay</td>
                                <td>Simple, lightweight</td>
                                <td>Small clusters, beginners</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">Cilium</span></td>
                                <td>eBPF</td>
                                <td>L7 policies, observability</td>
                                <td>Advanced security, service mesh</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Weave</span></td>
                                <td>Mesh overlay</td>
                                <td>Encryption, multicast</td>
                                <td>Hybrid cloud, encrypted traffic</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>eBPF vs iptables</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Cilium's eBPF Advantage</div>
                    <p><strong>iptables</strong>: Traditional Linux firewall. Rules are traversed sequentially O(n). Performance degrades with large rule sets.<br><br>
                    <strong>eBPF (extended Berkeley Packet Filter)</strong>: Runs custom programs in the Linux kernel. O(1) hash-based lookups. Provides L7 visibility, faster packet processing, and programmable network policies without kernel modifications.</p>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: veth Pairs</div>
                    <p>A <strong>veth pair</strong> is like a virtual Ethernet cable. One end goes in the Pod's network namespace, the other stays on the host. Traffic entering one end exits the other. This is how Pods connect to the host network!</p>
                </div>
            </div>
        `,

        'volumes': `
            <div class="content-card">
                <h2><span class="icon">📁</span> Volumes</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>Volume</strong> is a directory accessible to containers in a Pod. Unlike container filesystems, Volumes preserve data across container restarts and can be shared between containers in the same Pod.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why Volumes?</strong> Container filesystems are ephemeral — when a container restarts, all data is lost. Volumes solve this by providing persistent storage that outlives container restarts (though not pod deletions for most types).</p>
                    <p>Volumes have a lifecycle tied to the Pod. When Pod is deleted, most volumes are removed too. For truly persistent storage, use PersistentVolumes which exist independently of Pods.</p>
                    <p><strong>Key insight:</strong> Different volume types for different purposes: emptyDir (temporary scratch space), hostPath (node filesystem), configMap/secret (inject config), and cloud volumes (EBS, GCE PD) for persistence.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📝</span>
                            <span class="use-case-title">emptyDir</span>
                        </div>
                        <div class="use-case-desc">Scratch space, cache, shared data between containers in same pod. Empty on creation, deleted with pod.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚙️</span>
                            <span class="use-case-title">configMap/secret</span>
                        </div>
                        <div class="use-case-desc">Mount configuration files or secrets as files in container. Auto-updates when source changes.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💽</span>
                            <span class="use-case-title">persistentVolumeClaim</span>
                        </div>
                        <div class="use-case-desc">Claim storage from PersistentVolumes. Data persists beyond pod lifecycle. For databases!</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Log Processing Sidecar</div>
                    <p>Imagine a pod with app container + log shipper sidecar:</p>
                    <ul>
                        <li><strong>emptyDir volume:</strong> Mounted at /var/log/app in both containers</li>
                        <li><strong>App container:</strong> Writes logs to /var/log/app/app.log</li>
                        <li><strong>Sidecar container:</strong> Reads from /var/log/app/app.log, ships to Elasticsearch</li>
                        <li><strong>Container restart:</strong> emptyDir data persists, log shipper continues without data loss</li>
                        <li><strong>Pod deletion:</strong> emptyDir is removed — acceptable for logs already shipped</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Volume Types and Lifecycle</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                              <span class="highlight">POD: web-app</span>                                │
└──────────────────────────────────────────────────────────────────────────┘
     │                              │                              │
     ▼                              ▼                              ▼
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│ <span class="success">emptyDir</span>    │            │ <span class="warning">configMap</span>   │            │<span class="success">PVC: db-data</span>│
│             │            │             │            │             │
│ /tmp/cache  │            │ /etc/config │            │ /var/lib/db │
│             │            │             │            │             │
│ Temp data   │            │ nginx.conf  │            │ Database    │
│ Lost with   │            │ app.yaml    │            │ data        │
│ pod delete  │            │ Auto-update │            │ PERSISTS!   │
└─────────────┘            └─────────────┘            └──────┬──────┘
                                                             │
                                                             ▼
                                                   ┌─────────────────┐
                                                   │ <span class="highlight">PersistentVolume</span>│
                                                   │   (EBS, NFS,    │
                                                   │   GCE PD, etc)  │
                                                   │   Lives beyond  │
                                                   │   pod lifecycle │
                                                   └─────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "emptyDir vs PVC?" — emptyDir is temporary storage created with pod, deleted with pod — use for cache, scratch space, sidecar communication. PVC claims storage from a PersistentVolume that exists independently — use for databases, persistent application data.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember volume lifecycles: <strong>emptyDir = Pod lifetime</strong>, <strong>hostPath = Node lifetime</strong>, <strong>PVC = Until you delete it</strong>. Choose based on how long you need the data!</p>
                </div>

                <h3>Why Volumes?</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">💾</span>
                        <div class="name">Data Persistence</div>
                        <div class="desc">Survive container restarts</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔄</span>
                        <div class="name">Data Sharing</div>
                        <div class="desc">Share between containers in Pod</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⚙️</span>
                        <div class="name">Configuration</div>
                        <div class="desc">Mount ConfigMaps/Secrets as files</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🌍</span>
                        <div class="name">External Storage</div>
                        <div class="desc">Connect to cloud/network storage</div>
                    </div>
                </div>

                <h3>Volume Types</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Lifetime</th>
                                <th>Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">emptyDir</span></td>
                                <td>Pod lifetime</td>
                                <td>Scratch space, caching, sidecar sharing</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">hostPath</span></td>
                                <td>Node lifetime</td>
                                <td>Node-level logs, Docker socket access</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">configMap</span></td>
                                <td>ConfigMap lifetime</td>
                                <td>Application configuration files</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">secret</span></td>
                                <td>Secret lifetime</td>
                                <td>Credentials, TLS certs</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">persistentVolumeClaim</span></td>
                                <td>PVC/PV lifetime</td>
                                <td>Databases, stateful apps</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Volume YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: Pod
metadata:
  name: multi-volume-pod
spec:
  containers:
  - name: app
    image: my-app:v1
    volumeMounts:
    - name: cache
      mountPath: /cache
    - name: config
      mountPath: /etc/config
    - name: secrets
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: cache
    emptyDir: {}              # Scratch space
  - name: config
    configMap:
      name: app-config        # From ConfigMap
  - name: secrets
    secret:
      secretName: app-secrets # From Secret</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: emptyDir Medium</div>
                    <p>By default, emptyDir uses disk storage. Set <code>medium: Memory</code> to use tmpfs (RAM-backed). Great for high-speed caching but data is lost on Pod restart!</p>
                </div>
            </div>
        `,

        'pv': `
            <div class="content-card">
                <h2><span class="icon">💽</span> PersistentVolume (PV) & PVC</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>PersistentVolume (PV)</strong> is the actual piece of storage in the cluster (like a hard drive). A <strong>PersistentVolumeClaim (PVC)</strong> is a request for storage by a user (like a ticket claiming that drive).</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why separation?</strong> Developers (who write Pods) shouldn't need to know if the storage is AWS EBS, Google PD, or NFS. They just want "10GB of storage".</p>
                    <p>So, Admin creates <strong>PV</strong> (the actual disk). Developer creates <strong>PVC</strong> ("I need 10GB"). Kubernetes <strong>binds</strong> the PVC to a matching PV. The Pod then uses the PVC.</p>
                    <p><strong>StorageClass:</strong> Automates this! Instead of manually creating PVs, you create a PVC requesting a StorageClass (like "standard"), and Kubernetes continually provisions the PV for you.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🗄️</span>
                            <span class="use-case-title">Databases</span>
                        </div>
                        <div class="use-case-desc">MySQL, PostgreSQL, MongoDB pods need widely persistent storage that survives pod restarts.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🖼️</span>
                            <span class="use-case-title">File Uploads</span>
                        </div>
                        <div class="use-case-desc">Web apps storing user-uploaded images/PDFs on a shared NFS volume via PVC.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📦</span>
                            <span class="use-case-title">Stateful Sets</span>
                        </div>
                        <div class="use-case-desc">Each pod in a StatefulSet gets its own unique PVC via volumeClaimTemplates.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Laptop Charger</div>
                    <p>Think of it like power outlets:</p>
                    <ul>
                        <li><strong>PV (The Outlet):</strong> The actual resource provided by the building (Admin). It has properties (Voltage/Size).</li>
                        <li><strong>PVC (The Plug):</strong> Your request to connect. "I need a 3-pin plug".</li>
                        <li><strong>Pod (The Laptop):</strong> Uses the plug to get power.</li>
                        <li><strong>Binding:</strong> Plugging the claim into the outlet. If you have a plug but no matching outlet, you wait!</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 PV / PVC Binding Flow</div>
                    <div class="ascii-content">
       ┌────────────────────────────┐
       │      <span class="success">POD (Developer)</span>       │
       │                            │
       │  volumes:                  │
       │    - name: data            │
       │      persistentVolumeClaim:│
       │        claimName: my-claim │  ◄── Refers to PVC
       └────────────────────────────┘
                     │
                     ▼
       ┌────────────────────────────┐
       │     <span class="warning">PVC (Claim Ticket)</span>     │
       │    "I need 10GB RWO"       │
       └─────────────┬──────────────┘
                     │ BINDING (Kubernetes matches them)
                     ▼
       ┌────────────────────────────┐
       │     <span class="highlight">PV (Actual Storage)</span>    │
       │    10GB EBS Volume         │
       └─────────────┬──────────────┘
                     │ Maps to
                     ▼
             [ AWS / GCE / NFS ]
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What are Access Modes?" — <strong>RWO</strong> (ReadWriteOnce): Mounted by single node (Block storage like EBS). <strong>ROX</strong> (ReadOnlyMany): Read by many nodes. <strong>RWX</strong> (ReadWriteMany): Read/Write by many nodes (NFS, EFS). Most databases need RWO!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>PV = Provisioned Volume</strong> (Admin side). <strong>PVC = Please Volume Claim</strong> (User side request).</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: PV vs Volume</div>
                    <p>Regular Volumes are tied to Pod lifecycle. PVs exist independently—they persist after Pod deletion. Think of PVs as the "physical disk" and PVCs as "disk claims" that Pods use to request storage.</p>
                </div>

                <h3>PV Lifecycle</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ PV States</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📦</span> Available: Not bound to any PVC</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔗</span> Bound: Linked to a PVC</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔓</span> Released: PVC deleted, not available</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>❌</span> Failed: Reclaim failed</div>
                    </div>
                </div>

                <h3>PV YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce          # RWO: single node
  # - ReadOnlyMany         # ROX: many nodes read-only
  # - ReadWriteMany        # RWX: many nodes read-write
  persistentVolumeReclaimPolicy: Retain  # or Delete, Recycle
  storageClassName: fast-ssd
  # Static provisioning example (NFS)
  nfs:
    server: nfs-server.example.com
    path: /exports/data</pre>
                </div>

                <h3>Reclaim Policies</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Policy</th>
                                <th>Behavior</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-green">Retain</span></td>
                                <td>Keep PV after PVC deletion (manual cleanup)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Delete</span></td>
                                <td>Delete PV and underlying storage</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">Recycle</span></td>
                                <td>Basic scrub (rm -rf), deprecated</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'pvc': `
            <div class="content-card">
                <h2><span class="icon">📝</span> PersistentVolumeClaim (PVC)</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>PersistentVolumeClaim (PVC)</strong> is a request for storage by a user. It is similar to a Pod requesting compute resources—Pods consume node resources, PVCs consume PV resources.</p>
                </div>

                <h3>PVC Binding Flow</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ PVC → PV Binding</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📝</span> User creates PVC (request)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔍</span> Control plane finds matching PV</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔗</span> Binds PVC to PV (1:1 mapping)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📦</span> Pod mounts PVC as volume</div>
                    </div>
                </div>

                <h3>PVC YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast-ssd  # Triggers dynamic provisioning

---
# Using PVC in a Pod
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: app
    image: my-app:v1
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: my-pvc</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Volume Expansion</div>
                    <p>If the StorageClass has <code>allowVolumeExpansion: true</code>, you can increase PVC size by editing the spec. The underlying volume grows automatically. Note: shrinking is NOT supported!</p>
                </div>
            </div>
        `,

        'storage-class': `
            <div class="content-card">
                <h2><span class="icon">🏭</span> StorageClass</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>StorageClass</strong> provides a way for administrators to describe different "classes" of storage (e.g., fast SSD, cheap HDD). It enables dynamic provisioning of PersistentVolumes when users create PVCs.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Static vs Dynamic:</strong> Old way (Static): Admin manually creates 10 PVs. User claims one. New way (Dynamic): Admin creates 1 StorageClass. User asks for 10GB. StorageClass <em>automatically</em> talks to AWS/GCP and creates the disk.</p>
                    <p><strong>Provisioner:</strong> The specialized plugin (e.g., <code>kubernetes.io/aws-ebs</code>) that knows how to create the actual storage.</p>
                    <p><strong>Reclaim Policy:</strong> What happens when PVC is deleted? <code>Delete</code> (Disk destroyed) or <code>Retain</code> (Disk kept safe).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚡</span>
                            <span class="use-case-title">Tiered Storage</span>
                        </div>
                        <div class="use-case-desc">"Gold" class (SSD, IOPS) for Databases. "Bronze" class (HDD, cheap) for Logs/Backups.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔄</span>
                            <span class="use-case-title">Volume Expansion</span>
                        </div>
                        <div class="use-case-desc">Enable <code>allowVolumeExpansion: true</code>. When DB fills up, just edit PVC size: 10GB -> 20GB. Magic!</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🌐</span>
                            <span class="use-case-title">Multi-Zone</span>
                        </div>
                        <div class="use-case-desc">StorageClass can enforce <code>volumeBindingMode: WaitForFirstConsumer</code> to ensure disk is created in the SAME zone as the Pod.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Restaurant Menu</div>
                    <p>Think of Storage as ordering food:</p>
                    <ul>
                        <li><strong>Static Provisioning:</strong> Buffet. Chef cooks 10 burgers (PVs) and puts them under heat lamps. If you want one, you take it. If 11 people come, 1 goes hungry.</li>
                        <li><strong>Dynamic Provisioning (StorageClass):</strong> A la Carte Menu. You order "1 Burger" (PVC). The Kitchen (Provisioner) cooks it fresh just for you.</li>
                        <li><strong>StorageClass Types:</strong> "Premium Menu" (Steak/SSD) vs "Value Menu" (Fries/HDD).</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Dynamic Provisioning Steps</div>
                    <div class="ascii-content">
       ┌───────────────┐
       │  <span class="highlight">USER</span>         │
       │  "Need 10GB"  │
       └───────┬───────┘
               │ 1. Creates PVC
               ▼
       ┌───────────────┐       ┌────────────────────────────┐
       │     <span class="warning">PVC</span>       │ ─────►│      <span class="success">STORAGE CLASS</span>         │
       │ (Pending...)  │       │      (The "Template")      │
       └───────┬───────┘       └──────────────┬─────────────┘
               │                              │ 2. Triggers Provider
               │                              ▼
               │                   ┌────────────────────┐
               │         3. API    │    <span class="highlight">CLOUD PROVIDER</span>  │
               │        Call       │    (AWS / GCP)     │
               │                   └──────────┬─────────┘
               │                              │ 4. Creates Disk
               ▼                              ▼
       ┌───────────────┐           ┌────────────────────┐
       │     <span class="warning">PVC</span>       │ ◄=========│        <span class="success">PV</span>          │
       │   (Bound!)    │  5. Binds │   (Actual Disk)    │
       └───────────────┘           └────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "My Pod is Pending with 'volume node affinity conflict'. Why?" — You created a PVC and the dynamic provisioner created the disk in Zone A. But your Pod was scheduled in Zone B. Fix: Use <code>WaitForFirstConsumer</code> in StorageClass so disk creation waits until Pod is scheduled!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>PVC = Ticket</strong>. <strong>StorageClass = Menu</strong>. <strong>PV = The Meal</strong>.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Dynamic Provisioning</div>
                    <p>Instead of pre-creating PVs (static provisioning), StorageClasses let PVs be created on-demand. When a PVC requests a StorageClass, the provisioner automatically creates a matching PV from the underlying storage system (AWS EBS, GCP PD, etc.).</p>
                </div>

                <h3>Dynamic Provisioning Flow</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Dynamic PV Creation</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📝</span> User creates PVC with StorageClass</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔍</span> No matching PV found</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🏭</span> StorageClass provisioner triggered</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>☁️</span> Create disk in cloud (EBS/PD/Azure)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>💽</span> PV auto-created and bound to PVC</div>
                    </div>
                </div>

                <h3>StorageClass YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs  # or pd.csi.storage.gke.io
parameters:
  type: gp3                          # AWS EBS type
  fsType: ext4
  encrypted: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer  # Delay until Pod scheduled</pre>
                </div>

                <h3>Common Provisioners</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Cloud</th>
                                <th>Provisioner</th>
                                <th>Storage Types</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-orange">AWS</span></td>
                                <td>ebs.csi.aws.com</td>
                                <td>gp2, gp3, io1, io2, st1, sc1</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">GCP</span></td>
                                <td>pd.csi.storage.gke.io</td>
                                <td>pd-standard, pd-ssd, pd-balanced</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">Azure</span></td>
                                <td>disk.csi.azure.com</td>
                                <td>Standard_LRS, Premium_LRS</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: WaitForFirstConsumer</div>
                    <p>By default, PVs are provisioned immediately. Setting <code>volumeBindingMode: WaitForFirstConsumer</code> delays provisioning until a Pod using the PVC is scheduled. This ensures the volume is created in the same zone as the Pod!</p>
                </div>
            </div>
        `,

        'rbac': `
            <div class="content-card">
                <h2><span class="icon">🔐</span> RBAC - Role-Based Access Control</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>RBAC</strong> is a method of regulating access to cluster resources based on the roles of individual users. Kubernetes RBAC uses Role/ClusterRole to define permissions and RoleBinding/ClusterRoleBinding to grant them to subjects.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why RBAC matters?</strong> In a multi-team cluster, you don't want developers accidentally deleting production databases! RBAC lets you say "Team A can only read pods in namespace-a" or "CI/CD can deploy to staging but not production".</p>
                    <p>RBAC has 4 key resources: <strong>Role</strong> (permissions within a namespace), <strong>ClusterRole</strong> (cluster-wide permissions), <strong>RoleBinding</strong> (links Role to users/groups in namespace), <strong>ClusterRoleBinding</strong> (links ClusterRole cluster-wide).</p>
                    <p><strong>Key insight:</strong> RBAC answers the question "Can subject X perform verb Y on resource Z in namespace N?" — where subject is User/Group/ServiceAccount, verb is get/list/create/delete, resource is pods/services/etc.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">👥</span>
                            <span class="use-case-title">Team Isolation</span>
                        </div>
                        <div class="use-case-desc">Team A can only access namespace-a. Team B only namespace-b. Each team manages their own resources.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🤖</span>
                            <span class="use-case-title">Service Accounts</span>
                        </div>
                        <div class="use-case-desc">CI/CD pipeline uses ServiceAccount with deploy permissions. Prometheus uses SA to scrape metrics from all pods.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔒</span>
                            <span class="use-case-title">Least Privilege</span>
                        </div>
                        <div class="use-case-desc">Read-only access for auditors. Limited write for developers. Full admin only for platform team.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Enterprise Platform Team</div>
                    <p>Imagine a large company with multiple teams:</p>
                    <ul>
                        <li><strong>Platform team:</strong> ClusterRole with full admin access across all namespaces</li>
                        <li><strong>Dev team:</strong> Role in dev namespace — can create deployments, services, but not secrets or RBAC</li>
                        <li><strong>QA team:</strong> Read-only Role in staging namespace — can view logs and pods, but cannot modify</li>
                        <li><strong>CI/CD pipeline:</strong> ServiceAccount with Role to apply manifests only in specific namespaces</li>
                        <li><strong>Monitoring:</strong> ClusterRole to read pods/nodes/metrics from all namespaces</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 RBAC Relationship: Role → RoleBinding → Subject</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                             <span class="highlight">NAMESPACE: production</span>                        │
└──────────────────────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────────────────┐
   │                          <span class="success">ROLE: pod-reader</span>                          │
   │                                                                     │
   │  rules:                                                             │
   │  - apiGroups: [""]                                                  │
   │    resources: ["pods", "pods/log"]                                  │
   │    verbs: ["get", "list", "watch"]                                  │
   └────────────────────────────┬────────────────────────────────────────┘
                                │
                                │ (CONNECTED BY)
                                ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                       <span class="warning">ROLEBINDING: read-pods</span>                        │
   │                                                                     │
   │  roleRef:                                                           │
   │    kind: Role                                                       │
   │    name: pod-reader                                                 │
   │                                                                     │
   │  subjects:                                                          │
   │  - kind: User        │  - kind: ServiceAccount  │  - kind: Group   │
   │    name: jane        │    name: monitoring      │    name: devs    │
   └─────────────────────────────────────────────────────────────────────┘
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
            ┌─────────────┐          ┌─────────────┐
            │  <span class="success">User: jane</span> │          │<span class="success">SA: monitor</span> │
            │  Can read   │          │  Can read   │
            │  pods only  │          │  pods only  │
            └─────────────┘          └─────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Role vs ClusterRole?" — Role is namespace-scoped (works within one namespace). ClusterRole is cluster-wide (can grant permissions across all namespaces or for cluster-scoped resources like nodes). Use RoleBinding to bind either type within a namespace, ClusterRoleBinding for cluster-wide bindings.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember RBAC as <strong>"WHO-CAN-WHAT-WHERE"</strong>: WHO (Subject: User/Group/SA) CAN (Verbs: get/create/delete) WHAT (Resources: pods/services) WHERE (Namespace or Cluster-wide)!</p>
                </div>

                <h3>RBAC Components</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📜</span>
                        <div class="name">Role</div>
                        <div class="desc">Namespace-scoped permissions</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🌐</span>
                        <div class="name">ClusterRole</div>
                        <div class="desc">Cluster-wide permissions</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔗</span>
                        <div class="name">RoleBinding</div>
                        <div class="desc">Binds Role to subjects in namespace</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🌍</span>
                        <div class="name">ClusterRoleBinding</div>
                        <div class="desc">Binds ClusterRole cluster-wide</div>
                    </div>
                </div>

                <h3>Role YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: default
rules:
- apiGroups: [""]           # Core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: developer
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: my-service-account
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Verbs</div>
                    <p>Common verbs: <code>get</code>, <code>list</code>, <code>watch</code>, <code>create</code>, <code>update</code>, <code>patch</code>, <code>delete</code>. Use <code>*</code> for all verbs (dangerous!).</p>
                </div>
            </div>
        `,

        'configmap': `
            <div class="content-card">
                <h2><span class="icon">⚙️</span> ConfigMap</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>ConfigMap</strong> is an API object used to store non-confidential data as key-value pairs. Pods can consume ConfigMaps as environment variables, command-line arguments, or as configuration files in a volume.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why ConfigMaps?</strong> You don't want configuration baked into Docker images. Hardcoded values mean rebuilding images for every environment. ConfigMaps let you externalize configuration — same image, different configuration for dev/staging/prod.</p>
                    <p>ConfigMaps store key-value pairs or even entire files. You can mount them as files in a volume (great for config files like nginx.conf) or inject as environment variables (great for simple settings).</p>
                    <p><strong>Key insight:</strong> When you update a ConfigMap, mounted files update automatically within ~1 minute. But environment variables require pod restart to pick up new values!</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔤</span>
                            <span class="use-case-title">Environment Variables</span>
                        </div>
                        <div class="use-case-desc">Inject simple values: LOG_LEVEL=debug, DB_HOST=postgres, FEATURE_FLAGS=true.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📁</span>
                            <span class="use-case-title">Config Files</span>
                        </div>
                        <div class="use-case-desc">Mount nginx.conf, application.yaml, prometheus.yml as files inside containers.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏷️</span>
                            <span class="use-case-title">Feature Flags</span>
                        </div>
                        <div class="use-case-desc">Store feature toggles. Update ConfigMap → apps pick up changes without redeploy.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Multi-Environment Deployment</div>
                    <p>Imagine deploying same app to different environments:</p>
                    <ul>
                        <li><strong>dev-config:</strong> ConfigMap with LOG_LEVEL=debug, DB_HOST=dev-postgres, REPLICA_COUNT=1</li>
                        <li><strong>staging-config:</strong> ConfigMap with LOG_LEVEL=info, DB_HOST=staging-postgres, REPLICA_COUNT=2</li>
                        <li><strong>prod-config:</strong> ConfigMap with LOG_LEVEL=warn, DB_HOST=prod-postgres, REPLICA_COUNT=10</li>
                        <li><strong>Same Docker image:</strong> Just inject different ConfigMap per namespace</li>
                        <li><strong>Hot reload:</strong> Update ConfigMap for feature flag → nginx config reloads via inotify watcher</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 ConfigMap Consumption Methods</div>
                    <div class="ascii-content">
                           ┌──────────────────────────────────┐
                           │      <span class="highlight">CONFIGMAP: app-config</span>       │
                           │                                  │
                           │  data:                           │
                           │    LOG_LEVEL: "debug"            │
                           │    DB_HOST: "postgres.svc"       │
                           │    nginx.conf: |                 │
                           │      server { ... }              │
                           └────────────────┬─────────────────┘
                                            │
              ┌─────────────────────────────┴─────────────────────────────┐
              │                                                           │
              ▼                                                           ▼
   ┌───────────────────────────┐                           ┌───────────────────────────┐
   │    <span class="success">AS ENVIRONMENT VARS</span>     │                           │    <span class="warning">AS MOUNTED FILES</span>        │
   │                           │                           │                           │
   │  env:                     │                           │  volumeMounts:            │
   │  - name: LOG_LEVEL        │                           │  - name: config           │
   │    valueFrom:             │                           │    mountPath: /etc/nginx  │
   │      configMapKeyRef:     │                           │                           │
   │        name: app-config   │                           │  File created:            │
   │        key: LOG_LEVEL     │                           │  /etc/nginx/nginx.conf    │
   └───────────────────────────┘                           └───────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "ConfigMap vs Secret?" — Both store configuration. ConfigMap for non-sensitive data (config files, feature flags). Secret for sensitive data (passwords, API keys). Secrets are base64-encoded and get special RBAC consideration. Use the right one for the right purpose!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>ConfigMap = "Externalized Config"</strong>. Think of the 12-factor app principle: "Store config in the environment". ConfigMaps let you do exactly that in Kubernetes!</p>
                </div>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🔤</span>
                        <div class="name">Environment Variables</div>
                        <div class="desc">Inject as env vars</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📁</span>
                        <div class="name">Volume Mount</div>
                        <div class="desc">Mount as files</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⌨️</span>
                        <div class="name">Command Args</div>
                        <div class="desc">Use in container command</div>
                    </div>
                </div>

                <h3>ConfigMap YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # Key-value pairs
  DATABASE_HOST: "mysql.default.svc"
  LOG_LEVEL: "info"
  # File-like keys
  config.json: |
    {
      "feature_flag": true,
      "max_connections": 100
    }

---
# Using ConfigMap in Pod
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: my-app:v1
    envFrom:
    - configMapRef:
        name: app-config    # All keys as env vars
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DATABASE_HOST</pre>
                </div>
            </div>
        `,

        'secret': `
            <div class="content-card">
                <h2><span class="icon">🔒</span> Secret</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>Secret</strong> is an object that contains sensitive data such as passwords, tokens, or keys. Secrets are similar to ConfigMaps but are specifically intended to hold confidential data.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What are Secrets for?</strong> Any sensitive data that your application needs: database passwords, API keys, TLS certificates, SSH keys. You don't want these hardcoded in your YAML files or Docker images!</p>
                    <p>Secrets are stored in etcd (base64-encoded by default, NOT encrypted). For production: enable encryption at rest, use external secret managers like HashiCorp Vault, AWS Secrets Manager, or the External Secrets Operator.</p>
                    <p><strong>Key insight:</strong> Kubernetes mounts Secrets into pods as files or environment variables. When a Secret is updated, mounted files update automatically (but env vars require pod restart).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🗝️</span>
                            <span class="use-case-title">Database Credentials</span>
                        </div>
                        <div class="use-case-desc">Store username, password, connection strings. Mount as env vars or files in app containers.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔐</span>
                            <span class="use-case-title">TLS Certificates</span>
                        </div>
                        <div class="use-case-desc">kubernetes.io/tls type Secret stores cert + key for Ingress HTTPS termination.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🐳</span>
                            <span class="use-case-title">Image Pull Secrets</span>
                        </div>
                        <div class="use-case-desc">kubernetes.io/dockerconfigjson type for pulling from private container registries.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Banking Application Security</div>
                    <p>Imagine securing a banking application:</p>
                    <ul>
                        <li><strong>Database secrets:</strong> Postgres credentials stored in Secret, mounted as /etc/db/credentials in pod</li>
                        <li><strong>API keys:</strong> External payment gateway API key stored in Secret, injected as env var</li>
                        <li><strong>TLS certificates:</strong> Let's Encrypt certs managed by cert-manager, stored as Secrets, used by Ingress</li>
                        <li><strong>Encryption at rest:</strong> Enabled via EncryptionConfiguration with AES-256 for all Secrets in etcd</li>
                        <li><strong>External secrets:</strong> HashiCorp Vault integration via External Secrets Operator for dynamic credentials</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Secret Usage Patterns</div>
                    <div class="ascii-content">
                           ┌──────────────────────────────────┐
                           │         <span class="highlight">SECRET: db-creds</span>        │
                           │  type: Opaque                   │
                           │  data:                          │
                           │    username: YWRtaW4=  (base64) │
                           │    password: cGFzc3dvcmQ=       │
                           └────────────────┬─────────────────┘
                                            │
              ┌─────────────────────────────┴─────────────────────────────┐
              │                                                           │
              ▼                                                           ▼
   ┌───────────────────────────┐                           ┌───────────────────────────┐
   │     <span class="success">MOUNTED AS FILE</span>        │                           │    <span class="warning">MOUNTED AS ENV VAR</span>      │
   │                           │                           │                           │
   │  volumeMounts:            │                           │  env:                     │
   │  - name: db-secret        │                           │  - name: DB_USER          │
   │    mountPath: /etc/db     │                           │    valueFrom:             │
   │                           │                           │      secretKeyRef:        │
   │  Files created:           │                           │        name: db-creds     │
   │  /etc/db/username         │                           │        key: username      │
   │  /etc/db/password         │                           │                           │
   └───────────────────────────┘                           └───────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Are Secrets secure by default?" — NO! Secrets are only base64-encoded, not encrypted. Anyone with API access can decode them. For production security: enable RBAC (limit who can read secrets), enable encryption at rest in etcd, use external secret managers, and avoid logging secret values.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Secret = ConfigMap + Sensitive Intent</strong>. They work the same way (env vars, files, volumes) but Secrets signal "this is sensitive data" and get special RBAC treatment. Always use Secrets for passwords, keys, tokens!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Secret Security</div>
                    <p>By default, Secrets are stored base64-encoded (NOT encrypted!) in etcd. Enable encryption at rest for production: <code>--encryption-provider-config</code>. Also consider external secrets managers like HashiCorp Vault.</p>
                </div>

                <h3>Secret Types</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Opaque</span></td>
                                <td>Generic user-defined data (default)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">kubernetes.io/tls</span></td>
                                <td>TLS certificates (tls.crt, tls.key)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">kubernetes.io/dockerconfigjson</span></td>
                                <td>Docker registry credentials</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">kubernetes.io/service-account-token</span></td>
                                <td>ServiceAccount tokens (auto-created)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Secret YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=        # base64 encoded "admin"
  password: cGFzc3dvcmQxMjM= # base64 encoded "password123"

---
# Or use stringData (auto-encoded)
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  username: admin
  password: password123</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Base64 Encoding</div>
                    <p>Encode: <code>echo -n "password" | base64</code><br>
                    Decode: <code>echo "cGFzc3dvcmQ=" | base64 -d</code><br>
                    Use <code>stringData</code> in YAML to avoid manual encoding.</p>
                </div>
            </div>
        `,

        'network-policy': `
            <div class="content-card">
                <h2><span class="icon">🛡️</span> Network Policies</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>NetworkPolicy</strong> is a specification of how groups of Pods are allowed to communicate with each other and other network endpoints. It uses labels to select Pods and defines ingress/egress rules.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why use them?</strong> Kubernetes is "flat" networking by default — any pod can talk to any pod, even across namespaces! This is bad for security. If a compromised frontend can talk to your payment database, you're in trouble.</p>
                    <p>NetworkPolicy works like a whitelist. "Only allow traffic from Pod A to Pod B on port 80". Once you apply a policy to a pod, it goes into "deny all" mode for anything not listed.</p>
                    <p><strong>Key insight:</strong> NetworkPolicies are enforced by the CNI plugin (Calico, Cilium, etc.). If your CNI doesn't support them (like Flannel), creating the policy will have NO EFFECT!</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🧱</span>
                            <span class="use-case-title">Namespace Isolation</span>
                        </div>
                        <div class="use-case-desc">"Deny All" policy: prevents pods in this namespace from talking to any other namespace.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔒</span>
                            <span class="use-case-title">Database Lockdown</span>
                        </div>
                        <div class="use-case-desc">Only allow traffic to PostgreSQL port 5432 from pods with label <code>role=backend</code>.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🌐</span>
                            <span class="use-case-title">Egress Control</span>
                        </div>
                        <div class="use-case-desc">Prevent your backend from reaching out to the public internet (except approved external APIs).</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: VIP Party</div>
                    <p>Think of your cluster as a Club:</p>
                    <ul>
                        <li><strong>Default:</strong> Open bar. Everyone can talk to everyone. Chaos!</li>
                        <li><strong>NetworkPolicy:</strong> The Bouncers / Velvet Rope.</li>
                        <li><strong>Rule:</strong> "Only people with 'Staff' badges (Label) can enter the 'Kitchen' area (DB Pod)".</li>
                        <li><strong>Result:</strong> If a 'Guest' (Frontend) tries to enter the Kitchen directly, the Bouncer stops them. They must ask a Waiter (Backend Service).</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 NetworkPolicy Logic</div>
                    <div class="ascii-content">
                                    ┌──────────────────────┐
                                    │    <span class="success">ALLOWED POD</span>       │
                                    │    role: backend     │
                                    └──────────┬───────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               │                               │ ✅ ALLOWED                    │
               │                               ▼                               │
┌──────────────┴───────┐        ┌──────────────────────────────┐        ┌──────┴───────┐
│ <span class="warning">BLOCKED POD</span>          │        │      <span class="highlight">PROTECTED DB</span>            │        │ <span class="warning">BLOCKED POD</span>  │
│ role: frontend       │   ❌   │      (Postgres)              │   ❌   │ role: other  │
│                      │ ──────►│                              │◄────── │              │
└──────────────────────┘        │ Policy:                      │        └──────────────┘
                                │   Ingress:                   │
                                │     - from:                  │
                                │       - podSelector:         │
                                │           matchLabels:       │
                                │             role: backend    │
                                └──────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "I created a NetworkPolicy but traffic is still flowing. Why?" — Check your CNI! If you are using simple CNI like Flannel or AWS VPC CNI (without policy helper), NetworkPolicies are ignored completely. You need Calico, Cilium, or Antrea.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>NetworkPolicy = "The Whitelist"</strong>. Once you create one, everything else is blocked. It's safe by default only AFTER you turn it on.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Default Behavior</div>
                    <p>By default, Pods are non-isolated—all traffic is allowed. Once a NetworkPolicy selects a Pod, that Pod becomes isolated and only explicitly allowed traffic is permitted. The CNI plugin must support NetworkPolicy (Calico, Cilium, Weave do; Flannel doesn't).</p>
                </div>

                <h3>NetworkPolicy Types</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📥</span>
                        <div class="name">Ingress</div>
                        <div class="desc">Control incoming traffic to Pods</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📤</span>
                        <div class="name">Egress</div>
                        <div class="desc">Control outgoing traffic from Pods</div>
                    </div>
                </div>

                <h3>NetworkPolicy YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api            # Apply to Pods with app=api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: frontend  # Allow from frontend namespace
    - podSelector:
        matchLabels:
          role: frontend  # OR Pods with role=frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432</pre>
                </div>

                <h3>Common Patterns</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                    </div>
                    <pre># Default deny all ingress
spec:
  podSelector: {}          # Select all pods
  policyTypes:
  - Ingress                # Empty ingress = deny all

# Allow only same-namespace traffic
spec:
  podSelector: {}
  ingress:
  - from:
    - podSelector: {}      # Any pod in same namespace</pre>
                </div>
            </div>
        `,

        'dns': `
            <div class="content-card">
                <h2><span class="icon">🌐</span> DNS / CoreDNS</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>CoreDNS</strong> is the cluster DNS server in Kubernetes. It provides service discovery by resolving Service names to ClusterIPs, allowing Pods to find and communicate with Services using DNS names.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Who needs IPs?</strong> IP addresses change every time a Pod restarts. You can't hardcode them. DNS solves this.</p>
                    <p>When you create a Service named <code>my-db</code>, CoreDNS adds a record: <code>my-db.default.svc.cluster.local -> 10.96.x.x</code>. Now your app just connects to <code>my-db</code>, and it magically works.</p>
                    <p><strong>Key insight:</strong> CoreDNS runs as... a Deployment! It's just a Pod. If it crashes, service discovery breaks. That's why it scales with the cluster.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔍</span>
                            <span class="use-case-title">Service Discovery</span>
                        </div>
                        <div class="use-case-desc">Frontend pod connects to <code>http://backend</code> instead of <code>http://10.42.1.5</code>.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🌍</span>
                            <span class="use-case-title">External Names</span>
                        </div>
                        <div class="use-case-desc">Map an internal name (<code>my-db</code>) to an external AWS RDS endpoint using <code>ExternalName</code> service.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔗</span>
                            <span class="use-case-title">Cross-Namespace</span>
                        </div>
                        <div class="use-case-desc">Access service in another namespace using FQDN: <code>db.prod.svc.cluster.local</code>.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Phone Contacts</div>
                    <p>Imagine your smartphone:</p>
                    <ul>
                        <li><strong>IP Address:</strong> A phone number (555-0199). Hard to remember, changes if they change carrier.</li>
                        <li><strong>DNS Name:</strong> Contact Name ("Mom"). Easy to remember.</li>
                        <li><strong>CoreDNS:</strong> Your Contacts App.</li>
                        <li><strong>Action:</strong> You tap "Call Mom". Phone looks up "Mom" → "555-0199" → Dials.</li>
                        <li><strong>Benefit:</strong> Mom can change her number, you just update the contact, and "Call Mom" still works.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 DNS Resolution Path</div>
                    <div class="ascii-content">
       ┌────────────────────────────┐
       │        <span class="highlight">POD (Client)</span>        │
       │   curl http://my-service   │
       └─────────────┬──────────────┘
                     │ 1. Where is 'my-service'?
                     ▼
       ┌────────────────────────────┐      ┌─────────────────────────────┐
       │      <span class="warning">CoreDNS (Service)</span>     │ ──►  │    <span class="success">KUBERNETES API</span>           │
       │      (ClusterIP 10.96.0.10)│      │    (Watches Services)       │
       └─────────────┬──────────────┘      └─────────────────────────────┘
                     │ 2. Returns 10.96.50.50
                     ▼
       ┌────────────────────────────┐
       │      <span class="highlight">POD (Client)</span>          │
       │   Connects to 10.96.50.50  │
       └─────────────┬──────────────┘
                     │ 3. Traffic Flow (via Kube-Proxy)
                     ▼
       ┌────────────────────────────┐
       │     <span class="highlight">TARGET SERVICE</span>         │
       └────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What is FQDN?" — Fully Qualified Domain Name. In K8s, it looks like: <code>&lt;service&gt;.&lt;namespace&gt;.svc.cluster.local</code>. Knowing this structure is crucial for debugging cross-namespace communication!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>DNS = Phonebook</strong>. It maps names (people) to numbers (IPs).</p>
                </div>

                <h3>DNS Resolution Flow</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Service Discovery via DNS</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>🔍</span> Pod queries: mysql.default.svc.cluster.local</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📡</span> Request goes to CoreDNS (kube-dns ClusterIP)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📋</span> CoreDNS looks up Service in API Server</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🎯</span> Returns ClusterIP: 10.96.123.45</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📦</span> Pod connects to ClusterIP</div>
                    </div>
                </div>

                <h3>DNS Naming Convention</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">DNS Format</span>
                    </div>
                    <pre># Service DNS
{service}.{namespace}.svc.{cluster-domain}
mysql.default.svc.cluster.local

# Short names (same namespace)
mysql                    # Works within default namespace
mysql.default            # Explicitly specify namespace

# Pod DNS (for StatefulSets)
{pod-name}.{service}.{namespace}.svc.{cluster-domain}
mysql-0.mysql-headless.default.svc.cluster.local

# Headless Service returns Pod IPs directly
nslookup mysql-headless → Returns all Pod IPs</pre>
                </div>

                <h3>DNS Policies</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Policy</th>
                                <th>Behavior</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">ClusterFirst</span></td>
                                <td>DNS queries go to CoreDNS first (default)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Default</span></td>
                                <td>Inherit DNS settings from node</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">None</span></td>
                                <td>No DNS; must specify dnsConfig manually</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: ndots</div>
                    <p>The <code>ndots</code> option controls when the resolver appends search domains. Default is 5. A query like <code>mysql</code> has 0 dots, so Kubernetes appends <code>.default.svc.cluster.local</code>, <code>.svc.cluster.local</code>, etc. Set <code>ndots: 2</code> to reduce DNS lookups for external domains!</p>
                </div>
            </div>
        `,

        'namespace': `
            <div class="content-card">
                <h2><span class="icon">📦</span> Namespace</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>Namespace</strong> provides a mechanism for isolating groups of resources within a single cluster. Names of resources need to be unique within a namespace, but not across namespaces.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why Namespaces?</strong> In a shared cluster, you need boundaries. Namespaces let you divide a single cluster into multiple virtual sub-clusters — each team, environment, or application gets their own namespace.</p>
                    <p>Namespaces provide: <strong>Name scoping</strong> (two teams can have pods named "backend"), <strong>Access control</strong> (RBAC roles per namespace), <strong>Resource quotas</strong> (limit CPU/memory per namespace), and <strong>Network isolation</strong> (NetworkPolicies per namespace).</p>
                    <p><strong>Key insight:</strong> Not everything is namespace-scoped! Nodes, PersistentVolumes, ClusterRoles are cluster-wide. Use <code>kubectl api-resources --namespaced=false</code> to see what's cluster-scoped.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏢</span>
                            <span class="use-case-title">Team Isolation</span>
                        </div>
                        <div class="use-case-desc">team-a-ns, team-b-ns — each team has full control of their namespace, can't affect others.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🌍</span>
                            <span class="use-case-title">Environment Separation</span>
                        </div>
                        <div class="use-case-desc">dev, staging, production — same manifests, different namespaces, different configurations.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💰</span>
                            <span class="use-case-title">Resource Budgets</span>
                        </div>
                        <div class="use-case-desc">ResourceQuotas limit how much CPU/memory each namespace can consume. Prevent noisy neighbours!</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Multi-Tenant Platform</div>
                    <p>Imagine a SaaS company running multiple products:</p>
                    <ul>
                        <li><strong>product-a-prod</strong> — Production namespace for Product A with 100 CPU cores quota</li>
                        <li><strong>product-a-staging</strong> — Staging namespace with 20 CPU cores quota</li>
                        <li><strong>product-b-prod</strong> — Completely isolated namespace for Product B</li>
                        <li><strong>monitoring</strong> — Shared namespace for Prometheus, Grafana accessible by all</li>
                        <li><strong>Network Policies</strong> — Pods in product-a can't talk to product-b by default</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Namespace Isolation Model</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                          <span class="highlight">KUBERNETES CLUSTER</span>                              │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐
│   <span class="success">NAMESPACE: team-a</span>      │  │   <span class="warning">NAMESPACE: team-b</span>      │
│                          │  │                          │
│  ┌────────┐ ┌────────┐   │  │  ┌────────┐ ┌────────┐   │
│  │backend │ │frontend│   │  │  │backend │ │frontend│   │
│  │(same   │ │(same   │   │  │  │(same   │ │(same   │   │
│  │ name!) │ │ name!) │   │  │  │ name!) │ │ name!) │   │
│  └────────┘ └────────┘   │  │  └────────┘ └────────┘   │
│                          │  │                          │
│  ResourceQuota: 50 CPU   │  │  ResourceQuota: 30 CPU   │
│  RBAC: team-a-role       │  │  RBAC: team-b-role       │
└──────────────────────────┘  └──────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        <span class="success">CLUSTER-SCOPED RESOURCES</span>                          │
│     Nodes    |    PersistentVolumes    |    ClusterRoles    |   CRDs     │
└──────────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What are the default namespaces?" — Kubernetes creates 4: <code>default</code> (for resources without explicit namespace), <code>kube-system</code> (system components), <code>kube-public</code> (publicly accessible), <code>kube-node-lease</code> (node heartbeats). Never use default for production workloads!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Think of Namespaces as <strong>"Virtual Clusters"</strong> — same physical cluster, but logically separated. Like having different departments in one office building — they share the building but have their own floors!</p>
                </div>

                <h3>Default Namespaces</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Namespace</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">default</span></td>
                                <td>Default for objects with no namespace</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">kube-system</span></td>
                                <td>Kubernetes system components (CoreDNS, kube-proxy)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">kube-public</span></td>
                                <td>Publicly readable resources, cluster info</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">kube-node-lease</span></td>
                                <td>Node heartbeat leases for high availability</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Namespace YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    env: production
    team: platform

---
# Create resources in namespace
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: production  # Specify namespace
spec:
  containers:
  - name: app
    image: my-app:v1</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Not Everything is Namespaced</div>
                    <p>Some resources are cluster-scoped (not namespaced): Nodes, PersistentVolumes, ClusterRoles, Namespaces themselves. Check with: <code>kubectl api-resources --namespaced=false</code></p>
                </div>
            </div>
        `,

        'resource-quota': `
            <div class="content-card">
                <h2><span class="icon">📊</span> ResourceQuota</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>ResourceQuota</strong> provides constraints that limit aggregate resource consumption per namespace. It can limit the quantity of objects and total compute resources consumed.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Why Quotas?</div>
                    <p>In multi-tenant clusters, quotas prevent one team from consuming all resources. Without quotas, a single namespace could deploy unlimited Pods, consuming CPU/memory meant for other teams.</p>
                </div>

                <h3>ResourceQuota YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: production
spec:
  hard:
    # Compute resources
    requests.cpu: "10"           # Total CPU requests
    requests.memory: 20Gi        # Total memory requests
    limits.cpu: "20"             # Total CPU limits
    limits.memory: 40Gi          # Total memory limits
    
    # Object counts
    pods: "50"                   # Max pods
    services: "10"               # Max services
    secrets: "20"                # Max secrets
    configmaps: "20"             # Max configmaps
    persistentvolumeclaims: "10" # Max PVCs
    
    # Storage
    requests.storage: 100Gi      # Total storage requests</pre>
                </div>

                <h3>Quota Scopes</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Scope</th>
                                <th>Applies To</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Terminating</span></td>
                                <td>Pods with activeDeadlineSeconds set</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">NotTerminating</span></td>
                                <td>Pods without activeDeadlineSeconds</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">BestEffort</span></td>
                                <td>Pods with no resource requests/limits</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">NotBestEffort</span></td>
                                <td>Pods with at least one request/limit</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'limit-range': `
            <div class="content-card">
                <h2><span class="icon">📏</span> LimitRange</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>LimitRange</strong> sets resource constraints per-pod or per-container within a namespace. It defines default, minimum, and maximum values for CPU and memory.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Quota vs LimitRange</div>
                    <p><strong>ResourceQuota:</strong> Limits total resources in namespace (aggregate)<br>
                    <strong>LimitRange:</strong> Limits resources per Pod/Container (individual)</p>
                </div>

                <h3>LimitRange YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: LimitRange
metadata:
  name: resource-limits
  namespace: production
spec:
  limits:
  - type: Container
    default:              # Default limits if not specified
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:       # Default requests if not specified
      cpu: "100m"
      memory: "128Mi"
    min:                  # Minimum allowed
      cpu: "50m"
      memory: "64Mi"
    max:                  # Maximum allowed
      cpu: "2"
      memory: "2Gi"
  - type: Pod
    max:
      cpu: "4"
      memory: "4Gi"
  - type: PersistentVolumeClaim
    min:
      storage: 1Gi
    max:
      storage: 100Gi</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: Admission Control</div>
                    <p>LimitRange is enforced by the LimitRanger admission controller. If a Pod violates the range, the API Server rejects it immediately!</p>
                </div>
            </div>
        `,

        'labels': `
            <div class="content-card">
                <h2><span class="icon">🏷️</span> Labels & Selectors</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Labels</strong> are key-value pairs attached to objects for identification. <strong>Selectors</strong> are queries that match objects based on their labels. Together, they're the backbone of Kubernetes object organization.</p>
                </div>

                <h3>Label Syntax</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>metadata:
  labels:
    # Standard labels
    app: my-app
    version: v1.2.3
    environment: production
    
    # Recommended Kubernetes labels
    app.kubernetes.io/name: my-app
    app.kubernetes.io/instance: my-app-prod
    app.kubernetes.io/version: "1.2.3"
    app.kubernetes.io/component: backend
    app.kubernetes.io/part-of: e-commerce
    app.kubernetes.io/managed-by: helm</pre>
                </div>

                <h3>Selector Types</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">=</span>
                        <div class="name">Equality-Based</div>
                        <div class="desc">env=production, tier!=frontend</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">∈</span>
                        <div class="name">Set-Based</div>
                        <div class="desc">env in (prod, staging), tier notin (test)</div>
                    </div>
                </div>

                <h3>Selector Examples</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Equality-based (older style, used in Services)
selector:
  app: my-app
  env: production

# Set-based (used in ReplicaSets, Deployments)
selector:
  matchLabels:
    app: my-app
  matchExpressions:
  - key: env
    operator: In
    values: [production, staging]
  - key: version
    operator: Exists
  - key: deprecated
    operator: DoesNotExist</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ kubectl Label Commands</div>
                    <p>
                    <code>kubectl get pods -l app=nginx</code> - Filter by label<br>
                    <code>kubectl get pods -l 'env in (prod,stage)'</code> - Set-based<br>
                    <code>kubectl label pod my-pod version=v2</code> - Add label<br>
                    <code>kubectl label pod my-pod version-</code> - Remove label</p>
                </div>
            </div>
        `,

        'taints': `
            <div class="content-card">
                <h2><span class="icon">🚫</span> Taints & Tolerations</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Taints</strong> allow a node to repel Pods. <strong>Tolerations</strong> allow Pods to schedule onto nodes with matching taints. Together, they ensure Pods only run on appropriate nodes.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>The Bouncer Analogy:</strong> A Taint is like a "VIP Only" sign. Normal people (Pods) walk away. A Toleration is the "VIP Pass". If you have it, you can enter.</p>
                    <p><strong>Effects:</strong></p>
                    <ul>
                        <li><code>NoSchedule</code>: New pods won't land here. Existing ones stay.</li>
                        <li><code>PreferNoSchedule</code>: Try not to land here, but if no other option, okay.</li>
                        <li><code>NoExecute</code>: New pods blocked. Existing pods WITHOUT toleration are <strong>evicted immediately</strong>!</li>
                    </ul>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🎮</span>
                            <span class="use-case-title">Dedicated Hardware</span>
                        </div>
                        <div class="use-case-desc">Taint GPU nodes with <code>accelerator=nvidia:NoSchedule</code> so only AI workloads (with toleration) use them. Don't waste GPU on Nginx!</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔧</span>
                            <span class="use-case-title">Maintenance Mode</span>
                        </div>
                        <div class="use-case-desc"><code>kubectl drain</code> automatically adds definition <code>NoExecute</code> taint to evict everything so you can patch the OS.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">👑</span>
                            <span class="use-case-title">Master/Control Plane</span>
                        </div>
                        <div class="use-case-desc">Control Plane nodes have a default taint so your user apps don't accidentally run on critical system nodes.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Smoking Section</div>
                    <p>Imagine a Restaurant:</p>
                    <ul>
                        <li><strong>The Taint:</strong> "Smoking Section" (NoSchedule for non-smokers).</li>
                        <li><strong>Normal Pod:</strong> Non-smoker. Sees sign, walks away to non-smoking section.</li>
                        <li><strong>Tolerant Pod:</strong> Smoker. Sees sign, says "I don't mind", and sits there.</li>
                        <li><strong>Important:</strong> A smoker <em>can</em> sit in non-smoking too! (Unless you use Affinity to force them to Smoking). Taints only REPELS, they don't ATTRACT.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Taint Logic</div>
                    <div class="ascii-content">
       ┌────────────────────────────┐
       │         <span class="warning">NODE 1</span>             │
       │  Taint: gpu=true:NoSched   │
       └─────────────┬──────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌──────────┐           ┌──────────┐
    │  POD A   │           │  <span class="highlight">POD B</span>   │
    │ (No Tol) │           │ (Tol:gpu)│
    └───┬──────┘           └───┬──────┘
        │ ❌ BLOCKED           │ ✅ ALLOWED
        │                      │
   "Eww! A Taint!"        "I like GPUs!"
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "How do I ensure a Pod is scheduled ONLY on a specific node?" — Taints are NOT enough! Taints only repel others. To force a Pod to a Node, you need <strong>Node Affinity</strong> (to attract it) AND <strong>Taints</strong> (to repel everyone else).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Taint = Repellent</strong> (Bug spray). <strong>Toleration = Immunity</strong> (You don't smell it). <strong>Affinity = Magnet</strong>.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Push vs Pull</div>
                    <p><strong>Taints:</strong> Nodes push away Pods (repel)<br>
                    <strong>Node Affinity:</strong> Pods pull toward nodes (attract)<br>
                    Use taints when nodes need to be exclusive; use affinity when Pods have preferences.</p>
                </div>

                <h3>Taint Effects</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Effect</th>
                                <th>Behavior</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">NoSchedule</span></td>
                                <td>New Pods without toleration won't schedule</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">PreferNoSchedule</span></td>
                                <td>Soft version - avoid if possible</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">NoExecute</span></td>
                                <td>Evict existing Pods without toleration</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="deep-dive">
                     <div class="deep-dive-header">🔬 Related Concept: Taints</div>
                     <p>While Affinity attracts Pods, <strong>Taints</strong> repel them. <a href="#taints" onclick="loadContent('taints')">Click here to learn about Taints & Tolerations</a>.</p>
                </div>

                <h3>Affinity Example</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Add taint to node
kubectl taint nodes node1 gpu=true:NoSchedule

# Remove taint
kubectl taint nodes node1 gpu=true:NoSchedule-</pre>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Pod with toleration
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  tolerations:
  - key: "gpu"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
  # Or tolerate all taints with a key
  - key: "gpu"
    operator: "Exists"
    effect: "NoSchedule"
  containers:
  - name: cuda
    image: nvidia/cuda:11.0</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Built-in Taints</div>
                    <p>Kubernetes auto-adds taints for node conditions:<br>
                    • <code>node.kubernetes.io/not-ready</code> - Node not ready<br>
                    • <code>node.kubernetes.io/unreachable</code> - Node unreachable<br>
                    • <code>node.kubernetes.io/memory-pressure</code> - Low memory</p>
                </div>
            </div>
        `,

        'affinity': `
            <div class="content-card">
                <h2><span class="icon">🧲</span> Node & Pod Affinity</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Node Affinity</strong> attracts Pods to nodes with specific labels. <strong>Pod Affinity/Anti-Affinity</strong> attracts or repels Pods based on other Pods already running on nodes.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Node Affinity vs Taints:</strong> Taints say "Go Away" (unless you tolerate me). Affinity says "Come Here" (I like your labels).</p>
                    <p><strong>Pod Affinity:</strong> "I want to be near my friend". (e.g. App + Cache on same node for speed).</p>
                    <p><strong>Pod Anti-Affinity:</strong> "I want to be away from my clone". (e.g. Don't run two Replicas on the same node for HA).</p>
                    <p><strong>Types:</strong> <code>requiredDuringScheduling...</code> (Hard rule, must happen) vs <code>preferredDuringScheduling...</code> (Soft rule, try best).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚡</span>
                            <span class="use-case-title">Hardware Acceleration</span>
                        </div>
                        <div class="use-case-desc">Use Node Affinity to ensure AI training pods only land on nodes with "gpu=true" label.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🤝</span>
                            <span class="use-case-title">Co-location (Speed)</span>
                        </div>
                        <div class="use-case-desc">Use Pod Affinity to keep Frontend and Redis pods on the same node/zone for low latency.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">↔️</span>
                            <span class="use-case-title">High Availability</span>
                        </div>
                        <div class="use-case-desc">Use Pod Anti-Affinity to force replicas of "Web-App" to spread across different nodes/zones.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Office Seating</div>
                    <p>Think of assigning desks:</p>
                    <ul>
                        <li><strong>Node Affinity:</strong> "I must sit near a window (GPU Node)."</li>
                        <li><strong>Pod Affinity:</strong> "I must sit next to Sarah (Cache Pod) because we talk all day."</li>
                        <li><strong>Pod Anti-Affinity:</strong> "I cannot sit next to another Sales person (Replica) because we talk too loud. Spread us out!"</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Pod Anti-Affinity (Spreading)</div>
                    <div class="ascii-content">
       ┌────────────────────────────┐      ┌────────────────────────────┐
       │         <span class="success">NODE 1</span>             │      │         <span class="success">NODE 2</span>             │
       │                            │      │                            │
       │   ┌────────────────────┐   │      │   ┌────────────────────┐   │
       │   │    <span class="highlight">WEB REPLICA 1</span>   │   │      │   │    <span class="highlight">WEB REPLICA 2</span>   │   │
       │   │    (anti-affinity) │   │      │   │    (anti-affinity) │   │
       │   └────────────────────┘   │      │   └────────────────────┘   │
       │                            │      │                            │
       └────────────────────────────┘      └────────────────────────────┘
                     ▲                                    ▲
                     │          SCHEDULER                 │
                     │   "Don't put Rep 3 here!"          │ "Put Rep 3 here!"
                     └──────────────────┬─────────────────┘
                                        │
                             ┌────────────────────┐
                             │    <span class="highlight">WEB REPLICA 3</span>   │
                             └────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Affinity vs NodeSelector?" — NodeSelector is the old, simple way (<code>beta.kubernetes.io/os: linux</code>). Affinity is the new, expressive way with logic (AND, OR, NOT, weighted preference). Always prefer Affinity for complex rules!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Affinity = Attraction</strong> (Magnet). <strong>Anti-Affinity = Repulsion</strong> (Magnet reverse). <strong>Taint = Repulsion</strong> (Bad smell).</p>
                </div>

                <h3>Affinity Types</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🖥️</span>
                        <div class="name">Node Affinity</div>
                        <div class="desc">Pod attracted to nodes with labels</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🤝</span>
                        <div class="name">Pod Affinity</div>
                        <div class="desc">Pod attracted to nodes with certain Pods</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">↔️</span>
                        <div class="name">Pod Anti-Affinity</div>
                        <div class="desc">Pod repelled from nodes with certain Pods</div>
                    </div>
                </div>

                <h3>Node Affinity YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>spec:
  affinity:
    nodeAffinity:
      # Hard requirement - MUST match
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - us-east-1a
            - us-east-1b
      # Soft preference - TRY to match
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        preference:
          matchExpressions:
          - key: node-type
            operator: In
            values:
            - high-memory</pre>
                </div>

                <h3>Pod Anti-Affinity (Spread Replicas)</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Ensure replicas run on different nodes
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: my-app
        topologyKey: kubernetes.io/hostname  # Different nodes

# Spread across zones
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app: my-app
          topologyKey: topology.kubernetes.io/zone</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Topology Keys</div>
                    <p>Common topology keys:<br>
                    • <code>kubernetes.io/hostname</code> - Per-node<br>
                    • <code>topology.kubernetes.io/zone</code> - Per-zone<br>
                    • <code>topology.kubernetes.io/region</code> - Per-region</p>
                </div>
            </div>
        `,

        'hpa': `
            <div class="content-card">
                <h2><span class="icon">📈</span> Horizontal Pod Autoscaler (HPA)</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>The <strong>Horizontal Pod Autoscaler</strong> automatically scales the number of Pod replicas based on observed CPU/memory utilization or custom metrics. It adjusts the Deployment/ReplicaSet replicas field.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Scale Out (Horizontal):</strong> When traffic increases, HPA adds <em>more</em> pods. It's like opening more checkout lanes at a supermarket.</p>
                    <p><strong>How it works:</strong> HPA controller checks metrics (from Metrics Server) every 15 seconds. If average CPU > target (e.g. 50%), it calculates how many replicas are needed: <code>desiredReplicas = currentReplicas * (currentMetric / desiredMetric)</code>.</p>
                    <p><strong>Key insight:</strong> You MUST set <code>resources.requests</code> (CPU/Memory) in your Deployment, otherwise HPA can't calculate percentages and won't work!</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔥</span>
                            <span class="use-case-title">Traffic Spikes</span>
                        </div>
                        <div class="use-case-desc">Website traffic jumps 5x during Black Friday sale. HPA scales pods from 5 to 25 automatically.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📉</span>
                            <span class="use-case-title">Cost Savings</span>
                        </div>
                        <div class="use-case-desc">At night, traffic drops. HPA scales down to minimum replicas (e.g. 2) to save money.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🎯</span>
                            <span class="use-case-title">Custom Metrics</span>
                        </div>
                        <div class="use-case-desc">Scale based on "Requests Per Second" or "Queue Length" using Prometheus Adapter (not just CPU).</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Flash Sale</div>
                    <p>Imagine an e-commerce platform:</p>
                    <ul>
                        <li><strong>Normal Day:</strong> 3 Pods handling 100 req/sec total. CPU is at 30%.</li>
                        <li><strong>Sale Starts (10 AM):</strong> Traffic hits 1000 req/sec. CPU spikes to 90%.</li>
                        <li><strong>HPA Goal:</strong> Keep CPU at 50%.</li>
                        <li><strong>Action:</strong> HPA sees 90% > 50%. Formula says scale up 1.8x. Adds pods.</li>
                        <li><strong>Loop:</strong> Checks again. Still high? Add more pods. Scaling continues until load balances out or maxReplicas hit.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 HPA Control Loop</div>
                    <div class="ascii-content">
                               ┌───────────────────────────┐
                               │   <span class="highlight">METRICS SERVER</span>          │
                               │  (Aggregates usage)       │
                               └─────────────┬─────────────┘
                                             │ 1. Collects Usage
                                             ▼
       ┌────────────────────────────────────────────────────────────────────┐
       │   <span class="warning">HPA CONTROLLER</span> (Checks every 15s)                                │
       │                                                                    │
       │   Current: 80% CPU  │  Target: 50% CPU                             │
       │   Calc: 80 / 50 = 1.6x Increase                                    │
       │                                                                    │
       │    Decision: Scale Replicas 2 ──► 4                                 │
       └─────────────────────────────────────┬──────────────────────────────┘
                                             │ 2. Updates Scale Subresource
                                             ▼
       ┌────────────────────────────────────────────────────────────────────┐
       │   <span class="success">DEPLOYMENT</span> (replicas: 4)                                         │
       └─────────────────────────────────────┬──────────────────────────────┘
                                             │ 3. Creates Pods
                                             ▼
                ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
                │  POD 1  │   │  POD 2  │   │ <span class="highlight">POD 3</span>   │   │ <span class="highlight">POD 4</span>   │
                └─────────┘   └─────────┘   └─────────┘   └─────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "HPA vs VPA?" — HPA adds MORE pods (horizontal). VPA makes existing pods BIGGER (vertical, more CPU/RAM). <strong>Don't use them together</strong> on CPU/Memory metrics, they will fight! (One scales up, other scales down, chaos ensues).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Horizontal = Horizon</strong> (Wide, add more lanes). <strong>Vertical = Vertical</strong> (Tall, add more height/power).</p>
                </div>

                <h3>HPA Flow</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Autoscaling Loop</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📊</span> Metrics Server collects Pod metrics</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📈</span> HPA controller queries metrics (every 15s)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🧮</span> Calculate desired replicas from target</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>⚖️</span> Scale Deployment up or down</div>
                    </div>
                </div>

                <h3>HPA YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70   # Scale when CPU > 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300  # Wait 5 min before scaling down
    scaleUp:
      stabilizationWindowSeconds: 0    # Scale up immediately</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Scaling Formula</div>
                    <p><code>desiredReplicas = ceil(currentReplicas × (currentMetric / targetMetric))</code><br><br>
                    Example: 3 replicas at 90% CPU, target 50%<br>
                    <code>ceil(3 × (90/50)) = ceil(5.4) = 6 replicas</code></p>
                </div>
            </div>
        `,

        'vpa': `
            <div class="content-card">
                <h2><span class="icon">📐</span> Vertical Pod Autoscaler (VPA)</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>The <strong>Vertical Pod Autoscaler</strong> automatically adjusts the CPU and memory requests/limits of containers based on historical usage. Unlike HPA (more Pods), VPA makes Pods bigger (more resources).</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Scale Up (Vertical):</strong> Sometimes you can't add more pods (legacy app, single-threaded database). You need a <em>bigger</em> pod. VPA watches usage and suggests (or applies) new CPU/Memory requests.</p>
                    <p><strong>The Catch:</strong> To give a pod more CPU/RAM, Kubernetes usually has to <strong>restart</strong> it (change spec → delete pod → recreate with new spec). So VPA can be disruptive!</p>
                    <p><strong>In-Place Updates:</strong> A new feature (alpha) allows resizing without restart, but it's not widely used in production yet.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🐘</span>
                            <span class="use-case-title">Java Applications</span>
                        </div>
                        <div class="use-case-desc">Java apps often need more RAM over time as heap grows. VPA can adjust memory requests to match reality.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚖️</span>
                            <span class="use-case-title">Right-Sizing</span>
                        </div>
                        <div class="use-case-desc">Run VPA in "Off" or "Recommend" mode to see what resources your pods actually need, then fix YAML manually.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💥</span>
                            <span class="use-case-title">OOM Prevention</span>
                        </div>
                        <div class="use-case-desc">VPA detects OOMKilled events and automatically increases memory limits for the new pod.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Database Server</div>
                    <p>Imagine a Postgres database Pod:</p>
                    <ul>
                        <li><strong>Initial:</strong> Requests: 1GB RAM.</li>
                        <li><strong>Reality:</strong> DB grows, working set is 2GB. Pod crashes (OOMKill) or runs slow.</li>
                        <li><strong>VPA Action:</strong> VPA Recommender notices usage is consistently >1GB.</li>
                        <li><strong>Update:</strong> VPA Updater evicts the pod. VPA Admission Webhook intercepts recreation and changes requests to 2.5GB.</li>
                        <li><strong>Result:</strong> New pod comes up with enough RAM to run smoothly.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 VPA Recommendation Flow</div>
                    <div class="ascii-content">
       ┌────────────────────────────┐
       │     <span class="highlight">VPA RECOMMENDER</span>        │
       │   (Analyzes History)       │
       └─────────────┬──────────────┘
                     │ Suggests: 500m CPU -> 1000m CPU
                     ▼
       ┌────────────────────────────┐
       │       <span class="warning">VPA UPDATER</span>          │
       │   (Decides to Update)      │
       └─────────────┬──────────────┘
                     │ Evicts Pod (RESTART REQUIRED!)
                     ▼
       ┌────────────────────────────┐    ┌──────────────────────────────┐
       │        <span class="highlight">OLD POD</span>             │    │    <span class="success">VPA ADMISSION WEBHOOK</span>     │
       │     (Terminating)          │    │    (Patches New Pod)         │
       └────────────────────────────┘    └─────────────┬────────────────┘
                                                       │
                                                       ▼
                                         ┌────────────────────────────┐
                                         │        <span class="success">NEW POD</span>             │
                                         │   requests: cpu: 1000m     │
                                         └────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "VPA modes?" — <strong>Off</strong> (Just calculate recommendations, don't touch pods). <strong>Initial</strong> (Only apply changes when pod is created, never restart running pods). <strong>Auto</strong> (Restart pods to apply changes). Use "Off" first to learn!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>VPA = Vertical = "Tall"</strong>. Like a growing child needing bigger clothes (restart required to change clothes!).</p>
                </div>
                    <div class="deep-dive-header">🔬 HPA vs VPA</div>
                    <p><strong>HPA:</strong> Adds more replicas (horizontal scaling)<br>
                    <strong>VPA:</strong> Increases Pod resources (vertical scaling)<br><br>
                    ⚠️ Don't use HPA and VPA on CPU/memory together - they'll conflict!</p>
                </div>

                <h3>VPA Modes</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mode</th>
                                <th>Behavior</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Off</span></td>
                                <td>Only provides recommendations, no action</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Initial</span></td>
                                <td>Sets resources on Pod creation only</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Auto</span></td>
                                <td>Evicts and recreates Pods with new resources</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>VPA YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Auto"  # Off, Initial, or Auto
  resourcePolicy:
    containerPolicies:
    - containerName: "*"
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 4
        memory: 8Gi
      controlledResources: ["cpu", "memory"]</pre>
                </div>

                <h3>Check Recommendations</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                    </div>
                    <pre>kubectl describe vpa my-app-vpa

# Output shows:
# Recommendation:
#   Container Recommendations:
#     Container Name: my-app
#     Lower Bound:    Cpu: 100m, Memory: 256Mi
#     Target:         Cpu: 500m, Memory: 512Mi
#     Upper Bound:    Cpu: 2,    Memory: 2Gi</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Micro-Detail: VPA Eviction</div>
                    <p>In "Auto" mode, VPA evicts Pods to apply new resources (Pods can't resize in-place... yet!). Use <code>minReplicas</code> in Deployment and PodDisruptionBudget to ensure availability during evictions.</p>
                </div>
            </div>
        `,

        'containers': `
            <div class="content-card">
                <h2><span class="icon">📦</span> What are Containers?</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>Container</strong> is a lightweight, standalone, executable package that includes everything needed to run software: code, runtime, system tools, libraries, and settings. Containers isolate applications using Linux kernel primitives.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Namespaces (Walls):</strong> Creating isolated workspaces. Process ID (PID) namespace means I only see my own processes. Network namespace means I have my own IP.</p>
                    <p><strong>Cgroups (Budget):</strong> Control Groups limit how much CPU/RAM you can use. "You get 500MB RAM, no more!"</p>
                    <p><strong>Union Filesystem (Layers):</strong> Like Photoshop layers. Base OS layer + Python layer + App Code layer = Final Image.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🧩</span>
                            <span class="use-case-title">Microservices</span>
                        </div>
                        <div class="use-case-desc">Break a monolith into small, independent containers (User Svc, Order Svc) that can be upgraded separately.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔄</span>
                            <span class="use-case-title">Consistency</span>
                        </div>
                        <div class="use-case-desc">"It works on my machine!" -> "It works everywhere!" functionality. The exact same image runs in Dev, Test, and Prod.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚡</span>
                            <span class="use-case-title">Efficiency</span>
                        </div>
                        <div class="use-case-desc">Boot in milliseconds (vs minutes for VMs). Pack 1000s of containers on one server (High & Dense).</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Apartment vs House</div>
                    <p>Think of Housing:</p>
                    <ul>
                        <li><strong>Virtual Machine (House):</strong> Standalone building. Has its own plumbing, heating, foundation (Kernel/OS). Heavy, expensive to build. Good for total isolation.</li>
                        <li><strong>Container (Apartment):</strong> Room in a big building. Shares the foundation and plumbing (Kernel) with neighbors. Light, cheap, fast to move in. Walls (Namespaces) give privacy.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Container Isolation</div>
                    <div class="ascii-content">
       ┌───────────────────────────────┐
       │         APP PROCESS           │  ◄── Namespaces (View)
       │    (See only my own PID)      │
       └──────────────┬────────────────┘
                      │
       ┌──────────────▼────────────────┐
       │     CONTAINER ENGINE          │  ◄── Cgroups (Limits)
       │   (Docker / Containerd)       │
       └──────────────┬────────────────┘
                      │
       ┌──────────────▼────────────────┐
       │        HOST KERNEL            │  ◄── SHARED!
       │    (The real hardware OS)     │
       └───────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Do containers have their own Kernel?" — NO! They share the Host's Kernel. This is why you can't run a Windows Container directly on Linux (without emulation). VMs <em>do</em> have their own Kernel.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>VM = House</strong> (Heavy). <strong>Container = Apartment</strong> (Light, Shared Infrastructure).</p>
                </div>

                <h3>Container Building Blocks</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🔒</span>
                        <div class="name">Namespaces</div>
                        <div class="desc">Isolate PID, network, mount, user, IPC</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📊</span>
                        <div class="name">cgroups</div>
                        <div class="desc">Limit CPU, memory, I/O resources</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📁</span>
                        <div class="name">Union Filesystem</div>
                        <div class="desc">Layered image storage (overlay2)</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🏷️</span>
                        <div class="name">OCI Image</div>
                        <div class="desc">Standard image format</div>
                    </div>
                </div>

                <h3>Container vs VM</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Aspect</th>
                                <th>Container</th>
                                <th>Virtual Machine</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Boot Time</td>
                                <td><span class="badge badge-green">Milliseconds</span></td>
                                <td><span class="badge badge-orange">Minutes</span></td>
                            </tr>
                            <tr>
                                <td>Size</td>
                                <td><span class="badge badge-green">MBs</span></td>
                                <td><span class="badge badge-orange">GBs</span></td>
                            </tr>
                            <tr>
                                <td>Isolation</td>
                                <td><span class="badge badge-orange">Process-level</span></td>
                                <td><span class="badge badge-green">Hardware-level</span></td>
                            </tr>
                            <tr>
                                <td>Kernel</td>
                                <td>Shared with host</td>
                                <td>Own kernel</td>
                            </tr>
                            <tr>
                                <td>Density</td>
                                <td><span class="badge badge-green">1000s per host</span></td>
                                <td><span class="badge badge-orange">10s per host</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 When to Use What?</div>
                    <p><strong>Use Containers:</strong> Microservices, CI/CD, stateless apps, rapid scaling<br>
                    <strong>Use VMs:</strong> Full OS isolation, different kernels, legacy apps, security compliance</p>
                </div>
            </div>
        `,

        'probes': `
            <div class="content-card">
                <h2><span class="icon">🩺</span> Health Probes</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Probes</strong> are diagnostic checks performed by the kubelet to determine the health of a container. They answer three questions: "Are you alive?", "Are you ready to work?", and "Have you started yet?"</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Mechanism:</strong> Kubelet pings the container periodically.</p>
                    <ul>
                        <li><code>HTTP GET</code>: "Return 200 OK".</li>
                        <li><code>TCP Socket</code>: "Can I connect to port 80?"</li>
                        <li><code>Exec</code>: "Run <code>cat /tmp/healthy</code> and exit 0".</li>
                    </ul>
                    <p><strong>Failure Threshold:</strong> If it fails 3 times (configurable), Kubelet takes action (Restart or Cut Traffic).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💓</span>
                            <span class="use-case-title">Liveness (Restart)</span>
                        </div>
                        <div class="use-case-desc">Detects deadlocks. If app is stuck in loop and can't reply, Liveness fails -> Restart Pod. "Have you tried turning it off and on again?"</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">✅</span>
                            <span class="use-case-title">Readiness (Traffic)</span>
                        </div>
                        <div class="use-case-desc">Detects overload/startup. If app is loading large cache, Readiness fails -> Service stops sending traffic until done.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚀</span>
                            <span class="use-case-title">Startup (Slow Start)</span>
                        </div>
                        <div class="use-case-desc">For legacy Java apps taking 5 minutes to boot. Disables Liveness until Startup passes so it doesn't get killed loop.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Office Reception</div>
                    <p>Imagine an Employee (Container):</p>
                    <ul>
                        <li><strong>Liveness Probe:</strong> "Are you conscious?" If No (Unconscious) -> Call Ambulance (Restart).</li>
                        <li><strong>Readiness Probe:</strong> "Are you at your desk ready to take calls?" If No (In bathroom) -> Don't route phone calls to them (Remove from Service).</li>
                        <li><strong>Startup Probe:</strong> "Have you arrived at the office yet?" If No (Commuting) -> Don't check Liveness/Readiness yet.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Probe Logic Workflow</div>
                    <div class="ascii-content">
      ┌─────────────┐
      │   KUBELET   │
      └──────┬──────┘
             │ 1. PINGS / GET
             ▼
      ┌──────────────┐
      │  CONTAINER   │ ◄─── "I'm busy loading DB..."
      └──────────────┘
             │
             │ Result: 503 Service Unavailable
             ▼
      ┌──────────────┐
      │ READINESS ❌ │ ──► Endpoints Controller:
      └──────────────┘     "Remove IP from Service LoadBalancer"
                                 │
           (Wait 10s...)         │
                                 ▼
           (Probe ✅)  ──► "Add IP back to Service"
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Crucial Distinction:</strong> Liveness = RESTART (Kills pod). Readiness = TRAFFIC (Stops traffic). Never put a dependency check (e.g., "Check if DB is up") in Liveness Probe! If DB goes down, all your web pods will restart endlessly. Put it in Readiness.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Liveness = Life/Death</strong> (Kill it). <strong>Readiness = Ready/Busy</strong> (Pause it).</p>
                </div>

                <h3>Probe Types</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">💓</span>
                        <div class="name">Liveness Probe</div>
                        <div class="desc">Is the container alive? Restart if not.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">✅</span>
                        <div class="name">Readiness Probe</div>
                        <div class="desc">Ready for traffic? Remove from Service if not.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🚀</span>
                        <div class="name">Startup Probe</div>
                        <div class="desc">Has container started? Disables other probes until success.</div>
                    </div>
                </div>

                <h3>Probe Mechanisms</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mechanism</th>
                                <th>Description</th>
                                <th>Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">httpGet</span></td>
                                <td>HTTP GET to endpoint, success if 200-399</td>
                                <td>Web servers, APIs</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">tcpSocket</span></td>
                                <td>TCP connection to port</td>
                                <td>Databases, gRPC services</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">exec</span></td>
                                <td>Run command, success if exit 0</td>
                                <td>Custom health scripts</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">grpc</span></td>
                                <td>gRPC health check protocol</td>
                                <td>gRPC services</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Probe YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>containers:
- name: app
  image: my-app:v1
  livenessProbe:
    httpGet:
      path: /healthz
      port: 8080
    initialDelaySeconds: 15    # Wait before first probe
    periodSeconds: 10          # Probe every 10s
    timeoutSeconds: 3          # Timeout per probe
    failureThreshold: 3        # Failures before restart
  readinessProbe:
    httpGet:
      path: /ready
      port: 8080
    initialDelaySeconds: 5
    periodSeconds: 5
  startupProbe:
    httpGet:
      path: /healthz
      port: 8080
    failureThreshold: 30       # 30 × 10s = 5 min to start
    periodSeconds: 10</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ Common Mistake</div>
                    <p>Don't set <code>initialDelaySeconds</code> too low! If your app takes 30s to start and liveness probe runs at 5s, Kubernetes will restart it in a loop (CrashLoopBackOff). Use <code>startupProbe</code> for slow-starting apps.</p>
                </div>
            </div>
        `,

        'multi-container': `
            <div class="content-card">
                <h2><span class="icon">🔗</span> Multi-Container Patterns</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>Pods can contain multiple containers that share network (IP, localhost) and storage (Volumes). These helper containers run alongside the main application to extend its functionality.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Tightly Coupled:</strong> Just like a sidecar is attached to a motorcycle. They live and die together.</p>
                    <p><strong>Shared Context:</strong></p>
                    <ul>
                        <li><strong>Network:</strong> Can talk to each other on <code>localhost:8080</code>.</li>
                        <li><strong>Storage:</strong> Can read/write to the same shared Volume (emptyDir).</li>
                    </ul>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚗</span>
                            <span class="use-case-title">Sidecar Pattern</span>
                        </div>
                        <div class="use-case-desc">Helper container enhancing main app. Ex: Logging Agent (Fluentd) tailing logs from Main App and pushing to S3.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📡</span>
                            <span class="use-case-title">Ambassador Pattern</span>
                        </div>
                        <div class="use-case-desc">Proxy for external world. App talks to <code>localhost</code>, Ambassador proxies it to the real external DB (handling auth/retry logic).</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔌</span>
                            <span class="use-case-title">Adapter Pattern</span>
                        </div>
                        <div class="use-case-desc">Standardizer. App outputs logs in JSON. Adapter reads JSON and converts to XML for legacy monitoring system.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Motorcycle Sidecar</div>
                    <p>Imagine a Motorcycle (The Pod):</p>
                    <ul>
                        <li><strong>The Rider (Main Container):</strong> Drives the bike. Focuses on the destination (Business Logic).</li>
                        <li><strong>The Sidecar Passenger (Sidecar Container):</strong> Reads the map, holds the snacks, or shoots photos. Helper tasks.</li>
                        <li><strong>Result:</strong> If the bike crashes, they BOTH crash. They travel together.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Sidecar Shared Volume</div>
                    <div class="ascii-content">
       ┌──────────────────────────────────────────┐
       │                 POD                      │
       │  ┌────────────┐        ┌────────────┐    │
       │  │  MAIN APP  │        │  SIDECAR   │    │
       │  │ (Writes    │        │ (Reads     │    │
       │  │   Logs)    │        │   Logs)    │    │
       │  └──────┬─────┘        └─────▲──────┘    │
       │         │                    │           │
       │         ▼                    │           │
       │      ┌──────────────────────────┐        │
       │      │      SHARED VOLUME       │        │
       │      │      (access-logs)       │        │
       │      └──────────────────────────┘        │
       └──────────────────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "How do containers in a Pod communicate?" — Via <strong>localhost</strong>! They share the same network namespace. They can also communicate via shared volumes (files).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Sidecar</strong> = Helper. <strong>Ambassador</strong> = Diplomat (Proxy). <strong>Adapter</strong> = Translator.</p>
                </div>

                <h3>Pattern Types</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🚗</span>
                        <div class="name">Sidecar</div>
                        <div class="desc">Extends/enhances main container (logging, proxy)</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔧</span>
                        <div class="name">Init Container</div>
                        <div class="desc">Runs before app starts (setup, wait for deps)</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📡</span>
                        <div class="name">Ambassador</div>
                        <div class="desc">Proxy for external services</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔌</span>
                        <div class="name">Adapter</div>
                        <div class="desc">Transform output format</div>
                    </div>
                </div>

                <h3>Sidecar Pattern</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: v1
kind: Pod
metadata:
  name: web-with-logging
spec:
  containers:
  - name: web
    image: nginx
    volumeMounts:
    - name: logs
      mountPath: /var/log/nginx
  - name: log-collector        # Sidecar
    image: fluentd
    volumeMounts:
    - name: logs
      mountPath: /var/log/nginx
      readOnly: true
  volumes:
  - name: logs
    emptyDir: {}</pre>
                </div>

                <h3>Init Container</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>spec:
  initContainers:
  - name: wait-for-db
    image: busybox
    command: ['sh', '-c', 'until nc -z mysql 3306; do sleep 2; done']
  - name: init-config
    image: busybox
    command: ['sh', '-c', 'cp /config/* /app/config/']
    volumeMounts:
    - name: config
      mountPath: /app/config
  containers:
  - name: app
    image: my-app:v1</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Init vs Sidecar</div>
                    <p><strong>Init Containers:</strong> Run sequentially, must complete before app starts. Use for setup tasks.<br>
                    <strong>Sidecar Containers:</strong> Run alongside app for entire lifecycle. Use for logging, proxies, monitoring.</p>
                </div>
            </div>
        `,

        'pod-lifecycle': `
            <div class="content-card">
                <h2><span class="icon">🔄</span> Pod Lifecycle</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A Pod's lifecycle includes creation, scheduling, running, and termination. It is meant to be ephemeral—born, live, and die. It is NOT resurrected; a new one takes its place.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>The Phases:</strong></p>
                    <ul>
                        <li><strong>Pending:</strong> API accepted it, but Scheduler hasn't found a node yet (or image pulling).</li>
                        <li><strong>Running:</strong> At least one container is running (or starting).</li>
                        <li><strong>Succeeded:</strong> Job finished with exit code 0.</li>
                        <li><strong>Failed:</strong> Crashed with non-zero exit code.</li>
                        <li><strong>Unknown:</strong> Node is lost.</li>
                    </ul>
                    <p><strong>Conditions:</strong> Detailed status like <code>PodScheduled</code>, <code>Initialized</code>, <code>Ready</code>.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🎣</span>
                            <span class="use-case-title">Life Hooks</span>
                        </div>
                        <div class="use-case-desc"><code>postStart</code> (Email admin "I'm alive") and <code>preStop</code> (Graceful shutdown, ensure DB connection closed).</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⏳</span>
                            <span class="use-case-title">Graceful Termination</span>
                        </div>
                        <div class="use-case-desc">When Pod deleted, K8s sends SIGTERM. App has 30s (default) to finish requests before SIGKILL (forced kill).</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🧱</span>
                            <span class="use-case-title">Init Phase</span>
                        </div>
                        <div class="use-case-desc">Init Containers run first. If they fail, the main Pod is never started. Good for preconditions.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: A Temp Worker</div>
                    <p>Think of a Pod as a Contract/Temp Worker:</p>
                    <ul>
                        <li><strong>Pending:</strong> Hired, waiting for desk assignment (Scheduler).</li>
                        <li><strong>Init:</strong> Filling out paperwork, setting up PC (Init Container).</li>
                        <li><strong>Running:</strong> Working.</li>
                        <li><strong>Succeeded:</strong> Contract done, project finished successfully (Completed Job).</li>
                        <li><strong>Failed:</strong> Fired for bad behavior (Crash).</li>
                        <li><strong>Terminating:</strong> "You have 30 seconds to pack your box" (SIGTERM).</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Pod State Machine</div>
                    <div class="ascii-content">
          (API Request)
               │
               ▼
       ┌───────────────┐
       │    PENDING    │ (Scheduler searching...)
       └───────┬───────┘
               │ (Node Found)
               ▼
       ┌───────────────┐
       │ ContainerCre. │ (Pulling Image...)
       └───────┬───────┘
               │
               ▼
       ┌───────────────┐     Crash      ┌───────────────┐
       │    RUNNING    │ ─── (Restart) ─▶│   RUNNING     │
       └───────┬───────┘                └───────────────┘
               │
        ┌──────┴──────┐
        │ Exit Code?  │
        ▼             ▼
   ┌─────────┐   ┌─────────┐
   │SUCCEEDED│   │ FAILED  │
   │ (Code 0)│   │(Code 1) │
   └─────────┘   └─────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What is the difference between a Phase and a Condition?" — <strong>Phase</strong> is the high-level summary (e.g., Running). <strong>Condition</strong> is the detailed array (Ready=True, Scheduled=True). A Pod can be in 'Running' phase but 'Ready=False' condition!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>P.R.S.F.</strong> = Pending, Running, Succeeded, Failed. (Please Run Super Fast).</p>
                </div>

                <h3>Pod Phases</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Pod Phase Progression</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>⏳</span> Pending: Waiting to be scheduled</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🏃</span> Running: At least one container running</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>✅</span> Succeeded: All containers exited 0</div>
                        <div class="flow-arrow">or</div>
                        <div class="flow-step"><span>❌</span> Failed: At least one container failed</div>
                    </div>
                </div>

                <h3>Container States</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>State</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Waiting</span></td>
                                <td>Pulling image, waiting for dependencies</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Running</span></td>
                                <td>Container executing without problems</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Terminated</span></td>
                                <td>Container finished or failed</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>CrashLoopBackOff Troubleshooting</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Debugging CrashLoopBackOff</div>
                    <p><strong>What it means:</strong> Container keeps crashing, Kubernetes backs off restart attempts.<br><br>
                    <strong>Debug steps:</strong><br>
                    1. <code>kubectl logs pod-name --previous</code> - See crash logs<br>
                    2. <code>kubectl describe pod pod-name</code> - Check events<br>
                    3. Check Exit Code: 137=OOMKilled, 1=App error, 127=Command not found<br>
                    4. Verify image, environment variables, secrets<br>
                    5. Check liveness probe configuration</p>
                </div>

                <h3>Graceful Shutdown</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Pod termination sequence:
# 1. Pod set to Terminating
# 2. preStop hook runs
# 3. SIGTERM sent to containers
# 4. Wait terminationGracePeriodSeconds (default 30)
# 5. SIGKILL if still running

spec:
  terminationGracePeriodSeconds: 60
  containers:
  - name: app
    lifecycle:
      preStop:
        exec:
          command: ["/bin/sh", "-c", "nginx -s quit"]</pre>
                </div>
            </div>
        `,

        'cluster-autoscaler': `
            <div class="content-card">
                <h2><span class="icon">📈</span> Cluster Autoscaler</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>The <strong>Cluster Autoscaler</strong> automatically adjusts the number of nodes in a cluster. It adds nodes when Pods can't be scheduled due to insufficient resources, and removes nodes when utilization is low.</p>
                </div>

                <h3>Scaling Flow</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Cluster Autoscaler Logic</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>⏳</span> Pods stuck in Pending (unschedulable)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔍</span> CA detects insufficient capacity</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>☁️</span> Provisions new node from cloud</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📦</span> Scheduler places Pending Pods</div>
                    </div>
                </div>

                <h3>Scale Down Logic</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 When Does CA Remove Nodes?</div>
                    <p>A node is removed if:<br>
                    • Utilization below threshold (default 50%) for 10+ minutes<br>
                    • All Pods can be moved to other nodes<br>
                    • No Pods with local storage, PodDisruptionBudget violations<br>
                    • No system Pods (kube-system without safe-to-evict annotation)</p>
                </div>

                <h3>CA Configuration</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Common CA flags
--scale-down-enabled=true
--scale-down-delay-after-add=10m
--scale-down-unneeded-time=10m
--scale-down-utilization-threshold=0.5
--max-node-provision-time=15m
--balance-similar-node-groups=true

# AWS EKS node group tags (required)
k8s.io/cluster-autoscaler/enabled=true
k8s.io/cluster-autoscaler/my-cluster=owned</pre>
                </div>

                <div class="micro-detail">
                    <div class="micro-detail-title">⚡ CA Limitations</div>
                    <p>• Only reacts to unschedulable Pods (not proactive)<br>
                    • Node provisioning takes 2-5 minutes<br>
                    • Doesn't consider node resource fragmentation<br>
                    • Doesn't scale based on custom metrics</p>
                </div>
            </div>
        `,

        'karpenter': `
            <div class="content-card">
                <h2><span class="icon">⚡</span> Karpenter</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Karpenter</strong> is an open-source, just-in-time node provisioner. It bypasses standard node groups to provision the <em>exact</em> right compute instance for your pending pods in seconds.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Groupless Scaling:</strong> Unlike CA which just says "Add +1 node to Group A", Karpenter looks at the specific needs of pending pods (e.g., "Need 2GB RAM + GPU").</p>
                    <p><strong>Direct Provisioning:</strong> It calls the Cloud Fleet API directly to say "Give me the cheapest instance that fits these pods".</p>
                    <p><strong>Bin Packing:</strong> It aggressively moves pods to smaller nodes (Consolidation) to save money.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏎️</span>
                            <span class="use-case-title">Fast Scaling</span>
                        </div>
                        <div class="use-case-desc">Boots nodes in ~40 seconds because it skips the Auto Scaling Group logic. Perfect for batch jobs or rapid traffic spikes.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🛒</span>
                            <span class="use-case-title">Spot Instances</span>
                        </div>
                        <div class="use-case-desc">Excellent support for Sport instances. It can automatically fallback to On-Demand if Spot capacity is unavailable.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🧩</span>
                            <span class="use-case-title">Heterogeneous Clusters</span>
                        </div>
                        <div class="use-case-desc">Mix and match instance types (m5.large, c5.xlarge, t3.medium) in the same cluster to perfectly fit your diverse workloads.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Uber vs Bus</div>
                    <ul>
                        <li><strong>Cluster Autoscaler (Bus):</strong> You have a preset schedule (Node Groups). If 50 people wait, bring another Bus. If 1 person waits, you still bring a whole Bus (or wait for it to fill).</li>
                        <li><strong>Karpenter (Uber/Taxi):</strong> 1 person waiting? Send a Sedan. 6 people? Send an XL. 50 people? Send a Coach. It sends exactly the vehicle needed, right now.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Karpenter Decision Loop</div>
                    <div class="ascii-content">
       ┌───────────────┐
       │ PENDING PODS  │
       │ "Need: 3 CPU" │
       │ "Need: 1 GPU" │
       └───────┬───────┘
               │ 1. Observe Constraints
               ▼
       ┌───────────────┐
       │   <span class="highlight">KARPENTER</span>   │ ───► (Price Check)
       │ (Controller)  │
       └───────┬───────┘
               │ 2. "Best fit is g4dn.xlarge"
               │    (Cheapest matching instance)
               ▼
       ┌───────────────┐
       │ CLOUD API     │
       │ (createFleet) │
       └───────┬───────┘
               │
               ▼
        [ NEW NODE ] ──► Available in ~40s!
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Pro Tip:</strong> Karpenter solves the "Fragmentation" problem. Standard CA might leave you with 3 half-empty nodes. Karpenter's <strong>Consolidation</strong> feature will actively move pods to empty one node and delete it to save costs.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Karpenter = Carpenter</strong>. He builds exactly the chair you need, custom-made, on the spot. No pre-fab furniture.</p>
                </div>

                <h3>Karpenter vs Cluster Autoscaler</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Cluster Autoscaler</th>
                                <th>Karpenter</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Provisioning</td>
                                <td>Via node groups</td>
                                <td><span class="badge badge-green">Direct API calls</span></td>
                            </tr>
                            <tr>
                                <td>Speed</td>
                                <td>2-5 minutes</td>
                                <td><span class="badge badge-green">30-60 seconds</span></td>
                            </tr>
                            <tr>
                                <td>Instance Selection</td>
                                <td>Fixed per node group</td>
                                <td><span class="badge badge-green">Dynamic, bin-packing</span></td>
                            </tr>
                            <tr>
                                <td>Spot Support</td>
                                <td>Per node group</td>
                                <td><span class="badge badge-green">Mixed, automatic fallback</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>NodePool Configuration</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: default
spec:
  template:
    spec:
      requirements:
      - key: kubernetes.io/arch
        operator: In
        values: ["amd64", "arm64"]
      - key: karpenter.sh/capacity-type
        operator: In
        values: ["spot", "on-demand"]
      - key: node.kubernetes.io/instance-type
        operator: In
        values: ["m5.large", "m5.xlarge", "c5.large"]
  limits:
    cpu: 1000
    memory: 1000Gi
  disruption:
    consolidationPolicy: WhenUnderutilized
    consolidateAfter: 30s</pre>
                </div>
            </div>
        `,

        'deployment-strategies': `
            <div class="content-card">
                <h2><span class="icon">🚀</span> Deployment Strategies</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Deployment Strategies</strong> determine how to transition from Version 1 (v1) of your app to Version 2 (v2). The goal is to minimize downtime and risk.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Recreate:</strong> Kill v1. Then start v2. (Downtime: Yes).</p>
                    <p><strong>Rolling Update (Default):</strong> Slow transition. 1 down, 1 up. (Downtime: No).</p>
                    <p><strong>Blue/Green:</strong> Stand up full v2 stack alongside v1. Switch traffic instantly. (Safe, but expensive).</p>
                    <p><strong>Canary:</strong> Send 5% traffic to v2. If errors < 1%, increase to 25%, then 100%.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔄</span>
                            <span class="use-case-title">Rolling Update</span>
                        </div>
                        <div class="use-case-desc">Default for stateless apps. Zero downtime. Consumes small extra capacity (e.g. maxSurge: 25%).</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔵</span>
                            <span class="use-case-title">Blue/Green</span>
                        </div>
                        <div class="use-case-desc">Critical banking apps. You need instant rollback capability. If v2 fails, just switch router back to Blue.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🐥</span>
                            <span class="use-case-title">Canary</span>
                        </div>
                        <div class="use-case-desc">Testing new features on real users. "Let's see if the new UI impacts conversion rate for 1% of users."</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Shop Renovation</div>
                    <ul>
                        <li><strong>Recreate:</strong> "Closed for Renovation" sign. No sales for a week.</li>
                        <li><strong>Rolling Update:</strong> Renovate one aisle at a time. Shop stays open, but a bit dusty.</li>
                        <li><strong>Blue/Green:</strong> Build a BRAND NEW shop next door. On opening day, lock old shop and unlock new one.</li>
                        <li><strong>Canary:</strong> Let 10 people into the new shop. Ask if they like it. If they vomit, close it and fix. If happy, let everyone in.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Blue/Green Traffic Switch</div>
                    <div class="ascii-content">
       ┌───────────────┐
       │    USER       │
       └───────┬───────┘
               │ traffic
               ▼
       ┌─────────────────────────┐
       │    SERVICE (Selector)   │
       └───────┬─────────────────┘
               │ 1. Pointing to Blue
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
 ┌─────────┐       ┌─────────┐
 │ BLUE v1 │       │ GREEN v2│
 │ (LIVE)  │       │ (READY) │
 └─────────┘       └─────────┘

            2. SWITCH!
              (Update Selector)
                    │
                    ▼
          (Traffic flows to Green)
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Pro Tip:</strong> Kubernetes Deployments support Recreate and RollingUpdate out of the box. For Blue/Green and Canary, you typically need advanced tools like <strong>Argo Rollouts</strong>, Flagger, or a Service Mesh (Istio), although you can "fake" Blue/Green by manually managing two Deployments.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Canary</strong> comes from "Canary in a Coal Mine" (Safety warning). <strong>Blue/Green</strong> is distinct environments. <strong>Rolling</strong> is a wave.</p>
                </div>

                <h3>Strategy Comparison</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Strategy</th>
                                <th>Zero Downtime</th>
                                <th>Rollback</th>
                                <th>Resource Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Recreate</span></td>
                                <td>❌</td>
                                <td>Slow</td>
                                <td>Low</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Rolling Update</span></td>
                                <td>✅</td>
                                <td>Medium</td>
                                <td>Medium</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">Blue-Green</span></td>
                                <td>✅</td>
                                <td>Instant</td>
                                <td>High (2x)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Canary</span></td>
                                <td>✅</td>
                                <td>Fast</td>
                                <td>Low-Medium</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Rolling Update Config</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%        # Extra pods during update
      maxUnavailable: 25%  # Can be unavailable during update
  minReadySeconds: 10      # Wait before marking ready
  revisionHistoryLimit: 5  # Keep N old ReplicaSets</pre>
                </div>

                <h3>Blue-Green with Services</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Deploy v2 alongside v1
# Switch Service selector to cut over

apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
    version: v2   # Change from v1 to v2 for instant switch</pre>
                </div>

                <h3>Canary with Traffic Split</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Using Ingress-nginx canary annotations
metadata:
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"  # 10% traffic</pre>
                </div>
            </div>
        `,

        'helm': `
            <div class="content-card">
                <h2><span class="icon">⎈</span> Helm</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Helm</strong> is the package manager for Kubernetes. It uses charts (packages of pre-configured resources) to deploy complex applications with a single command.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why Helm?</strong> Imagine deploying a complex app like WordPress — you need Deployment, Service, ConfigMap, Secret, PVC, Ingress, etc. Instead of managing 10+ YAML files, Helm packages them into a single "chart" with configurable values.</p>
                    <p>Helm uses templates (Go templating) so you can reuse the same chart for dev, staging, and production by just changing values. It also tracks releases (versions) so you can rollback if something breaks.</p>
                    <p><strong>Key insight:</strong> Helm 3 is client-only (no Tiller server needed). Charts can be stored in repositories (like ArtifactHub) making it easy to share and discover community packages.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📦</span>
                            <span class="use-case-title">Third-Party Apps</span>
                        </div>
                        <div class="use-case-desc">Install complex apps like Prometheus, Grafana, PostgreSQL with one command from chart repos.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔁</span>
                            <span class="use-case-title">Multi-Environment</span>
                        </div>
                        <div class="use-case-desc">Same chart, different values files: dev uses 1 replica, prod uses 10 replicas with autoscaling.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⏪</span>
                            <span class="use-case-title">Release Management</span>
                        </div>
                        <div class="use-case-desc">Track release versions, rollback to previous versions instantly with helm rollback.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Full Observability Stack</div>
                    <p>Imagine setting up monitoring infrastructure:</p>
                    <ul>
                        <li><strong>Add Prometheus repo:</strong> <code>helm repo add prometheus-community https://...</code></li>
                        <li><strong>Install Prometheus:</strong> <code>helm install prometheus prometheus-community/kube-prometheus-stack</code></li>
                        <li><strong>Custom values:</strong> Pass <code>--values prod-values.yaml</code> with longer retention, more storage</li>
                        <li><strong>Upgrade:</strong> New Prometheus version? <code>helm upgrade prometheus ...</code> handles everything</li>
                        <li><strong>Rollback:</strong> Something broke? <code>helm rollback prometheus 1</code> reverts to previous release</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Helm Chart Structure</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────┐
│                         <span class="highlight">HELM CHART: my-app</span>                               │
└──────────────────────────────────────────────────────────────────────────┘

my-app/
├── <span class="success">Chart.yaml</span>           ← Chart metadata (name, version, dependencies)
├── <span class="warning">values.yaml</span>          ← Default configuration values
├── <span class="success">templates/</span>           ← Kubernetes manifests with Go templating
│   ├── deployment.yaml   │  {{ .Values.replicas }}
│   ├── service.yaml      │  {{ .Values.service.port }}
│   ├── ingress.yaml      │  {{ if .Values.ingress.enabled }}
│   └── _helpers.tpl      │  Reusable template snippets
└── <span class="warning">charts/</span>              ← Subcharts (dependencies)
    └── postgresql/

                  helm install my-app ./my-app -f prod-values.yaml
                                      │
                                      ▼
                   ┌─────────────────────────────────┐
                   │  Templates + Values = YAML      │
                   │  deployed to Kubernetes         │
                   └─────────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Helm vs Kustomize?" — Helm uses templating (Go templates) and packages. Kustomize uses patching/overlays without templates. Helm is better for complex apps with many config options. Kustomize is simpler, built into kubectl (<code>kubectl apply -k</code>). Many teams use both together!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Think of Helm as <strong>"apt/yum for Kubernetes"</strong>: just like <code>apt install nginx</code> handles everything on Linux, <code>helm install nginx</code> handles all K8s resources. Charts are packages, releases are installed instances!</p>
                </div>

                <h3>Helm Components</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📦</span>
                        <div class="name">Chart</div>
                        <div class="desc">Package of K8s manifests + templates</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📋</span>
                        <div class="name">Release</div>
                        <div class="desc">A deployed instance of a chart</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📚</span>
                        <div class="name">Repository</div>
                        <div class="desc">Collection of published charts</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⚙️</span>
                        <div class="name">Values</div>
                        <div class="desc">Configuration for chart templates</div>
                    </div>
                </div>

                <h3>Common Commands</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search charts
helm search repo nginx

# Install chart
helm install my-release bitnami/nginx -f values.yaml

# Upgrade release
helm upgrade my-release bitnami/nginx --set replicas=3

# Rollback
helm rollback my-release 1

# Uninstall
helm uninstall my-release

# List releases
helm list -A</pre>
                </div>

                <h3>Chart Structure</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Structure</span>
                    </div>
                    <pre>my-chart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default config values
├── templates/          # K8s manifests with Go templates
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── _helpers.tpl    # Template helpers
│   └── NOTES.txt       # Post-install notes
└── charts/             # Dependencies</pre>
                </div>
            </div>
        `,

        'kustomize': `
            <div class="content-card">
                <h2><span class="icon">🔧</span> Kustomize</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Kustomize</strong> is a template-free way to customize Kubernetes manifests. It uses overlays and patches to modify base configurations without changing the original files.</p>
                </div>

                <h3>Kustomize vs Helm</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Aspect</th>
                                <th>Kustomize</th>
                                <th>Helm</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Approach</td>
                                <td>Overlay/Patch</td>
                                <td>Templates</td>
                            </tr>
                            <tr>
                                <td>Built-in to kubectl</td>
                                <td><span class="badge badge-green">Yes (-k flag)</span></td>
                                <td>No</td>
                            </tr>
                            <tr>
                                <td>Learning Curve</td>
                                <td><span class="badge badge-green">Low</span></td>
                                <td>Medium</td>
                            </tr>
                            <tr>
                                <td>Package Distribution</td>
                                <td>Git repos</td>
                                <td><span class="badge badge-green">Chart repos</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Directory Structure</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Structure</span>
                    </div>
                    <pre>my-app/
├── base/
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   └── service.yaml
└── overlays/
    ├── dev/
    │   ├── kustomization.yaml
    │   └── replica-patch.yaml
    └── prod/
        ├── kustomization.yaml
        └── replica-patch.yaml</pre>
                </div>

                <h3>Kustomization File</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../../base

namePrefix: prod-
namespace: production

commonLabels:
  env: production

replicas:
- name: my-app
  count: 5

images:
- name: my-app
  newTag: v2.0.0

patches:
- path: replica-patch.yaml</pre>
                </div>
            </div>
        `,

        'gitops': `
            <div class="content-card">
                <h2><span class="icon">🔄</span> GitOps</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>GitOps</strong> is an operational framework where Git is the single source of truth for infrastructure and applications. Changes are made via pull requests, and automation syncs the cluster state with the repository.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Declarative:</strong> You don't run commands (kubectl apply). You declare state in files.</p>
                    <p><strong>Versioned:</strong> Since it's in Git, you have valid history. "Who changed the replica count? Git blame!"</p>
                    <p><strong>Automated Pull:</strong> An agent inside the cluster pulls these changes. No need to give CI pipelines admin access to your cluster (Security!).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📜</span>
                            <span class="use-case-title">Audit Trail</span>
                        </div>
                        <div class="use-case-desc">Every change is a commit. You know exactly who did what and when. Compliance heaven. "Why is the site down? Oh, Dave merged this PR at 3 AM."</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">↩️</span>
                            <span class="use-case-title">Easy Revert</span>
                        </div>
                        <div class="use-case-desc">Bad deployment? Just <code>git revert</code>. The cluster automatically syncs back to the previous good state.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏚️</span>
                            <span class="use-case-title">Drift Detection</span>
                        </div>
                        <div class="use-case-desc">If someone manually changes the cluster (kubectl edit), GitOps detects "Drift" and can automatically revert it to match Git.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Chef's Recipe Book</div>
                    <ul>
                        <li><strong>The Master Recipe (Git):</strong> The Head Chef writes the official recipe in the book.</li>
                        <li><strong>The Kitchen (Cluster):</strong> Cooks must follow the book EXACTLY.</li>
                        <li><strong>Drift:</strong> If a cook adds extra salt (manual change), the Head Chef tastes it, spits it out, and remakes the dish according to the book (Auto-Sync/Heal).</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Pull-Based Model</div>
                    <div class="ascii-content">
       ┌───────────────┐        ┌───────────────┐
       │  DEVELOPER    │        │  GIT REPO     │
       │ (Commits YAML)│ ─────► │ (Source of    │
       └───────────────┘        │  Truth)       │
                                └───────┬───────┘
                                        │
                                        ▼
                                ┌───────────────┐
                                │ CLUSTER AGENT │
                                │   (ArgoCD)    │
                                └───────┬───────┘
           (Agent pulls changes) ◄──────┘
           (No external access needed!)
                     │
                     ▼
             [ KUBERNETES ]
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Security Benefit:</strong> In GitOps, your CI system (Jenkins/GitHub Actions) does NOT need credentials to your production cluster. The cluster reaches OUT to Git. This eliminates the "God Mode" CI keys that hackers love to steal.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Git = Truth</strong>. <strong>Cluster = Reflection</strong>. If it's not in Git, it doesn't exist.</p>
                </div>

                <h3>GitOps Principles</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📄</span>
                        <div class="name">Declarative</div>
                        <div class="desc">Entire system described declaratively</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📚</span>
                        <div class="name">Versioned</div>
                        <div class="desc">Desired state stored in Git</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🤖</span>
                        <div class="name">Automated</div>
                        <div class="desc">Approved changes auto-applied</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔍</span>
                        <div class="name">Reconciled</div>
                        <div class="desc">Agents ensure desired = actual</div>
                    </div>
                </div>

                <h3>GitOps Flow</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ GitOps Sync Cycle</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📝</span> Developer pushes to Git</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>✅</span> PR reviewed & merged</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔍</span> GitOps agent detects change</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔄</span> Agent syncs cluster to Git state</div>
                    </div>
                </div>

                <h3>Popular Tools</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tool</th>
                                <th>Model</th>
                                <th>Key Features</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Argo CD</span></td>
                                <td>Pull</td>
                                <td>UI, multi-cluster, App-of-Apps</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Flux CD</span></td>
                                <td>Pull</td>
                                <td>GitOps Toolkit, lightweight</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Jenkins X</span></td>
                                <td>Push</td>
                                <td>CI/CD native, preview envs</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'argocd': `
            <div class="content-card">
                <h2><span class="icon">🐙</span> Argo CD</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Argo CD</strong> is a declarative, GitOps continuous delivery tool for Kubernetes. It acts as the "Agent" that ensures your cluster matches the manifests defined in your Git repository.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Controller:</strong> A custom controller running in your cluster (usually in <code>argocd</code> namespace).</p>
                    <p><strong>Application CRD:</strong> You verify "Apps". <code>kind: Application</code> tells Argo which Git Repo links to which Cluster Namespace.</p>
                    <p><strong>Sync Windows:</strong> You can define when syncs are allowed (e.g., "Don't deploy on Friday evenings").</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">👀</span>
                            <span class="use-case-title">Visual Dashboard</span>
                        </div>
                        <div class="use-case-desc">Provides a beautiful UI to visualize the topology of your app (Pods, Services, Ingress) and see sync status in real time.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🌐</span>
                            <span class="use-case-title">Multi-Cluster</span>
                        </div>
                        <div class="use-case-desc">One ArgoCD instance can manage deployments to 100s of external clusters. Centralized management plane.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📦</span>
                            <span class="use-case-title">App of Apps</span>
                        </div>
                        <div class="use-case-desc">A "Master App" that deploys other Apps. Allows you to bootstrap an entire cluster with 100 microservices using a single YAML file.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Auto-Correction</div>
                    <p>Imagine a thermostat (ArgoCD):</p>
                    <ul>
                        <li><strong>Setting (Git):</strong> You set it to 72°F.</li>
                        <li><strong>Room (Cluster):</strong> It's currently 68°F.</li>
                        <li><strong>Action (Sync):</strong> The thermostat turns on the heat until it hits 72°F. If someone opens a window (Drift), it works harder to maintain 72°F.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Argo Reconciliation</div>
                    <div class="ascii-content">
       ┌───────────────┐
       │   GIT REPO    │
       │ "replicas: 3" │
       └───────┬───────┘
               │
               ▼
       ┌───────────────┐      Compare       ┌───────────────┐
       │    ARGOCD     │ ◄── "replicas: 2" ─│  KUBERNETES   │
       │  CONTROLLER   │      (DRIFT!)      │ (Live State)  │
       └───────┬───────┘                    └───────▲───────┘
               │                                    │
               └──────────► SYNC! ──────────────────┘
                      (kubectl apply)
                            │
                       "replicas: 3"
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Key differentiator:</strong> Why ArgoCD over Flux? ArgoCD has a fantastic <strong>UI</strong> for developers to debug deployment issues without needing kubectl access. Flux is more headless/CLI focused.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Argo = Arguments (Git config)</strong> -> <strong>CD (Continuous Delivery)</strong>. It delivers your arguments to the cluster.</p>
                </div>

                <h3>Argo CD Architecture</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🌐</span>
                        <div class="name">API Server</div>
                        <div class="desc">Exposes API for UI, CLI, CI/CD</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📚</span>
                        <div class="name">Repo Server</div>
                        <div class="desc">Clones & processes Git repos</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔄</span>
                        <div class="name">Application Controller</div>
                        <div class="desc">Reconciles live vs desired state</div>
                    </div>
                </div>

                <h3>Application CRD</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/my-app.git
    targetRevision: HEAD
    path: k8s/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true         # Delete removed resources
      selfHeal: true      # Fix drift automatically
    syncOptions:
    - CreateNamespace=true</pre>
                </div>

                <h3>Sync Status</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-green">Synced</span></td>
                                <td>Live state matches Git</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">OutOfSync</span></td>
                                <td>Live differs from Git</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">Progressing</span></td>
                                <td>Sync in progress</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">Unknown</span></td>
                                <td>Can't determine health</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'crds': `
            <div class="content-card">
                <h2><span class="icon">🧩</span> Custom Resource Definitions (CRDs)</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>CRD</strong> extends the Kubernetes API by defining new resource types. It lets you create your own "Kinds" (like <code>Pizza</code>, <code>Database</code>, <code>PrometheusRule</code>) that behave just like native Pods and Services.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Schema:</strong> You define the structure (OpenAPI v3) of your custom resource (e.g., A Pizza must have 'toppings' and 'size').</p>
                    <p><strong>Storage:</strong> Kubernetes stores instances of your CRD in etcd, just like it stores Pods.</p>
                    <p><strong>No Logic:</strong> A CRD by itself is just data. It needs a <strong>Controller</strong> (Operator) to actually DO something with that data.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">☁️</span>
                            <span class="use-case-title">Managed Services</span>
                        </div>
                        <div class="use-case-desc">Provision cloud resources (AWS S3 Bucket) using Kubernetes YAML by defining an <code>S3Bucket</code> CRD (Crossplane).</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🛡️</span>
                            <span class="use-case-title">Security Policies</span>
                        </div>
                        <div class="use-case-desc">Define complex WAF rules or Cert Manager certificates as native Kubernetes objects.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏭</span>
                            <span class="use-case-title">App Configuration</span>
                        </div>
                        <div class="use-case-desc">Instead of a ConfigMap, use a strongly typed CRD (e.g., <code>AppConfig</code>) that validates inputs before the app even sees them.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Adding Words to Dictionary</div>
                    <ul>
                        <li><strong>Standard Dictionary (K8s API):</strong> Has words like "Pod", "Service", "Node".</li>
                        <li><strong>CRD:</strong> You add a new word: "CronTab".</li>
                        <li><strong>Usage:</strong> Now you can use "CronTab" in sentences (YAML). But until you teach someone (Controller) what "CronTab" means, it's just a word on paper.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Extending the API</div>
                    <div class="ascii-content">
       ┌──────────────────────────────┐
       │         API SERVER           │
       │  (Standard: Pod, Service)    │
       └──────────────┬───────────────┘
                      │
           1. APPLY CRD (Definition)
                      ▼
       ┌──────────────────────────────┐
       │         API SERVER           │
       │ (Now supports: "Database")   │
       └──────────────┬───────────────┘
                      │
           2. USER CREATES INSTANCE
                      ▼
       ┌──────────────────────────────┐
       │   KIND: Database             │
       │   NAME: my-db                │
       └──────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Crucial link:</strong> CRDs are almost always paired with <strong>Operators</strong>. A CRD without a Controller is just a database record that does nothing. The Controller brings it to life.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>CRD = Noun</strong> (The Thing). <strong>Operator = Verb</strong> (The Action).</p>
                </div>

                <h3>CRD YAML</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.example.com
spec:
  group: example.com
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              engine:
                type: string
                enum: ["postgres", "mysql"]
              size:
                type: string
              replicas:
                type: integer
                minimum: 1
  scope: Namespaced
  names:
    plural: databases
    singular: database
    kind: Database
    shortNames:
    - db</pre>
                </div>

                <h3>Using the CRD</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: example.com/v1
kind: Database
metadata:
  name: my-database
spec:
  engine: postgres
  size: "10Gi"
  replicas: 3</pre>
                </div>
            </div>
        `,

        'operators': `
            <div class="content-card">
                <h2><span class="icon">🤖</span> Operators</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>An <strong>Operator</strong> is a software extension that uses CRDs and Controllers to manage applications. It replaces a human operator by automating tasks like backups, upgrades, and failover for stateful apps.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Pattern:</strong> Controller Pattern. Loops forever, comparing Desired State (CRD spec) vs Actual State.</p>
                    <p><strong>Capability Levels:</strong>
                        <ol>
                            <li>Basic Install</li>
                            <li>Seamless Upgrades</li>
                            <li>Full Lifecycle (Backup/Restore)</li>
                            <li>Deep Insights (Monitoring)</li>
                            <li>Auto Pilot (Self-Healing)</li>
                        </ol>
                    </p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💾</span>
                            <span class="use-case-title">Databases</span>
                        </div>
                        <div class="use-case-desc">Postgres Operator. User says <code>replicas: 3</code>. Operator sets up Primary, 2 Standbys, and configuring streaming replication automatically.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔒</span>
                            <span class="use-case-title">Certificate Mgmt</span>
                        </div>
                        <div class="use-case-desc">Cert-Manager. Watches Ingress resources. Automatically challenges Let's Encrypt, gets a cert, and saves it as a Secret. Renews it before expiry.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📊</span>
                            <span class="use-case-title">Monitoring</span>
                        </div>
                        <div class="use-case-desc">Prometheus Operator. Automatically discovers new Services to scrape and reloads Prometheus config without downtime.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Robot Surgeon</div>
                    <p>Managing a Database manually is like doing surgery:</p>
                    <ul>
                        <li><strong>Manual:</strong> Doctor (You) carefuly monitoring vitals and stitching wounds (running backups, fixing replication).</li>
                        <li><strong>Operator:</strong> A Robot Surgeon that knows exactly how to perform the surgery 24/7. It notices a bleed (failover) and stitches it immediately, faster than you could.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Operator Logic</div>
                    <div class="ascii-content">
       ┌───────────────┐
       │ CUSTOM RESOURCE│ (Input)
       │ "Backup: Every│
       │  24 hours"    │
       └───────┬───────┘
               │ 1. Watch Event
               ▼
       ┌───────────────┐
       │   OPERATOR    │ ◄── Does the "Human" work
       │ (Controller)  │
       └───────┬───────┘
               │ 2. Execute Logic
               ▼
       ┌───────────────┐
       │  EXTERNAL DB  │
       │ (Run Backup)  │
       └───────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Core Concept:</strong> Operators are "Kubernetes-native applications". They speak the K8s API language. They are the best way to run Stateful workloads (Databases, Kafka, Elastic) on K8s because they handle the complexity of state.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Operator = Operational Knowledge in Code</strong>. It's an automated SysAdmin in a box.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Operator Pattern</div>
                    <p><strong>CRD:</strong> Defines the API for your application (e.g., Database)<br>
                    <strong>Controller:</strong> Watches for CR changes and reconciles actual state<br>
                    <strong>Reconciliation loop:</strong> Observe → Analyze → Act</p>
                </div>

                <h3>Operator Components</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Operator Reconciliation Loop</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>👁️</span> Watch: Monitor Custom Resources</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📊</span> Compare: Desired vs Actual state</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>⚙️</span> Act: Create/Update/Delete resources</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔄</span> Repeat: Continuously reconcile</div>
                    </div>
                </div>

                <h3>Popular Operators</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Operator</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Prometheus Operator</span></td>
                                <td>Deploy/manage Prometheus monitoring</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">Postgres Operator</span></td>
                                <td>PostgreSQL HA clusters</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Strimzi</span></td>
                                <td>Apache Kafka on Kubernetes</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">Cert-Manager</span></td>
                                <td>TLS certificate automation</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Operator SDK</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                    </div>
                    <pre># Create new operator project
operator-sdk init --domain example.com --repo github.com/me/my-operator

# Create API (CRD + Controller)
operator-sdk create api --group app --version v1 --kind Database

# Build and deploy
make docker-build docker-push IMG=my-registry/my-operator:v1
make deploy IMG=my-registry/my-operator:v1</pre>
                </div>
            </div>
        `,

        'ha': `
            <div class="content-card">
                <h2><span class="icon">🏛️</span> High Availability (HA)</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>High Availability</strong> means your cluster has no single point of failure. It involves redundant Control Plane nodes and Worker nodes across multiple failure domains (Availability Zones).</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Control Plane:</strong> Needs odd number of etcd nodes (3 or 5) for Quorum (Raft consensus). API Server is stateless and load-balanced.</p>
                    <p><strong>Worker Nodes:</strong> Spread across zones (Zone A, B, C). If Zone A burns down, Zone B & C carry the load.</p>
                    <p><strong>Apps:</strong> Must run multiple replicas with <code>podAntiAffinity</code> to spread them out.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔥</span>
                            <span class="use-case-title">Disaster Recovery</span>
                        </div>
                        <div class="use-case-desc">"The datacenter is on fire!" No problem. The cluster stretches to another datacenter. 0 seconds downtime.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚧</span>
                            <span class="use-case-title">Zero Downtime Upgrade</span>
                        </div>
                        <div class="use-case-desc">Upgrade Master Node 1. Masters 2 & 3 keep serving. Then upgrade Master 2... The users never notice the API went down.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚖️</span>
                            <span class="use-case-title">Load Distribution</span>
                        </div>
                        <div class="use-case-desc">Traffic is balanced across zones. Prevents one zone from getting overwhelmed.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Airplane Engines</div>
                    <p>Think of a Jumbo Jet (The Cluster):</p>
                    <ul>
                        <li><strong>Single Node Cluster:</strong> 1 Engine. If it fails, plane crashes.</li>
                        <li><strong>HA Cluster:</strong> 4 Engines. If 1 fails, the other 3 throttle up and the plane keeps flying safely to the destination.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 HA Topology</div>
                    <div class="ascii-content">
           [ LOAD BALANCER ]
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
    ┌───────┐ ┌───────┐ ┌───────┐
    │ MASTER│ │ MASTER│ │ MASTER│
    │   1   │ │   2   │ │   3   │
    └───────┘ └───────┘ └───────┘
       │         │         │
    ┌─────┐   ┌─────┐   ┌─────┐
    │ETCD1│ - │ETCD2│ - │ETCD3│ (Raft Ring)
    └─────┘   └─────┘   └─────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Why do we need 3 etcd nodes, not 2?" — Because of <strong>Split Brain</strong>. If you have 2 nodes and the network cuts, both think they are the leader (50% vote each). You need a majority (>50%) to win. 3 nodes allows 1 failure (2 is majority). 2 nodes allows 0 failures.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Three is Key</strong>. 3 Masters, 3 Etcd, 3 Zones. Triangles are stable structures.</p>
                </div>

                <h3>HA Layers</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🧠</span>
                        <div class="name">Control Plane HA</div>
                        <div class="desc">Multiple API servers, etcd cluster</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">⚙️</span>
                        <div class="name">Worker Node HA</div>
                        <div class="desc">Multiple nodes across zones</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📦</span>
                        <div class="name">Application HA</div>
                        <div class="desc">Replicas, anti-affinity, PDBs</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">💾</span>
                        <div class="name">Storage HA</div>
                        <div class="desc">Replicated storage, multi-zone</div>
                    </div>
                </div>

                <h3>etcd Quorum</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 etcd Cluster Sizing</div>
                    <p>etcd uses Raft consensus. Quorum = (n/2) + 1<br><br>
                    <strong>3 nodes:</strong> Tolerates 1 failure (quorum = 2)<br>
                    <strong>5 nodes:</strong> Tolerates 2 failures (quorum = 3)<br>
                    <strong>7 nodes:</strong> Tolerates 3 failures (quorum = 4)<br><br>
                    Always use odd numbers! Even numbers don't improve fault tolerance.</p>
                </div>

                <h3>Pod Disruption Budget</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: my-app-pdb
spec:
  minAvailable: 2          # At least 2 pods must be available
  # OR
  # maxUnavailable: 1      # At most 1 pod can be unavailable
  selector:
    matchLabels:
      app: my-app</pre>
                </div>

                <h3>Topology Spread Constraints</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: my-app</pre>
                </div>
            </div>
        `,

        'monitoring': `
            <div class="content-card">
                <h2><span class="icon">📊</span> Monitoring & Observability</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Monitoring</strong> tells you if the system is healthy. <strong>Observability</strong> tells you <em>why</em> it's not healthy. It involves Metrics (numbers), Logs (text), and Traces (path).</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Prometheus (Metrics):</strong> Pull-based. Scrapes <code>/metrics</code> endpoint of every pod every 15s. Stores time-series data.</p>
                    <p><strong>Grafana (Visuals):</strong> Queries Prometheus and draws pretty graphs.</p>
                    <p><strong>ELK/Fluentd (Logs):</strong> Collects logs from stdout/stderr and indexes them for searching.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚨</span>
                            <span class="use-case-title">Alerting</span>
                        </div>
                        <div class="use-case-desc">"Wake me up if Error Rate > 1%". PagerDuty integration ensures you sleep soundly unless things are actually broken.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📉</span>
                            <span class="use-case-title">Capacity Planning</span>
                        </div>
                        <div class="use-case-desc">"We are growing 10% per week. We will run out of RAM in 4 weeks." Allows proactive scaling.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🕵️</span>
                            <span class="use-case-title">Debugging</span>
                        </div>
                        <div class="use-case-desc">Correlate spike in Latency (Grafana) with Error Logs (Kibana) to find the bad code deployment.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Car Dashboard</div>
                    <ul>
                        <li><strong>Speedometer (Metrics):</strong> "I am going 100mph." (Fact).</li>
                        <li><strong>Check Engine Light (Alert):</strong> "Something is wrong!" (Notification).</li>
                        <li><strong>Mechanic's Diagnostic Tool (Logs/Traces):</strong> "Cylinder 3 misfire due to bad spark plug." (Root Cause).</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Prometheus Scraping</div>
                    <div class="ascii-content">
       ┌───────────────┐
       │  PROMETHEUS   │ ◄──── (Queries) ──── USER (Grafana)
       │  SERVER (TSDB)│
       └───────┬───────┘
               │ "Give me metrics!" (Every 15s)
               ▼
       ┌───────────────┐
       │   POD / APP   │
       │   /metrics    │
       │ (http_reqs=5) │
       └───────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Golden Signals:</strong> Google uses 4 signals for monitoring: <strong>Latency</strong> (Time), <strong>Traffic</strong> (Load), <strong>Errors</strong> (Failures), and <strong>Saturation</strong> (Fullness). Memorize LFES (Latency, Traffic, Errors, Saturation).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Metrics = Numbers</strong> (How much?). <strong>Logs = Text</strong> (What happened?). <strong>Traces = Path</strong> (Where did it go?).</p>
                </div>

                <h3>Three Pillars</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📈</span>
                        <div class="name">Metrics</div>
                        <div class="desc">Numerical measurements over time</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📝</span>
                        <div class="name">Logs</div>
                        <div class="desc">Discrete events with context</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔗</span>
                        <div class="name">Traces</div>
                        <div class="desc">Request flow across services</div>
                    </div>
                </div>

                <h3>Monitoring Stack</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Tool</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Metrics</td>
                                <td><span class="badge badge-blue">Prometheus</span></td>
                                <td>Scrape, store, query metrics</td>
                            </tr>
                            <tr>
                                <td>Visualization</td>
                                <td><span class="badge badge-green">Grafana</span></td>
                                <td>Dashboards and alerts</td>
                            </tr>
                            <tr>
                                <td>Logs</td>
                                <td><span class="badge badge-orange">Loki</span></td>
                                <td>Log aggregation</td>
                            </tr>
                            <tr>
                                <td>Traces</td>
                                <td><span class="badge badge-purple">Jaeger</span></td>
                                <td>Distributed tracing</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Four Golden Signals</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 What to Monitor</div>
                    <p><strong>Latency:</strong> Time to serve a request<br>
                    <strong>Traffic:</strong> Requests per second<br>
                    <strong>Errors:</strong> Failed request rate<br>
                    <strong>Saturation:</strong> How "full" the system is</p>
                </div>

                <h3>Prometheus Query Examples</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">PromQL</span>
                    </div>
                    <pre># CPU usage by pod
sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)

# Memory usage
container_memory_usage_bytes / container_spec_memory_limit_bytes

# Request rate
sum(rate(http_requests_total[5m])) by (status_code)

# P99 latency
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))</pre>
                </div>
            </div>
        `,

        'backup': `
            <div class="content-card">
                <h2><span class="icon">💾</span> Backup & DR</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Backup & Disaster Recovery (DR)</strong> involves capturing the state of your cluster (ETCD data + Persistent Volumes) so you can restore it in case of catastrophic failure (region outage, ransomware, accidental deletion).</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Velero:</strong> The standard tool. It takes snapshots of Etcd (metadata) and Persistent Volumes (data) and pushes them to Object Storage (S3).</p>
                    <p><strong>Etcd Snapshot:</strong> <code>etcdctl snapshot save</code>. The raw database backup of Kubernetes.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🧨</span>
                            <span class="use-case-title">Accidental Deletion</span>
                        </div>
                        <div class="use-case-desc">"Oops, I deleted the Production Namespace!" Velero Restore brings it back in minutes.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚚</span>
                            <span class="use-case-title">Migration</span>
                        </div>
                        <div class="use-case-desc">Move from On-Prem to Cloud? Backup On-Prem -> S3 -> Restore to Cloud.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🧪</span>
                            <span class="use-case-title">Cloning Env</span>
                        </div>
                        <div class="use-case-desc">Copy Production data to Staging for realistic testing.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Save Game</div>
                    <p>Think of Video Games:</p>
                    <ul>
                        <li><strong>Failing without Backup:</strong> You die at the final boss and have to restart the ENTIRE game from Level 1.</li>
                        <li><strong>With Backup (Save Point):</strong> You die, reload the save file, and try again from the boss room.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Velero Workflow</div>
                    <div class="ascii-content">
       ┌───────────────┐
       │  KUBERNETES   │
       │ (Resource YAML)──┐
       │ (PV Data)     │  │
       └───────┬───────┘  │
               │          │ 1. SNAPSHOT
               ▼          ▼
       ┌──────────────────────────────┐
       │      VELERO CONTROLLER       │
       └──────────────┬───────────────┘
                      │ 2. UPLOAD TARBALL
                      ▼
       ┌──────────────────────────────┐
       │       S3 BUCKET              │
       │    (Safe External Storage)   │
       └──────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Important:</strong> Backing up <em>just</em> the YAMLs (Git) is NOT enough. You must backup the <strong>Persistent Volumes</strong> (Database data) too! GitOps restores the app, but Velero restores the data.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Velero = Velcro</strong>. It sticks your data to a safe place (S3) so you don't lose it.</p>
                </div>

                <h3>What to Backup</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📚</span>
                        <div class="name">etcd</div>
                        <div class="desc">Cluster state, all objects</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">💽</span>
                        <div class="name">Persistent Volumes</div>
                        <div class="desc">Application data</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔒</span>
                        <div class="name">Secrets</div>
                        <div class="desc">Credentials, TLS certs</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📄</span>
                        <div class="name">CRDs & CRs</div>
                        <div class="desc">Custom resources</div>
                    </div>
                </div>

                <h3>etcd Backup</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Create snapshot
ETCDCTL_API=3 etcdctl snapshot save backup.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify snapshot
etcdctl snapshot status backup.db

# Restore (on new cluster)
etcdctl snapshot restore backup.db \\
  --data-dir=/var/lib/etcd-restored</pre>
                </div>

                <h3>Velero</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Install Velero
velero install --provider aws --bucket my-bucket --secret-file ./creds

# Backup namespace
velero backup create my-backup --include-namespaces production

# Schedule regular backups
velero schedule create daily-backup --schedule="0 2 * * *"

# Restore
velero restore create --from-backup my-backup</pre>
                </div>

                <h3>RPO vs RTO</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Definition</th>
                                <th>Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">RPO</span></td>
                                <td>Recovery Point Objective - max data loss</td>
                                <td>1 hour = backups every hour</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">RTO</span></td>
                                <td>Recovery Time Objective - max downtime</td>
                                <td>4 hours = restore within 4 hours</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'troubleshooting': `
            <div class="content-card">
                <h2><span class="icon">🔧</span> Troubleshooting Guide</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>Troubleshooting</strong> is the systematic process of identifying and fixing issues in a Kubernetes cluster. It requires knowing where to look: Pod status, Events, Logs, and Node health.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 The 4-Step Method</div>
                    <p><strong>1. Check Status:</strong> <code>kubectl get pods</code>. (Pending? CrashLoop?)</p>
                    <p><strong>2. Describe:</strong> <code>kubectl describe pod X</code>. Look at "Events" at bottom. (No node available? Mount failed?)</p>
                    <p><strong>3. Logs:</strong> <code>kubectl logs pod X</code>. Application stack traces.</p>
                    <p><strong>4. Node:</strong> <code>kubectl get nodes</code>. Is the node actually Ready?</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔄</span>
                            <span class="use-case-title">CrashLoopBackOff</span>
                        </div>
                        <div class="use-case-desc">App starts and dies immediately. Usually: Missing ConfigMap, Verify DB connection, Code bug (Panic). CHECK LOGS.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⏳</span>
                            <span class="use-case-title">Pending</span>
                        </div>
                        <div class="use-case-desc">Pod not scheduled. Usually: CPU/RAM requested > Node capacity, Taints preventing scheduling, PVC not bound. CHECK EVENTS.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚫</span>
                            <span class="use-case-title">ImagePullBackOff</span>
                        </div>
                        <div class="use-case-desc">Can't get image. Usually: Typo in image name, Tag doesn't exist, Missing <code>imagePullSecrets</code> (Auth).</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Doctor's Visit</div>
                    <ul>
                        <li><strong>Get Pods:</strong> Doctor asks "Where does it hurt?" (Symptoms).</li>
                        <li><strong>Describe:</strong> Doctor checks vitals (BP, Events).</li>
                        <li><strong>Logs:</strong> Doctor asks "What did you eat?" (Internal History).</li>
                        <li><strong>Fix:</strong> Prescribe medicine (Config Change) or Surgery (Node Replacement).</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Debug Flow</div>
                    <div class="ascii-content">
      START
        │
        ▼
   [ Get Pods ] ───► Running? ──► [ Check Service / Ingress ]
        │ No             (App URL failing?)
        ▼
   [ Describe ] ───► Events say?
        │               │ "Insufficient CPU" -> Resize Node
        │               │ "PullErr" -> Check Image Name
        ▼
    [ Logs ] ───► "Connection Refused"? -> Check DB
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Killer Question:</strong> "A Pod is Running but the user sees 502 Bad Gateway. What do you check?" — Check <strong>Service/Endpoints</strong>! Does the Service select the Pods? Are the Probes passing? If Readiness fails, Service removes the IP, causing 502s.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>S.D.L.</strong> = Status -> Describe -> Logs. Always in that order.</p>
                </div>

                <h3>Common Issues</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Symptom</th>
                                <th>Possible Causes</th>
                                <th>Debug Commands</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-orange">Pending Pod</span></td>
                                <td>No resources, taints, affinity</td>
                                <td>kubectl describe pod</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-purple">ImagePullBackOff</span></td>
                                <td>Wrong image, no creds, registry down</td>
                                <td>kubectl describe pod (Events)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">CrashLoopBackOff</span></td>
                                <td>App crash, bad config, OOM</td>
                                <td>kubectl logs --previous</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">OOMKilled</span></td>
                                <td>Memory limit exceeded</td>
                                <td>kubectl describe pod, top</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Debug Commands</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Pod debugging
kubectl describe pod my-pod
kubectl logs my-pod -c container-name
kubectl logs my-pod --previous
kubectl exec -it my-pod -- sh

# Network debugging  
kubectl run debug --image=busybox -it --rm -- sh
nslookup kubernetes.default
wget -qO- http://my-service:80

# Node debugging
kubectl describe node my-node
kubectl top nodes
kubectl get events --sort-by='.lastTimestamp'

# Cluster-wide
kubectl get pods -A | grep -v Running
kubectl get events -A --field-selector type=Warning</pre>
                </div>

                <h3>Pending Pod Flowchart</h3>
                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Debugging Pending Pods</div>
                    <p>1. Check <code>kubectl describe pod</code> → Events section<br>
                    2. <strong>Insufficient resources?</strong> → Scale nodes or reduce requests<br>
                    3. <strong>Node selector/affinity?</strong> → Check node labels match<br>
                    4. <strong>Taints?</strong> → Add tolerations or remove taints<br>
                    5. <strong>PVC Pending?</strong> → Check StorageClass, PV availability<br>
                    6. <strong>ResourceQuota exceeded?</strong> → Check namespace quota</p>
                </div>

                <h3>DNS Debugging</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Test DNS resolution from a pod
kubectl run dns-test --image=busybox:1.28 --rm -it -- nslookup kubernetes

# Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Check CoreDNS logs
kubectl logs -n kube-system -l k8s-app=kube-dns</pre>
                </div>
            </div>
        `,

        'scenarios': `
            <div class="content-card">
                <h2><span class="icon">🚨</span> Real-World Troubleshooting Scenarios</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Interactive Learning</div>
                    <p>Click each scenario to walk through the diagnosis and resolution steps. These are based on real production incidents like "The 502 Nightmare" and "The Infinite Restart".</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Why Scenarios Matter</div>
                    <p>Knowing <code>kubectl</code> commands is theory. Solving a live outage with the CEO breathing down your neck is practice. We simulate the pressure here.</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🕸️</span>
                            <span class="use-case-title">502 Bad Gateway</span>
                        </div>
                        <div class="use-case-desc">Users see 502. Pods are running. Issue: Readiness Probe failing, Service removing endpoints.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💾</span>
                            <span class="use-case-title">Volume Hung</span>
                        </div>
                        <div class="use-case-desc">Pod stuck in "ContainerCreating". Issue: Old node didn't detach the EBS volume. Force deletion needed.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🐢</span>
                            <span class="use-case-title">Slow App</span>
                        </div>
                        <div class="use-case-desc">App is crawling. Issue: CPU Throttling (Limits too low) or Neighbor abusing bandwidth.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Fire Drill</div>
                    <p>Every Friday, Netflix runs "Chaos Monkey" to randomly kill servers. This forces engineers to build resilient systems. These scenarios are your Chaos Monkey.</p>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Incident Response</div>
                    <div class="ascii-content">
      [ ALERT FIRED ]
            │
            ▼
    [ ACKNOWLEDGE ] ───►  Slack/PagerDuty
            │
            ▼
    [ TRIAGE ] ──► Severity? (P1/P2/P3)
            │
            ▼
    [ MITIGATE ] ──► Rollback / Scale / Restart
            │          (Stop the bleeding)
            ▼
    [ INVESTIGATE ] ──► Root Cause Analysis (RCA)
            │
            ▼
      [ FIX ] ──► Patch Code / Config
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>STAR Method:</strong> When asked "Tell me about a time you fixed a bug", use <strong>S</strong>ituation (Prod Down), <strong>T</strong>ask (Fix it), <strong>A</strong>ction (Checked logs, found OOM, increased limit), <strong>R</strong>esult (Uptime restored, added alert).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Stop the Bleeding</strong> first. Fix the root cause later. If the patient is bleeding, apply a tourniquet (Restart/Rollback) before doing an MRI (Deep Debugging).</p>
                </div>

                <div class="scenario-card" onclick="toggleScenario(this)">
                    <div class="scenario-header">
                        <span class="scenario-icon">🔥</span>
                        <div>
                            <div class="scenario-title">Pods Are Crashing in Production!</div>
                            <div class="scenario-subtitle">Click to walk through diagnosis</div>
                        </div>
                    </div>
                    <div class="scenario-steps">
                        <div class="scenario-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Check Pod Status</h4>
                                <p><code>kubectl get pods -n production</code><br>Look for CrashLoopBackOff or Error status</p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Get Previous Logs</h4>
                                <p><code>kubectl logs &lt;pod-name&gt; --previous</code><br>See what the app logged before crashing</p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Check Exit Code</h4>
                                <p><code>kubectl describe pod &lt;pod-name&gt;</code><br>
                                Exit 137 = OOMKilled (memory)<br>
                                Exit 1 = Application error<br>
                                Exit 127 = Command not found</p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Fix Based on Cause</h4>
                                <p><strong>OOMKilled:</strong> Increase memory limits<br>
                                <strong>App Error:</strong> Check code/config<br>
                                <strong>Probes:</strong> Adjust timing</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="scenario-card" onclick="toggleScenario(this)">
                    <div class="scenario-header">
                        <span class="scenario-icon">⏳</span>
                        <div>
                            <div class="scenario-title">Pods Stuck in Pending State</div>
                            <div class="scenario-subtitle">Click to diagnose scheduling issues</div>
                        </div>
                    </div>
                    <div class="scenario-steps">
                        <div class="scenario-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Check Events</h4>
                                <p><code>kubectl describe pod &lt;pod-name&gt;</code><br>Look at the Events section for clues</p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Common Causes</h4>
                                <p>• "Insufficient cpu/memory" → Nodes are full<br>
                                • "No nodes match selector" → Wrong labels<br>
                                • "Taint xyz not tolerated" → Add tolerations<br>
                                • "PVC not bound" → Storage issue</p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Check Node Capacity</h4>
                                <p><code>kubectl describe nodes | grep -A 5 "Allocated"</code></p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Solutions</h4>
                                <p>• Add more nodes (Cluster Autoscaler)<br>
                                • Reduce resource requests<br>
                                • Fix node selectors/tolerations</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="scenario-card" onclick="toggleScenario(this)">
                    <div class="scenario-header">
                        <span class="scenario-icon">🌐</span>
                        <div>
                            <div class="scenario-title">Service Not Reachable</div>
                            <div class="scenario-subtitle">Click to debug networking issues</div>
                        </div>
                    </div>
                    <div class="scenario-steps">
                        <div class="scenario-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Verify Service Endpoints</h4>
                                <p><code>kubectl get endpoints &lt;svc-name&gt;</code><br>If empty, selector doesn't match pods</p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Test from Inside Cluster</h4>
                                <p><code>kubectl run debug --image=busybox --rm -it -- wget -qO- http://&lt;svc-name&gt;:&lt;port&gt;</code></p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Check Network Policies</h4>
                                <p><code>kubectl get networkpolicy -n &lt;namespace&gt;</code><br>Policies might be blocking traffic</p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Verify Pod is Ready</h4>
                                <p>Check readinessProbe is passing. Failing probes remove pod from service endpoints.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="scenario-card" onclick="toggleScenario(this)">
                    <div class="scenario-header">
                        <span class="scenario-icon">💾</span>
                        <div>
                            <div class="scenario-title">PersistentVolumeClaim Stuck Pending</div>
                            <div class="scenario-subtitle">Click to resolve storage issues</div>
                        </div>
                    </div>
                    <div class="scenario-steps">
                        <div class="scenario-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Check PVC Events</h4>
                                <p><code>kubectl describe pvc &lt;pvc-name&gt;</code></p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Verify StorageClass Exists</h4>
                                <p><code>kubectl get storageclass</code><br>Check if the requested class exists and is default</p>
                            </div>
                        </div>
                        <div class="scenario-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Check CSI Driver</h4>
                                <p><code>kubectl get pods -n kube-system | grep csi</code><br>Ensure provisioner is running</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,

        'playground': `
            <div class="content-card">
                <h2><span class="icon">💻</span> kubectl Playground</h2>
                
                <div class="definition-box">
                    <div class="definition-header">🎮 Try It Yourself!</div>
                    <p>Practice kubectl commands in this simulated terminal. Type <code>help</code> for available commands.</p>
                </div>

                <div class="playground-container">
                    <div class="playground-header">
                        <div class="playground-title">
                            <span>🖥️</span> Simulated Terminal
                        </div>
                        <div class="playground-tabs">
                            <button class="playground-tab active">kubectl</button>
                        </div>
                    </div>
                    <div class="playground-terminal" id="playground-output">
                        <div class="terminal-line">
                            <span class="terminal-prompt">$</span>
                            <span class="terminal-command">kubectl cluster-info</span>
                        </div>
                        <div class="terminal-output">Kubernetes control plane is running at https://192.168.1.100:6443
CoreDNS is running at https://192.168.1.100:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy</div>
                        <div class="terminal-line" style="color: var(--text-muted); margin-top: 10px;">
                            Type 'help' for available commands
                        </div>
                    </div>
                    <div style="padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center;">
                        <span class="terminal-prompt">$</span>
                        <input type="text" class="terminal-input" id="playground-input" 
                               placeholder="Enter kubectl command..."
                               onkeydown="handlePlaygroundKeydown(event, this)">
                    </div>
                </div>

                <h3>Interactive Flowchart: Request Flow</h3>
                <div class="flowchart-container">
                    <div class="flowchart-title">🔄 Click each component to learn more</div>
                    <div class="flowchart-nodes">
                        <div class="flowchart-node" id="flow-user" onclick="showFlowchartDetails('flow-user', 'detail-user')">
                            <div class="flowchart-node-icon">👤</div>
                            <div class="flowchart-node-label">User</div>
                        </div>
                        <div class="flowchart-arrow">→</div>
                        <div class="flowchart-node" id="flow-ingress" onclick="showFlowchartDetails('flow-ingress', 'detail-ingress')">
                            <div class="flowchart-node-icon">🚪</div>
                            <div class="flowchart-node-label">Ingress</div>
                        </div>
                        <div class="flowchart-arrow">→</div>
                        <div class="flowchart-node" id="flow-service" onclick="showFlowchartDetails('flow-service', 'detail-service')">
                            <div class="flowchart-node-icon">🔀</div>
                            <div class="flowchart-node-label">Service</div>
                        </div>
                        <div class="flowchart-arrow">→</div>
                        <div class="flowchart-node" id="flow-pod" onclick="showFlowchartDetails('flow-pod', 'detail-pod')">
                            <div class="flowchart-node-icon">📦</div>
                            <div class="flowchart-node-label">Pod</div>
                        </div>
                    </div>
                    
                    <div class="flowchart-details" id="detail-user">
                        <h4>👤 User Request</h4>
                        <p>External user makes HTTP request to your domain (e.g., <code>https://api.example.com/users</code>). DNS resolves to your load balancer IP.</p>
                    </div>
                    <div class="flowchart-details" id="detail-ingress">
                        <h4>🚪 Ingress Controller</h4>
                        <p>Ingress examines the Host header and path, then routes to the correct backend Service based on Ingress rules. Also handles TLS termination.</p>
                    </div>
                    <div class="flowchart-details" id="detail-service">
                        <h4>🔀 Service</h4>
                        <p>Service uses kube-proxy rules (iptables/IPVS) to load-balance traffic across healthy Pod endpoints. Endpoints are updated when Pods pass readiness probes.</p>
                    </div>
                    <div class="flowchart-details" id="detail-pod">
                        <h4>📦 Pod</h4>
                        <p>Container receives the request and processes it. Response travels back through the same path.</p>
                    </div>
                </div>

                <h3>YAML Editor: Try It Yourself!</h3>
                <div class="yaml-editor-container">
                    <div class="yaml-editor-header">
                        <div class="yaml-editor-title">
                            <span>📝</span> deployment.yaml
                        </div>
                        <div class="yaml-editor-actions">
                            <button class="yaml-action-btn validate" onclick="validateYaml('yaml-editor-1')">✓ Validate</button>
                        </div>
                    </div>
                    <textarea class="yaml-editor" id="yaml-editor-1">apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80</textarea>
                    <div class="yaml-validation-result" id="yaml-editor-1-result"></div>
                </div>
            </div>
        `,

        'comparisons': `
            <div class="content-card">
                <h2><span class="icon">⚖️</span> Comparison Tables</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📊 Side-by-Side Comparisons</div>
                    <p>Compare similar Kubernetes concepts to understand when to use each.</p>
                </div>

                <h3>Autoscaling Comparison</h3>
                <div class="comparison-container">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>HPA</th>
                                <th>VPA</th>
                                <th>Cluster Autoscaler</th>
                                <th>Karpenter</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="feature-name">What it scales</td>
                                <td>Pod replicas</td>
                                <td>Pod resources</td>
                                <td>Node count</td>
                                <td>Node count</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Metrics based</td>
                                <td><span class="comparison-check">✓</span> CPU/Memory/Custom</td>
                                <td><span class="comparison-check">✓</span> Historical usage</td>
                                <td><span class="comparison-cross">✗</span> Pending pods</td>
                                <td><span class="comparison-cross">✗</span> Pending pods</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Pod restarts required</td>
                                <td><span class="comparison-cross">✗</span> No</td>
                                <td><span class="comparison-check">✓</span> Yes (eviction)</td>
                                <td><span class="comparison-cross">✗</span> No</td>
                                <td><span class="comparison-cross">✗</span> No</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Reaction speed</td>
                                <td>15-30 seconds</td>
                                <td>Minutes (eviction)</td>
                                <td>2-5 minutes</td>
                                <td>30-60 seconds</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Best for</td>
                                <td>Stateless apps</td>
                                <td>Right-sizing</td>
                                <td>Node groups</td>
                                <td>Dynamic workloads</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Service Types Comparison</h3>
                <div class="comparison-container">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Cluster Access</th>
                                <th>External Access</th>
                                <th>Load Balancer</th>
                                <th>Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="feature-name">ClusterIP</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td>Internal services</td>
                            </tr>
                            <tr>
                                <td class="feature-name">NodePort</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td>Dev/testing</td>
                            </tr>
                            <tr>
                                <td class="feature-name">LoadBalancer</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-check">✓</span> Cloud LB</td>
                                <td>Production external</td>
                            </tr>
                            <tr>
                                <td class="feature-name">ExternalName</td>
                                <td><span class="comparison-partial">~</span> DNS only</td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td>External DNS alias</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>CNI Plugins Comparison</h3>
                <div class="comparison-container">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>CNI Plugin</th>
                                <th>Network Policy</th>
                                <th>Encryption</th>
                                <th>eBPF</th>
                                <th>Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="feature-name">Calico</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-check">✓</span> WireGuard</td>
                                <td><span class="comparison-check">✓</span> Optional</td>
                                <td>Enterprise, multi-cloud</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Cilium</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-check">✓</span> Native</td>
                                <td>High performance, observability</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Flannel</td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td>Simple setups, learning</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Weave Net</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-check">✓</span></td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td>Multi-cluster mesh</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Deployment Strategies Comparison</h3>
                <div class="comparison-container">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Strategy</th>
                                <th>Zero Downtime</th>
                                <th>Rollback Speed</th>
                                <th>Resource Cost</th>
                                <th>Risk Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="feature-name">Recreate</td>
                                <td><span class="comparison-cross">✗</span></td>
                                <td>Slow</td>
                                <td>Low (1x)</td>
                                <td>High</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Rolling Update</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td>Medium</td>
                                <td>Medium (+25%)</td>
                                <td>Medium</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Blue-Green</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td>Instant</td>
                                <td>High (2x)</td>
                                <td>Low</td>
                            </tr>
                            <tr>
                                <td class="feature-name">Canary</td>
                                <td><span class="comparison-check">✓</span></td>
                                <td>Fast</td>
                                <td>Medium (+10-20%)</td>
                                <td>Very Low</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Before / After: Applying a Deployment</h3>
                <div class="before-after-container">
                    <div class="before-panel">
                        <div class="panel-header">
                            <span>❌</span> Before: No Replicas
                        </div>
                        <div class="panel-content">
                            <code>kubectl get pods</code>
                            <pre style="margin-top: 10px; color: var(--text-secondary);">No resources found in default namespace.</pre>
                        </div>
                    </div>
                    <div class="after-panel">
                        <div class="panel-header">
                            <span>✅</span> After: 3 Running Pods
                        </div>
                        <div class="panel-content">
                            <code>kubectl apply -f deployment.yaml</code>
                            <pre style="margin-top: 10px; color: var(--text-secondary);">NAME                    READY   STATUS
nginx-7fb96-4vnqg       1/1     Running
nginx-7fb96-8x2k1       1/1     Running
nginx-7fb96-q3m5p       1/1     Running</pre>
                        </div>
                    </div>
                </div>
            </div>
        `
        ,
        'service-account': `
            <div class="content-card">
                <h2><span class="icon">🤖</span> ServiceAccount</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p>A <strong>ServiceAccount (SA)</strong> is an identity for non-human users (Pods). While standard Users are for humans (you), ServiceAccounts are for processes (CI/CD bots, Applications) that need to talk to the API Server.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Identity for Pods:</strong> When a Pod runs, it's not "you" running it. It needs its own ID card to authenticate with the API Server.</p>
                    <p>Every Pod gets a default ServiceAccount if you don't specify one. This SA token is mounted at <code>/var/run/secrets/kubernetes.io/serviceaccount</code>.</p>
                    <p><strong>RBAC Connection:</strong> You bind Roles to ServiceAccounts. "This ServiceAccount can list pods."</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🚢</span>
                            <span class="use-case-title">CI/CD Pipeline</span>
                        </div>
                        <div class="use-case-desc">Jenkins/ArgoCD pods use an SA to deploy apps (kubectl apply) without your personal credentials.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📊</span>
                            <span class="use-case-title">Monitoring Apps</span>
                        </div>
                        <div class="use-case-desc">Prometheus needs read-only access to scrape metrics. It runs with a specific SA.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">☁️</span>
                            <span class="use-case-title">Cloud Identity</span>
                        </div>
                        <div class="use-case-desc">Link SA to AWS IAM Role (IRSA) so pods can access S3 buckets beautifully!</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Employee Key Card</div>
                    <p>Think of an Office Building (Cluster):</p>
                    <ul>
                        <li><strong>You (User):</strong> Need a passport/ID (User Cert) to enter. Global id.</li>
                        <li><strong>Cleaning Robot (Pod):</strong> Needs a programmed Key Card (ServiceAccount) to open doors.</li>
                        <li><strong>Permissions:</strong> The Robot's key card only opens the closet (RoleBinding), not the CEO's office.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 ServiceAccount Auth Flow</div>
                    <div class="ascii-content">
      [ POD ] ──────────────► [ API SERVER ]
         │                          │
    (Has Token)              (Verifies Header)
  "Bearer eyJhb..."               │
         │                          ▼
         └───── Authenticates as: system:serviceaccount:default:my-sa
                                    │
                                    ▼
                             [ RBAC CHECK ]
                             (Can 'my-sa' list pods?)
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Trick Question:</strong> "Does the default ServiceAccount have admin access?" — <strong>NO!</strong> By default, it has almost no permissions. You normally have to create a new SA and bind a Role to it.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>ServiceAccount = Software Account</strong>. User Account = User (Human). SAs are namespaced!</p>
                </div>
            </div>
        `,

        'resource-quota': `
            <div class="content-card">
                <h2><span class="icon">💰</span> ResourceQuota</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>ResourceQuota</strong> provides constraints that limit aggregate resource consumption per Namespace. It's the "Department Budget".</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Why do we need it?</strong> In a multi-tenant cluster, you don't want the "Dev Team" to accidentally consume all 100 CPUs, leaving "Prod Team" starving.</p>
                    <p>Quotas define limits on: <strong>Compute</strong> (Total CPU/Mem), <strong>Storage</strong> (Total PVC size), and <strong>Object Count</strong> (Max 10 Pods, Max 5 Services).</p>
                    <p>If you try to create a Pod that exceeds the quota -> <strong>403 Forbidden!</strong></p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🏢</span>
                            <span class="use-case-title">Multi-Tenancy</span>
                        </div>
                        <div class="use-case-desc">Team A gets 10 CPUs. Team B gets 20 CPUs. Hard limits ensure fair sharing.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🛑</span>
                            <span class="use-case-title">Cost Control</span>
                        </div>
                        <div class="use-case-desc">Prevent a bug in a dev script from spinning up 1000 LoadBalancers ($$$).</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🧹</span>
                            <span class="use-case-title">Object Hygiene</span>
                        </div>
                        <div class="use-case-desc">Limit 'secrets' count to preventing etcd bloat in specific namespaces.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The Family Data Plan</div>
                    <p>Think of a shared mobile data plan:</p>
                    <ul>
                        <li><strong>Family Plan (Cluster):</strong> 100GB total.</li>
                        <li><strong>Teenager (Namespace A):</strong> Quota = 20GB. Once they hit 20GB, data stops work (Pod rejected).</li>
                        <li><strong>Parents (Namespace B):</strong> Quota = 80GB.</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Quota Enforcement</div>
                    <div class="ascii-content">
      User ──► kubectl apply ──► [ API Server ]
                                     │
                                     ▼
                            [ ResourceQuota Controller ]
                                     │
                        ┌────────────┴────────────┐
                        │ Is (Current + New)      │
                        │    <= Quota Limit?      │
                        └────────────┬────────────┘
                            YES │         │ NO
                                ▼         ▼
                           [ CREATE ]   [ REJECT 403 ]
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Golden Rule:</strong> If you enable a ResourceQuota for CPU/Memory in a namespace, <strong>EVERY</strong> Pod created in that namespace MUST have requests/limits defined (or use LimitRange), otherwise it gets rejected!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Quota = Total Pie</strong>. It limits the size of the whole slice for the namespace.</p>
                </div>
            </div>
        `,

        'limit-range': `
            <div class="content-card">
                <h2><span class="icon">🚧</span> LimitRange</h2>
                
                <div class="definition-box">
                    <div class="definition-header">📖 Definition</div>
                    <p><strong>LimitRange</strong> enforces constraints on <em>individual</em> Pods or Containers within a Namespace. It sets Min/Max limits and Defaults.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Quota vs LimitRange:</strong> Quota is for the <em>Team</em> (Aggregate). LimitRange is for the <em>Individual</em> (Per Pod).</p>
                    <p><strong>Superpower:</strong> It can automatically inject <strong>default</strong> CPU/Memory requests if the user forgets to specify them! It also stops you from creating a tiny pod (1m CPU) or a massive pod (100 CPU).</p>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔨</span>
                            <span class="use-case-title">Enforce Defaults</span>
                        </div>
                        <div class="use-case-desc">Devs lazy? LimitRange automatically adds <code>requests: 100m</code> to every pod.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">🔍</span>
                            <span class="use-case-title">Prevent Tiny/Huge</span>
                        </div>
                        <div class="use-case-desc">Reject pods < 100m CPU (unusable) or > 10 CPU (hogs node).</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚖️</span>
                            <span class="use-case-title">Ratio Control</span>
                        </div>
                        <div class="use-case-desc">Enforce "Limit to Request" ratio (e.g., max 2:1) to prevent overcommitment.</div>
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Rollercoaster Rules</div>
                    <ul>
                        <li><strong>Min Limit:</strong> "You must be at least this tall to ride" (Min CPU).</li>
                        <li><strong>Max Limit:</strong> "You cannot be taller than this" (Max CPU).</li>
                        <li><strong>Default:</strong> "If you don't bring a lunch, we give you a standard sandwich" (Default Request).</li>
                    </ul>
                </div>

                <h3>ASCII Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 LimitRange Injection</div>
                    <div class="ascii-content">
      User (No Limits) ──► API Server
                              │
                              ▼
                     [ LimitRange (Admission) ]
                              │
                    ┌─────────┴─────────┐
                    │  Inject Defaults? │
                    │  Check Min/Max?   │
                    └─────────┬─────────┘
                              │
                              ▼
                [ Pod Created with Defaults! ]
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Scenario:</strong> "I tried to create a pod with 200m CPU, but it failed saying 'Min is 500m'. Who blocked it?" — The <strong>LimitRange</strong> Admission Controller!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>Range = Min to Max</strong>. Use LimitRange to define the acceptable "Range" for a single pod.</p>
                </div>
            </div>
        `
    };

    return contents[id] || `
        <div class="content-card">
            <h2>🚧 Coming Soon</h2>
            <p>Content for "${id}" is being developed. Check back soon!</p>
            <button class="cta-button" onclick="loadContent('api-server')">
                <span>Go to API Server</span>
            </button>
        </div>
    `;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('pre').textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copied!';
        button.style.background = 'var(--k8s-green)';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check for hash in URL
    if (window.location.hash) {
        const id = window.location.hash.substring(1);
        loadContent(id);
    }
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    if (window.location.hash) {
        loadContent(window.location.hash.substring(1));
    } else {
        document.getElementById('hero').style.display = 'flex';
        document.getElementById('content-container').style.display = 'none';
    }
});

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
const searchData = [
    { id: 'api-server', title: 'API Server', category: 'Control Plane', icon: '🌐' },
    { id: 'etcd', title: 'etcd', category: 'Control Plane', icon: '💾' },
    { id: 'scheduler', title: 'Scheduler', category: 'Control Plane', icon: '📋' },
    { id: 'controller-manager', title: 'Controller Manager', category: 'Control Plane', icon: '🔄' },
    { id: 'kubelet', title: 'Kubelet', category: 'Worker Nodes', icon: '⚙️' },
    { id: 'kube-proxy', title: 'Kube-proxy', category: 'Worker Nodes', icon: '🔀' },
    { id: 'container-runtime', title: 'Container Runtime', category: 'Worker Nodes', icon: '📦' },
    { id: 'pod', title: 'Pod', category: 'Workloads', icon: '📦' },
    { id: 'deployment', title: 'Deployment', category: 'Workloads', icon: '🚀' },
    { id: 'replicaset', title: 'ReplicaSet', category: 'Workloads', icon: '📋' },
    { id: 'statefulset', title: 'StatefulSet', category: 'Workloads', icon: '🗄️' },
    { id: 'daemonset', title: 'DaemonSet', category: 'Workloads', icon: '👹' },
    { id: 'job', title: 'Job/CronJob', category: 'Workloads', icon: '⏰' },
    { id: 'services', title: 'Services', category: 'Networking', icon: '🌐' },
    { id: 'ingress', title: 'Ingress', category: 'Networking', icon: '🚪' },
    { id: 'cni', title: 'CNI Plugins', category: 'Networking', icon: '🔌' },
    { id: 'dns', title: 'DNS/CoreDNS', category: 'Networking', icon: '🔍' },
    { id: 'network-policy', title: 'Network Policies', category: 'Networking', icon: '🔒' },
    { id: 'volumes', title: 'Volumes', category: 'Storage', icon: '💽' },
    { id: 'pv', title: 'PersistentVolume', category: 'Storage', icon: '📀' },
    { id: 'pvc', title: 'PersistentVolumeClaim', category: 'Storage', icon: '📝' },
    { id: 'storage-class', title: 'StorageClass', category: 'Storage', icon: '🏷️' },
    { id: 'containers', title: 'Containers vs VMs', category: 'Fundamentals', icon: '📦' },
    { id: 'multi-container', title: 'Multi-Container Patterns', category: 'Fundamentals', icon: '🔗' },
    { id: 'pod-lifecycle', title: 'Pod Lifecycle', category: 'Fundamentals', icon: '🔄' },
    { id: 'probes', title: 'Health Probes', category: 'Fundamentals', icon: '🩺' },
    { id: 'namespace', title: 'Namespace', category: 'Advanced', icon: '📁' },
    { id: 'rbac', title: 'RBAC', category: 'Security', icon: '🔐' },
    { id: 'configmap', title: 'ConfigMap', category: 'Security', icon: '⚙️' },
    { id: 'secret', title: 'Secret', category: 'Security', icon: '🔑' },
    { id: 'labels', title: 'Labels & Selectors', category: 'Advanced', icon: '🏷️' },
    { id: 'taints', title: 'Taints & Tolerations', category: 'Scheduling', icon: '🎯' },
    { id: 'affinity', title: 'Node/Pod Affinity', category: 'Scheduling', icon: '💕' },
    { id: 'hpa', title: 'HPA (Horizontal)', category: 'Autoscaling', icon: '↔️' },
    { id: 'vpa', title: 'VPA (Vertical)', category: 'Autoscaling', icon: '↕️' },
    { id: 'cluster-autoscaler', title: 'Cluster Autoscaler', category: 'Autoscaling', icon: '📈' },
    { id: 'karpenter', title: 'Karpenter', category: 'Autoscaling', icon: '⚡' },
    { id: 'deployment-strategies', title: 'Deployment Strategies', category: 'Deployment', icon: '🚀' },
    { id: 'helm', title: 'Helm', category: 'Deployment', icon: '⎈' },
    { id: 'kustomize', title: 'Kustomize', category: 'Deployment', icon: '🔧' },
    { id: 'gitops', title: 'GitOps', category: 'Deployment', icon: '🔄' },
    { id: 'argocd', title: 'Argo CD', category: 'Deployment', icon: '🐙' },
    { id: 'crds', title: 'CRDs', category: 'Reliability', icon: '🧩' },
    { id: 'operators', title: 'Operators', category: 'Reliability', icon: '🤖' },
    { id: 'ha', title: 'High Availability', category: 'Reliability', icon: '🏗️' },
    { id: 'monitoring', title: 'Monitoring', category: 'Reliability', icon: '📊' },
    { id: 'backup', title: 'Backup & DR', category: 'Reliability', icon: '💾' },
    { id: 'troubleshooting', title: 'Debug Scenarios', category: 'Troubleshooting', icon: '🔧' },
    { id: 'scenarios', title: 'Real-World Scenarios', category: 'Interactive', icon: '🚨' },
    { id: 'playground', title: 'kubectl Playground', category: 'Interactive', icon: '💻' },
    { id: 'comparisons', title: 'Comparison Tables', category: 'Interactive', icon: '⚖️' },
    { id: 'service-account', title: 'ServiceAccount', category: 'Security', icon: '🤖' },
    { id: 'resource-quota', title: 'ResourceQuota', category: 'Resources', icon: '💰' },
    { id: 'limit-range', title: 'LimitRange', category: 'Resources', icon: '🚧' }
];

function initSearch() {
    // Create search overlay if it doesn't exist
    if (!document.querySelector('.search-overlay')) {
        const searchHTML = `
            <div class="search-overlay" id="search-overlay">
                <div class="search-modal">
                    <div class="search-input-container">
                        <span class="icon">🔍</span>
                        <input type="text" class="search-input" id="search-input" placeholder="Search concepts..." autofocus>
                        <span class="search-shortcut">ESC</span>
                    </div>
                    <div class="search-results" id="search-results"></div>
                    <div class="search-footer">
                        <span><kbd>↑↓</kbd> Navigate</span>
                        <span><kbd>↵</kbd> Select</span>
                        <span><kbd>ESC</kbd> Close</span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', searchHTML);

        // Add event listeners
        document.getElementById('search-input').addEventListener('input', handleSearch);
        document.getElementById('search-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'search-overlay') closeSearch();
        });
    }
}

function openSearch() {
    initSearch();
    document.getElementById('search-overlay').classList.add('active');
    document.getElementById('search-input').focus();
    document.getElementById('search-input').value = '';
    handleSearch({ target: { value: '' } });
}

function closeSearch() {
    document.getElementById('search-overlay').classList.remove('active');
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const results = searchData.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );

    const resultsHTML = results.slice(0, 10).map((item, index) => `
        <div class="search-result-item ${index === 0 ? 'active' : ''}" 
             onclick="selectSearchResult('${item.id}')" 
             data-id="${item.id}">
            <span class="icon">${item.icon}</span>
            <div>
                <div class="search-result-title">${item.title}</div>
                <div class="search-result-category">${item.category}</div>
            </div>
        </div>
    `).join('');

    document.getElementById('search-results').innerHTML = resultsHTML ||
        '<div class="search-result-item"><span class="icon">🔍</span><div>No results found</div></div>';
}

function selectSearchResult(id) {
    closeSearch();
    loadContent(id);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Open search with /
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        openSearch();
    }
    // Open search with Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
    // Close with ESC
    if (e.key === 'Escape') {
        closeSearch();
        closeCheatsheet();
    }
    // Navigate results with arrow keys
    if (document.getElementById('search-overlay')?.classList.contains('active')) {
        const items = document.querySelectorAll('.search-result-item');
        const activeItem = document.querySelector('.search-result-item.active');
        const activeIndex = Array.from(items).indexOf(activeItem);

        if (e.key === 'ArrowDown' && activeIndex < items.length - 1) {
            e.preventDefault();
            activeItem?.classList.remove('active');
            items[activeIndex + 1]?.classList.add('active');
        }
        if (e.key === 'ArrowUp' && activeIndex > 0) {
            e.preventDefault();
            activeItem?.classList.remove('active');
            items[activeIndex - 1]?.classList.add('active');
        }
        if (e.key === 'Enter' && activeItem) {
            e.preventDefault();
            selectSearchResult(activeItem.dataset.id);
        }
    }
});

// ============================================
// CHEATSHEET FUNCTIONALITY
// ============================================
function initCheatsheet() {
    if (!document.querySelector('.cheatsheet-btn')) {
        const cheatsheetHTML = `
            <button class="cheatsheet-btn" onclick="toggleCheatsheet()" title="kubectl Cheatsheet">📋</button>
            <div class="cheatsheet-popup" id="cheatsheet-popup">
                <div class="cheatsheet-header">
                    <span>⌨️ kubectl Cheatsheet</span>
                    <button class="cheatsheet-close" onclick="closeCheatsheet()">✕</button>
                </div>
                <div class="cheatsheet-content">
                    <div class="cheatsheet-section">
                        <div class="cheatsheet-section-title">Getting Info</div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl get pods -A')">
                            <span class="cheatsheet-cmd">kubectl get pods -A</span>
                            <span class="cheatsheet-desc">All pods</span>
                        </div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl describe pod <name>')">
                            <span class="cheatsheet-cmd">kubectl describe pod</span>
                            <span class="cheatsheet-desc">Pod details</span>
                        </div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl logs <pod> -f')">
                            <span class="cheatsheet-cmd">kubectl logs -f</span>
                            <span class="cheatsheet-desc">Stream logs</span>
                        </div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl get events --sort-by=.lastTimestamp')">
                            <span class="cheatsheet-cmd">kubectl get events</span>
                            <span class="cheatsheet-desc">Cluster events</span>
                        </div>
                    </div>
                    <div class="cheatsheet-section">
                        <div class="cheatsheet-section-title">Debugging</div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl exec -it <pod> -- sh')">
                            <span class="cheatsheet-cmd">kubectl exec -it</span>
                            <span class="cheatsheet-desc">Shell into pod</span>
                        </div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl logs <pod> --previous')">
                            <span class="cheatsheet-cmd">kubectl logs --previous</span>
                            <span class="cheatsheet-desc">Previous crash logs</span>
                        </div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl top pods')">
                            <span class="cheatsheet-cmd">kubectl top pods</span>
                            <span class="cheatsheet-desc">Resource usage</span>
                        </div>
                    </div>
                    <div class="cheatsheet-section">
                        <div class="cheatsheet-section-title">Modifications</div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl apply -f manifest.yaml')">
                            <span class="cheatsheet-cmd">kubectl apply -f</span>
                            <span class="cheatsheet-desc">Apply manifest</span>
                        </div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl delete pod <name>')">
                            <span class="cheatsheet-cmd">kubectl delete</span>
                            <span class="cheatsheet-desc">Delete resource</span>
                        </div>
                        <div class="cheatsheet-item" onclick="copyCheatsheet('kubectl scale deployment <name> --replicas=3')">
                            <span class="cheatsheet-cmd">kubectl scale</span>
                            <span class="cheatsheet-desc">Scale replicas</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cheatsheetHTML);
    }
}

function toggleCheatsheet() {
    const popup = document.getElementById('cheatsheet-popup');
    popup.classList.toggle('active');
}

function closeCheatsheet() {
    document.getElementById('cheatsheet-popup')?.classList.remove('active');
}

function copyCheatsheet(cmd) {
    navigator.clipboard.writeText(cmd).then(() => {
        const btn = event.target.closest('.cheatsheet-item');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span style="color: var(--k8s-green)">✅ Copied!</span>';
        setTimeout(() => btn.innerHTML = originalHTML, 1500);
    });
}

// ============================================
// KUBECTL PLAYGROUND
// ============================================
const kubectlResponses = {
    'kubectl get pods': `NAME                      READY   STATUS    RESTARTS   AGE
nginx-7fb96c846b-4vnqg    1/1     Running   0          2d
redis-master-0            1/1     Running   0          5d
api-server-6d4b8944-x2f   1/1     Running   2          1d`,
    'kubectl get nodes': `NAME           STATUS   ROLES           AGE   VERSION
master-1       Ready    control-plane   30d   v1.29.0
worker-1       Ready    <none>          30d   v1.29.0
worker-2       Ready    <none>          30d   v1.29.0`,
    'kubectl get svc': `NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP        30d
nginx        NodePort    10.96.100.50   <none>        80:30080/TCP   2d
redis        ClusterIP   10.96.50.25    <none>        6379/TCP       5d`,
    'kubectl get namespaces': `NAME              STATUS   AGE
default           Active   30d
kube-system       Active   30d
kube-public       Active   30d
production        Active   15d
staging           Active   15d`,
    'kubectl get deployments': `NAME         READY   UP-TO-DATE   AVAILABLE   AGE
nginx        3/3     3            3           2d
api-server   2/2     2            2           1d`,
    'kubectl cluster-info': `Kubernetes control plane is running at https://192.168.1.100:6443
CoreDNS is running at https://192.168.1.100:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy`,
    'kubectl get pods -n kube-system': `NAME                               READY   STATUS    RESTARTS   AGE
coredns-6d4b75cb6d-8gk2p           1/1     Running   0          30d
etcd-master-1                      1/1     Running   0          30d
kube-apiserver-master-1            1/1     Running   0          30d
kube-controller-manager-master-1   1/1     Running   0          30d
kube-scheduler-master-1            1/1     Running   0          30d`,
    'help': `Available commands:
  kubectl get pods              - List pods
  kubectl get nodes             - List nodes
  kubectl get svc               - List services
  kubectl get namespaces        - List namespaces
  kubectl get deployments       - List deployments
  kubectl get pods -n kube-system - System pods
  kubectl cluster-info          - Cluster info
  clear                         - Clear terminal
  help                          - Show this help`
};

let terminalHistory = [];
let historyIndex = -1;

function runPlaygroundCommand(input) {
    const terminalOutput = document.getElementById('playground-output');
    const command = input.value.trim();

    if (!command) return;

    // Add to history
    terminalHistory.push(command);
    historyIndex = terminalHistory.length;

    // Clear command
    if (command === 'clear') {
        terminalOutput.innerHTML = '';
        input.value = '';
        return;
    }

    // Get response
    const response = kubectlResponses[command] ||
        `Error: command not recognized. Type 'help' for available commands.`;

    // Add output
    terminalOutput.innerHTML += `
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">${command}</span>
        </div>
        <div class="terminal-output">${response}</div>
    `;

    // Clear input and scroll
    input.value = '';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handlePlaygroundKeydown(e, input) {
    if (e.key === 'Enter') {
        runPlaygroundCommand(input);
    }
    if (e.key === 'ArrowUp' && historyIndex > 0) {
        historyIndex--;
        input.value = terminalHistory[historyIndex];
    }
    if (e.key === 'ArrowDown' && historyIndex < terminalHistory.length - 1) {
        historyIndex++;
        input.value = terminalHistory[historyIndex];
    }
}

// ============================================
// SCENARIO INTERACTIONS
// ============================================
function toggleScenario(element) {
    element.classList.toggle('expanded');
}

// ============================================
// YAML VALIDATION
// ============================================
function validateYaml(editorId) {
    const editor = document.getElementById(editorId);
    const result = document.getElementById(editorId + '-result');
    const yaml = editor.value;

    try {
        // Basic YAML validation
        const lines = yaml.split('\n');
        let hasError = false;
        let errorLine = 0;

        lines.forEach((line, i) => {
            // Check for tabs (YAML doesn't allow tabs)
            if (line.includes('\t')) {
                hasError = true;
                errorLine = i + 1;
            }
            // Check for inconsistent indentation
            if (line.match(/^( {1,3})[^ ]/)) {
                hasError = true;
                errorLine = i + 1;
            }
        });

        if (hasError) {
            result.className = 'yaml-validation-result error';
            result.textContent = `❌ Error on line ${errorLine}: Invalid indentation`;
        } else if (yaml.includes('apiVersion:') && yaml.includes('kind:')) {
            result.className = 'yaml-validation-result success';
            result.textContent = '✅ Valid YAML structure';
        } else {
            result.className = 'yaml-validation-result error';
            result.textContent = '⚠️ Missing required fields: apiVersion, kind';
        }
    } catch (e) {
        result.className = 'yaml-validation-result error';
        result.textContent = '❌ Invalid YAML: ' + e.message;
    }
}

// ============================================
// FLOWCHART INTERACTIONS
// ============================================
function showFlowchartDetails(nodeId, detailsId) {
    // Remove active from all nodes
    document.querySelectorAll('.flowchart-node').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.flowchart-details').forEach(d => d.classList.remove('active'));

    // Activate clicked node
    document.getElementById(nodeId).classList.add('active');
    document.getElementById(detailsId).classList.add('active');
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initCheatsheet();

    // Check for hash in URL  
    if (window.location.hash) {
        const id = window.location.hash.substring(1);
        loadContent(id);
    }
});
