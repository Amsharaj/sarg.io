import React, { useState } from 'react';

const Spreadsheet = () => {
  const [rows, setRows] = useState([1, 2, 3, 4]);
  const [columns, setColumns] = useState(['A', 'B', 'C', 'D']);
  const [data, setData] = useState({});
  const [editing, setEditing] = useState(null); // Track the cell being edited
  const [activeCell, setActiveCell] = useState(null); // Track the active cell
  const [activeRow, setActiveRow] = useState(null); // Track the active row
  const [activeColumn, setActiveColumn] = useState(null); // Track the active column

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  const addColumn = () => {
    const lastColumn = columns[columns.length - 1];
      let nextColumn;
      if (lastColumn.length === 1) {
        if (lastColumn === 'Z') {
          nextColumn = 'AA';
        } else {
          const nextChar = String.fromCharCode(lastColumn.charCodeAt(0) + 1);
          nextColumn = nextChar;
        }
      } else {
        const lastChar = lastColumn.charAt(lastColumn.length - 1);
        let lastCharNum = lastChar.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        let lastCharPrefix = lastColumn.substring(0, lastColumn.length - 1);
  
        if (lastCharNum === 26) {
          lastCharNum = 1;
          const nextPrefixChar = String.fromCharCode(lastCharPrefix.charCodeAt(0) + 1);
          lastCharPrefix = nextPrefixChar;
        } else {
          lastCharNum++;
        }
  
        nextColumn = `${lastCharPrefix}${String.fromCharCode(lastCharNum + 'A'.charCodeAt(0) - 1)}`;
      }
    setColumns([...columns, nextColumn]);
  };

  const handleDoubleClick = (row, col) => {
    setEditing({ row, col });
    setActiveCell({ row, col });
    setActiveRow(row);
    setActiveColumn(col);
  };

  const handleClick = (row, col) => {
    setActiveCell({ row, col });
    setActiveRow(row);
    setActiveColumn(col);
  };

  const handleChange = (e, row, col) => {
    setData({ ...data, [`${row}${col}`]: e.target.value });
  };

  const handleBlur = () => {
    setEditing(null);
  };

  const deleteCell = () => {
    if (activeCell) {
      const newData = { ...data };
      delete newData[`${activeCell.row}${activeCell.col}`];
      setData(newData);
      setActiveCell(null);
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="mb-2">
        <button onClick={addRow} className="text-green-500 font-bold mr-4">+ Add Row</button>
        <button onClick={addColumn} className="text-blue-500 font-bold">+ Add Column</button>
        {activeCell && (
          <button onClick={deleteCell} className="text-red-500 font-bold ml-4">Delete Cell</button>
        )}
      </div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2"></th>
            {columns.map((col) => (
              <th key={col} className={`border border-gray-300 px-4 py-2 text-center ${activeColumn === col ? 'bg-blue-100' : ''}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <th className={`border border-gray-300 px-4 py-2 text-center ${activeRow === row ? 'bg-blue-100' : ''}`}>
                {row}
              </th>
              {columns.map((col) => (
                <td
                  key={col}
                  className={`border border-gray-300 px-4 py-2 text-center ${activeCell && activeCell.row === row && activeCell.col === col ? 'bg-blue-200' : ''}`}
                  onDoubleClick={() => handleDoubleClick(row, col)}
                  onClick={() => handleClick(row, col)}
                >
                  {editing && editing.row === row && editing.col === col ? (
                    <input
                      autoFocus
                      type="text"
                      value={data[`${row}${col}`] || ''}
                      onChange={(e) => handleChange(e, row, col)}
                      onBlur={handleBlur}
                      className="w-full h-full text-center"
                    />
                  ) : (
                    data[`${row}${col}`] || ''
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;

