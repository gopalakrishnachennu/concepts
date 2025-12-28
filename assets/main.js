// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const CONFIG = {
    githubUsername: 'gopalakrishnachennu',  // Change this to your GitHub username
    repoName: 'concepts',              // Change this to your repo name
    branch: 'main',                          // or 'master' depending on your default branch
    excludeFolders: ['assets', '.github', 'node_modules', '.git'], // Folders to ignore
    // excludeFiles: ['index.html', 'viewer.html', 'README.md', 'LICENSE']  // Files to ignore
    excludeFiles: ['viewer.html', 'README.md', 'LICENSE', '.DS_Store']
};

// ============================================
// GLOBAL STATE
// ============================================
let currentView = 'grid';
let currentCategory = 'all';
let currentItems = [];
let allFolders = [];
let allFiles = [];
let startTime = Date.now();
let analytics = {
    clicks: {},
    visits: 0
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Format time ago
function getTimeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Get file icon based on extension
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        'html': '🌐',
        'css': '🎨',
        'js': '⚡',
        'json': '📋',
        'md': '📝',
        'txt': '📄',
        'pdf': '📕',
        'png': '🖼️',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'gif': '🖼️',
        'svg': '🎨',
        'xml': '📋',
        'yml': '⚙️',
        'yaml': '⚙️'
    };
    return iconMap[ext] || '📄';
}

