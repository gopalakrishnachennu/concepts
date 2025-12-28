# DBA Learning Hub - Clean Dynamic Structure

## 🎯 Overview

A completely rebuilt, clean, and simple dynamic learning platform where **all content is defined in JSON files**. Just add a JSON file to add a new topic!

## 📁 File Structure

```
DBA/
├── main.html              # Main application (includes engine)
├── styles.css             # Base styles
├── sidebar-styles.css     # Sidebar & workflow styles
├── course.json            # Course metadata & topic list
├── content/               # All topic content (JSON files)
│   ├── os-tuning.json
│   ├── backup-recovery.json
│   └── performance-tuning.json
├── OsTuning.js            # (Legacy - can be removed)
└── README.md              # This file
```

## 🚀 How It Works

### 1. Course Structure (`course.json`)

Defines all topics:

```json
{
  "course": {
    "title": "PostgreSQL DBA Mastery",
    "description": "Comprehensive course..."
  },
  "topics": [
    {
      "id": "os-tuning",
      "title": "OS Tuning for PostgreSQL",
      "icon": "⚙️",
      "difficulty": "intermediate",
      "duration": "2 hours",
      "enabled": true,
      "contentFile": "os-tuning.json"
    }
  ]
}
```

### 2. Topic Content (`content/*.json`)

Each topic has its own JSON file with sections and content:

```json
{
  "id": "os-tuning",
  "sections": [
    {
      "id": "overview",
      "title": "What is OS Tuning?",
      "content": [
        {
          "type": "cards",
          "items": [...]
        }
      ]
    },
    {
      "id": "workflow",
      "title": "On-Premises Workflow",
      "workflow": {
        "steps": [
          {
            "number": 1,
            "title": "IDENTIFY",
            "icon": "🔍",
            "codeExamples": [...]
          }
        ]
      }
    }
  ]
}
```

### 3. Dynamic Engine (`main.html`)

The JavaScript engine in `main.html`:
- Loads `course.json` on startup
- Renders sidebar with all topics
- Loads topic content from `content/*.json` when clicked
- Renders content dynamically based on type

## ✨ Adding a New Topic

### Step 1: Add to `course.json`

```json
{
  "id": "new-topic",
  "title": "My New Topic",
  "icon": "🎯",
  "difficulty": "beginner",
  "duration": "1 hour",
  "enabled": true,
  "contentFile": "new-topic.json"
}
```

### Step 2: Create `content/new-topic.json`

```json
{
  "id": "new-topic",
  "sections": [
    {
      "id": "overview",
      "title": "Topic Overview",
      "content": [
        {
          "type": "cards",
          "items": [
            {
              "icon": "🎯",
              "title": "Concept",
              "text": "Your content here..."
            }
          ]
        }
      ]
    }
  ]
}
```

### Step 3: Done! 🎉

Refresh the page - your new topic appears in the sidebar!

## 📝 Content Types

### Cards
```json
{
  "type": "cards",
  "items": [
    {
      "icon": "🎯",
      "title": "Title",
      "text": "Description"
    }
  ]
}
```

### Workflow
```json
{
  "type": "workflow",
  "steps": [
    {
      "number": 1,
      "title": "STEP TITLE",
      "description": "Brief description",
      "details": "More details",
      "icon": "🔍",
      "codeExamples": [
        {
          "title": "Example Title",
          "language": "bash",
          "code": "echo 'Hello World'"
        }
      ]
    }
  ]
}
```

### Placeholder
```json
{
  "type": "placeholder",
  "message": "Coming soon!"
}
```

## 🎨 Features

- ✅ **Dynamic Loading**: All content from JSON
- ✅ **Sidebar Navigation**: Click to switch topics
- ✅ **Code Examples**: Expandable with copy button
- ✅ **Workflows**: Step-by-step visualizations
- ✅ **Placeholders**: For upcoming topics
- ✅ **Responsive**: Works on all devices
- ✅ **No Build Step**: Pure HTML/CSS/JS

## 🔧 Customization

### Change Course Title
Edit `course.json`:
```json
{
  "course": {
    "title": "Your Course Name"
  }
}
```

### Add More Content Types
Edit the `renderContent()` function in `main.html` to handle new types.

## 🚀 Running Locally

```bash
cd DBA
python3 -m http.server 8000
```

Open: http://localhost:8000/main.html

## 📊 Current Topics

1. ✅ **OS Tuning** - Fully implemented with 3 workflow steps and code examples
2. 🚧 **Backup & Recovery** - Placeholder
3. 🚧 **Performance Tuning** - Placeholder

## 🎯 Next Steps

1. Complete OS Tuning content (add all 9 steps)
2. Add Backup & Recovery content
3. Add Performance Tuning content
4. Add more topics as needed

## 💡 Tips

- Keep JSON files properly formatted
- Test each topic after adding
- Use placeholders for work-in-progress topics
- Code examples support: bash, sql, python, javascript, etc.

---

**Built with ❤️ for Database Administrators**
