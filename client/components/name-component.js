import React, { useState } from 'react'
import { Edit } from '@material-ui/icons'

function NameComponent(props) {
  const [value, setValue] = useState(props.title)
  const [editMode, changeEditMode] = useState(false)
  return (
    <div className="flex">
      {editMode ? (
        <>
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
          <button
            className="ml-2"
            type="submit"
            onClick={async () => {
              await props.sendRequest({
                task: 'change_status',
                category: props.category,
                data: { title: value },
                id: props.id
              })
              props.setVersion(props.version + 1)
              changeEditMode(false)
            }}
          >
            <Edit className=" text-green-500" />
          </button>
        </>
      ) : (
        <>
          <p>Name: {props.title}</p>
          <button
            className="ml-2"
            type="submit"
            onClick={() => {
              changeEditMode(true)
            }}
          >
            <Edit className=" text-green-500" />
          </button>
        </>
      )}
    </div>
  )
}

export default NameComponent
