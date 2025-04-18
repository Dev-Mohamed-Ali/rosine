import { App as AntApp, ConfigProvider } from 'antd';
import AR_EG from 'antd/locale/ar_EG';
import EN_US from 'antd/locale/en_US';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import OrderListScreen from './screens/OrderListScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductCreateScreen from './screens/ProductCreateScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import UserEditScreen from './screens/UserEditScreen';
import UserListScreen from './screens/UserListScreen';
import Cities from './screens/city/Cities';
import CreateCities from './screens/city/CreateCities';
import UpdateCities from './screens/city/UpdateCities';
import { ANT_THEME } from './core/config';

const App = () => {
  const direction = 'ltr';

  return (
    <AntApp>
      <ConfigProvider
        direction={direction}
        locale={direction === 'rtl' ? AR_EG : EN_US}
        theme={ANT_THEME}
      >
        <Router>
          <Header />
          <main className='py-4'>
            <Container>
              <Route path='/order/:id' component={OrderScreen} />
              <Route path='/shipping' component={ShippingScreen} />
              <Route path='/payment' component={PaymentScreen} />
              <Route path='/placeorder' component={PlaceOrderScreen} />
              <Route path='/login' component={LoginScreen} />
              <Route path='/register' component={RegisterScreen} />
              <Route path='/profile' component={ProfileScreen} />
              <Route path='/product/:id' component={ProductScreen} />
              <Route path='/cart/:id?' component={CartScreen} />
              <Route path='/admin/userlist' component={UserListScreen} />
              <Route path='/admin/user/:id/edit' component={UserEditScreen} />
              <Route
                path='/admin/productlist'
                component={ProductListScreen}
                exact
              />
              <Route
                path='/admin/productlist/:pageNumber'
                component={ProductListScreen}
                exact
              />
              <Route
                path='/admin/product/:id/edit'
                component={ProductEditScreen}
              />
              <Route
                path='/admin/product/create'
                component={ProductCreateScreen}
                exact
              />
              <Route path='/admin/city' exact component={Cities} />
              <Route path='/admin/city/create' exact component={CreateCities} />
              <Route
                path='/admin/city/edit/:cityId'
                exact
                component={UpdateCities}
              />
              <Route path='/admin/orderlist' component={OrderListScreen} />
              <Route path='/search/:keyword' component={HomeScreen} exact />
              <Route path='/page/:pageNumber' component={HomeScreen} exact />
              <Route
                path='/search/:keyword/page/:pageNumber'
                component={HomeScreen}
                exact
              />
              <Route path='/' component={HomeScreen} exact />
            </Container>
          </main>
          <Footer />
        </Router>
      </ConfigProvider>
    </AntApp>
  );
};

export default App;
