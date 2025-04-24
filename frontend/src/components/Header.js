import React from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

const Header = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect className='py-3'>
        <Container>
          {/* Logo + Brand */}
          <LinkContainer to='/'>
            <Navbar.Brand className='d-flex align-items-center gap-2'>
              <img
                src='/rosine-logo.jpg'
                alt=''
                width='50'
                height='50'
                className='rounded-circle'
              />
              <span className='fw-bold fs-4 text-warning'>Rosine</span>
            </Navbar.Brand>
          </LinkContainer>

          {/* Toggle for mobile */}
          <Navbar.Toggle aria-controls='main-navbar' />
          <Navbar.Collapse id='main-navbar'>
            {/* Social Icons */}
            <Nav className='me-auto d-flex align-items-center gap-3 ms-lg-4'>
              <a href='tel:+201211000369' target='_blank' rel='noopener noreferrer' title='Call'>
                <img src='/callphone.gif' alt='Call' width='26' className='rounded-circle' />
              </a>
              <a href='https://www.facebook.com/profile.php?id=100091321721757&mibextid=ZbWKwL' target='_blank' rel='noopener noreferrer' title='Facebook'>
                <img src='/facebook.gif' alt='Facebook' width='26' className='rounded-circle' />
              </a>
              <a href='https://www.instagram.com/rosine.eg/?igsh=aXY1MGZ4MXVsejJ2#' target='_blank' rel='noopener noreferrer' title='Instagram'>
                <img src='/instgram.gif' alt='Instagram' width='28' className='rounded-circle' />
              </a>
              <a href='https://api.whatsapp.com/send/?phone=%2B201211000369&text&type=phone_number&app_absent=0' target='_blank' rel='noopener noreferrer' title='WhatsApp'>
                <img src='/whatsapp.gif' alt='WhatsApp' width='26' className='rounded-circle' />
              </a>
            </Nav>

            {/* Search box center-aligned */}
            <div className='mx-auto d-none d-lg-block' style={{ width: '40%' }}>
              <Route render={({ history }) => <SearchBox history={history} />} />
            </div>

            {/* Right-side Nav */}
            <Nav className='ms-auto align-items-center'>
              <LinkContainer to='/cart'>
                <Nav.Link className='text-light'>
                  <i className='fas fa-shopping-cart'></i> عربة التسوق
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='userDropdown' className='text-light'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>الملف الشخصي</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>تسجيل خروج</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className='text-light'>
                    <i className='fas fa-user'></i> تسجيل دخول
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='🛠️ Admin' id='adminmenu' className='text-light'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>المستخدمين</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>المنتجات</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>الطلبات</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/city'>
                    <NavDropdown.Item>المدن</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
