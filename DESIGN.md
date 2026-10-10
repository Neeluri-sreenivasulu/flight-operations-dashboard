# Design Explanation
## Flight Tracking & Operations Dashboard

### 1. Project Overview

The Flight Tracking & Operations Dashboard was developed as part of the Frontend Developer (Angular & UI/UX) technical assessment for Ramphal Technologies Pvt Ltd. The application provides a centralized interface for monitoring mock flight information, viewing flight routes, and tracking operational statuses.

### 2. UI/UX Design

The dashboard uses a dark aviation-inspired theme to provide a professional operations-center experience. The interface includes KPI cards, a search and filter section, a large interactive map, and a selected-flight details panel.

Status colours help users distinguish active, delayed, arrived, and scheduled flights. The layout prioritizes the map while keeping important operational information accessible.

### 3. Application Architecture

The application is developed using Angular 19 and TypeScript, with standalone components for modularity and reuse.

- **Dashboard component:** Displays KPI cards and manages search, filters, and flight selection.
- **Flight map component:** Renders the Leaflet map, flight markers, tooltips, and route polylines.
- **Flight details component:** Displays the selected flight's operational information.
- **Flight service:** Loads mock flight data and manages selected-flight state.
- **Flight model:** Defines the structure of flight and airport records.

Angular Router manages navigation. Reactive Forms and RxJS support interactive filtering and reactive data handling.

### 4. Map and Route Visualization

Leaflet is used to display the flight map and plot 20 mock flights. Each marker represents a flight and provides a tooltip containing its identifying information and route.

When a marker is selected, the dashboard updates the flight details panel, highlights the route between origin, current position, and destination, and adjusts the map view to show the selected route.

### 5. Data Management

Flight records are stored in `src/assets/data/flights.json` and loaded through an Angular service. The application uses mock data and does not require a backend or live aviation API.

### 6. Responsive Design

The dashboard uses responsive CSS to adapt the interface to desktop and tablet screens. The map, search controls, KPI cards, and flight details panel are designed to provide a consistent operational experience across supported screen sizes.

### 7. Conclusion

This project demonstrates Angular component architecture, TypeScript, routing, services, RxJS, Reactive Forms, and Leaflet integration in a modern aviation operations dashboard.
