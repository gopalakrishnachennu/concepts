const filters = ["All", "Foundation", "Cloud", "IaC", "CI/CD", "Containers", "Security", "Observability", "SRE", "Data", "Edge"];

const roadmap = [
    ["Phase 0", "Week 1", "DevOps mindset and corporate SDLC", ["Understand DevOps as collaboration, automation, reliability, and feedback loops.", "Learn Agile, tickets, sprint planning, change requests, CAB, release notes, and incident reviews.", "Know environments: local, dev, QA, UAT, staging, pre-prod, prod, DR, sandbox, shared services.", "Practice READMEs, runbooks, architecture decisions, deployment notes, and handover documents."]],
    ["Phase 1", "Weeks 2-4", "Linux, networking, Git, scripting", ["Linux files, permissions, users, groups, systemd, journald, SSH, cron, process and memory troubleshooting.", "Networking: TCP/IP, DNS, HTTP, TLS, load balancing, NAT, CIDR, routing, firewalls, proxies, VPN.", "Git: branching, rebasing, conflicts, tags, signed commits, pull request reviews, protected branches.", "Bash and Python automation with APIs, JSON/YAML, retries, idempotency, logging, and error handling."]],
    ["Phase 2", "Weeks 5-7", "AWS and Azure foundations", ["Accounts, subscriptions, regions, zones, resource groups, tags, budgets, policies, IAM, Azure RBAC.", "Compute: EC2, ASG, Lambda, ECS, App Service, Functions, VMSS, AKS, EKS.", "Networking: VPC/VNet, subnets, route tables, internet gateways, NAT, NSG/security groups, private endpoints.", "Storage and data: S3, EBS, EFS, Azure Blob, Managed Disks, Files, RDS, Aurora, Azure SQL, Cosmos DB."]],
    ["Phase 3", "Weeks 8-10", "Infrastructure as Code", ["Terraform providers, state, locking, modules, variables, outputs, data sources, imports, moved blocks.", "Reusable modules for VPC/VNet, compute, databases, Kubernetes, monitoring, IAM, and secrets.", "Quality gates: fmt, validate, tflint, checkov/tfsec, Infracost, OPA or Sentinel.", "Ansible for configuration, patching, package installs, service config, inventory, roles, and vault."]],
    ["Phase 4", "Weeks 11-13", "CI/CD engineering", ["Build pipelines in GitHub Actions, Azure DevOps, Jenkins, and understand where each fits.", "Test stages, artifact versioning, image builds, SBOM, scans, approvals, and environment promotion.", "Deploy to VMs, App Service, ECS, EKS, AKS, Helm, Kustomize, and GitOps.", "Practice rollback, blue-green, canary, feature flags, migrations, and release evidence."]],
    ["Phase 5", "Weeks 14-17", "Containers and Kubernetes", ["Dockerfiles, layers, multi-stage builds, hardening, Compose, registries, caching, and signing.", "Kubernetes pods, deployments, services, ingress, config maps, secrets, probes, HPA, PDB, RBAC, network policies.", "Helm charts, Kustomize, values, testing, release history, and promotion.", "Production ops: cluster upgrades, node pools, autoscaling, storage, backup, restore, and troubleshooting."]],
    ["Phase 6", "Weeks 18-20", "Security and compliance", ["Least privilege, IAM boundaries, Azure RBAC, managed identities, workload identity, service principals.", "Secrets with AWS Secrets Manager, SSM, Azure Key Vault, External Secrets Operator, and rotation.", "SAST, SCA, DAST, container scans, IaC scans, secret scans, dependency pinning, license checks.", "Audit logs, encryption, backup retention, evidence, separation of duties, and policy-as-code."]],
    ["Phase 7", "Weeks 21-23", "Observability, SRE, production support", ["Metrics, logs, traces, RED/USE signals, SLOs, SLIs, error budgets, alert routing, dashboard design.", "Prometheus, Grafana, Alertmanager, Loki, ELK/OpenSearch, CloudWatch, Azure Monitor, App Insights.", "Incident response: triage, severity, comms, mitigation, rollback, RCA, postmortems.", "Reliability testing: chaos, load tests, failover, DR drills, backup restore validation."]],
    ["Phase 8", "Weeks 24+", "Advanced platform engineering", ["Golden paths: service templates, Terraform modules, Helm charts, pipeline templates, docs, guardrails.", "Self-service platforms with Backstage, internal developer portals, paved-road environments, scorecards.", "Optimize cost, performance, security posture, developer experience, and operational toil.", "Lead design reviews for multi-cloud landing zones, DR, migration, modernization, and governance."]]
];

