import City from '../models/city.modal.js';

// Get all cities
const getCities = async (req, res) => {
	try {
		const cities = await City.find();
		res.status(200).json({ data: cities });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Get a single city
const getCity = async (req, res) => {
	try {
		const city = await City.findById(req.params.id);
		if (!city) return res.status(404).json({ error: 'City not found' });
		res.status(200).json({ data: city });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Create a city
const createCity = async (req, res) => {
	try {
		const city = new City(req.body);
		await city.save();
		res.status(201).json({ data: city });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Update a city
const updateCity = async (req, res) => {
	try {
		const city = await City.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!city) return res.status(404).json({ error: 'City not found' });
		res.status(200).json({ data: city });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Delete a city
const deleteCity = async (req, res) => {
	try {
		const city = await City.findByIdAndDelete(req.params.id);
		if (!city) return res.status(404).json({ error: 'City not found' });
		res.status(200).json({ data: city });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export default { getCities, getCity, createCity, updateCity, deleteCity };
