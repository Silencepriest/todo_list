import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const OpenNewCategory = () => {
  const [value, setValue] = useState('')
  const onTextInput = (e) => {
    const regExp = /^\w{1,}$/
    if (regExp.test(e) || e === '') setValue(e)
  }
  return (
    <div className="m-4 flex justify-center bg-green-400">
      <input
        className="mr-2 p-2 rounded-lg h-10"
        type="text"
        value={value}
        onChange={(e) => onTextInput(e.target.value)}
      />
      <Link to={`/${value}`}>
        <button
          className="rounded-lg p-2 bg-green-800 transition-all duration-500 hover:bg-green-600"
          type="submit"
        >
          Add new category
        </button>
      </Link>
    </div>
  )
}

export default OpenNewCategory
