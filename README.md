# AlgoBlur - Privacy Obfuscation Platform

AlgoBlur is a privacy-focused application designed to obscure your digital footprint by introducing noise into the data sold to ad companies.

## iOS Build Instructions (Ionic Appflow)

To successfully build this app on Ionic Appflow and generate your `.ipa`, follow these steps:

### 1. Repository Structure (CRITICAL)
Your GitHub repository MUST have `package.json` at the very root. If you see a folder like `Algoblur/` at the top level, you must move all files out of it to the root.

**Correct Structure:**
```
/
├── package.json
├── capacitor.config.ts
├── ionic.config.json
├── src/
├── ios/
└── ...
```

### 2. Appflow Configuration
In your Ionic Appflow Dashboard:
- **Environment Variables**: Add `ENABLE_SPM_SUPPORT=true`. This is required for Capacitor 8 projects using Swift Package Manager.
- **Build Stack**: Select `macOS - 2024.04` or newer (requires Xcode 15+).

### 3. Local Development
To sync your web changes to the native iOS project:
```bash
npm run mobile:build
```

To open the project in Xcode:
```bash
npm run mobile:open
```

## Privacy Manifesto
We believe in a web where privacy isn't a luxury. AlgoBlur helps you "poison the well" for data brokers by injecting high-entropy noise into your algorithmic profile.
