import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  startWith
} from 'rxjs';

import { Flight } from '../../core/models/flight.model';

import {
  FlightService
} from '../../core/services/flight.service';

import {
  FlightMapComponent
} from '../flight-map/flight-map.component';

import {
  FlightDetailsComponent
} from '../flight-details/flight-details.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlightMapComponent,
    FlightDetailsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent
  implements OnInit {

  allFlights: Flight[] = [];

  filteredFlights: Flight[] = [];

  selectedFlight: Flight | null = null;

  filterForm!: FormGroup;

  origins: string[] = [];

  destinations: string[] = [];

  statuses = [
    'All',
    'Active',
    'Delayed',
    'Arrived',
    'Scheduled'
  ];

  constructor(
    private flightService: FlightService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.createFilterForm();

    this.loadFlights();

    this.subscribeToFilters();

    this.flightService.selectedFlight$
      .subscribe(flight => {
        this.selectedFlight = flight;
      });
  }

  private createFilterForm(): void {

    this.filterForm =
      this.fb.group({
        search: [''],
        status: ['All'],
        origin: ['All'],
        destination: ['All']
      });
  }


private loadFlights(): void {
  this.flightService.getFlights().subscribe({
    next: (flights) => {
      console.log('Flights loaded successfully:', flights);
      console.log('Total flight records:', flights.length);

      this.allFlights = flights;
      this.filteredFlights = [...flights];

      this.origins = this.getAirportCodes(flights, 'origin');
      this.destinations = this.getAirportCodes(flights, 'destination');

      this.applyFilters();
    },
    error: (error) => {
      console.error('Failed to load flights.json:', error);
      this.allFlights = [];
      this.filteredFlights = [];
    }
  });
}


  private subscribeToFilters(): void {

    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value),
        debounceTime(150),
        distinctUntilChanged(
          (a, b) =>
            JSON.stringify(a) ===
            JSON.stringify(b)
        )
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private applyFilters(): void {

    const {
      search,
      status,
      origin,
      destination
    } = this.filterForm.value;

    const searchValue =
      (search || '')
        .trim()
        .toLowerCase();

    this.filteredFlights =
      this.allFlights.filter(flight => {

        const matchesSearch =
          !searchValue ||
          flight.callsign
            .toLowerCase()
            .includes(searchValue) ||
          flight.flightNumber
            .toLowerCase()
            .includes(searchValue);

        const matchesStatus =
          status === 'All' ||
          flight.status === status;

        const matchesOrigin =
          origin === 'All' ||
          flight.origin.code === origin;

        const matchesDestination =
          destination === 'All' ||
          flight.destination.code === destination;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesOrigin &&
          matchesDestination
        );
      });
  }

  private getAirportCodes(
    flights: Flight[],
    type: 'origin' | 'destination'
  ): string[] {

    const codes =
      flights.map(
        flight => flight[type].code
      );

    return [...new Set(codes)].sort();
  }

  selectFlight(flight: Flight): void {

    this.selectedFlight = flight;

    this.flightService
      .selectFlight(flight);
  }

  get totalFlights(): number {
    return this.allFlights.length;
  }

  get activeFlights(): number {
    return this.allFlights.filter(
      flight => flight.status === 'Active'
    ).length;
  }

  get delayedFlights(): number {
    return this.allFlights.filter(
      flight => flight.status === 'Delayed'
    ).length;
  }

  get arrivedFlights(): number {
    return this.allFlights.filter(
      flight => flight.status === 'Arrived'
    ).length;
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      status: 'All',
      origin: 'All',
      destination: 'All'
    });
  }
}