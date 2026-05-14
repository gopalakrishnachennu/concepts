const filters = ["All", "Foundation", "Cloud", "IaC", "CI/CD", "Containers", "Security", "SRE", "Data", "Edge"];

const path = [
    ["Phase 0", "Week 1", "DevOps mindset and corporate SDLC", ["DevOps principles, SDLC, Agile, release flow", "Ticketing, environments, change requests, incident reviews", "Documentation habits: README, runbook, ADR, release note"], "Explain how code moves from developer laptop to production with approvals, evidence, rollback, and ownership."],
    ["Phase 1", "Weeks 2-4", "Linux, networking, Git, scripting", ["Linux users, permissions, services, logs, processes", "CIDR, DNS, HTTP, TLS, proxies, load balancers", "Git branching, PRs, tags, conflicts, Bash/Python automation"], "Troubleshoot a Linux web service outage and document the fix."],
    ["Phase 2", "Weeks 5-7", "AWS and Azure foundations", ["Accounts, subscriptions, IAM/RBAC, tagging, budgets", "VPC/VNet, subnets, routing, NAT, private endpoints", "Compute, storage, databases, backup, monitoring basics"], "Build the same private web app foundation on AWS and Azure."],
    ["Phase 3", "Weeks 8-10", "Infrastructure as Code", ["Terraform state, locking, modules, variables, outputs", "Environment strategy, imports, drift, policy checks", "Ansible roles, inventory, templates, vault, patching"], "Provision cloud infrastructure through reviewed Terraform plans."],
    ["Phase 4", "Weeks 11-13", "CI/CD engineering", ["Build, test, scan, package, publish, deploy, verify", "Artifact promotion, approvals, release evidence", "Rollback, canary, blue-green, feature flags, migrations"], "Create a pipeline that promotes the same artifact from dev to prod."],
    ["Phase 5", "Weeks 14-17", "Containers and Kubernetes", ["Dockerfiles, registries, image hardening, signing", "Kubernetes workloads, services, ingress, RBAC, probes", "Helm, GitOps, autoscaling, backup, upgrades"], "Deploy and operate a production-style app on EKS or AKS."],
    ["Phase 6", "Weeks 18-20", "Security and compliance", ["Least privilege, secrets, certificates, encryption", "SAST, SCA, DAST, IaC scans, container scans", "Audit logs, evidence, separation of duties, exceptions"], "Pass a security review for an app, pipeline, and Terraform stack."],
    ["Phase 7", "Weeks 21-23", "Observability and SRE", ["Metrics, logs, traces, SLOs, SLIs, error budgets", "Prometheus, Grafana, CloudWatch, Azure Monitor", "Incident response, RCA, postmortems, DR drills"], "Run a simulated incident from alert to RCA with clear timeline."],
    ["Phase 8", "Weeks 24-28", "Platform engineering and leadership", ["Golden paths, templates, self-service, developer portals", "FinOps, governance, landing zones, migration planning", "Design reviews, tradeoffs, operating model, team ownership"], "Defend a full multi-cloud platform architecture in a senior-level review."]
];

