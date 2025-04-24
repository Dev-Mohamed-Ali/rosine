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
  const [client_name, setClientName] = useState(shippingAddress.client_name);
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
        client_name,
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
    <div className='shipping-card p-4 shadow rounded bg-white'>
      <h2 className='text-center mb-4'>🛵 بيانات التوصيل</h2>

      <Form onSubmit={submitHandler} className='shipping-form'>

        <Form.Group controlId='client_name' className='mb-3'>
          <Form.Label>👤 اسم العميل</Form.Label>
          <Form.Control
            type='text'
            placeholder='مثال: أحمد محمد'
            value={client_name}
            minLength={4}
            required
            onChange={(e) => setClientName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='address' className='mb-3'>
          <Form.Label>📍 العنوان بالتفصيل</Form.Label>
          <Form.Control
            type='text'
            placeholder='شارع ٩، المعادي، القاهرة'
            value={address}
            required
            minLength={10}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='city' className='mb-3'>
          <Form.Label>🏙️ المدينة</Form.Label>
          <Form.Control
            as='select'
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

        <Form.Group controlId='phoneNumber' className='mb-4'>
          <Form.Label>📞 رقم الموبايل</Form.Label>
          <Form.Control
            type='tel'
            placeholder='01012345678'
            value={phoneNumber}
            minLength={10}
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Group>

        <div className='text-center'>
          <Button
            type='submit'
            className='btn-lg px-5 py-2 rounded-pill'
            style={{ backgroundColor: '#884A39', border: 'none' }}
          >
            الاستمرار <i className='fas fa-arrow-left ms-2'></i>
          </Button>
        </div>
      </Form>
    </div>
  </FormContainer>
</Spin>

    
  );
};

export default ShippingScreen;
