import React, { useState } from 'react'

const AddNewTask = (props) => {
  const [value, setValue] = useState('')
  return (
    <div className="m-4 flex justify-center bg-green-400">
      <input
        className="mr-2 p-2 rounded-lg"
        type="text"
        value={value}
        onInput={(e) => setValue(e.target.value)}
      />
      <button
        className="rounded-lg p-2 bg-green-800"
        type="submit"
        onClick={async () => {
          await props.sendRequest({
            task: 'new',
            category: `${props.categoryName}`,
            data: { status: 'new', title: value }
          })
          setValue('')
          props.setVersion(props.version + 1)
        }}
      >
        Add new task
      </button>
    </div>
  )
}

export default AddNewTask