const topics = [
    ["Foundation", "Linux administration", ["Files, permissions, ACLs, sudo, SSH hardening", "systemd services, timers, journalctl, logrotate", "CPU, memory, disk, inode, process, network troubleshooting", "Patch strategy and CIS baseline basics"], ["Linux", "Shell", "Troubleshooting"]],
    ["Foundation", "Networking", ["CIDR, subnetting, routing, NAT, DNS, DHCP", "HTTP, TLS, certificates, reverse proxies", "L4/L7 load balancers, health checks, sticky sessions", "VPN, peering, private endpoints, firewall rules"], ["VPC", "VNet", "DNS"]],
    ["Foundation", "Git and collaboration", ["Trunk-based development and GitFlow tradeoffs", "PR quality, CODEOWNERS, protected branches", "Release tags, changelogs, semantic versioning", "Monorepo vs polyrepo ownership"], ["Git", "PR", "Release"]],
    ["Cloud", "AWS operations", ["IAM, Organizations, Control Tower, SCPs, CloudTrail", "VPC, Transit Gateway, ALB/NLB, Route 53, PrivateLink", "EC2, ASG, Lambda, ECS, EKS", "S3, EBS, EFS, RDS, Aurora, DynamoDB, Backup"], ["AWS", "Landing zone", "Operations"]],
    ["Cloud", "Azure operations", ["Entra ID, subscriptions, management groups, policy", "VNet, peering, Firewall, App Gateway, Front Door, Private Link", "VMSS, App Service, Functions, Container Apps, AKS", "Blob, Files, Managed Disks, Azure SQL, Cosmos DB, Recovery Services"], ["Azure", "Landing zone", "Operations"]],
    ["IaC", "Terraform engineering", ["Remote state, locking, module design, provider aliases", "Environment strategy: folders, workspaces, Terragrunt, pipelines", "Imports, drift detection, lifecycle rules, moved blocks", "Policy checks, cost checks, docs, module versioning"], ["Terraform", "Modules", "Policy"]],
    ["IaC", "Ansible automation", ["Inventory, roles, templates, handlers, facts", "Idempotent playbooks for bootstrap and patching", "Secrets with Vault and external secret stores", "Operational runbooks for repeatable fixes"], ["Ansible", "Config", "Ops"]],
    ["CI/CD", "Pipeline engineering", ["Build, test, scan, package, publish, deploy, verify", "Artifact promotion instead of rebuilding per environment", "Approvals, change tickets, release notes, rollback plans", "Reusable templates, matrix builds, caching, concurrency controls"], ["GitHub Actions", "Azure DevOps", "Jenkins"]],
    ["Containers", "Docker supply chain", ["Non-root users, slim images, multi-stage builds", "Layer caching and reproducible builds", "ECR, ACR, Docker Hub, Harbor", "SBOM, signing, provenance, vulnerability gates"], ["Docker", "Registry", "SBOM"]],
    ["Containers", "Kubernetes platform", ["Workloads, services, ingress, DNS, config, secrets", "RBAC, network policy, admission control, pod security", "Autoscaling, scheduling, requests/limits, PDBs", "Helm, Kustomize, GitOps, upgrades, backup and restore"], ["EKS", "AKS", "Helm"]],
    ["Security", "DevSecOps", ["SAST, SCA, DAST, IaC and container scanning", "Secret scanning, rotation, break-glass access", "Threat modeling, secure SDLC, audit evidence", "Zero trust, least privilege, encryption, compliance controls"], ["Security", "Compliance", "Policy"]],
    ["Observability", "Monitoring and logging", ["Prometheus metrics, Grafana dashboards, Alertmanager", "CloudWatch, Azure Monitor, Log Analytics, App Insights", "Centralized logs with ELK/OpenSearch/Loki", "Distributed tracing and correlation IDs"], ["Metrics", "Logs", "Traces"]],
    ["SRE", "Reliability engineering", ["SLI/SLO design, error budgets, alert quality", "Incident command, RCA, postmortems", "Capacity planning, load testing, chaos testing", "DR: RTO/RPO, backups, failover drills"], ["SRE", "DR", "Incidents"]],
    ["Data", "Database DevOps", ["Schema versioning, migrations, rollbacks", "RDS/Aurora/Azure SQL backups, replicas, PITR", "Connection pooling, secret rotation, dashboards", "Postgres WAL, vacuum, indexes, replication, HA"], ["Postgres", "RDS", "Azure SQL"]],
    ["SRE", "FinOps and governance", ["Tags, budgets, alerts, reserved capacity", "Rightsizing, autoscaling, lifecycle rules, idle cleanup", "Policy-as-code and exception process", "Cost allocation by team, app, environment"], ["FinOps", "Governance", "Cost"]]
];

