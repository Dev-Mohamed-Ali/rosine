import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders } from '../actions/orderActions'
import API from '../api/api'

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  const downloadExcel = async () => {
    try {
      const { data } = await API.get('/api/orders/export', { responseType: 'blob' })
      const blob = new Blob([data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'orders.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('خطأ في تحميل الملف')
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الأوردر؟')) {
      try {
        await API.delete(`/api/orders/${id}`)
        dispatch(listOrders())
      } catch (error) {
        alert('حدث خطأ أثناء الحذف')
      }
    }
  }

  const togglePaidStatus = async (id) => {
    if (window.confirm('تغيير حالة الدفع؟')) {
      try {
        await API.patch(`/api/orders/${id}/change-payment-status`)
        dispatch(listOrders())
      } catch (error) {
        alert('خطأ أثناء تحديث الدفع')
      }
    }
  }

  const toggleDeliverStatus = async (id) => {
    if (window.confirm('تغيير حالة التوصيل؟')) {
      try {
        await API.patch(`/api/orders/${id}/change-delivery-status`)
        dispatch(listOrders())
      } catch (error) {
        alert('خطأ أثناء تحديث التوصيل')
      }
    }
  }

  return (
    <>
      <Row className='align-items-center mb-3'>
        <Col>
          <h2>قائمة الطلبات</h2>
        </Col>
        <Col className='text-right'>
          <Button className='btn-success' onClick={downloadExcel}>
            <i className='fas fa-file-excel'></i> تحميل Excel
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead className='table-dark'>
            <tr>
              <th>رقم</th>
              <th>العميل</th>
              <th>الاسم</th>
              <th>الموبايل</th>
              <th>التاريخ</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.user?.name}</td>
                <td>{order.shippingAddress?.client_name}</td>
                <td>{order.shippingAddress?.phoneNumber}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice} جم</td>
                <td>
                  <div className='d-flex flex-column'>
                    <Badge
                      bg={order.isPaid ? 'success' : 'danger'}
                      className='mb-1'
                    >
                      {order.isPaid
                        ? `مدفوع (${order.paidAt.substring(0, 10)})`
                        : 'غير مدفوع'}
                    </Badge>
                    <Badge
                      bg={order.isDelivered ? 'primary' : 'warning'}
                    >
                      {order.isDelivered
                        ? `تم التوصيل (${order.deliveredAt.substring(0, 10)})`
                        : 'قيد التوصيل'}
                    </Badge>
                  </div>
                </td>
                <td className='d-flex flex-column gap-2'>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' size='sm'>
                      <i className='fas fa-eye'></i> تفاصيل
                    </Button>
                  </LinkContainer>

                  <Button
                    variant='outline-success'
                    size='sm'
                    onClick={() => togglePaidStatus(order._id)}
                  >
                    {order.isPaid ? 'إلغاء الدفع' : 'تأكيد الدفع'}
                  </Button>

                  <Button
                    variant='outline-primary'
                    size='sm'
                    onClick={() => toggleDeliverStatus(order._id)}
                  >
                    {order.isDelivered ? 'إلغاء التوصيل' : 'تأكيد التوصيل'}
                  </Button>

                  <Button
                    variant='outline-danger'
                    size='sm'
                    onClick={() => deleteHandler(order._id)}
                  >
                    <i className='fas fa-trash'></i> حذف
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen
