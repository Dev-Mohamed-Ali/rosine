import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <Nav className='justify-content-center mb-4' style={{ fontSize: '18px' }}>
      
      {/* Step 1 (Shipping) */}
      <Nav.Item>
        <LinkContainer to='/shipping'>
          <Nav.Link
            className={`step ${step1 ? 'active' : 'disabled'}`}
            aria-disabled={!step1}
          >
            <i className={`fas fa-box ${step1 ? 'text-success' : 'text-muted'}`}></i> 
            الشحن
          </Nav.Link>
        </LinkContainer>
      </Nav.Item>

      {/* Step 2 (Payment) */}
      <Nav.Item>
        <LinkContainer to='/payment'>
          <Nav.Link
            className={`step ${step2 ? 'active' : 'disabled'}`}
            aria-disabled={!step2}
          >
            <i className={`fas fa-credit-card ${step2 ? 'text-success' : 'text-muted'}`}></i>
            الدفع
          </Nav.Link>
        </LinkContainer>
      </Nav.Item>

      {/* Step 3 (Place Order) */}
      <Nav.Item>
        <LinkContainer to='/placeorder'>
          <Nav.Link
            className={`step ${step3 ? 'active' : 'disabled'}`}
            aria-disabled={!step3}
          >
            <i className={`fas fa-check-circle ${step3 ? 'text-success' : 'text-muted'}`}></i>
            إنهاء الاوردر
          </Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
