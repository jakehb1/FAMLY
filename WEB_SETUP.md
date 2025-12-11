# Running Famly in the Browser

## Quick Start

1. **Start the development server:**
   ```bash
   npm run web
   ```
   or
   ```bash
   npm start
   # Then press 'w' to open in web browser
   ```

2. **Access the app:**
   - The app will automatically open in your default browser
   - Or manually navigate to: `http://localhost:8081` (or the port shown in terminal)

## Notes

- **Web Limitations:** Some features may not work in the browser:
  - Apple Sign-In (iOS only)
  - Native location services (will need web geolocation API)
  - Push notifications (web notifications API)
  - Camera/Image picker (web file input)

- **Development:** The web version is great for:
  - Testing UI components
  - Debugging layout issues
  - Quick iteration on styling
  - Testing authentication flows (email/password)

## Troubleshooting

If you see errors about missing modules:
```bash
npm install --legacy-peer-deps
```

If the browser doesn't open automatically:
- Check the terminal for the URL
- Usually `http://localhost:8081` or similar
- Look for "Web is waiting on http://..."

