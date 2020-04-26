import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Form,
  Button,
  Col,
  Row,
} from 'react-bootstrap';

import './style.scss';
import { login, LoginParamsType } from '../../../shared/api';

type Props = {
  onSetToken: (value: any) => void
};

const Login: React.FC<Props> = ({ onSetToken }) => {
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    validationSchema: yup.object({
      username: yup.string().required(),
      password: yup.string().required(),
    }),
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values: LoginParamsType) => {
      setError('');
      setLoading(true);
      try {
        const { data, headers } = await login(values);
        if ('code' in data) {
          formik.setFieldValue('password', '');
          formik.setErrors({
            username: 'error',
            password: 'error',
          });

          setError(data.description);
          setLoading(false);
        } else {
          const token = headers['x-test-app-jwt-token'];
          onSetToken(token);
        }
      } catch (e) {
        setError('No connection');
        setLoading(false);
      }
    },
  });

  const haveErrors = formik.errors.username || formik.errors.password;
  const disabledButton = formik.values.password && formik.values.username && formik.isValid;
  return (
    <Container className="login-page__container">
      <Form
        className="login-page__form"
        onSubmit={formik.handleSubmit}
      >
        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Username
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              autoFocus
              isInvalid={(formik.touched.username && !!formik.errors.username) || !!error}
              disabled={isLoading}
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isValid={formik.touched.username && !formik.errors.username}
              placeholder="user name"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Password
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              disabled={isLoading}
              isInvalid={(formik.touched.password && !!formik.errors.password) || !!error}
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isValid={formik.touched.password && !formik.errors.password}
              placeholder="password"
            />
            {haveErrors && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col>
            <Button
              type="submit"
              disabled={!disabledButton || isLoading}
            >
              {isLoading ? 'Loading…' : 'Sign In'}
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </Container>
  );
};


export default Login;
