import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as XLSX from 'xlsx' // Import XLSX for Excel download
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  listProducts,
  deleteProduct,
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
    }
  }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    history.push('/admin/product/create')
  }

  // 🟢 Function to Download Table as Excel
const downloadExcel = () => {
  // Map through products and include the user’s name while excluding unwanted columns
  const filteredData = products.map(({ _id, brand, user, ...rest }) => ({
    ...rest,
    userName: user?.name || 'N/A' // Assuming `user` contains a `name` field
  }))

  // Convert to Excel sheet and export
  const worksheet = XLSX.utils.json_to_sheet(filteredData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
  XLSX.writeFile(workbook, 'products.xlsx') // Save file
}


  return (
<>
  <Row className='align-items-center mb-4'>
    <Col>
      <h1 className='text-primary'>📦 إدارة المنتجات</h1>
    </Col>
    <Col className='text-right'>
      <Button variant='outline-primary' className='me-2' onClick={createProductHandler}>
        <i className='fas fa-plus'></i> منتج جديد
      </Button>
      <Button variant='success' onClick={downloadExcel}>
        <i className='fas fa-download'></i> تصدير Excel
      </Button>
    </Col>
  </Row>

  {loadingDelete && <Loader />}
  {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
  {loadingCreate && <Loader />}
  {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

  {loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <div className='table-responsive'>
        <Table striped bordered hover className='align-middle table-sm shadow-sm'>
          <thead className='table-dark'>
            <tr>
              <th>ID</th>
              <th>الاسم</th>
              <th>السعر</th>
              <th>الفئة</th>
              <th>العلامة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>ج.م {product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='outline-secondary' className='btn-sm me-2' title='تعديل'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='outline-danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                    title='حذف'
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Paginate pages={pages} page={page} isAdmin={true} />
    </>
  )}
</>

  )
}

export default ProductListScreen
