import { Request, Response, NextFunction } from 'express';
import { admin } from '../config/firebaseConfig';

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    console.warn('Auth Middleware: No Authorization header found.');
    return res.status(401).send({ message: 'Unauthorized: Authorization header missing.' });
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    console.warn('Auth Middleware: Authorization header format is not Bearer.');
    return res.status(401).send({ message: 'Unauthorized: Token format is not Bearer.' });
  }

  const idToken = authorizationHeader.split('Bearer ')[1];
  if (!idToken) {
    console.warn('Auth Middleware: Bearer token is empty.');
    return res.status(401).send({ message: 'Unauthorized: Bearer token is missing.' });
  }

  if (!admin.apps.length || !admin.auth) {
    console.error("Auth Middleware Error: Firebase Admin SDK or Auth service not initialized properly.");
    return res.status(500).send({ message: 'Internal Server Error: Authentication service configuration error.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = decodedToken;
    console.log('Auth Middleware: Token verified successfully for UID:', decodedToken.uid);

    next();
  } catch (error: any) {
    console.error('Auth Middleware: Error verifying auth token:', error.message);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).send({ message: 'Unauthorized: Token expired.' });
    }
    return res.status(403).send({ message: 'Forbidden: Invalid or malformed token.' });
  }
};
