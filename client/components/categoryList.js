import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import OpenNewCategory from './open-new-category'

function CategoryList() {
  const [list, setList] = useState([])
  useEffect(() => {
    axios(`/api/v1/categories`).then(({ data }) => {
      setList(data)
    })
  }, [])
  return (
    <div className="h-screen bg-green-400">
      <div className="text-center text-3xl text-gray-700">
        <h1>Category list</h1>
      </div>
      <div className="flex flex-wrap justify-center">
        {list.map((item) => (
          <Link key={item} to={`/${item}`}>
            <div className="m-2 p-4 rounded-lg bg-green-600 hover:bg-green-500 transition-all duration-500">
              <p>{item}</p>
            </div>
          </Link>
        ))}
      </div>
      <OpenNewCategory />
    </div>
  )
}

export default CategoryList
