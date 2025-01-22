'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: string[] }>({});

  // Fetch existing bookings for the current month
  useEffect(() => {
    const fetchBookings = async () => {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      try {
        const response = await fetch('/api/bookings/availability?' + new URLSearchParams({
          start: startOfMonth.toISOString(),
          end: endOfMonth.toISOString(),
        }));
        
        if (!response.ok) throw new Error('Failed to fetch bookings');
        
        const data = await response.json();
        setExistingBookings(data.bookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, [currentDate]);

  // Fetch booked slots for the current month
  const fetchBookedSlots = async (start: Date, end: Date) => {
    try {
      const response = await fetch(
        `/api/bookings/availability?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      const data = await response.json();
      if (data.bookedSlots) {
        setBookedSlots(data.bookedSlots);
      }
    } catch (error) {
      console.error('Failed to fetch booked slots:', error);
    }
  };

  // Update booked slots when month changes
  useEffect(() => {
    if (selectedDate) {
      const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      fetchBookedSlots(start, end);
    }
  }, [selectedDate?.getMonth(), selectedDate?.getFullYear()]);

  // Check if a time slot is available
  const isTimeSlotAvailable = (date: Date, time: string) => {
    return !existingBookings.some(
      booking => 
        new Date(booking.bookingDate).toDateString() === date.toDateString() && 
        booking.bookingTime === time
    );
  };

  // Check if a slot is booked
  const isSlotBooked = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookedSlots[dateStr]?.includes(time);
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    // Add empty days for padding
    for (let i = 0; i < (startingDay === 0 ? 6 : startingDay - 1); i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getDaysInMonth(currentDate);
  const currentMonth = new Intl.DateTimeFormat('en-US', { 
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleBooking = async () => {
    if (!name || !email || !phone) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number (at least 8 digits)');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate?.toISOString(),
          time: selectedTime,
          name,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book consultation');
      }

      // Show success message
      alert('Booking confirmed! Check your email for confirmation details.');
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Discovery Call</h1>
        <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-y-2 sm:gap-x-2 text-gray-600">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            20 min
          </span>
          <span className="flex items-center text-center">
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Web conferencing details provided upon confirmation
          </span>
        </div>
        <div className="mt-4 text-sm text-gray-600 px-4">
          Can't find a suitable time? Please email us at{' '}
          <a href="mailto:hello@ktsv.media" className="text-blue-600 hover:underline">
            hello@ktsv.media
          </a>{' '}
          for additional availability!
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-8"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
          Schedule a Discovery Call
        </h2>

        {/* Calendar */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-7 gap-px text-center">
            {days.map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {monthDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="p-1 sm:p-2" />;
              }
              
              const isSelected = selectedDate?.getTime() === date.getTime();
              const disabled = isPast(date);
              
              return (
                <motion.button
                  key={date.getTime()}
                  whileHover={!disabled ? { scale: 1.05 } : {}}
                  whileTap={!disabled ? { scale: 0.95 } : {}}
                  onClick={() => !disabled && setSelectedDate(date)}
                  className={`
                    p-1 sm:p-2 text-xs sm:text-sm relative
                    ${isSelected ? 'text-white' : 'text-gray-900'}
                    ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                    ${isToday(date) ? 'font-bold' : ''}
                  `}
                  disabled={disabled}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selected-day"
                      className="absolute inset-0 bg-blue-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isSelected ? 'text-white' : ''}`}>
                    {date.getDate()}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Available times for {new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              }).format(selectedDate)}
            </h3>

            {/* Time slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 px-1">
              {timeSlots.map((time) => {
                const isBooked = selectedDate ? isSlotBooked(selectedDate, time) : false;
                return (
                  <button
                    key={time}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    className={`
                      py-3 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-in-out
                      ${
                        isBooked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTime === time
                          ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                          : 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-gray-200 hover:ring-gray-300'
                      }
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            {selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 sm:mt-8 space-y-4"
              >
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  Confirm your booking for {selectedTime}
                </h3>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={isSubmitting}
                    className={`
                      w-full py-2 px-4 rounded-lg text-white font-medium
                      transition-all duration-200 ease-in-out
                      ${
                        isSubmitting
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }
                    `}
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