// Get folder emoji (can be customized)
function getFolderEmoji(folderName) {
    const emojiMap = {
        'ansible': '🔧',
        'docker': '🐳',
        'git-ci': '🔄',
        'kubernetes': '☸️',
        'postgres': '🐘',
        'design': '🎨',
        'projects': '💻',
        'blog': '📝',
        'docs': '📚',
        'api': '🔌',
        'database': '💾',
        'frontend': '🎭',
        'backend': '⚙️',
        'mobile': '📱',
        'devops': '🚀'
    };
    const lowerName = folderName.toLowerCase();
    return emojiMap[lowerName] || '📁';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// GITHUB API FUNCTIONS
// ============================================

// ✅ Improved: Fetch repository contents safely (fixes 403 + subfolder access)
async function fetchGitHubContents(path = '') {
    const url = `https://api.github.com/repos/${CONFIG.githubUsername}/${CONFIG.repoName}/contents/${path}?ref=${CONFIG.branch}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        // Handle 403 or rate limits
        if (response.status === 403) {
            console.error('❌ GitHub API 403 — Rate limit or forbidden.');
            showNotification('⚠️ GitHub API limit reached. Try again later.', 'error');
            return [];
        }

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Handle case where folder is empty or protected
        if (!Array.isArray(data)) {
            console.warn('⚠️ GitHub API returned unexpected data:', data);
            return [];
        }

        return data;
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        showNotification('❌ Error loading from GitHub: ' + error.message, 'error');
        return [];
    }
}


// Get all folders from repository
// async function getAllFolders() {
//     showLoading(true);
//     document.getElementById('repoStatus')?.textContent = '🔄 Loading folders...';
    
//     try {
//         const contents = await fetchGitHubContents();
//         const folders = contents.filter(item => 
//             item.type === 'dir' && 
//             !CONFIG.excludeFolders.includes(item.name)
//         );
        
//         // Add metadata to folders
//         const foldersWithMeta = await Promise.all(folders.map(async folder => {
//             const files = await fetchGitHubContents(folder.name);
//             const htmlFiles = files.filter(f => f.name.endsWith('.html'));
            
//             return {
//                 name: folder.name,
//                 path: folder.path,
//                 emoji: getFolderEmoji(folder.name),
//                 fileCount: files.length,
//                 htmlCount: htmlFiles.length,
//                 url: `viewer.html?folder=${encodeURIComponent(folder.name)}`,
//                 category: getCategoryFromName(folder.name),
//                 clicks: analytics.clicks[folder.name] || 0,
//                 lastViewed: localStorage.getItem(`folder_${folder.name}_viewed`) || new Date().toISOString()
//             };
//         }));
        
//         allFolders = foldersWithMeta;
//         document.getElementById('repoStatus')?.textContent = '✅ Loaded from GitHub';
//         showLoading(false);
//         return foldersWithMeta;
//     } catch (error) {
//         console.error('Error getting folders:', error);
//         showLoading(false);
//         return [];
//     }
// }

async function getAllFolders() {
    // Show loading spinner
    showLoading(true);
    const statusEl = document.getElementById('repoStatus');
    if (statusEl) statusEl.textContent = '🔄 Loading folders...';

    try {
        console.log('📡 Fetching root contents from GitHub...');
        const contents = await fetchGitHubContents();

        // Filter only directories and exclude unwanted folders
        const folders = contents.filter(item =>
            item.type === 'dir' &&
            !CONFIG.excludeFolders.includes(item.name)
        );

        console.log(`📁 Found ${folders.length} folders:`, folders.map(f => f.name));

        // Fetch metadata for each folder
        const foldersWithMeta = await Promise.all(folders.map(async (folder) => {
            const encodedName = encodeURIComponent(folder.name);
            let files = [];

            try {
                console.log(`➡️ Fetching files for folder: ${folder.name}`);
                files = await fetchGitHubContents(encodedName);
            } catch (err) {
                console.error(`❌ Failed to fetch contents of folder: ${folder.name}`, err);
                files = [];
            }

            // Count HTML files for quick stats
            const htmlFiles = files.filter(f => f.name && f.name.endsWith('.html'));

            return {
                name: folder.name,
                path: folder.path,
                emoji: getFolderEmoji(folder.name),
                fileCount: files.length,
                htmlCount: htmlFiles.length,
                url: `viewer.html?folder=${encodeURIComponent(folder.name)}`,
                category: getCategoryFromName(folder.name),
                clicks: analytics.clicks[folder.name] || 0,
                lastViewed: localStorage.getItem(`folder_${folder.name}_viewed`) || new Date().toISOString()
            };
        }));

        // Store and render
        allFolders = foldersWithMeta;
        console.log('✅ Loaded all folder metadata:', allFolders);

        if (statusEl) statusEl.textContent = '✅ Loaded from GitHub';
        showLoading(false);

        return foldersWithMeta;

    } catch (error) {
        console.error('💥 Error getting folders:', error);
        showLoading(false);
        if (statusEl) statusEl.textContent = '❌ Error loading folders';
        showNotification('❌ Failed to load folders from GitHub', 'error');
        return [];
    }
}


// Get files in a specific folder
async function getFilesInFolder(folderName) {
    showLoading(true);
    
    try {
        const contents = await fetchGitHubContents(folderName);
        const files = contents.filter(item => 
            item.type === 'file' && 
            !CONFIG.excludeFiles.includes(item.name) &&
            !item.name.endsWith('.js') &&
            !item.name.endsWith('.css') &&
            !item.name.endsWith('.map')
        );
        
        const filesWithMeta = files.map(file => ({
            name: file.name,
            path: file.path,
            size: file.size,
            icon: getFileIcon(file.name),
            url: file.name.endsWith('.html') ? 
                `https://${CONFIG.githubUsername}.github.io/${CONFIG.repoName}/${file.path}` : 
                file.html_url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/'),
            downloadUrl: file.download_url,
            isHtml: file.name.endsWith('.html'),
            clicks: analytics.clicks[file.path] || 0,
            lastViewed: localStorage.getItem(`file_${file.path}_viewed`) || new Date().toISOString()
        }));
        
        allFiles = filesWithMeta;
        showLoading(false);
        return filesWithMeta;
    } catch (error) {
        console.error('Error getting files:', error);
        showLoading(false);
        return [];
    }
}

// Get category from folder name
function getCategoryFromName(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('design') || lowerName.includes('ui') || lowerName.includes('ux')) return 'design';
    if (lowerName.includes('code') || lowerName.includes('project') || lowerName.includes('app')) return 'code';
    if (lowerName.includes('blog') || lowerName.includes('article') || lowerName.includes('content')) return 'content';
    if (lowerName.includes('ansible') || lowerName.includes('docker') || lowerName.includes('kubernetes')) return 'devops';
    if (lowerName.includes('postgres') || lowerName.includes('database') || lowerName.includes('sql')) return 'database';
    return 'other';
}

// ============================================
// UI FUNCTIONS
// ============================================

// Show/hide loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