const cloud = [
    ["Identity", "AWS: IAM, Organizations, IAM Identity Center, STS", "Azure: Entra ID, RBAC, Management Groups, PIM", "Lab: least-privilege access for app, platform, read-only, break-glass, and CI/CD roles."],
    ["Network", "AWS: VPC, subnets, IGW, NAT, TGW, PrivateLink", "Azure: VNet, NSG, Azure Firewall, Private Link", "Lab: hub-spoke network with private app, private DB, egress control, and DNS."],
    ["Compute", "AWS: EC2, ASG, Lambda, ECS, EKS", "Azure: VMSS, Functions, App Service, Container Apps, AKS", "Lab: deploy the same app through VM, managed app, container, and Kubernetes patterns."],
    ["Storage", "AWS: S3, EBS, EFS, Glacier", "Azure: Blob, Managed Disks, Azure Files, Archive", "Lab: encryption, lifecycle, backups, replication, and access logs."],
    ["Database", "AWS: RDS, Aurora, DynamoDB, ElastiCache", "Azure: Azure SQL, Cosmos DB, Cache for Redis", "Lab: HA database with private access, backups, read replicas, and migration plan."],
    ["Observability", "AWS: CloudWatch, X-Ray, CloudTrail, Config", "Azure: Monitor, App Insights, Activity Logs, Defender", "Lab: alerts, dashboards, audit trails, and compliance reports."],
    ["Security", "AWS: KMS, Secrets Manager, GuardDuty, Security Hub, WAF", "Azure: Key Vault, Defender, Sentinel, WAF, Policy", "Lab: secrets rotation, WAF, vulnerability visibility, and posture tracking."]
];

const pipelines = [
    ["Commit", "PR with linked ticket, tests, docs, risk, and owner."],
    ["Validate", "Lint, unit tests, IaC validate, secret scan, dependency scan."],
    ["Build", "Immutable artifact or image with version, SBOM, provenance."],
    ["Scan", "SAST, SCA, container, IaC, and policy gates."],
    ["Deploy Dev", "Automated dev deploy with smoke tests and review environments."],
    ["Promote", "Same artifact promoted through QA, UAT, staging."],
    ["Deploy Prod", "Blue-green, canary, rolling, or GitOps sync."],
    ["Operate", "Watch SLOs, logs, traces, rollback health, and alerts."]
];

