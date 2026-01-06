/**
 * Docker Deep Dive - Application Logic
 * Expert-Level Learning Platform with Dynamic Content Loading
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

    // Scroll to top
    window.scrollTo(0, 0);

    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// ============================================
// CONTENT DEFINITIONS
// ============================================
function getContent(id) {
    const contents = {
        // ========================
        // SECTION 1: FUNDAMENTALS
        // ========================
        'what-is-docker': `
            <div class="content-card">
                <h2><span class="icon">🐳</span> What is Docker?</h2>
                <p>Docker is a <strong>containerization platform</strong> that packages applications and their dependencies into lightweight, portable containers that can run consistently across any environment.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>What exactly is Docker?</strong> Think of Docker as a shipping container for software. Just like shipping containers standardized global trade by providing a uniform way to transport goods, Docker standardizes software deployment by packaging everything an app needs to run.</p>
                    <p>Docker uses <strong>OS-level virtualization</strong> — it shares the host's kernel but isolates the application's view of the operating system. This is fundamentally different from VMs which virtualize the entire hardware stack.</p>
                    <p><strong>Key insight:</strong> A container is just a special process on your Linux machine — it has no idea it's in a container!</p>
                </div>

                <h3>Containers vs Virtual Machines</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Architecture Comparison</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                              <span class="highlight">VIRTUAL MACHINES</span>                                │
└──────────────────────────────────────────────────────────────────────────────┘
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │    App A    │  │    App B    │  │    App C    │
   ├─────────────┤  ├─────────────┤  ├─────────────┤
   │   Bins/Libs │  │   Bins/Libs │  │   Bins/Libs │
   ├─────────────┤  ├─────────────┤  ├─────────────┤
   │  Guest OS   │  │  Guest OS   │  │  Guest OS   │  ← Each VM has full OS
   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
          └────────────────┼────────────────┘
                    ┌──────┴──────┐
                    │  Hypervisor │  ← Hardware virtualization
                    ├─────────────┤
                    │   Host OS   │
                    ├─────────────┤
                    │  Hardware   │
                    └─────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                               <span class="success">CONTAINERS</span>                                     │
└──────────────────────────────────────────────────────────────────────────────┘
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │    App A    │  │    App B    │  │    App C    │
   ├─────────────┤  ├─────────────┤  ├─────────────┤
   │   Bins/Libs │  │   Bins/Libs │  │   Bins/Libs │
   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
          └────────────────┼────────────────┘
                    ┌──────┴──────┐
                    │Docker Engine│  ← OS-level virtualization
                    ├─────────────┤
                    │   Host OS   │  ← <span class="success">Shared kernel!</span>
                    ├─────────────┤
                    │  Hardware   │
                    └─────────────┘
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Aspect</th>
                                <th>Virtual Machines</th>
                                <th>Containers</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">Startup Time</span></td>
                                <td>Minutes</td>
                                <td><strong>Milliseconds</strong></td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">Size</span></td>
                                <td>GBs (full OS)</td>
                                <td><strong>MBs (app + libs only)</strong></td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">Isolation</span></td>
                                <td>Strong (hardware-level)</td>
                                <td>Process-level (kernel shared)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">Density</span></td>
                                <td>~10-20 per host</td>
                                <td><strong>100+ per host</strong></td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">Resource Usage</span></td>
                                <td>High overhead</td>
                                <td><strong>Near-native performance</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Analogy: Apartments vs Houses</div>
                    <p><strong>VMs are like standalone houses:</strong> Each house has its own foundation, plumbing, electrical system — complete independence but expensive and takes time to build.</p>
                    <p><strong>Containers are like apartments:</strong> They share the building's foundation and utilities (kernel) but have their own private space (filesystem, processes). Much more efficient, faster to set up, but slightly less isolated.</p>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "When would you choose VMs over containers?"</p>
                    <p><strong>Answer:</strong> VMs when you need: (1) Strong security isolation (multi-tenant), (2) Different OS kernels, (3) Windows apps on Linux hosts. Containers when you need: speed, density, microservices, CI/CD pipelines.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p>Remember: <strong>"Containers share the kernel, VMs don't."</strong> This one fact explains all the differences in startup time, size, and density!</p>
                </div>

                <h3>Common Docker Commands</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Run your first container
docker run hello-world

# Run nginx web server
docker run -d -p 80:80 nginx

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop &lt;container_id&gt;

# Remove a container
docker rm &lt;container_id&gt;</pre>
                </div>
            </div>
        `,

        'docker-architecture': `
            <div class="content-card">
                <h2><span class="icon">🏗️</span> Docker Architecture</h2>
                <p>Docker uses a <strong>client-server architecture</strong>. The Docker client talks to the Docker daemon, which does the heavy lifting of building, running, and distributing containers.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>Three main components:</strong></p>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>Docker Client (docker)</strong> — The CLI you interact with. Sends commands to the daemon.</li>
                        <li><strong>Docker Daemon (dockerd)</strong> — The background service managing containers, images, networks, volumes.</li>
                        <li><strong>Docker Registry</strong> — Stores Docker images (Docker Hub is the default public registry).</li>
                    </ul>
                    <p>The client and daemon communicate using a <strong>REST API</strong> over UNIX sockets or network interface.</p>
                </div>

                <h3>Architecture Diagram</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Docker Architecture</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                              <span class="highlight">DOCKER ARCHITECTURE</span>                            │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │  <span class="warning">Docker Client</span>  │    docker build, docker pull, docker run
    │    (docker)     │◄─── CLI commands from user
    └────────┬────────┘
             │ REST API (unix:///var/run/docker.sock)
             ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                         <span class="success">DOCKER HOST</span>                                    │
    │  ┌─────────────────┐                                                    │
    │  │  <span class="success">Docker Daemon</span>  │    dockerd                                       │
    │  │    (dockerd)    │                                                    │
    │  └────────┬────────┘                                                    │
    │           │                                                             │
    │     ┌─────┴─────┬─────────────┬─────────────┐                          │
    │     ▼           ▼             ▼             ▼                          │
    │ ┌───────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐                     │
    │ │Images │  │Containers│  │ Networks │  │ Volumes │                     │
    │ └───────┘  └─────────┘  └──────────┘  └─────────┘                     │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
             │
             │ Pull/Push images
             ▼
    ┌─────────────────┐
    │ <span class="highlight">Docker Registry</span> │    Docker Hub, ECR, GCR, Harbor...
    │  (docker.io)    │
    └─────────────────┘
                    </div>
                </div>

                <div class="use-case-grid">
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">💻</span>
                            <span class="use-case-title">Docker Client</span>
                        </div>
                        <div class="use-case-desc">The primary way users interact with Docker. Sends commands to dockerd via REST API. Can connect to remote daemons.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">⚙️</span>
                            <span class="use-case-title">Docker Daemon</span>
                        </div>
                        <div class="use-case-desc">Listens for API requests. Manages Docker objects: images, containers, networks, volumes. Can communicate with other daemons.</div>
                    </div>
                    <div class="use-case-card">
                        <div class="use-case-header">
                            <span class="use-case-icon">📦</span>
                            <span class="use-case-title">Docker Registry</span>
                        </div>
                        <div class="use-case-desc">Stores Docker images. Docker Hub is the default public registry. Private registries for enterprise use.</div>
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What is /var/run/docker.sock?"</p>
                    <p><strong>Answer:</strong> It's a Unix socket that the Docker daemon listens on. The Docker CLI communicates with the daemon through this socket. Mounting it into a container gives that container full control over the Docker daemon — a significant security risk!</p>
                </div>

                <h3>Docker Objects</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📦</span>
                        <div class="name">Images</div>
                        <div class="desc">Read-only templates for creating containers</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🏃</span>
                        <div class="name">Containers</div>
                        <div class="desc">Runnable instances of images</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🌐</span>
                        <div class="name">Networks</div>
                        <div class="desc">Connect containers together</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">💾</span>
                        <div class="name">Volumes</div>
                        <div class="desc">Persist data beyond container lifecycle</div>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // SECTION 2: DOCKER INTERNALS
        // ========================
        'docker-engine': `
            <div class="content-card">
                <h2><span class="icon">⚙️</span> Docker Engine Internals: dockerd, containerd, runc</h2>
                <p>Understanding the Docker Engine's internal components separates <strong>Docker users from Docker experts</strong>.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p>Docker is not a monolith — it's a stack of components:</p>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>dockerd</strong> — The Docker daemon. Handles API requests, orchestrates everything.</li>
                        <li><strong>containerd</strong> — Container runtime. Manages container lifecycle (start, stop, pause).</li>
                        <li><strong>runc</strong> — Low-level runtime. Actually creates and runs containers using Linux primitives.</li>
                    </ul>
                    <p><strong>Why the separation?</strong> Kubernetes can use containerd directly without Docker! Docker became "just" another containerd client.</p>
                </div>

                <h3>Component Stack</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Docker Engine Stack</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                          <span class="highlight">DOCKER ENGINE INTERNALS</span>                          │
└──────────────────────────────────────────────────────────────────────────────┘

    docker run nginx
         │
         ▼
┌─────────────────────┐
│      <span class="warning">dockerd</span>        │  ← Docker Daemon (API, image management, networking)
│   (Docker Daemon)   │     Listens on /var/run/docker.sock
└──────────┬──────────┘
           │ gRPC
           ▼
┌─────────────────────┐
│    <span class="success">containerd</span>       │  ← Container Runtime (container lifecycle)
│  (Container Runtime)│     Manages: start, stop, pause, delete
└──────────┬──────────┘
           │ OCI Runtime Spec
           ▼
┌─────────────────────┐
│       <span class="highlight">runc</span>          │  ← OCI Runtime (actually creates containers)
│   (OCI Runtime)     │     Uses: namespaces, cgroups, seccomp
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   <span class="success">Linux Kernel</span>      │  ← Provides: namespaces, cgroups, capabilities
│   (Primitives)      │
└─────────────────────┘

<span class="warning">Key Insight:</span> runc creates the container and exits. containerd manages it.
            containerd is what Kubernetes talks to (CRI).
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Responsibility</th>
                                <th>Protocol</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-orange">dockerd</span></td>
                                <td>API server, image builds, networking, volumes</td>
                                <td>REST API</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-green">containerd</span></td>
                                <td>Container lifecycle, image pull, storage</td>
                                <td>gRPC</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">runc</span></td>
                                <td>Create container, set up namespaces/cgroups</td>
                                <td>OCI Runtime Spec</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Analogy: Restaurant Kitchen</div>
                    <p><strong>dockerd</strong> = Restaurant Manager. Takes orders (API calls), coordinates everything, but doesn't cook.</p>
                    <p><strong>containerd</strong> = Head Chef. Manages the cooking process, assigns dishes to cooks, tracks progress.</p>
                    <p><strong>runc</strong> = Line Cook. Actually prepares the dish (creates the container), then moves to next order.</p>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Why did Kubernetes deprecate Docker?"</p>
                    <p><strong>Answer:</strong> Kubernetes never used Docker directly — it used containerd (via dockershim). The deprecation removed dockershim, not container support. Kubernetes now talks directly to containerd or CRI-O. Images built with Docker still work perfectly!</p>
                </div>

                <h3>Verify Components</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Check dockerd
systemctl status docker

# Check containerd
systemctl status containerd

# Check runc version
runc --version

# See containerd managing containers
ctr containers list

# See what containerd knows about
ctr namespaces list</pre>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"Docker → containerd → runc → kernel"</strong></p>
                    <p>Each layer does less but is more fundamental. runc is so low-level it just creates and exits!</p>
                </div>
            </div>
        `,

        'docker-run-internals': `
            <div class="content-card">
                <h2><span class="icon">🔄</span> How docker run Works Internally</h2>
                <p>When you type <code>docker run nginx</code>, a complex chain of events happens. Understanding this is <strong>expert-level knowledge</strong>.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Explanation</div>
                    <p><strong>The complete flow:</strong></p>
                    <ol style="margin-left: 20px; color: var(--text-secondary); line-height: 2;">
                        <li>Docker CLI parses command and sends to dockerd</li>
                        <li>dockerd checks if image exists locally, pulls if not</li>
                        <li>dockerd creates container config and sends to containerd</li>
                        <li>containerd creates OCI bundle (config.json + rootfs)</li>
                        <li>containerd calls runc to create the container</li>
                        <li>runc sets up namespaces, cgroups, mounts, then execs the process</li>
                        <li>runc exits, containerd takes over management</li>
                        <li>Container is now running!</li>
                    </ol>
                </div>

                <h3>Step-by-Step Flow</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 docker run Internal Flow</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                         docker run -d -p 80:80 nginx                         │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    │                               ▼                               │
    │  <span class="warning">STEP 1: CLI → dockerd</span>                                        │
    │  ┌─────────────────┐    REST API    ┌─────────────────┐      │
    │  │  docker (CLI)   │ ────────────►  │     dockerd     │      │
    │  └─────────────────┘                └────────┬────────┘      │
    │                                              │               │
    │  <span class="warning">STEP 2: Image Check/Pull</span>                        ▼               │
    │                              ┌───────────────────────────┐   │
    │                              │ Local image? No → Pull    │   │
    │                              │ from registry (docker.io) │   │
    │                              └───────────────────────────┘   │
    │                                              │               │
    │  <span class="warning">STEP 3: Create Container</span>                       ▼               │
    │                              ┌───────────────────────────┐   │
    │                              │ dockerd → containerd      │   │
    │                              │ (gRPC: CreateContainer)   │   │
    │                              └───────────────────────────┘   │
    │                                              │               │
    │  <span class="success">STEP 4: containerd Prepares</span>                   ▼               │
    │                              ┌───────────────────────────┐   │
    │                              │ Create OCI bundle:        │   │
    │                              │ - config.json (spec)      │   │
    │                              │ - rootfs (from layers)    │   │
    │                              └───────────────────────────┘   │
    │                                              │               │
    │  <span class="success">STEP 5: runc Creates Container</span>                ▼               │
    │                              ┌───────────────────────────┐   │
    │                              │ runc create:              │   │
    │                              │ 1. Clone namespaces       │   │
    │                              │ 2. Set up cgroups         │   │
    │                              │ 3. Mount rootfs           │   │
    │                              │ 4. Apply seccomp          │   │
    │                              │ 5. Drop capabilities      │   │
    │                              │ 6. exec() init process    │   │
    │                              └───────────────────────────┘   │
    │                                              │               │
    │  <span class="highlight">STEP 6: Container Running!</span>                    ▼               │
    │                              ┌───────────────────────────┐   │
    │                              │ nginx master process      │   │
    │                              │ PID 1 inside container    │   │
    │                              │ containerd watches it     │   │
    │                              └───────────────────────────┘   │
    └──────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: What runc Actually Does</div>
                    <ol style="color: var(--text-secondary); line-height: 2;">
                        <li><strong>clone()</strong> — Creates new namespaces (PID, NET, MNT, UTS, IPC, USER)</li>
                        <li><strong>pivot_root()</strong> — Changes root filesystem to container's rootfs</li>
                        <li><strong>mount()</strong> — Sets up /proc, /sys, /dev</li>
                        <li><strong>cgroups</strong> — Applies resource limits (CPU, memory)</li>
                        <li><strong>seccomp</strong> — Loads syscall filter</li>
                        <li><strong>setcap</strong> — Drops unnecessary capabilities</li>
                        <li><strong>exec()</strong> — Replaces runc with container's entrypoint</li>
                    </ol>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Walk me through what happens when you run docker run"</p>
                    <p><strong>Expert answer:</strong> Mention the CLI→dockerd→containerd→runc chain. Then talk about how runc creates namespaces, applies cgroups, mounts the rootfs, applies seccomp profiles, drops capabilities, and finally execs the entrypoint. Bonus: mention runc exits after container starts!</p>
                </div>

                <h3>Trace the Flow Yourself</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Watch containerd events
sudo ctr events

# In another terminal, run a container
docker run -d nginx

# You'll see containerd events:
# - /containers/create
# - /tasks/create  
# - /tasks/start

# Find the shim process
ps aux | grep containerd-shim

# See container's namespaces
docker inspect --format '{{.State.Pid}}' &lt;container_id&gt;
sudo ls -la /proc/&lt;PID&gt;/ns/</pre>
                </div>
            </div>
        `,

        // ========================
        // SECTION 2: DOCKER INTERNALS (continued)
        // ========================
        'oci-specs': `
            <div class="content-card">
                <h2><span class="icon">📋</span> OCI Runtime Spec vs Image Spec</h2>
                <p>The <strong>Open Container Initiative (OCI)</strong> defines industry standards for container formats and runtimes. Understanding these specs is crucial for container interoperability.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>OCI Image Spec:</strong> Defines how container images are built and stored. It specifies the manifest, config, and layer formats. When you do <code>docker build</code>, the output follows this spec.</p>
                    <p><strong>OCI Runtime Spec:</strong> Defines how to run a container. It specifies the <code>config.json</code> format that tells runc exactly how to create the container — namespaces, cgroups, mounts, etc.</p>
                    <p><strong>OCI Distribution Spec:</strong> Defines how to push/pull images to/from registries. This is why Docker images work with any OCI-compliant registry!</p>
                </div>

                <h3>The Two Specs</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 OCI Specifications</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                          <span class="highlight">OCI SPECIFICATIONS</span>                                  │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                         <span class="warning">OCI IMAGE SPEC</span>                                  │
    │                                                                         │
    │   "How to PACKAGE a container"                                          │
    │                                                                         │
    │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐    │
    │   │  Manifest   │  │   Config    │  │         Layers              │    │
    │   │  (index)    │  │  (metadata) │  │  (filesystem tarballs)      │    │
    │   └─────────────┘  └─────────────┘  └─────────────────────────────┘    │
    │                                                                         │
    │   Used by: docker build, docker push, docker pull                       │
    └─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                        <span class="success">OCI RUNTIME SPEC</span>                                 │
    │                                                                         │
    │   "How to RUN a container"                                              │
    │                                                                         │
    │   ┌─────────────────────────────────────────────────────────────────┐  │
    │   │  config.json (runtime bundle)                                   │  │
    │   │  ├── process (command, args, env, cwd)                          │  │
    │   │  ├── root (rootfs path)                                         │  │
    │   │  ├── mounts (/proc, /sys, /dev)                                 │  │
    │   │  ├── linux.namespaces (pid, net, mnt, uts, ipc)                 │  │
    │   │  ├── linux.resources (cgroups limits)                           │  │
    │   │  └── linux.seccomp (syscall filter)                             │  │
    │   └─────────────────────────────────────────────────────────────────┘  │
    │                                                                         │
    │   Used by: runc, crun, kata-containers                                  │
    └─────────────────────────────────────────────────────────────────────────┘

<span class="highlight">Key Insight:</span> containerd converts OCI Image → OCI Runtime Bundle → runc executes it
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Analogy: Recipe vs Cooking Instructions</div>
                    <p><strong>OCI Image Spec</strong> = Recipe Card. Lists all ingredients (layers), nutritional info (config), and the dish name (manifest).</p>
                    <p><strong>OCI Runtime Spec</strong> = Cooking Instructions. Step-by-step how to prepare — temperature (resources), equipment needed (mounts), timing (process).</p>
                    <p>You can share the recipe (image) anywhere, but to actually make the dish (run container), you need the cooking instructions!</p>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Why are OCI specs important?"</p>
                    <p><strong>Answer:</strong> OCI ensures portability. Images built with Docker work in Kubernetes, Podman, or any OCI-compliant runtime. Without OCI, each tool would have its own format — imagine if every browser needed different HTML!</p>
                </div>

                <h3>View OCI Bundle</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Export container to OCI bundle
docker export mycontainer | tar -C /tmp/bundle -xf -

# Inspect image manifest
docker manifest inspect nginx:latest

# View image config
docker inspect nginx:latest --format='{{json .Config}}' | jq

# See runtime spec (config.json)
runc spec  # Creates sample config.json</pre>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"Image Spec = What's IN the box. Runtime Spec = How to OPEN the box."</strong></p>
                </div>
            </div>
        `,

        'copy-on-write': `
            <div class="content-card">
                <h2><span class="icon">📝</span> Copy-on-Write (CoW) Filesystem</h2>
                <p>Copy-on-Write is the <strong>secret sauce</strong> that makes Docker images efficient. It allows multiple containers to share the same base image layers without duplicating data.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>Copy-on-Write (CoW):</strong> A storage strategy where data is not copied until it's modified. When you start a container, it doesn't copy the entire image — it just creates a thin writable layer on top.</p>
                    <p><strong>How it works internally:</strong></p>
                    <ol style="margin-left: 20px; color: var(--text-secondary); line-height: 2;">
                        <li><strong>Read operation:</strong> File is read from the highest layer that has it</li>
                        <li><strong>Write operation:</strong> File is first copied to writable layer, then modified there</li>
                        <li><strong>Delete operation:</strong> A "whiteout" file is created in writable layer to hide the original</li>
                    </ol>
                </div>

                <h3>CoW in Action</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Copy-on-Write Layers</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                         <span class="highlight">COPY-ON-WRITE FILESYSTEM</span>                           │
└──────────────────────────────────────────────────────────────────────────────┘

    CONTAINER VIEW                           ACTUAL STORAGE
    ──────────────                           ──────────────

    ┌─────────────────────┐
    │  <span class="warning">Writable Layer</span>     │  ← Container's changes (thin layer)
    │  (Container Layer)  │     Only modified files stored here
    ├─────────────────────┤
    │  Image Layer 4      │  ← <span class="success">Shared with other containers!</span>
    ├─────────────────────┤
    │  Image Layer 3      │  ← Read-only, cached
    ├─────────────────────┤
    │  Image Layer 2      │  ← Read-only, cached
    ├─────────────────────┤
    │  Image Layer 1      │  ← Base image (Ubuntu, Alpine, etc.)
    └─────────────────────┘


    <span class="warning">WRITE OPERATION (copy-up):</span>

    Container wants to modify /etc/nginx/nginx.conf

    1. File found in Layer 3 (read-only)
    2. <span class="highlight">COPY</span> entire file to Writable Layer
    3. <span class="highlight">MODIFY</span> the copy in Writable Layer
    4. Future reads see the modified version

    ┌─────────────────────┐
    │  nginx.conf (new)   │  ← Modified copy lives here
    ├─────────────────────┤
    │                     │
    │  nginx.conf (orig)  │  ← Original still here, but hidden
    │                     │
    └─────────────────────┘


    <span class="warning">DELETE OPERATION (whiteout):</span>

    Container wants to delete /var/log/apt

    ┌─────────────────────┐
    │  .wh.apt            │  ← "Whiteout" file hides /var/log/apt
    ├─────────────────────┤
    │  /var/log/apt       │  ← Original still exists, but invisible
    └─────────────────────┘
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Operation</th>
                                <th>What Happens</th>
                                <th>Performance Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-green">Read</span></td>
                                <td>Traverse layers top-down, return first match</td>
                                <td>Fast (cached)</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Write (new file)</span></td>
                                <td>Create directly in writable layer</td>
                                <td>Fast</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-orange">Write (modify)</span></td>
                                <td>Copy-up then modify</td>
                                <td><strong>Slow for large files!</strong></td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">Delete</span></td>
                                <td>Create whiteout file</td>
                                <td>Fast</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Database in Container</div>
                    <p><strong>Problem:</strong> MySQL container writes to <code>/var/lib/mysql</code>. With CoW, every write triggers copy-up!</p>
                    <p><strong>Impact:</strong> Write amplification — writing 1 MB might copy 10 MB file first. Terrible performance!</p>
                    <p><strong>Solution:</strong> Use Docker volumes (<code>-v mysql_data:/var/lib/mysql</code>). Volumes bypass CoW completely!</p>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Why are Docker images so small compared to VMs?"</p>
                    <p><strong>Answer:</strong> Copy-on-Write! Multiple containers share the same read-only image layers. If 10 containers use nginx:latest, the image is stored only once. Each container just adds a thin writable layer (usually just a few MB).</p>
                </div>

                <h3>Measure Layer Sizes</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># See image layer sizes
docker history nginx:latest

# See container's writable layer size
docker ps -s

# Detailed layer info
docker inspect nginx:latest | jq '.[0].RootFS'

# Find large files in container layer
docker diff &lt;container_id&gt;</pre>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"CoW = Don't copy until you HAVE to write"</strong></p>
                    <p>Think of it like a shared textbook — everyone reads the same book, but if you want to make notes, you photocopy just that page!</p>
                </div>
            </div>
        `,

        'overlay2': `
            <div class="content-card">
                <h2><span class="icon">📂</span> Union Filesystems: overlay2 Deep Dive</h2>
                <p><strong>overlay2</strong> is Docker's default storage driver. It implements the union filesystem that makes Docker's layered image system possible.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>Union Filesystem:</strong> A filesystem that overlays multiple directories (layers) to present a unified view. Lower layers are read-only; the top layer is read-write.</p>
                    <p><strong>overlay2 Components:</strong></p>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>lowerdir:</strong> Read-only image layers (can be multiple)</li>
                        <li><strong>upperdir:</strong> Read-write container layer</li>
                        <li><strong>workdir:</strong> Scratch space for atomic operations</li>
                        <li><strong>merged:</strong> The unified view the container sees</li>
                    </ul>
                </div>

                <h3>overlay2 Architecture</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 overlay2 Mount Structure</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                           <span class="highlight">OVERLAY2 FILESYSTEM</span>                               │
└──────────────────────────────────────────────────────────────────────────────┘

    /var/lib/docker/overlay2/
    │
    ├── &lt;layer-id-1&gt;/           ← Image Layer 1
    │   └── diff/
    │       ├── bin/
    │       ├── etc/
    │       └── usr/
    │
    ├── &lt;layer-id-2&gt;/           ← Image Layer 2
    │   ├── diff/
    │   │   └── app/
    │   ├── lower                ← Points to layer-id-1
    │   └── link                 ← Short identifier
    │
    └── &lt;container-id&gt;/         ← Container Layer
        ├── diff/               ← <span class="warning">upperdir</span> (writable changes)
        ├── lower               ← Points to image layers
        ├── merged/             ← <span class="success">Unified view</span> (mount point)
        └── work/               ← workdir for atomicity


    MOUNT COMMAND (simplified):
    ┌──────────────────────────────────────────────────────────────────────────┐
    │ mount -t overlay overlay                                                 │
    │   -o lowerdir=/layer2/diff:/layer1/diff    ← Read-only layers           │
    │   -o upperdir=/container/diff              ← Writable layer             │
    │   -o workdir=/container/work               ← Scratch space              │
    │   /container/merged                        ← Mount point                │
    └──────────────────────────────────────────────────────────────────────────┘


    CONTAINER'S VIEW (/container/merged):
    ┌─────────────────────────────────────────┐
    │  /bin     ← from layer1                 │
    │  /etc     ← from layer1 (or upperdir)   │
    │  /usr     ← from layer1                 │
    │  /app     ← from layer2                 │
    │  /tmp     ← from upperdir (new file)    │
    └─────────────────────────────────────────┘
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Analogy: Transparent Sheets</div>
                    <p>Imagine stacking transparent sheets (OHP sheets from school/college):</p>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>Bottom sheet:</strong> Base image (Ubuntu) with /bin, /usr, etc.</li>
                        <li><strong>Middle sheets:</strong> App layers (Node.js, your app code)</li>
                        <li><strong>Top sheet:</strong> Your scratch paper — only you can write here!</li>
                    </ul>
                    <p>Looking from above, you see the combined picture. But each sheet is separate!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Deep Dive: Write Amplification Problem</div>
                    <p><strong>What happens when container modifies a 1GB file:</strong></p>
                    <ol style="color: var(--text-secondary); line-height: 2;">
                        <li>File is in lowerdir (read-only)</li>
                        <li>overlay2 copies ENTIRE 1GB file to upperdir</li>
                        <li>Then applies your small modification</li>
                        <li>Now you have 2GB of storage used!</li>
                    </ol>
                    <p><strong>This is why databases should use volumes, not the container layer!</strong></p>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What is the difference between overlay and overlay2?"</p>
                    <p><strong>Answer:</strong> overlay2 is the improved version. The original overlay used hard links and had issues with inode exhaustion. overlay2 uses multiple lowerdirs natively and is more efficient. Always use overlay2!</p>
                </div>

                <h3>Inspect overlay2</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Check storage driver
docker info | grep "Storage Driver"

# See overlay2 directory
sudo ls -la /var/lib/docker/overlay2/

# Find container's mount info
docker inspect &lt;container_id&gt; | jq '.[0].GraphDriver'

# See actual mount
mount | grep overlay

# Check disk usage per layer
sudo du -sh /var/lib/docker/overlay2/*</pre>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"Lower = Read-only layers, Upper = Write layer, Merged = What you see"</strong></p>
                </div>
            </div>
        `,

        'pid1-problems': `
            <div class="content-card">
                <h2><span class="icon">🔢</span> Container Init Process: PID 1 Problems</h2>
                <p>In containers, your application runs as <strong>PID 1</strong> — the init process. This has serious implications for signal handling, zombie reaping, and graceful shutdown.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>What is PID 1?</strong> In Linux, PID 1 is the "init" process — the first process started by the kernel. It has special responsibilities:</p>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>Signal handling:</strong> PID 1 doesn't get default signal handlers. SIGTERM may be IGNORED!</li>
                        <li><strong>Zombie reaping:</strong> PID 1 must call wait() on orphaned child processes</li>
                        <li><strong>System stability:</strong> If PID 1 dies, the entire container stops</li>
                    </ul>
                    <p><strong>The Problem:</strong> Most applications are NOT designed to be PID 1. They expect init/systemd to handle signals and zombies!</p>
                </div>

                <h3>PID 1 Signal Problem</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Signal Handling Difference</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                         <span class="warning">PID 1 SIGNAL PROBLEM</span>                                 │
└──────────────────────────────────────────────────────────────────────────────┘

    NORMAL LINUX (with init):
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │   kill -SIGTERM &lt;app_pid&gt;                                              │
    │         │                                                               │
    │         ▼                                                               │
    │   ┌─────────────┐                                                       │
    │   │ Your App    │  ← Has default signal handler                         │
    │   │ (PID 123)   │  ← SIGTERM → Terminate gracefully ✅                  │
    │   └─────────────┘                                                       │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘

    CONTAINER (app as PID 1):
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │   docker stop &lt;container&gt;  →  SIGTERM sent to PID 1                    │
    │         │                                                               │
    │         ▼                                                               │
    │   ┌─────────────┐                                                       │
    │   │ Your App    │  ← <span class="warning">NO default signal handler for PID 1!</span>            │
    │   │ (PID 1)     │  ← SIGTERM → <span class="warning">IGNORED</span> (unless you handle it)         │
    │   └─────────────┘                                                       │
    │         │                                                               │
    │         ▼  (after 10 seconds timeout)                                   │
    │   SIGKILL sent → <span class="highlight">Forcefully killed!</span> No graceful shutdown ❌           │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘


    SOLUTION: Use tini or dumb-init
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │   ┌─────────────┐         ┌─────────────┐                              │
    │   │   tini      │  ────►  │  Your App   │                              │
    │   │  (PID 1)    │         │  (PID 123)  │                              │
    │   └─────────────┘         └─────────────┘                              │
    │        │                                                                │
    │        ├── Handles signals properly                                     │
    │        ├── Reaps zombie processes                                       │
    │        └── Forwards signals to child processes                          │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Node.js Container</div>
                    <p><strong>Problem:</strong> Node.js app in container. <code>docker stop</code> is issued.</p>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li>SIGTERM sent to Node.js (PID 1)</li>
                        <li>Node.js doesn't handle SIGTERM by default!</li>
                        <li>Container waits 10 seconds, then SIGKILL</li>
                        <li>Active requests are dropped, connections reset!</li>
                    </ul>
                    <p><strong>Solution:</strong> Either add signal handlers in code, or use <code>--init</code> flag!</p>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Why does my container take 10 seconds to stop?"</p>
                    <p><strong>Answer:</strong> Your app is PID 1 and not handling SIGTERM. Docker waits 10 seconds (default timeout), then sends SIGKILL. Use <code>docker run --init</code> or install tini to fix this!</p>
                </div>

                <h3>Solutions</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Solution 1: Use docker --init flag
docker run --init myapp

# Solution 2: Install tini in Dockerfile
FROM node:18
RUN apt-get update && apt-get install -y tini
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "app.js"]

# Solution 3: Handle signals in your app (Node.js example)
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    server.close(() => {
        process.exit(0);
    });
});</pre>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"PID 1 = Special rules apply!"</strong> No default signal handling, must reap zombies. When in doubt, use <code>--init</code>!</p>
                </div>
            </div>
        `,

        'signal-handling': `
            <div class="content-card">
                <h2><span class="icon">📡</span> Signal Handling & Graceful Shutdown</h2>
                <p>Proper signal handling is critical for <strong>graceful shutdowns</strong>, preventing data loss, and ensuring zero-downtime deployments.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>Key Signals in Container Lifecycle:</strong></p>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>SIGTERM (15):</strong> "Please shut down gracefully" — sent by <code>docker stop</code></li>
                        <li><strong>SIGKILL (9):</strong> "Die immediately" — cannot be caught or ignored</li>
                        <li><strong>SIGINT (2):</strong> "Interrupt" — sent by Ctrl+C</li>
                        <li><strong>SIGHUP (1):</strong> "Hangup" — often used for config reload</li>
                    </ul>
                    <p><strong>docker stop behavior:</strong> SIGTERM → wait (default 10s) → SIGKILL</p>
                </div>

                <h3>Graceful Shutdown Flow</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 docker stop Signal Flow</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                       <span class="highlight">GRACEFUL SHUTDOWN FLOW</span>                               │
└──────────────────────────────────────────────────────────────────────────────┘

    docker stop mycontainer --time 30

    t=0s                t=0.1s              t=0-30s              t=30s
    ────────────────────────────────────────────────────────────────────►

    ┌─────────┐       ┌─────────────┐      ┌─────────────┐     ┌─────────┐
    │ docker  │──────►│  SIGTERM    │─────►│  App doing  │────►│ SIGKILL │
    │  stop   │       │  sent to    │      │  cleanup:   │     │ (if not │
    │ issued  │       │  PID 1      │      │  - Close DB │     │ exited) │
    └─────────┘       └─────────────┘      │  - Drain    │     └─────────┘
                                           │    requests │
                                           │  - Flush    │
                                           │    buffers  │
                                           └─────────────┘


    <span class="success">GOOD APP BEHAVIOR:</span>
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │  1. Receive SIGTERM                                                     │
    │  2. Stop accepting new connections                                      │
    │  3. Finish processing current requests (with timeout)                   │
    │  4. Close database connections                                          │
    │  5. Flush logs and buffers                                              │
    │  6. Exit with code 0                                                    │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘

    <span class="warning">BAD APP BEHAVIOR:</span>
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │  1. Receive SIGTERM                                                     │
    │  2. Ignore it (no handler)                                              │
    │  3. Keep running...                                                     │
    │  4. SIGKILL arrives — everything stops immediately                      │
    │  5. Active requests get connection reset                                │
    │  6. Data may be corrupted                                               │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <h3>Signal Handler Examples</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">python</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Python graceful shutdown
import signal
import sys

def graceful_shutdown(signum, frame):
    print("Received SIGTERM, shutting down...")
    # Cleanup: close DB, flush buffers, etc.
    server.stop()
    sys.exit(0)

signal.signal(signal.SIGTERM, graceful_shutdown)
signal.signal(signal.SIGINT, graceful_shutdown)</pre>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">javascript</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>// Node.js graceful shutdown
const server = app.listen(3000);

const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        // Close DB connections
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
    
    // Force exit after timeout
    setTimeout(() => {
        console.error('Forcing exit');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "How do you ensure zero-downtime deployments with Docker?"</p>
                    <p><strong>Answer:</strong> (1) Handle SIGTERM for graceful shutdown, (2) Use health checks so load balancer knows when to stop sending traffic, (3) Implement connection draining — stop accepting new requests but complete existing ones, (4) Set appropriate stop timeout (<code>docker stop -t 30</code>).</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"SIGTERM = Please. SIGKILL = NOW!"</strong></p>
                    <p>Always handle SIGTERM — it's your chance to cleanup before SIGKILL forces exit!</p>
                </div>
            </div>
        `,

        'zombie-processes': `
            <div class="content-card">
                <h2><span class="icon">🧟</span> Zombie Processes in Containers</h2>
                <p>Zombie processes are <strong>dead processes</strong> that haven't been cleaned up. In containers, they can accumulate and cause PID exhaustion.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>What is a Zombie?</strong> When a process exits, it becomes a "zombie" until its parent calls <code>wait()</code> to read its exit status. The zombie takes up a PID but no other resources.</p>
                    <p><strong>Who reaps zombies?</strong> Normally, init (PID 1) reaps orphaned zombies. But in containers, your app is PID 1 — and most apps don't call <code>wait()</code>!</p>
                    <p><strong>The Problem:</strong> If zombies accumulate, you can run out of PIDs. Especially problematic in containers that spawn many child processes!</p>
                </div>

                <h3>Zombie Lifecycle</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 How Zombies are Created</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                         <span class="warning">ZOMBIE PROCESS LIFECYCLE</span>                            │
└──────────────────────────────────────────────────────────────────────────────┘

    NORMAL CASE (zombie is reaped):
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │   Parent Process                Child Process                           │
    │   ┌───────────┐                 ┌───────────┐                          │
    │   │           │ ──fork()──────► │  Running  │                          │
    │   │  Waiting  │                 │           │                          │
    │   │           │                 └─────┬─────┘                          │
    │   │           │                       │ exit()                         │
    │   │           │                       ▼                                │
    │   │           │                 ┌───────────┐                          │
    │   │           │ ◄───SIGCHLD──── │  <span class="warning">ZOMBIE</span>   │  ← Waiting to be reaped   │
    │   │           │                 └─────┬─────┘                          │
    │   │  wait()   │ ──────────────────────┘                                │
    │   │           │    reads exit code                                      │
    │   └───────────┘                 [Zombie removed from process table]    │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘


    CONTAINER PROBLEM (zombie NOT reaped):
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │   Your App (PID 1)              Child Processes                         │
    │   ┌───────────┐                                                         │
    │   │  Node.js  │ ──fork()──────► [shells out to curl, ffmpeg, etc.]     │
    │   │           │                                                         │
    │   │  Never    │                 ┌───────────┐                          │
    │   │  calls    │                 │  <span class="warning">ZOMBIE 1</span>  │                          │
    │   │  wait()   │                 ├───────────┤                          │
    │   │           │                 │  <span class="warning">ZOMBIE 2</span>  │  ← Zombies accumulate!   │
    │   │           │                 ├───────────┤                          │
    │   │           │                 │  <span class="warning">ZOMBIE 3</span>  │                          │
    │   └───────────┘                 └───────────┘                          │
    │                                                                         │
    │   Eventually: "fork: Resource temporarily unavailable" (no PIDs left!)  │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Image Processing Service</div>
                    <p><strong>Setup:</strong> Python app that shells out to ImageMagick (<code>convert</code>) for image processing.</p>
                    <p><strong>Problem:</strong> After processing 1000 images, container starts failing with "cannot fork".</p>
                    <p><strong>Root cause:</strong> Each <code>subprocess.call()</code> leaves a zombie. Python (as PID 1) doesn't reap them!</p>
                    <p><strong>Solution:</strong> Use <code>docker run --init</code> — tini as PID 1 reaps all zombies automatically.</p>
                </div>

                <h3>Detection & Solutions</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Find zombie processes in container
docker exec mycontainer ps aux | grep -w Z

# Or from inside container
ps aux | awk '$8 == "Z" {print}'

# Check number of zombies
docker exec mycontainer sh -c 'ls /proc | wc -l'

# Solution: Run with tini
docker run --init myapp

# Or in Dockerfile
FROM python:3.11
RUN apt-get update && apt-get install -y tini
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["python", "app.py"]</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Your container is running out of PIDs. How do you debug?"</p>
                    <p><strong>Answer:</strong> Check for zombie processes (<code>ps aux | grep Z</code>). If many zombies exist, the PID 1 process isn't reaping them. Solutions: (1) Use <code>--init</code> flag, (2) Install tini/dumb-init, (3) Properly wait for child processes in your code.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"Zombies = Dead but not buried"</strong></p>
                    <p>The process is dead (exit status), but no one called wait() to "bury" it (remove from process table). Use <code>--init</code> to have tini be the "undertaker"!</p>
                </div>
            </div>
        `,

        'kernel-prerequisites': `
            <div class="content-card">
                <h2><span class="icon">🐧</span> Linux Kernel Prerequisites for Docker</h2>
                <p>Docker is built on <strong>Linux kernel features</strong>. Understanding these helps you debug issues and optimize performance.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>Core Kernel Features Docker Uses:</strong></p>
                    <ul style="margin-left: 20px; color: var(--text-secondary); line-height: 2;">
                        <li><strong>Namespaces:</strong> Isolate what a container can SEE (PIDs, network, mounts)</li>
                        <li><strong>Cgroups:</strong> Limit what a container can USE (CPU, memory, I/O)</li>
                        <li><strong>UnionFS:</strong> Layered filesystem (overlay2)</li>
                        <li><strong>Capabilities:</strong> Fine-grained permissions (instead of all-or-nothing root)</li>
                        <li><strong>Seccomp:</strong> System call filtering</li>
                        <li><strong>AppArmor/SELinux:</strong> Mandatory Access Control</li>
                    </ul>
                </div>

                <h3>Kernel Features Stack</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Docker's Kernel Dependencies</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                      <span class="highlight">LINUX KERNEL FEATURES FOR DOCKER</span>                       │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                              DOCKER                                     │
    └─────────────────────────────────────────────────────────────────────────┘
                                      │
    ┌─────────────────────────────────┼───────────────────────────────────────┐
    │                    LINUX KERNEL FEATURES                                │
    │                                                                         │
    │  ┌───────────────────────────────────────────────────────────────────┐ │
    │  │                      <span class="warning">NAMESPACES</span> (Isolation)                      │ │
    │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │ │
    │  │  │   PID   │ │   NET   │ │   MNT   │ │   UTS   │ │   IPC   │    │ │
    │  │  │  (PIDs) │ │(network)│ │(mounts) │ │(hostname│ │(IPC)    │    │ │
    │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │ │
    │  │  ┌─────────┐ ┌─────────┐                                        │ │
    │  │  │  USER   │ │  CGROUP │  ← Newer namespaces                    │ │
    │  │  │(users)  │ │(cgroups)│                                        │ │
    │  │  └─────────┘ └─────────┘                                        │ │
    │  └───────────────────────────────────────────────────────────────────┘ │
    │                                                                         │
    │  ┌───────────────────────────────────────────────────────────────────┐ │
    │  │                      <span class="success">CGROUPS</span> (Resource Limits)                    │ │
    │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │ │
    │  │  │   CPU   │ │  Memory │ │  BlkIO  │ │   PIDs  │ │  Devices│    │ │
    │  │  │ limits  │ │  limits │ │ limits  │ │  limit  │ │  access │    │ │
    │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │ │
    │  └───────────────────────────────────────────────────────────────────┘ │
    │                                                                         │
    │  ┌───────────────────────────────────────────────────────────────────┐ │
    │  │                      <span class="highlight">SECURITY</span> (Hardening)                        │ │
    │  │  ┌─────────┐ ┌─────────┐ ┌──────────────┐ ┌─────────┐           │ │
    │  │  │Capabili-│ │ Seccomp │ │AppArmor/     │ │ User    │           │ │
    │  │  │  ties   │ │ (syscal)│ │SELinux (MAC) │ │ NS      │           │ │
    │  │  └─────────┘ └─────────┘ └──────────────┘ └─────────┘           │ │
    │  └───────────────────────────────────────────────────────────────────┘ │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Namespace</th>
                                <th>What It Isolates</th>
                                <th>Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-blue">PID</span></td>
                                <td>Process IDs</td>
                                <td>Container sees its process as PID 1</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">NET</span></td>
                                <td>Network stack</td>
                                <td>Own IP address, ports, routing table</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">MNT</span></td>
                                <td>Mount points</td>
                                <td>Own root filesystem</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">UTS</span></td>
                                <td>Hostname</td>
                                <td>Can set own hostname</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">IPC</span></td>
                                <td>Inter-process communication</td>
                                <td>Own shared memory, semaphores</td>
                            </tr>
                            <tr>
                                <td><span class="badge badge-blue">USER</span></td>
                                <td>User/Group IDs</td>
                                <td>Root inside = non-root outside</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Check Kernel Support</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Check kernel version (need 3.10+ for Docker)
uname -r

# Check cgroups version
mount | grep cgroup

# Check namespace support
ls /proc/$$/ns/

# Docker's check script
curl -fsSL https://get.docker.com/rootless | sh

# Check overlayfs support
cat /proc/filesystems | grep overlay</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "Can Docker run on Windows natively?"</p>
                    <p><strong>Answer:</strong> Windows containers use Windows kernel features (job objects, namespacing). Linux containers on Windows run in a lightweight VM (WSL2 or Hyper-V) because they need a Linux kernel. Docker Desktop handles this transparently.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"Namespaces = What you SEE. Cgroups = What you USE."</strong></p>
                    <p>Container sees its own PID 1 (namespace). Container can only use 512MB RAM (cgroup).</p>
                </div>
            </div>
        `,

        'rootless-docker': `
            <div class="content-card">
                <h2><span class="icon">🔓</span> Rootless Docker Internals</h2>
                <p>Rootless Docker runs the Docker daemon and containers <strong>without root privileges</strong>. It's a critical security feature for multi-tenant environments.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>What is Rootless Docker?</strong> The entire Docker stack (daemon, containers) runs as a regular user. No root required!</p>
                    <p><strong>How is this possible?</strong> Uses user namespaces to remap UIDs. Root (UID 0) inside container = your regular user outside.</p>
                    <p><strong>Key technologies:</strong></p>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>User namespaces:</strong> UID remapping</li>
                        <li><strong>slirp4netns:</strong> User-space networking (no CAP_NET_ADMIN needed)</li>
                        <li><strong>fuse-overlayfs:</strong> Overlay filesystem in user space</li>
                    </ul>
                </div>

                <h3>Rootless Architecture</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Rootless vs Rootful Docker</div>
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────────────┐
│                         <span class="warning">ROOTFUL DOCKER (Traditional)</span>                       │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────────────┐
    │  dockerd runs as <span class="warning">ROOT</span>                                                │
    │  /var/run/docker.sock owned by root                                   │
    │                                                                       │
    │  Container process:                                                   │
    │  ├── UID 0 inside = <span class="warning">UID 0 (root) on host!</span>                          │
    │  └── Has kernel-level access through root                             │
    │                                                                       │
    │  <span class="warning">Security Risk:</span> Container escape = root access to host!              │
    └───────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                         <span class="success">ROOTLESS DOCKER</span>                                    │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────────────┐
    │  dockerd runs as <span class="success">regular user (e.g., uid 1000)</span>                       │
    │  ~/.local/share/docker/run/docker.sock (user owned)                   │
    │                                                                       │
    │  Container process:                                                   │
    │  ├── UID 0 inside = <span class="success">UID 100000+ on host (nobody!)</span>                  │
    │  └── Uses user namespaces for UID remapping                           │
    │                                                                       │
    │  <span class="success">Security:</span> Container escape = unprivileged user, limited damage!     │
    └───────────────────────────────────────────────────────────────────────┘


    UID MAPPING EXAMPLE:
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │   Inside Container          Outside (Host)                              │
    │   ────────────────          ─────────────                               │
    │   UID 0 (root)       →      UID 100000   (unprivileged)                │
    │   UID 1 (daemon)     →      UID 100001   (unprivileged)                │
    │   UID 1000 (user)    →      UID 101000   (unprivileged)                │
    │                                                                         │
    │   Files created as "root" inside container appear as UID 100000        │
    │   on the host filesystem — cannot access host's root files!            │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: Shared Development Server</div>
                    <p><strong>Setup:</strong> 10 developers share a Linux server. Each needs Docker for testing.</p>
                    <p><strong>Problem with rootful:</strong> Adding users to docker group = giving them root access!</p>
                    <p><strong>Rootless solution:</strong> Each developer runs their own dockerd as their user. Container escapes only affect their own files.</p>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Rootful</th>
                                <th>Rootless</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Port binding &lt;1024</td>
                                <td>✅ Works</td>
                                <td>❌ Needs workaround</td>
                            </tr>
                            <tr>
                                <td>Network performance</td>
                                <td>✅ Native</td>
                                <td>⚠️ Slightly slower (slirp4netns)</td>
                            </tr>
                            <tr>
                                <td>Storage performance</td>
                                <td>✅ Native overlay2</td>
                                <td>⚠️ fuse-overlayfs (slower)</td>
                            </tr>
                            <tr>
                                <td>Security</td>
                                <td>⚠️ Root on host</td>
                                <td>✅ Unprivileged</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Setup Rootless Docker</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Install rootless Docker
curl -fsSL https://get.docker.com/rootless | sh

# Set environment variables (add to ~/.bashrc)
export PATH=/home/myuser/bin:$PATH
export DOCKER_HOST=unix:///run/user/1000/docker.sock

# Start rootless dockerd
systemctl --user start docker

# Verify
docker context use rootless
docker run hello-world

# Check UID mapping
docker run alpine cat /proc/self/uid_map</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Common question:</strong> "What are the limitations of rootless Docker?"</p>
                    <p><strong>Answer:</strong> (1) Can't bind to ports &lt;1024 by default, (2) Slightly slower networking (slirp4netns), (3) Some volume mount limitations, (4) cgroup v2 required for resource limits. But security benefit often outweighs these!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Quick Memory Trick</div>
                    <p><strong>"Rootless = Root inside, nobody outside"</strong></p>
                    <p>Your container thinks it's root, but the host sees it as an unprivileged user. Escape = limited damage!</p>
                </div>
            </div>
        `,

        // ========================
        // SECTION 3: IMAGES & DOCKERFILES
        // ========================
        'image-layers': `
            <div class="content-card">
                <h2><span class="icon">📦</span> Image Layers & Union Filesystem</h2>
                <p>Every Docker image is made of <strong>read-only layers</strong>. Understanding layers is key.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Micro-Level Definition</div>
                    <p><strong>What is a layer?</strong> Each Dockerfile instruction creates a new layer. Layers are stacked, cached, and shared between images.</p>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># See all layers and sizes
docker history nginx:latest

# Analyze layers interactively
docker run --rm -it wagoodman/dive nginx:latest</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Q:</strong> "How to reduce image size?"</p>
                    <p><strong>A:</strong> Use alpine, multi-stage builds, combine RUN commands, clean up in same layer</p>
                </div>
            </div>
        `,

        'dockerfile-deep': `
            <div class="content-card">
                <h2><span class="icon">📝</span> Dockerfile Instructions Deep Dive</h2>
                <p>Master the <strong>subtle differences</strong> between similar commands.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Key Distinctions</div>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>COPY vs ADD:</strong> Use COPY. ADD extracts tarballs.</li>
                        <li><strong>CMD vs ENTRYPOINT:</strong> CMD is overridable, ENTRYPOINT is fixed.</li>
                        <li><strong>ARG vs ENV:</strong> ARG is build-time, ENV persists.</li>
                    </ul>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN adduser -D app
COPY --from=builder --chown=app /app/dist ./dist
USER app
HEALTHCHECK CMD wget -q --spider http://localhost:3000/health
ENTRYPOINT ["node"]
CMD ["dist/server.js"]</pre>
                </div>
            </div>
        `,

        'multistage-builds': `
            <div class="content-card">
                <h2><span class="icon">🏗️</span> Multi-stage Builds</h2>
                <p>Create <strong>lean production images</strong> without build tools.</p>
                
                <div class="real-world-box">
                    <div class="real-world-header">🌍 Impact: 800MB → 15MB = 98% smaller!</div>
                    <p>Build in stage 1, copy only artifacts to minimal stage 2.</p>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /server .

# Production stage - FROM SCRATCH = 0 bytes!
FROM scratch
COPY --from=builder /server /server
ENTRYPOINT ["/server"]</pre>
                </div>
            </div>
        `,

        // ========================
        // SECTION 5: CONTAINERS RUNTIME
        // ========================
        'namespaces': `
            <div class="content-card">
                <h2><span class="icon">📦</span> Linux Namespaces Deep Dive</h2>
                <p>Namespaces control what a container can <strong>SEE</strong>.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 7 Types of Namespaces</div>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>PID:</strong> Process IDs</li>
                        <li><strong>NET:</strong> Network stack</li>
                        <li><strong>MNT:</strong> Mount points</li>
                        <li><strong>UTS:</strong> Hostname</li>
                        <li><strong>IPC:</strong> Inter-process comm</li>
                        <li><strong>USER:</strong> User IDs</li>
                        <li><strong>CGROUP:</strong> Cgroup hierarchy</li>
                    </ul>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Find container's PID
docker inspect --format '{{.State.Pid}}' mycontainer

# Enter container's namespace
sudo nsenter --target PID --mount --net --pid</pre>
                </div>
            </div>
        `,

        'cgroups': `
            <div class="content-card">
                <h2><span class="icon">⚡</span> Cgroups v1 vs v2</h2>
                <p>Cgroups limit what resources a container can <strong>USE</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Run with resource limits
docker run -d --memory="512m" --cpus="0.5" nginx

# See current usage
docker stats mycontainer</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 OOM Killer</div>
                    <p>Exceeding memory limit → OOM killer terminates → Exit code 137</p>
                </div>
            </div>
        `,

        'seccomp-profiles': `
            <div class="content-card">
                <h2><span class="icon">🔒</span> Seccomp Profiles</h2>
                <p>Seccomp filters what syscalls a container can <strong>DO</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Custom seccomp profile
docker run --security-opt seccomp=profile.json nginx

# No seccomp (dangerous!)
docker run --security-opt seccomp=unconfined nginx</pre>
                </div>
            </div>
        `,

        'capabilities': `
            <div class="content-card">
                <h2><span class="icon">🎖️</span> Linux Capabilities</h2>
                <p>Fine-grained root permissions instead of all-or-nothing.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Most secure: drop all, add only needed
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx</pre>
                </div>
            </div>
        `,

        // ========================
        // SECTION 6: STORAGE
        // ========================
        'volumes-vs-binds': `
            <div class="content-card">
                <h2><span class="icon">💾</span> Volumes vs Bind Mounts</h2>
                <p>Essential for <strong>data persistence</strong>.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Storage Types</div>
                    <ul style="margin-left: 20px; color: var(--text-secondary);">
                        <li><strong>Volumes:</strong> Docker-managed. Best for production.</li>
                        <li><strong>Bind Mounts:</strong> Host directory mapping. Best for dev.</li>
                        <li><strong>tmpfs:</strong> Memory only. Best for secrets.</li>
                    </ul>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Volume
docker run -v mydata:/data nginx

# Bind mount
docker run -v $(pwd)/app:/app node:18

# tmpfs
docker run --tmpfs /secrets:size=64m nginx</pre>
                </div>
            </div>
        `,

        // ========================
        // SECTION 7: NETWORKING  
        // ========================
        'dns-internals': `
            <div class="content-card">
                <h2><span class="icon">🌐</span> Container DNS Internals</h2>
                <p>Docker's embedded DNS at <strong>127.0.0.11</strong> enables service discovery.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Check DNS config
docker exec mycontainer cat /etc/resolv.conf

# Test DNS resolution  
docker exec mycontainer nslookup other-container

# Custom DNS
docker run --dns 8.8.8.8 nginx</pre>
            </div>
        `,

        // ========================
        // SECTION 8: SECURITY
        // ========================
        'read-only-containers': `
            <div class="content-card">
                <h2><span class="icon">🔐</span> Read-only Containers</h2>
                <p>Run containers with <strong>immutable root filesystem</strong> for maximum security.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Read-only root filesystem
docker run --read-only nginx

# With tmpfs for writable temp dirs
docker run --read-only --tmpfs /tmp --tmpfs /var/cache/nginx nginx

# In Compose
services:
  app:
    read_only: true
    tmpfs:
      - /tmp</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Why Read-only?</div>
                    <p>Attackers can't install malware, modify binaries, or persist changes. Even if exploited, damage is limited!</p>
                </div>
            </div>
        `,

        'non-root-users': `
            <div class="content-card">
                <h2><span class="icon">👤</span> Running as Non-root User</h2>
                <p>Never run containers as root. Use <strong>least privilege</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># In Dockerfile
FROM node:18-alpine
RUN addgroup -g 1001 app && adduser -u 1001 -G app -D app
WORKDIR /app
COPY --chown=app:app . .
USER app
CMD ["node", "server.js"]

# At runtime
docker run --user 1001:1001 myapp

# Verify
docker exec mycontainer whoami  # Should NOT be root</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Container Escape Prevention</div>
                    <p>Even if root inside container, user namespaces map to unprivileged user outside. Defense in depth!</p>
                </div>
            </div>
        `,

        'image-scanning': `
            <div class="content-card">
                <h2><span class="icon">🔍</span> Image Vulnerability Scanning</h2>
                <p>Scan images for <strong>CVEs and vulnerabilities</strong> before deployment.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Docker Scout (built-in)
docker scout quickview nginx:latest
docker scout cves nginx:latest

# Trivy (popular open source)
trivy image nginx:latest
trivy image --severity HIGH,CRITICAL myapp:latest

# Grype
grype nginx:latest

# In CI/CD pipeline
docker build -t myapp . && trivy image --exit-code 1 myapp</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Shift Left Security</div>
                    <p>Scan in CI/CD pipeline, block deployments if critical CVEs found. Fix before production!</p>
                </div>
            </div>
        `,

        'secrets-management': `
            <div class="content-card">
                <h2><span class="icon">🔑</span> Docker Secrets Management</h2>
                <p>Never put secrets in images or environment variables. Use <strong>Docker secrets</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Create secret
echo "supersecret" | docker secret create db_password -

# Use in Swarm service
docker service create --secret db_password myapp

# In Compose v3
services:
  app:
    secrets:
      - db_password
secrets:
  db_password:
    external: true

# Secret mounted at /run/secrets/db_password (NOT in env!)</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Why NOT Environment Variables?</div>
                    <p>docker inspect exposes env vars! Process listings show them! Secrets are in tmpfs, never on disk.</p>
                </div>
            </div>
        `,

        // ========================
        // SECTION 9: DOCKER COMPOSE
        // ========================
        'compose-deep': `
            <div class="content-card">
                <h2><span class="icon">🎼</span> Docker Compose Deep Dive</h2>
                <p>Orchestrate <strong>multi-container applications</strong> declaratively.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: wget -q --spider http://localhost:3000/health
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
  
  db:
    image: postgres:15
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: pg_isready -U postgres
      interval: 10s

volumes:
  pg_data:</pre>
                </div>
            </div>
        `,

        'compose-networking': `
            <div class="content-card">
                <h2><span class="icon">🌐</span> Compose Networking</h2>
                <p>Compose creates a <strong>default network</strong> for service discovery.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>services:
  frontend:
    networks:
      - frontend
  
  backend:
    networks:
      - frontend
      - backend
  
  db:
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true  # No internet access!

# DNS: service name = hostname (db, backend, frontend)</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Key Takeaway</div>
                    <p>Services communicate by name. "db:5432" not "172.17.0.5:5432". Docker DNS handles resolution.</p>
                </div>
            </div>
        `,

        // ========================
        // SECTION 10: CI/CD
        // ========================
        'ci-pipeline': `
            <div class="content-card">
                <h2><span class="icon">🔄</span> CI/CD Pipeline Integration</h2>
                <p>Build, test, and push Docker images in <strong>CI/CD pipelines</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">yaml</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># GitHub Actions
name: Docker Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build image
        run: docker build -t myapp:\${{ github.sha }} .
      
      - name: Scan for vulnerabilities
        run: trivy image --exit-code 1 myapp:\${{ github.sha }}
      
      - name: Run tests
        run: docker run myapp:\${{ github.sha }} npm test
      
      - name: Push to registry
        run: |
          echo \${{ secrets.DOCKER_PASSWORD }} | docker login -u \${{ secrets.DOCKER_USER }} --password-stdin
          docker push myapp:\${{ github.sha }}</pre>
                </div>
            </div>
        `,

        'buildkit': `
            <div class="content-card">
                <h2><span class="icon">🚀</span> BuildKit Optimizations</h2>
                <p>BuildKit is Docker's next-gen builder with <strong>advanced caching and parallelism</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Enable BuildKit
export DOCKER_BUILDKIT=1

# Or in Docker daemon config
{ "features": { "buildkit": true } }

# Advanced caching
docker build --cache-from=myapp:cache --build-arg BUILDKIT_INLINE_CACHE=1 .

# Secret mounting (never in image!)
RUN --mount=type=secret,id=npm_token npm install

# SSH forwarding for private repos
RUN --mount=type=ssh git clone git@github.com:private/repo

# Parallel builds
docker buildx bake --file docker-bake.hcl</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 BuildKit Benefits</div>
                    <p>Parallel builds, better caching, secret handling, SSH forwarding. Always enable it!</p>
                </div>
            </div>
        `,

        'registry-deep': `
            <div class="content-card">
                <h2><span class="icon">📦</span> Container Registry Deep Dive</h2>
                <p>Push, pull, and manage images in <strong>container registries</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Tag for registry
docker tag myapp:latest myregistry.com/myapp:v1.0

# Push
docker push myregistry.com/myapp:v1.0

# Private registry login
docker login myregistry.com

# Multi-architecture builds
docker buildx build --platform linux/amd64,linux/arm64 --push -t myapp:multi .

# Run private registry
docker run -d -p 5000:5000 registry:2

# Inspect manifest
docker manifest inspect nginx:latest</pre>
            </div>
        `,

        // ========================
        // SECTION 11: PRODUCTION DEBUGGING
        // ========================
        'container-debugging': `
            <div class="content-card">
                <h2><span class="icon">🔧</span> Container Debugging Techniques</h2>
                <p>Expert debugging when things go wrong in <strong>production</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Interactive shell in running container
docker exec -it mycontainer /bin/sh

# Attach to container's main process
docker attach mycontainer

# View logs with timestamps
docker logs -f --timestamps mycontainer

# Inspect all container details
docker inspect mycontainer

# Check resource usage
docker stats mycontainer

# See running processes
docker top mycontainer

# View file changes in container
docker diff mycontainer

# Copy files out for analysis
docker cp mycontainer:/app/error.log ./error.log

# Debug a crashed container (start a new one with same image)
docker run -it --entrypoint /bin/sh myimage

# Debug networking
docker exec mycontainer netstat -tulpn
docker exec mycontainer curl -v localhost:3000</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Debug Tip: Ephemeral Containers</div>
                    <p>For minimal images without shell, run a debug sidecar: <code>docker run --pid=container:myapp --net=container:myapp alpine</code></p>
                </div>
            </div>
        `,

        'oom-debugging': `
            <div class="content-card">
                <h2><span class="icon">💥</span> OOM Killer Debugging</h2>
                <p>Diagnose and fix <strong>Out of Memory</strong> container crashes.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Check if container was OOM killed
docker inspect mycontainer | jq '.[0].State.OOMKilled'
# Returns: true (if OOM) or false

# Exit code 137 = OOM (128 + 9 = SIGKILL)
docker inspect mycontainer | jq '.[0].State.ExitCode'

# Check dmesg for OOM events
dmesg | grep -i "oom\|killed process"

# Monitor memory usage before it crashes
docker stats mycontainer

# Increase memory limit
docker run --memory="1g" myapp

# Add swap (if allowed)
docker run --memory="512m" --memory-swap="1g" myapp

# Profile memory inside container
docker exec mycontainer ps aux --sort=-%mem | head</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Common Causes</div>
                    <p>Memory leaks, JVM heap too large, caching unbounded data, processing large files</p>
                </div>
            </div>
        `,

        'networking-debugging': `
            <div class="content-card">
                <h2><span class="icon">🌐</span> Network Debugging</h2>
                <p>Troubleshoot <strong>connectivity issues</strong> between containers.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># List networks
docker network ls

# Inspect network details
docker network inspect bridge

# See which containers are on a network
docker network inspect mynetwork | jq '.[0].Containers'

# Test DNS resolution
docker exec mycontainer nslookup other-container

# Test connectivity
docker exec mycontainer ping other-container
docker exec mycontainer curl http://other-container:3000

# Check listening ports
docker exec mycontainer netstat -tulpn

# Inspect iptables rules (on host)
sudo iptables -L -n -v | grep docker

# Packet capture
docker run --net=container:mycontainer nicolaka/netshoot tcpdump -i eth0</pre>
                </div>
            </div>
        `,

        // ========================
        // SECTION 12: KUBERNETES BRIDGE
        // ========================
        'docker-to-k8s': `
            <div class="content-card">
                <h2><span class="icon">☸️</span> Docker to Kubernetes Transition</h2>
                <p>Map Docker concepts to <strong>Kubernetes equivalents</strong>.</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Docker</th>
                                <th>Kubernetes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Container</td><td>Pod (can have multiple containers)</td></tr>
                            <tr><td>docker-compose.yml</td><td>Deployment + Service YAML</td></tr>
                            <tr><td>docker run</td><td>kubectl run / kubectl apply</td></tr>
                            <tr><td>docker ps</td><td>kubectl get pods</td></tr>
                            <tr><td>docker logs</td><td>kubectl logs</td></tr>
                            <tr><td>docker exec</td><td>kubectl exec</td></tr>
                            <tr><td>Volumes</td><td>PersistentVolumes + PersistentVolumeClaims</td></tr>
                            <tr><td>Networks</td><td>Services + NetworkPolicies</td></tr>
                            <tr><td>Swarm</td><td>Kubernetes cluster</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Convert Docker Compose to Kubernetes
kompose convert -f docker-compose.yml

# Run Docker image in Kubernetes
kubectl run myapp --image=myapp:latest

# Quick port-forward for testing
kubectl port-forward pod/myapp 3000:3000</pre>
                </div>
            </div>
        `,

        'containerd-cri': `
            <div class="content-card">
                <h2><span class="icon">📦</span> containerd vs Docker in Kubernetes</h2>
                <p>Understanding <strong>container runtimes</strong> in Kubernetes.</p>
                
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Kubernetes Container Runtime Evolution</div>
                    <div class="ascii-content">
    <span class="warning">OLD (Docker shim - deprecated)</span>
    kubectl → kubelet → docker-shim → dockerd → containerd → runc

    <span class="success">NEW (Direct containerd)</span>
    kubectl → kubelet → containerd → runc

    Benefits: Less overhead, faster, simpler
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Key Point</div>
                    <p>Your Docker images still work! OCI images are compatible. You just don't need the Docker daemon in the Kubernetes node.</p>
                </div>
            </div>
        `,

        // ========================
        // MORE NETWORKING TOPICS
        // ========================
        'network-drivers': `
            <div class="content-card">
                <h2><span class="icon">🔌</span> Docker Network Drivers</h2>
                <p>Choose the right <strong>network driver</strong> for your use case.</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Driver</th>
                                <th>Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>bridge</strong></td><td>Default. Containers on same host communicate</td></tr>
                            <tr><td><strong>host</strong></td><td>No network isolation. Container uses host network</td></tr>
                            <tr><td><strong>none</strong></td><td>No networking. Complete isolation</td></tr>
                            <tr><td><strong>overlay</strong></td><td>Swarm. Multi-host networking</td></tr>
                            <tr><td><strong>macvlan</strong></td><td>Assign MAC address. Container appears as physical device</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Create custom bridge network
docker network create --driver bridge mynetwork

# Use host networking (no isolation)
docker run --network host nginx

# No networking
docker run --network none alpine

# List networks
docker network ls

# Connect running container to network
docker network connect mynetwork mycontainer</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 When to Use Host Networking</div>
                    <p>Maximum network performance needed, or when container needs to see all host traffic. But NO port isolation!</p>
                </div>
            </div>
        `,

        'port-mapping': `
            <div class="content-card">
                <h2><span class="icon">🚪</span> Port Mapping Deep Dive</h2>
                <p>Understand how Docker <strong>exposes container ports</strong> to the host.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Map host port 8080 to container port 80
docker run -p 8080:80 nginx

# Map to specific interface
docker run -p 127.0.0.1:8080:80 nginx

# Map random host port
docker run -p 80 nginx
docker port mycontainer  # Shows assigned port

# Map port range
docker run -p 8000-8010:8000-8010 myapp

# UDP port
docker run -p 53:53/udp dns-server

# Expose in Dockerfile (documentation only!)
EXPOSE 80 443</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Security: Bind to 127.0.0.1</div>
                    <p>Use <code>-p 127.0.0.1:8080:80</code> for local-only access. Default <code>-p 8080:80</code> binds to 0.0.0.0 (all interfaces)!</p>
                </div>
            </div>
        `,

        // ========================
        // HEALTH CHECKS & LOGGING
        // ========================
        'health-checks': `
            <div class="content-card">
                <h2><span class="icon">❤️</span> Container Health Checks</h2>
                <p>Let Docker know when your app is <strong>actually ready</strong> to serve traffic.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># In Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD wget -q --spider http://localhost:3000/health || exit 1

# Or with curl
HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1</pre>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Health check at runtime
docker run --health-cmd="curl -f http://localhost/" \\
           --health-interval=30s \\
           --health-retries=3 \\
           nginx

# Check health status
docker inspect --format='{{.State.Health.Status}}' mycontainer
# Returns: starting, healthy, or unhealthy

# View health check logs
docker inspect --format='{{json .State.Health}}' mycontainer | jq</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Why Health Checks Matter</div>
                    <p>Container running ≠ app working! Health checks detect app hangs, DB connection loss, deadlocks. Orchestrators use them for restarts.</p>
                </div>
            </div>
        `,

        'logging-drivers': `
            <div class="content-card">
                <h2><span class="icon">📋</span> Docker Logging Drivers</h2>
                <p>Route container logs to the right <strong>destination</strong>.</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Driver</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>json-file</strong></td><td>Default. Logs to JSON files on host</td></tr>
                            <tr><td><strong>syslog</strong></td><td>Send to syslog daemon</td></tr>
                            <tr><td><strong>journald</strong></td><td>Send to systemd journal</td></tr>
                            <tr><td><strong>fluentd</strong></td><td>Send to Fluentd collector</td></tr>
                            <tr><td><strong>awslogs</strong></td><td>Send to AWS CloudWatch</td></tr>
                            <tr><td><strong>none</strong></td><td>Disable logging</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Use specific logging driver
docker run --log-driver=syslog nginx

# Limit log size (prevent disk full!)
docker run --log-driver json-file \\
           --log-opt max-size=10m \\
           --log-opt max-file=3 \\
           nginx

# View logs
docker logs mycontainer
docker logs --tail 100 -f mycontainer

# Set default in daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}</pre>
                </div>
            </div>
        `,

        // ========================
        // RESOURCE CONSTRAINTS
        // ========================
        'memory-limits': `
            <div class="content-card">
                <h2><span class="icon">💾</span> Memory Limits Deep Dive</h2>
                <p>Control container <strong>memory usage</strong> to prevent OOM situations.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Set memory limit
docker run --memory="512m" nginx

# Memory + swap limit
docker run --memory="512m" --memory-swap="1g" nginx
# memory-swap = memory + swap, so swap = 512m

# Disable swap
docker run --memory="512m" --memory-swap="512m" nginx

# Memory reservation (soft limit)
docker run --memory="1g" --memory-reservation="512m" nginx

# Check memory usage
docker stats mycontainer

# Kernel memory limit
docker run --kernel-memory="50m" nginx</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 OOM Behavior</div>
                    <p>When limit exceeded: OOM killer terminates container. Exit code 137. Check <code>docker inspect</code> for OOMKilled: true.</p>
                </div>
            </div>
        `,

        'cpu-limits': `
            <div class="content-card">
                <h2><span class="icon">⚡</span> CPU Limits Deep Dive</h2>
                <p>Control container <strong>CPU usage</strong> for fair resource sharing.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Limit to 1.5 CPUs
docker run --cpus="1.5" nginx

# CPU shares (relative weight, default 1024)
docker run --cpu-shares=512 nginx  # Half priority

# Pin to specific CPUs
docker run --cpuset-cpus="0,1" nginx  # Only CPU 0 and 1

# CPU period and quota (advanced)
docker run --cpu-period=100000 --cpu-quota=50000 nginx
# = 50% of one CPU

# Check CPU usage
docker stats --format "table {{.Name}}\\t{{.CPUPerc}}"</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 CPUs vs CPU Shares</div>
                    <p><code>--cpus</code> is a hard limit. <code>--cpu-shares</code> is relative priority - only matters when CPU is contested.</p>
                </div>
            </div>
        `,

        // ========================
        // IMAGE OPTIMIZATION
        // ========================
        'distroless': `
            <div class="content-card">
                <h2><span class="icon">🎯</span> Distroless Images</h2>
                <p>Minimal images with <strong>no shell, no package manager</strong> — just your app.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Node.js distroless
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM gcr.io/distroless/nodejs18-debian11
COPY --from=builder /app/dist /app
WORKDIR /app
CMD ["server.js"]

# Python distroless
FROM python:3.11 AS builder
# ... build steps ...

FROM gcr.io/distroless/python3
COPY --from=builder /app /app
CMD ["main.py"]

# Static binary (Go/Rust)
FROM gcr.io/distroless/static
COPY myapp /myapp
CMD ["/myapp"]</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Why Distroless?</div>
                    <p>No shell = attackers can't get a shell. No apt = no installing malware. Smaller image = smaller attack surface.</p>
                </div>
            </div>
        `,

        'cache-optimization': `
            <div class="content-card">
                <h2><span class="icon">⚡</span> Build Cache Optimization</h2>
                <p>Speed up builds by <strong>maximizing cache hits</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># ❌ BAD: Cache busted every time code changes
COPY . .
RUN npm install

# ✅ GOOD: Dependencies cached until package.json changes
COPY package*.json ./
RUN npm install
COPY . .

# Even better: Cache mount for package managers
RUN --mount=type=cache,target=/root/.npm npm install

# Python example
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt
COPY . .

# Use .dockerignore to exclude files
echo "node_modules
.git
*.log
Dockerfile" > .dockerignore</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Cache Rule</div>
                    <p>Order Dockerfile instructions: least changing → most changing. Dependencies before code!</p>
                </div>
            </div>
        `,

        'image-size': `
            <div class="content-card">
                <h2><span class="icon">📦</span> Reducing Image Size</h2>
                <p><strong>Smaller images</strong> = faster pulls, less storage, smaller attack surface.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># 1. Use smaller base images
FROM alpine:3.18          # 5MB
FROM debian:slim          # 80MB vs 200MB full
FROM gcr.io/distroless/   # minimal

# 2. Clean up in same layer
RUN apt-get update && apt-get install -y curl \\
    && rm -rf /var/lib/apt/lists/*

# 3. Multi-stage builds
FROM node:18 AS builder
RUN npm run build
FROM node:18-alpine
COPY --from=builder /app/dist ./dist

# 4. Use --no-install-recommends
RUN apt-get install --no-install-recommends -y pkg

# 5. Analyze with dive
docker run --rm -it wagoodman/dive myimage</pre>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>Base Image</th><th>Size</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>scratch</td><td>0 MB</td></tr>
                            <tr><td>alpine</td><td>5 MB</td></tr>
                            <tr><td>debian:slim</td><td>80 MB</td></tr>
                            <tr><td>ubuntu</td><td>70 MB</td></tr>
                            <tr><td>node:18-alpine</td><td>175 MB</td></tr>
                            <tr><td>node:18</td><td>1GB+</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        // ========================
        // DOCKER SWARM
        // ========================
        'swarm-basics': `
            <div class="content-card">
                <h2><span class="icon">🐝</span> Docker Swarm Basics</h2>
                <p>Docker's built-in <strong>container orchestration</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Initialize swarm
docker swarm init

# Join worker to swarm
docker swarm join --token SWMTKN-xxx manager:2377

# Create a service
docker service create --name web --replicas 3 -p 80:80 nginx

# Scale service
docker service scale web=5

# Update service
docker service update --image nginx:1.25 web

# Rolling update with delay
docker service update --update-delay 10s --update-parallelism 2 web

# List services
docker service ls

# View service logs
docker service logs web</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Swarm vs Kubernetes</div>
                    <p>Swarm: Built-in, simpler, good for small clusters. Kubernetes: More features, industry standard, steeper learning curve.</p>
                </div>
            </div>
        `,

        // ========================
        // TROUBLESHOOTING
        // ========================
        'common-errors': `
            <div class="content-card">
                <h2><span class="icon">🔥</span> Common Docker Errors</h2>
                <p>Quick reference for <strong>common error messages</strong> and fixes.</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>Error</th><th>Cause</th><th>Fix</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Exit code 137</td>
                                <td>OOM killed</td>
                                <td>Increase --memory limit</td>
                            </tr>
                            <tr>
                                <td>Exit code 1</td>
                                <td>App error</td>
                                <td>Check docker logs</td>
                            </tr>
                            <tr>
                                <td>"port already in use"</td>
                                <td>Port conflict</td>
                                <td>Use different -p port</td>
                            </tr>
                            <tr>
                                <td>"no space left"</td>
                                <td>Disk full</td>
                                <td>docker system prune</td>
                            </tr>
                            <tr>
                                <td>"permission denied"</td>
                                <td>Not in docker group</td>
                                <td>sudo usermod -aG docker $USER</td>
                            </tr>
                            <tr>
                                <td>"image not found"</td>
                                <td>Wrong name/tag</td>
                                <td>Check docker images</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Clean up disk space
docker system prune -a --volumes

# Check disk usage
docker system df

# Force remove stuck container
docker rm -f mycontainer

# Debug container that won't start
docker logs mycontainer
docker inspect mycontainer | jq '.[0].State'</pre>
                </div>
            </div>
        `,

        // ========================
        // ADVANCED SECURITY
        // ========================
        'apparmor': `
            <div class="content-card">
                <h2><span class="icon">🛡️</span> AppArmor Profiles</h2>
                <p>Mandatory Access Control to restrict <strong>what containers can access</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Check default profile
docker inspect mycontainer | jq '.[0].AppArmorProfile'

# Run with custom profile
docker run --security-opt apparmor=my-custom-profile nginx

# Run with no apparmor (less secure)
docker run --security-opt apparmor=unconfined nginx

# List available profiles
sudo aa-status

# Load a profile
sudo apparmor_parser -r /etc/apparmor.d/my-docker-profile</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 AppArmor vs SELinux</div>
                    <p>AppArmor: Path-based, easier. SELinux: Label-based, more powerful. Both provide MAC (Mandatory Access Control).</p>
                </div>
            </div>
        `,

        'content-trust': `
            <div class="content-card">
                <h2><span class="icon">✍️</span> Docker Content Trust</h2>
                <p>Sign and verify images for <strong>supply chain security</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Enable content trust
export DOCKER_CONTENT_TRUST=1

# Push signed image (will prompt for keys)
docker push myregistry.com/myapp:v1

# Pull only signed images
DOCKER_CONTENT_TRUST=1 docker pull nginx

# View signatures
docker trust inspect nginx:latest

# Sign existing image
docker trust sign myregistry.com/myapp:v1

# Revoke signature
docker trust revoke myregistry.com/myapp:v1</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Why Sign Images?</div>
                    <p>Prevents supply chain attacks. Ensures image wasn't tampered with between build and deployment.</p>
                </div>
            </div>
        `,

        // ========================
        // LIFECYCLE MANAGEMENT
        // ========================
        'container-lifecycle': `
            <div class="content-card">
                <h2><span class="icon">🔄</span> Container Lifecycle</h2>
                <p>Understand container <strong>states and transitions</strong>.</p>
                
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">📊 Container States</div>
                    <div class="ascii-content">
    docker create    docker start    docker stop    docker rm
         │               │               │              │
         ▼               ▼               ▼              ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ CREATED │───►│ RUNNING │───►│ STOPPED │───►│ REMOVED │
    └─────────┘    └─────────┘    └─────────┘    └─────────┘
                        │               ▲
                        └───────────────┘
                        docker restart

    Other states:
    • PAUSED (docker pause/unpause)
    • RESTARTING
    • DEAD (failed to remove)
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Create without starting
docker create --name myapp nginx

# Start created container
docker start myapp

# Pause/unpause
docker pause myapp
docker unpause myapp

# Restart policies
docker run --restart=always nginx
docker run --restart=on-failure:5 nginx
docker run --restart=unless-stopped nginx</pre>
                </div>
            </div>
        `,

        'restart-policies': `
            <div class="content-card">
                <h2><span class="icon">🔁</span> Restart Policies</h2>
                <p>Automatically restart containers when they <strong>fail or reboot</strong>.</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>Policy</th><th>Behavior</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>no</code></td><td>Never restart (default)</td></tr>
                            <tr><td><code>always</code></td><td>Always restart, including on daemon restart</td></tr>
                            <tr><td><code>unless-stopped</code></td><td>Like always, but not if manually stopped</td></tr>
                            <tr><td><code>on-failure[:max]</code></td><td>Only on non-zero exit, optional limit</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Production: restart on failure
docker run --restart=on-failure:5 myapp

# Update running container's restart policy
docker update --restart=always mycontainer

# Check restart count
docker inspect -f '{{.RestartCount}}' mycontainer</pre>
                </div>
            </div>
        `,

        // ========================
        // ENVIRONMENT & CONFIG
        // ========================
        'env-variables': `
            <div class="content-card">
                <h2><span class="icon">🔧</span> Environment Variables</h2>
                <p>Configure containers at runtime with <strong>env vars</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Single variable
docker run -e DATABASE_URL=postgres://... myapp

# From file
docker run --env-file .env myapp

# From shell
export API_KEY=secret
docker run -e API_KEY myapp  # Passes API_KEY from shell

# View env vars
docker exec mycontainer env
docker inspect -f '{{.Config.Env}}' mycontainer</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Security Warning</div>
                    <p>Never use -e for secrets! Use Docker secrets or mount files. <code>docker inspect</code> exposes env vars!</p>
                </div>
            </div>
        `,

        'build-args': `
            <div class="content-card">
                <h2><span class="icon">🏗️</span> Build Arguments</h2>
                <p>Pass variables at <strong>build time</strong> for configurable images.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># In Dockerfile
ARG NODE_VERSION=18
FROM node:\${NODE_VERSION}

ARG BUILD_DATE
ARG GIT_COMMIT
LABEL build-date=$BUILD_DATE git-commit=$GIT_COMMIT

# ARG → ENV (persist to runtime)
ARG APP_VERSION
ENV APP_VERSION=\${APP_VERSION}</pre>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Build with args
docker build --build-arg NODE_VERSION=20 \\
             --build-arg BUILD_DATE=$(date) \\
             --build-arg GIT_COMMIT=$(git rev-parse HEAD) \\
             -t myapp .</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 ARG vs ENV</div>
                    <p>ARG: Build-time only, not in final image. ENV: Persists into running container.</p>
                </div>
            </div>
        `,

        // ========================
        // DOCKER CONTEXTS
        // ========================
        'docker-contexts': `
            <div class="content-card">
                <h2><span class="icon">🔀</span> Docker Contexts</h2>
                <p>Manage <strong>multiple Docker hosts</strong> from a single CLI.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># List contexts
docker context ls

# Create remote context
docker context create prod --docker "host=ssh://user@prod-server"

# Switch context
docker context use prod

# Run command in specific context
docker --context prod ps

# Create from kubeconfig
docker context create k8s --kubernetes --kubeconfig ~/.kube/config

# Delete context
docker context rm prod</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Use Case: Dev/Prod Switching</div>
                    <p>Define contexts for local, staging, production. Switch with <code>docker context use</code> instead of SSH.</p>
                </div>
            </div>
        `,

        // ========================
        // DOCKER API
        // ========================
        'docker-api': `
            <div class="content-card">
                <h2><span class="icon">📡</span> Docker API</h2>
                <p>Control Docker <strong>programmatically</strong> via REST API.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># List containers via API
curl --unix-socket /var/run/docker.sock http://localhost/containers/json

# Create container
curl --unix-socket /var/run/docker.sock \\
     -H "Content-Type: application/json" \\
     -d '{"Image": "nginx"}' \\
     http://localhost/containers/create

# Start container
curl -X POST --unix-socket /var/run/docker.sock \\
     http://localhost/containers/{id}/start

# Get container logs
curl --unix-socket /var/run/docker.sock \\
     http://localhost/containers/{id}/logs?stdout=true</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Security: Socket Access = Root</div>
                    <p>Access to docker.sock = full root access. Never mount it in containers unless absolutely necessary!</p>
                </div>
            </div>
        `,

        // ========================
        // IMAGE MANAGEMENT
        // ========================
        'image-tagging': `
            <div class="content-card">
                <h2><span class="icon">🏷️</span> Image Tagging Strategies</h2>
                <p>Best practices for <strong>versioning Docker images</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Semantic versioning
docker tag myapp:latest myapp:1.2.3
docker tag myapp:latest myapp:1.2
docker tag myapp:latest myapp:1

# Git-based tagging
docker tag myapp:latest myapp:$(git rev-parse --short HEAD)
docker tag myapp:latest myapp:$(git describe --tags)

# Date-based
docker tag myapp:latest myapp:$(date +%Y%m%d)

# Multiple tags at build
docker build -t myapp:latest -t myapp:1.2.3 -t myapp:$(git rev-parse --short HEAD) .</pre>
                </div>

                <div class="table-container">
                    <table>
                        <thead><tr><th>Tag Style</th><th>Example</th><th>Use Case</th></tr></thead>
                        <tbody>
                            <tr><td>SemVer</td><td>1.2.3</td><td>Production releases</td></tr>
                            <tr><td>Git SHA</td><td>abc123</td><td>CI/CD, debugging</td></tr>
                            <tr><td>Branch</td><td>main, develop</td><td>Development</td></tr>
                            <tr><td>latest</td><td>latest</td><td>Avoid in prod!</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'image-cleanup': `
            <div class="content-card">
                <h2><span class="icon">🧹</span> Image Cleanup & Maintenance</h2>
                <p>Keep your Docker host <strong>clean and efficient</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Remove dangling images (no tag)
docker image prune

# Remove all unused images
docker image prune -a

# Remove all unused objects (images, containers, networks, volumes)
docker system prune -a --volumes

# Check disk usage
docker system df
docker system df -v  # Verbose

# Remove images older than 24h
docker image prune -a --filter "until=24h"

# Auto-cleanup in CI
docker build --rm -t myapp .  # Remove intermediate containers</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Production Tip</div>
                    <p>Schedule <code>docker system prune</code> as cron job. Monitor disk with alerting. Full disks = production outage!</p>
            </div>
        `,

        // ========================
        // CONTAINER OPERATIONS
        // ========================
        'exec-attach': `
            <div class="content-card">
                <h2><span class="icon">🖥️</span> Exec vs Attach</h2>
                <p>Two ways to interact with <strong>running containers</strong>.</p>
                
                <div class="table-container">
                    <table>
                        <thead><tr><th>Command</th><th>Purpose</th><th>Creates New Process?</th></tr></thead>
                        <tbody>
                            <tr><td><code>docker exec</code></td><td>Run new command in container</td><td>Yes</td></tr>
                            <tr><td><code>docker attach</code></td><td>Connect to main process (PID 1)</td><td>No</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Exec: Start new shell
docker exec -it mycontainer /bin/bash

# Exec: Run single command
docker exec mycontainer ls -la /app

# Attach: Connect to main process
docker attach mycontainer
# Ctrl+P, Ctrl+Q to detach without stopping

# Attach with no STDIN
docker attach --no-stdin mycontainer</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 When to Use Which</div>
                    <p><code>exec</code>: Debug, run commands. <code>attach</code>: See main process output. Beware: Ctrl+C on attach can stop container!</p>
                </div>
            </div>
        `,

        'docker-copy': `
            <div class="content-card">
                <h2><span class="icon">📂</span> Docker Copy</h2>
                <p>Copy files <strong>between container and host</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Copy from container to host
docker cp mycontainer:/app/logs ./logs

# Copy from host to container
docker cp ./config.json mycontainer:/app/config.json

# Copy entire directory
docker cp mycontainer:/var/log ./container-logs

# Works with stopped containers too!
docker cp stopped-container:/data ./backup

# Preserve permissions
docker cp --archive mycontainer:/app ./app-backup</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Use Case: Debug Crashed Container</div>
                    <p>Container crashed? Copy logs out: <code>docker cp crashed:/app/error.log .</code></p>
                </div>
            </div>
        `,

        'export-import': `
            <div class="content-card">
                <h2><span class="icon">📦</span> Export, Import, Save, Load</h2>
                <p>Move containers and images <strong>without a registry</strong>.</p>
                
                <div class="table-container">
                    <table>
                        <thead><tr><th>Command</th><th>Works On</th><th>Preserves</th></tr></thead>
                        <tbody>
                            <tr><td><code>export/import</code></td><td>Container → Image</td><td>Filesystem only</td></tr>
                            <tr><td><code>save/load</code></td><td>Image → Image</td><td>Layers, history, metadata</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Export container filesystem to tarball
docker export mycontainer > container.tar
docker import container.tar myimage:fromcontainer

# Save image (keeps layers and history)
docker save myimage:latest > image.tar
docker save myimage:latest | gzip > image.tar.gz

# Load image
docker load < image.tar
gunzip -c image.tar.gz | docker load

# Transfer between machines
docker save myapp | ssh user@host 'docker load'</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Key Difference</div>
                    <p><code>save/load</code> for images (preserves layers). <code>export/import</code> for containers (flattens to single layer).</p>
                </div>
            </div>
        `,

        'docker-commit': `
            <div class="content-card">
                <h2><span class="icon">💾</span> Docker Commit</h2>
                <p>Create image from <strong>modified container</strong> (not recommended for production!).</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Make changes in container
docker exec -it mycontainer apt-get install vim

# Commit changes to new image
docker commit mycontainer myimage:modified

# With author and message
docker commit -a "Author" -m "Added vim" mycontainer myimage:v2

# With config changes
docker commit --change='CMD ["python", "app.py"]' mycontainer myimage:new</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Warning: Anti-Pattern!</div>
                    <p>Use Dockerfiles for reproducibility. Commit is for quick debugging only. Changes are opaque and not tracked!</p>
                </div>
            </div>
        `,

        'docker-events': `
            <div class="content-card">
                <h2><span class="icon">📡</span> Docker Events</h2>
                <p>Real-time <strong>event stream</strong> from Docker daemon.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Stream all events
docker events

# Filter by container
docker events --filter container=mycontainer

# Filter by event type
docker events --filter event=start
docker events --filter event=die

# Filter by time range
docker events --since "2024-01-01" --until "2024-01-02"

# JSON output for parsing
docker events --format '{{json .}}'

# Filter by image
docker events --filter image=nginx</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Use Case: Monitoring</div>
                    <p>Integrate with alerting systems. Detect container crashes, restarts, OOM kills in real-time.</p>
                </div>
            </div>
        `,

        // ========================
        // VOLUME DRIVERS
        // ========================
        'volume-drivers': `
            <div class="content-card">
                <h2><span class="icon">💽</span> Volume Drivers</h2>
                <p>Use <strong>external storage</strong> with volume plugins.</p>
                
                <div class="table-container">
                    <table>
                        <thead><tr><th>Driver</th><th>Storage</th></tr></thead>
                        <tbody>
                            <tr><td>local</td><td>Host filesystem (default)</td></tr>
                            <tr><td>nfs</td><td>Network File System</td></tr>
                            <tr><td>cloudstor</td><td>AWS EBS, Azure Disk</td></tr>
                            <tr><td>convoy</td><td>Snapshot-based storage</td></tr>
                            <tr><td>flocker</td><td>Multi-host volumes</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Create volume with driver
docker volume create --driver local \\
    --opt type=nfs \\
    --opt o=addr=192.168.1.1,rw \\
    --opt device=:/path/to/dir \\
    nfs-volume

# Use in container
docker run -v nfs-volume:/data nginx

# List volume plugins
docker plugin ls

# Install volume plugin
docker plugin install vieux/sshfs</pre>
                </div>
            </div>
        `,

        // ========================
        // NETWORKING ADVANCED
        // ========================
        'iptables-docker': `
            <div class="content-card">
                <h2><span class="icon">🔥</span> Docker & iptables</h2>
                <p>How Docker manages <strong>network rules</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># View Docker's iptables rules
sudo iptables -L -n -v
sudo iptables -t nat -L -n -v

# Docker chains
# DOCKER - container port forwarding
# DOCKER-ISOLATION-STAGE-1/2 - network isolation
# DOCKER-USER - custom rules (survives restart!)

# Add custom rule (persistent)
sudo iptables -I DOCKER-USER -s 10.0.0.0/8 -j DROP

# Disable Docker iptables management
# /etc/docker/daemon.json
{ "iptables": false }</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Security Warning</div>
                    <p>Docker bypasses UFW/firewalld! Published ports are exposed even if firewall blocks them. Use DOCKER-USER chain for rules.</p>
                </div>
            </div>
        `,

        'docker-proxy': `
            <div class="content-card">
                <h2><span class="icon">🌐</span> Docker Behind Proxy</h2>
                <p>Configure Docker to work with <strong>corporate proxies</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># For docker daemon (pulling images)
# /etc/systemd/system/docker.service.d/proxy.conf
[Service]
Environment="HTTP_PROXY=http://proxy:8080"
Environment="HTTPS_PROXY=http://proxy:8080"
Environment="NO_PROXY=localhost,127.0.0.1"

# Reload daemon
sudo systemctl daemon-reload
sudo systemctl restart docker

# For containers (build-time)
docker build --build-arg HTTP_PROXY=$HTTP_PROXY .

# For containers (run-time)
docker run -e HTTP_PROXY=http://proxy:8080 myapp

# In ~/.docker/config.json (persistent)
{
  "proxies": {
    "default": {
      "httpProxy": "http://proxy:8080",
      "noProxy": "localhost"
    }
  }
}</pre>
                </div>
            </div>
        `,

        // ========================
        // DAEMON CONFIGURATION
        // ========================
        'daemon-json': `
            <div class="content-card">
                <h2><span class="icon">⚙️</span> Docker Daemon Configuration</h2>
                <p>Configure Docker daemon via <strong>daemon.json</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">json</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>// /etc/docker/daemon.json
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-address-pools": [
    {"base": "172.20.0.0/16", "size": 24}
  ],
  "insecure-registries": ["myregistry.local:5000"],
  "registry-mirrors": ["https://mirror.gcr.io"],
  "live-restore": true,
  "userland-proxy": false,
  "experimental": true,
  "features": {
    "buildkit": true
  }
}</pre>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Apply changes
sudo systemctl restart docker

# Validate config
dockerd --validate --config-file /etc/docker/daemon.json</pre>
                </div>
            </div>
        `,

        'live-restore': `
            <div class="content-card">
                <h2><span class="icon">♻️</span> Live Restore</h2>
                <p>Keep containers running during <strong>daemon restarts</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">json</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>// /etc/docker/daemon.json
{
  "live-restore": true
}</pre>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Restart daemon - containers keep running!
sudo systemctl restart docker

# Verify containers still running
docker ps</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Production Critical</div>
                    <p>Enables Docker upgrades without downtime. Containers reconnect to new daemon automatically.</p>
                </div>
            </div>
        `,

        // ========================
        // BEST PRACTICES
        // ========================
        'dockerfile-best-practices': `
            <div class="content-card">
                <h2><span class="icon">✅</span> Dockerfile Best Practices</h2>
                <p>Write <strong>production-ready</strong> Dockerfiles.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># 1. Use specific tags, not :latest
FROM node:18.19-alpine

# 2. Use non-root user
RUN adduser -D appuser
USER appuser

# 3. Order for cache efficiency
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# 4. Use multi-stage builds
FROM node:18 AS builder
RUN npm run build
FROM node:18-alpine
COPY --from=builder /app/dist ./dist

# 5. Minimize layers
RUN apt-get update && apt-get install -y pkg \\
    && rm -rf /var/lib/apt/lists/*

# 6. Use COPY over ADD
COPY ./src ./src

# 7. Use .dockerignore
# 8. Add health checks
HEALTHCHECK CMD curl -f http://localhost/ || exit 1

# 9. Set proper labels
LABEL maintainer="team@example.com"
LABEL version="1.0"</pre>
                </div>
            </div>
        `,

        'security-best-practices': `
            <div class="content-card">
                <h2><span class="icon">🔐</span> Security Best Practices</h2>
                <p>Harden your containers for <strong>production</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># 1. Run as non-root
docker run --user 1000:1000 myapp

# 2. Read-only root filesystem
docker run --read-only --tmpfs /tmp myapp

# 3. Drop all capabilities
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp

# 4. No new privileges
docker run --security-opt=no-new-privileges myapp

# 5. Resource limits
docker run --memory=512m --cpus=1 myapp

# 6. Scan images
trivy image myapp:latest

# 7. Use secrets, not env vars
docker run --secret db_password myapp

# 8. Enable content trust
export DOCKER_CONTENT_TRUST=1</pre>
                </div>

                <div class="table-container">
                    <table>
                        <thead><tr><th>Practice</th><th>Why</th></tr></thead>
                        <tbody>
                            <tr><td>Non-root</td><td>Limit escape damage</td></tr>
                            <tr><td>Read-only</td><td>Prevent persistence</td></tr>
                            <tr><td>Drop caps</td><td>Minimize privileges</td></tr>
                            <tr><td>Scan images</td><td>Find CVEs</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        // ========================
        // PERFORMANCE
        // ========================
        'performance-tuning': `
            <div class="content-card">
                <h2><span class="icon">🚀</span> Performance Tuning</h2>
                <p>Optimize Docker for <strong>maximum performance</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Use overlay2 storage driver
docker info | grep "Storage Driver"

# Disable userland proxy for faster networking
# /etc/docker/daemon.json
{ "userland-proxy": false }

# Use --network=host for max network perf
docker run --network=host myapp

# Pin to specific CPUs
docker run --cpuset-cpus="0,1" myapp

# Use tmpfs for temp data
docker run --tmpfs /tmp:rw,size=100m myapp

# Benchmark with docker stats
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}"

# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker build .</pre>
                </div>
            </div>
        `,

        'container-resource-monitoring': `
            <div class="content-card">
                <h2><span class="icon">📊</span> Resource Monitoring</h2>
                <p>Monitor container <strong>resource usage</strong> in production.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Real-time stats
docker stats

# Formatted output
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# One-time snapshot
docker stats --no-stream

# All containers (including stopped)
docker stats -a

# cAdvisor for detailed metrics
docker run -d --name cadvisor \\
    -v /:/rootfs:ro \\
    -v /var/run:/var/run:ro \\
    -v /sys:/sys:ro \\
    -v /var/lib/docker/:/var/lib/docker:ro \\
    -p 8080:8080 \\
    gcr.io/cadvisor/cadvisor

# Prometheus metrics endpoint
# curl http://localhost:8080/metrics</pre>
                </div>
            </div>
        `,

        // ========================
        // ENTERPRISE
        // ========================
        'docker-enterprise': `
            <div class="content-card">
                <h2><span class="icon">🏢</span> Enterprise Docker</h2>
                <p>Docker in <strong>enterprise environments</strong>.</p>
                
                <div class="table-container">
                    <table>
                        <thead><tr><th>Feature</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td>Docker Desktop</td><td>Local development with GUI</td></tr>
                            <tr><td>Docker Hub Teams</td><td>Private repos, team management</td></tr>
                            <tr><td>Docker Scout</td><td>Vulnerability scanning</td></tr>
                            <tr><td>Docker Build Cloud</td><td>Remote fast builds</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Docker Scout analysis
docker scout quickview myimage
docker scout recommendations myimage

# Private registry options
# - Docker Hub private repos
# - AWS ECR
# - Google GCR / Artifact Registry
# - Azure ACR
# - Harbor (self-hosted)
# - GitLab Container Registry</pre>
                </div>
            </div>
        `,

        // ========================
        // GPU & HARDWARE
        // ========================
        'gpu-containers': `
            <div class="content-card">
                <h2><span class="icon">🎮</span> GPU Containers</h2>
                <p>Run containers with <strong>GPU acceleration</strong> for ML/AI workloads.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -

# Run with all GPUs
docker run --gpus all nvidia/cuda:12.0-base nvidia-smi

# Run with specific GPU
docker run --gpus '"device=0"' mymlapp

# Run with 2 GPUs
docker run --gpus 2 mymlapp

# Docker Compose
services:
  ml:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Requirements</div>
                    <p>NVIDIA drivers on host, nvidia-container-toolkit installed. Works with CUDA, cuDNN, TensorFlow, PyTorch.</p>
                </div>
            </div>
        `,

        // ========================
        // TESTING
        // ========================
        'container-testing': `
            <div class="content-card">
                <h2><span class="icon">🧪</span> Container Testing</h2>
                <p>Test containers and images for <strong>quality and compliance</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Run tests inside container
docker run myapp npm test

# Container Structure Tests (Google)
container-structure-test test --image myapp:latest --config test-config.yaml

# Test config.yaml example
schemaVersion: "2.0.0"
fileExistenceTests:
  - name: 'Check app exists'
    path: '/app/server.js'
    shouldExist: true
commandTests:
  - name: 'Node version'
    command: 'node'
    args: ['--version']
    expectedOutput: ['v18']

# Hadolint for Dockerfile linting
hadolint Dockerfile

# Dockle for image best practices
dockle myapp:latest</pre>
                </div>
            </div>
        `,

        // ========================
        // INIT SYSTEMS
        // ========================
        'tini-dumb-init': `
            <div class="content-card">
                <h2><span class="icon">🚀</span> Init Systems: Tini & dumb-init</h2>
                <p>Proper <strong>init processes</strong> for containers.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Option 1: Tini
FROM alpine
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["myapp"]

# Option 2: dumb-init
FROM ubuntu
RUN apt-get update && apt-get install -y dumb-init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["myapp"]

# Option 3: Docker's built-in init
docker run --init myapp</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Why Use Init?</div>
                    <p>Reaps zombie processes, forwards signals properly. Without it, SIGTERM may not reach your app!</p>
                </div>
            </div>
        `,

        // ========================
        // PLATFORM/MULTI-ARCH
        // ========================
        'multi-platform': `
            <div class="content-card">
                <h2><span class="icon">🌍</span> Multi-Platform Builds</h2>
                <p>Build images for <strong>multiple architectures</strong> (amd64, arm64).</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Create builder with multi-platform support
docker buildx create --name mybuilder --use

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 \\
    --push -t myapp:multi .

# Inspect platforms
docker buildx imagetools inspect myapp:multi

# Check current platform
docker run --rm alpine uname -m

# Build for specific platform
docker build --platform linux/arm64 -t myapp:arm64 .</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Use Case: Apple Silicon</div>
                    <p>Build arm64 images on M1/M2 Macs, deploy to amd64 servers. Multi-platform images work everywhere!</p>
                </div>
            </div>
        `,

        // ========================
        // CONTAINER ALTERNATIVES
        // ========================
        'podman': `
            <div class="content-card">
                <h2><span class="icon">🦭</span> Podman: Docker Alternative</h2>
                <p>Daemonless, rootless <strong>OCI-compatible</strong> container engine.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Same commands as Docker!
podman run -d -p 80:80 nginx
podman ps
podman images
podman build -t myapp .

# Alias docker to podman
alias docker=podman

# Key differences:
# - No daemon (forkless execution)
# - Rootless by default
# - Systemd integration
# - Pods (like K8s pods)

# Create a pod
podman pod create --name mypod -p 8080:80
podman run -d --pod mypod nginx</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Docker vs Podman</div>
                    <p>Docker: daemon, root. Podman: daemonless, rootless. Same CLI. OCI images are compatible!</p>
                </div>
            </div>
        `,

        // ========================
        // DEBUGGING ADVANCED
        // ========================
        'strace-debugging': `
            <div class="content-card">
                <h2><span class="icon">🔬</span> Advanced Debugging with strace</h2>
                <p>Trace <strong>system calls</strong> for deep debugging.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Run with SYS_PTRACE capability
docker run --cap-add=SYS_PTRACE myapp

# Strace inside container
docker exec mycontainer strace -p 1

# Trace specific syscalls
docker exec mycontainer strace -e openat,read,write -p 1

# Debug with sidecar
docker run --pid=container:myapp --cap-add=SYS_PTRACE \\
    ubuntu strace -p 1

# See network connections
docker exec mycontainer ss -tulpn

# See file descriptors
docker exec mycontainer ls -la /proc/1/fd</pre>
                </div>
            </div>
        `,

        // ========================
        // WINDOWS CONTAINERS
        // ========================
        'windows-containers': `
            <div class="content-card">
                <h2><span class="icon">🪟</span> Windows Containers</h2>
                <p>Run containers with <strong>Windows base images</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">powershell</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Switch Docker to Windows containers
# Right-click Docker Desktop > Switch to Windows containers

# Base images
mcr.microsoft.com/windows/servercore:ltsc2022
mcr.microsoft.com/windows/nanoserver:ltsc2022

# Dockerfile example
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY bin/Release/publish .
ENTRYPOINT ["dotnet", "myapp.dll"]

# Isolation modes
docker run --isolation=process myapp  # Process isolation
docker run --isolation=hyperv myapp   # Hyper-V isolation</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Windows vs Linux</div>
                    <p>Windows containers require Windows host (kernel sharing). Can't run Linux containers on Windows containers mode.</p>
                </div>
            </div>
        `,

        // ========================
        // DOCKER EXTENSIONS
        // ========================
        'docker-extensions': `
            <div class="content-card">
                <h2><span class="icon">🧩</span> Docker Extensions</h2>
                <p>Extend Docker Desktop with <strong>marketplace extensions</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Popular extensions:
# - Disk Usage - visualize space
# - Logs Explorer - search logs
# - Volumes Backup - backup volumes
# - Portainer - web UI
# - Snyk - security scanning

# Install extension via CLI
docker extension install docker/disk-usage-extension

# List installed
docker extension ls

# Remove extension
docker extension rm docker/disk-usage-extension</pre>
                </div>
            </div>
        `,

        // ========================
        // MISCELLANEOUS
        // ========================
        'docker-wait': `
            <div class="content-card">
                <h2><span class="icon">⏳</span> Docker Wait</h2>
                <p>Wait for containers to <strong>stop and get exit code</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Wait for container to exit
docker wait mycontainer
# Returns exit code

# Use in scripts
docker run -d --name test myapp
exit_code=$(docker wait test)
if [ $exit_code -ne 0 ]; then
    echo "Container failed with code $exit_code"
    docker logs test
fi

# Wait for multiple containers
docker wait container1 container2</pre>
                </div>
            </div>
        `,

        'docker-rename': `
            <div class="content-card">
                <h2><span class="icon">📝</span> Docker Rename & Update</h2>
                <p><strong>Rename containers</strong> and update settings on running containers.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Rename container
docker rename old-name new-name

# Update running container
docker update --memory="1g" mycontainer
docker update --cpus="2" mycontainer
docker update --restart=always mycontainer

# Update multiple containers
docker update --memory="512m" container1 container2</pre>
                </div>
            </div>
        `,

        'docker-diff': `
            <div class="content-card">
                <h2><span class="icon">📋</span> Docker Diff</h2>
                <p>See <strong>filesystem changes</strong> in a container.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Show added/changed/deleted files
docker diff mycontainer

# Output:
# A /app/newfile.txt    (Added)
# C /etc/config         (Changed)
# D /tmp/oldfile        (Deleted)

# Use case: Debug what process modified
docker run -d --name test nginx
docker exec test touch /newfile
docker diff test
# A /newfile</pre>
                </div>
            </div>
        `,

        'docker-top': `
            <div class="content-card">
                <h2><span class="icon">📊</span> Docker Top</h2>
                <p>View <strong>running processes</strong> in a container.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># List processes
docker top mycontainer

# With custom ps options
docker top mycontainer aux
docker top mycontainer -eo pid,user,%cpu,%mem,cmd

# Find resource hogs
docker top mycontainer -eo pid,%cpu,%mem --sort=-%cpu</pre>
                </div>
            </div>
        `,

        'docker-pause': `
            <div class="content-card">
                <h2><span class="icon">⏸️</span> Docker Pause/Unpause</h2>
                <p><strong>Freeze container</strong> processes without stopping.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Pause container (freezes all processes)
docker pause mycontainer

# Check paused status
docker inspect -f '{{.State.Paused}}' mycontainer

# Unpause
docker unpause mycontainer

# Use case: Take consistent backup
docker pause db
tar -czf backup.tar.gz /var/lib/docker/volumes/db-data
docker unpause db</pre>
                </div>
            </div>
        `,

        // ========================
        // ADVANCED RUNTIME OPTIONS
        // ========================
        'tmpfs-mounts': `
            <div class="content-card">
                <h2><span class="icon">💨</span> tmpfs Mounts</h2>
                <p>Store data <strong>in memory</strong> for speed and security.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Basic tmpfs mount
docker run --tmpfs /tmp nginx

# With size limit
docker run --tmpfs /tmp:size=100m nginx

# With options
docker run --tmpfs /tmp:rw,noexec,nosuid,size=50m nginx

# Multiple tmpfs
docker run --tmpfs /tmp --tmpfs /run nginx

# In Compose
services:
  app:
    tmpfs:
      - /tmp:size=100m
      - /run</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 When to Use tmpfs</div>
                    <p>Sensitive data (disappears on stop), high-speed temp files, read-only root with writable /tmp.</p>
                </div>
            </div>
        `,

        'shm-size': `
            <div class="content-card">
                <h2><span class="icon">🧠</span> Shared Memory (shm-size)</h2>
                <p>Increase <strong>/dev/shm</strong> for applications that need it.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Default is 64MB
docker run nginx

# Increase to 1GB
docker run --shm-size=1g nginx

# Check current size
docker exec mycontainer df -h /dev/shm

# Common for:
# - Chrome/Chromium (headless browsers)
# - PyTorch DataLoader with workers
# - PostgreSQL
# - Large parallel processing</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Common Error</div>
                    <p>Chrome crashes with "session deleted: tab crashed" = increase --shm-size to 2g!</p>
                </div>
            </div>
        `,

        'ulimits': `
            <div class="content-card">
                <h2><span class="icon">📊</span> ulimits</h2>
                <p>Set <strong>resource limits</strong> per container.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Increase open files limit
docker run --ulimit nofile=65535:65535 nginx

# Set max processes
docker run --ulimit nproc=1024:1024 myapp

# Core dump size
docker run --ulimit core=0 myapp  # Disable core dumps

# Multiple limits
docker run --ulimit nofile=65535:65535 --ulimit nproc=4096:4096 nginx

# Check limits inside container
docker exec mycontainer ulimit -a

# In daemon.json (default for all containers)
{ "default-ulimits": { "nofile": { "Hard": 65535, "Soft": 65535 } } }</pre>
                </div>
            </div>
        `,

        'labels': `
            <div class="content-card">
                <h2><span class="icon">🏷️</span> Docker Labels</h2>
                <p>Add <strong>metadata</strong> to images and containers.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># In Dockerfile
LABEL maintainer="team@company.com"
LABEL version="1.0"
LABEL description="My application"
LABEL org.opencontainers.image.source="https://github.com/user/repo"

# At runtime
docker run --label env=prod --label team=backend nginx

# Filter by labels
docker ps --filter "label=env=prod"
docker images --filter "label=version=1.0"

# Inspect labels
docker inspect -f '{{json .Config.Labels}}' mycontainer | jq</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 OCI Standard Labels</div>
                    <p>Use org.opencontainers.image.* for standardized metadata (source, version, authors).</p>
                </div>
            </div>
        `,

        'docker-history': `
            <div class="content-card">
                <h2><span class="icon">📜</span> Docker History</h2>
                <p>View <strong>image layer history</strong> and commands.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># View image history
docker history nginx

# Full commands (not truncated)
docker history --no-trunc nginx

# Quiet mode (just layer IDs)
docker history -q nginx

# Human readable sizes
docker history --human nginx

# Format output
docker history --format "{{.CreatedBy}}: {{.Size}}" nginx</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Use Case: Security Audit</div>
                    <p>See what commands built an image. Detect if secrets were accidentally included!</p>
                </div>
            </div>
        `,

        // ========================
        // SYSTEM COMMANDS
        // ========================
        'docker-prune': `
            <div class="content-card">
                <h2><span class="icon">🧹</span> Docker Prune Commands</h2>
                <p><strong>Clean up</strong> unused Docker resources.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Remove stopped containers
docker container prune

# Remove dangling images
docker image prune

# Remove unused images (not just dangling)
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove EVERYTHING unused
docker system prune

# Including volumes (destructive!)
docker system prune -a --volumes

# Filter by age
docker image prune -a --filter "until=24h"

# Force (no confirmation)
docker system prune -f</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Production Warning</div>
                    <p>Be careful with --volumes! It deletes data. Schedule prune in cron, monitor disk usage.</p>
                </div>
            </div>
        `,

        'docker-info': `
            <div class="content-card">
                <h2><span class="icon">ℹ️</span> Docker System Info</h2>
                <p>View <strong>Docker daemon configuration</strong> and system info.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Full system info
docker info

# Key fields
docker info --format '{{.ServerVersion}}'
docker info --format '{{.Driver}}'
docker info --format '{{.MemTotal}}'
docker info --format '{{.NCPU}}'

# Container counts
docker info --format 'Running: {{.ContainersRunning}}'
docker info --format 'Stopped: {{.ContainersStopped}}'

# Disk usage
docker system df
docker system df -v  # Verbose</pre>
                </div>
            </div>
        `,

        'docker-version': `
            <div class="content-card">
                <h2><span class="icon">🔢</span> Docker Version</h2>
                <p>Check <strong>client and server versions</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Full version info
docker version

# Client version only
docker version --format '{{.Client.Version}}'

# Server version
docker version --format '{{.Server.Version}}'

# API version
docker version --format '{{.Client.APIVersion}}'

# Short version
docker --version</pre>
                </div>
            </div>
        `,

        // ========================
        // BUILDX ADVANCED
        // ========================
        'buildx-advanced': `
            <div class="content-card">
                <h2><span class="icon">🔨</span> Docker Buildx Advanced</h2>
                <p>Advanced <strong>multi-platform building</strong> with BuildKit.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># List builders
docker buildx ls

# Create new builder
docker buildx create --name mybuilder --driver docker-container

# Use builder
docker buildx use mybuilder

# Bootstrap builder (start container)
docker buildx inspect --bootstrap

# Build with cache export
docker buildx build --cache-to type=local,dest=/tmp/cache \\
                    --cache-from type=local,src=/tmp/cache .

# Build with registry cache
docker buildx build --cache-to type=registry,ref=myrepo/cache \\
                    --cache-from type=registry,ref=myrepo/cache .

# Build multiple images at once (bake)
docker buildx bake -f docker-bake.hcl</pre>
                </div>
            </div>
        `,

        // ========================
        // NETWORKING EXTRAS
        // ========================
        'ipvlan-macvlan': `
            <div class="content-card">
                <h2><span class="icon">🔗</span> ipvlan & macvlan Networks</h2>
                <p>Give containers <strong>direct network access</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># macvlan: Container gets its own MAC address
docker network create -d macvlan \\
    --subnet=192.168.1.0/24 \\
    --gateway=192.168.1.1 \\
    -o parent=eth0 \\
    macvlan_net

docker run --network macvlan_net --ip 192.168.1.100 nginx

# ipvlan L2: Like macvlan but shares MAC
docker network create -d ipvlan \\
    --subnet=192.168.1.0/24 \\
    -o parent=eth0 \\
    -o ipvlan_mode=l2 \\
    ipvlan_net

# ipvlan L3: Router mode
docker network create -d ipvlan \\
    --subnet=192.168.1.0/24 \\
    -o parent=eth0 \\
    -o ipvlan_mode=l3 \\
    ipvlan_l3</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 When to Use</div>
                    <p>macvlan: Container needs to appear as physical device. ipvlan: High performance, works with WiFi.</p>
                </div>
            </div>
        `,

        // ========================
        // STORAGE ADVANCED
        // ========================
        'storage-drivers': `
            <div class="content-card">
                <h2><span class="icon">💽</span> Storage Driver Deep Dive</h2>
                <p>How Docker <strong>stores container layers</strong>.</p>
                
                <div class="table-container">
                    <table>
                        <thead><tr><th>Driver</th><th>Backing FS</th><th>Notes</th></tr></thead>
                        <tbody>
                            <tr><td>overlay2</td><td>xfs, ext4</td><td>Recommended, default on most</td></tr>
                            <tr><td>btrfs</td><td>btrfs</td><td>Native snapshots</td></tr>
                            <tr><td>zfs</td><td>zfs</td><td>Advanced features</td></tr>
                            <tr><td>devicemapper</td><td>direct-lvm</td><td>RHEL/CentOS older</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Check current driver
docker info | grep "Storage Driver"

# Change driver in daemon.json
{ "storage-driver": "overlay2" }

# Check driver options
docker info | grep -A5 "Storage Driver"</pre>
                </div>
            </div>
        `,

        // ========================
        // DOCKERFILE INSTRUCTIONS
        // ========================
        'dockerfile-instructions': `
            <div class="content-card">
                <h2><span class="icon">📝</span> All Dockerfile Instructions</h2>
                <p>Complete reference for <strong>Dockerfile commands</strong>.</p>
                
                <div class="table-container">
                    <table>
                        <thead><tr><th>Instruction</th><th>Purpose</th></tr></thead>
                        <tbody>
                            <tr><td>FROM</td><td>Base image</td></tr>
                            <tr><td>RUN</td><td>Execute command (creates layer)</td></tr>
                            <tr><td>CMD</td><td>Default command (can be overridden)</td></tr>
                            <tr><td>ENTRYPOINT</td><td>Main executable (CMD becomes args)</td></tr>
                            <tr><td>COPY</td><td>Copy files from build context</td></tr>
                            <tr><td>ADD</td><td>Copy + extract archives + URLs</td></tr>
                            <tr><td>WORKDIR</td><td>Set working directory</td></tr>
                            <tr><td>ENV</td><td>Set environment variable</td></tr>
                            <tr><td>ARG</td><td>Build-time variable</td></tr>
                            <tr><td>EXPOSE</td><td>Document ports (no actual mapping)</td></tr>
                            <tr><td>VOLUME</td><td>Create mount point</td></tr>
                            <tr><td>USER</td><td>Set user for subsequent commands</td></tr>
                            <tr><td>LABEL</td><td>Add metadata</td></tr>
                            <tr><td>HEALTHCHECK</td><td>Define health check</td></tr>
                            <tr><td>SHELL</td><td>Change default shell</td></tr>
                            <tr><td>STOPSIGNAL</td><td>Signal to stop container</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,

        'entrypoint-cmd': `
            <div class="content-card">
                <h2><span class="icon">🚀</span> ENTRYPOINT vs CMD</h2>
                <p>Understanding the <strong>difference and combination</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># CMD only - can be fully overridden
CMD ["python", "app.py"]
# docker run myapp      → python app.py
# docker run myapp bash → bash

# ENTRYPOINT only - always runs
ENTRYPOINT ["python", "app.py"]
# docker run myapp       → python app.py
# docker run myapp --debug → python app.py --debug

# Combination (best practice)
ENTRYPOINT ["python"]
CMD ["app.py"]
# docker run myapp         → python app.py
# docker run myapp test.py → python test.py</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Forms</div>
                    <p>Exec form: ["cmd", "arg"] (preferred). Shell form: cmd arg (runs through /bin/sh -c).</p>
                </div>
            </div>
        `,

        'onbuild': `
            <div class="content-card">
                <h2><span class="icon">⚡</span> ONBUILD Instruction</h2>
                <p>Trigger instructions when image is used <strong>as base</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">dockerfile</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Base image Dockerfile
FROM node:18
WORKDIR /app
ONBUILD COPY package*.json ./
ONBUILD RUN npm install
ONBUILD COPY . .
CMD ["npm", "start"]

# Apps using this base just need:
FROM mynode-base
# ONBUILD triggers run automatically!</pre>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Use Case</div>
                    <p>Create standard base images for your org. Enforce patterns across projects.</p>
                </div>
            </div>
        `,

        // ========================
        // ADVANCED SECURITY
        // ========================
        'no-new-privileges': `
            <div class="content-card">
                <h2><span class="icon">🔒</span> no-new-privileges</h2>
                <p>Prevent processes from gaining <strong>new privileges</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Enable no-new-privileges
docker run --security-opt=no-new-privileges myapp

# In Compose
services:
  app:
    security_opt:
      - no-new-privileges:true

# What it prevents:
# - setuid binaries escalating privileges
# - Exploits using execve to gain privileges</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Best Practice</div>
                    <p>Always use in production. Prevents privilege escalation attacks.</p>
                </div>
            </div>
        `,

        'pid-cgroup-ns': `
            <div class="content-card">
                <h2><span class="icon">🔐</span> PID & Cgroup Namespace Modes</h2>
                <p>Control <strong>namespace sharing</strong> between containers.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Share PID namespace with another container
docker run --pid=container:other nginx

# Use host PID namespace (see all host processes)
docker run --pid=host nginx

# Share with host (debugging)
docker run --pid=host --cap-add=SYS_PTRACE ubuntu

# Cgroup namespace modes
docker run --cgroupns=host myapp  # Use host cgroups
docker run --cgroupns=private myapp  # Isolated (default)</pre>
                </div>
            </div>
        `,

        // ========================
        // MISC ADVANCED
        // ========================
        'docker-login': `
            <div class="content-card">
                <h2><span class="icon">🔑</span> Docker Login & Credentials</h2>
                <p>Authenticate with <strong>container registries</strong>.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># Login to Docker Hub
docker login

# Login to other registry
docker login myregistry.com

# Login with credentials (CI/CD)
echo $PASSWORD | docker login -u username --password-stdin

# Logout
docker logout
docker logout myregistry.com

# Credentials stored in
cat ~/.docker/config.json

# Use credential helpers for security
# docker-credential-pass, docker-credential-secretservice</pre>
                </div>
            </div>
        `,

        'docker-system-events': `
            <div class="content-card">
                <h2><span class="icon">📡</span> Docker System Events</h2>
                <p>Monitor <strong>all Docker events</strong> in real-time.</p>
                
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">bash</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre># All events
docker system events

# Filter by type
docker system events --filter type=container
docker system events --filter type=image
docker system events --filter type=network

# JSON format for parsing
docker system events --format '{{json .}}'

# Event types include:
# container: create, start, stop, die, kill, oom
# image: pull, push, delete
# volume: create, destroy
# network: create, connect, disconnect</pre>
                </div>
            </div>
        `,

        'default': `
            <div class="content-card">
                <h2><span class="icon">🚧</span> Coming Soon</h2>
                <p>This topic is under development. Check back soon for expert-level content!</p>
                <div class="real-world-box">
                    <div class="real-world-header">📚 Topics Being Added</div>
                    <ul style="margin-left: 20px; color: var(--text-secondary); line-height: 2;">
                        <li>100+ expert-level Docker topics</li>
                        <li>Real-world scenarios and analogies</li>
                        <li>Interview tips and memory tricks</li>
                        <li>Production debugging guides</li>
                        <li>Interactive labs and exercises</li>
                    </ul>
                </div>
            </div>
        `
    };

    return contents[id] || contents['default'];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('pre').textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = 'rgba(34, 197, 94, 0.2)';

        setTimeout(() => {
            button.textContent = originalText;
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
        const contentId = window.location.hash.substring(1);
        loadContent(contentId);
    }
});

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
const searchData = [
    { id: 'what-is-docker', title: 'What is Docker?', category: 'Fundamentals', icon: '🐳' },
    { id: 'docker-architecture', title: 'Docker Architecture', category: 'Fundamentals', icon: '🏗️' },
    { id: 'docker-engine', title: 'dockerd, containerd, runc', category: 'Internals', icon: '⚙️' },
    { id: 'docker-run-internals', title: 'How docker run Works', category: 'Internals', icon: '🔄' },
    { id: 'namespaces', title: 'Namespaces', category: 'Containers', icon: '📦' },
    { id: 'cgroups', title: 'Cgroups', category: 'Containers', icon: '⚡' },
    { id: 'dockerfile', title: 'Dockerfile Deep Dive', category: 'Images', icon: '📝' },
    { id: 'multistage', title: 'Multi-stage Builds', category: 'Images', icon: '🏗️' },
    { id: 'volumes-vs-binds', title: 'Volumes vs Bind Mounts', category: 'Storage', icon: '💾' },
    { id: 'dns-internals', title: 'DNS Internals', category: 'Networking', icon: '🌐' },
    { id: 'compose-basics', title: 'Docker Compose', category: 'Compose', icon: '🔧' },
    { id: 'swarm-architecture', title: 'Swarm Architecture', category: 'Swarm', icon: '🐝' },
    { id: 'seccomp-authoring', title: 'Seccomp Authoring', category: 'Security', icon: '🔒' },
    { id: 'dind', title: 'Docker-in-Docker', category: 'CI/CD', icon: '🚀' },
    { id: 'disk-full', title: 'Disk Full Outages', category: 'Troubleshooting', icon: '🔥' }
];

function openSearch() {
    // Create search modal
    const modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.innerHTML = `
        <div class="search-backdrop" onclick="closeSearch()"></div>
        <div class="search-container">
            <input type="text" id="search-input" placeholder="Search topics..." oninput="handleSearch(event)" autofocus>
            <div id="search-results"></div>
        </div>
    `;
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding-top:100px;';
    document.body.appendChild(modal);
    document.getElementById('search-input').focus();
}

function closeSearch() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.remove();
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const results = searchData.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );

    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = results.slice(0, 8).map(item => `
        <div class="search-result-item" onclick="selectSearchResult('${item.id}')" style="padding:12px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:10px;">
            <span>${item.icon}</span>
            <div>
                <div style="color:var(--text-primary);">${item.title}</div>
                <div style="color:var(--text-secondary);font-size:0.8em;">${item.category}</div>
            </div>
        </div>
        `).join('');
}

function selectSearchResult(id) {
    closeSearch();
    loadContent(id);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const target = e.target;
    const isEditable = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
    );

    if (!isEditable && (e.key === '/' || e.code === 'Slash') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openSearch();
    }

    if (e.key === 'Escape') {
        closeSearch();
    }
});
// Cache bust 1767736432
