import axios from '../axiosConfig'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {Form, Button, Card} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createProduct } from '../actions/productActions'
import {PRODUCT_CREATE_RESET} from "../constants/productConstants";

const ProductCreateScreen = ({ history }) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productCreate = useSelector((state) => state.productCreate)
  const { loading, error, success, product } = productCreate

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data.image)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProduct({
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }



useEffect(() => {
  if (success && product) {
    dispatch({ type: PRODUCT_CREATE_RESET });  // ✅ Reset product state
    history.push('/admin/productlist');  // ✅ Redirect to product list, NOT edit page
  }
}, [success, product, history, dispatch]);

  return (
<>
  <Link to='/admin/productlist' className='btn btn-outline-secondary my-3'>
    <i className='fas fa-arrow-left'></i> العودة إلى قائمة المنتجات
  </Link>
  <FormContainer>
    <Card className='shadow-sm p-4 bg-white rounded'>
      <h1 className='text-center text-success mb-4'> إنشاء منتج جديد</h1>

      {loading && <Loader />}
      {error && <Message variant='danger'>{error}</Message>}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>اسم المنتج</Form.Label>
          <Form.Control
            type='text'
            placeholder='أدخل اسم المنتج'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='price'>
          <Form.Label>السعر</Form.Label>
          <Form.Control
            type='number'
            placeholder='أدخل السعر'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='image'>
          <Form.Label>رابط الصورة</Form.Label>
          <Form.Control
            type='text'
            placeholder='أدخل رابط الصورة'
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>
          <Form.File
            id='image-file'
            label='اختيار صورة'
            custom
            onChange={uploadFileHandler}
          ></Form.File>
          {uploading && <Loader />}
          {image && (
            <div className='mt-3'>
              <img src={image} alt='Preview' style={{ width: '100%', maxWidth: '200px' }} />
            </div>
          )}
        </Form.Group>

        <Form.Group controlId='brand'>
          <Form.Label>العلامة التجارية</Form.Label>
          <Form.Control
            type='text'
            placeholder='أدخل العلامة التجارية'
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='category'>
          <Form.Label>الفئة</Form.Label>
          <Form.Control
            type='text'
            placeholder='أدخل الفئة'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='countInStock'>
          <Form.Label>الكمية في المخزون</Form.Label>
          <Form.Control
            type='number'
            placeholder='أدخل الكمية المتوفرة'
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='description'>
          <Form.Label>الوصف</Form.Label>
          <Form.Control
            type='text'
            placeholder='أدخل وصف المنتج'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='success' className='btn-block btn-lg rounded-pill'>
          إنشاء المنتج
        </Button>
      </Form>
    </Card>
  </FormContainer>
</>

  )
}

export default ProductCreateScreen
