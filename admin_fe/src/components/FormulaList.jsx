import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormulaForm from './AddFormula';

const FormulaList = () => {
  const [formulas, setFormulas] = useState([]);
  const [selectedFormula, setSelectedFormula] = useState(null);

  useEffect(() => {
    fetchFormulas();
  }, []);

  const fetchFormulas = () => {
    axios.get('/formulas')
      .then(response => setFormulas(response.data))
      .catch(error => console.error(error));
  };

  const handleEdit = (id) => {
    setSelectedFormula(id);
  };

  const handleDelete = (id) => {
    axios.delete(`/formulas/${id}`)
      .then(() => fetchFormulas())
      .catch(error => console.error(error));
  };

  const handleSave = () => {
    setSelectedFormula(null);
    fetchFormulas();
  };

  return (
    <div>
      <h2>Formulas</h2>
      <FormulaForm formulaId={selectedFormula} onSave={handleSave} />
      <ul>
        {formulas.map(formula => (
          <li key={formula._id}>
            {formula.name} - {formula.code}
            <button onClick={() => handleEdit(formula._id)}>Edit</button>
            <button onClick={() => handleDelete(formula._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormulaList;
