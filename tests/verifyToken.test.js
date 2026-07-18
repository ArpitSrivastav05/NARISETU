const { verifyToken } = require('../middleware/verifyToken');
const { admin } = require('../config/firebase');

const mockVerifyIdToken = jest.fn();
jest.mock('../config/firebase', () => ({
  admin: {
    auth: () => ({
      verifyIdToken: mockVerifyIdToken
    })
  }
}));

describe('verifyToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header', async () => {
    await verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('should return 401 if token is invalid or expired', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));
    
    await verifyToken(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/invalid or expired/i) }));
  });

  it('should call next and set req.user if token is valid', async () => {
    req.headers.authorization = 'Bearer valid-token';
    mockVerifyIdToken.mockResolvedValue({
      uid: '123',
      email: 'test@example.com',
      name: 'Test User'
    });
    
    await verifyToken(req, res, next);
    
    expect(req.user).toBeDefined();
    expect(req.user.uid).toBe('123');
    expect(next).toHaveBeenCalled();
  });
});
