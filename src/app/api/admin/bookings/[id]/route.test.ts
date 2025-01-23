/**
 * @jest-environment node
 */

import { DELETE } from './route';
import { NextResponse } from 'next/server';

const mockDelete = jest.fn();

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: {
    booking: {
      delete: () => mockDelete()
    }
  }
}));

describe('DELETE /api/admin/bookings/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a booking successfully', async () => {
    const mockBookingId = 'test-booking-id';
    const mockRequest = new Request('http://localhost:3000');
    const mockParams = { params: { id: mockBookingId } };

    mockDelete.mockResolvedValueOnce({ id: mockBookingId });

    const response = await DELETE(mockRequest, mockParams);
    const data = await response.json();

    expect(response).toBeInstanceOf(NextResponse);
    expect(data).toEqual({ success: true });
    expect(mockDelete).toHaveBeenCalled();
  });

  it('should handle missing booking ID', async () => {
    const mockRequest = new Request('http://localhost:3000');
    const mockParams = { params: { id: undefined } };

    const response = await DELETE(mockRequest, mockParams);
    const data = await response.json();

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Booking ID is required'
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('should handle deletion error', async () => {
    const mockBookingId = 'test-booking-id';
    const mockRequest = new Request('http://localhost:3000');
    const mockParams = { params: { id: mockBookingId } };

    mockDelete.mockRejectedValueOnce(new Error('Database error'));

    const response = await DELETE(mockRequest, mockParams);
    const data = await response.json();

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: 'Failed to delete booking'
    });
    expect(mockDelete).toHaveBeenCalled();
  });
});
