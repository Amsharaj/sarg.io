import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Spreadsheet = () => {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState(['name', 'email', 'age']);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('An error occurred while fetching users:', error);
      }
  };

  const handleAddRow = async () => {
    const newUser = { name: '', email: '', age: null, additionalInfo: {} };
    try {
      const response = await axios.post('http://localhost:3001/users', newUser);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error('An error occurred while adding a new row:', error);
    }
  };

  const handleAddColumn = () => {
    const newColumn = prompt('Enter new column name');
    if (newColumn && !columns.includes(newColumn)) {
      setColumns([...columns, newColumn]);
    }
  };

  const handleDeleteRow = async (id) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      try {
        await axios.delete(`http://localhost:3001/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('An error occurred while deleting the row:', error);
      }
    }
  };

  const handleDeleteColumn = (column) => {
    if (window.confirm(`Are you sure you want to delete the column "${column}"?`)) {
      setColumns(columns.filter(col => col !== column));
    }
  };

  const handleCellChange = async (id, column, value) => {
    const user = users.find(user => user.id === id);
    if (column in user) {
      user[column] = value;
    } else {
      user.additionalInfo[column] = value;
    }
    try {
      await axios.put(`http://localhost:3001/users/${id}`, user);
      fetchUsers();
    } catch (error) {
      console.error('An error occurred while updating the cell:', error);
    }
  };

  const renderCell = (user, column) => {
    const value = column in user ? user[column] : user.additionalInfo?.[column] || '';
    return (
      <td key={column} onDoubleClick={() => handleCellEdit(user.id, column, value)}>
        {value}
      </td>
    );
  };

  const handleCellEdit = (id, column, value) => {
    const newValue = prompt(`Edit ${column}`, value);
    if (newValue !== null) {
      handleCellChange(id, column, newValue);
    }
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column}
                <button onClick={() => handleDeleteColumn(column)} className="ml-2 text-red-500">x</button>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button onClick={handleAddColumn} className="text-green-500">+</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {columns.map(column => renderCell(user, column))}
              <td>
                <button onClick={() => handleDeleteRow(user.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={columns.length}>
              <button onClick={handleAddRow} className="text-green-500">Add Row</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;
