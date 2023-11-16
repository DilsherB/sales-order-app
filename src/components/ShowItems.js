import React from 'react'
import items from '../data/items'

const ShowItems = ({dept}) => {
  const sortedItems = items.sort((a, b) => a.code.localeCompare(b.code))
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Fraction</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map(item => item.dept === dept &&
            <tr key={item.code}>
              <td>{item.code}</td>
              <td>{item.name}</td>
              <td>{item.fraction}</td>
              <td>{item.price}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ShowItems