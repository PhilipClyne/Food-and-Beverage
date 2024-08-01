import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTopping = () => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [fullName, setFullName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            const response = await axios.get('/categories');
            setCategories(response.data);
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const retailerId = 100;
            const newTopping = { code, name, fullName, categoryId, basePrice, retailerId };
            await axios.post('/toppings', newTopping);
            // Clear form or show success message
        } catch (error) {
            // Handle error
        }
    };
    useEffect(() => {
        fetchFormulas();
    }, []);

    const fetchFormulas = () => {
        axios.get('/toppings')
            .then(response => setFormulas(response.data))
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code"
                required
            />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
            />
            <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
            />
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="" disabled>Select Category</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.categoryName}</option>
                ))}
            </select>
            <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="Base Price"
                required
            />
            <button type="submit">Save Topping</button>
        </form>
    );
};

export default AddTopping;