const edgeTopics = [
    ["Edge", "Incident command and outage control", ["Severity model, incident commander, scribe, comms lead, technical lead", "Customer/internal status updates, executive updates, and timeline discipline", "Mitigation-first thinking: rollback, traffic shift, feature flag disable, scaling, failover", "Post-incident review with root cause, contributing factors, action items, owners, and due dates"], ["Incident", "RCA", "Operations"]],
    ["Edge", "Change freeze and emergency release process", ["Holiday/quarter-end freeze rules, exception workflow, business approval", "Emergency change templates with risk, validation, rollback, and approver", "Hotfix branch strategy and production-only patch handling", "Evidence capture for audit after emergency deployment"], ["Release", "Audit", "Governance"]],
    ["Edge", "Cloud identity failure scenarios", ["Expired service principal, rotated secret not updated, OIDC trust broken", "AssumeRole failures, permission boundary issues, SCP deny, Azure policy deny", "Break-glass access design, just-in-time privilege, PIM, access review", "CI/CD identity separation between plan, apply, deploy, and read-only jobs"], ["IAM", "RBAC", "Break-glass"]],
    ["Edge", "Terraform state disasters", ["State lock stuck, accidental state delete, drift after console changes", "Importing existing resources safely and using moved blocks during refactor", "State split/merge strategy for large monolith states", "Recovering from partial apply, provider bugs, and failed replacement of critical resources"], ["Terraform", "State", "Drift"]],
    ["Edge", "Kubernetes production failure modes", ["CrashLoopBackOff, ImagePullBackOff, DNS failures, CNI issues, node pressure", "Bad probes causing restart storms or traffic blackholes", "HPA behavior under missing metrics and cluster autoscaler scale-up delays", "PDB, eviction, rolling update, and zone outage interactions"], ["Kubernetes", "EKS", "AKS"]],
    ["Edge", "Networking blackholes and DNS problems", ["Asymmetric routing, NACL/NSG/security group mismatch, route table priority", "Private endpoint DNS split-horizon issues and stale records", "TLS SNI, certificate chain, mTLS, proxy, and WAF false positives", "Packet capture, flow logs, traceroute, dig/nslookup, curl timing, and load balancer logs"], ["Networking", "DNS", "TLS"]],
    ["Edge", "Database release and migration safety", ["Expand-contract migrations, backward compatibility, feature flag guarded schema changes", "Long locks, index creation strategy, replication lag, failover impact", "Backup before migration and tested point-in-time restore", "Rollback reality: code rollback vs data rollback vs forward fix"], ["Database", "Migration", "Rollback"]],
    ["Edge", "Secrets and certificate rotation", ["Zero-downtime rotation for DB passwords, API keys, TLS certs, and signing keys", "Dual-read or dual-secret rollout pattern", "Detecting hardcoded, leaked, stale, and unused secrets", "Certificate expiry monitoring and ownership model"], ["Security", "Secrets", "Certificates"]],
    ["Edge", "Supply chain and artifact integrity", ["SBOM generation, provenance, image signing, dependency pinning", "Preventing mutable latest tags and unverified base images", "Artifact promotion, registry retention, vulnerability exception workflow", "Build isolation, runner hardening, and dependency confusion prevention"], ["Supply chain", "SBOM", "Registry"]],
    ["Edge", "Runner and agent hardening", ["Self-hosted runner isolation, workspace cleanup, network egress limits", "Ephemeral runners, least privilege tokens, secret masking, log redaction", "Preventing PRs from untrusted forks from accessing secrets", "Patch lifecycle for Jenkins agents, GitHub runners, and Azure DevOps agents"], ["CI/CD", "Security", "Runners"]],
    ["Edge", "Multi-account and multi-subscription governance", ["Account/subscription vending, landing zone baselines, guardrails", "Tag enforcement, budget alerts, policy exemptions, delegated ownership", "Central logging, security tooling, network shared services", "Environment isolation and blast radius design"], ["Governance", "AWS", "Azure"]],
    ["Edge", "Disaster recovery under real constraints", ["RTO/RPO negotiation with business owners, not just technical preference", "Warm standby vs pilot light vs active-active tradeoffs", "DNS failover, data replication, runbook timing, and dependency mapping", "DR drill evidence, restore validation, and cross-region IAM/network readiness"], ["DR", "Resilience", "Business"]],
    ["Edge", "Observability edge cases", ["High-cardinality metrics causing cost and performance issues", "Log storms during incidents and sampling strategy", "Alert fatigue, deduplication, routing, maintenance windows, and escalation", "Trace propagation across service mesh, queues, serverless, and background jobs"], ["Observability", "Cost", "Alerts"]],
    ["Edge", "Performance and capacity engineering", ["Load testing with realistic traffic, data size, caches, and dependency latency", "Connection pool exhaustion, thread starvation, CPU throttling, memory leaks", "Queue backpressure, retry storms, circuit breakers, and timeout budgets", "Autoscaling limits, quota limits, and regional capacity constraints"], ["Performance", "Scaling", "SRE"]],
    ["Edge", "FinOps edge cases", ["NAT gateway, load balancer, log ingestion, metrics, snapshots, and data transfer surprises", "Rightsizing with performance evidence, not blind downsizing", "Reserved instances, savings plans, committed use, and Azure reservations", "Showback/chargeback and cost anomaly response"], ["FinOps", "Cost", "Governance"]],
    ["Edge", "Compliance and audit evidence", ["Who approved, who deployed, what changed, what artifact, what test passed", "Access reviews, separation of duties, production access logs", "Encryption evidence, backup evidence, vulnerability exception records", "Mapping controls to SOC 2, ISO 27001, PCI, HIPAA, or internal audit needs"], ["Compliance", "Audit", "Evidence"]],
    ["Edge", "Enterprise proxy and restricted network environments", ["Corporate proxy, SSL inspection, allowlists, private registries, offline installs", "Package mirror strategy for npm, pip, Maven, apt, yum, and container bases", "Private GitHub/Azure DevOps access from private subnets", "Tooling behavior when internet egress is denied"], ["Proxy", "Network", "Enterprise"]],
    ["Edge", "Mergers, migrations, and modernization", ["Account/subscription consolidation and naming/tagging normalization", "Lift-and-shift vs re-platform vs re-architect decision matrix", "DNS cutover, data sync, parallel run, rollback window, and stakeholder sign-off", "Legacy Jenkins to GitHub Actions/Azure DevOps migration patterns"], ["Migration", "Modernization", "Planning"]],
    ["Edge", "Platform product thinking", ["Golden paths, paved roads, scorecards, developer portal, templates", "Service ownership model, support boundaries, platform SLAs", "Measuring developer experience: lead time, deployment frequency, MTTR, change failure rate", "Avoiding platform bottlenecks with self-service and guardrails"], ["Platform", "DX", "DORA"]],
    ["Edge", "Interview and senior engineer scenarios", ["Explain a full production incident with timeline, mitigation, root cause, and prevention", "Design a secure multi-cloud landing zone and justify every control", "Debug a failed deployment across CI, registry, Kubernetes, network, and database", "Describe tradeoffs between speed, cost, reliability, security, and team ownership"], ["Interview", "Senior", "Design"]]
];

