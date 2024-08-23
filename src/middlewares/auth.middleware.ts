import passport from 'passport';
import { UnauthorizedError } from 'routing-controllers';

import { UserRole } from '@common/constants';

const verifyCallback = (req, resolve, reject, roles?: UserRole[]) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new UnauthorizedError('Please authenticate'));
  }
  if (roles && !roles.includes(user?.role)) {
    return reject(new UnauthorizedError('Forbidden'));
  }
  req.user = user;

  resolve();
};

const auth = (roles?: UserRole[]) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, roles))(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};

export default auth;
