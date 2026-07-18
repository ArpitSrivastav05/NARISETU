import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SchemeForm from './SchemeForm';

describe('SchemeForm', () => {
  it('renders correctly and calls onSubmit with form data', () => {
    const mockOnSubmit = vi.fn();
    render(<SchemeForm onSubmit={mockOnSubmit} loading={false} />);

    // Check if key fields are rendered
    expect(screen.getByLabelText(/State \/ UT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual Income \(₹\)/i)).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Annual Income \(₹\)/i), { target: { value: '50000' } });

    // Submit form
    fireEvent.submit(document.getElementById('eligibility-form'));

    // Assert onSubmit was called
    expect(mockOnSubmit).toHaveBeenCalled();
    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData.age).toBe(30);
    expect(submittedData.annual_income).toBe(50000);
  });
});