const projects = [
    ["Beginner", "Linux and networking troubleshooting lab", "Two Linux VMs with SSH, users, firewall, Nginx, DNS, TLS, log rotation, and runbook.", ["Linux", "Networking", "Runbook"]],
    ["Beginner", "Dockerized app delivery", "Frontend, backend, and Postgres with Compose, health checks, non-root images, volumes, and Makefile.", ["Docker", "Compose", "Security"]],
    ["Intermediate", "AWS three-tier app with Terraform", "VPC, public/private subnets, ALB, ASG/ECS, RDS/Aurora, S3 logs, IAM, alarms, and CI deploy.", ["AWS", "Terraform", "CI/CD"]],
    ["Intermediate", "Azure three-tier app with Terraform", "VNet, App Gateway or Front Door, App Service/VMSS, Azure SQL, Key Vault, Monitor, Azure DevOps.", ["Azure", "Terraform", "Azure DevOps"]],
    ["Intermediate", "Reusable Terraform module registry", "Versioned modules with examples, docs, tests, tflint/checkov, Infracost, and private registry workflow.", ["IaC", "Governance", "Modules"]],
    ["Advanced", "EKS and AKS GitOps platform", "Ingress, cert-manager, external DNS, External Secrets, metrics, logs, Argo CD, Helm, and RBAC.", ["Kubernetes", "GitOps", "Multi-cloud"]],
    ["Advanced", "Secure CI/CD factory", "Reusable GitHub Actions and Azure DevOps templates with scans, approvals, signed images, and evidence.", ["CI/CD", "Security", "Templates"]],
    ["Advanced", "Observability and SRE command center", "Prometheus, Grafana, logs, Alertmanager, synthetic checks, SLO dashboard, incident runbooks, RCA.", ["Observability", "SRE", "Incidents"]],
    ["Expert", "Multi-cloud landing zone", "AWS and Azure landing zones with identity, network, logging, guardrails, budgets, and workload onboarding.", ["AWS", "Azure", "Governance"]],
    ["Expert", "Disaster recovery and migration project", "Active-passive DR, backup automation, DNS failover, RTO/RPO tests, and migration plan.", ["DR", "Database", "Reliability"]],
    ["Expert", "Internal developer platform", "Golden path with app template, Terraform module, Helm chart, pipeline template, scorecard, docs.", ["Platform", "Developer Experience", "Automation"]]
];

