# 🔌 Tech Stack & Dependencies — Len Handmade

> Package versions, build tools, và dev commands

---

## 📦 Core Dependencies

| Package | Version | Vai trò |
|---------|---------|---------|
| React | 19.x | UI library |
| React DOM | 19.x | DOM rendering |
| React Router DOM | 7.x | Client-side routing |
| Vite | 6.x | Build tool & dev server |
| TailwindCSS | 4.x | Utility-first CSS |
| Motion | 12.x | Animation library (Framer Motion) |
| Lucide React | 0.546+ | SVG icon library |
| Firebase | 12.x | Auth, Firestore, Storage |
| @google/genai | 1.x | AI chatbot integration |
| TypeScript | 5.8+ | Type safety |

---

## 🛠️ Dev Commands

```bash
# Development server
npm run dev          # Vite dev server at http://localhost:3000

# Production build
npm run build        # Build to dist/ folder

# Type checking
npm run lint         # TypeScript check (tsc --noEmit)

# Preview production build
npm run preview      # Preview dist/ locally
```

---

## 🔧 Build Configuration

### Vite Config Highlights
- **Port:** 3000 (dev server)
- **Base URL:** `/`
- **Build output:** `dist/`
- **React plugin:** `@vitejs/plugin-react` (with Fast Refresh)
- **CSS:** TailwindCSS v4 with `@theme` directive

### Tailwind Config
- **Version:** 4.x (latest)
- **Custom tokens:** Defined in `src/index.css` via `@theme` directive
- **JIT:** Always enabled
- **Purge:** Automatic (Vite + Tailwind 4)

---

## 🔐 Environment Variables

> Stored in `.env` (gitignored). See `.env.example` for template.

```bash
# Google GenAI
VITE_GEMINI_API_KEY=your_key_here

# Firebase
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=len-handmade-boutique
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🌐 Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Android 90+
- **No IE11 support** (React 19 requirement)

---

## 📂 Key Files

| File | Mô tả |
|------|-------|
| `package.json` | Dependencies & scripts |
| `vite.config.ts` | Vite configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind configuration (minimal, most config in index.css) |
| `src/index.css` | Main stylesheet + Tailwind `@theme` tokens |
| `src/lib/firebase.ts` | Firebase initialization |
| `.env` | Environment variables (gitignored) |

---

## 🔗 Related Documentation

- **Project Overview**: See [PROJECT-OVERVIEW.md](PROJECT-OVERVIEW.md)
- **Code Standards**: See [../rules/CODE-STANDARDS.md](../rules/CODE-STANDARDS.md)
- **Tech Defaults**: See [../rules/tech-defaults.md](../rules/tech-defaults.md)
