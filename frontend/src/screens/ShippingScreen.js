import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';
import { App, Spin } from 'antd';
import API from '../api/api';

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const app = App.useApp();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber);
  //const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  //const [country, setCountry] = useState(shippingAddress.country)

  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNeededData();
  }, []);

  const fetchNeededData = async () => {
    setIsLoading(true);

    try {
      const citiesResponse = await API.get('/api/city');
      setCities(citiesResponse.data.data);

      setCity(citiesResponse.data.data[0]);
    } catch (error) {
      app.message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingAddress({
        address,
        city,
        phoneNumber /*postalCode, country */,
      })
    );
    history.push('/payment');
  };

  return (
    <Spin spinning={isLoading}>
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>الشحن</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='address'>
            <Form.Label>العنوان</Form.Label>
            <Form.Control
              type='text'
              placeholder='ادخل عنوان التوصيل'
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='city'>
            <Form.Label>مدينة</Form.Label>
            {/* <Form.Control
            type='text'
            placeholder='ادخل المدينة'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control> */}

            <Form.Control
              as='select'
              placeholder='ادخل المدينة'
              value={city?._id}
              required
              onChange={(e) => {
                const fullCity = cities.find((c) => c._id === e.target.value);
                setCity(fullCity);
              }}
            >
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='phoneNumber'>
            <Form.Label>رقم الموبايل</Form.Label>
            <Form.Control
              type='tel'
              placeholder='010 100 99 100'
              value={phoneNumber}
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/*
        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
*/}
          <Button
            type='submit'
            variant='primary'
            style={{ backgroundColor: 'brown' }}
          >
            الاستمرار
          </Button>
        </Form>
      </FormContainer>
    </Spin>
  );
};

export default ShippingScreen;
