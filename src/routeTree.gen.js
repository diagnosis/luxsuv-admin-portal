import { Route as rootRoute } from './routes/__root.jsx';
import { Route as AuthenticatedRoute } from './routes/_authenticated.jsx';
import { Route as LoginRoute } from './routes/login.jsx';
import { Route as AuthenticatedDashboardRoute } from './routes/_authenticated/dashboard.jsx';
import { Route as AuthenticatedUsersRoute } from './routes/_authenticated/users.jsx';
import { Route as AuthenticatedBookingsRoute } from './routes/_authenticated/bookings.jsx';
import { Route as AuthenticatedDriversRoute } from './routes/_authenticated/drivers.jsx';

const AuthenticatedRouteChildren = {
  AuthenticatedDashboardRoute,
  AuthenticatedUsersRoute,
  AuthenticatedBookingsRoute,
  AuthenticatedDriversRoute,
};

const rootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRoute.addChildren(AuthenticatedRouteChildren),
  LoginRoute,
};

export const routeTree = rootRoute.addChildren(rootRouteChildren);