import React, {useState} from 'react';
import customers from '../data/customers';

const CustomerInfo = () => {
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');

  const showName = () => {
    let customerCode = document.querySelector('#customerCode').value;
    customers.forEach((key) => {
      if (key.code === customerCode) {
        setName(key.name);
      }
    });
  }

  return (
    <div>
      <h3>Cust. Code: &nbsp;</h3>
      <input type='text' id='customerCode' value={customerId} onChange={(e) => setCustomerId(e.target.value)} onBlur={showName} required />
      <h3>Customer Name: <i style={{color: 'blue'}}>{name}</i></h3>
    </div>
  );
};

export default CustomerInfo;
