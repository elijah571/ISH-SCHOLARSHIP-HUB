import helmet from 'helmet';
import csurf from 'csurf';

export const setSecurityHeaders = helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
});

export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  },
});
