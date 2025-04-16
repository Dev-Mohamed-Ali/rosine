import { App, Button, Col, Form, Input, InputNumber, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import API from '../../api/api';

function EditableFormCity() {
	const { cityId } = useParams();

	const [form] = Form.useForm();
  
	const app = App.useApp();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNeededData();
  }, []);

  const fetchNeededData = async () => {
    if (!cityId) {
      setIsLoading(false)
      return
    }

    try {
      const { data } = await API.get(`/api/city/${cityId}`);
      form.setFieldsValue(data.data);
    } catch (error) {
      app.message.error(error.message);
    } finally {
      setIsLoading(false)
    }
  };

	const onFinish = async (values) => {

    setIsLoading(true)

		try {
			if (cityId) {
				await API.put(`/api/city/${cityId}`, values);
			} else {
				await API.post('/api/city', values);
			}

      history.push('/admin/city');
		} catch (error) {
			app.message.error(error.message);
		} finally {
      setIsLoading(false)
    }
	};

	return (
		<Spin spinning={isLoading}>
      <Row justify='center'>
			<Col md={12}>
				<h1>{cityId ? 'Edit' : 'Create'} City</h1>
				<Form form={form} onFinish={onFinish} labelCol={{ span: 24 }}>
					<Form.Item
						label='Name'
						name='name'
						rules={[{ required: true, message: 'Please input your name!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Delivery Fees'
						name='deliveryFees'
						rules={[{ required: true, message: 'Please input your fees!' }]}
					>
						<InputNumber min={0} className='w-100' />
					</Form.Item>

					<Form.Item>
						<Button htmlType='submit' type='primary'>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
    </Spin>
	);
}

export default EditableFormCity;
