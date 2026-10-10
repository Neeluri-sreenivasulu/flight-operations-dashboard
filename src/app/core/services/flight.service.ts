import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

import {
  Flight,
  FlightStatus
} from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private readonly dataUrl = '/assets/data/flights.json';

  private selectedFlightSubject =
    new BehaviorSubject<Flight | null>(null);

  selectedFlight$ =
    this.selectedFlightSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  getFlights(): Observable<Flight[]> {

    return this.http.get<Flight[]>(
      this.dataUrl
    );

  }

  getFlightById(
    id: number
  ): Observable<Flight | undefined> {

    return this.getFlights().pipe(

      map(flights =>
        flights.find(
          flight => flight.id === id
        )
      )

    );

  }

  selectFlight(
    flight: Flight
  ): void {

    this.selectedFlightSubject.next(
      flight
    );

  }

  clearSelectedFlight(): void {

    this.selectedFlightSubject.next(
      null
    );

  }

  getStatuses(): FlightStatus[] {

    return [
      'Active',
      'Delayed',
      'Arrived',
      'Scheduled'
    ];

  }

}