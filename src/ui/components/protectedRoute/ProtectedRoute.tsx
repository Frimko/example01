import React from 'react';
import {
  Route, Redirect, RouteProps, matchPath,
} from 'react-router-dom';

import * as routes from '../../../shared/routes';

type Props = {
  authenticated: boolean,
  loading?: boolean,
} & RouteProps;


const ProtectedRoute: React.FC<Props> = ({
  authenticated,
  loading,
  component: Component,
  render,
  ...rest
}) => (
  <Route
    {...rest}
    render={(routerProps) => {
      if (loading) {
        return null;
      }

      if (matchPath(routerProps.location.pathname, { path: routes.AUTHENTICATED, exact: true }) && !authenticated) {
        return (
          <Redirect
            to={{
              pathname: routes.NOT_AUTHENTICATED,
              state: { from: routerProps.location },
            }}
          />
        );
      }

      if (matchPath(routerProps.location.pathname, { path: routes.NOT_AUTHENTICATED, exact: true }) && authenticated) {
        return (
          <Redirect
            to={{
              pathname: routes.AUTHENTICATED,
              state: { from: routerProps.location },
            }}
          />
        );
      }

      if (Component) {
        return <Component {...routerProps} />;
      }

      if (render) {
        return render(routerProps);
      }

      return null;
    }}
  />
);


export default ProtectedRoute;
