import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import type * as Leaflet from 'leaflet';

import { Flight } from '../../core/models/flight.model';


@Component({
  selector: 'app-flight-map',
  standalone: true,
  imports: [],
  templateUrl: './flight-map.component.html',
  styleUrl: './flight-map.component.css'
})
export class FlightMapComponent
  implements AfterViewInit, OnChanges, OnDestroy {


  // =====================================================
  // INPUTS / OUTPUTS
  // =====================================================

  @Input()
  flights: Flight[] = [];

  @Input()
  selectedFlight: Flight | null = null;

  @Output()
  flightSelected =
    new EventEmitter<Flight>();


  // =====================================================
  // LEAFLET VARIABLES
  // =====================================================

  private map!: Leaflet.Map;

  private markers: Leaflet.Marker[] = [];

  private routeLine?: Leaflet.Polyline;

  /**
   * Leaflet library loaded only in browser.
   */
  private L: typeof import('leaflet') | null = null;

  /**
   * Prevent map from being initialized twice.
   */
  private mapInitialized = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: object
  ) {}


  // =====================================================
  // AFTER VIEW INIT
  // =====================================================

  async ngAfterViewInit(): Promise<void> {

    /*
     * Angular SSR does not have window/document.
     *
     * Leaflet requires browser APIs.
     *
     * Therefore we stop here when rendering
     * on the server.
     */

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }


    await this.initializeMap();

  }


  // =====================================================
  // ON CHANGES
  // =====================================================

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    /*
     * When flights change, update markers.
     */

    if (
      changes['flights'] &&
      this.mapInitialized
    ) {

      this.renderFlights();

    }


    /*
     * When selected flight changes,
     * update the route.
     */

    if (
      changes['selectedFlight'] &&
      this.mapInitialized
    ) {

      this.renderSelectedRoute();

    }

  }


  // =====================================================
  // INITIALIZE MAP
  // =====================================================

  private async initializeMap(): Promise<void> {

    /*
     * Safety check.
     */

    if (
      !isPlatformBrowser(this.platformId) ||
      this.mapInitialized
    ) {

      return;

    }


    /*
     * IMPORTANT:
     *
     * Leaflet is dynamically imported.
     *
     * This prevents Angular SSR from executing
     * Leaflet on the server.
     */

    const leaflet =
      await import('leaflet');


    this.L = leaflet;


    /*
     * Find map container.
     */

    const mapElement =
      document.getElementById(
        'flight-map'
      );


    if (!mapElement) {

      console.error(
        'Leaflet map container #flight-map was not found.'
      );

      return;

    }


    /*
     * Create map.
     */

    this.map =
      this.L
        .map(
          mapElement,
          {
            zoomControl: false
          }
        )
        .setView(
          [25, 70],
          3
        );


    /*
     * Add zoom control.
     */

    this.L
      .control
      .zoom({
        position: 'bottomright'
      })
      .addTo(this.map);


    /*
     * OpenStreetMap tiles.
     */

    this.L
      .tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,

          attribution:
            '&copy; OpenStreetMap contributors'
        }
      )
      .addTo(this.map);


    /*
     * Mark map as initialized.
     */

    this.mapInitialized = true;


    /*
     * Render flights.
     */

    this.renderFlights();


    /*
     * If a flight was already selected
     * before the map finished initializing,
     * draw its route.
     */

    if (this.selectedFlight) {

      this.renderSelectedRoute();

    }

  }


  // =====================================================
  // RENDER FLIGHTS
  // =====================================================

  private renderFlights(): void {

    if (
      !this.map ||
      !this.L
    ) {

      return;

    }


    /*
     * Remove existing markers.
     */

    this.markers.forEach(
      marker => {

        marker.remove();

      }
    );


    this.markers = [];


    /*
     * Create marker for every flight.
     */

    this.flights.forEach(
      flight => {

        /*
         * Create custom icon.
         */

        const markerIcon =
          this.createFlightIcon(
            flight
          );


        /*
         * Create marker.
         */

        const marker =
          this.L!.marker(
            [
              flight.currentPosition.lat,
              flight.currentPosition.lng
            ],
            {
              icon: markerIcon
            }
          );


        /*
         * Tooltip.
         */

        marker.bindTooltip(

          `
            <div class="flight-tooltip">

              <strong>
                ${flight.flightNumber}
              </strong>

              <br>

              ${flight.callsign}

              <br>

              ${flight.origin.code}
              →
              ${flight.destination.code}

            </div>
          `,

          {
            direction: 'top',

            offset: [
              0,
              -15
            ]
          }

        );


        /*
         * Marker click.
         */

        marker.on(
          'click',
          () => {

            /*
             * Send selected flight
             * to parent DashboardComponent.
             */

            this.flightSelected.emit(
              flight
            );


            /*
             * Center map and draw route.
             */

            this.focusFlight(
              flight
            );

          }
        );


        /*
         * Add marker to map.
         */

        marker.addTo(
          this.map
        );


        /*
         * Save marker reference.
         */

        this.markers.push(
          marker
        );

      }
    );

  }


  // =====================================================
  // CREATE FLIGHT ICON
  // =====================================================

  private createFlightIcon(
    flight: Flight
  ): Leaflet.DivIcon {

    if (!this.L) {

      throw new Error(
        'Leaflet has not been initialized.'
      );

    }


    /*
     * Convert status to CSS class.
     *
     * Active    -> active
     * Delayed   -> delayed
     * Arrived   -> arrived
     * Scheduled -> scheduled
     */

    const statusClass =
      flight.status.toLowerCase();


    return this.L.divIcon({

      className: '',

      html: `

        <div
          class="flight-marker ${statusClass}"
          title="${flight.flightNumber}"
        >

          <span>
            ✈
          </span>

        </div>

      `,

      iconSize: [
        34,
        34
      ],

      iconAnchor: [
        17,
        17
      ]

    });

  }


  // =====================================================
  // FOCUS SELECTED FLIGHT
  // =====================================================

  private focusFlight(
    flight: Flight
  ): void {

    if (!this.map) {
      return;
    }


    /*
     * Move map to aircraft.
     */

    this.map.flyTo(

      [
        flight.currentPosition.lat,
        flight.currentPosition.lng
      ],

      5,

      {
        duration: 1
      }

    );


    /*
     * Draw route.
     */

    this.drawRoute(
      flight
    );

  }


  // =====================================================
  // RENDER SELECTED ROUTE
  // =====================================================

  private renderSelectedRoute(): void {

    /*
     * No selected flight.
     */

    if (!this.selectedFlight) {

      if (this.routeLine) {

        this.routeLine.remove();

        this.routeLine =
          undefined;

      }

      return;

    }


    /*
     * Draw selected flight route.
     */

    this.drawRoute(
      this.selectedFlight
    );

  }


  // =====================================================
  // DRAW FLIGHT ROUTE
  // =====================================================

  private drawRoute(
    flight: Flight
  ): void {

    if (
      !this.map ||
      !this.L
    ) {

      return;

    }


    /*
     * Remove previous route.
     */

    if (this.routeLine) {

      this.routeLine.remove();

      this.routeLine =
        undefined;

    }


    /*
     * Route:
     *
     * Origin
     *    ↓
     * Current aircraft position
     *    ↓
     * Destination
     */

    const coordinates:
      Leaflet.LatLngExpression[] = [

        [
          flight.origin.lat,
          flight.origin.lng
        ],

        [
          flight.currentPosition.lat,
          flight.currentPosition.lng
        ],

        [
          flight.destination.lat,
          flight.destination.lng
        ]

      ];


    /*
     * Create polyline.
     */

    this.routeLine =
      this.L.polyline(

        coordinates,

        {
          color: '#38bdf8',

          weight: 4,

          opacity: 0.9,

          dashArray: '10 8'

        }

      );


    /*
     * Add route to map.
     */

    this.routeLine.addTo(
      this.map
    );


    /*
     * Get route boundaries.
     */

    const bounds =
      this.routeLine.getBounds();


    /*
     * Fit map around complete route.
     */

    this.map.fitBounds(

      bounds,

      {
        padding: [
          50,
          50
        ],

        maxZoom: 5

      }

    );

  }


  // =====================================================
  // COMPONENT DESTROY
  // =====================================================

  ngOnDestroy(): void {

    /*
     * Remove map when component
     * is destroyed.
     */

    if (this.map) {

      this.map.remove();

    }


    /*
     * Clear references.
     */

    this.markers = [];

    this.routeLine =
      undefined;

    this.L =
      null;

    this.mapInitialized =
      false;

  }

}