const modules = [
    {
        id: "linux-networking",
        category: "Foundation",
        title: "Linux, Networking, and Troubleshooting",
        outcome: "You can debug servers, services, network paths, DNS, TLS, and HTTP issues without guessing.",
        learn: ["systemd, journalctl, permissions, SSH, cron, package management", "CPU, memory, disk, inode, process, socket, and log troubleshooting", "CIDR, DNS, HTTP, TLS, NAT, routing, firewall, proxy, load balancer behavior"],
        build: ["Harden a Linux VM running Nginx with TLS and log rotation", "Create troubleshooting scripts for disk, memory, ports, DNS, and HTTP checks"],
        prove: ["Given a broken service, identify root cause using commands and logs", "Write a runbook another engineer can follow during an outage"],
        tags: ["Linux", "Networking", "Foundation"]
    },
    {
        id: "git-sdlc",
        category: "Foundation",
        title: "Git, SDLC, and Release Discipline",
        outcome: "You understand how teams safely move changes through review, testing, approval, and production.",
        learn: ["Branching strategies, PR reviews, CODEOWNERS, protected branches", "Semantic versioning, release notes, changelogs, tags", "Agile flow, change tickets, CAB, freeze windows, emergency changes"],
        build: ["Create a sample repo with branch protection rules and PR template", "Design dev, QA, UAT, stage, prod release flow"],
        prove: ["Explain trunk-based vs GitFlow tradeoffs", "Produce a production release checklist with rollback"],
        tags: ["Git", "Release", "Governance"]
    },
    {
        id: "aws-platform",
        category: "Cloud",
        title: "AWS Platform Operations",
        outcome: "You can design and operate secure AWS workloads with networking, IAM, compute, data, and observability.",
        learn: ["Organizations, IAM Identity Center, IAM, SCPs, CloudTrail", "VPC, subnets, NAT, ALB/NLB, Route 53, PrivateLink, Transit Gateway", "EC2, ASG, Lambda, ECS, EKS, S3, RDS, Aurora, DynamoDB, CloudWatch"],
        build: ["Three-tier AWS app with private database and public load balancer", "CloudWatch dashboards, alarms, logs, and backup plan"],
        prove: ["Explain least privilege for app, CI/CD, operator, and auditor", "Draw traffic flow from internet to app to database"],
        tags: ["AWS", "Cloud", "Security"]
    },
    {
        id: "azure-platform",
        category: "Cloud",
        title: "Azure Platform Operations",
        outcome: "You can design and operate Azure workloads using enterprise identity, networking, runtime, data, and monitoring.",
        learn: ["Entra ID, RBAC, management groups, subscriptions, Azure Policy", "VNet, NSG, Azure Firewall, App Gateway, Front Door, Private Link", "VMSS, App Service, Functions, Container Apps, AKS, Azure SQL, Cosmos DB, Monitor"],
        build: ["Azure three-tier app with private data and Key Vault secrets", "Azure Monitor dashboard, alerts, and Recovery Services backup"],
        prove: ["Explain management group and subscription strategy", "Compare App Service, Container Apps, AKS, and VMSS for a real app"],
        tags: ["Azure", "Cloud", "Security"]
    },
    {
        id: "terraform-iac",
        category: "IaC",
        title: "Terraform and IaC Engineering",
        outcome: "You can build reusable, reviewed, policy-checked infrastructure safely across environments.",
        learn: ["Providers, state, locking, modules, variables, outputs, data sources", "Imports, moved blocks, drift, lifecycle rules, provider aliases", "fmt, validate, tflint, checkov/tfsec, Infracost, OPA/Sentinel"],
        build: ["Reusable modules for network, IAM, database, Kubernetes, monitoring", "Pipeline that stores plan artifacts and applies only approved plans"],
        prove: ["Recover from state lock and partial apply scenarios", "Explain module versioning and environment isolation"],
        tags: ["Terraform", "IaC", "Policy"]
    },
    {
        id: "ansible-config",
        category: "IaC",
        title: "Ansible and Configuration Automation",
        outcome: "You can automate server configuration, patching, service bootstrap, and repeatable operational tasks.",
        learn: ["Inventory, roles, tasks, templates, handlers, facts", "Idempotency, check mode, tags, vault, external secrets", "Patching, agent install, service configuration, runbook automation"],
        build: ["Role-based VM bootstrap for web, app, monitoring agents", "Patch automation with reporting and rollback notes"],
        prove: ["Run safe dry-runs and explain changed vs ok output", "Handle secrets without exposing values in logs"],
        tags: ["Ansible", "IaC", "Operations"]
    },
    {
        id: "pipeline-factory",
        category: "CI/CD",
        title: "CI/CD Pipeline Factory",
        outcome: "You can create production-grade pipelines with security, artifact promotion, approvals, and rollback.",
        learn: ["GitHub Actions, Azure DevOps, Jenkins stages and templates", "Build, test, scan, package, publish, deploy, verify", "SBOM, signing, evidence, approvals, concurrency, environments"],
        build: ["Reusable app pipeline template and IaC pipeline template", "Deployment with canary or blue-green and automatic smoke tests"],
        prove: ["Promote one artifact through all environments", "Show release evidence: SHA, artifact, scan, approver, logs, tests"],
        tags: ["CI/CD", "GitHub Actions", "Azure DevOps"]
    },
    {
        id: "containers-kubernetes",
        category: "Containers",
        title: "Docker, Kubernetes, and GitOps",
        outcome: "You can package, deploy, scale, and troubleshoot containerized workloads on EKS and AKS.",
        learn: ["Dockerfile hardening, multi-stage builds, non-root, image signing", "Pods, deployments, services, ingress, config, secrets, probes, HPA, PDB", "Helm, Kustomize, Argo CD or Flux, cluster upgrades, backups"],
        build: ["App deployed through Helm and GitOps to EKS or AKS", "Ingress, TLS, autoscaling, network policy, external secrets"],
        prove: ["Debug CrashLoopBackOff, ImagePullBackOff, DNS, CNI, and node pressure", "Explain rolling update, rollback, and autoscaling behavior"],
        tags: ["Kubernetes", "Docker", "GitOps"]
    },
    {
        id: "devsecops",
        category: "Security",
        title: "DevSecOps and Compliance",
        outcome: "You can embed security checks and audit evidence into normal delivery instead of treating security as a final gate.",
        learn: ["SAST, SCA, DAST, IaC scans, container scans, secret scans", "Secrets Manager, SSM, Key Vault, External Secrets, certificate rotation", "Audit evidence, separation of duties, vulnerability exceptions"],
        build: ["Pipeline with security gates and exception workflow", "Secret rotation pattern with zero downtime"],
        prove: ["Explain how secrets move from CI/CD to runtime", "Map release evidence to audit questions"],
        tags: ["Security", "Compliance", "Secrets"]
    },
    {
        id: "observability-sre",
        category: "SRE",
        title: "Observability and SRE Operations",
        outcome: "You can detect, triage, mitigate, and prevent production issues using useful signals and disciplined incident response.",
        learn: ["Metrics, logs, traces, RED/USE, SLI, SLO, error budget", "Prometheus, Grafana, Loki/OpenSearch, CloudWatch, Azure Monitor", "Alert routing, incident command, RCA, postmortem, problem management"],
        build: ["SLO dashboard, service dashboard, alert routing, incident runbook", "Synthetic checks and log/tracing correlation"],
        prove: ["Run a simulated incident with timeline and mitigation", "Reduce noisy alerts and identify missing alerts"],
        tags: ["SRE", "Observability", "Incidents"]
    },
    {
        id: "data-devops",
        category: "Data",
        title: "Database and Data Platform DevOps",
        outcome: "You can deploy database changes safely and operate managed databases with backup, restore, performance, and HA awareness.",
        learn: ["Schema versioning, expand-contract migrations, rollback reality", "RDS, Aurora, Azure SQL, Postgres backups, replicas, PITR", "Connection pooling, indexes, vacuum, WAL, replication, failover"],
        build: ["Migration pipeline with pre-checks, backup, deploy, verification", "Postgres/RDS/Azure SQL monitoring dashboard"],
        prove: ["Explain code rollback vs data rollback vs forward fix", "Restore a database to a point in time and validate data"],
        tags: ["Data", "Postgres", "Database"]
    },
    {
        id: "platform-engineering",
        category: "SRE",
        title: "Platform Engineering, FinOps, and Leadership",
        outcome: "You can create golden paths and lead architecture decisions with cost, security, reliability, and team ownership in mind.",
        learn: ["Golden paths, service templates, developer portals, scorecards", "Landing zones, account/subscription vending, policy, tagging, cost allocation", "DORA metrics, developer experience, support boundaries, operating model"],
        build: ["Internal developer platform blueprint with templates and guardrails", "FinOps dashboard and cloud cost cleanup policy"],
        prove: ["Defend platform tradeoffs to app, security, finance, and leadership stakeholders", "Measure lead time, deployment frequency, MTTR, and change failure rate"],
        tags: ["Platform", "FinOps", "Leadership"]
    }
];

