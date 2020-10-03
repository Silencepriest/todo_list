import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

function FilterMenu(props) {
  const linkStyle = 'm-1 p-2 rounded-t-lg border-solid'
  return (
    <div className="flex bg-green-400">
      <Link
        className={classnames(linkStyle, {
          'bg-green-800': props.timeToDisplay,
          'hover:bg-green-500 transition-all duration-500': props.timeToDisplay,
          'bg-green-300': !props.timeToDisplay
        })}
        to={`/${props.categoryName}`}
      >
        Show all
      </Link>
      <Link
        className={classnames(linkStyle, {
          'bg-green-800': props.timeToDisplay !== 'day',
          'hover:bg-green-500 transition-all duration-500': props.timeToDisplay !== 'day',
          'bg-green-300': props.timeToDisplay === 'day'
        })}
        to={`/${props.categoryName}/day`}
      >
        Today
      </Link>
      <Link
        className={classnames(linkStyle, {
          'bg-green-800': props.timeToDisplay !== 'week',
          'hover:bg-green-500 transition-all duration-500': props.timeToDisplay !== 'week',
          'bg-green-300': props.timeToDisplay === 'week'
        })}
        to={`/${props.categoryName}/week`}
      >
        This week
      </Link>
      <Link
        className={classnames(linkStyle, {
          'bg-green-800': props.timeToDisplay !== 'month',
          'hover:bg-green-500 transition-all duration-500': props.timeToDisplay !== 'month',
          'bg-green-300': props.timeToDisplay === 'month'
        })}
        to={`/${props.categoryName}/month`}
      >
        This month
      </Link>
    </div>
  )
}

export default FilterMenu
