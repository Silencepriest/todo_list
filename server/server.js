/* eslint-disable no-underscore-dangle */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import shortid from 'shortid'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const { readFile, stat, writeFile, readdir } = require('fs').promises

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

const isFileExists = async (category) => {
  const result = await stat(`${__dirname}/tasks/${category}.json`)
    .then(() => true)
    .catch(() => false)
  return result
}

const getData = async (category) => {
  const fileExists = await isFileExists(category)
  if (!fileExists) {
    return false
  }
  const content = await readFile(`${__dirname}/tasks/${category}.json`, { codepage: 'utf8' })
  const parsedContent = JSON.parse(content)
  // eslint-disable-next-line dot-notation
  const parsedContentNotDeleted = parsedContent.filter((item) => !item['_isDeleted'])
  return parsedContentNotDeleted
}

const parseContent = (content) => {
  const parsedContent = content.map((item) => {
    return {
      taskId: item.taskId,
      title: item.title,
      status: item.status
    }
  })
  return parsedContent
}

const DAY = 1000 * 60 * 60 * 24
const WEEK = 7 * 1000 * 60 * 60 * 24
const MONTH = 30 * 1000 * 60 * 60 * 24

const filterData = (content, how) => {
  const now = +new Date()
  switch (how) {
    case 'day': {
      return content.filter((item) => item._createdAt + DAY > now)
    }
    case 'week': {
      return content.filter((item) => item._createdAt + WEEK > now)
    }
    case 'month': {
      return content.filter((item) => item._createdAt + MONTH > now)
    }
    default: {
      return { status: 'error' }
    }
  }
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const data = await getData(category)
  if (!data) res.json({ status: 'error' })
  res.json(parseContent(data))
  return true
})

server.get('/api/v1/tasks/:category/:timestamp', async (req, res) => {
  const { category, timestamp } = req.params
  const data = await getData(category)
  if (!data) res.json({ status: 'error' })
  res.json(parseContent(filterData(data, timestamp)))
  return true
})

server.get('/api/v1/categories', async (req, res) => {
  let filesList = await readdir(`${__dirname}/tasks/`, { codepage: 'utf8' })
  const regExp = /\w{1,}/
  filesList = filesList.map((file) => file.match(regExp)[0])
  res.json(filesList)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const data = {
    taskId: shortid.generate(),
    title: req.body.title,
    status: 'new',
    _isDeleted: false,
    _createdAt: +new Date(),
    _deletedAt: null
  }
  const fileExists = await isFileExists(category)
  if (!fileExists) {
    await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify([data]), {
      codepage: 'utf8'
    })
    res.json({ status: 'success' })
    return
  }
  const oldData = await getData(category)
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify([...oldData, data]), {
    codepage: 'utf8'
  })
  res.json({ status: 'success' })
})

const checkExistance = (oldData, id) => {
  if (!oldData) {
    return -1
  }
  const itemIndex = oldData.findIndex((item) => item.taskId === id)
  if (itemIndex === -1) {
    return -1
  }
  return itemIndex
}

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const oldData = await getData(category)
  const itemIndex = checkExistance(oldData, id)
  if (itemIndex === -1) {
    res.json({ status: 'error', message: 'category not found' })
    return
  }
  const statusList = ['done', 'new', 'in progress', 'blocked']
  if (typeof req.body.status !== 'undefined') {
    if (statusList.findIndex((item) => item === req.body.status) === -1) {
      res.json({ status: 'error', message: 'incorrect status' })
      return
    }
  }
  oldData[itemIndex] = { ...oldData[itemIndex], ...req.body }
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(oldData), {
    codepage: 'utf8'
  })
  res.json({ status: 'success' })
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const oldData = await getData(category)
  const itemIndex = checkExistance(oldData, id)
  if (itemIndex === -1) {
    res.json({ status: 'error', message: 'category not found' })
    return
  }
  oldData[itemIndex] = { ...oldData[itemIndex], _isDeleted: true }
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(oldData), {
    codepage: 'utf8'
  })
  res.json({ status: 'success' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
