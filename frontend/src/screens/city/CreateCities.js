import React from 'react';
import { Link } from 'react-router-dom';
import EditableFormCity from '../../components/city/EditableForm.city';

function CreateCities() {
	return (
		<>
			<Link to='/admin/city' className='btn btn-light my-3'>
				Go Back
			</Link>

			<EditableFormCity />
		</>
	);
}

export default CreateCities;
