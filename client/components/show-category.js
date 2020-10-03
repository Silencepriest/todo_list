import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { Done, Work, Block, LockOpen, DeleteForever } from '@material-ui/icons'

import AddNewTask from './add-new-task'
import NameComponent from './name-component'
import FilterMenu from './filter-menu'

const URL = '' // for localhost use http://localhost:8090

async function sendRequest(payload) {
  switch (payload.task) {
    case 'get_category': {
      const { data } = await axios(`${URL}/api/v1/tasks/${payload.category}`)
      if (data.status) return false
      return data
    }
    case 'get_category_time': {
      const { data } = await axios(
        `${URL}/api/v1/tasks/${payload.category}/${payload.timeToDisplay}`
      )
      if (data.status) return false
      return data
    }
    case 'change_status': {
      const { data } = await axios.patch(
        `${URL}/api/v1/tasks/${payload.category}/${payload.id}`,
        payload.data
      )
      if (data.status) return false
      return data
    }
    case 'remove': {
      const { data } = await axios.delete(`${URL}/api/v1/tasks/${payload.category}/${payload.id}`)
      if (data.status) return false
      return data
    }
    case 'new': {
      const { data } = await axios.post(`${URL}/api/v1/tasks/${payload.category}`, payload.data)
      if (data.status) return false
      return data
    }
    default:
      return false
  }
}

function renderButtons(status, category, id, version, setVersion) {
  switch (status) {
    case 'new': {
      return (
        <button
          type="submit"
          onClick={async () => {
            await sendRequest({
              task: 'change_status',
              category: `${category}`,
              data: { status: 'in progress' },
              id
            })
            setVersion(version + 1)
          }}
        >
          <Work className="text-orange-900" />
        </button>
      )
    }
    case 'in progress': {
      return (
        <>
          <button
            type="submit"
            onClick={async () => {
              await sendRequest({
                task: 'change_status',
                category: `${category}`,
                data: { status: 'done' },
                id
              })
              setVersion(version + 1)
            }}
          >
            <Done className="text-green-900" />
          </button>
          <button
            type="submit"
            onClick={async () => {
              await sendRequest({
                task: 'change_status',
                category: `${category}`,
                data: { status: 'blocked' },
                id
              })
              setVersion(version + 1)
            }}
          >
            <Block className="text-red-700" />
          </button>
        </>
      )
    }
    case 'blocked': {
      return (
        <button
          type="submit"
          onClick={async () => {
            await sendRequest({
              task: 'change_status',
              category: `${category}`,
              data: { status: 'in progress' },
              id
            })
            setVersion(version + 1)
          }}
        >
          <LockOpen className="text-green-900" />
        </button>
      )
    }
    default: {
      return ''
    }
  }
}

const ShowCategory = () => {
  const [itemsList, setItemsList] = useState([])
  const [version, setVersion] = useState(0)
  const { categoryName, timeToDisplay } = useParams()
  useEffect(() => {
    async function getData(category) {
      let request
      if (timeToDisplay) {
        request = { task: 'get_category_time', category: `${category}`, timeToDisplay }
      } else {
        request = { task: 'get_category', category: `${category}` }
      }
      const data = await sendRequest(request)
      setItemsList(data)
    }
    getData(categoryName)
  }, [categoryName, timeToDisplay, version])

  return (
    <div className="h-screen bg-green-400">
      <div className="bg-green-400 flex">
        <Link to="/" className="justify-self-start m-2">
          <button
            className="bg-green-800 p-2 rounded-lg hover:bg-green-500 transition-all duration-500"
            type="submit"
          >
            Home
          </button>
        </Link>
        <h1 className="text-center text-3xl text-gray-700 pb-2 mx-auto">
          Now browsing category: {categoryName}
        </h1>
      </div>
      <FilterMenu categoryName={categoryName} timeToDisplay={timeToDisplay} />
      <AddNewTask
        sendRequest={sendRequest}
        version={version}
        setVersion={setVersion}
        categoryName={categoryName}
      />
      <div className="flex flex-wrap justify-center content-start w-screen">
        {itemsList ? (
          itemsList.map((item) => {
            return (
              <div key={item.taskId} className="m-4 w-1/5 p-2 rounded-lg bg-yellow-500">
                <NameComponent
                  title={item.title}
                  sendRequest={sendRequest}
                  category={categoryName}
                  id={item.taskId}
                  version={version}
                  setVersion={setVersion}
                />
                <p>Status: {item.status}</p>
                {renderButtons(item.status, categoryName, item.taskId, version, setVersion)}
                <button
                  type="submit"
                  onClick={async () => {
                    await sendRequest({
                      task: 'remove',
                      category: `${categoryName}`,
                      data: {},
                      id: item.taskId
                    })
                    setVersion(version + 1)
                  }}
                >
                  <DeleteForever />
                </button>
              </div>
            )
          })
        ) : (
          <p>Category not found</p>
        )}
      </div>
      <AddNewTask
        sendRequest={sendRequest}
        version={version}
        setVersion={setVersion}
        categoryName={categoryName}
      />
    </div>
  )
}
export default ShowCategory
