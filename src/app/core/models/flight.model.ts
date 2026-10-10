export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export type FlightStatus =
  | 'Active'
  | 'Delayed'
  | 'Arrived'
  | 'Scheduled';

export interface Flight {
  id: number;
  flightNumber: string;
  callsign: string;
  aircraftType: string;

  origin: Airport;
  destination: Airport;

  status: FlightStatus;

  estimatedDeparture: string;
  estimatedArrival: string;

  currentPosition: {
    lat: number;
    lng: number;
  };
}