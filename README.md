# 🎯 Random Picker - The Ultimate Classroom Challenge

A realistic, interactive 3D-inspired Random Picker web application designed for classroom activities, lucky draws, and interactive student selection.

## ✨ Features

- **Realistic Glass Jar & Origami Paper Chits**: 3D volumetric glass jar with optical caustics, brass screw lid, realistic sage-green pedestal, and folded white origami paper slips.
- **Excel & CSV Import**: Drag & drop support for `.xlsx`, `.xls`, and `.csv` files with automatic column detection and duplicate handling.
- **Audio & Celebrations**: Sound effects, festive background music, and Web Speech API voice announcements.
- **Full Viewport Zero-Scroll UI**: Clean, light green and white aesthetic fitted perfectly in a single viewport (`100vh`) with no window scrollbars.
- **Protected Admin Panel**: Disclose or hide eligible/excluded statistics, edit student names directly with emojis, toggle exclusions, and export winner records.
- **Winner Reveal Modal**: Gold trophy animations, celebratory confetti blast, roll/serial tracking, and real-time remaining counters.
- **Customizable Settings**: No-repeat draw mode, adjustable countdown duration, animation speeds, and quick data reset.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd diwali-blast

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Animations**: Framer Motion + Canvas Confetti
- **Icons**: Lucide React
- **File Parsing**: XLSX (SheetJS)
- **Audio**: Web Audio API + SpeechSynthesis

