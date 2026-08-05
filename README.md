# Generic HTTP Client

A modern Angular application that consumes a REST API through a generic HttpClient service layer. The project includes CRUD screens for cars and brands, and was updated toward Angular 22 compatibility.

## Overview

This project demonstrates:

- A reusable generic base service for REST operations
- Component-level CRUD flows for products and brands
- Standalone Angular components
- Router-based navigation with Angular 22-style configuration
- Clean separation between models, services, and presentation

## Requirements

- Node.js 20+ recommended
- npm 10+
- Angular CLI 22.x

## Installation

```bash
npm install
```

To simulate the REST API locally, run:

```bash
npm run api
```

## Development

Start the app in development mode:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

## Production build

```bash
npm run build
```

## Project structure

- src/app/components: screens and presentations
- src/app/services: HTTP and API access layer
- src/app/models: typed data models
- src/assets/data: mock data used by the local JSON API
- src/environments: runtime configuration for dev/prod

## Notes

- The application intentionally uses a lightweight local JSON server for demo data.
- This codebase was upgraded from legacy Angular patterns to current standalone component architecture and Angular 22-compatible configuration.
- Some production optimization settings may need tuning depending on the Node.js version and target browser support matrix.
