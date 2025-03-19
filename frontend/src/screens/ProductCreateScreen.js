import axios from '../axiosConfig';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { createProduct } from '../actions/productActions';

const ProductCreateScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  const submitHandler = async (e) => {
    e.preventDefault();

    let imagePath = image;

    // Upload image only if a new file was selected
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      setUploading(true);

      try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data } = await axios.post('/api/upload', formData, config);
        imagePath = data.imagePath;
      } catch (error) {
        console.error('Image upload failed:', error);
      }

      setUploading(false);
    }

    // Dispatch product creation with uploaded image path
    dispatch(
      createProduct({
        name,
        price,
        image: imagePath,
        brand,
        category,
        description,
        countInStock,
      })
    );

    history.push('/admin/productlist');
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {loading && <Loader />}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Product Created Successfully!</Message>}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter image URL'
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={imageFile !== null} // Disable input if file is chosen
            />
            <Form.File
              id='image-file'
              label='Choose File'
              custom
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {uploading && <Loader />}
          </Form.Group>

          <Form.Group controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter stock quantity'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' variant='primary' disabled={uploading}>
            {uploading ? 'Uploading...' : 'Create Product'}
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
