import { Component, Input } from '@angular/core';
import { Flight } from '../../core/models/flight.model';
import { DatePipe, NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-details',
  imports: [DatePipe, NgClass, CommonModule],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.css',
  standalone:true
})
export class FlightDetailsComponent {

  @Input() flight:Flight|null=null;

  getStatusClass(status:string):string{
     return status.toLowerCase();
  }
}
