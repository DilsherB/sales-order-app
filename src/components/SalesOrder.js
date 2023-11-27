import React, { useEffect, useRef, useState } from "react";
import customers from "../data/customers";
import items from "../data/items";
import ShowItems from "./ShowItems";
import * as XLSX from "xlsx";
import arixlogo from "./images/arixlogo.jpg";
import dunilogo from "./images/dunilogo.png";
import srlogo from "./images/srlogo.jpg";
import rclogo from "./images/rclogo.jpg";
import {
  getCurrentDate,
  updateArray,
  addCommas,
} from "./salesOrderUtils";

const SalesOrder = () => {
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
      yourPrice: "",
      isPriceDiff: "",
      discount: "",
      amount: "",
    },
  ]);

  const showCode = (itemCode, index) => {
    items.forEach((item) => {
      if (item.code.toUpperCase() === itemCode.toUpperCase()) {
        const updatedItemsArray = [...itemsArray];
        updatedItemsArray[index].itemName = item.name;
        updatedItemsArray[index].itemFraction = item.fraction;
        updatedItemsArray[index].itemPrice = item.price;
        setItemsArray(updatedItemsArray);
      }
    });
  };

  const showName = () => {
    let customerCode = document.querySelector("#customerCode").value;
    customers.forEach((customer) => {
      if (customer.code === customerCode) {
        setName(customer.name);
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
        yourPrice: "",
        isPriceDiff: "",
        discount: "",
        amount: "",
      },
    ]);
  };

  const prevItemsArray = useRef(itemsArray); // useRef to track the previous state of itemsArray
  useEffect(() => {
    const updatedItemsArray = itemsArray.map((item) => ({
      ...item,
      amount:
        item.qty * (item.yourPrice - (item.yourPrice * item.discount) / 100),
    }));

    // Check if there are any changes in the itemsArray before updating the state
    if (
      updatedItemsArray.length !== prevItemsArray.current.length ||
      updatedItemsArray.some(
        (item, index) =>
          JSON.stringify(item) !== JSON.stringify(prevItemsArray.current[index])
      )
    ) {
      setItemsArray(updatedItemsArray);
      prevItemsArray.current = updatedItemsArray; // Update the reference to the current state
    }
  }, [itemsArray]);

  const priceDiff = () => {
    const updatedItemsArray = itemsArray.map((item) => ({
      ...item,
      isPriceDiff: 
        item.yourPrice > item.itemPrice ? "**" : item.yourPrice < item.itemPrice ? "*" : "",
    }));
    setItemsArray(updatedItemsArray);
  };

  const totalAmount = itemsArray.reduce(
    (total, item) => total + item.amount,
    0
  );
        /* moved to SalesOrderUtils.js */
  // const addCommas = (number) => {
  //   return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  // };
          
  useEffect(() => {
        /* moved to SalesOrderUtils.js */
  // const getCurrentDate = () => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = (today.getMonth() + 1).toString().padStart(2, "0");
  //   const day = today.getDate().toString().padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };
    setCurrentDate(getCurrentDate);
  }, []);

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
        "Your Price": item.yourPrice,
        "Price Diff": item.isPriceDiff,
        Discount: item.discount,
      })),
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Order");
    XLSX.writeFile(wb, "sales_order.xlsx");
  };

  const [activeComponent, setActiveComponent] = useState(null);

  const handleShowComponent = (component) => {
    setActiveComponent((prev) => (prev === component ? null : component));
  };

  // Arix
  const showArix = activeComponent === "arix";
  const handleShowArix = () => handleShowComponent("arix");

  // Duni
  const showDuni = activeComponent === "duni";
  const handleShowDuni = () => handleShowComponent("duni");

  // SilkRoute
  const silkRoute = activeComponent === "silkRoute";
  const handleShowSilkRoute = () => handleShowComponent("silkRoute");

  // RoyalCotton
  const royalCotton = activeComponent === "royalCotton";
  const handleShowRoyalCotton = () => handleShowComponent("royalCotton");

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
            <input type="date" value={currentDate} readOnly />
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
        <table className="table table-info table-striped">
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
              <th hidden>
                سعر <br />
                Unit Price
              </th>
              <th>
                سعر <br />
                Your Price
              </th>
              <th hidden>
                * <br />
                Price Diff
              </th>
              <th>
                %دسکاونت <br />
                Disc.{" "}
              </th>
              <th hidden>Amount</th>
            </tr>
          </thead>
          <tbody>
            {itemsArray.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    id="itemCode"
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
                <td hidden>
                  <input
                    type="number"
                    id="itemPrice"
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
                    value={item.yourPrice}
                    onChange={(e) =>
                      setItemsArray(
                        updateArray(index, "yourPrice", e.target.value)
                      )
                    }
                    onBlur={priceDiff}
                  />
                </td>
                <td hidden>
                  <input
                    type="text"
                    style={{ color: "blue" }}
                    value={item.isPriceDiff}
                    readOnly
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
                <td hidden>
                  <input
                    type='number'
                    value={item.amount}
                    readOnly
                  />
                </td>
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
            <tr>
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
      <h1 className="text-center mt-5">Items information</h1>
      <div className="container-fluid d-flex justify-content-around mb-2">
        <img src={arixlogo} alt="ARIX" onClick={handleShowArix} />
        <img src={dunilogo} alt="DUNI" onClick={handleShowDuni} />
        <img src={srlogo} alt="Silk Route" onClick={handleShowSilkRoute} />
        <img src={rclogo} alt="Royal Cotton" onClick={handleShowRoyalCotton} />
      </div>
      {showArix && <ShowItems dept={"ax"} />}
      {showDuni && <ShowItems dept={"dn"} />}
      {silkRoute && <ShowItems dept={"sr"} />}
      {royalCotton && <ShowItems dept={"rc"} />}
    </div>
  );
};

      /* moved to SalesOrderUtils.js */
// function updateArray(index, key, value) {
//   return function (prevState) {
//     const updatedItemsArray = [...prevState];
//     updatedItemsArray[index][key] = value;
//     return updatedItemsArray;
//   };
// }

export default SalesOrder;
