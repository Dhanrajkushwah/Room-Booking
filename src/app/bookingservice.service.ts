import { Injectable } from '@angular/core';

export interface Room {
  name: string;
  available: number;
}

export interface Booking {
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingserviceService {
  private rooms: Room[] = [
    { name: 'Conference Room A', available: 10 },
    { name: 'Meeting Room B', available: 6 },
    { name: 'Board Room C', available: 20 }
  ];

  private bookings: Booking[] = [];

  getRooms(): Room[] {
    return this.rooms;
  }

  getBookings(): Booking[] {
    return this.bookings;
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
    this.updateRoomAvailability(booking.room, -1);
  }

  updateBooking(index: number, updatedBooking: Booking): void {
    const oldBooking = this.bookings[index];
    if (oldBooking.room !== updatedBooking.room) {
      this.updateRoomAvailability(oldBooking.room, 1);
      this.updateRoomAvailability(updatedBooking.room, -1);
    }
    this.bookings[index] = updatedBooking;
  }

  deleteBooking(index: number): void {
    const booking = this.bookings[index];
    this.bookings.splice(index, 1);
    this.updateRoomAvailability(booking.room, 1);
  }

  private updateRoomAvailability(roomName: string, change: number): void {
    const room = this.rooms.find(r => r.name === roomName);
    if (room) {
      room.available += change;
    }
  }
}
