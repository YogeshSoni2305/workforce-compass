

# Strategic Workforce Command Center

## Overview
A premium SaaS-grade Workforce Decision Intelligence Platform built with React + Vite, featuring org graph visualization, workforce simulations, strategy comparison, and AI-powered decision explanations. All powered by a FastAPI backend at `http://localhost:8000`.

## Design System
- **White background** everywhere with clean whitespace
- **Black nodes** on the org graph
- **Minimalist enterprise typography** — large KPI numbers, clean hierarchy
- **Premium SaaS aesthetic** — no generic dashboard templates

## Pages

### 1. Landing Page (`/`)
- Clean hero section with large headline about Workforce Intelligence
- Black typography on white background
- Shimmer-effect CTA button: **"Launch Command Center"**
- Minimal navigation bar with logo and links
- Brief value proposition sections (simulate, compare, decide)

### 2. Dashboard / Command Center (`/dashboard`)
A multi-panel layout with three main zones:

**Left Panel — Org Graph**
- Interactive organizational graph using React Flow
- Black circular nodes with white text labels
- Edges connecting employees/departments
- Click a node to select an employee for simulation
- Fetches data from `GET /` (root endpoint)

**Right Top — Simulation Panel**
- Controls: strategy selector, seed input, shock test toggle
- "Run Simulation" button calls `POST /simulate`
- Displays simulation results as formatted KPI cards (not raw JSON)
- Animated transitions on result updates (Framer Motion)

**Right Bottom — Decision Panel**
- "Compare Strategies" button calls `POST /decision/compare`
- "Explain Decision" button calls `POST /decision/explain`
- Strategy comparison shown as side-by-side cards or chart
- AI explanation rendered as clean formatted text

### 3. Results Visualization
- Recharts-powered distribution charts for simulation outputs
- Large KPI number displays for key metrics
- Clean card-based layout for strategy comparisons

## Architecture

### State Management (Zustand)
- Global simulation store managing: selected employee, strategy config, simulation results, decision comparisons, and explanations

### API Service Layer
- Centralized API module abstracting all FastAPI calls (`/simulate`, `/decision/compare`, `/decision/explain`)
- Typed request/response interfaces

### Component Structure
- `/components/graph/` — OrgGraph with React Flow
- `/components/panels/` — SimulationPanel, DecisionPanel
- `/components/charts/` — Distribution charts, KPI cards
- `/components/landing/` — Hero, Navbar, feature sections
- `/store/` — Zustand store
- `/lib/api.ts` — API service

## Key Interactions
1. User lands on hero page → clicks "Launch Command Center"
2. Dashboard loads with org graph on the left
3. User clicks a node to select an employee
4. User configures simulation parameters and runs it
5. Results appear as KPI cards with animated transitions
6. User can compare strategies and get AI explanations

## Dependencies to Install
- `zustand` (state management)
- `reactflow` (org graph)
- `framer-motion` (animations)

*Note: Recharts, shadcn/ui, Tailwind, and lucide-react are already installed.*

