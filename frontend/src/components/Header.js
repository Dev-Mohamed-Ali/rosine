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
      <Navbar style={{backgroundColor: "gold"}}  expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
            <img src="/rosine-logo.jpg" alt="Rosine Logo" width="80" height="80" className="d-inline-block align-top rounded-circle" />
            </Navbar.Brand>
          </LinkContainer>
          <Nav.Link href="" target="_blank" rel="noopener noreferrer">
            <img src="/callphone.gif" alt="callphone" width="30" height="30" className="d-inline-block align-top rounded-circle" />   
          </Nav.Link>
          <Nav.Link href="https://www.facebook.com/profile.php?id=100091321721757&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
            <img src="/facebook.gif" alt="facebook" width="30" height="30" className="d-inline-block align-top rounded-circle" />
          </Nav.Link>
          <Nav.Link href="https://www.instagram.com/rosine.eg/?igsh=aXY1MGZ4MXVsejJ2#" target="_blank" rel="noopener noreferrer">
            <img src="/instgram.gif" alt="instgram" width="35" height="35" className="d-inline-block align-top rounded-circle" />  
          </Nav.Link>
          <Nav.Link href="https://api.whatsapp.com/send/?phone=%2B201211000369&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
            <img src="/whatsapp.gif" alt="whatsapp" width="30" height="30" className="d-inline-block align-top rounded-circle" />  
          </Nav.Link>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className='ml-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> عربة التسوق
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> تسجيل دخول
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/city'>
                    <NavDropdown.Item>Cities</NavDropdown.Item>
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
