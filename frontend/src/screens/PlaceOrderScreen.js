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
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>الشحن</h2>
              <p>
                <strong>العنوان:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city.name}{' '}
                {/*cart.shippingAddress.postalCode*/},{' '}
                {/*cart.shippingAddress.country*/}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                 <strong>رقم الموبايل: </strong>
                 {cart.shippingAddress.phoneNumber}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>طريقة الدفع</h2>
              <strong>الطريقة: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>وحدات الاوردر</h2>
              {cart.cartItems.length === 0 ? (
                <Message>حقيبتك فارغة</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price} = {item.qty * item.price} جم
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>           ملخص الاوردر</h2>
                <i><strong>التسليم المقدّر في خلال 1–3 ايام عمل.</strong></i>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col> <strong>الوحدات</strong></Col>
                  <Col> {cart.itemsPrice} جم</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col><strong>التوصيل</strong></Col>
                  <Col>{cart.shippingAddress.city.deliveryFees??'رسوم الشحن تحتسب عند الدفع'}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col><strong>الضريبة</strong></Col>
                  <Col>جم 0  {/*${cart.taxPrice}*/}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col><strong>الاجمالى</strong></Col>
                  <Col>جم{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  style={{backgroundColor:'brown'}}
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  تأكيد الاوردر
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