// Render folders (for main dashboard)
function renderFolders(folders) {
    const container = document.getElementById('foldersContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (folders.length === 0) {
        noResults.style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    container.style.display = currentView === 'list' ? 'flex' : 'grid';
    
    const viewClass = currentView === 'list' ? 'links-list' : 
                     currentView === 'masonry' ? 'links-masonry' : 'links-grid';
    container.className = viewClass;
    
    folders.forEach((folder, index) => {
        const card = createFolderCard(folder, index);
        container.appendChild(card);
    });
    
    updateStats();
}

// Create folder card
function createFolderCard(folder, index) {
    const isListView = currentView === 'list';
    const card = document.createElement('a');
    card.href = folder.url;
    card.className = isListView ? 'list-item' : 'link-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.onclick = (e) => {
        trackClick('folder', folder.name);
        localStorage.setItem(`folder_${folder.name}_viewed`, new Date().toISOString());
    };
    
    if (isListView) {
        card.innerHTML = `
            <span class="link-icon">${folder.emoji}</span>
            <div class="list-content">
                <h3 class="link-title">${folder.name}</h3>
                <p class="link-description">${folder.fileCount} files • ${folder.htmlCount} HTML pages</p>
            </div>
            <span class="card-arrow">→</span>
        `;
    } else {
        card.innerHTML = `
            <div class="card-header">
                <span class="link-icon">${folder.emoji}</span>
                ${folder.htmlCount > 0 ? '<span class="card-badge">Active</span>' : ''}
            </div>
            <h3 class="link-title">${folder.name}</h3>
            <p class="link-description">${folder.fileCount} total files • ${folder.htmlCount} HTML pages</p>
            <div class="card-stats">
                <span>👁️ ${folder.clicks} views</span>
                <span>🕐 ${getTimeAgo(folder.lastViewed)}</span>
            </div>
            <div class="card-footer">
                <div class="card-tags">
                    <span class="tag">${folder.category}</span>
                </div>
                <span class="card-arrow">→</span>
            </div>
        `;
    }
    
    return card;
}

// Render files (for viewer page)
function renderFiles(files) {
    const container = document.getElementById('filesContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (files.length === 0) {
        noResults.style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    container.style.display = currentView === 'list' ? 'flex' : 'grid';
    
    const viewClass = currentView === 'list' ? 'links-list' : 
                     currentView === 'masonry' ? 'links-masonry' : 'links-grid';
    container.className = viewClass;
    
    files.forEach((file, index) => {
        const card = createFileCard(file, index);
        container.appendChild(card);
    });
    
    updateFileStats();
}

// Create file card
function createFileCard(file, index) {
    const isListView = currentView === 'list';
    const card = document.createElement('a');
    card.href = file.isHtml ? file.path : file.downloadUrl;
    card.className = isListView ? 'list-item' : 'link-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    if (!file.isHtml) {
        card.target = '_blank';
    }
    
    card.onclick = (e) => {
        trackClick('file', file.path);
        localStorage.setItem(`file_${file.path}_viewed`, new Date().toISOString());
    };
    
    if (isListView) {
        card.innerHTML = `
            <span class="link-icon">${file.icon}</span>
            <div class="list-content">
                <h3 class="link-title">${file.name}</h3>
                <p class="link-description">${formatFileSize(file.size)}</p>
            </div>
            <span class="card-arrow">→</span>
        `;
    } else {
        card.innerHTML = `
            <div class="card-header">
                <span class="link-icon">${file.icon}</span>
                ${file.isHtml ? '<span class="card-badge">HTML</span>' : ''}
            </div>
            <h3 class="link-title">${file.name}</h3>
            <p class="link-description">Size: ${formatFileSize(file.size)}</p>
            <div class="card-stats">
                <span>👁️ ${file.clicks} views</span>
                <span>🕐 ${getTimeAgo(file.lastViewed)}</span>
            </div>
            <div class="card-footer">
                <div class="card-tags">
                    <span class="tag">${file.isHtml ? 'Web Page' : 'Document'}</span>
                </div>
                <span class="card-arrow">→</span>
            </div>
        `;
    }
    
    return card;
}

// Update statistics
function updateStats() {
    const totalFolders = document.getElementById('totalFolders');
    const totalFiles = document.getElementById('totalFiles');
    
    if (totalFolders) totalFolders.textContent = allFolders.length;
    if (totalFiles) {
        const total = allFolders.reduce((sum, f) => sum + f.fileCount, 0);
        totalFiles.textContent = total;
    }
    
    updateAnalytics();
}

