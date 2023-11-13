import React, { useEffect, useState } from 'react';
import customers from '../data/customers';
import items from '../data/items';

const SalesOrder = () => {
  const initialState = '';
  const [name, setName] = useState(initialState);
  const [customerId, setCustomerId] = useState('');
  const [itemsArray, setItemsArray] = useState([
    { id: 1, itemId: '', itemName: '', qty: '', price: '', amount: '' },
  ]);

  const showCode = (itemCode, index) => {
    items.forEach((key) => {
      if (key.code === itemCode.toUpperCase()) {
        const updatedItemsArray = [...itemsArray];
        updatedItemsArray[index].itemName = key.name;
        setItemsArray(updatedItemsArray);
      }
    });
  };

  const showName = () => {
    let customerCode = document.querySelector('#customerCode').value;
    customers.forEach((key) => {
      if (key.code === customerCode) {
        setName(key.name);
      }
    });
  };

  const addRow = () => {
    const newId = itemsArray.length + 1;
    setItemsArray([
      ...itemsArray,
      { id: newId, itemId: '', itemName: '', qty: '', price: '', amount: '' },
    ]);
  };

  useEffect(() => {
    const updatedItemsArray = itemsArray.map((item) => ({
      ...item,
      amount: item.qty * item.price,
    }));

    setItemsArray(updatedItemsArray);
  }, [itemsArray]);

  const totalAmount = itemsArray.reduce((total, item) => total + item.amount, 0);

  const totalsStyle = {fontSize: '1.5rem', marginRight: '2rem'}

  return (
    <>
      <form style={{ padding: '1rem' }}>
        <div className='header'>
          <h1>Alowaid Trading Est.</h1>
          <h2>Sales Order</h2>
          <hr />
        </div>
        <div className='customerData' style={{padding: '1rem'}}>
          <div style={{display: 'inline-flex'}}>
            <h3>Purchase Order #: </h3>
            <input type='text'/>
          </div>
          <div style={{display: 'inline-flex'}}>
            <h3>Customer Code: </h3>
            <input
              type='text'
              id='customerCode'
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              onBlur={showName} required
            />
          </div>
        </div>
          <h3>Customer Name: <i style={{color: 'blue'}}>{name}</i></h3>
          <table class="table table-dark table-striped">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {itemsArray.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    type='text'
                    onBlur={(e) => showCode(e.target.value, index)}
                    value={item.itemId}
                    onChange={(e) =>
                      setItemsArray(updateArray(index, 'itemId', e.target.value))
                    }
                    required
                  />
                </td>
                <td>
                  <input
                    type='text'
                    style={{ color: 'blue' }}
                    value={item.itemName}
                    disabled
                  />
                </td>
                <td>
                  <input
                    type='number'
                    value={item.qty}
                    onChange={(e) =>
                      setItemsArray(updateArray(index, 'qty', e.target.value))
                    }
                    required
                  />
                </td>
                <td>
                  <input
                    type='number'
                    value={item.price}
                    onChange={(e) =>
                      setItemsArray(updateArray(index, 'price', e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type='number'
                    value={item.amount}
                    onChange={(e) =>
                      setItemsArray(updateArray(index, 'amount', e.target.value))
                    }
                    disabled
                  />
                </td>
              </tr>
            ))}
            <tr style={totalsStyle}>
              <td colSpan='4'>Total Amount</td>
              <td>{parseFloat(totalAmount).toFixed(2)} SAR </td>
            </tr>
            <tr style={totalsStyle}>
              <td colSpan='4'>Total VAT</td>
              <td>{(totalAmount*0.15).toFixed(2)} SAR</td>
            </tr>
            <tr style={totalsStyle}>
              <td colSpan='4'>Net Including VAT</td>
              <td>{parseFloat(totalAmount+(totalAmount*0.15)).toFixed(2)} SAR</td>
            </tr>
          </tbody>
        </table>
        <button onClick={addRow} className='btn btn-primary btn-block'>Add Row</button>
      </form>
    </>
  );
};

function updateArray(index, key, value) {
  return function (prevState) {
    const updatedItemsArray = [...prevState];
    updatedItemsArray[index][key] = value;
    return updatedItemsArray;
  };
}

export default SalesOrder;