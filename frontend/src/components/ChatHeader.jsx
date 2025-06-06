import React from 'react'
import { userChatStore } from '../store/userChatStore'
import { userAuthStore } from '../store/userAuthStore';
import { X } from 'lucide-react';

const ChatHeader = () => {
  const {selectedUser,setselectedUser}=userChatStore();
  const {onlineUsers}=userAuthStore();
  return (
    <div className='p-2.5 border-b border-base-300'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {/* Avatar */}
          <div className='avatar'>
            <div className='size-10 rounded-full relative'>
              <img src={selectedUser.profilePic || './avatar.png'} alt={selectedUser.fullName}/>
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className='font-medium'>{selectedUser.fullName}</h3>
            <p className='text-sm text-base-content/70'>
              {onlineUsers.includes(selectedUser._id)?"Online":"Offline"}
            </p>
          </div>
        </div>

          {/* Close button */}
          <button onClick={()=>setselectedUser(null)}>
            <X/>
          </button>
      </div>

    </div>
  )
}

export default ChatHeader