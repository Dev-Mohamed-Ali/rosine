import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'  // ✅ Use useHistory instead of history
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'

const UserListScreen = () => {
  const dispatch = useDispatch()
  const history = useHistory() // ✅ Get history object

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList || {}

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin || {}

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete || {}

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.replace('/login')  // ✅ Use history.replace instead of push
    }
  }, [dispatch, history, successDelete, userInfo])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteUser(id))
    }
  }

  return (
<>
  <div className='d-flex justify-content-between align-items-center mb-4'>
    <h1 className='text-primary'>👥 إدارة المستخدمين</h1>
  </div>

  {loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <div className='table-responsive'>
        <Table striped bordered hover responsive className='table-sm shadow-sm align-middle'>
          <thead className='table-dark'>
            <tr className='text-center'>
              <th>ID</th>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>مسؤول</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className='text-center'>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <i className='fas fa-check-circle text-success' title='Admin'></i>
                    ) : (
                      <i className='fas fa-times-circle text-danger' title='Not Admin'></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant='outline-secondary' className='btn-sm me-2' title='تعديل'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='outline-danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(user._id)}
                      title='حذف المستخدم'
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  <Message variant='info'>لا يوجد مستخدمين حاليًا</Message>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  )}
</>

  )
}

export default UserListScreen
