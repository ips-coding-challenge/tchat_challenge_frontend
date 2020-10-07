import React, { useEffect, useCallback, useContext } from 'react'
import client from '../../client'
import { store, SET_CONNECTED_USERS } from '../../store/store'

const ConnectedUsers = () => {
  const {
    state: { user, connectedUsers, currentChannel },
    dispatch,
  } = useContext(store)

  const createBot = () => {
    return {
      _id: 'thebot',
      channelId: currentChannel._id.toString(),
      user: {
        avatar: 'https://www.freeiconspng.com/uploads/robot-icon-29.png',
        email: '',
        name: 'TheBot',
        _id: 'bot',
      },
      userId: 'bot',
    }
  }

  const fetchConnectedUsers = useCallback(async () => {
    try {
      // console.log(`Channel._id`, channel._id);
      const result = await client.service('connected-users').find({
        query: {
          channelId: currentChannel._id.toString(),
          userId: {
            $ne: user._id,
          },
        },
        paginate: false,
      })
      console.log(`Results`, result.data)
      const connectedUsers = result.data.concat(createBot())
      dispatch({ type: SET_CONNECTED_USERS, payload: connectedUsers })
    } catch (e) {
      console.log(`error while fetching connected user`, e)
    }
  }, [currentChannel])

  useEffect(() => {
    if (currentChannel) {
      fetchConnectedUsers()
      client.service('connected-users').on('created', () => {
        fetchConnectedUsers()
      })
      client.service('connected-users').on('removed', () => {
        fetchConnectedUsers()
      })
    }

    return () => {
      client.service('connected-users').removeListener('created')
      client.service('connected-users').removeListener('removed')
    }
  }, [currentChannel])

  return (
    <div className="h-auto">
      <h3 className="font-bold text-xl uppercase my-8">Members</h3>
      {currentChannel && (
        <ul>
          {connectedUsers.length > 0 &&
            connectedUsers.map((item) => {
              return (
                <li className="flex items-center mb-8" key={item._id}>
                  <img
                    className="w-10 h-10 rounded mr-6"
                    src={item.user.avatar}
                  />
                  {item.user.name}
                </li>
              )
            })}
        </ul>
      )}
    </div>
  )
}

export default ConnectedUsers
