import React, { useEffect, useState } from "react";
import customers from "../data/customers";
import items from "../data/items";
import ShowItems from "./ShowItems";
import * as XLSX from "xlsx";

const SalesOrder = () => {
  const [dept, setDept] = useState("");
  const initialState = "";
  const [name, setName] = useState(initialState);
  const [customerId, setCustomerId] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [po, setPo] = useState("");
  const [rem, setRem] = useState("");
  const [itemsArray, setItemsArray] = useState([
    {
      id: 1,
      itemId: "",
      itemName: "",
      itemFraction: "",
      qty: "",
      freeGoods: "",
      itemPrice: "",
      discount: "",
      amount: "",
    },
  ]);

  const showCode = (itemCode, index) => {
    items.forEach((key) => {
      if (key.code === itemCode.toUpperCase()) {
        const updatedItemsArray = [...itemsArray];
        updatedItemsArray[index].itemName = key.name;
        updatedItemsArray[index].itemFraction = key.fraction;
        updatedItemsArray[index].itemPrice = key.price;
        setItemsArray(updatedItemsArray);
      }
    });
  };

  const showName = () => {
    let customerCode = document.querySelector("#customerCode").value;
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
      {
        id: newId,
        itemId: "",
        itemName: "",
        itemFraction: "",
        qty: "",
        freeGoods: "",
        itemPrice: "",
        discount: "",
        amount: "",
      },
    ]);
  };

  useEffect(() => {
    const updatedItemsArray = itemsArray.map((item) => ({
      ...item,
      amount:
        item.qty * (item.itemPrice - (item.itemPrice * item.discount) / 100),
    }));

    setItemsArray(updatedItemsArray);
  }, [itemsArray]);

  const totalAmount = itemsArray.reduce(
    (total, item) => total + item.amount,
    0
  );

  const totalsStyle = { fontSize: "1.5rem", marginRight: "2rem" };

  const addCommas = (number) => {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };
  useEffect(() => {
    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    setCurrentDate(getCurrentDate);
  }, []);

  const handleDept = () => {
    setDept(document.querySelector("#dept").value);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Order Date": currentDate,
        "Delivery Date": deliveryDate,
        "P.O.": po,
        "Customer Code": customerId,
        "Customer Name": name,
        Remarks: rem,
      },
      ...itemsArray.map((item) => ({
        "Item Code": item.itemId,
        Pack: item.itemFraction,
        Quantity: item.qty,
        "Free Goods": item.freeGoods,
        "Unit Price": item.itemPrice,
        Discount: item.discount,
      })),
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Order");
    XLSX.writeFile(wb, "sales_order.xlsx");
  };

  return (
    <div className="container-fluid">
      <form style={{ padding: "1rem" }}>
        <div className="header">
          <h1>Alowaid Trading Est.</h1>
          <h2>Sales Order</h2>
          <hr />
        </div>
        <div className="d-flex">
          <div className="col-6 oneUnit">
            <h3>Order Date: &nbsp;</h3>
            <input type="date" value={currentDate} />
          </div>
          <div className="col-5 oneUnit">
            <h3>Delivery Date: &nbsp;</h3>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>
        </div>
        <div className="d-flex">
          <div className="col-6 oneUnit">
            <h3>P.O.: &nbsp;</h3>
            <input
              type="text"
              value={po}
              onChange={(e) => setPo(e.target.value)}
            />
          </div>
          <div className="col-5 oneUnit">
            <h3>Cust. Code: &nbsp;</h3>
            <input
              type="text"
              id="customerCode"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              onBlur={showName}
              required
            />
          </div>
        </div>
        <h3 style={{ padding: "1rem" }}>
          Customer Name: <i style={{ color: "blue" }}>{name}</i>
        </h3>
        <h3 className="oneUnit">
          Remarks:{" "}
          <input
            type="text"
            value={rem}
            onChange={(e) => setRem(e.target.value)}
          />
        </h3>
        <table class="table table-dark table-striped">
          <thead>
            <tr>
              <th colSpan={6}>
                <h2>Item Data</h2>
              </th>
            </tr>
            <tr>
              <th>
                کود <br />
                ItemCode
              </th>
              <th>
                حبہ <br />
                Pack
              </th>
              <th>
                مقدار <br />
                Quantity
              </th>
              <th>
                مجان <br />
                Free Goodsا
              </th>
              <th>
                سعر <br />
                Unit Price
              </th>
              <th>
                %دسکاونت <br />
                Disc.{" "}
              </th>
              {/* <th>Amount</th> */}
            </tr>
          </thead>
          <tbody>
            {itemsArray.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    onBlur={(e) => showCode(e.target.value, index)}
                    value={item.itemId}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "itemId", e.target.value)
                      )
                    }
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style={{ color: "blue" }}
                    value={item.itemFraction}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      setItemsArray(updateArray(index, "qty", e.target.value))
                    }
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.freeGoods}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "freeGoods", e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.itemPrice}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "itemPrice", e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "discount", e.target.value)
                      )
                    }
                  />
                </td>
                {/* <td>
                  <input
                    type='number'
                    value={item.amount}
                    readOnly
                  />
                </td> */}
              </tr>
            ))}
            <tr>
              <th colSpan={2}>
                کامل <br />
                Total
              </th>
              <th colSpan={2}>
                ویت <br />
                VAT
              </th>
              <th colSpan={2}>
                نیت <br />
                Net
              </th>
            </tr>
            <tr style={totalsStyle}>
              <td colSpan={2}>{addCommas(parseFloat(totalAmount))}</td>
              <td colSpan={2}>{addCommas(totalAmount * 0.15)}</td>
              <td colSpan={2}>
                {addCommas(parseFloat(totalAmount + totalAmount * 0.15))}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-between">
          <button onClick={addRow} className="btn btn-primary col-5">
            Add Row
          </button>
          <button onClick={exportToExcel} className="btn btn-success col-5">
            Export to Excel
          </button>
        </div>
      </form>
      <div>
        <input
          type="text"
          id="dept"
          value={dept}
          onChange={handleDept}
          className="oneUnit"
        />
        <ShowItems dept={dept} />
      </div>
    </div>
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