function updateFileStats() {
    const totalFilesEl = document.getElementById('totalFiles');
    const htmlFilesEl = document.getElementById('htmlFiles');
    
    if (totalFilesEl) totalFilesEl.textContent = allFiles.length;
    if (htmlFilesEl) {
        const htmlCount = allFiles.filter(f => f.isHtml).length;
        htmlFilesEl.textContent = htmlCount;
    }
}

// ============================================
// TIME & ANALYTICS FUNCTIONS
// ============================================

// Update real-time clock
function updateClock() {
    const clockEl = document.getElementById('currentTime');
    if (!clockEl) return;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    clockEl.textContent = `${dateStr} • ${timeStr}`;
}

// Update weather widget (simulated)
// function updateWeather() {
//     const weatherEl = document.getElementById('weatherInfo');
//     if (!weatherEl) return;
    
//     const weather = [
//         { icon: '☀️', temp: '75°F', desc: 'Sunny' },
//         { icon: '⛅', temp: '68°F', desc: 'Partly Cloudy' },
//         { icon: '🌤️', temp: '72°F', desc: 'Mostly Sunny' },
//         { icon: '🌧️', temp: '64°F', desc: 'Rainy' }
//     ];
//     const current = weather[Math.floor(Math.random() * weather.length)];
    
//     const parent = document.getElementById('weatherWidget');
//     if (parent) {
//         parent.innerHTML = `
//             <span>${current.icon}</span>
//             <span>${current.temp} ${current.desc}</span>
//         `;
//     }
// }

// async function updateWeather() {
//     const weatherEl = document.getElementById('weatherInfo');
    
//     if (!weatherEl) {
//         console.log('Weather element not found');
//         return;
//     }
    
//     try {
//         weatherEl.textContent = 'Loading...';
        
//         const response = await fetch('https://wttr.in/Houston?format=j1');
//         const data = await response.json();
        
//         const temp = data.current_condition[0].temp_F;
//         const desc = data.current_condition[0].weatherDesc[0].value;
        
//         weatherEl.textContent = `${temp}°F - ${desc}`;
//     } catch (error) {
//         console.error('Weather error:', error);
//         weatherEl.textContent = 'Houston, TX';
//     }
// }
function downloadResume() {
    // Replace with your actual resume file path (PDF in assets folder or external link)
    const resumeUrl = 'assets/GopalaKrishnaChennu_Resume.pdf';
    const a = document.createElement('a');
    a.href = resumeUrl;
    a.download = 'GopalaKrishnaChennu_Resume.pdf';
    a.click();
    showNotification('📄 Resume downloaded!');
}

// --- Load About Me data dynamically ---
async function loadAboutSection() {
    try {
      const res = await fetch('assets/about.json');
      const data = await res.json();
  
      // Set text content
      document.getElementById('aboutName').textContent = `👋 ${data.name}`;
      document.getElementById('aboutTitle').textContent = data.title;
      document.getElementById('aboutBio').textContent = data.bio;
  
      // Set photo
      const photoEl = document.getElementById('profilePhoto');
      const formats = ['jpg', 'jpeg', 'png'];
      const basePath = data.photo.replace(/\.(jpg|jpeg|png)$/i, '');
  
      let found = false;
      for (const ext of formats) {
        try {
          const res = await fetch(`${basePath}.${ext}`, { method: 'HEAD' });
          if (res.ok) {
            photoEl.src = `${basePath}.${ext}`;
            found = true;
            break;
          }
        } catch {}
      }
      if (!found) photoEl.src = 'assets/default-profile.png';
  
      // Build links
      const linksContainer = document.getElementById('aboutLinks');
      linksContainer.innerHTML = ''; // clear any static links
      data.links.forEach(link => {
        const div = document.createElement('div');
        div.className = 'link-badge';
        div.innerHTML = `<a href="${link.url}" target="_blank">${link.icon} ${link.label}</a>`;
        linksContainer.appendChild(div);
      });
  
    } catch (err) {
      console.error('Error loading about.json:', err);
    }
  }
  
  // Run when DOM is ready
  document.addEventListener('DOMContentLoaded', loadAboutSection);
  

