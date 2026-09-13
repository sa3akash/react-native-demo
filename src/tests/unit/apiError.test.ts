import { AuthError, normalizeApiError, ValidationError } from '../../services/api/apiError';

describe('API Error Normalization', () => {
  it('should normalize 401 response into AuthError', () => {
    const errorObj = {
      response: {
        status: 401,
        data: { message: 'Token expired', code: 'UNAUTHORIZED', statusCode: 401 },
      },
    };

    const normalized = normalizeApiError(errorObj);
    expect(normalized).toBeInstanceOf(AuthError);
    expect(normalized.statusCode).toBe(401);
    expect(normalized.message).toBe('Token expired');
  });

  it('should normalize 422 validation error with details', () => {
    const errorObj = {
      response: {
        status: 422,
        data: {
          message: 'Invalid payload',
          code: 'VALIDATION_FAILED',
          statusCode: 422,
          details: [{ field: 'email', reason: 'Must be valid email' }],
        },
      },
    };

    const normalized = normalizeApiError(errorObj);
    expect(normalized).toBeInstanceOf(ValidationError);
    expect(normalized.statusCode).toBe(422);
    expect(normalized.details).toEqual([{ field: 'email', reason: 'Must be valid email' }]);
  });
});
