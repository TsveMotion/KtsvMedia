'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface BookingResponse {
  success: boolean;
  message?: string;
  error?: string;
}

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
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Update available time slots when date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!selectedDate) return;
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`/api/availability?date=${formattedDate}`);
      const data = await response.json();
      setAvailableTimeSlots(data.availableTimeSlots);
    };
    checkAvailability();
  }, [selectedDate]);

  const handleBooking = async () => {
    if (!name || !email || !phone) {
      setError('Please fill in all fields');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
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
          name,
          email,
          phone,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
        }),
      });

      const data: BookingResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setSelectedDate(null);
      setSelectedTime(null);

      // Show success message or redirect
      alert('Booking confirmed! Check your email for details.');

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Schedule a Consultation
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Choose a date and time that works best for you.
          </p>
        </div>

        {/* Calendar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow">
            {/* Calendar header */}
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ←
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  →
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {days.map(day => (
                <div
                  key={day}
                  className="bg-white p-2 text-center text-xs font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
              {eachDayOfInterval({
                start: startOfMonth(currentDate),
                end: endOfMonth(currentDate),
              }).map((date) => {
                const isSelected = selectedDate?.getTime() === date.getTime();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const disabled = date < today;

                return (
                  <motion.button
                    key={date.toISOString()}
                    onClick={() => !disabled && setSelectedDate(date)}
                    className={`
                      bg-white
                      p-1 sm:p-2 text-xs sm:text-sm relative
                      ${isSelected ? 'text-white' : 'text-gray-900'}
                      ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                    `}
                    disabled={disabled}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="selected-day"
                        className="absolute inset-0 bg-blue-600 rounded-lg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                      />
                    )}
                    <span className={`relative z-10 ${isSelected ? 'text-white' : ''}`}>
                      {format(date, 'd')}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time slots */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Available times for {format(selectedDate, 'EEEE, MMMM d')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 px-1">
              {availableTimeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-3 rounded-lg text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                        : 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-gray-200 hover:ring-gray-300'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  className={`
                    w-full py-3 px-4 rounded-md text-white font-medium
                    ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
                    transition-colors duration-200
                  `}
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