const labs = [
    ["Beginner", "Linux Outage Simulator", "Break and fix Nginx, DNS, disk, permissions, port conflicts, and TLS. Document each failure with commands and fix.", ["Linux", "Networking"]],
    ["Beginner", "Docker App Delivery", "Containerize frontend, backend, and Postgres with Compose, health checks, non-root images, and local run scripts.", ["Docker", "Containers"]],
    ["Intermediate", "AWS Three-Tier Terraform Stack", "Provision VPC, ALB, private app, RDS/Aurora, IAM, logs, alarms, and backup with Terraform.", ["AWS", "Terraform"]],
    ["Intermediate", "Azure Three-Tier Terraform Stack", "Provision VNet, App Gateway or Front Door, App Service or VMSS, Azure SQL, Key Vault, Monitor, and backup.", ["Azure", "Terraform"]],
    ["Intermediate", "Reusable Module Registry", "Create versioned Terraform modules with examples, docs, tests, security scans, and cost estimates.", ["IaC", "Governance"]],
    ["Advanced", "Secure Pipeline Factory", "Reusable GitHub Actions and Azure DevOps templates with tests, scans, signed images, approvals, and release evidence.", ["CI/CD", "Security"]],
    ["Advanced", "EKS and AKS GitOps Platform", "Deploy app using Helm and Argo CD/Flux with ingress, TLS, external secrets, autoscaling, logs, and dashboards.", ["Kubernetes", "GitOps"]],
    ["Advanced", "SRE Command Center", "Prometheus/Grafana or cloud-native dashboards, SLOs, alerts, incident runbooks, synthetic checks, and RCA template.", ["SRE", "Observability"]],
    ["Expert", "Multi-Cloud Landing Zone", "AWS and Azure landing zones with identity, networking, logging, guardrails, budget, policies, and workload onboarding.", ["Cloud", "Governance"]],
    ["Expert", "DR and Migration Program", "Active-passive DR, backup/restore automation, DNS failover, RTO/RPO tests, migration plan, and rollback strategy.", ["DR", "Data"]],
    ["Expert", "Internal Developer Platform", "Golden path with app template, Terraform module, Helm chart, pipeline template, scorecard, docs, and support model.", ["Platform", "Developer Experience"]]
];

const edgeTopics = [
    ["Incident command and outage control", ["Severity model, incident commander, scribe, comms lead", "Mitigation-first thinking: rollback, traffic shift, failover", "Timeline, status updates, RCA, follow-up tracking"], ["Edge", "SRE"]],
    ["Emergency release and change freeze", ["Holiday freeze, exception approval, emergency change evidence", "Hotfix branch strategy and production-only patch handling", "Rollback validation under pressure"], ["Edge", "CI/CD"]],
    ["IAM and RBAC failure modes", ["Expired service principals, OIDC trust broken, SCP deny", "PIM, break-glass, temporary elevation, access reviews", "Separate plan, apply, deploy, and read-only identities"], ["Edge", "Security"]],
    ["Terraform state disasters", ["State lock stuck, state deletion, drift, partial apply", "State split/merge, imports, moved blocks, provider bugs", "Recover without destroying critical resources"], ["Edge", "IaC"]],
    ["Kubernetes failure modes", ["CrashLoopBackOff, ImagePullBackOff, DNS, CNI, node pressure", "Bad probes, HPA delays, PDB and eviction behavior", "Cluster autoscaler and rolling update edge cases"], ["Edge", "Containers"]],
    ["DNS, TLS, and network blackholes", ["Asymmetric routing, NSG/security group mismatch, stale DNS", "TLS chain, SNI, mTLS, proxy, WAF false positives", "Flow logs, packet capture, curl timing, dig, traceroute"], ["Edge", "Cloud"]],
    ["Database migration safety", ["Expand-contract, backward compatibility, long locks", "Replication lag, failover impact, PITR backup before deploy", "Code rollback vs data rollback vs forward fix"], ["Edge", "Data"]],
    ["Secrets and certificate rotation", ["Zero-downtime rotation, dual-secret rollout", "Detect leaked, stale, unused, and hardcoded secrets", "Certificate expiry monitoring and ownership"], ["Edge", "Security"]],
    ["Supply chain integrity", ["SBOM, provenance, image signing, dependency pinning", "Mutable tag prevention and base image verification", "Runner hardening and dependency confusion prevention"], ["Edge", "Security"]],
    ["FinOps surprises", ["NAT gateway, log ingestion, metrics, snapshots, data transfer", "Rightsizing with evidence, reserved capacity, anomaly response", "Showback and chargeback by team/app/environment"], ["Edge", "SRE"]],
    ["Restricted enterprise networks", ["Corporate proxy, SSL inspection, allowlists, private registries", "Package mirrors for npm, pip, Maven, apt, yum", "Private CI/CD access with no public internet egress"], ["Edge", "Cloud"]],
    ["Migrations and modernization", ["Lift-and-shift vs re-platform vs re-architect", "DNS cutover, data sync, parallel run, rollback window", "Jenkins to GitHub Actions or Azure DevOps migration"], ["Edge", "Platform"]]
];

