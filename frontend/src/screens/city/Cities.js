import { Col, Popconfirm, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import API from '../../api/api';

function Cities() {

  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCitiesAPI();
  }, []);

  const fetchCitiesAPI = async () => {
    setIsLoading(true);

    try {
      const { data } = await API.get('/api/city');
      setCities(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteConfirm = async (id) => {
    setIsLoading(true);

    try {
      await API.delete(`/api/city/${id}`);
      fetchCitiesAPI();
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Row align='middle' justify='space-between' >
        <Col>
          <h1>Cities</h1>
        </Col>

        <Col>
          <Link to='/admin/city/create' >
          <Button >
            <i className='fas fa-plus'></i> Create City
          </Button>
          </Link>
        </Col>
      </Row>

      {isLoading && <Loader />}

      {error && !isLoading && <Message variant='danger'>{error}</Message>}

      {!isLoading && !error && cities.length >= 0 && (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>NAME</th>
              <th>Delivery Fees</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {cities.length > 0 ? (
              cities.map((city) => (
                <tr key={city._id}>

                  <td>{city.name}</td>

                  <td>{city.deliveryFees}</td>

                  <td>
                    <LinkContainer to={`/admin/city/edit/${city._id}`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>

                    <Popconfirm
                      title='Delete the city'
                      description='Are you sure to delete?'
                      onConfirm={() => onDeleteConfirm(city._id)}
                    >
                      <Button variant='danger' className='btn-sm'>
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Popconfirm>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>
                  <Message variant='info'>No cities found</Message>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Cities;
