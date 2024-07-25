import { Component, OnInit } from '@angular/core';
import { Room, Booking, BookingserviceService } from '../bookingservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  rooms: Room[] = [];
  bookings: Booking[] = [];
  bookingForm: FormGroup;
  ckDep: boolean = false;
  isEdit: boolean = false;
  currentEditIndex: number | null = null;

  constructor(private bookingService: BookingserviceService, private fb: FormBuilder) { 
    this.bookingForm = this.fb.group({
      room: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.rooms = this.bookingService.getRooms();
    this.bookings = this.bookingService.getBookings();
  }

  bookRoom(): void {
    if (this.bookingForm.invalid) {
      this.ckDep = true;
      return;
    } else {
      this.bookingService.addBooking(this.bookingForm.value);
      this.bookings = this.bookingService.getBookings();
      Swal.fire({
        icon: 'success',
        title: 'Booking successful!',
        text: 'Your room has been booked successfully.',
        confirmButtonText: 'OK'
      });
      this.bookingForm.reset();
    }
  }

  editBooking(index: number): void {
    this.isEdit = true;
    this.currentEditIndex = index;
    const booking = this.bookings[index];
    this.bookingForm.setValue({
      room: booking.room,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      title: booking.title
    });
  }

  updateBooking(): void {
    if (this.bookingForm.invalid) {
      this.ckDep = true;
      return;
    } else {
      if (this.currentEditIndex !== null) {
        this.bookingService.updateBooking(this.currentEditIndex, this.bookingForm.value);
        this.bookings = this.bookingService.getBookings();
        Swal.fire({
          icon: 'success',
          title: 'Update successful!',
          text: 'Your booking has been updated successfully.',
          confirmButtonText: 'OK'
        });
        this.bookingForm.reset();
        this.isEdit = false;
        this.currentEditIndex = null;
      }
    }
  }

  deleteBooking(index: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingService.deleteBooking(index);
        this.bookings = this.bookingService.getBookings();
        Swal.fire(
          'Deleted!',
          'Your booking has been deleted.',
          'success'
        );
      }
    });
  }
}
