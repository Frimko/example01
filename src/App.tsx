import React, { useState, useCallback } from 'react';
import { Switch } from 'react-router';

import ProtectedRoute from './ui/components/protectedRoute';
import * as routes from './shared/routes';
import Login from './ui/pages/login';
import Dashboard from './ui/pages/dashboard';
import NotFound from './ui/pages/404/notFound';

type UseTokenHookType = (name: string) => [string, (value: any) => void, () => void];

const useToken: UseTokenHookType = (name) => {
  const [token, setValue] = useState(localStorage.getItem(name) || '');

  const setToken = useCallback((value: string) => {
    localStorage.setItem(name, value);
    setValue(value);
  }, [name]);

  const removeToken = useCallback(() => {
    localStorage.removeItem(name);
    setValue('');
  }, [name]);

  return [token, setToken, removeToken];
};

function App() {
  const [token, setToken, removeToken] = useToken('token');
  const isAuth = Boolean(token);

  return (
    <Switch>
      <ProtectedRoute
        exact
        path={routes.NOT_AUTHENTICATED}
        authenticated={isAuth}
        render={() => (<Login onSetToken={setToken} />)}
      />
      <ProtectedRoute
        path={routes.AUTHENTICATED}
        authenticated={isAuth}
        render={() => (<Dashboard token={token} logOut={removeToken} />)}
      />
      <ProtectedRoute
        path="*"
        authenticated={isAuth}
        component={NotFound}
      />
    </Switch>
  );
}

export default App;
