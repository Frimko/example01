import React from 'react';
import { Container } from 'react-bootstrap';

import './style.scss';

const NotFound = () => (
  <Container className="not-found-page__container">
    <div className="not-found-page__text">
      Page not found
    </div>
  </Container>
);

export default NotFound;
