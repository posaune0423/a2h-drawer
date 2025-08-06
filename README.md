# a2h-drawer

A universal React component library for PWA "Add to Home Screen" flows with iOS-native UI design.

## Overview

`a2h-drawer` provides a seamless, iOS-inspired UI component for Progressive Web Apps that guides users through the "Add to Home Screen" process. The library automatically detects app icons and provides an intuitive, shadcn-compatible interface that enhances PWA adoption.

## Features

- 🌟 **iOS 26 Liquid Glass Design** - Cutting-edge glassmorphism effects inspired by iOS 26
- 🍎 **Native iOS Experience** - Authentic iOS design patterns and fluid animations
- 💎 **Advanced Glass Effects** - Multi-layer backdrop blur with color mixing
- 📱 **Auto Icon Detection** - Automatically imports and displays app icons with glass overlays
- 🎬 **Demo Video Support** - Elegantly integrated demo content with glass morphism
- 🧩 **shadcn/ui Compatible** - Seamless integration with existing shadcn/ui projects
- ⚡ **Framework Agnostic** - Works with Next.js, React, and other modern frameworks
- 🎨 **Liquid Interactions** - Smooth hover and press animations with physics-based feedback
- 📱 **Responsive Glass** - Optimized glass effects for mobile and desktop experiences
- 🌈 **P3 Color Gamut** - Wide color support using OKLCH color space

## Technology Stack

- **Runtime**: [Bun](https://bun.com) - Fast all-in-one JavaScript runtime
- **Language**: TypeScript with strict type checking
- **Framework**: React 19+ with modern hooks
- **Styling**: Tailwind CSS v4 with iOS 26 Liquid Glass design system
- **Build**: [tsup](https://tsup.egoist.dev/) for optimized bundling with tree-shaking
- **UI Components**: shadcn/ui with Vaul-powered Drawer
- **Testing**: Bun test framework
- **Linting**: Biome for fast code formatting and linting

## Installation

```bash
# Using bun (recommended)
bun add a2h-drawer

# Using npm
npm install a2h-drawer

# Using pnpm
pnpm add a2h-drawer

# Using yarn
yarn add a2h-drawer
```

## Quick Start

```tsx
import { A2HDrawer } from 'a2h-drawer'

function App() {
  return (
    <div>
      <A2HDrawer 
        appName="My PWA App"
        autoDetectIcon={true}
        showDemoVideo={true}
        theme="ios"
      />
    </div>
  )
}
```

## Development

### Prerequisites

- [Bun](https://bun.com) v1.2.19 or later

### Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run example
cd examples/react
bun install
bun run dev
```

### Project Structure

```
a2h-drawer/
├── src/                    # Library source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── index.ts           # Main entry point
├── examples/              # Usage examples
│   └── react/             # React example app
└── dist/                  # Built library (generated)
```

### Building

```bash
# Build the library (ESM + CJS + Types)
bun run build

# Development mode with watch
bun run dev

# Type checking
bun run type-check

# Linting
bun run lint
```

### Build System

This library uses [tsup](https://tsup.egoist.dev/) for optimized bundling:

- **Dual Format**: Generates both ESM and CommonJS builds
- **Type Definitions**: Automatic .d.ts generation
- **Tree Shaking**: Dead code elimination for optimal bundle size
- **Source Maps**: Full source map support for debugging
- **External Dependencies**: Properly externalized peer dependencies

### Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch
```

## API Reference

### `<A2HDrawer />`

The main component for displaying the Add to Home Screen drawer.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appName` | `string` | `""` | The name of your PWA application |
| `autoDetectIcon` | `boolean` | `true` | Automatically detect and display app icons |
| `showDemoVideo` | `boolean` | `false` | Show demonstration video |
| `theme` | `"ios" \| "material" \| "custom"` | `"ios"` | UI theme variant |
| `customIcon` | `string` | `undefined` | Custom icon URL (overrides auto-detection) |
| `onClose` | `() => void` | `undefined` | Callback when drawer is closed |
| `onInstall` | `() => void` | `undefined` | Callback when installation is triggered |

## Browser Support

- ✅ iOS Safari 14+
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Samsung Internet 14+

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Related Projects

- [shadcn/ui](https://ui.shadcn.com/) - UI components built with Radix UI and Tailwind CSS
- [PWA Builder](https://www.pwabuilder.com/) - Tools for building Progressive Web Apps

---

Built with ❤️ using [Bun](https://bun.com)
