import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './Auth.css';

function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    // Stub: replace with real API call when backend is ready
    console.log('Password reset requested for:', email);
    setSubmitted(true);
    setEmail('');
  };

  return (
    <Container
      fluid
      className="auth-container d-flex align-items-center justify-content-center"
    >
      <Card className="auth-card shadow-lg border-0 rounded-4 p-4 p-md-5">
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock-fill fs-1 text-primary"></i>
        </div>

        <h2 className="auth-title">Forgot Password</h2>

        <p
          className="text-center mb-4"
          style={{ color: 'var(--text-muted)', fontSize: '15px' }}
        >
          Enter the email address linked to your account and we'll send you a
          reset link.
        </p>

        {submitted && (
          <Alert variant="success" className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            If an account exists for{' '}
            <strong>&nbsp;{email || 'that email'}</strong>, a reset link has
            been sent.
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i>
            {error}
          </Alert>
        )}

        {!submitted && (
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Floating className="mb-4">
              <Form.Control
                id="floatingResetEmail"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=" "
                required
                aria-label="Email address"
                className="auth-form-control"
              />
              <label htmlFor="floatingResetEmail" className="auth-form-label">
                Email address
              </label>
            </Form.Floating>

            <Button
              type="submit"
              variant="primary"
              className="auth-submit-btn"
              aria-label="Send password reset link"
            >
              <i className="bi bi-send-fill me-2"></i>
              Send Reset Link
            </Button>
          </Form>
        )}

        {onNavigate && (
          <div className="text-center mt-4">
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              style={{ color: 'var(--primary-blue)', fontSize: '14px' }}
              onClick={() => onNavigate('login')}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Login
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
}

export default ForgotPassword;
