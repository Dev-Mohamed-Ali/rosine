import {  Popconfirm} from 'antd';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import API from '../../api/api';
import { Row, Col } from 'react-bootstrap'

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
  <Row className='align-items-center mb-4 px-4'>
    <Col>
      <h2 className='text-primary'>🏙️ المدن</h2>
    </Col>
    <Col className='text-right'>
      <Link to='/admin/city/create'>
        <Button variant='warning'>
          <i className='fas fa-plus'></i> مدينة جديدة
        </Button>
      </Link>
    </Col>
  </Row>

  {isLoading && <Loader />}

  {error && !isLoading && <Message variant='danger'>{error}</Message>}

  {!isLoading && !error && (
    <div className='table-responsive'>
      <Table striped bordered hover responsive className='align-middle table-sm shadow-sm'>
        <thead className='table-dark'>
          <tr>
            <th>الاسم</th>
            <th>رسوم التوصيل</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {cities.length > 0 ? (
            cities.map((city) => (
              <tr key={city._id}>
                <td>{city.name}</td>
                <td>ج.م {city.deliveryFees}</td>
                <td>
                  <LinkContainer to={`/admin/city/edit/${city._id}`}>
                    <Button variant='outline-secondary' className='btn-sm me-2' title='تعديل'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Popconfirm
                    title='هل أنت متأكد من الحذف؟'
                    description='لن يمكنك التراجع بعد ذلك'
                    onConfirm={() => onDeleteConfirm(city._id)}
                    okText='نعم'
                    cancelText='لا'
                  >
                    <Button variant='outline-danger' className='btn-sm' title='حذف'>
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Popconfirm>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='3'>
                <Message variant='info'>لا توجد مدن حالياً</Message>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )}
</>

  );
}

export default Cities;
