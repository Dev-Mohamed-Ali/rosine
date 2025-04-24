import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)

  if (!cart.shippingAddress.address) {
    history.push('/shipping')
  } else if (!cart.paymentMethod) {
    history.push('/payment')
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = 0 /*addDecimals(cart.itemsPrice > 100 ? 0 : 100)*/
  cart.taxPrice = 0 /*addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))*/
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
    }
    // eslint-disable-next-line
  }, [history, success])

  const placeOrderHandler = () => {
    console.log()
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    )
 
  }

  return (
   <>
  <CheckoutSteps step1 step2 step3 step4 />
  <Row>
    <Col md={8}>
      <Card className='mb-4 shadow-sm p-3 bg-white rounded'>
        <h3 className='text-primary'>📦 معلومات الشحن</h3>
        <p><strong>👤 اسم العميل:</strong> {cart.shippingAddress.client_name}</p>
        <p><strong>📍 العنوان:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city.name}</p>
        <p><strong>📞 رقم الموبايل:</strong> {cart.shippingAddress.phoneNumber}</p>
      </Card>

      <Card className='mb-4 shadow-sm p-3 bg-white rounded'>
        <h3 className='text-primary'>💳 طريقة الدفع</h3>
        <p><strong>الطريقة:</strong> {cart.paymentMethod}</p>
      </Card>

      <Card className='shadow-sm p-3 bg-white rounded'>
        <h3 className='text-primary'>🛍️ وحدات الاوردر</h3>
        {cart.cartItems.length === 0 ? (
          <Message>🧺 حقيبتك فارغة</Message>
        ) : (
          <ListGroup variant='flush'>
            {cart.cartItems.map((item, index) => (
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
        <h3 className='text-center mb-3'>🧾 ملخص الاوردر</h3>
        <p className='text-muted text-center'>
          🚚 التسليم المتوقع خلال <strong>1–3 أيام عمل</strong>
        </p>

        <ListGroup variant='flush'>
          <ListGroup.Item>
            <Row>
              <Col>🛒 الوحدات</Col>
              <Col>{cart.itemsPrice} جم</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>🚛 التوصيل</Col>
              <Col>{cart.shippingAddress.city.deliveryFees ?? 'يتم احتسابها لاحقًا'}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>💰 الضريبة</Col>
              <Col>جم 0</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>💵 الاجمالى</Col>
              <Col>
                جم{' '}
                {parseFloat(cart.totalPrice) +
                  (cart.shippingAddress.city.deliveryFees || 0)}
              </Col>
            </Row>
          </ListGroup.Item>

          {error && (
            <ListGroup.Item>
              <Message variant='danger'>{error}</Message>
            </ListGroup.Item>
          )}

          <ListGroup.Item className='text-center'>
            <Button
              type='button'
              className='btn btn-lg btn-block rounded-pill w-100'
              style={{ backgroundColor: '#884A39', border: 'none' }}
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              تأكيد الاوردر ✅
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
  </Row>
</>

  )
}

export default PlaceOrderScreen
