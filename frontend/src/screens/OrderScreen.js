import React, { useState, useEffect } from 'react'
import axios from '../axiosConfig';

import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  //const userLogin = useSelector((state) => state.userLogin)
  //const { userInfo } = userLogin

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
console.log(order.orderItems)
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    /*if (!userInfo) {
      history.push('/login')
    }*/

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

return loading ? (
  <Loader />
) : error ? (
  <Message variant='danger'>{error}</Message>
) : (
  <>
    <Card className='p-4 mb-4 shadow-sm'>
      <h2 style={{ color: 'green' }}>
        ✅ تم تسجيل اوردرك بنجاح برقم <strong>{order._id}</strong>
      </h2>
    </Card>

    <Row>
      <Col md={8}>
        <Card className='mb-4 shadow-sm p-3 bg-white rounded'>
          <h3 className='text-primary'>📍 تفاصيل العنوان</h3>
          <p><strong>👤 اسم العميل:</strong> {order.shippingAddress.client_name}</p>
          <p><strong>📌 العنوان:</strong> {order.shippingAddress.address}, {order.shippingAddress.city.name}</p>
          <p><strong>📞 رقم الموبايل:</strong> {order.shippingAddress.phoneNumber}</p>
          {order.isDelivered ? (
            <Message variant='success'>📦 تم التسليم في: {order.deliveredAt}</Message>
          ) : (
            <Message variant='danger'>🚫 لم يتم التسليم بعد</Message>
          )}
        </Card>

        <Card className='mb-4 shadow-sm p-3 bg-white rounded'>
          <h3 className='text-primary'>💳 طريقة الدفع</h3>
          <p><strong>الطريقة:</strong> {order.paymentMethod}</p>
          {order.isPaid ? (
            <Message variant='success'>💰 تم الدفع بتاريخ: {order.paidAt}</Message>
          ) : (
            <Message variant='danger'>💸 لم يتم الدفع بعد</Message>
          )}
        </Card>

        <Card className='shadow-sm p-3 bg-white rounded'>
          <h3 className='text-primary'>🛍️ وحدات الاوردر</h3>
          {order.orderItems.length === 0 ? (
            <Message>🧺 لا يوجد عناصر في الطلب</Message>
          ) : (
            <ListGroup variant='flush'>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row className='align-items-center'>
                    <Col xs={2} md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`} className='text-dark'>
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x {item.price} = <strong>{item.qty * item.price} جم</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>
      </Col>

      <Col md={4}>
        <Card className='shadow-sm p-4 bg-light rounded'>
          <h3 className='text-center mb-3'>🧾 ملخص الطلب</h3>

          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Row>
                <Col>الوحدات</Col>
                <Col>جم{order.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>رسوم الشحن</Col>
                <Col>جم{order.shippingAddress.city.deliveryFees}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>الاجمالى</Col>
                <Col>جم{parseFloat(order.totalPrice) + order.shippingAddress.city.deliveryFees}</Col>
              </Row>
            </ListGroup.Item>

            {loadingDeliver && <Loader />}

            {order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn btn-success btn-block rounded-pill'
                  onClick={deliverHandler}
                >
                  📦 تأكيد التسليم
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  </>
)

}

export default OrderScreen