const capstone = [
    ["Deliverables", ["Architecture diagram", "Terraform modules and root stacks", "App pipeline and IaC pipeline", "Runbook, README, ADRs, release checklist"]],
    ["Production Controls", ["IAM/RBAC least privilege", "Secrets and certificate rotation", "Security scans and policy gates", "Backup, restore, DR, and rollback evidence"]],
    ["Operations Proof", ["SLO dashboard", "Incident simulation and RCA", "Cost dashboard and cleanup process", "Capacity/load test results"]]
];

const completed = new Set(JSON.parse(localStorage.getItem("devopsAcademyCompleted") || "[]"));

function list(items) {
    return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function tags(items) {
    return `<div class="tags">${items.map((item) => `<span class="tag">${item}</span>`).join("")}</div>`;
}

function searchableText(parts) {
    return parts.flat(Infinity).join(" ").replace(/"/g, "&quot;");
}

function renderFilters() {
    const filterBar = document.getElementById("filterBar");
    filterBar.innerHTML = filters.map((filter) => `<button class="${filter === "All" ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("");
    filterBar.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        document.querySelectorAll("#filterBar button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        applySearch();
    });
}

function renderPath() {
    document.getElementById("pathGrid").innerHTML = path.map(([phase, duration, title, items, proof]) => `
        <article class="path-card searchable" data-category="Foundation" data-search="${searchableText([phase, duration, title, items, proof])}">
            <div class="phase">${phase}<br>${duration}</div>
            <div>
                <h3>${title}</h3>
                ${list(items)}
            </div>
            <div class="proof"><strong>Checkpoint:</strong><br>${proof}</div>
        </article>
    `).join("");
}

function renderModules() {
    document.getElementById("moduleGrid").innerHTML = modules.map((module, index) => `
        <article class="module-card searchable" data-category="${module.category} ${module.tags.join(" ")}" data-search="${searchableText([module.category, module.title, module.outcome, module.learn, module.build, module.prove, module.tags])}">
            <header>
                <div>
                    <p class="eyebrow">${module.category}</p>
                    <h3>${module.title}</h3>
                </div>
                <span class="module-number">${String(index + 1).padStart(2, "0")}</span>
            </header>
            <p>${module.outcome}</p>
            ${tags(module.tags)}
            <div class="module-actions">
                <button class="module-open" data-module="${module.id}">Open module</button>
                <button class="check-button ${completed.has(module.id) ? "done" : ""}" data-complete="${module.id}">${completed.has(module.id) ? "Done" : "Todo"}</button>
            </div>
        </article>
    `).join("");
}

function renderLabs() {
    document.getElementById("labGrid").innerHTML = labs.map(([level, title, text, tagItems]) => `
        <article class="lab-card searchable" data-level="${level}" data-category="${tagItems.join(" ")}" data-search="${searchableText([level, title, text, tagItems])}">
            <p class="eyebrow">${level}</p>
            <h3>${title}</h3>
            <div class="lab-meta"><span>Portfolio lab</span><span>Proof required</span></div>
            <p>${text}</p>
            ${tags(tagItems)}
        </article>
    `).join("");
}

function renderEdgeTopics() {
    document.getElementById("edgeGrid").innerHTML = edgeTopics.map(([title, items, tagItems]) => `
        <article class="edge-card searchable" data-category="${tagItems.join(" ")}" data-search="${searchableText([title, items, tagItems])}">
            <p class="eyebrow">Edge Case</p>
            <h3>${title}</h3>
            ${list(items)}
            ${tags(tagItems)}
        </article>
    `).join("");
}

function renderCapstone() {
    document.getElementById("capstoneGrid").innerHTML = capstone.map(([title, items]) => `
        <article class="capstone-card">
            <h3>${title}</h3>
            ${list(items)}
        </article>
    `).join("");
}

function openModule(moduleId) {
    const module = modules.find((item) => item.id === moduleId);
    if (!module) return;
    document.getElementById("dialogContent").innerHTML = `
        <p class="eyebrow">${module.category}</p>
        <h2>${module.title}</h2>
        <p>${module.outcome}</p>
        ${tags(module.tags)}
        <div class="dialog-grid">
            <section class="dialog-panel"><h3>Learn</h3>${list(module.learn)}</section>
            <section class="dialog-panel"><h3>Build</h3>${list(module.build)}</section>
            <section class="dialog-panel"><h3>Prove</h3>${list(module.prove)}</section>
            <section class="dialog-panel"><h3>Corporate Questions</h3>${list([
                "What can fail in production?",
                "How do you detect it?",
                "How do you roll back or mitigate?",
                "What evidence proves the change was safe?"
            ])}</section>
        </div>
    `;
    document.getElementById("moduleDialog").showModal();
}

function updateProgress() {
    const total = modules.length;
    const done = completed.size;
    const percent = Math.round((done / total) * 100);
    document.getElementById("progressLabel").textContent = `${done} of ${total} complete`;
    document.getElementById("progressBar").style.width = `${percent}%`;
    localStorage.setItem("devopsAcademyCompleted", JSON.stringify([...completed]));
}

function setupInteractions() {
    document.getElementById("moduleGrid").addEventListener("click", (event) => {
        const openButton = event.target.closest("[data-module]");
        const completeButton = event.target.closest("[data-complete]");
        if (openButton) openModule(openButton.dataset.module);
        if (completeButton) {
            const id = completeButton.dataset.complete;
            if (completed.has(id)) completed.delete(id);
            else completed.add(id);
            completeButton.classList.toggle("done");
            completeButton.textContent = completeButton.classList.contains("done") ? "Done" : "Todo";
            updateProgress();
        }
    });

    document.getElementById("closeDialog").addEventListener("click", () => {
        document.getElementById("moduleDialog").close();
    });

    document.getElementById("searchInput").addEventListener("input", applySearch);

    const topButton = document.getElementById("topButton");
    window.addEventListener("scroll", () => topButton.classList.toggle("visible", window.scrollY > 700));
    topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function setupNavSpy() {
    const links = [...document.querySelectorAll(".side-nav a")];
    const sections = [...document.querySelectorAll("main section[id]")];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
        });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
}

function applySearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const filter = document.querySelector("#filterBar button.active")?.dataset.filter || "All";
    document.querySelectorAll(".searchable").forEach((item) => {
        const text = item.dataset.search.toLowerCase();
        const category = item.dataset.category || "";
        const matchesQuery = !query || text.includes(query);
        const matchesFilter = filter === "All" || category.includes(filter) || text.includes(filter.toLowerCase());
        item.classList.toggle("hidden", !(matchesQuery && matchesFilter));
    });
}

renderFilters();
renderPath();
renderModules();
renderLabs();
renderEdgeTopics();
renderCapstone();
setupInteractions();
setupNavSpy();
updateProgress();
