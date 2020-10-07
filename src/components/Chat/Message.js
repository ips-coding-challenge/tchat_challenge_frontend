import React from 'react'
import { formatDistance, formatRelative } from 'date-fns'
import DOMPurify from 'dompurify'

const Message = ({ message }) => {
  const formatDate = (date) => {
    return formatRelative(new Date(date), new Date())
  }
  return (
    <div
      className={`flex mb-6 ${
        message.user.name === 'TheBot' ? 'bg-gray-800 rounded py-4' : ''
      }`}
    >
      <img className="w-10 h-10 rounded" src={message.user.avatar} />
      <div className="ml-6">
        <div className="text-mGray font-bold mb-2">
          {message.user.name}{' '}
          <span className="font-normal text-xs ml-6">
            {formatDate(message.createdAt)}
          </span>
        </div>
        <div
          className="text-mWhite font-normal text-sm break-all"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(message.content),
          }}
        ></div>
      </div>
    </div>
  )
}

export default Message
