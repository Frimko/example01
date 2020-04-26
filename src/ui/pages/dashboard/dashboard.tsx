import React, { useState } from 'react';
import {
  Container,
  Badge,
  Button,
  Alert,
} from 'react-bootstrap';
import { useMount, useUnmount } from 'react-use';
import dateFormat from 'dateformat';

import './style.scss';

import WebSocketClient from './webSocketClient';
import { subscribe } from '../../../shared/api';

type Props = {
  token: string,
  logOut: () => void,
};

const wsc = new WebSocketClient();
let timer: any;

const Dashboard: React.FC<Props> = ({ token, logOut }) => {
  const [connectActive, setConnectActive] = useState(false);
  const [message, setMessage] = useState(0);
  const [error, setError] = useState('');

  useMount(() => {
    wsc.onOpen = () => setConnectActive(true);
    wsc.onMessage = (event: MessageEvent) => {
      try {
        const mess = JSON.parse(event.data);
        setMessage(mess.server_time * 1000);

        clearTimeout(timer);
        timer = setTimeout(() => {
          // резко оборвали связь, если не получаем больше сообщений,
          // то корректно закрываем соединение и получаем новое
          wsc.close();
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          subApi();
        }, 1000);
        // eslint-disable-next-line no-empty
      } catch (e) {
      }
    };

    wsc.onError = () => setConnectActive(false);
    wsc.onClose = () => setConnectActive(false);
    const subApi = async () => {
      try {
        const { data } = await subscribe({ token });
        if ('code' in data) {
          setError(data.description);
        } else {
          wsc.open(data.url);
        }
      } catch (e) {
        setError('No connection');
        wsc.close();
      }
    };

    wsc.onConnectClose = () => subApi();
    subApi().then();
  });

  useUnmount(() => {
    if (timer) {
      clearTimeout(timer);
    }
    // @ts-ignore
    wsc.close();
  });

  return (
    <Container className="dashboard-page__container">
      <div className="dashboard-page__panel">
        {error
          ? (<Alert variant="danger">{error}</Alert>)
          : (
            <>
              <div>
                WebSocket:
                {' '}
                <Badge variant={connectActive ? 'success' : 'danger'}>
                  {connectActive ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <p>{dateFormat(message, 'dd.MM.yy HH:mm:ss')}</p>
            </>
          )}

        <Button variant="link" onClick={logOut}>Logout</Button>
      </div>
    </Container>
  );
};

export default Dashboard;
