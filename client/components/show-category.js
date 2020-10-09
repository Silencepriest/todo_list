/* eslint-disable */
import React, { useEffect, useParams } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getData } from '../redux/reducers/category'

const ShowCategory = () => {
  //const { category } = useParams()
  const data = useSelector((store) => store.category.data)
  const dispatch = useDispatch()
  useEffect(() => {
     dispatch(getData('morning'))
  }, [])
  console.log(data)
// 
  return (
    <div>
      {data.map((item) => <p key={item.title}>{item.title}</p>)}
    </div>
  )
}
export default ShowCategory
