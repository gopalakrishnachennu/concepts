/**
 * Terraform Deep Dive - Application Logic
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

    // Scroll to top
    window.scrollTo(0, 0);

    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function copyCode(btn) {
    const codeBlock = btn.parentElement.nextElementSibling;
    navigator.clipboard.writeText(codeBlock.textContent.trim());

    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

function openSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) {
        initSearch(); // Initialize if not present
        return;
    }
    overlay.style.display = 'flex';
    const input = document.getElementById('search-input');
    input.value = '';
    input.focus();
    performSearch(); // Clear previous results
}

function closeSearch() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) overlay.style.display = 'none';
}

function initSearch() {
    // Inject HTML
    if (!document.getElementById('search-overlay')) {
        const searchHTML = `
            <div id="search-overlay" class="search-overlay" onclick="if(event.target === this) closeSearch()">
                <div class="search-box">
                    <div class="search-header">
                        <h3>Search Terraform Docs</h3>
                        <button class="close-search" onclick="closeSearch()">×</button>
                    </div>
                    <input type="text" id="search-input" class="search-input" placeholder="Type to search..." onkeyup="performSearch()">
                    <div id="search-results" class="search-results"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', searchHTML);

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });
    }
    openSearch();
}

function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (query.length < 2) {
        resultsContainer.innerHTML = '<div style="padding:15px;color:#888;">Type at least 2 characters...</div>';
        return;
    }

    const allData = getContent('ALL_CONTENT');
    let matchCount = 0;

    for (const [key, content] of Object.entries(allData)) {
        // Strip HTML tags for cleaner searching
        const textContent = content.replace(/<[^>]*>/g, ' ');
        const index = textContent.toLowerCase().indexOf(query);

        if (index !== -1) {
            matchCount++;
            // Extract snippet
            const start = Math.max(0, index - 40);
            const end = Math.min(textContent.length, index + 60);
            let snippet = textContent.substring(start, end);

            // Highlight query
            const regex = new RegExp(`(${query})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');

            // Get Title from HTML content (h2)
            const titleMatch = content.match(/<h2>(.*?)<\/h2>/);
            const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : key;

            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <h4>${title}</h4>
                <p>...${snippet}...</p>
            `;
            div.onclick = () => {
                loadContent(key);
                closeSearch();
            };
            resultsContainer.appendChild(div);
        }
    }

    if (matchCount === 0) {
        resultsContainer.innerHTML = '<div style="padding:15px;color:#888;">No results found.</div>';
    }
}

// ============================================
// CONTENT DEFINITIONS
// ============================================
function getContent(id) {
    const contents = {
        // ========================
        // 1. IaC Fundamentals
        // ========================
        'iac': `
            <div class="content-card">
                <h2><span class="icon">🏗️</span> Infrastructure as Code (IaC) Fundamentals</h2>
                <p>Before writing a single line of Terraform, you must understand the philosophy behind it. IaC transforms manual infrastructure tasks into software engineering practices.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Technical Deep Dive</div>
                    <p><strong>Infrastructure as Code (IaC)</strong> creates and manages infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools.</p>
                    <p>The core philosophy is simple: Treat your infrastructure like application code. Version it, test it, review it, and deploy it securely.</p>
                </div>

                <h3>Key Concepts</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">📜</span>
                        <div class="name">Declarative</div>
                        <div class="desc">You say "WHAT" you want (3 servers), not "HOW" to build them.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔁</span>
                        <div class="name">Idempotency</div>
                        <div class="desc">Running the same code 100 times produces the same result.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🧊</span>
                        <div class="name">Immutable</div>
                        <div class="desc">Don't patch servers; replace them with new images.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📉</span>
                        <div class="name">Drift Detection</div>
                        <div class="desc">Noticing when reality doesn't match your code.</div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚖️ Declarative vs. Imperative</div>
                    <p>This is the most important distinction in IaC tools.</p>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Imperative (Ansible/Bash)</th>
                                    <th>Declarative (Terraform)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Philosophy</strong></td>
                                    <td>Focus on the <em>process</em> (How)</td>
                                    <td>Focus on the <em>result</em> (What)</td>
                                </tr>
                                <tr>
                                    <td><strong>Example</strong></td>
                                    <td>"Go to the store, buy milk, bring it home"</td>
                                    <td>"I want a gallon of milk in the fridge"</td>
                                </tr>
                                <tr>
                                    <td><strong>Code Length</strong></td>
                                    <td>Gets longer as complexity grows</td>
                                    <td>Stays concise; describes final state</td>
                                </tr>
                                <tr>
                                    <td><strong>Drift</strong></td>
                                    <td>Hard to detect</td>
                                    <td>Built-in detection (\`terraform plan\`)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <h3>Immutable Infrastructure Pattern</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ The Snowflake vs. Phoenix Server</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
<span class="error">ANTI-PATTERN: Mutable (Snowflake)</span>        <span class="success">PATTERN: Immutable (Phoenix)</span>

Server v1 (Created Jan 1)             Server v1 (Created Jan 1)
   │                                     │
   ▼                                     ▼
Patch applied (Feb 1)                 <span class="success">DESTROYED!</span>
   │
   ▼                                  Server v2 (Created Feb 1)
Config changed manually (Mar 1)          │
   │                                     ▼
   ▼                                  <span class="success">DESTROYED!</span>
Library updated (Apr 1)
   │                                  Server v3 (Created Apr 1)
   ▼
<span class="error">RESULT: Unique "Snowflake"</span>            <span class="success">RESULT: Predictable State</span>
(Nobody knows exact state)            (Exact match to code)
                        </div>
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Question:</strong> "What is config drift and how does Terraform handle it?"<br>
                    <strong>Answer:</strong> Drift is when the actual infrastructure state differs from the code definition (e.g., someone manually deleted a security group rule). Terraform handles this by comparing the <strong>Core State file</strong> against the <strong>Real World</strong> during the \`plan\` phase, and proposes changes to fix the drift.</p>
                </div>

                <div class="real-world-box">
                    <div class="real-world-header">🌍 Real-World Scenario: The 3 AM Outage</div>
                    <p><strong>Scenario:</strong> A critical server crashes at 3 AM. </p>
                    <p><strong>Without IaC:</strong> You wake up, log into AWS console, try to remember instance size, security groups, and user data. You miss one detail. The app stays down.</p>
                    <p><strong>With Terraform:</strong> You run \`terraform apply\`. The exact same server (same IP, same config, same storage) is spun up in 2 minutes. You go back to sleep.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 IaC Maturity Levels</div>
                    <div class="ascii-diagram">
                        <div class="ascii-diagram-title">From Manual to Automated</div>
                        <div class="ascii-content">
Level 0: ClickOps (console only)
Level 1: Scripts (bash/cli automation)
Level 2: IaC (Terraform state + plan)
Level 3: IaC + Tests (policy + validation)
Level 4: GitOps (PRs, approvals, drift monitoring)
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔁 The Core Terraform Phases</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
init  -> download providers, set backend
plan  -> show changes (diff: desired vs known vs actual)
apply -> execute changes in safe order
destroy -> teardown infrastructure
                        </div>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Always plan first:</strong> Treat plan like a deployment diff review.</li>
                        <li><strong>Commit lock files:</strong> <code>.terraform.lock.hcl</code> makes provider versions reproducible.</li>
                        <li><strong>Automate drift checks:</strong> Scheduled <code>plan -refresh-only</code> catches manual changes.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 IaC Practices That Scale</div>
                    <div class="component-grid">
                        <div class="component-box">
                            <span class="icon">🧪</span>
                            <div class="name">Pre-merge checks</div>
                            <div class="desc">Automated format, validate, lint, and security scans on every PR.</div>
                        </div>
                        <div class="component-box">
                            <span class="icon">🧾</span>
                            <div class="name">Change review</div>
                            <div class="desc">Plan output is treated like a code diff and requires human approval.</div>
                        </div>
                        <div class="component-box">
                            <span class="icon">🔐</span>
                            <div class="name">Secrets policy</div>
                            <div class="desc">Secrets stay in vaults, never in code or tfvars in Git.</div>
                        </div>
                        <div class="component-box">
                            <span class="icon">🧯</span>
                            <div class="name">Rollbacks</div>
                            <div class="desc">State versioning and release tags make rollbacks practical.</div>
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📊 Infrastructure Drift Workflow</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
1) Scheduled plan -refresh-only
2) Drift detected -> open ticket
3) Decide: fix in code or accept real-world change
4) Apply from code to reconcile
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Terraform CLI Cheat Sheet</div>
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Command</th>
                                    <th>Purpose</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>terraform init</code></td>
                                    <td>Initialize backend + providers</td>
                                    <td>Run after adding providers/modules</td>
                                </tr>
                                <tr>
                                    <td><code>terraform fmt</code></td>
                                    <td>Format HCL</td>
                                    <td>Standardizes style, avoid noisy diffs</td>
                                </tr>
                                <tr>
                                    <td><code>terraform validate</code></td>
                                    <td>Schema + syntax checks</td>
                                    <td>No API calls made</td>
                                </tr>
                                <tr>
                                    <td><code>terraform plan</code></td>
                                    <td>Show changes</td>
                                    <td>Use <code>-out</code> to save plan</td>
                                </tr>
                                <tr>
                                    <td><code>terraform apply</code></td>
                                    <td>Apply changes</td>
                                    <td>Prefer <code>apply tfplan</code></td>
                                </tr>
                                <tr>
                                    <td><code>terraform destroy</code></td>
                                    <td>Delete resources</td>
                                    <td>Use with caution</td>
                                </tr>
                                <tr>
                                    <td><code>terraform plan -refresh-only</code></td>
                                    <td>Detect drift</td>
                                    <td>Safe: no changes proposed</td>
                                </tr>
                                <tr>
                                    <td><code>terraform graph</code></td>
                                    <td>Dependency graph</td>
                                    <td>Pipe to <code>dot</code></td>
                                </tr>
                                <tr>
                                    <td><code>terraform console</code></td>
                                    <td>Evaluate expressions</td>
                                    <td>Great for debugging locals</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🗂️ Recommended Project Layout</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
terraform/
├── versions.tf
├── backend.tf
├── variables.tf
├── main.tf
├── outputs.tf
└── modules/
    ├── network/
    ├── compute/
    └── database/
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ Preflight Checklist</div>
                    <ul>
                        <li><strong>Format:</strong> <code>terraform fmt -recursive</code></li>
                        <li><strong>Validate:</strong> <code>terraform validate</code></li>
                        <li><strong>Policy:</strong> OPA/Sentinel checks pass</li>
                        <li><strong>Plan:</strong> Reviewed by a human</li>
                        <li><strong>State:</strong> Locked and versioned</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📘 CLI Reference (Core)</div>
                    <div class="code-block">
                        <pre># Initialization
terraform init
terraform init -upgrade
terraform init -reconfigure

# Formatting and validation
terraform fmt
terraform fmt -recursive
terraform validate

# Planning
terraform plan
terraform plan -out=tfplan
terraform plan -refresh-only
terraform plan -var="env=prod"
terraform plan -var-file="prod.tfvars"

# Apply
terraform apply
terraform apply tfplan
terraform apply -auto-approve

# Destroy
terraform destroy
terraform destroy -target=aws_instance.web

# State commands
terraform state list
terraform state show aws_instance.web
terraform state mv aws_instance.old aws_instance.new
terraform state rm aws_security_group.web
terraform state pull
terraform state push

# Import
terraform import aws_s3_bucket.data my-bucket

# Workspaces
terraform workspace list
terraform workspace new dev
terraform workspace select prod
terraform workspace delete dev

# Graph
terraform graph | dot -Tsvg > graph.svg

# Console
terraform console

# Providers
terraform providers
terraform providers schema -json

# Output
terraform output
terraform output -json
terraform output -raw vpc_id

# Tests
terraform test

# Debugging
export TF_LOG=DEBUG
export TF_LOG_PATH=./terraform.log
export TF_LOG_CORE=INFO
export TF_LOG_PROVIDER=DEBUG</pre>
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Core Interview Pack</div>
                    <p><strong>Q:</strong> "What is Terraform's primary job?"<br>
                    <strong>A:</strong> Reconcile real infrastructure to match desired configuration.</p>
                    <p><strong>Q:</strong> "Why use IaC instead of console?"<br>
                    <strong>A:</strong> Repeatability, reviewability, and automation.</p>
                    <p><strong>Q:</strong> "What is idempotency?"<br>
                    <strong>A:</strong> Same input yields same final state.</p>
                    <p><strong>Q:</strong> "What is drift?"<br>
                    <strong>A:</strong> Real infrastructure differs from code/state.</p>
                    <p><strong>Q:</strong> "Why use plan files?"<br>
                    <strong>A:</strong> Ensure apply uses reviewed changes.</p>
                    <p><strong>Q:</strong> "What does init do?"<br>
                    <strong>A:</strong> Sets up backend, downloads providers/modules.</p>
                    <p><strong>Q:</strong> "Can you use variables in backend?"<br>
                    <strong>A:</strong> No, backend config is static.</p>
                    <p><strong>Q:</strong> "Where do providers live?"<br>
                    <strong>A:</strong> <code>.terraform/providers</code> cache.</p>
                    <p><strong>Q:</strong> "What is the graph?"<br>
                    <strong>A:</strong> Dependency DAG for resource ordering.</p>
                    <p><strong>Q:</strong> "What is state?"<br>
                    <strong>A:</strong> Terraform's memory of managed resources.</p>
                    <p><strong>Q:</strong> "Why not commit state?"<br>
                    <strong>A:</strong> Secrets and conflicts.</p>
                    <p><strong>Q:</strong> "How to detect drift safely?"<br>
                    <strong>A:</strong> <code>terraform plan -refresh-only</code>.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📌 Best Practices Catalog</div>
                    <ul>
                        <li><strong>Pin versions:</strong> Terraform core and providers.</li>
                        <li><strong>Use remote state:</strong> With locking and versioning.</li>
                        <li><strong>Prefer for_each:</strong> For identity-based resources.</li>
                        <li><strong>Review plans:</strong> Treat as code changes.</li>
                        <li><strong>Keep modules small:</strong> Composable over monolithic.</li>
                        <li><strong>Use consistent tagging:</strong> default_tags or locals.</li>
                        <li><strong>Separate environments:</strong> Distinct state and accounts.</li>
                        <li><strong>Automate drift checks:</strong> Scheduled refresh-only plans.</li>
                        <li><strong>Limit -target:</strong> Emergency use only.</li>
                        <li><strong>Document modules:</strong> Inputs/outputs and examples.</li>
                        <li><strong>Enable encryption:</strong> State and storage.</li>
                        <li><strong>Use least privilege:</strong> IAM roles for Terraform.</li>
                        <li><strong>Store secrets safely:</strong> Vault or secret manager.</li>
                        <li><strong>Plan in CI:</strong> Apply on merge only.</li>
                        <li><strong>Use policy checks:</strong> OPA/Sentinel gates.</li>
                        <li><strong>Reduce blast radius:</strong> Split state by domain.</li>
                        <li><strong>Monitor logs:</strong> Keep plan/apply logs.</li>
                        <li><strong>Back up state:</strong> Versioning and snapshots.</li>
                        <li><strong>Use templatefile:</strong> For user_data templating.</li>
                        <li><strong>Keep tfvars out of Git:</strong> Use env vars or secret store.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Minimal Stack Example</div>
                    <div class="code-block">
                        <pre>terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "main" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami           = "ami-123456"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
}

output "web_ip" {
  value = aws_instance.web.public_ip
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 2. Core Architecture
        // ========================
        'architecture': `
            <div class="content-card">
                <h2><span class="icon">🏗️</span> Terraform Core Architecture</h2>
                <p>Terraform isn't magic; it's a Go binary with a specific architecture. Understanding how the CLI communicates with cloud providers is key to debugging.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 How It Works</div>
                    <p>Terraform is a <strong>plugin-based</strong> system. The \`terraform\` binary (Core) doesn't know how to create an AWS EC2 instance. It only knows how to manage state and calculate diffs. It delegates the actual API calls to <strong>Provider Plugins</strong>.</p>
                </div>

                <h3>The Core Components</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🧠</span>
                        <div class="name">Terraform Core</div>
                        <div class="desc">Reads config, manages state, creates the Resource Graph (DAG).</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔌</span>
                        <div class="name">Providers</div>
                        <div class="desc">Go binaries (plugins) that talk to APIs (AWS, Azure, Google).</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📉</span>
                        <div class="name">Plan File</div>
                        <div class="desc">A binary artifact detailing exactly what will change.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">☁️</span>
                        <div class="name">Upstream APIs</div>
                        <div class="desc">The actual target platform endpoints (e.g., AWS API).</div>
                    </div>
                </div>

                <h3>The Workflow Internals</h3>
                <div class="animation-container">
                    <div class="animation-title">▶ Terraform Execution Flow</div>
                    <div class="flow-container">
                        <div class="flow-step"><span>📝</span> Write Config (*.tf)</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>📦</span> Init: Download Providers</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🔍</span> Plan: Core builds Graph + diffs State</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>🚀</span> Apply: Core tells Provider "Create X"</div>
                        <div class="flow-arrow">↓</div>
                        <div class="flow-step"><span>☁️</span> Provider calls AWS API</div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧬 The Dependency Graph (DAG)</div>
                    <p>Terraform builds a <strong>Directed Acyclic Graph (DAG)</strong> to determine operation order. If Resource B refers to Resource A, A must be built first.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
[vpc] <-- (explicit dependency) -- [subnet] <-- [instance]
  ▲                                                │
  └────────────────────────────────────────────────┘
           (implicit dependency via interpolation)

1. VPC is root node (no deps) -> Created FIRST
2. Subnet depends on VPC      -> Created SECOND
3. Instance depends on Subnet -> Created THIRD
                        </div>
                    </div>
                    <p><strong>Parallelism:</strong> Any nodes in the graph that don't depend on each other are walked in parallel! Use \`-parallelism=n\` to control this.</p>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Question:</strong> "Where does Terraform installed plugins live?"<br>
                    <strong>Answer:</strong> In the \`.terraform/providers\` directory within your project (initialized during \`terraform init\`). They are separate binaries that Terraform Core starts via RPC.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔬 Plugin RPC Boundary</div>
                    <p>Terraform Core communicates with providers via a plugin protocol over RPC. This clean boundary is why providers can be updated independently.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-diagram-title">Core ↔ Provider Communication</div>
                        <div class="ascii-content">
Terraform Core
   |
   |  RPC (plugin protocol)
   v
Provider Binary (aws, azurerm, gcp)
   |
   v
Cloud API (AWS/Azure/GCP)
                        </div>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Check provider schemas:</strong> Use <code>terraform providers schema -json</code> for debugging.</li>
                        <li><strong>Use <code>TF_CLI_CONFIG_FILE</code>:</strong> Centralize provider cache settings.</li>
                        <li><strong>Pin Terraform Core:</strong> Production pipelines should lock the CLI version.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧠 Internal Files Terraform Uses</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
.terraform/                -> provider plugins, module cache
terraform.tfstate          -> current state (local backend)
.terraform.lock.hcl        -> provider version locks
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧮 Plan File Anatomy (Conceptual)</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
plan:
  add:     resources to create
  change:  in-place updates
  delete:  resources to destroy
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧠 Init / Plan / Apply Internals</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
INIT:
  1) Read backend config
  2) Download providers
  3) Load module sources

PLAN:
  1) Load config
  2) Read state
  3) Refresh real-world (if enabled)
  4) Build diff
  5) Show proposed actions

APPLY:
  1) Acquire lock
  2) Execute graph in order
  3) Persist new state
  4) Release lock
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔍 Graph Walk Strategy</div>
                    <p>Terraform walks the DAG in parallel where possible, but never violates dependencies.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
vpc
├── subnet_a ──┐
├── subnet_b ──┼──> instances (parallel)
└── subnet_c ──┘
                        </div>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 3. Providers
        // ========================
        'providers': `
            <div class="content-card">
                <h2><span class="icon">🔌</span> Providers Deep Dive</h2>
                <p>Providers are <strong>plugins</strong> that translate Terraform's generic resource language into specific API calls. Without providers, Terraform is just a state management engine with no knowledge of any cloud platform.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 What Exactly IS a Provider?</div>
                    <p>A Provider is a <strong>separate Go binary</strong> that Terraform Core downloads and executes. It implements:</p>
                    <ul>
                        <li><strong>Resource Types:</strong> What can be created (e.g., aws_instance, aws_s3_bucket)</li>
                        <li><strong>Data Sources:</strong> What can be read (e.g., aws_ami, aws_vpc)</li>
                        <li><strong>Authentication:</strong> How to connect to the API</li>
                        <li><strong>CRUD Operations:</strong> Create, Read, Update, Delete logic for each resource</li>
                    </ul>
                </div>

                <h3>Provider Architecture</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">How Providers Fit Into Terraform</div>
                    <div class="ascii-content">
┌────────────────────────────────────────────────────────────────┐
│                      TERRAFORM CORE                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     Your Configuration Files (*.tf)                       │  │
│  │     - main.tf, variables.tf, outputs.tf                   │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │ Parses HCL                          │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │          Dependency Graph (DAG) Builder                   │  │
│  │     Orders resources based on dependencies                │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │ For each resource...               │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │             State Manager (terraform.tfstate)             │  │
│  │     Compares Desired State vs Current State               │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────┼────────────────────────────────────┘
                            │ gRPC / RPC calls
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  AWS Provider │   │ Azure Provider│   │  GCP Provider │
│  (Go Binary)  │   │  (Go Binary)  │   │  (Go Binary)  │
│               │   │               │   │               │
│ - aws_instance│   │ - azurerm_vm  │   │ - google_*    │
│ - aws_s3_*    │   │ - azurerm_*   │   │               │
│ - aws_vpc     │   │               │   │               │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
   AWS REST API       Azure REST API      GCP REST API
                    </div>
                </div>

                <h3>Provider Configuration</h3>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">versions.tf (Best Practice)</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>terraform {
  required_version = ">= 1.5.0"  # Pin Terraform version too!
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"   # Registry path
      version = "~> 5.0"          # Version constraint
    }
  }
}

provider "aws" {
  region = "us-east-1"
  
  # Best Practice: Apply default tags to ALL resources
  default_tags {
    tags = {
      Environment = "Production"
      ManagedBy   = "Terraform"
      Project     = "MyApp"
    }
  }
}</pre>
                </div>

                <h3>Version Constraints Explained</h3>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Constraint</th>
                                <th>Meaning</th>
                                <th>Example Matches</th>
                                <th>Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>= 5.0.0</code></td>
                                <td>Exact version only</td>
                                <td>5.0.0</td>
                                <td>Maximum stability (rare)</td>
                            </tr>
                            <tr>
                                <td><code>~> 5.0</code></td>
                                <td>Any 5.x version</td>
                                <td>5.0, 5.1, 5.99</td>
                                <td><strong>Recommended</strong> for most cases</td>
                            </tr>
                            <tr>
                                <td><code>~> 5.0.0</code></td>
                                <td>Any 5.0.x patch</td>
                                <td>5.0.0, 5.0.1, 5.0.99</td>
                                <td>Very conservative</td>
                            </tr>
                            <tr>
                                <td><code>>= 5.0, < 6.0</code></td>
                                <td>Range constraint</td>
                                <td>5.0 to 5.99.99</td>
                                <td>Same as ~> but explicit</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Authentication Methods (AWS)</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">AWS Provider Authentication Order</div>
                    <div class="ascii-content">
Terraform checks these in ORDER (first match wins):

┌─────────────────────────────────────────────────────────────────┐
│  1. HARDCODED in provider block (NEVER DO THIS!)                │
│     provider "aws" { access_key = "xxx" secret_key = "yyy" }    │
│     ⚠️  DANGER: Secrets in code = Security breach               │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Not found? Try next...
┌──────────────────────────────▼──────────────────────────────────┐
│  2. ENVIRONMENT VARIABLES (Good for CI/CD)                      │
│     export AWS_ACCESS_KEY_ID="AKIA..."                          │
│     export AWS_SECRET_ACCESS_KEY="..."                          │
│     export AWS_REGION="us-east-1"                               │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Not found? Try next...
┌──────────────────────────────▼──────────────────────────────────┐
│  3. SHARED CREDENTIALS FILE (~/.aws/credentials)                │
│     [default]                                                   │
│     aws_access_key_id = AKIA...                                 │
│     aws_secret_access_key = ...                                 │
│     ✅ Good for local development                               │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Not found? Try next...
┌──────────────────────────────▼──────────────────────────────────┐
│  4. IAM ROLE (Best for EC2/ECS/Lambda)                          │
│     Instance Metadata Service (IMDS) provides credentials       │
│     ✅ BEST PRACTICE: No secrets to manage!                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Not found? Try next...
┌──────────────────────────────▼──────────────────────────────────┐
│  5. WEB IDENTITY (OIDC) - Best for GitHub Actions / K8s         │
│     Assumes IAM Role using JWT token                            │
│     ✅ ZERO secrets - Uses identity federation                  │
└─────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🌍 Multi-Region / Multi-Account Pattern</div>
                    <p>Use <strong>aliases</strong> to manage resources in multiple regions or accounts simultaneously.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
Single Terraform Run Managing Multiple Regions:

┌─────────────────────────────────────────────────────────────────┐
│                    Your Terraform Code                          │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │ provider "aws" {    │    │ provider "aws" {    │            │
│  │   region = "east"   │    │   alias  = "west"   │            │
│  │ }                   │    │   region = "west-2" │            │
│  │ (DEFAULT)           │    │ }                   │            │
│  └──────────┬──────────┘    └──────────┬──────────┘            │
└─────────────┼──────────────────────────┼────────────────────────┘
              │                          │
              ▼                          ▼
      ┌───────────────┐          ┌───────────────┐
      │  us-east-1    │          │  us-west-2    │
      │ ┌───────────┐ │          │ ┌───────────┐ │
      │ │ S3 Bucket │ │          │ │ S3 Bucket │ │
      │ │ (Primary) │ │  ──────► │ │ (Backup)  │ │
      │ └───────────┘ │ Replicate│ └───────────┘ │
      └───────────────┘          └───────────────┘
                        </div>
                    </div>
                    <div class="code-block">
                        <div class="code-header">
                            <span class="code-lang">multi-region.tf</span>
                            <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                        </div>
                        <pre>provider "aws" {
  region = "us-east-1"  # Default provider (no alias)
}

provider "aws" {
  alias  = "west"       # Named alias
  region = "us-west-2"
}

provider "aws" {
  alias  = "eu"
  region = "eu-west-1"
}

# Use default provider (implicit)
resource "aws_s3_bucket" "primary" {
  bucket = "my-app-primary"
}

# Explicitly select aliased provider
resource "aws_s3_bucket" "backup" {
  provider = aws.west  # ◄── Select by alias
  bucket   = "my-app-backup"
}

resource "aws_s3_bucket" "eu_data" {
  provider = aws.eu
  bucket   = "my-app-eu-data"
}</pre>
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Questions</div>
                    <p><strong>Q1:</strong> "Where does Terraform download providers to?"<br>
                    <strong>A:</strong> The <code>.terraform/providers/</code> directory in your working folder, created during <code>terraform init</code>.</p>
                    
                    <p><strong>Q2:</strong> "What's the difference between source and version in required_providers?"<br>
                    <strong>A:</strong> <code>source</code> tells Terraform WHERE to find the provider (registry path like hashicorp/aws). <code>version</code> specifies WHICH version to download.</p>
                    
                    <p><strong>Q3:</strong> "How do you run Terraform against multiple AWS accounts?"<br>
                    <strong>A:</strong> Use provider aliases with different <code>assume_role</code> blocks, or configure each alias with separate credentials.</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Key Takeaways</div>
                    <ul>
                        <li><strong>Always pin versions</strong> - Breaking changes in providers are common</li>
                        <li><strong>Never hardcode credentials</strong> - Use IAM roles or environment variables</li>
                        <li><strong>Use default_tags</strong> - Apply consistent tagging across all resources</li>
                        <li><strong>Lock file matters</strong> - Commit <code>.terraform.lock.hcl</code> to Git</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧱 Provider CRUD Lifecycle</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
Create -> Read -> Update -> Delete
  ^                     |
  |---------------------|
Terraform re-reads after change to confirm state
                        </div>
                    </div>
                    <p>Providers implement CRUD. If the <strong>Read</strong> step fails, Terraform may think the resource is gone and try to recreate it.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use timeouts:</strong> Many resources support <code>timeouts</code> blocks for slow APIs.</li>
                        <li><strong>Enable retries:</strong> Providers retry transient errors automatically.</li>
                        <li><strong>Upgrade carefully:</strong> Always run a plan after bumping provider versions.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Provider Lock File</div>
                    <p>The lock file records the exact provider versions used in your environment so CI and teammates get the same binaries.</p>
                    <div class="code-block">
                        <pre># Update provider selections
terraform init -upgrade</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📦 Provider Cache Strategy</div>
                    <p>Use a plugin cache to avoid repeated downloads in CI.</p>
                    <div class="code-block">
                        <pre># ~/.terraformrc
plugin_cache_dir = "$HOME/.terraform.d/plugin-cache"</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Provider Upgrade Checklist</div>
                    <ul>
                        <li><strong>Read changelog:</strong> Breaking changes are common across major versions.</li>
                        <li><strong>Update constraints:</strong> Bump version in <code>required_providers</code>.</li>
                        <li><strong>Re-init:</strong> Run <code>terraform init -upgrade</code>.</li>
                        <li><strong>Plan:</strong> Review for drift or replacement actions.</li>
                        <li><strong>Apply in lower env:</strong> Validate before production.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Provider Mirrors (Enterprise)</div>
                    <p>Use a provider mirror to control binaries and avoid external downloads.</p>
                    <div class="code-block">
                        <pre>provider_installation {
  filesystem_mirror {
    path    = "/opt/terraform/providers"
    include = ["hashicorp/*"]
  }
  direct {
    exclude = ["hashicorp/*"]
  }
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 4. Resources
        // ========================
        'resources': `
            <div class="content-card">
                <h2><span class="icon">🧱</span> Resources Deep Dive</h2>
                <p>Resources are the <strong>heart of Terraform</strong>. Each resource block describes one piece of infrastructure to create, modify, or manage.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Anatomy of a Resource Block</div>
                    <p>Every resource follows a precise syntax. Understanding each part is critical.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
resource "aws_instance" "web" {
    │         │          │
    │         │          └─── LOCAL NAME (your reference)
    │         │               - Used in interpolations: aws_instance.web.id
    │         │               - Must be unique within module
    │         │
    │         └────────────── RESOURCE TYPE (defined by provider)
    │                         - Prefix = provider (aws_)
    │                         - Suffix = resource (instance)
    │
    └──────────────────────── KEYWORD (always "resource")


  ami           = "ami-0123456789abcdef0"  ──► ARGUMENT
  instance_type = "t3.micro"               ──► ARGUMENT

  tags = {                                 ──► BLOCK ARGUMENT
    Name = "WebServer"
  }
}
                        </div>
                    </div>
                </div>

                <h3>Resource Lifecycle Flowchart</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">What Happens When You Run "terraform apply"?</div>
                    <div class="ascii-content">
                        ┌─────────────────────┐
                        │   terraform apply   │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │ Read Current State  │
                        │ (terraform.tfstate) │
                        └──────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
    ┌─────────▼─────────┐ ┌───────▼───────┐ ┌─────────▼─────────┐
    │ Resource in Code  │ │Resource in Code│ │ Resource ONLY in │
    │ NOT in State      │ │ AND in State   │ │ State (removed   │
    │                   │ │                │ │ from code)       │
    └─────────┬─────────┘ └───────┬───────┘ └─────────┬─────────┘
              │                   │                   │
              ▼                   ▼                   ▼
         ┌─────────┐      ┌──────────────┐      ┌──────────┐
         │ CREATE  │      │   COMPARE    │      │ DESTROY  │
         │  (new)  │      │ Desired vs   │      │ (remove) │
         └─────────┘      │ Current      │      └──────────┘
                          └──────┬───────┘
                                 │
               ┌─────────────────┼─────────────────┐
               │                 │                 │
         ┌─────▼─────┐    ┌──────▼──────┐   ┌─────▼─────┐
         │ NO DIFF   │    │   UPDATE    │   │  REPLACE  │
         │ (no-op)   │    │  (in-place) │   │ (destroy  │
         └───────────┘    └─────────────┘   │ + create) │
                                            └───────────┘
                                                  │
                                  ┌───────────────┴───────────────┐
                                  │ Triggered by "ForceNew" args  │
                                  │ e.g., AMI, subnet_id, AZ      │
                                  └───────────────────────────────┘
                    </div>
                </div>

                <h3>Resource Meta-Arguments</h3>
                <p>These special arguments work with <strong>ALL</strong> resource types:</p>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Meta-Argument</th>
                                <th>Purpose</th>
                                <th>Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>depends_on</code></td>
                                <td>Explicit dependency (when implicit isn't enough)</td>
                                <td><code>depends_on = [aws_iam_role.app]</code></td>
                            </tr>
                            <tr>
                                <td><code>count</code></td>
                                <td>Create multiple copies (indexed 0, 1, 2...)</td>
                                <td><code>count = 3</code> → .web[0], .web[1], .web[2]</td>
                            </tr>
                            <tr>
                                <td><code>for_each</code></td>
                                <td>Create from set/map (keyed by value)</td>
                                <td><code>for_each = toset(["a","b"])</code></td>
                            </tr>
                            <tr>
                                <td><code>provider</code></td>
                                <td>Select non-default provider alias</td>
                                <td><code>provider = aws.west</code></td>
                            </tr>
                            <tr>
                                <td><code>lifecycle</code></td>
                                <td>Control create/destroy behavior</td>
                                <td><code>lifecycle { prevent_destroy = true }</code></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>count vs for_each</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">When to Use Which?</div>
                    <div class="ascii-content">
┌─────────────────────────────────────────────────────────────────────┐
│                          count = 3                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Creates:  aws_instance.web[0]                                      │
│            aws_instance.web[1]                                      │
│            aws_instance.web[2]                                      │
│                                                                     │
│  PROBLEM: Delete web[0] → ALL indexes shift! web[1] becomes web[0] │
│           Terraform thinks it needs to RECREATE everything.         │
│                                                                     │
│  USE FOR: Identical resources where order doesn't matter            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                   for_each = toset(["dev","prod"])                  │
├─────────────────────────────────────────────────────────────────────┤
│  Creates:  aws_instance.web["dev"]                                  │
│            aws_instance.web["prod"]                                 │
│                                                                     │
│  BENEFIT: Delete "dev" → "prod" is UNCHANGED. Keyed by value!      │
│                                                                     │
│  USE FOR: Resources with identity (environments, users, subnets)   │
└─────────────────────────────────────────────────────────────────────┘

⚠️  RULE: Prefer for_each over count when resources have identity!
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">for_each Example</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>variable "environments" {
  default = ["dev", "staging", "prod"]
}

resource "aws_s3_bucket" "app_data" {
  for_each = toset(var.environments)
  
  bucket = "myapp-\${each.key}-data"  # each.key = "dev", "staging", "prod"
  
  tags = {
    Environment = each.key
  }
}

# Access specific bucket:
# aws_s3_bucket.app_data["prod"].arn</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚠️ ForceNew: The Silent Destroyer</div>
                    <p>Some arguments <strong>cannot</strong> be changed in-place. Changing them triggers a <strong>DESTROY + CREATE</strong> cycle.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
Common ForceNew Arguments (EC2):
┌───────────────────────┬────────────────────────────────────────────┐
│ Argument              │ Why it forces replacement                  │
├───────────────────────┼────────────────────────────────────────────┤
│ ami                   │ Boot volume identity changes               │
│ availability_zone     │ Can't move running instance to another AZ  │
│ subnet_id             │ Network interface is fundamental           │
│ instance_type*        │ Some types require stop; others = replace  │
│ user_data             │ Only runs once at boot; changes = new boot │
└───────────────────────┴────────────────────────────────────────────┘

In terraform plan output:
<span class="error">-/+ aws_instance.web (forces replacement)</span>
       ~ ami = "ami-old" -> "ami-new"  # forces replacement
                        </div>
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Questions</div>
                    <p><strong>Q1:</strong> "What's the difference between resource.name and resource.name[0]?"<br>
                    <strong>A:</strong> Without count/for_each, you use <code>resource.name</code>. With count, it becomes a list (<code>resource.name[0]</code>). With for_each, it's a map (<code>resource.name["key"]</code>).</p>
                    
                    <p><strong>Q2:</strong> "How do you remove a resource from Terraform without destroying it?"<br>
                    <strong>A:</strong> Use <code>terraform state rm resource.name</code> to remove from state, then delete from code. The real resource stays!</p>
                </div>

                <div class="memory-box">
                    <div class="memory-box-header">🧠 Key Takeaways</div>
                    <ul>
                        <li><strong>Resources are CRUD operations</strong> - Create, Read, Update, Delete</li>
                        <li><strong>Use for_each over count</strong> for resources with identity</li>
                        <li><strong>Check ForceNew docs</strong> before changing sensitive args</li>
                        <li><strong>lifecycle blocks</strong> control unexpected destroys</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Resource Addressing</div>
                    <div class="code-block">
                        <pre># Simple resource
aws_instance.web

# Count-based resource
aws_instance.web[0]

# for_each resource
aws_instance.web["prod"]

# Module resource
module.vpc.aws_subnet.public[0]</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use <code>terraform import</code>:</strong> Bring existing resources under Terraform control.</li>
                        <li><strong>Replace safely:</strong> Use <code>terraform apply -replace</code> when needed.</li>
                        <li><strong>Avoid <code>taint</code> overuse:</strong> Prefer <code>-replace</code> for clarity.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Resource Lifecycle Events</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
CREATE:
  read state -> diff -> api create -> read back -> state update

UPDATE:
  diff -> api update -> read back -> state update

DELETE:
  api delete -> remove from state
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧱 Import Strategy</div>
                    <p>Import is a two-step process: write the resource code, then import the real ID into state.</p>
                    <div class="code-block">
                        <pre># 1) Write the resource block
# 2) Import
terraform import aws_security_group.web sg-0abc123</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚙️ Meta-Argument Patterns</div>
                    <div class="code-block">
                        <pre>resource "aws_instance" "web" {
  count = var.enable_web ? 1 : 0
  depends_on = [aws_security_group.web]
  provider   = aws.west

  lifecycle {
    prevent_destroy = true
    create_before_destroy = true
  }
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧯 Targeted Apply Caution</div>
                    <p><code>-target</code> is useful for emergency recovery, but can create inconsistent state. Use sparingly and follow with a full plan.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Resource Patterns Library</div>
                    <div class="code-block">
                        <pre># Conditional resource
resource "aws_s3_bucket" "logs" {
  count  = var.enable_logs ? 1 : 0
  bucket = "my-logs-bucket"
}

# for_each map
resource "aws_iam_user" "team" {
  for_each = {
    alice = "Developer"
    bob   = "Ops"
  }
  name = each.key
}

# Dynamic block
resource "aws_security_group" "app" {
  name = "app-sg"
  dynamic "ingress" {
    for_each = var.ingress_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}

# Timeouts
resource "aws_db_instance" "db" {
  # ...
  timeouts {
    create = "60m"
    delete = "60m"
  }
}

# Provider alias selection
resource "aws_s3_bucket" "backup" {
  provider = aws.west
  bucket   = "backup-bucket"
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔍 Plan Change Types</div>
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Meaning</th>
                                    <th>Typical Cause</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>+</code></td>
                                    <td>Create</td>
                                    <td>New resource in config</td>
                                </tr>
                                <tr>
                                    <td><code>~</code></td>
                                    <td>Update in-place</td>
                                    <td>Argument changed (mutable)</td>
                                </tr>
                                <tr>
                                    <td><code>-</code></td>
                                    <td>Destroy</td>
                                    <td>Resource removed from config</td>
                                </tr>
                                <tr>
                                    <td><code>-/+</code></td>
                                    <td>Replace</td>
                                    <td>ForceNew argument changed</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📘 Resource Cookbook</div>
                    <div class="code-block">
                        <pre># Common tags pattern
locals {
  tags = {
    Project = var.project
    Env     = var.env
  }
}

resource "aws_s3_bucket" "data" {
  bucket = "\${var.project}-\${var.env}-data"
  tags   = local.tags
}

# Conditional enable/disable
resource "aws_cloudwatch_log_group" "app" {
  count = var.enable_logs ? 1 : 0
  name  = "/app/\${var.env}"
}

# for_each with map
resource "aws_iam_user" "users" {
  for_each = var.user_map
  name     = each.key
  tags     = { Role = each.value }
}

# Optional value using try()
resource "aws_db_instance" "db" {
  # ...
  port = try(var.db_port, 5432)
}

# Merge tags
resource "aws_instance" "web" {
  # ...
  tags = merge(local.tags, { Name = "web" })
}

# Depends on hidden resource
resource "null_resource" "wait" {
  depends_on = [aws_lb.main]
}

# Use data source for AMI
data "aws_ami" "latest" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.latest.id
  instance_type = var.instance_type
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ Resource Checklist</div>
                    <ul>
                        <li>Names are unique and stable.</li>
                        <li>Tags include ownership.</li>
                        <li>ForceNew changes reviewed.</li>
                        <li>Dependencies are explicit when needed.</li>
                        <li>Lifecycle rules documented.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 5. State Management
        // ========================
        'state': `
            <div class="content-card">
                <h2><span class="icon">💾</span> Terraform State Deep Dive</h2>
                <p>State is <strong>THE most important concept</strong> to understand. It's Terraform's memory - the bridge between your code and real infrastructure.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Why State Exists</div>
                    <p>Terraform needs to know:</p>
                    <ul>
                        <li><strong>What it created:</strong> "I made an EC2 instance called 'web'"</li>
                        <li><strong>What the real ID is:</strong> "That instance is i-0abc123def"</li>
                        <li><strong>Current attributes:</strong> "It has IP 10.0.0.5 and type t3.micro"</li>
                    </ul>
                    <p>Without state, Terraform would create NEW resources every single run!</p>
                </div>

                <h3>The State File Structure</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">terraform.tfstate (JSON)</div>
                    <div class="ascii-content">
{
  "version": 4,                    ─────► State format version
  "terraform_version": "1.5.0",    ─────► TF version that wrote this
  "serial": 42,                    ─────► Increments on every change
  "lineage": "abc-123-xyz",        ─────► Unique ID for this state chain
  
  "resources": [
    {
      "module": "module.vpc",      ─────► Which module (empty = root)
      "mode": "managed",           ─────► "managed" or "data"
      "type": "aws_instance",      ─────► Resource type
      "name": "web",               ─────► Your local name
      
      "instances": [
        {
          "index_key": 0,          ─────► For count/for_each
          "attributes": {
            "id": "i-0abc123def",  ─────► THE REAL AWS ID
            "ami": "ami-12345",
            "instance_type": "t3.micro",
            "public_ip": "54.1.2.3",
            "tags": {"Name": "Web"}
          },
          "dependencies": [        ─────► What this depends on
            "aws_subnet.public"
          ]
        }
      ]
    }
  ]
}
                    </div>
                </div>

                <h3>The Three-Way Comparison</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">How terraform plan Works</div>
                    <div class="ascii-content">
┌─────────────────────────────────────────────────────────────────────┐
│                     TERRAFORM PLAN PROCESS                          │
└─────────────────────────────────────────────────────────────────────┘

      Your Code              State File            Real World
     (*.tf files)         (terraform.tfstate)     (AWS API call)
          │                      │                      │
          │                      │                      │
          ▼                      ▼                      ▼
    ┌───────────┐          ┌───────────┐          ┌───────────┐
    │ DESIRED   │          │  KNOWN    │          │  ACTUAL   │
    │  STATE    │          │  STATE    │          │  STATE    │
    │           │          │           │          │           │
    │ t3.micro  │          │ t3.micro  │          │ t3.micro  │
    │ ami-NEW   │          │ ami-OLD   │          │ ami-OLD   │
    └─────┬─────┘          └─────┬─────┘          └─────┬─────┘
          │                      │                      │
          └──────────┬───────────┴───────────┬──────────┘
                     │                       │
                     ▼                       ▼
              ┌─────────────┐         ┌─────────────┐
              │  PLAN DIFF  │         │DRIFT DETECT │
              │             │         │             │
              │ ami-OLD     │         │ State says  │
              │  → ami-NEW  │         │ t3.micro    │
              │ (Update!)   │         │ AWS says    │
              └─────────────┘         │ t3.micro ✓  │
                                      └─────────────┘

RESULT:  Terraform shows you exactly what will change before it happens!
                    </div>
                </div>

                <h3>State Operations (Commands)</h3>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Command</th>
                                <th>Use Case</th>
                                <th>Danger Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>terraform state list</code></td>
                                <td>Show all resources in state</td>
                                <td>🟢 Safe (read-only)</td>
                            </tr>
                            <tr>
                                <td><code>terraform state show aws_instance.web</code></td>
                                <td>Show details of one resource</td>
                                <td>🟢 Safe (read-only)</td>
                            </tr>
                            <tr>
                                <td><code>terraform state mv old.name new.name</code></td>
                                <td>Rename resource without destroy</td>
                                <td>🟡 Caution</td>
                            </tr>
                            <tr>
                                <td><code>terraform state rm aws_instance.web</code></td>
                                <td>Remove from state (keeps real resource)</td>
                                <td>🟠 Risky</td>
                            </tr>
                            <tr>
                                <td><code>terraform import aws_instance.web i-123</code></td>
                                <td>Add existing resource to state</td>
                                <td>🟡 Caution</td>
                            </tr>
                            <tr>
                                <td><code>terraform state pull</code></td>
                                <td>Download remote state to stdout</td>
                                <td>🟢 Safe</td>
                            </tr>
                            <tr>
                                <td><code>terraform state push</code></td>
                                <td>Overwrite remote state (DANGER!)</td>
                                <td>🔴 DANGEROUS</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚠️ State Contains Secrets!</div>
                    <p>Your state file may contain <strong>sensitive data</strong>:</p>
                    <ul>
                        <li>Database passwords (from aws_db_instance)</li>
                        <li>API keys (from aws_iam_access_key)</li>
                        <li>Private keys (from tls_private_key)</li>
                    </ul>
                    <p><strong>NEVER:</strong> Commit state to Git. <strong>ALWAYS:</strong> Use remote state with encryption.</p>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Questions</div>
                    <p><strong>Q1:</strong> "What happens if you delete the state file?"<br>
                    <strong>A:</strong> Terraform loses all memory. It thinks NO resources exist. Next apply will try to CREATE everything again (duplicates!).</p>
                    
                    <p><strong>Q2:</strong> "How do you recover from a corrupted state?"<br>
                    <strong>A:</strong> If using S3 backend with versioning, restore a previous version. Otherwise, use <code>terraform import</code> for each resource.</p>
                    
                    <p><strong>Q3:</strong> "What's the 'serial' number in state?"<br>
                    <strong>A:</strong> A monotonically increasing number that increments on every state change. Used for conflict detection.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔒 State Locking</div>
                    <p>Remote backends lock state to prevent concurrent writes. Example: S3 backend uses DynamoDB for locking.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
terraform apply
   |
   | acquire lock (DynamoDB)
   v
update state (S3)
   |
   | release lock
   v
done
                        </div>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Enable versioning:</strong> Always keep rollback history for state.</li>
                        <li><strong>Encrypt state:</strong> Use KMS for S3 backends.</li>
                        <li><strong>Never edit state manually:</strong> Use <code>terraform state</code> commands.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📦 State Movement</div>
                    <p>Moving resources in code should be reflected in state to prevent destroy/create.</p>
                    <div class="code-block">
                        <pre>terraform state mv aws_instance.web module.app.aws_instance.web</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧯 State Backup Strategy</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
S3 versioning ON
+ daily backups (optional)
+ restrict write access
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 State Command Reference</div>
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Command</th>
                                    <th>Use</th>
                                    <th>Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>terraform state list</code></td>
                                    <td>Inventory resources in state</td>
                                    <td>Low</td>
                                </tr>
                                <tr>
                                    <td><code>terraform state show</code></td>
                                    <td>Inspect one resource</td>
                                    <td>Low</td>
                                </tr>
                                <tr>
                                    <td><code>terraform state mv</code></td>
                                    <td>Move/rename resources</td>
                                    <td>Medium</td>
                                </tr>
                                <tr>
                                    <td><code>terraform state rm</code></td>
                                    <td>Remove resource from state</td>
                                    <td>High</td>
                                </tr>
                                <tr>
                                    <td><code>terraform import</code></td>
                                    <td>Bring existing infra under state</td>
                                    <td>Medium</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧯 Common State Incidents</div>
                    <ul>
                        <li><strong>Stale lock:</strong> Apply crashed; use <code>force-unlock</code> after verification.</li>
                        <li><strong>Corrupt state:</strong> Restore from S3 versioning.</li>
                        <li><strong>Manual deletion:</strong> Import or recreate resources.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">❓ State FAQ</div>
                    <p><strong>Q:</strong> "Can I store state in Git?"<br>
                    <strong>A:</strong> No. State contains secrets and will drift if multiple people edit it.</p>
                    <p><strong>Q:</strong> "What if state is lost?"<br>
                    <strong>A:</strong> Restore from versioning or re-import resources.</p>
                    <p><strong>Q:</strong> "Is state encrypted?"<br>
                    <strong>A:</strong> Only if the backend supports encryption (S3/KMS).</p>
                    <p><strong>Q:</strong> "Why is my plan slow?"<br>
                    <strong>A:</strong> Large state or excessive refresh calls.</p>
                    <p><strong>Q:</strong> "Can I edit state by hand?"<br>
                    <strong>A:</strong> Avoid it. Use <code>terraform state</code> commands.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚩 State Red Flags</div>
                    <ul>
                        <li><strong>Huge diffs:</strong> Plan shows mass replacements unexpectedly.</li>
                        <li><strong>Unknown attributes:</strong> Providers returning empty/unknown values.</li>
                        <li><strong>Frequent lock conflicts:</strong> Too many concurrent applies.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 State Operations Cookbook</div>
                    <div class="code-block">
                        <pre># Rename a resource in state
terraform state mv aws_instance.web aws_instance.app

# Move resource into a module
terraform state mv aws_instance.web module.app.aws_instance.web

# Remove from state but keep real resource
terraform state rm aws_s3_bucket.logs

# Import existing resource
terraform import aws_vpc.main vpc-123456

# List state resources
terraform state list | sort

# Inspect one resource
terraform state show aws_db_instance.main</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ State Guardrails</div>
                    <ul>
                        <li>Locking enabled for all applies.</li>
                        <li>Versioning enabled on remote state.</li>
                        <li>State access restricted to CI roles.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 6. Remote State
        // ========================
        'remote-state': `
            <div class="content-card">
                <h2><span class="icon">☁️</span> Remote State Deep Dive</h2>
                <p>Local state is for learning. <strong>Remote state is for production.</strong> It enables team collaboration, locking, and disaster recovery.</p>

                <h3>Why Remote State?</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <span class="icon">🤝</span>
                        <div class="name">Team Collaboration</div>
                        <div class="desc">Everyone reads/writes the same state file.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔒</span>
                        <div class="name">State Locking</div>
                        <div class="desc">Prevents concurrent applies from corrupting state.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">📜</span>
                        <div class="name">Versioning</div>
                        <div class="desc">S3 versioning = Undo button for state disasters.</div>
                    </div>
                    <div class="component-box">
                        <span class="icon">🔐</span>
                        <div class="name">Encryption</div>
                        <div class="desc">State contains secrets; encrypt at rest with KMS.</div>
                    </div>
                </div>

                <h3>AWS Remote State Architecture</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">S3 + DynamoDB Backend</div>
                    <div class="ascii-content">
┌─────────────────────────────────────────────────────────────────────┐
│                         AWS ACCOUNT                                 │
│                                                                     │
│   ┌─────────────┐                      ┌─────────────────────────┐  │
│   │  Developer  │                      │     S3 BUCKET           │  │
│   │  Laptop     │                      │   terraform-state-xxx   │  │
│   │             │   terraform apply    │                         │  │
│   │ ┌─────────┐ │ ─────────────────►   │  ┌───────────────────┐  │  │
│   │ │ *.tf    │ │                      │  │ env:/prod/        │  │  │
│   │ │ files   │ │                      │  │    app.tfstate    │  │  │
│   │ └─────────┘ │                      │  │ env:/dev/         │  │  │
│   └──────┬──────┘                      │  │    app.tfstate    │  │  │
│          │                             │  └───────────────────┘  │  │
│          │  1. Request Lock            │  ✓ Versioning Enabled   │  │
│          │                             │  ✓ Server-Side Encrypt  │  │
│          ▼                             └─────────────────────────┘  │
│   ┌─────────────────────────┐                   ▲                   │
│   │    DYNAMODB TABLE       │                   │                   │
│   │   terraform-locks       │                   │ 3. Read/Write     │
│   │                         │                   │    State File     │
│   │ ┌─────────────────────┐ │                   │                   │
│   │ │ LockID: "prod/app"  │ │ ◄────────────────┘                   │
│   │ │ Info: "user@laptop" │ │    2. Lock Acquired                  │
│   │ │ Created: timestamp  │ │                                       │
│   │ └─────────────────────┘ │    4. Release Lock                   │
│   └─────────────────────────┘ ◄────────────────────────────────────│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">backend.tf</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/app.tfstate"       # Path within bucket
    region         = "us-east-1"
    
    # Locking (HIGHLY RECOMMENDED)
    dynamodb_table = "terraform-locks"
    
    # Security
    encrypt        = true                     # SSE-S3 or SSE-KMS
    # kms_key_id   = "arn:aws:kms:..."       # Optional: Custom KMS key
    
    # Optional: Assume a role
    # role_arn     = "arn:aws:iam::123456789:role/TerraformStateAccess"
  }
}</pre>
                </div>

                <h3>The Locking Workflow</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">What Happens During "terraform apply"</div>
                    <div class="ascii-content">
┌─────────────────────────────────────────────────────────────────────┐
│ User A: terraform apply                                             │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────────┐
              │  1. PutItem to DynamoDB            │
              │     LockID = "prod/app.tfstate"    │
              │     Info = "user-a@laptop"         │
              └────────────────┬───────────────────┘
                               │ ✓ Lock acquired
                               ▼
              ┌────────────────────────────────────┐
              │  2. GET state from S3              │
              │     (Read current infra state)     │
              └────────────────┬───────────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │ DURING THIS TIME...      │                          │
    │                          │                          │
    │ User B: terraform apply  │  ──► ERROR!              │
    │ ┌──────────────────────┐ │                          │
    │ │ Error: Lock held by  │ │                          │
    │ │ user-a@laptop since  │ │                          │
    │ │ 2024-01-01 12:00:00  │ │                          │
    │ └──────────────────────┘ │                          │
    └──────────────────────────┼──────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────────┐
              │  3. Make changes (API calls)       │
              └────────────────┬───────────────────┘
                               │
                               ▼
              ┌────────────────────────────────────┐
              │  4. PUT updated state to S3        │
              │     (New version created)          │
              └────────────────┬───────────────────┘
                               │
                               ▼
              ┌────────────────────────────────────┐
              │  5. DeleteItem from DynamoDB       │
              │     (Release lock)                 │
              └────────────────────────────────────┘
                    </div>
                </div>

                <h3>Sharing State Between Projects</h3>
                <p>One project can READ another project's outputs using <code>terraform_remote_state</code>:</p>
                <div class="ascii-diagram">
                    <div class="ascii-content">
┌───────────────────────────┐         ┌───────────────────────────┐
│  VPC Project              │         │  APP Project              │
│  (runs first)             │         │  (runs second)            │
│                           │         │                           │
│  outputs.tf:              │         │  data.tf:                 │
│  ┌─────────────────────┐  │ S3      │  ┌─────────────────────┐  │
│  │output "vpc_id" {...}│──┼────────►│  │data "terraform_     │  │
│  │output "subnet_ids"  │  │         │  │  remote_state"      │  │
│  │{...}                │  │         │  │  "vpc" {...}        │  │
│  └─────────────────────┘  │         │  └─────────────────────┘  │
│                           │         │                           │
│  State: env:/prod/vpc     │         │  Uses:                    │
│                           │         │  data.terraform_remote_   │
│                           │         │    state.vpc.outputs.vpc_id│
└───────────────────────────┘         └───────────────────────────┘
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">data.tf (in App project)</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    bucket = "my-terraform-state"
    key    = "prod/vpc.tfstate"
    region = "us-east-1"
  }
}

# Use the outputs
resource "aws_instance" "app" {
  subnet_id = data.terraform_remote_state.vpc.outputs.subnet_ids[0]
  vpc_security_group_ids = [
    data.terraform_remote_state.vpc.outputs.app_security_group_id
  ]
}</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Questions</div>
                    <p><strong>Q1:</strong> "What happens if someone force-unlocks a state?"<br>
                    <strong>A:</strong> <code>terraform force-unlock LOCK_ID</code> removes the DynamoDB item. Dangerous if someone else is actually running! Use only for orphaned locks.</p>
                    
                    <p><strong>Q2:</strong> "How do you migrate from local to remote state?"<br>
                    <strong>A:</strong> Add backend config, run <code>terraform init</code>. Terraform prompts: "Do you want to copy existing state?" Say yes.</p>
                    
                    <p><strong>Q3:</strong> "Can backend config use variables?"<br>
                    <strong>A:</strong> NO. Backend blocks don't support interpolation. Use <code>-backend-config</code> CLI flags or partial configurations.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Minimal S3 Backend</div>
                    <div class="code-block">
                        <pre>terraform {
  backend "s3" {
    bucket         = "tf-state-prod"
    key            = "prod/network/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tf-locks"
    encrypt        = true
  }
}</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Separate state per layer:</strong> Network, app, and DB should be isolated.</li>
                        <li><strong>Use <code>terraform_remote_state</code> cautiously:</strong> Prefer module outputs when possible.</li>
                        <li><strong>Lock table is mandatory:</strong> Without it, concurrent applies corrupt state.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Remote State Patterns</div>
                    <ul>
                        <li><strong>Foundations:</strong> VPC, IAM, shared networking.</li>
                        <li><strong>Platforms:</strong> Kubernetes, shared services, logging.</li>
                        <li><strong>Apps:</strong> Each application owns its own state.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Remote State Guardrails</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
Locking enabled
Versioning enabled
Access restricted to CI role
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Backend Comparison</div>
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Backend</th>
                                    <th>Locking</th>
                                    <th>Best For</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>S3 + DynamoDB</td>
                                    <td>Yes</td>
                                    <td>Most AWS teams</td>
                                </tr>
                                <tr>
                                    <td>Terraform Cloud</td>
                                    <td>Yes</td>
                                    <td>Managed workflows + policy</td>
                                </tr>
                                <tr>
                                    <td>Consul</td>
                                    <td>Yes</td>
                                    <td>Self-hosted, multi-cloud</td>
                                </tr>
                                <tr>
                                    <td>Local</td>
                                    <td>No</td>
                                    <td>Learning only</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Key Naming Strategy</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
prod/network/terraform.tfstate
prod/app/terraform.tfstate
prod/db/terraform.tfstate
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ Remote State Checklist</div>
                    <ul>
                        <li><strong>Locking:</strong> Enabled (DynamoDB, TFC, Consul).</li>
                        <li><strong>Versioning:</strong> Enabled for rollback.</li>
                        <li><strong>Encryption:</strong> KMS or backend encryption.</li>
                        <li><strong>Access control:</strong> CI role only.</li>
                        <li><strong>Backups:</strong> Periodic snapshots.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 7. Variables & Inputs
        // ========================
        'variables': `
            <div class="content-card">
                <h2><span class="icon">📥</span> Variables Deep Dive</h2>
                <p>Variables make your Terraform code <strong>reusable and parameterizable</strong>. Never hardcode values that might change between environments.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Variable Block Anatomy</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
variable "instance_type" {
    │          │
    │          └─── VARIABLE NAME (reference as var.instance_type)
    │
    └──────────── KEYWORD

  description = "EC2 instance type"  ──► DOCUMENTATION (required by best practice)
  type        = string               ──► TYPE CONSTRAINT (enforces input type)
  default     = "t3.micro"           ──► DEFAULT VALUE (makes var optional)
  sensitive   = true                 ──► HIDE from CLI output
  nullable    = false                ──► Reject null values
  
  validation {                       ──► CUSTOM VALIDATION RULES
    condition     = contains(["t3.micro", "t3.small"], var.instance_type)
    error_message = "Must be t3.micro or t3.small."
  }
}
                        </div>
                    </div>
                </div>

                <h3>Variable Precedence (Who Wins?)</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Priority Order (Lowest → Highest)</div>
                    <div class="ascii-content">
                              ┌─────────────────────────────┐
                              │       -var flag CLI         │ ◄── HIGHEST PRIORITY
                              │   terraform apply -var="x=1"│     (ALWAYS WINS)
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │       -var-file flag        │
                              │   terraform apply           │
                              │   -var-file="secrets.tfvars"│
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │     *.auto.tfvars files     │
                              │   (loaded alphabetically)   │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │     terraform.tfvars        │
                              │   (auto-loaded if present)  │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │    Environment Variables    │
                              │   export TF_VAR_name=value  │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │      default = "value"      │ ◄── LOWEST PRIORITY
                              │   (in variable block)       │
                              └─────────────────────────────┘
                    </div>
                </div>

                <h3>Type System</h3>
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Example</th>
                                <th>Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>string</code></td>
                                <td><code>"us-east-1"</code></td>
                                <td>Single values (region, name)</td>
                            </tr>
                            <tr>
                                <td><code>number</code></td>
                                <td><code>3</code></td>
                                <td>Counts, sizes, ports</td>
                            </tr>
                            <tr>
                                <td><code>bool</code></td>
                                <td><code>true</code></td>
                                <td>Feature flags (enable/disable)</td>
                            </tr>
                            <tr>
                                <td><code>list(string)</code></td>
                                <td><code>["a", "b"]</code></td>
                                <td>AZ list, CIDR blocks</td>
                            </tr>
                            <tr>
                                <td><code>map(string)</code></td>
                                <td><code>{key = "val"}</code></td>
                                <td>Tags, simple lookups</td>
                            </tr>
                            <tr>
                                <td><code>set(string)</code></td>
                                <td><code>toset(["a","b"])</code></td>
                                <td>for_each (unique values)</td>
                            </tr>
                            <tr>
                                <td><code>object({...})</code></td>
                                <td><code>{name=string, count=number}</code></td>
                                <td>Complex structured inputs</td>
                            </tr>
                            <tr>
                                <td><code>tuple([...])</code></td>
                                <td><code>[string, number]</code></td>
                                <td>Fixed-length mixed lists</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">variables.tf</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
  
  validation {
    condition     = can(regex("^t[23]\\\\.", var.instance_type))
    error_message = "Only T2/T3 instance families allowed."
  }
}

variable "vpc_config" {
  description = "VPC configuration object"
  type = object({
    cidr_block = string
    az_count   = number
    enable_nat = bool
  })
  default = {
    cidr_block = "10.0.0.0/16"
    az_count   = 2
    enable_nat = true
  }
}</pre>
                </div>

                <h3>Variables vs Locals</h3>
                <div class="ascii-diagram">
                    <div class="ascii-content">
┌──────────────────────────────────────────────────────────────────────┐
│                        VARIABLES (var.*)                             │
├──────────────────────────────────────────────────────────────────────┤
│  • INPUT from outside the module                                     │
│  • Set via: CLI, files, env vars                                     │
│  • Can have defaults                                                 │
│  • Used to parameterize modules                                      │
│                                                                      │
│  variable "env" { ... }                                              │
│  Usage: var.env                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         LOCALS (local.*)                             │
├──────────────────────────────────────────────────────────────────────┤
│  • COMPUTED values inside the module                                 │
│  • Cannot be overridden from outside                                 │
│  • Used for: DRY code, intermediate calculations                     │
│                                                                      │
│  locals {                                                            │
│    common_tags = { Env = var.env, Project = "MyApp" }                │
│  }                                                                   │
│  Usage: local.common_tags                                            │
└──────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Questions</div>
                    <p><strong>Q1:</strong> "How do you pass sensitive variables securely in CI/CD?"<br>
                    <strong>A:</strong> Use <code>TF_VAR_*</code> environment variables sourced from secret managers (AWS Secrets Manager, HashiCorp Vault). Never commit to Git!</p>
                    
                    <p><strong>Q2:</strong> "What's the difference between nullable and optional?"<br>
                    <strong>A:</strong> <code>nullable = false</code> means null is rejected. A variable is optional if it has a <code>default</code> value.</p>
                    
                    <p><strong>Q3:</strong> "Why use type = any is bad practice?"<br>
                    <strong>A:</strong> It defeats type safety. Errors appear at runtime instead of plan time. Always be explicit!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Validation Patterns</div>
                    <div class="code-block">
                        <pre>variable "cidr_block" {
  type = string
  validation {
    condition     = can(cidrnetmask(var.cidr_block))
    error_message = "Must be a valid CIDR block."
  }
}

variable "env" {
  type = string
  validation {
    condition     = contains(["dev", "stage", "prod"], var.env)
    error_message = "env must be dev, stage, or prod."
  }
}</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Document variables:</strong> Always set <code>description</code> and <code>type</code>.</li>
                        <li><strong>Use locals for derived values:</strong> Keep variables as inputs only.</li>
                        <li><strong>Prefer objects:</strong> Group related values to reduce long variable lists.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧠 Variable Files</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
terraform.tfvars        -> auto-loaded
dev.tfvars              -> loaded with -var-file
prod.auto.tfvars        -> auto-loaded
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Environment Variables</div>
                    <div class="code-block">
                        <pre>export TF_VAR_region="us-east-1"
export TF_VAR_env="prod"</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Example tfvars</div>
                    <div class="code-block">
                        <pre># prod.tfvars
region      = "us-east-1"
environment = "prod"
instance_type = "t3.medium"

tags = {
  Owner = "platform-team"
  CostCenter = "1234"
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Complex Variable Schema</div>
                    <div class="code-block">
                        <pre>variable "app" {
  type = object({
    name = string
    env  = string
    scaling = object({
      min = number
      max = number
    })
    networking = object({
      vpc_id     = string
      subnet_ids = list(string)
    })
  })
}

variable "app" {
  validation {
    condition     = var.app.scaling.min <= var.app.scaling.max
    error_message = "min must be <= max"
  }
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">❓ Variables FAQ</div>
                    <p><strong>Q:</strong> "How do I make a variable optional?"<br>
                    <strong>A:</strong> Provide a <code>default</code> value.</p>
                    <p><strong>Q:</strong> "How do I prevent nulls?"<br>
                    <strong>A:</strong> Set <code>nullable = false</code>.</p>
                    <p><strong>Q:</strong> "Can I validate formats?"<br>
                    <strong>A:</strong> Use <code>validation</code> with regex or functions.</p>
                    <p><strong>Q:</strong> "Where to store tfvars?"<br>
                    <strong>A:</strong> Keep secrets out of Git; load via CI or env vars.</p>
                    <p><strong>Q:</strong> "When to use object types?"<br>
                    <strong>A:</strong> Group related settings and reduce variable sprawl.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ Variables Checklist</div>
                    <ul>
                        <li>Every variable has description and type.</li>
                        <li>Sensitive values are marked.</li>
                        <li>Validation rules enforce constraints.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 8. Outputs
        // ========================
        'outputs': `
            <div class="content-card">
                <h2><span class="icon">📤</span> Outputs Deep Dive</h2>
                <p>Outputs are the return values of your Terraform module. They allow you to expose data to the CLI or to other parent modules.</p>
                
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Data Flow: Where do Outputs Go?</div>
                    <div class="ascii-content">
       ┌───────────────────────────┐
       │      CHILD MODULE         │
       │   (e.g., ./modules/vpc)   │
       │                           │
       │  resource "aws_vpc" "x"   │
       │     id = "vpc-123"        │
       │           │               │
       │  output "vpc_id" {        │
       │     value = ...id         │
       │  }        │               │
       └───────────┼───────────────┘
                   │
         EXPOSES VALUE TO...
                   │
    ┌──────────────┴───────────────┐
    │                              │
┌───▼────────────────┐    ┌────────▼───────────────┐
│  ROOT MODULE       │    │  CLI / STATE           │
│  (main.tf)         │    │  (terraform output)    │
│                    │    │                        │
│ module.vpc.vpc_id  │    │ "vpc_id": "vpc-123"    │
└────────────────────┘    └────────────────────────┘
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">outputs.tf</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>output "db_password" {
  description = "The password for the database"
  value       = aws_db_instance.main.password
  sensitive   = true  # <--- IMPORTANT! Hides from CLI output
}

output "web_url" {
  value = "http://\${aws_instance.web.public_ip}:8080"
}</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Question:</strong> "How do I extract output values for use in a script?"<br>
                    <strong>Answer:</strong> Use <code>terraform output -json</code> to get all outputs in JSON format, then parse with <code>jq</code>. Example: <code>terraform output -json | jq -r .web_url.value</code>.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧠 Output Behavior: Known vs Unknown</div>
                    <p>Outputs are evaluated during the plan/apply phases. If the value depends on a resource that doesn't exist yet, the output is <strong>unknown</strong> during plan and becomes available after apply.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-diagram-title">When Outputs Are Resolved</div>
                        <div class="ascii-content">
PLAN PHASE                     APPLY PHASE
-----------                    -----------
output "alb_dns" = <unknown>   output "alb_dns" = "my-alb-123.us-east-1.elb.amazonaws.com"
                       (resource created)
                        </div>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use <code>-raw</code>:</strong> <code>terraform output -raw vpc_id</code> prints a clean string (no quotes).</li>
                        <li><strong>Hide secrets:</strong> Always mark sensitive outputs with <code>sensitive = true</code>.</li>
                        <li><strong>Explicit dependency:</strong> You can use <code>depends_on</code> inside an output if you need a strict apply order.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Output Use Cases</div>
                    <ul>
                        <li><strong>Chaining modules:</strong> Pass VPC IDs, subnet IDs, or ARNs to other stacks.</li>
                        <li><strong>Automation:</strong> Export DNS names or IPs for scripts and smoke tests.</li>
                        <li><strong>Observability:</strong> Publish URLs and IDs into runbooks or dashboards.</li>
                    </ul>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Sensitive Output Visibility</div>
                    <div class="ascii-content">
output "db_password" {
  value     = aws_db_instance.main.password
  sensitive = true
}

CLI: terraform output
=> db_password = (sensitive)
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Complex Outputs</span>
                    </div>
                    <pre>output "subnet_ids" {
  description = "All private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "service_map" {
  value = {
    api = aws_lb.api.dns_name
    web = aws_lb.web.dns_name
  }
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Output Stability</div>
                    <p>Outputs should be stable contracts. Changing output names or structure can break downstream modules.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Output Consumption Patterns</div>
                    <div class="code-block">
                        <pre># In a parent module
module "network" {
  source = "./modules/network"
}

module "app" {
  source    = "./modules/app"
  subnet_id = module.network.private_subnet_ids[0]
}

# In scripts
terraform output -json | jq -r .alb_dns.value</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Output Parsing Examples</div>
                    <div class="code-block">
                        <pre># Get a single value
terraform output -raw web_url

# Parse JSON
terraform output -json | jq -r '.subnet_ids.value[]'

# Use in shell variable
WEB_URL=$(terraform output -raw web_url)</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">❓ Outputs FAQ</div>
                    <p><strong>Q:</strong> "Do outputs trigger dependencies?"<br>
                    <strong>A:</strong> Outputs can depend on resources but do not create resources.</p>
                    <p><strong>Q:</strong> "Can outputs be sensitive?"<br>
                    <strong>A:</strong> Yes, use <code>sensitive = true</code>.</p>
                    <p><strong>Q:</strong> "How are outputs used across stacks?"<br>
                    <strong>A:</strong> Via module outputs or <code>terraform_remote_state</code>.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ Outputs Checklist</div>
                    <ul>
                        <li>Names are stable and documented.</li>
                        <li>Sensitive values are hidden.</li>
                        <li>Only expose what consumers need.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 9. Data Sources
        // ========================
        'data-sources': `
            <div class="content-card">
                <h2><span class="icon">🔍</span> Data Sources Deep Dive</h2>
                <p>Resources <strong>CREATE</strong> infrastructure. Data Sources <strong>READ</strong> information about existing infrastructure that Terraform doesn't manage.</p>
                
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Resource vs Data Source</div>
                    <div class="ascii-content">
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│             RESOURCE                 │     │             DATA SOURCE              │
│     resource "aws_vpc" "new"         │     │        data "aws_vpc" "existing"     │
└──────────────────┬───────────────────┘     └───────────────────┬──────────────────┘
                   │                                             │
          ┌────────▼────────┐                           ┌────────▼────────┐
          │    Terraform    │                           │    Terraform    │
          │    MANAGED      │                           │    READ-ONLY    │
          └────────┬────────┘                           └────────┬────────┘
                   │                                             │
   ┌───────────────▼───────────────┐             ┌───────────────▼───────────────┐
   │                               │             │                               │
   │  [ AWS API: CreateVpc... ]    │             │  [ AWS API: DescribeVpcs... ] │
   │                               │             │                               │
   └───────────────┬───────────────┘             └───────────────┬───────────────┘
                   │                                             │
                   ▼                                             ▼
          New VPC Created                               Gets ID: vpc-abcdef
                    </div>
                </div>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Common Use Case: Dynamic AMI Lookup</div>
                    <p>Instead of hardcoding AMI IDs (which change by region and time), ask AWS for the latest one!</p>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">main.tf</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id  # <--- Dynamic!
  instance_type = "t3.micro"
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📌 Data Source Lifecycle</div>
                    <p>Data sources are read during the plan phase by default. If a data source depends on a resource created in the same run, Terraform defers the read until apply.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-diagram-title">Plan vs Apply Reads</div>
                        <div class="ascii-content">
1) data "aws_ami" "ubuntu"  ---> Read at PLAN
2) data "aws_lb" "new" (depends_on = aws_lb.main)
   ---> Read at APPLY (resource doesn't exist yet)
                        </div>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Prefer filters over hardcoding:</strong> Filters keep your code region-safe and future-proof.</li>
                        <li><strong>Use <code>depends_on</code> sparingly:</strong> It can force apply-time reads and slow plans.</li>
                        <li><strong>Fail fast:</strong> If a data source lookup fails, the plan fails early (good for safety).</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Data Source Gotchas</div>
                    <ul>
                        <li><strong>Eventually consistent APIs:</strong> Newly created resources may not appear immediately.</li>
                        <li><strong>Multiple matches:</strong> Overly broad filters can return the wrong resource.</li>
                        <li><strong>Region mismatch:</strong> Data sources use the provider region.</li>
                    </ul>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Lookup by Tag</span>
                    </div>
                    <pre>data "aws_vpc" "selected" {
  filter {
    name   = "tag:Environment"
    values = ["prod"]
  }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.selected.id]
  }
  filter {
    name   = "tag:Tier"
    values = ["private"]
  }
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧠 Data Source Caching</div>
                    <p>Terraform does not cache data sources across runs. Each plan re-reads from the provider.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Data Source Patterns</div>
                    <div class="code-block">
                        <pre># Lookup latest AMI per region
data "aws_ami" "latest" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Read existing VPC by ID
data "aws_vpc" "existing" {
  id = var.vpc_id
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Advanced Data Lookups</div>
                    <div class="code-block">
                        <pre># Current account and region
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# VPC by tag
data "aws_vpc" "main" {
  filter {
    name   = "tag:Name"
    values = ["main"]
  }
}

# Subnets by tag and VPC
data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }
  filter {
    name   = "tag:Tier"
    values = ["private"]
  }
}

# Security group by name
data "aws_security_group" "app" {
  filter {
    name   = "group-name"
    values = ["app-sg"]
  }
  vpc_id = data.aws_vpc.main.id
}

# Use in resources
resource "aws_instance" "app" {
  ami           = data.aws_ami.latest.id
  instance_type = var.instance_type
  subnet_id     = data.aws_subnets.private.ids[0]
  vpc_security_group_ids = [data.aws_security_group.app.id]
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ Data Source Checklist</div>
                    <ul>
                        <li>Filters are specific and stable.</li>
                        <li>Region matches expected resources.</li>
                        <li>Lookups fail fast when missing.</li>
                        <li>Results are consumed explicitly.</li>
                        <li>Minimize unnecessary API calls.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // ========================
        // 10. Expressions & Language
        // ========================
        'expressions': `
            <div class="content-card">
                <h2><span class="icon">⚡</span> Expressions & Functions</h2>
                <p>HCL is not just JSON. It's a programming language with functions, loops, and conditionals.</p>

                <h3>The Splat Operator (*)</h3>
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Transforming Lists</div>
                    <div class="ascii-content">
resource "aws_instance" "web" {
  count = 3
  # ...
}

# How to get ALL IP addresses?

var.web_ips = aws_instance.web[*].public_ip

┌─────────────────────┐       ┌────────────────────────┐
│ aws_instance.web    │       │ RESULT (List)          │
│ [0] -> public_ip: A │       │                        │
│ [1] -> public_ip: B │ ────► │ [ "A", "B", "C" ]      │
│ [2] -> public_ip: C │       │                        │
└─────────────────────┘       └────────────────────────┘
                    </div>
                </div>

                <h3>Dynamic Blocks</h3>
                <p>Use <code>dynamic</code> to generate nested blocks (like ingress rules) from a list.</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">main.tf</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>variable "ingress_ports" {
  default = [80, 443, 22]
}

resource "aws_security_group" "web" {
  name = "web-sg"

  # DYNAMIC BLOCK GENERATOR
  dynamic "ingress" {
    for_each = var.ingress_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔄 For Loops (List Comprehension)</div>
                    <p>Transform lists and maps just like in Python.</p>
                    <div class="code-block">
                        <pre># Uppercase all names
[for s in var.list : upper(s)]

# Filter a list
[for s in var.list : s if s != ""]

# Transform List to Map
{for s in var.list : s => upper(s)}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚖️ Conditionals & Safe Lookups</div>
                    <div class="code-block">
                        <pre># Conditional expression
var.environment == "prod" ? 3 : 1

# Safe lookup with default
lookup(var.tags, "Owner", "unknown")

# Try first non-error value
try(var.optional_setting, "fallback")</pre>
                    </div>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Map Comprehension</div>
                    <div class="ascii-content">
Input:
var.ports = [80, 443, 8080]

Expression:
{ for p in var.ports : "port_\${p}" => p }

Result:
{
  "port_80"   = 80
  "port_443"  = 443
  "port_8080" = 8080
}
                    </div>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Question:</strong> "How do you handle optional arguments in Terraform?"<br>
                    <strong>Answer:</strong> Use <code>try()</code>, <code>lookup()</code>, or conditional expressions to fall back when attributes are null or missing.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Common Functions</div>
                    <div class="code-block">
                        <pre># Merging maps
merge({a = 1}, {b = 2})

# Zipping into a map
zipmap(["a","b"], [1,2])

# Coalesce first non-null
coalesce(var.primary, var.fallback)</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Flatten & Distinct</div>
                    <div class="code-block">
                        <pre># Flatten a list of lists
flatten([["a","b"], ["c"]])  # => ["a","b","c"]

# Remove duplicates
distinct(["a","a","b"])      # => ["a","b"]</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔁 Dynamic Blocks: Pattern</div>
                    <div class="code-block">
                        <pre>dynamic "ingress" {
  for_each = var.ports
  content {
    from_port = ingress.value
    to_port   = ingress.value
    protocol  = "tcp"
  }
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📚 Expression Cookbook</div>
                    <div class="code-block">
                        <pre># Build a map of AZ -> subnet
zipmap(var.azs, aws_subnet.private[*].id)

# Filter only prod resources
{ for k, v in var.tags : k => v if k != "Environment" || v == "prod" }

# Conditional list
var.enable_logs ? ["logs"] : []

# Build names with format
format("%s-%s-%s", var.app, var.env, var.region)

# Safe access nested object
try(var.config.db.port, 5432)

# Default to empty list
coalesce(var.allowed_cidrs, [])

# Convert list to set for for_each
toset(var.subnet_ids)

# Slice first two subnets
slice(var.subnet_ids, 0, 2)

# Merge multiple tag maps
merge(local.base_tags, var.extra_tags)

# Flatten a nested list
flatten([var.public_subnets, var.private_subnets])</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Function Groups</div>
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Group</th>
                                    <th>Examples</th>
                                    <th>Use Case</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>String</td>
                                    <td><code>format</code>, <code>upper</code>, <code>replace</code></td>
                                    <td>Normalize names</td>
                                </tr>
                                <tr>
                                    <td>Collection</td>
                                    <td><code>merge</code>, <code>zipmap</code>, <code>flatten</code></td>
                                    <td>Transform lists/maps</td>
                                </tr>
                                <tr>
                                    <td>Numeric</td>
                                    <td><code>min</code>, <code>max</code>, <code>ceil</code></td>
                                    <td>Capacity math</td>
                                </tr>
                                <tr>
                                    <td>Type/Check</td>
                                    <td><code>can</code>, <code>try</code></td>
                                    <td>Safe evaluations</td>
                                </tr>
                                <tr>
                                    <td>Path/File</td>
                                    <td><code>file</code>, <code>templatefile</code></td>
                                    <td>Read configs</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📦 HCL Pattern Library</div>
                    <div class="code-block">
                        <pre># Conditional object
locals {
  db = var.enable_db ? {
    engine = "postgres"
    size   = "db.t3.micro"
  } : null
}

# Map of environment to CIDR
locals {
  env_cidr = {
    dev  = "10.0.0.0/16"
    prod = "10.1.0.0/16"
  }
}

# Build tags once
locals {
  common_tags = {
    Project = var.project
    Env     = var.env
  }
}

# Merge tags
locals {
  tags = merge(local.common_tags, var.extra_tags)
}

# Conditional resource count
resource "aws_instance" "debug" {
  count = var.enable_debug ? 1 : 0
  ami   = var.ami_id
}

# for_each from map
resource "aws_s3_bucket" "env" {
  for_each = {
    dev  = "app-dev-bucket"
    prod = "app-prod-bucket"
  }
  bucket = each.value
}

# for_each from list (converted to set)
resource "aws_security_group" "tier" {
  for_each = toset(["web", "app", "db"])
  name     = "sg-\${each.key}"
}

# Filter a map
locals {
  prod_only = { for k, v in var.env_cidr : k => v if k == "prod" }
}

# Build a list of IDs
locals {
  subnet_ids = [for s in aws_subnet.private : s.id]
}

# Conditional list entries
locals {
  cidrs = compact([
    var.include_office ? var.office_cidr : null,
    var.include_vpn ? var.vpn_cidr : null
  ])
}

# Templatefile with vars
locals {
  user_data = templatefile("\${path.module}/user_data.tftpl", {
    env = var.env
  })
}

# Fileset usage
locals {
  policy_files = fileset("\${path.module}/policies", "*.json")
}

# Read file contents
locals {
  policy_json = file("\${path.module}/policies/s3.json")
}

# Join and split
locals {
  name = join("-", [var.project, var.env])
  parts = split("-", local.name)
}

# Numeric math
locals {
  asg_desired = max(2, var.instance_count)
}

# Boolean logic
locals {
  enable_https = var.env == "prod" && var.enable_tls
}

# Safe access to nested objects
locals {
  db_port = try(var.config.db.port, 5432)
}

# Convert list to map with index
locals {
  indexed = { for idx, v in var.azs : idx => v }
}

# Sort for stable ordering
locals {
  sorted_azs = sort(var.azs)
}

# Distinct values
locals {
  unique_tags = distinct(var.tags)
}

# Set operations
locals {
  common = setintersection(var.set_a, var.set_b)
}

# String replace
locals {
  safe_name = replace(var.name, "_", "-")
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 11. Dependency Management
        // ========================
        'dependencies': `
            <div class="content-card">
                <h2><span class="icon">🔗</span> Dependency Management</h2>
                <p>Terraform builds a <strong>Dependency Graph (DAG)</strong> to determine the order of operations and parallelism.</p>
                
                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">The DAG (Directed Acyclic Graph)</div>
                    <div class="ascii-content">
       ┌──────────────┐
       │   VPC        │
       └──────┬───────┘
              │
       ┌──────▼───────┐
       │   Subnet     │
       └──────┬───────┘
              │ (Implicit Dependency: subnet references vpc.id)
       ┌──────▼───────┐
       │  Instance    │
       └──────┬───────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼───┐           ┌───▼───┐
│  EIP  │           │Volume │
└───┬───┘           └───┬───┘
    │                   │
    └─────────┬─────────┘
              │
       ┌──────▼───────┐
       │ Output IP    │
       └──────────────┘
                    </div>
                </div>

                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Syntax</th>
                                <th>When to use</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Implicit</strong></td>
                                <td><code>vpc_id = aws_vpc.main.id</code></td>
                                <td><span class="badge badge-green">ALWAYS</span> (99% of cases)</td>
                            </tr>
                            <tr>
                                <td><strong>Explicit</strong></td>
                                <td><code>depends_on = [aws_s3_bucket.log]</code></td>
                                <td><span class="badge badge-orange">RARELY</span> (Hidden dependencies)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Circular Dependencies (The Enemy)</div>
                    <div class="ascii-content">
<span class="error">ERROR: Cycle: aws_security_group.A, aws_security_group.B</span>

[SG A] needs [SG B] ID  ──►  Reference
      ▲                               │
      │                               │
      └───────────────────────────────┘
            Reference

<span class="success">SOLUTION:</span> Break the cycle! 
Use <code>aws_security_group_rule</code> resources outside the SG blocks.
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔍 Visualize the Graph</div>
                    <p>Terraform can render the dependency graph. This is huge for debugging large modules.</p>
                    <div class="code-block">
                        <pre>terraform graph | dot -Tsvg > graph.svg</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use implicit deps first:</strong> References create dependencies automatically.</li>
                        <li><strong>Explicit deps for hidden relationships:</strong> Provisioners, local files, or external tools.</li>
                        <li><strong>Module dependency:</strong> <code>module.app</code> can depend on <code>module.network</code> via outputs or <code>depends_on</code>.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚙️ Parallelism Control</div>
                    <p>Terraform can execute independent graph nodes in parallel. Limit parallelism to avoid API throttling.</p>
                    <div class="code-block">
                        <pre>terraform apply -parallelism=5</pre>
                    </div>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Implicit Module Dependency</div>
                    <div class="ascii-content">
module "network" -> outputs subnet_ids
module "app"     -> uses module.network.subnet_ids
=> app depends on network (implicit)
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧯 Breaking Cycles</div>
                    <p>Split dependencies into separate resources (e.g., security group + rules) to avoid cycles.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Explicit Depends On Use Cases</div>
                    <ul>
                        <li><strong>Provisioners:</strong> Ensure data is ready before script runs.</li>
                        <li><strong>External systems:</strong> Local files or null resources controlling order.</li>
                        <li><strong>Hidden dependencies:</strong> When values are not directly referenced.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚠️ Dependency Pitfalls</div>
                    <ul>
                        <li><strong>Overusing depends_on:</strong> Can serialize execution unnecessarily.</li>
                        <li><strong>Hidden references:</strong> Strings with IDs do not create deps.</li>
                        <li><strong>Cycles:</strong> Split resources to break circular dependencies.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 12. Modules Internals
        // ========================
        'modules': `
            <div class="content-card">
                <h2><span class="icon">📦</span> Modules Deep Dive</h2>
                <p>Modules are the <strong>Lego blocks</strong> of Terraform. They allow you to encapsulate resources and reuse them across projects.</p>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Module Interactions</div>
                    <div class="ascii-content">
      ROOT MODULE (main.tf)
      ┌───────────────────────────────────────────────┐
      │                                               │
      │  module "vpc" {                               │
      │    source = "./modules/network"               │
      │    cidr   = "10.0.0.0/16"  ───(INPUT)────┐    │
      │  }                                       │    │
      │                                          │    │
      │  resource "aws_instance" "app" {         │    │
      │    subnet_id = module.vpc.subnet_id  ◄───┼────┼─(OUTPUT)──┐
      │  }                                       │    │           │
      │                                          │    │           │
      └──────────────────────────────────────────┼────┘           │
                                                 │                │
            ┌────────────────────────────────────▼────────────────┴─────────────────┐
            │ CHILD MODULE (./modules/network)                                      │
            │                                                                       │
            │  variables.tf ◄───────────────────────────────────────────────────────┘
            │  main.tf (resource "aws_subnet" "x" { ... })                          │
            │  outputs.tf  ────────────────────────────────────────────────────────►
            │                                                                       │
            └───────────────────────────────────────────────────────────────────────┘
                    </div>
                </div>

                <h3>Module Anatomy</h3>
                <div class="three-col-grid">
                    <div class="col-card">
                        <div class="col-header">variables.tf</div>
                        <div class="col-body">The <strong>Inputs</strong> (Parameters). Defines what the module accepts.</div>
                    </div>
                    <div class="col-card">
                        <div class="col-header">main.tf</div>
                        <div class="col-body">The <strong>Logic</strong>. The actual resources created by the module.</div>
                    </div>
                    <div class="col-card">
                        <div class="col-header">outputs.tf</div>
                        <div class="col-body">The <strong>Returns</strong>. Values exposed to the caller.</div>
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Calling a Module</span>
                        <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
                    </div>
                    <pre>module "website_s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws" # Public Registry
  version = "3.10.0"

  bucket = "my-s3-bucket"
  acl    = "private"

  versioning = {
    enabled = true
  }
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📍 Module Source Types</div>
                    <ul>
                        <li><strong>Local Path:</strong> <code>source = "./modules/vpc"</code></li>
                        <li><strong>Terraform Registry:</strong> <code>source = "terraform-aws-modules/vpc/aws"</code></li>
                        <li><strong>Git:</strong> <code>source = "git::https://github.com/org/repo.git//path"</code></li>
                        <li><strong>S3/HTTP:</strong> Use when packaging private modules.</li>
                    </ul>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Pin module versions:</strong> Use <code>version = "x.y.z"</code> to avoid surprises.</li>
                        <li><strong>Pass providers explicitly:</strong> Use <code>providers = { aws = aws.west }</code> for multi-account setups.</li>
                        <li><strong>Keep modules small:</strong> Prefer composable modules instead of mega-modules.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Testing Modules in Isolation</div>
                    <p>Use a small <code>examples/</code> folder to demonstrate and validate modules independently.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
modules/
  vpc/
    main.tf
    variables.tf
    outputs.tf
    examples/
      simple/
        main.tf
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧱 Module Composition</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
root
├── module.network
├── module.security
└── module.app
    └── module.logging
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔐 Module Inputs Hygiene</div>
                    <p>Keep inputs minimal and typed. Avoid passing entire objects when only a few values are needed.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Module Versioning</div>
                    <div class="code-block">
                        <pre>module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"
  # pin versions to avoid breaking changes
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Passing Providers to Modules</div>
                    <div class="code-block">
                        <pre>module "logging" {
  source = "./modules/logging"
  providers = {
    aws = aws.west
  }
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Module Interface Example</div>
                    <div class="code-block">
                        <pre># variables.tf in module
variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }

# outputs.tf in module
output "alb_dns" {
  value = aws_lb.main.dns_name
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">❓ Module FAQ</div>
                    <p><strong>Q:</strong> "When should I create a module?"<br>
                    <strong>A:</strong> When a pattern repeats across environments or projects.</p>
                    <p><strong>Q:</strong> "How big should a module be?"<br>
                    <strong>A:</strong> Small and composable. Avoid mega-modules.</p>
                    <p><strong>Q:</strong> "Can modules be nested?"<br>
                    <strong>A:</strong> Yes, but keep dependency chains shallow.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Module README Template</div>
                    <div class="code-block">
                        <pre># Module: vpc

## Purpose
Creates a VPC with public/private subnets, routing, and NAT.

## Inputs
| Name | Type | Default | Description |
|------|------|---------|-------------|
| cidr_block | string | "10.0.0.0/16" | VPC CIDR |
| az_count | number | 2 | Number of AZs |
| enable_nat | bool | true | Create NAT gateways |

## Outputs
| Name | Description |
|------|-------------|
| vpc_id | VPC identifier |
| public_subnet_ids | Public subnet IDs |
| private_subnet_ids | Private subnet IDs |

## Example
module "vpc" {
  source     = "./modules/vpc"
  cidr_block = "10.10.0.0/16"
  az_count   = 3
  enable_nat = true
}

## Notes
- Requires AWS provider
- Use with remote state</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Multi-Module Example</div>
                    <div class="code-block">
                        <pre>module "network" {
  source = "./modules/network"
  cidr_block = "10.0.0.0/16"
}

module "security" {
  source = "./modules/security"
  vpc_id = module.network.vpc_id
}

module "app" {
  source      = "./modules/app"
  subnet_ids  = module.network.private_subnet_ids
  sg_id       = module.security.app_sg_id
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 13. Environment Separation
        // ========================
        'environments': `
            <div class="content-card">
                <h2><span class="icon">🌍</span> Environment Isolation</h2>
                <p>Never mix Production and Development state. Isolation is key to preventing disasters.</p>

                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Strategy</th>
                                <th>Explanation</th>
                                <th>Safety Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Workspaces</strong></td>
                                <td>Single config, multiple states in same backend path (env:/dev/...).</td>
                                <td><span class="badge badge-orange">Medium</span> Easy to apply to wrong env.</td>
                            </tr>
                            <tr>
                                <td><strong>Directory Layout</strong></td>
                                <td>Separate folders per environment (dev/, prod/). Completely isolated.</td>
                                <td><span class="badge badge-green">High</span> Standard Enterprise Pattern.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Directory Layout Strategy (Best Practice)</div>
                    <div class="ascii-content">
infrastructure/
├── modules/                   <-- SHARED BLUEPRINTS
│   ├── networking/
│   ├── compute/
│   └── database/
│
├── environments/              <-- LIVE ENVIRONMENTS
    ├── dev/
    │   ├── main.tf            <-- Calls modules with Dev variables
    │   ├── backend.tf         <-- state keys: dev/terraform.tfstate
    │   └── variables.tf
    │
    └── prod/
        ├── main.tf            <-- Calls modules with Prod variables
        ├── backend.tf         <-- state keys: prod/terraform.tfstate
        └── variables.tf
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Workspaces: When to Use</div>
                    <p>Workspaces are convenient for <strong>non-prod</strong> environments or experiments, but risky for production because the same codebase can target multiple states.</p>
                    <div class="code-block">
                        <pre>terraform workspace list
terraform workspace new dev
terraform workspace select prod</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Separate AWS accounts:</strong> The safest isolation for prod vs dev.</li>
                        <li><strong>Distinct backends:</strong> Use unique state keys per environment.</li>
                        <li><strong>Guardrails:</strong> Add policy checks (Sentinel/OPA) to prevent prod mistakes.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚧 Workspace Pitfalls</div>
                    <ul>
                        <li><strong>Shared code:</strong> Easy to apply prod changes with dev settings.</li>
                        <li><strong>State confusion:</strong> Human error selecting the wrong workspace.</li>
                        <li><strong>Limited drift controls:</strong> Harder to enforce per-env policies.</li>
                    </ul>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Backend Key Naming</span>
                    </div>
                    <pre>key = "prod/network/terraform.tfstate"
# env/layer/stack.tfstate is a common pattern</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Environment Ownership</div>
                    <p>Assign clear ownership of prod changes. Limit write access to CI roles only.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚀 Promotion Flow</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
dev -> stage -> prod
  plan + apply in each environment
  promote the same module versions
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Env-Specific Variables</div>
                    <div class="code-block">
                        <pre>dev.auto.tfvars
stage.auto.tfvars
prod.auto.tfvars</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔐 Account Isolation</div>
                    <p>Best practice is separate AWS accounts for dev/stage/prod. This reduces blast radius and prevents accidental cross-environment changes.</p>
                </div>
            </div>
        `,

        // ========================
        // 14. Lifecycle Meta-Arguments
        // ========================
        'lifecycle': `
            <div class="content-card">
                <h2><span class="icon">🧬</span> Lifecycle Meta-Arguments</h2>
                <p>Modify the standard Create -> Update -> Delete behavior.</p>
                
                <div class="tech-explanation">
                    <div class="tech-explanation-header">🔄 create_before_destroy</div>
                    <p>Default behavior: Destroy old resource -> Create new one (Downtime!).<br>
                    With this flag: Create new one -> Verify mapped -> Destroy old one (Zero Downtime).</p>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-content">
STANDARD UPDATE (e.g. EC2 user_data change)
  1. Destroy Instance A ❌ (Service Down)
  2. Create Instance B  ✅ (Service Up)

CREATE BEFORE DESTROY
  1. Create Instance B  ✅ (Both running)
  2. Map Traffic to B   🔀
  3. Destroy Instance A ❌ (No Downtime)
                    </div>
                </div>

                <div class="code-block">
                    <pre>resource "aws_autoscaling_group" "app" {
  # ... config ...

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [target_group_arns] # Don't reset external changes
  }
}</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Question</div>
                    <p><strong>Q:</strong> "How do you prevent a critical resource (like a production DB) from being deleted?"<br>
                    <strong>A:</strong> Use <code>lifecycle { prevent_destroy = true }</code>. Terraform will error and exit if you try to destroy it.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧯 Other Lifecycle Controls</div>
                    <div class="code-block">
                        <pre>resource "aws_db_instance" "prod" {
  # ...
  lifecycle {
    prevent_destroy     = true
    ignore_changes      = [password, tags["LastUpdated"]]
    replace_triggered_by = [aws_security_group.db_sg]
  }
}</pre>
                    </div>
                    <p><strong>ignore_changes</strong> is useful for attributes modified by external systems, but use it carefully or you might miss drift.</p>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use <code>replace_triggered_by</code>:</strong> Safely replace dependents when a parent changes.</li>
                        <li><strong>Document lifecycle choices:</strong> Prevent_destroy should be intentional and reviewed.</li>
                        <li><strong>Track ignored attrs:</strong> Too many ignores hide real drift.</li>
                    </ul>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">ignore_changes Example</span>
                    </div>
                    <pre>resource "aws_autoscaling_group" "app" {
  # ...
  lifecycle {
    ignore_changes = [desired_capacity]
  }
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚠️ Lifecycle Tradeoffs</div>
                    <p>Overuse of <code>ignore_changes</code> makes drift invisible. Use it only when external systems manage specific fields.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 replace_triggered_by Example</div>
                    <div class="code-block">
                        <pre>resource "aws_launch_template" "app" {
  # ...
}

resource "aws_autoscaling_group" "app" {
  # ...
  lifecycle {
    replace_triggered_by = [aws_launch_template.app]
  }
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔁 create_before_destroy Use Case</div>
                    <p>Critical for load balancers, databases with replicas, and ASGs where downtime is unacceptable.</p>
                </div>
            </div>
        `,

        // ========================
        // 15. Error Handling & Debugging
        // ========================
        'debugging': `
            <div class="content-card">
                <h2><span class="icon">🐛</span> Debugging Deep Dive</h2>
                <p>When Terraform fails, don't panic. Read the logs.</p>

                <h3>Log Levels (TF_LOG)</h3>
                <div class="code-block">
                    <pre>export TF_LOG=TRACE  # Maximum verbosity (Show me everything!)
export TF_LOG=DEBUG  # Best for API errors (Show me the HTTP requests)
export TF_LOG=INFO   # General info
export TF_LOG=WARN   # Only warnings
export TF_LOG=ERROR  # Only critical errors</pre>
                </div>

                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Error Type</th>
                                <th>Example</th>
                                <th>Solution</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Syntactic</strong></td>
                                <td>"Argument or block definition required"</td>
                                <td>You missed a closing brace <code>}</code> or misspelled a keyword. Check your HCL.</td>
                            </tr>
                            <tr>
                                <td><strong>Cyclic</strong></td>
                                <td>"Cycle: resource A, resource B"</td>
                                <td>Circular dependency. A needs B, B needs A. Refactor using independent resources.</td>
                            </tr>
                            <tr>
                                <td><strong>API/Cloud</strong></td>
                                <td>"403 Forbidden" or "LimitExceeded"</td>
                                <td>AWS rejected the request. incorrect credentials or service quotas. Check <code>TF_LOG=DEBUG</code>.</td>
                            </tr>
                            <tr>
                                <td><strong>State Lock</strong></td>
                                <td>"Error acquiring the state lock"</td>
                                <td>Someone else is running apply. If sure nobody is, use <code>force-unlock</code>.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Troubleshooting Workflow</div>
                    <ol>
                        <li>Read the error message (it's usually helpful).</li>
                        <li>Run <code>terraform validate</code>.</li>
                        <li>Enable logging: <code>export TF_LOG=DEBUG</code>.</li>
                        <li>Isolate the resource: <code>terraform apply -target=aws_instance.stuck_resource</code>.</li>
                    </ol>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📂 Log File + Provider Logs</div>
                    <div class="code-block">
                        <pre># Write logs to file
export TF_LOG=DEBUG
export TF_LOG_PATH=./terraform-debug.log

# Split Core vs Provider (useful for plugin issues)
export TF_LOG_CORE=INFO
export TF_LOG_PROVIDER=DEBUG</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use <code>terraform console</code>:</strong> Evaluate expressions and debug complex locals.</li>
                        <li><strong>Check state lock:</strong> In S3 backends with DynamoDB, stale locks are common.</li>
                        <li><strong>Avoid <code>-target</code> in normal work:</strong> It can create hidden drift if overused.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Common Debug Steps</div>
                    <ol>
                        <li>Re-run with <code>TF_LOG=DEBUG</code> and capture logs.</li>
                        <li>Validate provider credentials and region.</li>
                        <li>Check API limits or service quotas.</li>
                        <li>Confirm state matches what you expect.</li>
                    </ol>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">State Inspection</span>
                    </div>
                    <pre>terraform state list
terraform state show aws_instance.web</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Debugging Provider Errors</div>
                    <p>Most provider errors are API errors. Check request IDs in logs and review service quotas.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Common Errors</div>
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Error</th>
                                    <th>Cause</th>
                                    <th>Fix</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>"Provider config not present"</td>
                                    <td>Removed provider alias</td>
                                    <td>Restore provider block, destroy resource</td>
                                </tr>
                                <tr>
                                    <td>"Invalid index"</td>
                                    <td>count/for_each mismatch</td>
                                    <td>Check indexes and keys</td>
                                </tr>
                                <tr>
                                    <td>"Unsupported argument"</td>
                                    <td>Wrong provider version</td>
                                    <td>Upgrade/downgrade provider</td>
                                </tr>
                                <tr>
                                    <td>"Error acquiring state lock"</td>
                                    <td>Stale lock</td>
                                    <td>Verify and <code>force-unlock</code></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📁 Debugging with Reduced Scope</div>
                    <p>Use <code>-target</code> only for rescue, then follow up with a full plan to confirm no drift.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Useful Flags</div>
                    <div class="code-block">
                        <pre># Plan flags
terraform plan -refresh=false
terraform plan -refresh-only
terraform plan -out=tfplan
terraform plan -target=aws_instance.web
terraform plan -var="env=dev"
terraform plan -var-file="dev.tfvars"

# Apply flags
terraform apply -auto-approve
terraform apply -target=aws_s3_bucket.logs

# Destroy flags
terraform destroy -target=aws_db_instance.main

# Workspace flags
terraform workspace select dev

# State flags
terraform state list
terraform state show aws_iam_role.app

# Output flags
terraform output -json
terraform output -raw vpc_id</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Troubleshooting Playbook</div>
                    <ol>
                        <li>Re-run with <code>TF_LOG=DEBUG</code>.</li>
                        <li>Check credentials and region.</li>
                        <li>Validate provider versions.</li>
                        <li>Inspect state for unexpected values.</li>
                        <li>Reduce scope with <code>-target</code> only if needed.</li>
                        <li>Confirm API limits or quotas.</li>
                        <li>Re-run plan after changes.</li>
                    </ol>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Terraform Env Vars</div>
                    <div class="code-block">
                        <pre># Logging
export TF_LOG=INFO
export TF_LOG_PATH=./terraform.log
export TF_LOG_CORE=INFO
export TF_LOG_PROVIDER=DEBUG

# Automation flags
export TF_IN_AUTOMATION=true
export TF_INPUT=0

# CLI args (global defaults)
export TF_CLI_ARGS="-no-color"
export TF_CLI_ARGS_plan="-parallelism=5"

# State locking
export TF_LOCK_TIMEOUT=5m

# Plugin cache
export TF_PLUGIN_CACHE_DIR="$HOME/.terraform.d/plugin-cache"

# Workspace
export TF_WORKSPACE=dev</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 16. Testing & Validation
        // ========================
        'testing': `
            <div class="content-card">
                <h2><span class="icon">🧪</span> Testing Pyramid</h2>
                <p>Infrastructure Code should be tested just like Application Code.</p>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">The Terraform Testing Pyramid</div>
                    <div class="ascii-content">
              ▲
             ╱ ╲
            ╱   ╲      E2E / MANUAL
           ╱_____\     (Clicking around)
          ╱       ╲
         ╱ INTEGR. ╲   TERRATEST (Golang)
        ╱___________\  (Spin up real resources -> Test -> Destroy)
       ╱             ╲
      ╱    COMPLIANCE ╲  OPA / SENTINEL (Policy As Code)
     ╱_________________\
    ╱                   ╲
   ╱    STATIC ANALYSIS  ╲  terraform validate / tflint / checkov
  ─────────────────────────
      FAST & CHEAP ─────► SLOW & EXPENSIVE
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">variable validation (Unit Test)</span>
                    </div>
                    <pre>variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "stage", "prod"], var.environment)
    error_message = "Environment must be dev, stage, or prod."
  }
}</pre>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">terratest_example.go (Integration Test)</span>
                    </div>
                    <pre>func TestTerraformAwsExample(t *testing.T) {
  // 1. Init and Apply
  terraform.InitAndApply(t, options)

  // 2. Run validations (e.g. check HTTP 200)
  url := terraform.Output(t, options, "url")
  http_helper.HttpGet(t, url, 200)

  // 3. Destroy (defer ensures this runs even if test fails)
  defer terraform.Destroy(t, options)
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Native Terraform Tests</div>
                    <p>Terraform supports <strong>test blocks</strong> for lightweight validation without external frameworks.</p>
                    <div class="code-block">
                        <pre>test {
  assert {
    condition = length(aws_subnet.public[*].id) >= 2
    error_message = "At least two public subnets are required."
  }
}</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Static checks first:</strong> <code>terraform fmt</code> + <code>validate</code> + <code>tflint</code>.</li>
                        <li><strong>Security scanning:</strong> Use Checkov or tfsec to catch risky defaults.</li>
                        <li><strong>Cost checks:</strong> Tools like Infracost help prevent surprises.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🛡️ Policy as Code</div>
                    <p>Use Sentinel or OPA to enforce constraints (no public S3, required tags, etc.).</p>
                    <div class="code-block">
                        <pre>deny["public_s3"] {
  input.resource.type == "aws_s3_bucket"
  input.resource.public == true
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Native Tests</div>
                    <div class="code-block">
                        <pre>terraform test</pre>
                    </div>
                    <p>Run native test blocks to validate assumptions without external tooling.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔍 Validate vs Test</div>
                    <p><code>terraform validate</code> checks syntax and schemas; tests validate behavior and invariants.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Testing Pipeline</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
1) terraform fmt
2) terraform validate
3) tflint / tfsec
4) terraform plan
5) terratest / terraform test
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Test Data Strategy</div>
                    <p>Use small, ephemeral environments for integration tests. Keep test runs short and deterministic.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Terratest Skeleton</div>
                    <div class="code-block">
                        <pre>func TestModule(t *testing.T) {
  options := &terraform.Options{
    TerraformDir: "../examples/simple",
    Vars: map[string]interface{}{
      "env": "test",
    },
  }

  defer terraform.Destroy(t, options)
  terraform.InitAndApply(t, options)

  vpcID := terraform.Output(t, options, "vpc_id")
  assert.NotEmpty(t, vpcID)
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Native Test Blocks Example</div>
                    <div class="code-block">
                        <pre>test {
  assert {
    condition     = length(aws_subnet.public[*].id) >= 2
    error_message = "At least two public subnets required."
  }

  assert {
    condition     = aws_lb.main.internal == false
    error_message = "ALB must be internet-facing."
  }

  assert {
    condition     = contains(keys(aws_iam_role.app.tags), "Owner")
    error_message = "Owner tag is required."
  }
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ Test Checklist</div>
                    <ul>
                        <li>Format and validate before tests.</li>
                        <li>Run lint/security checks.</li>
                        <li>Use small test environments.</li>
                        <li>Destroy resources after tests.</li>
                        <li>Capture logs for debugging.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 17. CI/CD & Automation
        // ========================
        'cicd': `
            <div class="content-card">
                <h2><span class="icon">🤖</span> CI/CD & Automation</h2>
                <p>Running Terraform from your laptop is a hobby. Running it from CI is engineering.</p>

                <h3>The Golden Workflow</h3>
                <div class="flow-container">
                    <div class="flow-step"><span>👨‍💻</span> Dev opens Pull Request</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-step"><span>🔍</span> CI runs \`terraform plan\`</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-step"><span>💬</span> Bot posts Plan as Comment on PR</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-step"><span>✅</span> Human Approves PR</div>
                    <div class="flow-arrow">↓</div>
                    <div class="flow-step"><span>🚀</span> CI runs \`terraform apply\` (on merge)</div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🛠️ Tools of the Trade</div>
                    <ul>
                        <li><strong>GitHub Actions / GitLab CI:</strong> Generic CI runners (Good start).</li>
                        <li><strong>Atlantis:</strong> Specialized PR bot for Terraform. Allows \`atlantis apply\` comments.</li>
                        <li><strong>Terraform Cloud / Spacelift:</strong> Managed platforms with policy enforcement and private runners.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔐 Secure Authentication</div>
                    <p>Prefer OIDC / Web Identity instead of storing long-lived AWS keys in CI.</p>
                    <div class="code-block">
                        <pre># Example: GitHub Actions -> AWS OIDC
# Configure AWS role trust for GitHub and use aws-actions/configure-aws-credentials</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Split plan/apply:</strong> Plan on PRs, apply on merge.</li>
                        <li><strong>Store plan file:</strong> <code>terraform plan -out=tfplan</code> for deterministic apply.</li>
                        <li><strong>Always lock state:</strong> Remote state with locking is mandatory in CI.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Plan Artifact Flow</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
PR -> terraform plan -out=tfplan
     -> store artifact
Merge -> terraform apply tfplan
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔒 Policy Gates</div>
                    <p>Many teams require policy checks before apply (Sentinel/OPA) to block unsafe changes.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧯 Break-Glass Process</div>
                    <p>Define an emergency path for urgent fixes (audited, time-boxed, and reviewed after).</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Example CI Workflow</div>
                    <div class="code-block">
                        <pre>name: terraform
on: [pull_request]
jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init
      - run: terraform fmt -check
      - run: terraform validate
      - run: terraform plan -out=tfplan</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚀 Apply Stage (on merge)</div>
                    <div class="code-block">
                        <pre>on:
  push:
    branches: [main]
jobs:
  apply:
    steps:
      - run: terraform init
      - run: terraform apply tfplan</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧾 Full Pipeline Outline</div>
                    <div class="code-block">
                        <pre>stages:
  - lint
  - plan
  - approve
  - apply

lint:
  - terraform fmt -check
  - terraform validate

plan:
  - terraform init
  - terraform plan -out=tfplan
  - upload tfplan artifact

approve:
  - manual approval gate

apply:
  - download tfplan artifact
  - terraform apply tfplan</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ CI/CD Hardening Checklist</div>
                    <ul>
                        <li><strong>OIDC auth:</strong> No long-lived AWS keys in CI.</li>
                        <li><strong>Least privilege:</strong> CI role scoped to required resources.</li>
                        <li><strong>Plan artifacts:</strong> Apply uses the exact plan file.</li>
                        <li><strong>Manual approval:</strong> Required for prod.</li>
                        <li><strong>State locking:</strong> Always enabled.</li>
                        <li><strong>Policy checks:</strong> OPA/Sentinel gates.</li>
                        <li><strong>Slack notifications:</strong> Notify on apply and failures.</li>
                        <li><strong>Drift detection:</strong> Scheduled refresh-only plans.</li>
                        <li><strong>Audit logs:</strong> Store plan/apply logs centrally.</li>
                        <li><strong>Runbooks:</strong> Document rollback steps.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📌 Plan Review Checklist</div>
                    <ul>
                        <li>Unexpected destroys?</li>
                        <li>ForceNew replacements?</li>
                        <li>Tag changes correct?</li>
                        <li>Region/account correct?</li>
                        <li>Output changes expected?</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 18. Scaling & Performance
        // ========================
        'scaling': `
            <div class="content-card">
                <h2><span class="icon">📈</span> Scaling & Performance</h2>
                <p>What happens when you have 5,000 resources? \`terraform plan\` takes 20 minutes.</p>

                <h3>Performance Killers</h3>
                <div class="component-grid">
                    <div class="component-box">
                        <div class="name">Large State Files</div>
                        <div class="desc">JSON parsing 50MB files is slow. Split your state!</div>
                    </div>
                    <div class="component-box">
                        <div class="name">Too Many API Calls</div>
                        <div class="desc">Refreshing state requires checking every resource.</div>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">⚡ Optimization: Refresh=false</div>
                    <p>If you know your real infrastructure hasn't changed outside of Terraform, you can skip the refresh step.</p>
                    <div class="code-block">
                        <pre>$ terraform plan -refresh=false</pre>
                    </div>
                    <p class="warning">⚠️ DANGER: If someone DID change something manually, you won't detect the drift.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 The Solution: Componentization</div>
                    <p>Don't put all your eggs in one basket. Split infrastructure into smaller, independent states.</p>
                    <p><strong>Bad:</strong> One state for VPC + App + DB (Giant Blast Radius).</p>
                    <p><strong>Good:</strong> Layered States.</p>
                    <ul>
                        <li>Layer 0: VPC & Networking (Changes yearly)</li>
                        <li>Layer 1: Databases (Changes monthly)</li>
                        <li>Layer 2: App Containers (Changes daily)</li>
                    </ul>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use <code>-parallelism</code>:</strong> Tune concurrency for large plans.</li>
                        <li><strong>Detect drift safely:</strong> <code>terraform plan -refresh-only</code>.</li>
                        <li><strong>Cache providers:</strong> Avoid repeated downloads in CI.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧱 State Sharding Strategy</div>
                    <p>Split large states by domain to reduce plan time and blast radius.</p>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
state-network
state-databases
state-apps
state-observability
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Refresh-Only Plans</div>
                    <div class="code-block">
                        <pre>terraform plan -refresh-only</pre>
                    </div>
                    <p>Safely detect drift without proposing changes.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧠 Provider Throttling</div>
                    <p>When APIs throttle, reduce <code>-parallelism</code> or split states to limit requests.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">⚡ Performance Checklist</div>
                    <ul>
                        <li><strong>Split states:</strong> Smaller states plan faster.</li>
                        <li><strong>Reduce refresh scope:</strong> Use <code>-refresh-only</code> for drift scans.</li>
                        <li><strong>Minimize data sources:</strong> Excessive lookups slow plans.</li>
                        <li><strong>Provider caching:</strong> Avoid re-downloading providers in CI.</li>
                        <li><strong>Limit parallelism:</strong> Prevent API throttling.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Large State Warning Signs</div>
                    <ul>
                        <li>Plans take longer than 10 minutes.</li>
                        <li>Frequent API throttling errors.</li>
                        <li>High merge conflicts in state.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🗂️ Example State Split</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
infra/
├── network/
├── security/
├── databases/
└── apps/
                        </div>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">✅ Scaling Tips</div>
                    <ul>
                        <li>Keep state files small and focused.</li>
                        <li>Avoid unnecessary data sources.</li>
                        <li>Limit provider parallelism for API stability.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 19. Advanced Edge Cases
        // ========================
        'edge-cases': `
            <div class="content-card">
                <h2><span class="icon">🧗</span> Advanced Edge Cases</h2>
                <p>Things that will make you pull your hair out.</p>

                <h3>Renaming Resources</h3>
                <p>If you rename <code>aws_instance.foo</code> to <code>aws_instance.bar</code>, Terraform thinks you want to <strong>DELETE</strong> foo and <strong>CREATE</strong> bar.</p>
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">Solution: state mv</span>
                    </div>
                    <pre>$ terraform state mv aws_instance.foo aws_instance.bar</pre>
                </div>
                <p>This tells Terraform: "Don't destroy it, just update the name in the state file."</p>

                <h3>Importing Existing Infra</h3>
                <p>You created an S3 bucket manually. Now you want Terraform to manage it.</p>
                <div class="code-block">
                    <pre># 1. Write the code block
resource "aws_s3_bucket" "legacy" {
  bucket = "my-manual-bucket"
}

# 2. Import it into state
$ terraform import aws_s3_bucket.legacy my-manual-bucket</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Question:</strong> "How do I fix a 'Provider configuration not present' error during destroy?"<br>
                    <strong>Answer:</strong> This happens when you remove a provider block from code (e.g., an alias) but resources in state still belong to it. You must keep the provider block (even if empty) until all its resources are destroyed.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Resource Address Changes</div>
                    <p>Terraform supports <strong>moved blocks</strong> to rename resources safely without manual state operations.</p>
                    <div class="code-block">
                        <pre>moved {
  from = aws_instance.foo
  to   = aws_instance.bar
}</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use <code>terraform state mv</code> cautiously:</strong> Always back up state first.</li>
                        <li><strong>Import with for_each:</strong> Use addresses like <code>resource.type.name["key"]</code>.</li>
                        <li><strong>Don’t delete state file:</strong> Recover with remote state versioning if needed.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Provider Alias Migration</div>
                    <p>When changing provider aliases, use <code>moved</code> blocks or keep the old alias until cleanup is complete.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧯 Accidental Destroy Recovery</div>
                    <p>Restore previous state version in S3, then re-run <code>terraform plan</code> to reconcile.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Import at Scale</div>
                    <p>For large imports, script resource addresses and IDs to avoid manual errors.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Moving from count to for_each</div>
                    <div class="code-block">
                        <pre># Old
resource "aws_s3_bucket" "logs" {
  count  = 2
  bucket = "logs-\${count.index}"
}

# New
resource "aws_s3_bucket" "logs" {
  for_each = toset(["a","b"])
  bucket   = "logs-\${each.key}"
}

# Use moved blocks to preserve state</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Moved Blocks Example</div>
                    <div class="code-block">
                        <pre>moved {
  from = aws_s3_bucket.logs[0]
  to   = aws_s3_bucket.logs["a"]
}</pre>
                    </div>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">❓ Edge Case FAQ</div>
                    <p><strong>Q:</strong> "What if a resource was renamed in a module?"<br>
                    <strong>A:</strong> Use <code>moved</code> blocks or <code>state mv</code>.</p>
                    <p><strong>Q:</strong> "Can I change count to for_each safely?"<br>
                    <strong>A:</strong> Yes, but map old addresses with <code>moved</code> blocks.</p>
                    <p><strong>Q:</strong> "Why is a resource forcing replacement?"<br>
                    <strong>A:</strong> A ForceNew attribute changed.</p>
                    <p><strong>Q:</strong> "How do I handle partial applies?"<br>
                    <strong>A:</strong> Fix the root cause and run a full plan/apply.</p>
                </div>
            </div>
        `,

        // ========================
        // 20. Anti-Patterns & Best Practices
        // ========================
        'antipatterns': `
            <div class="content-card">
                <h2><span class="icon">🚫</span> Anti-Patterns & Best Practices</h2>
                <p>Avoid these common traps.</p>

                <div class="comparison-table">
                    <table>
                        <tr>
                            <th>Anti-Pattern</th>
                            <th>Best Practice</th>
                            <th>Why?</th>
                        </tr>
                        <tr>
                            <td>Hardcoding IDs</td>
                            <td>Data Sources / Inputs</td>
                            <td>IDs change if you recreate resources.</td>
                        </tr>
                        <tr>
                            <td>Huge Monorepo State</td>
                            <td>Split State by Env/App</td>
                            <td>Limits blast radius if you break state.</td>
                        </tr>
                        <tr>
                            <td>Committing <code>.tfvars</code></td>
                            <td>Use <code>*.auto.tfvars</code> (gitignored)</td>
                            <td>Don't leak secrets to GitHub!</td>
                        </tr>
                        <tr>
                            <td>Inline Provisioners</td>
                            <td>User Data / Packer</td>
                            <td><code>local-exec</code> is brittle and hard to track.</td>
                        </tr>
                        <tr>
                            <td>Unpinned Provider Versions</td>
                            <td>Pin with <code>required_providers</code></td>
                            <td>Avoid breaking changes on upgrades.</td>
                        </tr>
                        <tr>
                            <td>Single State for All Envs</td>
                            <td>Separate state per environment</td>
                            <td>Lower blast radius and safer rollouts.</td>
                        </tr>
                        <tr>
                            <td>Overusing <code>-target</code></td>
                            <td>Apply full plan</td>
                            <td>Targeted apply can create hidden drift.</td>
                        </tr>
                        <tr>
                            <td>Skipping <code>terraform fmt</code></td>
                            <td>Format on save / CI</td>
                            <td>Reduces diff noise and errors.</td>
                        </tr>
                        <tr>
                            <td>Local state in teams</td>
                            <td>Remote state with locking</td>
                            <td>Prevents corruption and conflicts.</td>
                        </tr>
                        <tr>
                            <td>Unreviewed plans</td>
                            <td>PR-based approval</td>
                            <td>Catch destructive changes early.</td>
                        </tr>
                    </table>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Anti-Pattern: No Tests</div>
                    <p>Skipping validation and security checks leads to avoidable outages and security incidents.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚫 Anti-Pattern: Manual Console Edits</div>
                    <p>Changes outside Terraform cause drift and surprise replacements.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚫 Anti-Pattern: Hidden Defaults</div>
                    <p>Relying on provider defaults can lead to inconsistent environments. Make choices explicit.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚫 Anti-Pattern: Inline Secrets</div>
                    <p>Never store secrets in Terraform files. Use secret managers and pass via environment variables.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚫 Anti-Pattern Checklist</div>
                    <ul>
                        <li>Manual console edits</li>
                        <li>Unreviewed plan applies</li>
                        <li>Single giant state for everything</li>
                        <li>Unpinned provider versions</li>
                        <li>Hardcoded AMI IDs</li>
                        <li>Public S3 buckets</li>
                        <li>Overuse of provisioners</li>
                        <li>Skipping validation in CI</li>
                        <li>Ignoring drift alerts</li>
                        <li>Storing secrets in tfvars</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 21. Mental Models
        // ========================
        'mental-models': `
            <div class="content-card">
                <h2><span class="icon">🧠</span> Mental Models</h2>
                <p>Think like Terraform.</p>

                <h3>1. The Vending Machine</h3>
                <p>You punch in a code (Configuration), you pay money (Creds), and the machine gives you a soda (Infrastructure). If you punch the code again, it doesn't give you another soda unless you ask for *two*.</p>

                <h3>2. The Blueprint vs. The House</h3>
                <p>Terraform code is the blueprint. The State file is the "as-built" survey. The Real World is the actual house. Terraform's job is to make the House match the Blueprint, using the Survey to know where walls currently are.</p>

                <h3>3. The Three-Way Diff</h3>
                <p>Terraform compares <strong>Desired (code)</strong> vs <strong>Known (state)</strong> vs <strong>Actual (cloud)</strong>. The plan is the difference between all three.</p>
                <div class="ascii-diagram">
                    <div class="ascii-content">
   Desired (Code)
        │
        ▼
     [ PLAN ]  ◄── compares ──►  Actual (Cloud)
        ▲
        │
   Known (State)
                    </div>
                </div>

                <h3>4. The Assembly Line</h3>
                <p>Each step is deterministic. If the input doesn't change, the output doesn't change.</p>

                <h3>5. Git Diff Mindset</h3>
                <p>Terraform plan is a diff. Read it like a code review and approve only what you expect.</p>

                <h3>6. The Ledger</h3>
                <p>State is the ledger of record. If the ledger is wrong, the system will take wrong actions.</p>

                <h3>7. The Orchestra</h3>
                <p>Each resource is an instrument. The dependency graph is the sheet music. Terraform is the conductor ensuring the right order.</p>

                <h3>8. The Recipe</h3>
                <p>Configuration is the recipe, state is the pantry inventory, and apply is the cooking process.</p>

                <h3>9. The Map</h3>
                <p>Code is the map, state is the "you are here" pin, and the plan is the route.</p>

                <div class="deep-dive">
                    <div class="deep-dive-header">📌 Study Guide</div>
                    <ul>
                        <li>Learn the plan/apply workflow.</li>
                        <li>Understand state and drift.</li>
                        <li>Practice modules and outputs.</li>
                        <li>Use for_each and count correctly.</li>
                        <li>Read plans carefully.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 22. Glossary
        // ========================
        'glossary': `
            <div class="content-card">
                <h2><span class="icon">📖</span> Glossary</h2>
                <div class="list-container">
                    <dl>
                        <dt>Provider</dt>
                        <dd>A plugin that talks to an API (e.g., AWS, Azure).</dd>
                        
                        <dt>Resource</dt>
                        <dd>A specific piece of infrastructure (e.g., EC2 Instance).</dd>
                        
                        <dt>Data Source</dt>
                        <dd>A read-only fetch of existing infrastructure.</dd>
                        
                        <dt>State</dt>
                        <dd>JSON file bridging the gap between Logical Config and Physical Resources.</dd>
                        
                        <dt>Module</dt>
                        <dd>A reusable container of resources (like a function).</dd>
                        
                        <dt>Backend</dt>
                        <dd>Where the State file is stored (S3, Local, Consul).</dd>
                        
                        <dt>Taint</dt>
                        <dd>Marking a resource as degraded so it will be forcibly destroyed and recreated.</dd>
                        
                        <dt>HCL</dt>
                        <dd>HashiCorp Configuration Language.</dd>

                        <dt>Plan</dt>
                        <dd>The proposed changes Terraform will make (preview phase).</dd>

                        <dt>Apply</dt>
                        <dd>Executes the plan and changes real infrastructure.</dd>

                        <dt>Workspace</dt>
                        <dd>A separate state for the same configuration.</dd>

                        <dt>Drift</dt>
                        <dd>When real infrastructure changes outside Terraform.</dd>

                        <dt>State Lock</dt>
                        <dd>Prevents concurrent writes to the state file.</dd>

                        <dt>Provisioner</dt>
                        <dd>Legacy action hooks (local-exec/remote-exec). Use sparingly.</dd>

                        <dt>Lock File</dt>
                        <dd>The provider dependency lock file (<code>.terraform.lock.hcl</code>).</dd>

                        <dt>Backend</dt>
                        <dd>Where state is stored and how it is locked.</dd>

                        <dt>Plan File</dt>
                        <dd>Binary artifact created by <code>terraform plan -out</code>.</dd>

                        <dt>Drift</dt>
                        <dd>When real infrastructure changes outside Terraform.</dd>

                        <dt>Refresh</dt>
                        <dd>State sync step where Terraform queries real resources.</dd>

                        <dt>ForceNew</dt>
                        <dd>Arguments that require resource replacement when changed.</dd>

                        <dt>Idempotent</dt>
                        <dd>Running the same code produces the same final state.</dd>

                        <dt>Workspace</dt>
                        <dd>Separate state for the same configuration.</dd>

                        <dt>Module Registry</dt>
                        <dd>Source of reusable Terraform modules.</dd>

                        <dt>Plan Output</dt>
                        <dd>The diff shown by <code>terraform plan</code>.</dd>

                        <dt>Apply</dt>
                        <dd>Execution of changes against real infrastructure.</dd>

                        <dt>Backend Config</dt>
                        <dd>Settings that define where and how state is stored.</dd>

                        <dt>Provider Alias</dt>
                        <dd>Named provider configuration for multi-region/account.</dd>

                        <dt>Local Values</dt>
                        <dd>Computed values inside a module, referenced as <code>local.*</code>.</dd>

                        <dt>Data Source</dt>
                        <dd>Read-only lookup of existing resources.</dd>

                        <dt>Force Unlock</dt>
                        <dd>Manual removal of a stale state lock.</dd>

                        <dt>Plan Refresh</dt>
                        <dd>Reconcile state with real resources during planning.</dd>

                        <dt>Local Backend</dt>
                        <dd>Stores state on disk in the working directory.</dd>

                        <dt>Remote Backend</dt>
                        <dd>Stores state in a remote system with locking.</dd>

                        <dt>Provider Schema</dt>
                        <dd>Resource and data source definitions exposed by a provider.</dd>

                        <dt>Implicit Dependency</dt>
                        <dd>Dependency created by referencing another resource.</dd>

                        <dt>Explicit Dependency</dt>
                        <dd>Dependency defined with <code>depends_on</code>.</dd>

                        <dt>Module Source</dt>
                        <dd>Location of a module: local path, registry, or Git.</dd>

                        <dt>Resource Address</dt>
                        <dd>Canonical identifier like <code>aws_instance.web[0]</code>.</dd>

                        <dt>Provider Alias</dt>
                        <dd>Named configuration for multiple regions/accounts.</dd>

                        <dt>Module Version</dt>
                        <dd>Pinned version to stabilize module behavior.</dd>

                        <dt>Drift Detection</dt>
                        <dd>Comparing state to real infrastructure.</dd>

                        <dt>Refresh Only</dt>
                        <dd>Plan that only updates state from reality.</dd>

                        <dt>Targeted Apply</dt>
                        <dd>Applying a subset of resources with <code>-target</code>.</dd>

                        <dt>Plan Artifact</dt>
                        <dd>Saved output from <code>terraform plan -out</code>.</dd>

                        <dt>Lock Timeout</dt>
                        <dd>Time Terraform waits for a state lock.</dd>

                        <dt>Input Variable</dt>
                        <dd>User-provided configuration values.</dd>

                        <dt>Output Variable</dt>
                        <dd>Values exported by a module.</dd>

                        <dt>Local Value</dt>
                        <dd>Computed values inside a module.</dd>

                        <dt>Meta-Argument</dt>
                        <dd>Special arguments like <code>count</code> or <code>for_each</code>.</dd>

                        <dt>Provisioner</dt>
                        <dd>Legacy hook for scripts; avoid if possible.</dd>

                        <dt>ForceNew</dt>
                        <dd>Attribute change that forces replacement.</dd>

                        <dt>Dependency Graph</dt>
                        <dd>Ordering model Terraform uses to apply changes.</dd>

                        <dt>Graph Walk</dt>
                        <dd>Process of executing the dependency graph.</dd>

                        <dt>Workspace</dt>
                        <dd>Alternate state with same configuration.</dd>

                        <dt>Backend</dt>
                        <dd>State storage system and locking mechanism.</dd>

                        <dt>Remote State</dt>
                        <dd>State stored in a remote backend.</dd>

                        <dt>State Lock</dt>
                        <dd>Mechanism preventing concurrent writes.</dd>

                        <dt>State Lineage</dt>
                        <dd>Unique ID for a state history.</dd>

                        <dt>State Serial</dt>
                        <dd>Incrementing number on each change.</dd>

                        <dt>Module Source</dt>
                        <dd>Location of module code (registry, Git, local).</dd>

                        <dt>Provider Schema</dt>
                        <dd>Resource and data definitions for a provider.</dd>

                        <dt>Provider Plugin</dt>
                        <dd>Binary used to manage resources for a platform.</dd>

                        <dt>Plan Diff</dt>
                        <dd>Summary of proposed changes.</dd>

                        <dt>Apply</dt>
                        <dd>Execution of the plan against real infra.</dd>

                        <dt>Import</dt>
                        <dd>Bring existing resources into state.</dd>

                        <dt>Move</dt>
                        <dd>Change resource address in state.</dd>

                        <dt>Data Source</dt>
                        <dd>Read-only lookup of existing resources.</dd>

                        <dt>Resource Address</dt>
                        <dd>Fully qualified resource reference.</dd>

                        <dt>Apply Plan</dt>
                        <dd>Using a saved plan file for deterministic changes.</dd>

                        <dt>Plan Output</dt>
                        <dd>Summary of creates, updates, and destroys.</dd>

                        <dt>Provisioner</dt>
                        <dd>Script execution hook (legacy).</dd>

                        <dt>Null Resource</dt>
                        <dd>Resource used to run provisioners or dependencies.</dd>

                        <dt>Time Sleep</dt>
                        <dd>Provider resource to add delays in workflows.</dd>

                        <dt>Data Source Filter</dt>
                        <dd>Criteria used to narrow a data lookup.</dd>

                        <dt>Implicit Dependency</dt>
                        <dd>Dependency created by referencing another resource.</dd>

                        <dt>Explicit Dependency</dt>
                        <dd>Dependency defined via <code>depends_on</code>.</dd>

                        <dt>State Backend</dt>
                        <dd>System used to store Terraform state.</dd>

                        <dt>State Locking</dt>
                        <dd>Prevent concurrent state writes.</dd>

                        <dt>Remote State Data Source</dt>
                        <dd>Reads outputs from another state.</dd>

                        <dt>Provider Version Constraint</dt>
                        <dd>Rules like <code>~&gt; 5.0</code> to pin versions.</dd>

                        <dt>Terraform Core</dt>
                        <dd>Main CLI binary that evaluates plans.</dd>

                        <dt>Provider Plugin</dt>
                        <dd>Binary that talks to APIs.</dd>

                        <dt>Module Registry</dt>
                        <dd>Source of public modules.</dd>

                        <dt>Module Source</dt>
                        <dd>Location of module code.</dd>

                        <dt>Module Outputs</dt>
                        <dd>Values exposed by a module.</dd>

                        <dt>Module Inputs</dt>
                        <dd>Variables expected by a module.</dd>

                        <dt>HCL</dt>
                        <dd>HashiCorp Configuration Language.</dd>

                        <dt>Local Values</dt>
                        <dd>Computed values within a module.</dd>

                        <dt>Plan Drift</dt>
                        <dd>Differences between desired and actual state.</dd>

                        <dt>Refresh</dt>
                        <dd>State update from real infrastructure.</dd>

                        <dt>Refresh Only</dt>
                        <dd>Plan that only refreshes state.</dd>

                        <dt>Plan Replace</dt>
                        <dd>Destroy and recreate a resource.</dd>

                        <dt>ForceNew</dt>
                        <dd>Argument that forces replacement.</dd>

                        <dt>Provider Alias</dt>
                        <dd>Named configuration for multiple accounts.</dd>

                        <dt>Workspace</dt>
                        <dd>Alternate state for same config.</dd>

                        <dt>CLI Config File</dt>
                        <dd>Global Terraform settings file.</dd>

                        <dt>Plugin Cache</dt>
                        <dd>Directory caching provider binaries.</dd>

                        <dt>Plan File</dt>
                        <dd>Saved plan created with <code>-out</code>.</dd>

                        <dt>Terraform Console</dt>
                        <dd>REPL for expression evaluation.</dd>

                        <dt>State Lineage</dt>
                        <dd>Unique ID for state history.</dd>

                        <dt>State Serial</dt>
                        <dd>Incremented on each state write.</dd>

                        <dt>Backend Config</dt>
                        <dd>Settings for state storage and locking.</dd>

                        <dt>Apply</dt>
                        <dd>Execution of a plan.</dd>

                        <dt>Plan</dt>
                        <dd>Preview of changes.</dd>

                        <dt>Init</dt>
                        <dd>Initializes providers and backend.</dd>

                        <dt>Validate</dt>
                        <dd>Checks configuration validity.</dd>

                        <dt>Fmt</dt>
                        <dd>Auto-formats HCL.</dd>

                        <dt>Import</dt>
                        <dd>Bring existing resources into state.</dd>

                        <dt>State Move</dt>
                        <dd>Rename or move resources in state.</dd>

                        <dt>State Remove</dt>
                        <dd>Delete resource from state only.</dd>

                        <dt>Targeted Apply</dt>
                        <dd>Apply changes to a subset.</dd>

                        <dt>Plan Graph</dt>
                        <dd>Visual representation of dependencies.</dd>

                        <dt>Provisioner Local Exec</dt>
                        <dd>Runs a local command during apply.</dd>

                        <dt>Provisioner Remote Exec</dt>
                        <dd>Runs a remote command on a resource.</dd>

                        <dt>Provider Configuration</dt>
                        <dd>Settings like region and credentials.</dd>

                        <dt>Default Tags</dt>
                        <dd>Tags applied automatically by provider.</dd>

                        <dt>Resource Graph</dt>
                        <dd>Directed acyclic graph of dependencies.</dd>

                        <dt>Plan Summary</dt>
                        <dd>Count of adds/changes/destroys.</dd>

                        <dt>Apply Timeout</dt>
                        <dd>Time limit for long operations.</dd>

                        <dt>Timeouts Block</dt>
                        <dd>Resource-specific operation timeouts.</dd>

                        <dt>Lock Table</dt>
                        <dd>DynamoDB table used for state locking.</dd>

                        <dt>State Encryption</dt>
                        <dd>Encrypting state at rest.</dd>

                        <dt>Module Example</dt>
                        <dd>Sample usage for a module.</dd>

                        <dt>Policy as Code</dt>
                        <dd>Rules enforcing infrastructure constraints.</dd>

                        <dt>Terraform Cloud</dt>
                        <dd>Managed Terraform execution platform.</dd>

                        <dt>Sentinel</dt>
                        <dd>HashiCorp policy language.</dd>

                        <dt>OPA</dt>
                        <dd>Open Policy Agent for policy checks.</dd>

                        <dt>Checkov</dt>
                        <dd>Static scanner for IaC security.</dd>

                        <dt>TFLint</dt>
                        <dd>Linting tool for Terraform.</dd>

                        <dt>tfsec</dt>
                        <dd>Security scanner for Terraform.</dd>

                        <dt>Infracost</dt>
                        <dd>Cost estimation for Terraform plans.</dd>

                        <dt>Plan Review</dt>
                        <dd>Human approval of changes.</dd>

                        <dt>CI Runner</dt>
                        <dd>Automation environment executing Terraform.</dd>
                    </dl>
                </div>
            </div>
        `,

        // ========================
        // PART 2: AWS ADVANCED
        // ========================

        // ========================
        // 1. AWS Provider Setup
        // ========================
        'aws-provider': `
            <div class="content-card">
                <h2><span class="icon">🔌</span> AWS Provider Setup</h2>
                <p>The bridge between Terraform and your AWS account.</p>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">versions.tf</span>
                    </div>
                    <pre>terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  
  default_tags {
    tags = {
      Environment = "Dev"
      ManagedBy   = "Terraform"
    }
  }
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🏷️ Default Tags</div>
                    <p>Stop tagging every resource manually! Use <code>default_tags</code> in the provider block to automatically apply tags to ALL resources created by this provider.</p>
                </div>
                
                <div class="deep-dive">
                    <div class="deep-dive-header">🔐 Authentication Patterns</div>
                    <div class="code-block">
                        <pre># Use a named profile (local dev)
provider "aws" {
  region  = "us-east-1"
  profile = "dev"
}

# Assume role for cross-account
provider "aws" {
  region = "us-east-1"
  assume_role {
    role_arn = "arn:aws:iam::123456789012:role/terraform-deploy"
  }
}</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use aliases:</strong> Manage multiple accounts/regions in one run.</li>
                        <li><strong>Pin provider versions:</strong> Avoid breaking changes.</li>
                        <li><strong>Enable shared config:</strong> Set <code>AWS_SDK_LOAD_CONFIG=1</code> for profiles.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 Provider Aliases</div>
                    <div class="code-block">
                        <pre>provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  alias  = "west"
  region = "us-west-2"
}

resource "aws_s3_bucket" "backup" {
  provider = aws.west
  bucket   = "backup-bucket"
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 2. VPC & Networking
        // ========================
        'aws-vpc': `
            <div class="content-card">
                <h2><span class="icon">🌐</span> VPC & Networking</h2>
                <p>The foundation. Nothing exists without a network.</p>

                <div class="ascii-diagram">
                    <div class="ascii-content">
Region (us-east-1)
┌───────────────────────────────────────────────┐
│ VPC (10.0.0.0/16)                             │
│ ┌───────────────────┐   ┌───────────────────┐ │
│ │ Public Subnet     │   │ Private Subnet    │ │
│ │ 10.0.1.0/24       │   │ 10.0.2.0/24       │ │
│ │ [IGW Route]       │   │ [NAT GW Route]    │ │
│ └───────────────────┘   └───────────────────┘ │
└───────────────────────────────────────────────┘
                    </div>
                </div>

                <div class="code-block">
                    <pre>resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}</pre>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Routing Basics</div>
                    <div class="ascii-content">
Public Subnet Route Table:
0.0.0.0/0  ---> Internet Gateway (IGW)

Private Subnet Route Table:
0.0.0.0/0  ---> NAT Gateway (in public subnet)
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use 2+ AZs:</strong> Place subnets across availability zones.</li>
                        <li><strong>NAT costs money:</strong> Keep private egress minimal.</li>
                        <li><strong>NACL vs SG:</strong> NACL is stateless; SG is stateful.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧭 Subnet Types</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
Public Subnet: route 0.0.0.0/0 -> IGW
Private Subnet: route 0.0.0.0/0 -> NAT
Isolated Subnet: no route to IGW/NAT
                        </div>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 3. Security Groups
        // ========================
        'aws-security-groups': `
            <div class="content-card">
                <h2><span class="icon">🛡️</span> Security Groups</h2>
                <p>The firewall for your instances. Stateful packet filtering.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">🎯 Rule of Thumb</div>
                    <p><strong>NEVER</strong> use <code>0.0.0.0/0</code> for SSH (Port 22). Always restrict it to your VPN or IP.</p>
                    <p><strong>ALWAYS</strong> reference other security groups as sources, not their IPs. (e.g., Allow traffic from <code>sg-load-balancer</code>).</p>
                </div>

                <div class="code-block">
                    <pre>resource "aws_security_group" "web" {
  name        = "web-sg"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # HTTP Open to world
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Allow all outbound
    cidr_blocks = ["0.0.0.0/0"]
  }
}</pre>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Stateful Behavior</div>
                    <div class="ascii-content">
INBOUND: Allow 80 from 0.0.0.0/0
OUTBOUND: Return traffic is automatically allowed
=> No explicit response rule needed
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Reference SGs:</strong> <code>security_groups = [aws_security_group.lb.id]</code> is safer than IPs.</li>
                        <li><strong>Split rules:</strong> Use <code>aws_security_group_rule</code> to avoid cycles.</li>
                        <li><strong>Least privilege:</strong> Open only required ports.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🚧 Ingress Patterns</div>
                    <ul>
                        <li><strong>Web tier:</strong> Allow 80/443 from ALB SG only.</li>
                        <li><strong>DB tier:</strong> Allow 5432/3306 from app SG only.</li>
                        <li><strong>Admin:</strong> SSH restricted to VPN CIDR.</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 4. EC2 & Compute
        // ========================
        'aws-ec2': `
            <div class="content-card">
                <h2><span class="icon">💻</span> EC2 Instances</h2>
                <p>Virtual servers in the cloud.</p>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">main.tf</span>
                    </div>
                    <pre>resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public.id
  
  vpc_security_group_ids = [aws_security_group.web.id]
  user_data              = file("init-script.sh")

  tags = {
    Name = "AppServer-1"
  }
}</pre>
                </div>

                <div class="interview-tip">
                    <div class="interview-tip-header">💡 Interview Tip</div>
                    <p><strong>Question:</strong> "How do I update the User Data on a running instance?"<br>
                    <strong>Answer:</strong> You generally can't updates to \`user_data\` usually force a replacement (Destroy/Create) of the instance unless you use specialized tools like \`cloud - init\` directives carefully, but Terraform sees it as a destructive change by default.</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📦 Instance Profile & EBS</div>
                    <p>Attach an IAM role via an instance profile so the instance can call AWS APIs without hardcoded keys.</p>
                    <div class="code-block">
                        <pre>resource "aws_iam_instance_profile" "app" {
  name = "app-profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_instance" "app" {
  iam_instance_profile = aws_iam_instance_profile.app.name
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }
}</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Template user data:</strong> Use <code>templatefile()</code> for variables.</li>
                        <li><strong>Use IMDSv2:</strong> Harden metadata access.</li>
                        <li><strong>Pin AMIs:</strong> Use data sources with filters to avoid stale images.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧰 Common EC2 Settings</div>
                    <div class="code-block">
                        <pre>resource "aws_instance" "app" {
  associate_public_ip_address = false
  monitoring                  = true
  metadata_options {
    http_tokens = "required"
  }
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 5. Auto Scaling Groups
        // ========================
        'aws-asg': `
            <div class="content-card">
                <h2><span class="icon">📈</span> Auto Scaling Groups (ASG)</h2>
                <p>Don't manage instances manually. Let ASG handle health checks and scaling.</p>

                <div class="comparison-table">
                    <table>
                        <tr>
                            <th>Component</th>
                            <th>Description</th>
                        </tr>
                        <tr>
                            <td>Launch Template</td>
                            <td>Defines <strong>WHAT</strong> to launch (AMI, Type, SG, User Data).</td>
                        </tr>
                        <tr>
                            <td>ASG</td>
                            <td>Defines <strong>HOW MANY</strong> and <strong>WHERE</strong> (Min/Max, Subnets).</td>
                        </tr>
                    </table>
                </div>

                <div class="code-block">
                    <pre>resource "aws_autoscaling_group" "app" {
  min_size            = 1
  max_size            = 3
  desired_capacity    = 2
  vpc_zone_identifier = [aws_subnet.private_1.id, aws_subnet.private_2.id]
  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
}</pre>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">ASG with ALB Health Checks</div>
                    <div class="ascii-content">
[ALB] -> [Target Group] -> [ASG Instances]
         ^ health checks drive scale-in/out decisions
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Use health checks:</strong> Prefer ELB health checks over EC2 status.</li>
                        <li><strong>Rolling updates:</strong> Combine ASG with <code>create_before_destroy</code>.</li>
                        <li><strong>Autoscaling policies:</strong> Add CPU/Request-based scaling rules.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📈 Scaling Policies</div>
                    <div class="code-block">
                        <pre>resource "aws_autoscaling_policy" "cpu" {
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 60.0
  }
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 6. Load Balancing
        // ========================
        'aws-alb': `
            <div class="content-card">
                <h2><span class="icon">⚖️</span> Load Balancing (ALB)</h2>
                <p>Distribute traffic across your instances.</p>

                <div class="code-block">
                    <pre>resource "aws_lb" "main" {
  name               = "my-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}</pre>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">Path-Based Routing</div>
                    <div class="ascii-content">
/api/*  ---> target-group-api
/web/*  ---> target-group-web
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Health checks:</strong> Set a fast, simple endpoint like <code>/health</code>.</li>
                        <li><strong>Idle timeout:</strong> Tune for long-lived connections if needed.</li>
                        <li><strong>Stickiness:</strong> Enable only when absolutely required.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔐 HTTPS Listener</div>
                    <div class="code-block">
                        <pre>resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 7. IAM & Security
        // ========================
        'aws-iam': `
            <div class="content-card">
                <h2><span class="icon">🔐</span> IAM & Security</h2>
                <p>Identity is the new perimeter.</p>

                <div class="deep-dive">
                    <div class="deep-dive-header">📄 Assume Role Policy</div>
                    <p>The "Trust Policy". WHO can assume this role? (e.g., EC2 Service, Lambda Service).</p>
                    <div class="code-block">
                        <pre>data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}</pre>
                    </div>
                </div>

                <div class="code-block">
                    <div class="code-header">
                        <span class="code-lang">iam.tf</span>
                    </div>
                    <pre>resource "aws_iam_role" "ec2_role" {
  name               = "ec2_app_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧩 IAM Building Blocks</div>
                    <div class="ascii-diagram">
                        <div class="ascii-content">
USER/ROLE  +  POLICY  =  PERMISSIONS
ROLE + TRUST POLICY    =  WHO CAN ASSUME
INSTANCE PROFILE       =  ROLE ATTACHED TO EC2
                        </div>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Least privilege:</strong> Start with minimal actions and expand.</li>
                        <li><strong>Use managed policies:</strong> Prefer AWS managed policies for standard roles.</li>
                        <li><strong>Avoid wildcards:</strong> <code>*</code> permissions should be rare.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Inline Policy Example</div>
                    <div class="code-block">
                        <pre>resource "aws_iam_role_policy" "s3_read" {
  role = aws_iam_role.ec2_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["s3:GetObject"]
      Resource = "arn:aws:s3:::my-bucket/*"
    }]
  })
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 8. S3 & Storage
        // ========================
        'aws-s3': `
            <div class="content-card">
                <h2><span class="icon">🪣</span> S3 & Storage</h2>
                <p>Object storage. Simple but easy to mess up publicly.</p>

                <div class="code-block">
                    <pre>resource "aws_s3_bucket" "data" {
  bucket = "my-unique-bucket-name-12345"
}

resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "data" {
  bucket = aws_s3_bucket.data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}</pre>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔐 Encryption & Lifecycle</div>
                    <div class="code-block">
                        <pre>resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule {
    id     = "archive-old-objects"
    status = "Enabled"
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
}</pre>
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Block public access:</strong> Always enable Public Access Block.</li>
                        <li><strong>Use bucket policies:</strong> ACLs are legacy and limited.</li>
                        <li><strong>Enable versioning:</strong> Protects against accidental deletes.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">📦 Bucket Policy Example</div>
                    <div class="code-block">
                        <pre>resource "aws_s3_bucket_policy" "data" {
  bucket = aws_s3_bucket.data.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Deny"
      Principal = "*"
      Action = "s3:*"
      Resource = [
        aws_s3_bucket.data.arn,
        "\${aws_s3_bucket.data.arn}/*"
      ]
      Condition = {
        Bool = { "aws:SecureTransport" = "false" }
      }
    }]
  })
}</pre>
                    </div>
                </div>
            </div>
        `,

        // ========================
        // 9. RDS & Databases
        // ========================
        'aws-rds': `
            <div class="content-card">
                <h2><span class="icon">🗄️</span> RDS & Databases</h2>
                <p>Managed Relational Databases.</p>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">⚠️ Warning: Passwords</div>
                    <p>Never hardcode the password. Use AWS Secrets Manager or inject it via variables (marked sensitive).</p>
                </div>

                <div class="code-block">
                    <pre>resource "aws_db_instance" "default" {
  allocated_storage    = 10
  db_name              = "mydb"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t3.micro"
  username             = "admin"
  password             = var.db_password # SENSITIVE!
  parameter_group_name = "default.mysql5.7"
  skip_final_snapshot  = true
}</pre>
                </div>

                <div class="ascii-diagram">
                    <div class="ascii-diagram-title">RDS in Private Subnets</div>
                    <div class="ascii-content">
Internet
  |
[ALB] -> [App Instances] -> [RDS] (Private Subnet)
                    </div>
                </div>

                <div class="tech-explanation">
                    <div class="tech-explanation-header">✅ Pro Tips</div>
                    <ul>
                        <li><strong>Multi-AZ:</strong> Use for high availability in production.</li>
                        <li><strong>Backups:</strong> Set <code>backup_retention_period</code> > 0.</li>
                        <li><strong>Subnet group:</strong> Place RDS in private subnets.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🔐 RDS Security Checklist</div>
                    <ul>
                        <li><strong>No public access:</strong> <code>publicly_accessible = false</code></li>
                        <li><strong>Encrypt storage:</strong> <code>storage_encrypted = true</code></li>
                        <li><strong>Backup retention:</strong> Keep 7-35 days for prod</li>
                    </ul>
                </div>
            </div>
        `,

        // ========================
        // 10. Reference Architectures
        // ========================
        'aws-architectures': `
            <div class="content-card">
                <h2><span class="icon">🏛️</span> Reference Architectures</h2>
                <p>Bringing it all together.</p>

                <h3>3-Tier Web Application</h3>
                <div class="ascii-diagram">
                    <div class="ascii-content">
       Internet
          │
    [Load Balancer] (Public Subnet)
          │
    [Auto Scaling Group] (Private Subnet)
          │
    [RDS Database] (Private Data Subnet)
                    </div>
                </div>

                <h3>Serverless Backend</h3>
                <div class="ascii-diagram">
                    <div class="ascii-content">
    [API Gateway]
          │
       [Lambda]
          │
     [DynamoDB]
                    </div>
                </div>
                
                <div class="interview-tip">
                    <div class="interview-tip-header">Done!</div>
                    <p>You have reached the end of the guided learning path. The real learning starts when you build your own projects. Go break things!</p>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧱 Common Reference Patterns</div>
                    <ul>
                        <li><strong>3-Tier + NAT:</strong> Public ALB, private app, private DB with NAT for egress.</li>
                        <li><strong>Containers:</strong> ALB -> ECS/Fargate -> RDS/ElastiCache.</li>
                        <li><strong>Event-driven:</strong> S3 -> Lambda -> DynamoDB.</li>
                    </ul>
                </div>

                <div class="deep-dive">
                    <div class="deep-dive-header">🧪 Interview Tip</div>
                    <p><strong>Question:</strong> "How do you design for high availability in AWS?"<br>
                    <strong>Answer:</strong> Use multi-AZ subnets, ALB across AZs, auto-scaling groups, and multi-AZ databases.</p>
                </div>
            </div>
        `,
    };

    if (id === 'ALL_CONTENT') return contents;
    return contents[id] || '<div class="content-card"><h2>Content Not Found</h2><p>This section is under construction.</p></div>';
}

// Initialize Search on Load
initSearch();
