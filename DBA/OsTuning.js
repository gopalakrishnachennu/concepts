/**
 * OsTuning.js - Interactive DBA OS Tuning Learning Module
 * Comprehensive animations, visualizations, and interactive content
 */

const OsTuning = (() => {
    // State management
    const state = {
        sectionsVisited: new Set(),
        startTime: Date.now(),
        currentScenario: 'on-prem-memory',
        animationSpeed: 1000, // milliseconds per step
    };

    // Comparison data
    const comparisonData = [
        {
            aspect: 'OS Access',
            onPrem: 'Full SSH access to servers',
            cloud: 'No direct OS access (managed service)'
        },
        {
            aspect: 'Kernel Parameters',
            onPrem: 'Direct sysctl commands (kernel.shmmax, etc.)',
            cloud: 'Parameter groups with abstracted settings'
        },
        {
            aspect: 'Memory Tuning',
            onPrem: 'Manual calculation and configuration',
            cloud: 'Automatic based on instance class'
        },
        {
            aspect: 'Scaling Approach',
            onPrem: 'Hardware procurement (weeks/months)',
            cloud: 'Instance class change (minutes)'
        },
        {
            aspect: 'Configuration Method',
            onPrem: 'Edit /etc/sysctl.conf, postgresql.conf',
            cloud: 'AWS Console, CLI, or Infrastructure as Code'
        },
        {
            aspect: 'Change Management',
            onPrem: 'Formal CAB approval, change tickets',
            cloud: 'Faster approval, automated rollback'
        },
        {
            aspect: 'Monitoring',
            onPrem: 'Custom scripts (vmstat, iostat, top)',
            cloud: 'CloudWatch, Performance Insights'
        },
        {
            aspect: 'Cost Model',
            onPrem: 'CapEx (upfront hardware purchase)',
            cloud: 'OpEx (pay-per-hour, reserved instances)'
        },
        {
            aspect: 'Backup/Snapshot',
            onPrem: 'Manual backup scripts, storage management',
            cloud: 'Automated snapshots via API/Console'
        },
        {
            aspect: 'Disaster Recovery',
            onPrem: 'Manual failover, complex setup',
            cloud: 'Multi-AZ, automated failover'
        }
    ];

    // On-Premises workflow steps with code snippets
    const onPremSteps = [
        {
            step: 1,
            title: 'IDENTIFY PROBLEM',
            description: 'Application reports slow queries',
            details: 'Users complain about performance degradation',
            icon: '🔍',
            codeSnippets: [
                {
                    title: 'Check Application Logs',
                    code: `# Review application error logs
tail -f /var/log/application/app.log | grep -i "slow\|timeout\|error"

# Check for specific slow query patterns
grep "execution time" /var/log/application/app.log | awk '{if($NF>1000)print}'`,
                    language: 'bash'
                },
                {
                    title: 'Quick Database Connection Test',
                    code: `# Test database connectivity and response time
time psql -h prod-db-01 -U dbuser -d production -c "SELECT 1;"

# Check active connections
psql -h prod-db-01 -U dbuser -d production -c "SELECT count(*) FROM pg_stat_activity;"`,
                    language: 'bash'
                }
            ]
        },
        {
            step: 2,
            title: 'ANALYZE',
            description: 'DBA investigates server metrics',
            details: 'Use top, vmstat, iostat, free -m, sysctl -a',
            icon: '📊',
            codeSnippets: [
                {
                    title: 'System Resource Analysis',
                    code: `# Check CPU and memory usage
top -b -n 1 | head -20

# Memory statistics
free -m

# Check swap usage (high swap = memory pressure)
vmstat 1 5`,
                    language: 'bash'
                },
                {
                    title: 'I/O Performance Check',
                    code: `# Disk I/O statistics
iostat -x 2 5

# Check for I/O wait
sar -u 1 10

# Identify processes causing I/O
iotop -o -b -n 3`,
                    language: 'bash'
                },
                {
                    title: 'Current Kernel Parameters',
                    code: `# Check shared memory settings
sysctl -a | grep shm

# Check semaphore settings
sysctl -a | grep sem

# Check file descriptor limits
ulimit -n
cat /proc/sys/fs/file-max`,
                    language: 'bash'
                },
                {
                    title: 'PostgreSQL Specific Checks',
                    code: `# Check PostgreSQL memory usage
ps aux | grep postgres | awk '{sum+=$6} END {print sum/1024 " MB"}'

# Check for memory allocation errors in logs
grep -i "memory\|allocation\|shared" /var/log/postgresql/postgresql-14-main.log | tail -20`,
                    language: 'bash'
                }
            ]
        },
        {
            step: 3,
            title: 'DIAGNOSE',
            description: 'Identify root cause',
            details: 'kernel.shmmax=32MB (Need 16GB)',
            icon: '🎯',
            codeSnippets: [
                {
                    title: 'Identify Memory Bottleneck',
                    code: `# Check current shared memory limits
ipcs -lm

# Output shows:
# max seg size (kbytes) = 32768  # Only 32MB!

# Check what PostgreSQL is requesting
grep shared_buffers /etc/postgresql/14/main/postgresql.conf`,
                    language: 'bash'
                },
                {
                    title: 'Calculate Required Memory',
                    code: `# Server has 64GB RAM
# PostgreSQL best practice: 25% for shared_buffers
# Required: 64GB * 0.25 = 16GB

# Convert to bytes for shmmax
echo "16 * 1024 * 1024 * 1024" | bc
# Result: 17179869184

# Convert to pages for shmall (page size = 4096)
echo "17179869184 / 4096" | bc
# Result: 4194304`,
                    language: 'bash'
                },
                {
                    title: 'Verify Current vs Required',
                    code: `# Create comparison script
cat << 'EOF' > check_memory.sh
#!/bin/bash
echo "=== Current Settings ==="
echo "shmmax: $(sysctl -n kernel.shmmax) bytes ($(echo "scale=2; $(sysctl -n kernel.shmmax)/1024/1024" | bc) MB)"
echo "shmall: $(sysctl -n kernel.shmall) pages"
echo ""
echo "=== Required Settings ==="
echo "shmmax: 17179869184 bytes (16384 MB)"
echo "shmall: 4194304 pages"
EOF

chmod +x check_memory.sh
./check_memory.sh`,
                    language: 'bash'
                }
            ]
        },
        {
            step: 4,
            title: 'REQUEST',
            description: 'Create change request',
            details: 'Submit ticket CHG-12345 to System Admin team',
            icon: '📝',
            codeSnippets: [
                {
                    title: 'Change Request Template',
                    code: `Subject: [URGENT] Production DB OS Tuning - Shared Memory Increase

Priority: High
Environment: Production
Server: prod-db-01 (10.50.1.100)
Database: PostgreSQL 14
Ticket: CHG-12345

Business Impact:
- Customer transactions experiencing 5-10 second delays
- Query timeouts affecting 15% of requests
- Revenue impact: ~$5000/hour

Root Cause:
- kernel.shmmax limited to 32MB
- PostgreSQL requires 16GB for optimal performance
- Current setting causing excessive disk I/O

Requested Changes:
- kernel.shmmax: 33554432 → 17179869184 (32MB → 16GB)
- kernel.shmall: 2097152 → 4194304

Implementation Window:
- Preferred: Saturday 2AM-4AM EST
- Estimated Duration: 30 minutes
- Downtime Required: ~5 minutes (PostgreSQL restart)

Rollback Plan:
- Revert sysctl settings to original values
- Restart PostgreSQL with old configuration
- Estimated rollback time: 5 minutes

Approval Required From:
- System Admin Team Lead
- Database Team Lead
- Change Advisory Board`,
                    language: 'text'
                },
                {
                    title: 'Gather Supporting Evidence',
                    code: `# Create evidence package
mkdir -p /tmp/change-evidence-CHG-12345

# Capture current metrics
vmstat 5 12 > /tmp/change-evidence-CHG-12345/vmstat.txt
iostat -x 5 12 > /tmp/change-evidence-CHG-12345/iostat.txt
free -m > /tmp/change-evidence-CHG-12345/memory.txt
sysctl -a | grep shm > /tmp/change-evidence-CHG-12345/current-shmem.txt

# Capture slow query logs
tail -1000 /var/log/postgresql/postgresql-14-main.log > /tmp/change-evidence-CHG-12345/pg-errors.log

# Create archive
tar -czf change-evidence-CHG-12345.tar.gz -C /tmp change-evidence-CHG-12345/`,
                    language: 'bash'
                }
            ]
        },
        {
            step: 5,
            title: 'APPROVAL',
            description: 'Change Advisory Board reviews',
            details: 'CAB approves change for maintenance window',
            icon: '✅',
            codeSnippets: [
                {
                    title: 'Pre-Implementation Checklist',
                    code: `# Create pre-implementation checklist
cat << 'EOF' > pre-implementation-checklist.md
## Pre-Implementation Checklist - CHG-12345

### Documentation
- [x] Change request submitted and approved
- [x] Technical details documented
- [x] Rollback procedure documented
- [x] Stakeholders notified

### Backups
- [ ] Full database backup completed
- [ ] Configuration files backed up
- [ ] Backup verified and tested

### Team Readiness
- [ ] System Admin on standby
- [ ] DBA on standby
- [ ] Network team notified
- [ ] Application team notified

### Testing
- [ ] Change tested in DEV environment
- [ ] Change tested in QA environment
- [ ] Change tested in STAGING environment
- [ ] Performance metrics baselined

### Communication
- [ ] Maintenance window announced
- [ ] Status page updated
- [ ] Customer support notified
- [ ] Executive team notified

### Go/No-Go Decision
- [ ] All checklist items completed
- [ ] Weather: Clear (no other changes)
- [ ] Team: Ready
- [ ] Decision: GO / NO-GO
EOF`,
                    language: 'markdown'
                }
            ]
        },
        {
            step: 6,
            title: 'IMPLEMENT',
            description: 'System Admin modifies OS',
            details: 'Edit /etc/sysctl.conf, run sysctl -p',
            icon: '⚙️',
            codeSnippets: [
                {
                    title: 'Backup Current Configuration',
                    code: `# Backup current sysctl settings
sudo cp /etc/sysctl.conf /etc/sysctl.conf.backup.$(date +%Y%m%d-%H%M%S)

# Backup current runtime settings
sudo sysctl -a > /root/sysctl-runtime-backup-$(date +%Y%m%d-%H%M%S).txt

# Verify backups
ls -lh /etc/sysctl.conf.backup.*
ls -lh /root/sysctl-runtime-backup-*`,
                    language: 'bash'
                },
                {
                    title: 'Apply Temporary Settings (Test First)',
                    code: `# Apply settings temporarily (lost on reboot)
sudo sysctl -w kernel.shmmax=17179869184
sudo sysctl -w kernel.shmall=4194304

# Verify changes
sudo sysctl kernel.shmmax kernel.shmall

# Expected output:
# kernel.shmmax = 17179869184
# kernel.shmall = 4194304`,
                    language: 'bash'
                },
                {
                    title: 'Make Changes Permanent',
                    code: `# Edit /etc/sysctl.conf
sudo tee -a /etc/sysctl.conf << 'EOF'

# ================================================
# PostgreSQL Shared Memory Configuration
# Change Request: CHG-12345
# Implemented by: John Admin
# Date: $(date +%Y-%m-%d)
# Reason: Increase shared memory for PostgreSQL
# ================================================

# Shared Memory Maximum (16GB in bytes)
kernel.shmmax = 17179869184

# Shared Memory All (16GB in pages, 4KB page size)
kernel.shmall = 4194304

# Shared Memory Segments
kernel.shmmni = 4096

# ================================================
EOF

# Apply changes permanently
sudo sysctl -p

# Verify persistence
sudo sysctl -a | grep -E "kernel.shm(max|all|mni)"`,
                    language: 'bash'
                },
                {
                    title: 'Additional Kernel Tuning (Optional)',
                    code: `# Add other database-friendly kernel parameters
sudo tee -a /etc/sysctl.conf << 'EOF'

# Semaphore settings (helps with connection handling)
kernel.sem = 250 32000 100 128

# Network buffer sizes
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728

# File handle limits
fs.file-max = 6815744

# Disable swapping (prefer OOM over swap)
vm.swappiness = 1

# Dirty page handling
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
EOF

sudo sysctl -p`,
                    language: 'bash'
                }
            ]
        },
        {
            step: 7,
            title: 'DATABASE CONFIG',
            description: 'DBA updates database settings',
            details: 'Edit postgresql.conf, restart service',
            icon: '🗄️',
            codeSnippets: [
                {
                    title: 'Backup PostgreSQL Configuration',
                    code: `# Backup PostgreSQL config
sudo cp /etc/postgresql/14/main/postgresql.conf \\
        /etc/postgresql/14/main/postgresql.conf.backup.$(date +%Y%m%d-%H%M%S)

# Verify backup
ls -lh /etc/postgresql/14/main/postgresql.conf.backup.*`,
                    language: 'bash'
                },
                {
                    title: 'Update PostgreSQL Memory Settings',
                    code: `# Edit postgresql.conf
sudo vi /etc/postgresql/14/main/postgresql.conf

# Or use sed for automated changes
sudo sed -i.bak \\
  -e "s/^shared_buffers = .*/shared_buffers = 16GB/" \\
  -e "s/^#effective_cache_size = .*/effective_cache_size = 48GB/" \\
  -e "s/^#work_mem = .*/work_mem = 64MB/" \\
  -e "s/^#maintenance_work_mem = .*/maintenance_work_mem = 2GB/" \\
  /etc/postgresql/14/main/postgresql.conf`,
                    language: 'bash'
                },
                {
                    title: 'Complete PostgreSQL Configuration',
                    code: `# Add comprehensive memory settings
sudo tee -a /etc/postgresql/14/main/postgresql.conf << 'EOF'

# ================================================
# Memory Configuration - CHG-12345
# Updated: $(date +%Y-%m-%d)
# ================================================

# Shared Buffers (25% of RAM)
shared_buffers = 16GB

# Effective Cache Size (75% of RAM)
effective_cache_size = 48GB

# Work Memory (per query operation)
work_mem = 64MB

# Maintenance Work Memory (for VACUUM, CREATE INDEX)
maintenance_work_mem = 2GB

# WAL Buffers
wal_buffers = 16MB

# Checkpoint Settings
checkpoint_completion_target = 0.9
max_wal_size = 4GB
min_wal_size = 1GB

# ================================================
EOF`,
                    language: 'bash'
                },
                {
                    title: 'Validate and Restart PostgreSQL',
                    code: `# Validate configuration syntax
sudo -u postgres /usr/lib/postgresql/14/bin/postgres \\
  -C config_file=/etc/postgresql/14/main/postgresql.conf \\
  --check

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check status
sudo systemctl status postgresql

# Verify settings were applied
sudo -u postgres psql -c "SHOW shared_buffers;"
sudo -u postgres psql -c "SHOW effective_cache_size;"
sudo -u postgres psql -c "SHOW work_mem;"
sudo -u postgres psql -c "SHOW maintenance_work_mem;"`,
                    language: 'bash'
                }
            ]
        },
        {
            step: 8,
            title: 'VALIDATE',
            description: 'Monitor for 24-48 hours',
            details: 'Check query performance, cache hit ratio, I/O',
            icon: '✓',
            codeSnippets: [
                {
                    title: 'Check Shared Memory Usage',
                    code: `# View shared memory segments
ipcs -m

# Check PostgreSQL shared memory usage
sudo -u postgres psql << 'EOF'
SELECT 
    pg_size_pretty(pg_database_size(current_database())) as db_size,
    pg_size_pretty(sum(pg_total_relation_size(schemaname||'.'||tablename))::bigint) as tables_size
FROM pg_tables
WHERE schemaname = 'public';
EOF`,
                    language: 'bash'
                },
                {
                    title: 'Monitor Cache Hit Ratio',
                    code: `# Check buffer cache hit ratio (should be > 99%)
sudo -u postgres psql << 'EOF'
SELECT 
    datname,
    blks_read,
    blks_hit,
    round(
        blks_hit::numeric / nullif(blks_hit + blks_read, 0) * 100, 
        2
    ) AS cache_hit_ratio
FROM pg_stat_database
WHERE datname NOT IN ('template0', 'template1', 'postgres')
ORDER BY cache_hit_ratio;
EOF`,
                    language: 'sql'
                },
                {
                    title: 'Query Performance Comparison',
                    code: `# Enable query timing
sudo -u postgres psql << 'EOF'
\\timing on

-- Run sample queries and compare times
SELECT count(*) FROM large_table;
SELECT * FROM users WHERE created_at > NOW() - INTERVAL '1 day';

-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
EOF`,
                    language: 'sql'
                },
                {
                    title: 'System Performance Monitoring',
                    code: `# Create monitoring script
cat << 'EOF' > monitor_performance.sh
#!/bin/bash
echo "=== $(date) ==="
echo "Memory Usage:"
free -m | grep -E "Mem|Swap"
echo ""
echo "I/O Wait:"
iostat -x 1 2 | tail -n +4
echo ""
echo "PostgreSQL Connections:"
sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity;"
echo ""
echo "Cache Hit Ratio:"
sudo -u postgres psql -t -c "
SELECT round(blks_hit::numeric / nullif(blks_hit + blks_read, 0) * 100, 2) 
FROM pg_stat_database WHERE datname = 'production';"
echo "================================"
EOF

chmod +x monitor_performance.sh

# Run every 5 minutes for 24 hours
watch -n 300 ./monitor_performance.sh >> performance_log.txt`,
                    language: 'bash'
                },
                {
                    title: 'Create Performance Report',
                    code: `# Generate performance comparison report
sudo -u postgres psql << 'EOF'
-- Before/After Metrics
SELECT 
    'Before Change' as period,
    '85%' as cache_hit_ratio,
    '2.5s' as avg_query_time,
    '45%' as io_wait
UNION ALL
SELECT 
    'After Change' as period,
    round(blks_hit::numeric / nullif(blks_hit + blks_read, 0) * 100, 2)::text || '%' as cache_hit_ratio,
    '0.3s' as avg_query_time,
    '5%' as io_wait
FROM pg_stat_database 
WHERE datname = 'production';
EOF`,
                    language: 'sql'
                }
            ]
        },
        {
            step: 9,
            title: 'DOCUMENT',
            description: 'Update documentation',
            details: 'Update runbook, close ticket, post-implementation report',
            icon: '📚',
            codeSnippets: [
                {
                    title: 'Post-Implementation Report',
                    code: `# Create post-implementation report
cat << 'EOF' > post-implementation-CHG-12345.md
# Post-Implementation Report: CHG-12345

## Change Summary
**Date:** $(date +%Y-%m-%d)
**Server:** prod-db-01
**Change:** Increased kernel shared memory limits

## Changes Implemented

### OS Level
- kernel.shmmax: 33554432 → 17179869184 (32MB → 16GB)
- kernel.shmall: 2097152 → 4194304
- Changes persisted in /etc/sysctl.conf

### Database Level
- shared_buffers: 128MB → 16GB
- effective_cache_size: 4GB → 48GB
- work_mem: 4MB → 64MB
- maintenance_work_mem: 64MB → 2GB

## Performance Metrics

### Before Change
- Cache Hit Ratio: 85%
- Average Query Time: 2.5s
- I/O Wait: 45%
- Customer Complaints: 15/hour

### After Change
- Cache Hit Ratio: 99.5%
- Average Query Time: 0.3s
- I/O Wait: 5%
- Customer Complaints: 0/hour

## Downtime
- Planned: 30 minutes
- Actual: 8 minutes
- Services Affected: Main database (read-only mode)

## Issues Encountered
- None

## Rollback Required
- No

## Lessons Learned
1. Memory tuning had immediate positive impact
2. Testing in lower environments was crucial
3. Communication with stakeholders prevented confusion

## Next Steps
1. Monitor for 7 days
2. Apply same changes to DR site
3. Update capacity planning documentation
4. Schedule quarterly performance review

## Sign-off
- DBA Team: ✅ Approved
- System Admin: ✅ Approved
- Application Team: ✅ Verified
- Change Manager: ✅ Closed
EOF`,
                    language: 'markdown'
                },
                {
                    title: 'Update Runbook',
                    code: `# Add to operations runbook
cat << 'EOF' >> /docs/runbooks/database-operations.md

## PostgreSQL Memory Configuration

### Current Settings (as of $(date +%Y-%m-%d))

**Kernel Parameters:**
\`\`\`bash
kernel.shmmax = 17179869184  # 16GB
kernel.shmall = 4194304      # 16GB in pages
kernel.shmmni = 4096
\`\`\`

**PostgreSQL Parameters:**
\`\`\`
shared_buffers = 16GB
effective_cache_size = 48GB
work_mem = 64MB
maintenance_work_mem = 2GB
\`\`\`

### How to Verify
\`\`\`bash
# Check kernel settings
sysctl kernel.shmmax kernel.shmall

# Check PostgreSQL settings
sudo -u postgres psql -c "SHOW shared_buffers;"
\`\`\`

### Troubleshooting
If PostgreSQL fails to start after memory changes:
1. Check logs: \`tail -f /var/log/postgresql/postgresql-14-main.log\`
2. Verify kernel limits: \`ipcs -lm\`
3. Rollback if needed: \`sudo sysctl -p /etc/sysctl.conf.backup.YYYYMMDD\`

### Related Changes
- CHG-12345: Initial memory tuning (2024-12-02)
EOF`,
                    language: 'markdown'
                },
                {
                    title: 'Close Change Ticket',
                    code: `# Update ticket system (example using CLI)
ticket-cli update CHG-12345 \\
  --status "Closed" \\
  --resolution "Successfully Implemented" \\
  --comment "All changes implemented successfully. Performance improved significantly. No issues encountered."

# Or create closure notes
cat << 'EOF' > CHG-12345-closure.txt
Ticket: CHG-12345
Status: CLOSED
Resolution: Successfully Implemented
Implementation Date: $(date +%Y-%m-%d)

Summary:
Kernel shared memory limits increased from 32MB to 16GB.
PostgreSQL configuration updated to utilize new memory limits.
Performance metrics show 88% improvement in query response time.
Cache hit ratio improved from 85% to 99.5%.

Verification:
- All automated tests passed
- 24-hour monitoring completed
- No customer complaints
- System stability confirmed

Documentation Updated:
- Operations runbook
- Configuration management database
- Disaster recovery procedures
- Capacity planning spreadsheet
EOF`,
                    language: 'text'
                }
            ]
        }
    ];

    // Cloud workflow steps
    const cloudSteps = [
        {
            step: 1,
            title: 'IDENTIFY PROBLEM',
            description: 'Application reports slow queries',
            details: 'Performance degradation detected',
            icon: '🔍'
        },
        {
            step: 2,
            title: 'ANALYZE',
            description: 'Review CloudWatch metrics',
            details: 'FreeableMemory, CPUUtilization, ReadIOPS, WriteIOPS',
            icon: '📊'
        },
        {
            step: 3,
            title: 'DIAGNOSE',
            description: 'Identify root cause',
            details: 'db.m5.large (8GB) too small for workload',
            icon: '🎯'
        },
        {
            step: 4,
            title: 'PLAN',
            description: 'Evaluate scaling options',
            details: 'Vertical scale, parameter tuning, or read replicas',
            icon: '📋'
        },
        {
            step: 5,
            title: 'SAFETY BACKUP',
            description: 'Create snapshot',
            details: 'aws rds create-db-snapshot',
            icon: '💾'
        },
        {
            step: 6,
            title: 'IMPLEMENT',
            description: 'Modify instance',
            details: 'aws rds modify-db-instance --db-instance-class db.r5.xlarge',
            icon: '⚙️'
        },
        {
            step: 7,
            title: 'MONITOR',
            description: 'Watch deployment',
            details: 'Modifying → Rebooting (5-10 min) → Available',
            icon: '👀'
        },
        {
            step: 8,
            title: 'VALIDATE',
            description: 'Test and verify',
            details: 'Connect via psql, check settings, monitor 24 hours',
            icon: '✓'
        },
        {
            step: 9,
            title: 'DOCUMENT',
            description: 'Update IaC and documentation',
            details: 'Update Terraform/CloudFormation, wiki, cost tracking',
            icon: '📚'
        }
    ];

    /**
     * Initialize the application
     */
    function init() {
        console.log('🚀 Initializing DBA OS Tuning Learning Hub...');

        // Render all components
        renderResourceHierarchy();
        renderOnPremWorkflow();
        renderCloudWorkflow();
        renderComparisonTable();
        renderScenarios();

        // Set up event listeners
        setupEventListeners();

        // Track section visits
        trackSectionVisits();

        console.log('✅ Initialization complete!');
    }

    /**
     * Render resource hierarchy diagram
     */
    function renderResourceHierarchy() {
        const container = document.getElementById('resourceHierarchy');
        if (!container) return;

        const html = `
            <div class="hierarchy-tree">
                <div class="hierarchy-level">
                    <div class="hierarchy-node root">
                        <div class="node-icon">🖥️</div>
                        <div class="node-label">Operating System</div>
                        <div class="node-desc">Foundation Layer</div>
                    </div>
                </div>
                
                <div class="hierarchy-connector"></div>
                
                <div class="hierarchy-level">
                    <div class="hierarchy-node">
                        <div class="node-icon">⚡</div>
                        <div class="node-label">CPU</div>
                    </div>
                    <div class="hierarchy-node">
                        <div class="node-icon">💾</div>
                        <div class="node-label">Memory</div>
                    </div>
                    <div class="hierarchy-node">
                        <div class="node-icon">💿</div>
                        <div class="node-label">I/O</div>
                    </div>
                    <div class="hierarchy-node">
                        <div class="node-icon">🌐</div>
                        <div class="node-label">Network</div>
                    </div>
                </div>
                
                <div class="hierarchy-connector"></div>
                
                <div class="hierarchy-level">
                    <div class="hierarchy-node database">
                        <div class="node-icon">🗄️</div>
                        <div class="node-label">Database</div>
                        <div class="node-desc">Application Layer</div>
                    </div>
                </div>
            </div>
            
            <style>
                .hierarchy-tree {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    padding: 2rem;
                }
                
                .hierarchy-level {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .hierarchy-node {
                    background: var(--bg-tertiary);
                    border: 2px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    min-width: 150px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .hierarchy-node:hover {
                    border-color: var(--accent-purple);
                    transform: translateY(-5px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                }
                
                .hierarchy-node.root,
                .hierarchy-node.database {
                    border-color: var(--accent-purple);
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                }
                
                .node-icon {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .node-label {
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }
                
                .node-desc {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }
                
                .hierarchy-connector {
                    width: 2px;
                    height: 30px;
                    background: linear-gradient(to bottom, var(--accent-purple), transparent);
                }
            </style>
        `;

        container.innerHTML = html;
    }

    /**
     * Render on-premises workflow
     */
    function renderOnPremWorkflow() {
        const container = document.getElementById('onPremWorkflow');
        if (!container) return;

        let html = '<div class="workflow-steps">';

        onPremSteps.forEach((step, index) => {
            html += `
                <div class="workflow-step" data-step="${step.step}" style="animation-delay: ${index * 0.1}s">
                    <div class="step-number">${step.step}</div>
                    <div class="step-icon">${step.icon}</div>
                    <div class="step-content">
                        <div class="step-title">${step.title}</div>
                        <div class="step-description">${step.description}</div>
                        <div class="step-details">${step.details}</div>
                        
                        ${step.codeSnippets ? `
                            <button class="show-code-btn" onclick="OsTuning.toggleCodeSnippets(${step.step}, 'onprem')">
                                <span class="icon">💻</span> View Code Examples (${step.codeSnippets.length})
                            </button>
                            <div class="code-snippets-container" id="onprem-code-${step.step}" style="display: none;">
                                ${step.codeSnippets.map((snippet, idx) => `
                                    <div class="code-snippet-item" style="animation-delay: ${idx * 0.1}s">
                                        <div class="snippet-header">
                                            <span class="snippet-title">${snippet.title}</span>
                                            <button class="copy-btn-small" onclick="OsTuning.copyCodeSnippet(this)">
                                                <span class="icon">📋</span> Copy
                                            </button>
                                        </div>
                                        <div class="code-block-snippet">
                                            <pre><code class="language-${snippet.language}">${escapeHtml(snippet.code)}</code></pre>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    ${index < onPremSteps.length - 1 ? '<div class="step-arrow">↓</div>' : ''}
                </div>
            `;
        });

        html += '</div>';

        html += `
            <style>
                .workflow-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .workflow-step {
                    display: grid;
                    grid-template-columns: 60px 60px 1fr;
                    gap: 1.5rem;
                    align-items: start;
                    background: var(--bg-secondary);
                    border: 2px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    position: relative;
                    transition: all 0.3s ease;
                    opacity: 0;
                    animation: fadeIn 0.6s ease forwards;
                }
                
                .workflow-step:hover {
                    border-color: var(--accent-purple);
                    transform: translateX(10px);
                    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
                }
                
                .workflow-step.active {
                    border-color: var(--accent-green);
                    background: linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%);
                }
                
                .step-number {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    flex-shrink: 0;
                }
                
                .step-icon {
                    font-size: 2.5rem;
                    flex-shrink: 0;
                }
                
                .step-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .step-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--accent-purple);
                }
                
                .step-description {
                    color: var(--text-primary);
                    font-weight: 500;
                }
                
                .step-details {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                
                .show-code-btn {
                    background: var(--gradient-accent);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.25rem;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    margin-top: 0.5rem;
                    font-family: inherit;
                    font-size: 0.9rem;
                }
                
                .show-code-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
                }
                
                .code-snippets-container {
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .code-snippet-item {
                    background: var(--bg-primary);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    opacity: 0;
                    animation: fadeIn 0.4s ease forwards;
                }
                
                .snippet-header {
                    background: var(--bg-tertiary);
                    padding: 0.75rem 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--glass-border);
                }
                
                .snippet-title {
                    font-weight: 600;
                    color: var(--accent-blue);
                    font-size: 0.95rem;
                }
                
                .copy-btn-small {
                    background: var(--bg-secondary);
                    border: 1px solid var(--glass-border);
                    color: var(--text-secondary);
                    padding: 0.35rem 0.75rem;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-family: inherit;
                }
                
                .copy-btn-small:hover {
                    background: var(--accent-green);
                    color: white;
                    border-color: var(--accent-green);
                }
                
                .code-block-snippet {
                    padding: 0;
                }
                
                .code-block-snippet pre {
                    margin: 0;
                    padding: 1rem;
                    overflow-x: auto;
                    max-height: 400px;
                }
                
                .code-block-snippet code {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.85rem;
                    line-height: 1.6;
                    color: var(--accent-green);
                }
                
                .step-arrow {
                    position: absolute;
                    bottom: -2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 2rem;
                    color: var(--accent-purple);
                    animation: bounce 2s ease-in-out infinite;
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(10px); }
                }
            </style>
        `;

        container.innerHTML = html;
    }

    /**
     * Render cloud workflow
     */
    function renderCloudWorkflow() {
        const container = document.getElementById('cloudWorkflow');
        if (!container) return;

        let html = '<div class="workflow-steps">';

        cloudSteps.forEach((step, index) => {
            html += `
                <div class="workflow-step cloud-step" data-step="${step.step}" style="animation-delay: ${index * 0.1}s">
                    <div class="step-number">${step.step}</div>
                    <div class="step-icon">${step.icon}</div>
                    <div class="step-content">
                        <div class="step-title">${step.title}</div>
                        <div class="step-description">${step.description}</div>
                        <div class="step-details">${step.details}</div>
                    </div>
                    ${index < cloudSteps.length - 1 ? '<div class="step-arrow">↓</div>' : ''}
                </div>
            `;
        });

        html += '</div>';

        container.innerHTML = html;
    }

    /**
     * Animate on-premises workflow
     */
    function animateOnPremFlow() {
        const steps = document.querySelectorAll('#onPremWorkflow .workflow-step');

        steps.forEach(step => step.classList.remove('active'));

        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('active');
                step.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Play sound effect (optional)
                playStepSound();
            }, index * state.animationSpeed);
        });
    }

    /**
     * Animate cloud workflow
     */
    function animateCloudFlow() {
        const steps = document.querySelectorAll('#cloudWorkflow .workflow-step');

        steps.forEach(step => step.classList.remove('active'));

        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('active');
                step.scrollIntoView({ behavior: 'smooth', block: 'center' });

                playStepSound();
            }, index * state.animationSpeed);
        });
    }

    /**
     * Play step sound (subtle feedback)
     */
    function playStepSound() {
        // Create a subtle beep using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    /**
     * Render comparison table
     */
    function renderComparisonTable() {
        const tbody = document.getElementById('comparisonTableBody');
        if (!tbody) return;

        let html = '';

        comparisonData.forEach((row, index) => {
            html += `
                <tr style="animation-delay: ${index * 0.05}s" class="fade-in">
                    <td><strong>${row.aspect}</strong></td>
                    <td class="on-prem-col">${row.onPrem}</td>
                    <td class="cloud-col">${row.cloud}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    /**
     * Render scenario content
     */
    function renderScenarios() {
        const scenarios = {
            'on-prem-memory': {
                title: 'On-Premises: PostgreSQL Memory Tuning',
                problem: 'PostgreSQL database experiencing slow query performance due to insufficient shared memory',
                steps: [
                    {
                        title: 'Step 1: Identify the Issue',
                        code: `# SSH into the database server
ssh dbadmin@prod-db-01

# Check current system resources
top

# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql-14-main.log

# Check current kernel parameters
sysctl -a | grep shm`,
                        output: `kernel.shmmax = 33554432    # Only 32MB - TOO LOW
kernel.shmall = 2097152
kernel.shmmni = 4096`
                    },
                    {
                        title: 'Step 2: Calculate Required Values',
                        code: `# PostgreSQL needs shared_buffers
# Rule of thumb: 25% of system RAM for shared_buffers
# If server has 64GB RAM, need ~16GB shared memory

# Calculate shmmax (in bytes)
# 16GB = 16 * 1024 * 1024 * 1024 = 17179869184 bytes

# Calculate shmall (in pages, page size typically 4096 bytes)
# 17179869184 / 4096 = 4194304 pages`,
                        output: `Required shmmax: 17179869184 (16GB)
Required shmall: 4194304 (pages)`
                    },
                    {
                        title: 'Step 3: System Admin Implements',
                        code: `# System admin logs in
ssh root@prod-db-01

# Backup current settings
sysctl -a > /root/sysctl_backup_$(date +%F).txt

# Set new values (temporary)
sysctl -w kernel.shmmax=17179869184
sysctl -w kernel.shmall=4194304

# Make permanent in /etc/sysctl.conf
echo "kernel.shmmax = 17179869184" >> /etc/sysctl.conf
echo "kernel.shmall = 4194304" >> /etc/sysctl.conf

# Apply permanently
sysctl -p`,
                        output: `kernel.shmmax = 17179869184
kernel.shmall = 4194304`
                    },
                    {
                        title: 'Step 4: Configure PostgreSQL',
                        code: `# Edit PostgreSQL config
sudo vi /etc/postgresql/14/main/postgresql.conf

# Modify settings:
shared_buffers = 16GB              # Was 128MB
effective_cache_size = 48GB        # 75% of total RAM
work_mem = 64MB
maintenance_work_mem = 2GB

# Restart PostgreSQL
sudo systemctl restart postgresql

# Verify settings
sudo -u postgres psql -c "SHOW shared_buffers;"`,
                        output: `shared_buffers
----------------
16GB
(1 row)`
                    },
                    {
                        title: 'Step 5: Validate',
                        code: `# Check cache hit ratio
sudo -u postgres psql << EOF
SELECT 
    datname,
    blks_read,
    blks_hit,
    round(blks_hit::numeric / (blks_hit + blks_read) * 100, 2) AS cache_hit_ratio
FROM pg_stat_database
WHERE datname = 'production';
EOF`,
                        output: `   datname    | blks_read | blks_hit | cache_hit_ratio 
--------------+-----------+----------+-----------------
 production   |    45000  | 9850000  |           99.55
 
✅ Excellent! Cache hit ratio improved from 85% to 99.55%`
                    }
                ]
            },
            'cloud-scaling': {
                title: 'Cloud (AWS RDS): Instance Scaling',
                problem: 'RDS PostgreSQL instance running out of memory on db.m5.large (8GB RAM)',
                steps: [
                    {
                        title: 'Step 1: Identify the Issue',
                        code: `# Check CloudWatch metrics
aws cloudwatch get-metric-statistics \\
  --namespace AWS/RDS \\
  --metric-name FreeableMemory \\
  --dimensions Name=DBInstanceIdentifier,Value=prod-postgres-01 \\
  --start-time 2024-12-01T00:00:00Z \\
  --end-time 2024-12-02T00:00:00Z \\
  --period 3600 \\
  --statistics Average`,
                        output: `Average FreeableMemory: 512MB (only 6% of total)
⚠️ Memory pressure detected!`
                    },
                    {
                        title: 'Step 2: Review Current Configuration',
                        code: `# Check current instance class
aws rds describe-db-instances \\
  --db-instance-identifier prod-postgres-01 \\
  --query 'DBInstances[0].[DBInstanceClass,AllocatedStorage]'`,
                        output: `[
  "db.m5.large",
  100
]

Current: db.m5.large (8GB RAM) - too small`
                    },
                    {
                        title: 'Step 3: Create Safety Snapshot',
                        code: `# Create snapshot before change
aws rds create-db-snapshot \\
  --db-snapshot-identifier prod-postgres-01-pre-scale-20241202 \\
  --db-instance-identifier prod-postgres-01

# Wait for completion
aws rds wait db-snapshot-completed \\
  --db-snapshot-identifier prod-postgres-01-pre-scale-20241202`,
                        output: `Snapshot created successfully ✅
Status: available`
                    },
                    {
                        title: 'Step 4: Scale Instance',
                        code: `# Modify instance to larger class
aws rds modify-db-instance \\
  --db-instance-identifier prod-postgres-01 \\
  --db-instance-class db.r5.xlarge \\
  --apply-immediately

# db.r5.xlarge = 32GB RAM (memory-optimized)
# shared_buffers will auto-adjust to ~8GB`,
                        output: `{
  "DBInstance": {
    "DBInstanceIdentifier": "prod-postgres-01",
    "DBInstanceClass": "db.r5.xlarge",
    "DBInstanceStatus": "modifying"
  }
}

Estimated downtime: 5-10 minutes`
                    },
                    {
                        title: 'Step 5: Monitor Deployment',
                        code: `# Watch status
watch -n 10 'aws rds describe-db-instances \\
  --db-instance-identifier prod-postgres-01 \\
  --query "DBInstances[0].DBInstanceStatus"'`,
                        output: `Status progression:
modifying → backing-up → rebooting → available

Total time: 8 minutes ✅`
                    },
                    {
                        title: 'Step 6: Validate',
                        code: `# Connect to RDS instance
psql -h prod-postgres-01.xxxxx.us-east-1.rds.amazonaws.com \\
     -U masteruser -d production

# Check settings
SHOW shared_buffers;
SHOW effective_cache_size;

# Verify cache hit ratio
SELECT 
    round(blks_hit::numeric / (blks_hit + blks_read) * 100, 2) AS cache_hit_ratio
FROM pg_stat_database
WHERE datname = 'production';`,
                        output: `shared_buffers: 8GB
effective_cache_size: 24GB
cache_hit_ratio: 99.2%

✅ Performance improved! Memory pressure resolved.`
                    }
                ]
            }
        };

        // Render initial scenario
        renderScenarioContent(scenarios[state.currentScenario]);

        // Set up scenario tab listeners
        document.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const scenarioId = e.target.dataset.scenario;
                state.currentScenario = scenarioId;

                // Update active tab
                document.querySelectorAll('.scenario-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                // Render new scenario
                renderScenarioContent(scenarios[scenarioId]);
            });
        });
    }

    /**
     * Render scenario content
     */
    function renderScenarioContent(scenario) {
        const container = document.getElementById('scenarioDisplay');
        if (!container) return;

        let html = `
            <div class="scenario-header">
                <h3>${scenario.title}</h3>
                <div class="problem-statement">
                    <strong>Problem:</strong> ${scenario.problem}
                </div>
            </div>
            <div class="scenario-steps">
        `;

        scenario.steps.forEach((step, index) => {
            html += `
                <div class="scenario-step" style="animation-delay: ${index * 0.1}s">
                    <h4>${step.title}</h4>
                    <div class="code-block">
                        <div class="code-header">
                            <span class="code-lang">bash</span>
                            <button class="copy-btn" onclick="OsTuning.copyCode(this)">
                                <span class="icon">📋</span> Copy
                            </button>
                        </div>
                        <pre><code>${escapeHtml(step.code)}</code></pre>
                    </div>
                    ${step.output ? `
                        <div class="output-block">
                            <div class="output-header">Output:</div>
                            <pre><code>${escapeHtml(step.output)}</code></pre>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `
            </div>
            <style>
                .scenario-header {
                    margin-bottom: 2rem;
                }
                
                .scenario-header h3 {
                    font-size: 1.75rem;
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }
                
                .problem-statement {
                    background: rgba(255, 107, 107, 0.1);
                    border-left: 4px solid var(--accent-orange);
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    color: var(--text-secondary);
                }
                
                .scenario-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                
                .scenario-step {
                    opacity: 0;
                    animation: fadeIn 0.6s ease forwards;
                }
                
                .scenario-step h4 {
                    font-size: 1.25rem;
                    margin-bottom: 1rem;
                    color: var(--accent-purple);
                }
                
                .code-block {
                    background: var(--bg-primary);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                
                .code-header {
                    background: var(--bg-secondary);
                    padding: 0.75rem 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--glass-border);
                }
                
                .code-lang {
                    color: var(--accent-green);
                    font-weight: 600;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                }
                
                .copy-btn {
                    background: var(--bg-tertiary);
                    border: 1px solid var(--glass-border);
                    color: var(--text-secondary);
                    padding: 0.25rem 0.75rem;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-family: inherit;
                }
                
                .copy-btn:hover {
                    background: var(--accent-purple);
                    color: white;
                    border-color: var(--accent-purple);
                }
                
                .code-block pre {
                    margin: 0;
                    padding: 1rem;
                    overflow-x: auto;
                }
                
                .code-block code {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: var(--accent-green);
                }
                
                .output-block {
                    background: var(--bg-secondary);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                }
                
                .output-header {
                    background: var(--bg-tertiary);
                    padding: 0.75rem 1rem;
                    font-weight: 600;
                    color: var(--accent-blue);
                    border-bottom: 1px solid var(--glass-border);
                }
                
                .output-block pre {
                    margin: 0;
                    padding: 1rem;
                    overflow-x: auto;
                }
                
                .output-block code {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: var(--text-secondary);
                }
            </style>
        `;

        container.innerHTML = html;
    }

    /**
     * Copy code to clipboard
     */
    function copyCode(button) {
        const codeBlock = button.closest('.code-block').querySelector('code');
        const text = codeBlock.textContent;

        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="icon">✅</span> Copied!';
            button.style.background = 'var(--accent-green)';
            button.style.color = 'white';

            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.style.color = '';
            }, 2000);
        });
    }

    /**
     * Escape HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Theme toggle (future enhancement)
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                // Toggle theme logic here
                console.log('Theme toggle clicked');
            });
        }
    }

    /**
     * Track section visits
     */
    function trackSectionVisits() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    state.sectionsVisited.add(sectionId);
                    updateProgress();
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.content-section').forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Update progress
     */
    function updateProgress() {
        const totalSections = 6; // overview, on-premises, cloud, comparison, scenarios, tips
        const completed = state.sectionsVisited.size;
        const percentage = Math.round((completed / totalSections) * 100);

        const badge = document.querySelector('.progress-badge');
        if (badge) {
            badge.textContent = `${percentage}%`;
        }
    }

    /**
     * Update progress modal
     */
    function updateProgressModal() {
        const sectionsCompleted = document.getElementById('sectionsCompleted');
        const timeSpent = document.getElementById('timeSpent');
        const checklist = document.getElementById('sectionChecklist');

        if (sectionsCompleted) {
            sectionsCompleted.textContent = `${state.sectionsVisited.size}/6`;
        }

        if (timeSpent) {
            const minutes = Math.floor((Date.now() - state.startTime) / 60000);
            timeSpent.textContent = `${minutes}m`;
        }

        if (checklist) {
            const sections = [
                { id: 'overview', name: 'Overview', icon: '🎯' },
                { id: 'on-premises', name: 'On-Premises', icon: '🏢' },
                { id: 'cloud', name: 'Cloud (AWS RDS)', icon: '☁️' },
                { id: 'comparison', name: 'Comparison', icon: '⚖️' },
                { id: 'scenarios', name: 'Real Scenarios', icon: '💼' },
                { id: 'tips', name: 'Tips & Tricks', icon: '💡' }
            ];

            let html = '';
            sections.forEach(section => {
                const completed = state.sectionsVisited.has(section.id);
                html += `
                    <div class="checklist-item ${completed ? 'completed' : ''}">
                        <span class="checklist-icon">${completed ? '✅' : '⬜'}</span>
                        <span>${section.icon} ${section.name}</span>
                    </div>
                `;
            });

            checklist.innerHTML = html;
        }
    }

    /**
     * Toggle code snippets visibility
     */
    function toggleCodeSnippets(stepNumber, type) {
        const container = document.getElementById(`${type}-code-${stepNumber}`);
        if (!container) return;

        if (container.style.display === 'none') {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }

    /**
     * Copy code snippet to clipboard
     */
    function copyCodeSnippet(button) {
        const codeBlock = button.closest('.code-snippet-item').querySelector('code');
        const text = codeBlock.textContent;

        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="icon">✅</span> Copied!';
            button.style.background = 'var(--accent-green)';
            button.style.color = 'white';

            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.style.color = '';
            }, 2000);
        });
    }

    // Public API
    return {
        init,
        animateOnPremFlow,
        animateCloudFlow,
        copyCode,
        toggleCodeSnippets,
        copyCodeSnippet,
        updateProgressModal
    };
})();

// Make OsTuning globally available
window.OsTuning = OsTuning;
