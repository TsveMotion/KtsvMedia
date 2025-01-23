'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameDay, addDays, startOfWeek } from 'date-fns';

interface BookingResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Define days starting from Monday
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
  const [success, setSuccess] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!selectedDate) {
        setAvailableTimeSlots([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`/api/availability?date=${formattedDate}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch availability');
        }
        
        if (!Array.isArray(data.availableTimeSlots)) {
          throw new Error('Invalid response format');
        }
        
        setAvailableTimeSlots(data.availableTimeSlots);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setError('Failed to load available times. Please try again.');
        setAvailableTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
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

      setSuccess('Booking confirmed! Check your email for details.');

      setName('');
      setEmail('');
      setPhone('');
      setSelectedDate(null);
      setSelectedTime(null);

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

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  // Get calendar days starting from Monday
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const firstMonday = startOfWeek(start, { weekStartsOn: 1 });
    
    const days = [];
    let currentDay = firstMonday;
    
    while (currentDay <= end || days.length % 7 !== 0) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Schedule a Phone Consultation
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Choose a date and time that works best for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Calendar */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Calendar header */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ←
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                {getDaysInMonth().map((date) => {
                  const isSelected = selectedDate && isSameDay(selectedDate, date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const disabled = date < today;
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();

                  return (
                    <motion.button
                      key={date.toISOString()}
                      onClick={() => !disabled && setSelectedDate(date)}
                      className={`
                        relative bg-white p-4 text-center
                        ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                        ${isSelected ? 'text-white' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      `}
                      disabled={disabled}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="selected-day"
                          className="absolute inset-1 bg-blue-600 rounded-lg"
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

            {/* Time slots */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Available times for {format(selectedDate, 'EEEE, MMMM d')}
                </h3>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : availableTimeSlots.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No available time slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          p-2 rounded-lg text-sm font-medium
                          ${selectedTime === time
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Enter your details
            </h3>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                {success}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedDate || !selectedTime}
                  className={`
                    w-full py-3 px-4 rounded-lg text-white font-medium
                    ${isSubmitting || !selectedDate || !selectedTime
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                    }
                  `}
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