async function updateWeather() {
    const weatherEl = document.getElementById('weatherInfo');
    const locationEl = document.getElementById('weatherLocation');
    if (!weatherEl) return;

    weatherEl.textContent = 'Detecting location...';
    if (locationEl) locationEl.textContent = '';

    // --- Helper: Fetch weather ---
    async function getWeather(lat, lon, cityName) {
        try {
            const res = await fetch(`https://wttr.in/${lat},${lon}?format=j1`);
            const data = await res.json();

            const temp = data.current_condition[0].temp_F;
            const desc = data.current_condition[0].weatherDesc[0].value;

            weatherEl.textContent = `${temp}°F - ${desc}`;
            if (locationEl) locationEl.textContent = `📍 ${cityName}`;
        } catch (error) {
            console.error('Weather fetch error:', error);
            weatherEl.textContent = 'Weather unavailable';
            if (locationEl) locationEl.textContent = cityName || 'Location unavailable';
        }
    }

    // --- Try stored location first ---
    const stored = localStorage.getItem('weatherLocation');
    const storedCoords = localStorage.getItem('weatherCoords');

    if (stored && storedCoords) {
        const { lat, lon } = JSON.parse(storedCoords);
        console.log('✅ Using stored location:', stored);
        await getWeather(lat, lon, stored);
        return;
    }

    // --- Try exact location once ---
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                console.log('📍 Got GPS location:', latitude, longitude);

                // Reverse geocode → city name only
                const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                );
                const geoData = await geoRes.json();
                const cityName =
                    geoData.address.city ||
                    geoData.address.town ||
                    geoData.address.village ||
                    geoData.address.state ||
                    'Your City';

                // Save for future sessions
                localStorage.setItem('weatherLocation', cityName);
                localStorage.setItem('weatherCoords', JSON.stringify({ lat: latitude, lon: longitude }));

                await getWeather(latitude, longitude, cityName);
            },
            async (err) => {
                console.warn('⚠️ GPS denied:', err.message);
                await fallbackWeather(); // fallback to IP
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        await fallbackWeather(); // no GPS support
    }

    // --- Fallback via IP ---
    async function fallbackWeather() {
        try {
            const locRes = await fetch('https://ipapi.co/json/');
            const loc = await locRes.json();
            const city = loc.city || loc.region || 'Unknown City';

            // Save fallback too, so we don’t re-ask
            localStorage.setItem('weatherLocation', city);
            localStorage.setItem('weatherCoords', JSON.stringify({ lat: loc.latitude, lon: loc.longitude }));

            await getWeather(loc.latitude, loc.longitude, city);
        } catch (error) {
            console.error('Fallback error:', error);
            weatherEl.textContent = 'Weather unavailable';
            if (locationEl) locationEl.textContent = '🌍 Location unavailable';
        }
    }
}

  

// Update analytics
function updateAnalytics() {
    const totalClicks = Object.values(analytics.clicks).reduce((sum, val) => sum + val, 0);
    const totalClicksEl = document.getElementById('totalClicks');
    if (totalClicksEl) totalClicksEl.textContent = totalClicks;
    
    const avgTime = Math.floor((Date.now() - startTime) / 1000);
    const avgTimeEl = document.getElementById('avgTimeSpent');
    if (avgTimeEl) avgTimeEl.textContent = avgTime + 's';
    
    const topCategoryEl = document.getElementById('topCategory');
    if (topCategoryEl && allFolders.length > 0) {
        const categoryCount = {};
        allFolders.forEach(folder => {
            categoryCount[folder.category] = (categoryCount[folder.category] || 0) + 1;
        });
        const topCat = Object.keys(categoryCount).reduce((a, b) => 
            categoryCount[a] > categoryCount[b] ? a : b
        );
        topCategoryEl.textContent = topCat.charAt(0).toUpperCase() + topCat.slice(1);
    }
    
    const engagement = Math.min(95 + Math.floor(Math.random() * 5), 100);
    const engagementEl = document.getElementById('engagement');
    if (engagementEl) engagementEl.textContent = engagement + '%';
}

// Update visit counter
function updateVisitCounter() {
    let visits = parseInt(localStorage.getItem('visitCount') || '0');
    visits++;
    localStorage.setItem('visitCount', visits);
    analytics.visits = visits;
    
    const visitEl = document.getElementById('visitCount');
    if (visitEl) visitEl.textContent = visits;
}

// Track clicks
function trackClick(type, id) {
    const key = `${type}_${id}`;
    analytics.clicks[key] = (analytics.clicks[key] || 0) + 1;
    localStorage.setItem('analytics', JSON.stringify(analytics));
    updateAnalytics();
}

