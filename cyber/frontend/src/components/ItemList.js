import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/items/');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h2>Items</h2>
      <div className="items-grid">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <small>{new Date(item.created_at).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
