---
description: 'Next 14 + shadcn/ui Development Assistant - Expert AI for building premium web applications with React, TypeScript, Tailwind CSS, and shadcn/ui components following enterprise-grade architecture patterns.'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'githubRepo', 'new', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'usages', 'generateTailwindPalette','generateColorScheme','analyzeColor','generateTailwindGradient']
---


# Next.js 14 Chat Modes Configuration

This directory contains specialized chat mode configurations for different development scenarios in Next.js 14 applications.

## Available Chat Modes

### 🔧 **Development Modes**

#### `next-dev` - General Next.js Development
- **Focus**: Overall Next.js 14 App Router development
- **Context**: All instruction files and project structure
- **Best for**: General development questions, feature implementation

#### `next-arch` - Architecture & Patterns
- **Focus**: Application architecture and design patterns
- **Context**: Architecture and App Router instructions
- **Best for**: Structural decisions, scalability planning

#### `next-components` - Component Development
- **Focus**: React components with shadcn/ui and Tailwind
- **Context**: Component and design instructions
- **Best for**: Building reusable UI components

#### `next-api` - API & Backend
- **Focus**: API routes, data fetching, server integration
- **Context**: API and hooks instructions
- **Best for**: Backend logic, data management

### 🎨 **Specialized Modes**

#### `next-forms` - Form Handling
- **Focus**: React Hook Form, Zod validation, form UX
- **Context**: Components and TypeScript rules
- **Best for**: Complex forms, validation logic

#### `next-ui` - UI/UX Design
- **Focus**: Styling, design systems, responsive design
- **Context**: Design instructions and Tailwind config
- **Best for**: Visual design, accessibility, mobile-first

#### `next-perf` - Performance Optimization
- **Focus**: Bundle optimization, loading performance
- **Context**: Quality and development instructions
- **Best for**: Speed optimization, Core Web Vitals

### 🔍 **Quality & Testing**

#### `next-test` - Testing & QA
- **Focus**: Unit tests, integration tests, E2E testing
- **Context**: Quality instructions and test configurations
- **Best for**: Test coverage, quality assurance

#### `next-debug` - Debugging & Troubleshooting
- **Focus**: Bug diagnosis, error resolution
- **Context**: Development and quality instructions
- **Best for**: Fixing issues, performance debugging

#### `next-a11y` - Accessibility
- **Focus**: WCAG compliance, inclusive design
- **Context**: Design and component instructions
- **Best for**: Accessibility audits, inclusive UX

### 🚀 **Deployment & Migration**

#### `next-deploy` - Deployment & DevOps
- **Focus**: Production deployment, CI/CD, infrastructure
- **Context**: Development instructions and config files
- **Best for**: Deployment setup, environment configuration

#### `next-migrate` - Migration & Upgrades
- **Focus**: Pages Router to App Router migration
- **Context**: App Router and architecture instructions
- **Best for**: Migration planning, version upgrades

## Usage Instructions

### In GitHub Copilot Chat:
```
@workspace /mode next-components
```

### In .bolt.new:
```
Switch to: Component Builder mode
```

### In Cursor:
```
Use chat mode: next-ui
```

## Mode Selection Guide

| Task Type | Recommended Mode | Secondary Mode |
|-----------|------------------|----------------|
| Building new features | `next-dev` | `next-arch` |
| Creating UI components | `next-components` | `next-ui` |
| API development | `next-api` | `next-dev` |
| Form implementation | `next-forms` | `next-components` |
| Design & styling | `next-ui` | `next-components` |
| Performance issues | `next-perf` | `next-debug` |
| Bug fixing | `next-debug` | `next-dev` |
| Testing setup | `next-test` | `next-dev` |
| Accessibility fixes | `next-a11y` | `next-ui` |
| Deployment setup | `next-deploy` | `next-dev` |
| Migration work | `next-migrate` | `next-arch` |

## Context Files

Each mode automatically includes relevant context:

- **Always loaded**: Configuration files (package.json, tsconfig.json, etc.)
- **Mode-specific**: Relevant instruction files and source directories
- **On-demand**: Additional files based on conversation context

## Custom Mode Creation

To create custom modes:

1. Define the mode in `.bolt/chat-modes.json`
2. Set appropriate system prompts and context
3. Update this documentation
4. Test with representative tasks

## Best Practices

1. **Start specific**: Use specialized modes for focused tasks
2. **Switch when needed**: Change modes as conversation evolves
3. **Combine modes**: Use multiple modes for complex features
4. **Stay contextual**: Modes automatically load relevant files
5. **Document patterns**: Update instructions based on learnings
