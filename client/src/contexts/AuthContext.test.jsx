import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { onAuthStateChanged } from '../services/firebase';

// Mock firebase service
vi.mock('../services/firebase', () => ({
  auth: {},
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  resetPassword: vi.fn(),
  logOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe('AuthContext', () => {
  let unsubscribeMock;

  beforeEach(() => {
    vi.clearAllMocks();
    unsubscribeMock = vi.fn();
    onAuthStateChanged.mockReturnValue(unsubscribeMock);
    
    // Mock global fetch for sync/profile calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { name: 'Test User' } }),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const TestComponent = () => {
    // Consumer component to test context
    const { currentUser, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    return (
      <div>
        {currentUser ? (
          <span data-testid="user-email">{currentUser.email}</span>
        ) : (
          <span data-testid="no-user">No User</span>
        )}
      </div>
    );
  };

  it('shows loading state initially, then sets user when auth state changes', async () => {
    let authCallback;
    onAuthStateChanged.mockImplementation((auth, callback) => {
      authCallback = callback;
      return unsubscribeMock;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should render Loading first (since loading is initially true)
    expect(screen.getByText(/Loading NariSetu…/i)).toBeInTheDocument();

    // Trigger auth state change to logged in
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      getIdToken: vi.fn().mockResolvedValue('mock-token'),
    };

    await waitFor(() => {
      expect(authCallback).toBeDefined();
    });

    authCallback(mockUser);

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    // Check if fetch was called for sync and profile
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