// Load analytics from localStorage
function loadAnalytics() {
    const stored = localStorage.getItem('analytics');
    if (stored) {
        analytics = JSON.parse(stored);
    }
}

// Update last updated time
function updateLastUpdated() {
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = getTimeAgo(startTime);
    }
}

// ============================================
// FILTER & SORT FUNCTIONS
// ============================================

// Filter items
function filterItems() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const fileTypeFilter = document.getElementById('fileTypeFilter')?.value || 'all';
    
    let filtered;
    
    if (allFolders.length > 0) {
        // Filtering folders
        filtered = allFolders.filter(folder => {
            const matchesSearch = folder.name.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || folder.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
        currentItems = filtered;
        renderFolders(filtered);
    } else if (allFiles.length > 0) {
        // Filtering files
        filtered = allFiles.filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(searchTerm);
            const matchesType = fileTypeFilter === 'all' || 
                              (fileTypeFilter === 'html' && file.isHtml) ||
                              (fileTypeFilter === 'other' && !file.isHtml);
            return matchesSearch && matchesType;
        });
        currentItems = filtered;
        renderFiles(filtered);
    }
}

// Sort functions
function sortByName() {
    currentItems.sort((a, b) => a.name.localeCompare(b.name));
    if (allFolders.length > 0) renderFolders(currentItems);
    else renderFiles(currentItems);
    showNotification('🔤 Sorted alphabetically');
}

function sortByRecent() {
    currentItems.sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed));
    if (allFolders.length > 0) renderFolders(currentItems);
    else renderFiles(currentItems);
    showNotification('🕐 Sorted by recent');
}

function sortByPopular() {
    currentItems.sort((a, b) => b.clicks - a.clicks);
    if (allFolders.length > 0) renderFolders(currentItems);
    else renderFiles(currentItems);
    showNotification('🔥 Sorted by popularity');
}

function sortBySize() {
    if (allFiles.length > 0) {
        currentItems.sort((a, b) => b.size - a.size);
        renderFiles(currentItems);
        showNotification('📏 Sorted by size');
    }
}

// ============================================
// ACTION FUNCTIONS
// ============================================

function toggleDarkMode() {
    document.body.style.filter = document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
    showNotification('🌙 Theme toggled');
}

