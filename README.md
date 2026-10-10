
# Flight Tracking & Operations Dashboard

An interactive aviation operations dashboard built with Angular 19, TypeScript, and Leaflet. This project was developed as part of the Frontend Developer (Angular & UI/UX) technical assessment for Ramphal Technologies Pvt Ltd.

## Features

- **Interactive Flight Map:** Displays 20 mock flights using Leaflet markers.
- **Flight Tooltips:** Shows flight number, callsign, route, and status.
- **Route Visualization:** Highlights the selected flight's route between origin, current position, and destination.
- **Flight Details:** Displays aircraft type, flight number, callsign, origin, destination, status, and estimated departure and arrival times.
- **Operations KPIs:** Displays total, active, delayed, and arrived flight counts.
- **Search:** Search flights by flight number or callsign.
- **Filters:** Filter by flight status, origin airport, and destination airport.
- **Responsive UI:** Dark aviation-inspired dashboard designed for desktop and tablet screens.

## Technologies Used

- Angular 19
- TypeScript
- HTML5 and CSS3
- Angular Reactive Forms
- Angular Router
- RxJS
- Leaflet
- JSON mock data

## Prerequisites

Install the following before running the application:

- Node.js compatible with Angular 19
- npm
- Angular CLI

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Neeluri-sreenivasulu/flight-operations-dashboard.git
cd flight-operations-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
ng serve
```

### 4. Open the application

Navigate to:

http://localhost:4200/dashboard

The Angular development server automatically rebuilds the application when source files change.

## Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   └── flight.model.ts
│   │   └── services/
│   │       └── flight.service.ts
│   ├── features/
│   │   ├── dashboard/
│   │   ├── flight-map/
│   │   └── flight-details/
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   └── data/
│       └── flights.json
└── styles.css
```

## Mock Flight Data

Flight records are stored in `src/assets/data/flights.json`. The data includes flight identifiers, callsigns, aircraft types, origin and destination airports, statuses, estimated departure and arrival times, and current positions.

This assessment uses mock data and does not connect to a live flight-tracking API or backend service.

## Running Tests

Run the Angular unit tests with:

```bash
ng test
```

## Production Build

Build the application with:

```bash
ng build
```

The generated build output is written to the configured `dist/` directory.

## Design Approach

The dashboard uses a dark aviation-inspired interface with status-coloured flight markers, KPI cards, a map-focused layout, and a selected-flight details panel.

Angular standalone components separate the dashboard, map, and flight details. A dedicated service manages flight data and selected-flight state. Reactive Forms and RxJS support search and filtering.

Leaflet provides map rendering, flight markers, tooltips, route polylines, and map navigation when a flight is selected.

## Screenshots

Add screenshots of the completed application to a `screenshots/` folder and reference them here.

Example:

```markdown
![Flight Dashboard](screenshots/dashboard.png)
![Selected Flight and Route](screenshots/selected-flight.png)
![Flight Search and Filters](screenshots/flight-filters.png)
```

## Author

Srinivas Neeluri
