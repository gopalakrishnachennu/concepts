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
                    </table>
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
            </div>
        `,
    };

    if (id === 'ALL_CONTENT') return contents;
    return contents[id] || '<div class="content-card"><h2>Content Not Found</h2><p>This section is under construction.</p></div>';
}

// Initialize Search on Load
initSearch();