function list(items) {
    return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function tagList(items) {
    return `<div class="tags">${items.map((item) => `<span class="tag">${item}</span>`).join("")}</div>`;
}

function renderFilters() {
    const bar = document.getElementById("filterBar");
    bar.innerHTML = filters.map((filter) => `<button class="${filter === "All" ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("");
    bar.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        document.querySelectorAll("#filterBar button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        applySearch();
    });
}

function renderRoadmap() {
    document.getElementById("roadmapGrid").innerHTML = roadmap.map(([phase, duration, title, items]) => `
        <article class="phase searchable" data-category="Foundation" data-search="${phase} ${duration} ${title} ${items.join(" ")}">
            <div class="phase-meta"><div>${phase}</div><div>${duration}</div></div>
            <div><h3>${title}</h3>${list(items)}</div>
        </article>
    `).join("");
}

function renderTopics() {
    document.getElementById("topicGrid").innerHTML = topics.map(([category, title, items, tags]) => `
        <article class="card searchable" data-category="${category}" data-search="${category} ${title} ${items.join(" ")} ${tags.join(" ")}">
            <p class="eyebrow">${category}</p>
            <h3>${title}</h3>
            ${list(items)}
            ${tagList(tags)}
        </article>
    `).join("");
}

function renderCloud() {
    document.getElementById("cloudGrid").innerHTML = cloud.map(([area, aws, azure, lab]) => `
        <article class="card searchable" data-category="Cloud" data-search="${area} ${aws} ${azure} ${lab}">
            <p class="eyebrow">${area}</p>
            <h3>${aws}</h3>
            <p>${azure}</p>
            <p><strong>Practice:</strong> ${lab}</p>
        </article>
    `).join("");
}

function renderPipelines() {
    document.getElementById("pipelineGrid").innerHTML = pipelines.map(([step, text], index) => `
        <article class="pipeline-step searchable" data-category="CI/CD" data-search="${step} ${text}">
            <strong>${index + 1}. ${step}</strong>
            <p>${text}</p>
        </article>
    `).join("");
}

function renderEdgeTopics() {
    document.getElementById("edgeGrid").innerHTML = edgeTopics.map(([category, title, items, tags]) => `
        <article class="card edge-card searchable" data-category="${category} ${tags.join(" ")}" data-search="${category} ${title} ${items.join(" ")} ${tags.join(" ")}">
            <p class="eyebrow">${category}</p>
            <h3>${title}</h3>
            ${list(items)}
            ${tagList(tags)}
        </article>
    `).join("");
}

function renderProjects() {
    document.getElementById("projectGrid").innerHTML = projects.map(([level, title, text, tags]) => `
        <article class="card searchable" data-category="${tags.join(" ")}" data-search="${level} ${title} ${text} ${tags.join(" ")}">
            <p class="eyebrow">${level}</p>
            <h3>${title}</h3>
            <p>${text}</p>
            ${tagList(tags)}
        </article>
    `).join("");
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

function setupTopButton() {
    const button = document.getElementById("topButton");
    window.addEventListener("scroll", () => button.classList.toggle("visible", window.scrollY > 700));
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

renderFilters();
renderRoadmap();
renderTopics();
renderCloud();
renderPipelines();
renderEdgeTopics();
renderProjects();
setupTopButton();
document.getElementById("searchInput").addEventListener("input", applySearch);
