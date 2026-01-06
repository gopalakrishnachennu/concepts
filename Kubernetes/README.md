# 🚀 AWS PostgreSQL Infrastructure with Terraform, Ansible & CI/CD

> **Enterprise-grade workflow** for building, configuring, and automating AWS infrastructure with PostgreSQL database management.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Component Structure](#-component-structure)
- [Deployment Flow](#-deployment-flow)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Database Options](#-database-options)
- [Setup Guide](#-setup-guide)
- [Best Practices](#-best-practices)
- [Monitoring & Security](#-monitoring--security)
- [Tools Reference](#-tools-reference)

---

## 🎯 Overview

This project demonstrates a **complete DevOps workflow** that combines:

- **Infrastructure as Code** (Terraform) → Provision AWS resources
- **Configuration Management** (Ansible) → Configure servers and applications
- **CI/CD Automation** → Automated testing, deployment, and monitoring
- **Database Management** → PostgreSQL on RDS or EC2

### 🔑 Key Features

- ✅ Automated infrastructure provisioning
- ✅ Secure credential management
- ✅ Multi-environment support (dev/staging/prod)
- ✅ Automated backups and monitoring
- ✅ Git-based version control
- ✅ Idempotent configurations

---

## 🏗️ Architecture

### End-to-End Flow

```
┌─────────────────────────────┐
│   👨‍💻 Developer Workstation  │
│   (VS Code + Git + CLI)     │
└──────────────┬──────────────┘
               │
               │ git push
               ▼
┌─────────────────────────────┐
│   🔄 CI/CD Pipeline         │
│   • Lint & Validate         │
│   • Terraform Plan/Apply    │
│   • Ansible Configuration   │
│   • Automated Testing       │
└──────────────┬──────────────┘
               │
               │ provision
               ▼
┌─────────────────────────────┐
│   ☁️  AWS Cloud              │
│   • VPC & Networking        │
│   • Security Groups         │
│   • EC2 Instances           │
│   • RDS PostgreSQL          │
└──────────────┬──────────────┘
               │
               │ configure
               ▼
┌─────────────────────────────┐
│   🐧 Ubuntu EC2 Server      │
│   • PostgreSQL Setup        │
│   • User & DB Config        │
│   • Firewall Rules          │
│   • SSH Key Management      │
└──────────────┬──────────────┘
               │
               │ connect
               ▼
┌─────────────────────────────┐
│   🗄️  PostgreSQL Database   │
│   (RDS or Self-Hosted)      │
└─────────────────────────────┘
```

### 🔗 Integration Flow

```
Terraform → Ansible → PostgreSQL → CI/CD → Monitoring
   ↓          ↓           ↓          ↓         ↓
 Infra     Config      Database   Automate  Observe
```

---

## 📦 Component Structure

```
aws-postgresql-project/
│
├── 📁 terraform/                    # Infrastructure as Code
│   ├── main.tf                      # Primary resources
│   ├── variables.tf                 # Input variables
│   ├── outputs.tf                   # Output values
│   ├── backend.tf                   # S3 remote state
│   ├── terraform.tfvars             # Variable values
│   └── modules/                     # Reusable modules
│       ├── vpc/
│       ├── ec2/
│       └── rds/
│
├── 📁 ansible/                      # Configuration Management
│   ├── ansible.cfg                  # Ansible settings
│   ├── inventory/
│   │   ├── hosts.ini                # Server inventory
│   │   └── group_vars/              # Group variables
│   ├── roles/
│   │   ├── common/                  # Base configuration
│   │   ├── postgresql/              # DB setup
│   │   └── security/                # Security hardening
│   ├── site.yml                     # Main playbook
│   └── vault/                       # Encrypted secrets
│
├── 📁 .github/workflows/            # CI/CD Pipelines
│   ├── terraform-plan.yml           # Infrastructure validation
│   ├── terraform-apply.yml          # Infrastructure deployment
│   ├── ansible-lint.yml             # Configuration linting
│   └── deploy.yml                   # Full deployment
│
├── 📁 scripts/                      # Utility scripts
│   ├── setup.sh                     # Initial setup
│   ├── backup.sh                    # Database backup
│   └── restore.sh                   # Database restore
│
├── 📁 docs/                         # Documentation
│   ├── architecture.md
│   ├── deployment-guide.md
│   └── troubleshooting.md
│
├── .gitignore                       # Git ignore rules
├── README.md                        # This file
└── LICENSE                          # Project license
```

---

## 🔄 Deployment Flow

### Sequential Execution

```
┌────────────┐
│ Developer  │
└─────┬──────┘
      │
      │ 1️⃣ git push
      ▼
┌────────────┐
│  GitHub    │
└─────┬──────┘
      │
      │ 2️⃣ trigger CI/CD
      ▼
┌────────────┐
│ Terraform  │
│ Init       │
└─────┬──────┘
      │
      │ 3️⃣ terraform plan
      ▼
┌────────────┐
│ Terraform  │
│ Apply      │
└─────┬──────┘
      │
      │ 4️⃣ provision AWS
      ▼
┌────────────┐
│   AWS      │
│ Resources  │
└─────┬──────┘
      │
      │ 5️⃣ ansible-playbook
      ▼
┌────────────┐
│  Configure │
│   Server   │
└─────┬──────┘
      │
      │ 6️⃣ verify & test
      ▼
┌────────────┐
│ PostgreSQL │
│   Ready    │
└────────────┘
```

---

## 🔁 CI/CD Pipeline

### Pipeline Stages

```
┌──────────────────┐
│   🔍 CI Stage    │
│                  │
│ ✓ Code Checkout  │
│ ✓ Lint Code      │
│ ✓ Validate IaC   │
│ ✓ Security Scan  │
│ ✓ Unit Tests     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   🚀 CD Stage    │
│                  │
│ ✓ Terraform Plan │
│ ✓ Manual Approve │
│ ✓ Terraform Apply│
│ ✓ Ansible Config │
│ ✓ Smoke Tests    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 📊 Post-Deploy   │
│                  │
│ ✓ Health Check   │
│ ✓ Setup Alerts   │
│ ✓ Backup Config  │
│ ✓ Documentation  │
└──────────────────┘
```

### Example GitHub Actions Workflow

```yaml
name: Deploy Infrastructure

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4

      - name: ⚙️ Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.6.0

      - name: 🔧 Terraform Init
        run: |
          cd terraform
          terraform init

      - name: ✅ Terraform Validate
        run: terraform validate

      - name: 📋 Terraform Plan
        run: terraform plan -out=tfplan

      - name: 🚀 Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve tfplan

  ansible:
    needs: terraform
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4

      - name: 🔧 Install Ansible
        run: |
          sudo apt update
          sudo apt install -y ansible

      - name: ✅ Ansible Lint
        run: |
          cd ansible
          ansible-lint site.yml

      - name: 🚀 Run Playbook
        run: |
          cd ansible
          ansible-playbook -i inventory/hosts.ini site.yml
```

---

## 🗄️ Database Options

### Decision Tree

```
                 Need Database?
                      │
          ┌───────────┴───────────┐
          │                       │
     ✅ Managed               ⚙️ Custom
       Service                 Control
          │                       │
          ▼                       ▼
    ┌───────────┐         ┌───────────┐
    │  AWS RDS  │         │  EC2 Self │
    │ PostgreSQL│         │  -Hosted  │
    └─────┬─────┘         └─────┬─────┘
          │                     │
          ▼                     ▼
    • Auto Backups        • Full Control
    • Auto Updates        • Custom Config
    • High Avail.         • Cost Effective
    • Easy Scaling        • More Effort
```

### Comparison

| Feature              | 🏆 AWS RDS                | ⚙️ EC2 Self-Hosted    |
| -------------------- | ------------------------- | --------------------- |
| **Setup Time**       | Minutes                   | Hours                 |
| **Maintenance**      | Automated                 | Manual                |
| **Backups**          | Automatic                 | Manual setup required |
| **Scaling**          | Easy (one-click)          | Manual configuration  |
| **Cost**             | Higher                    | Lower (compute only)  |
| **Control**          | Limited                   | Full control          |
| **Multi-AZ**         | Built-in option           | Manual setup          |
| **Best For**         | Production, high-traffic  | Dev, testing, learning|

---

## 🚀 Setup Guide

### Prerequisites

Ensure you have the following installed:

- ✅ **AWS CLI** (v2.x) - [Install Guide](https://aws.amazon.com/cli/)
- ✅ **Terraform** (v1.6+) - [Install Guide](https://terraform.io/downloads)
- ✅ **Ansible** (v2.15+) - [Install Guide](https://docs.ansible.com/ansible/latest/installation_guide/)
- ✅ **Git** - [Install Guide](https://git-scm.com/downloads)
- ✅ **VS Code** (recommended) - [Download](https://code.visualstudio.com/)
- ✅ **PostgreSQL Client** (psql) - [Install Guide](https://www.postgresql.org/download/)

### 1️⃣ Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/aws-postgresql-infra.git
cd aws-postgresql-infra

# Configure AWS credentials
aws configure

# Initialize Terraform
cd terraform
terraform init

# Validate configuration
terraform validate
```

### 2️⃣ Deploy Infrastructure

```bash
# Review planned changes
terraform plan

# Apply infrastructure
terraform apply

# Save outputs
terraform output > ../ansible/inventory/terraform_outputs.txt
```

### 3️⃣ Configure with Ansible

```bash
cd ../ansible

# Test connectivity
ansible all -i inventory/hosts.ini -m ping

# Run configuration playbook
ansible-playbook -i inventory/hosts.ini site.yml

# Verify PostgreSQL
ansible-playbook -i inventory/hosts.ini verify.yml
```

### 4️⃣ Connect to Database

```bash
# Get connection details from Terraform output
terraform output db_endpoint
terraform output db_username

# Connect using psql
psql -h <db_endpoint> -U <username> -d postgres
```

---

## ✅ Best Practices

### 🔒 Security

| Practice                     | Implementation                                |
| ---------------------------- | --------------------------------------------- |
| **Secrets Management**       | Use AWS Secrets Manager or Ansible Vault     |
| **Network Security**         | Restrict Security Groups to minimum required  |
| **SSH Access**               | Use SSH keys only, disable password auth      |
| **Database Access**          | Allow only from application security groups   |
| **Encryption**               | Enable encryption at rest and in transit      |
| **IAM Roles**                | Use roles instead of access keys              |

### 🏗️ Infrastructure

```yaml
✅ Use Terraform modules for reusability
✅ Store state remotely (S3 + DynamoDB)
✅ Enable state locking
✅ Use workspaces for environments
✅ Tag all resources consistently
✅ Implement cost allocation tags
```

### ⚙️ Configuration

```yaml
✅ Use Ansible roles for modularity
✅ Encrypt sensitive data with Vault
✅ Make playbooks idempotent
✅ Use variables and templates
✅ Test in non-production first
✅ Document all custom configurations
```

### 🔄 CI/CD

```yaml
✅ Automate testing and validation
✅ Implement manual approval gates
✅ Use separate pipelines per environment
✅ Enable rollback capabilities
✅ Monitor pipeline execution
✅ Store artifacts securely
```

---

## 📊 Monitoring & Security

### Monitoring Stack

```
┌─────────────────────┐
│  📈 CloudWatch      │
│  • CPU Metrics      │
│  • Memory Usage     │
│  • Disk I/O         │
│  • DB Connections   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  🔔 Alerts          │
│  • SNS Topics       │
│  • Email/Slack      │
│  • PagerDuty        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  📊 Dashboards      │
│  • Grafana          │
│  • CloudWatch       │
│  • Custom Metrics   │
└─────────────────────┘
```

### Security Layers

```
┌─────────────────────────────┐
│  🔐 AWS Secrets Manager     │
│  • DB Credentials           │
│  • API Keys                 │
│  • SSL Certificates         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  🛡️  Security Groups        │
│  • Inbound Rules            │
│  • Outbound Rules           │
│  • Least Privilege          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  💾 Backup Automation       │
│  • Daily Snapshots          │
│  • pg_dump Scripts          │
│  • S3 Storage               │
│  • 30-day Retention         │
└─────────────────────────────┘
```

### Backup Strategy

```bash
# Automated backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="myapp"

# Create backup
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | \
  gzip > $BACKUP_DIR/backup_${TIMESTAMP}.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_${TIMESTAMP}.sql.gz \
  s3://my-db-backups/postgres/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -mtime +30 -delete
```

---

## 🛠️ Tools Reference

### Core Technologies

| Tool                      | Version | Purpose                  | Documentation                      |
| ------------------------- | ------- | ------------------------ | ---------------------------------- |
| 🔧 **Terraform**          | 1.6+    | Infrastructure as Code   | [docs.terraform.io](https://terraform.io) |
| ⚙️ **Ansible**            | 2.15+   | Configuration Management | [docs.ansible.com](https://ansible.com)   |
| 🐘 **PostgreSQL**         | 15.x    | Relational Database      | [postgresql.org](https://postgresql.org)  |
| ☁️ **AWS**                | -       | Cloud Platform           | [aws.amazon.com](https://aws.amazon.com)  |
| 🐧 **Ubuntu**             | 22.04   | Operating System         | [ubuntu.com](https://ubuntu.com)          |

### Development Tools

| Tool              | Purpose                  |
| ----------------- | ------------------------ |
| 💻 **VS Code**    | Primary IDE              |
| 🐙 **Git**        | Version Control          |
| 🔄 **GitHub Actions** | CI/CD Automation     |
| 📊 **Grafana**    | Metrics Visualization    |
| 🔍 **Checkov**    | IaC Security Scanning    |
| 🧪 **Terraform Validate** | IaC Testing      |
| 📝 **Ansible Lint** | Playbook Linting       |

---

## 🔍 Quick Reference

### Common Commands

```bash
# Terraform
terraform init              # Initialize working directory
terraform plan              # Preview changes
terraform apply             # Apply changes
terraform destroy           # Destroy infrastructure
terraform output            # Show outputs
terraform state list        # List resources

# Ansible
ansible-playbook site.yml   # Run main playbook
ansible all -m ping         # Test connectivity
ansible-vault encrypt file  # Encrypt sensitive file
ansible-playbook --check    # Dry run mode

# AWS CLI
aws ec2 describe-instances  # List EC2 instances
aws rds describe-db-instances # List RDS instances
aws s3 ls                   # List S3 buckets

# PostgreSQL
psql -h host -U user -d db  # Connect to database
\l                          # List databases
\dt                         # List tables
\q                          # Quit psql
```

### Environment Variables

```bash
# AWS Configuration
export AWS_PROFILE=myprofile
export AWS_REGION=us-east-1
export AWS_DEFAULT_REGION=us-east-1

# Terraform
export TF_VAR_environment=dev
export TF_VAR_db_password="secure_password"

# Ansible
export ANSIBLE_HOST_KEY_CHECKING=False
export ANSIBLE_VAULT_PASSWORD_FILE=~/.vault_pass
```

---

## 📈 Workflow Summary

```
┌─────────────┐
│  Developer  │  → Write Terraform/Ansible code
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Git Push   │  → Commit and push changes
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  CI/CD      │  → Automated validation & testing
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Terraform  │  → Provision AWS infrastructure
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Ansible    │  → Configure servers
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ PostgreSQL  │  → Database ready for use
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Monitoring  │  → CloudWatch + alerts
└─────────────┘
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- 📧 **Email**: devops@yourcompany.com
- 💬 **Slack**: #devops-support
- 📖 **Wiki**: [Internal Documentation](https://wiki.company.com/devops)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/aws-postgresql-infra/issues)

---

## 🎓 Additional Resources

- [AWS Best Practices](https://aws.amazon.com/architecture/well-architected/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

<div align="center">

**Built with ❤️ by the GOPALA KRISHNA CHENNU**

⭐ **Star this repo** if you find it helpful!

</div>