function sharePortfolio() {
    if (navigator.share) {
        navigator.share({
            title: 'My Portfolio',
            text: 'Check out my portfolio!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showNotification('📋 Link copied to clipboard!');
    }
}

function shareFolder() {
    sharePortfolio();
}

function downloadReport() {
    const report = {
        totalFolders: allFolders.length,
        totalFiles: allFolders.reduce((sum, f) => sum + f.fileCount, 0),
        analytics: analytics,
        generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-report-${Date.now()}.json`;
    a.click();
    showNotification('📥 Report downloaded!');
}

function exportData() {
    const data = {
        folders: allFolders,
        files: allFiles,
        analytics: analytics,
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-${Date.now()}.json`;
    a.click();
    showNotification('💾 Data exported!');
}

function downloadFolder() {
    showNotification('💾 Folder download feature coming soon!');
}

function refreshFromGitHub() {
    location.reload();
}

function refreshFiles() {
    location.reload();
}

function viewAnalytics() {
    const totalClicks = Object.values(analytics.clicks).reduce((sum, val) => sum + val, 0);
    alert(`📊 Analytics Summary\n\nTotal Folders: ${allFolders.length}\nTotal Clicks: ${totalClicks}\nVisits: ${analytics.visits}`);
}

function openGitHub() {
    window.open(`https://github.com/${CONFIG.githubUsername}/${CONFIG.repoName}`, '_blank');
}

function openFolderInGitHub() {
    const folder = getUrlParameter('folder');
    if (folder) {
        window.open(`https://github.com/${CONFIG.githubUsername}/${CONFIG.repoName}/tree/${CONFIG.branch}/${folder}`, '_blank');
    }
}

// ============================================
// INITIALIZATION FUNCTIONS
// ============================================

// Initialize main dashboard
// async function initMainDashboard() {
//     console.log('Initializing main dashboard...');
    
//     // Load analytics
//     loadAnalytics();
//     loadCategories();
//     loadFolders();
//     updateStats();
    
//     // Update time features
//     updateClock();
//     updateWeather();
//     updateVisitCounter();
//     setInterval(updateClock, 1000);
//     setInterval(updateLastUpdated, 60000);
    
//     // Setup view toggle
//     setupViewToggle();
    
//     // Setup filters
//     const searchInput = document.getElementById('searchInput');
//     const categoryFilter = document.getElementById('categoryFilter');
    
//     if (searchInput) searchInput.addEventListener('input', filterItems);
//     if (categoryFilter) categoryFilter.addEventListener('change', filterItems);
    
//     // Setup FAB menu
//     setupFAB();
    
//     // Setup keyboard shortcuts
//     setupKeyboardShortcuts();
    
//     // Load folders from GitHub
//     const folders = await getAllFolders();
//     currentItems = folders;
    
//     // Populate category filter
//     if (categoryFilter) {
//         const categories = [...new Set(folders.map(f => f.category))];
//         categories.forEach(cat => {
//             const option = document.createElement('option');
//             option.value = cat;
//             option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
//             categoryFilter.appendChild(option);
//         });
//     }
    
//     renderFolders(folders);
    
//     // Start analytics interval
//     setInterval(updateAnalytics, 10000);
// }

async function initMainDashboard() {
    console.log('Initializing main dashboard...');
    
    // Load analytics
    loadAnalytics();
    
    // Update time features
    updateClock();
    updateWeather();
    updateVisitCounter();
    setInterval(updateClock, 1000);
    setInterval(updateLastUpdated, 60000);
    
    // Setup view toggle
    setupViewToggle();
    
    // Setup filters
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterItems);
    if (categoryFilter) categoryFilter.addEventListener('change', filterItems);
    
    // Setup FAB menu
    setupFAB();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Load folders from GitHub
    const folders = await getAllFolders();
    currentItems = folders;
    
    // Populate category filter
    if (categoryFilter) {
        const categories = [...new Set(folders.map(f => f.category))];
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            categoryFilter.appendChild(option);
        });
    }
    
    renderFolders(folders);
    updateStats(); // ✅ NOW called AFTER folders are loaded
    
    // Start analytics interval
    setInterval(updateAnalytics, 10000);
}
// Initialize file viewer
async function initFileViewer() {
    console.log('Initializing file viewer...');
    
    const folderName = getUrlParameter('folder');
    
    if (!folderName) {
        showNotification('❌ No folder specified');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    // Update UI with folder name
    document.getElementById('currentFolder').textContent = folderName;
    document.getElementById('folderTitle').textContent = `${getFolderEmoji(folderName)} ${folderName}`;
    document.getElementById('folderPath').textContent = `📂 /${folderName}`;
    
    // Load analytics
    loadAnalytics();
    
    // Update time features
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(updateLastUpdated, 60000);
    
    // Setup view toggle
    setupViewToggle();
    
    // Setup filters
    const searchInput = document.getElementById('searchInput');
    const fileTypeFilter = document.getElementById('fileTypeFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterItems);
    if (fileTypeFilter) fileTypeFilter.addEventListener('change', filterItems);
    
    // Setup FAB menu
    setupFAB();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Load files from GitHub
    const files = await getFilesInFolder(folderName);
    currentItems = files;
    renderFiles(files);
}

// Setup view toggle
function setupViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            
            if (allFolders.length > 0) renderFolders(currentItems);
            else if (allFiles.length > 0) renderFiles(currentItems);
        });
    });
}

// Setup FAB menu
function setupFAB() {
    const fabBtn = document.getElementById('fabBtn');
    const fabMenu = document.getElementById('fabMenu');
    
    if (fabBtn && fabMenu) {
        fabBtn.addEventListener('click', () => {
            fabMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.fab-container')) {
                fabMenu.classList.remove('active');
            }
        });
    }
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
        if (e.key === 'Escape') {
            document.getElementById('fabMenu')?.classList.remove('active');
        }
    });
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Check which page we're on and initialize accordingly
// document.addEventListener('DOMContentLoaded', () => {
//     const path = window.location.pathname;
    
//     if (path.includes('viewer.html')) {
//         // We're on the viewer page - initFileViewer will be called by the script tag in HTML
//     } else {
//         // We're on the main dashboard - initMainDashboard will be called by the script tag in HTML
//     }
// });