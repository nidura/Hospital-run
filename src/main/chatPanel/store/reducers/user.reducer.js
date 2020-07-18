import * as Actions from '../actions';
import _ from 'lodash';

const userReducer = function (state = {isLoading: true}, action) {
    switch ( action.type )
    {
        case Actions.GET_USER_DATA:
        {
            return {...action.payload,
            isLoading: false};
        }
        case Actions.GET_CHAT:
        {
            return getUpdatedUser(state, action);
        }
        case Actions.RECEIVE_CHAT:
        {
            return updateUserMessage(state, action);
        }
        case Actions.SEND_MESSAGE:
        {
            return updateUserMessage(state, action);
        }
        default:
            return state;
    }
};

function updateUserMessage(state, action)
{
    let newUserData = _.merge({}, state);
    let userChatData = newUserData.chatList.find(_chat => _chat.contactId === action.contactId);
    if ( userChatData )
    {
        userChatData.lastMessageTime = action.message.time;
        newUserData.chatList = newUserData.chatList.map(_chat => _chat.contactId === action.contactId ? userChatData : _chat);
    }
    else
    {
        console.log('Error: chat not found.');
        // newUserData.chatList = [action.userChatData, ...newUserData.chatList];
    }
    return newUserData;
}

function getUpdatedUser(state, action)
{
    let newUserData = _.merge({}, state);
    if(newUserData.id === action.userChatData.contactId) {
        console.log('same User Chat');
    } else {
        let userChatData = newUserData.chatList.find(_chat => _chat.contactId === action.userChatData.contactId);
        if ( userChatData )
        {
            newUserData.chatList = newUserData.chatList.map(_chat => _chat.contactId === action.userChatData.contactId ? action.userChatData : _chat);
        }
        else
        {
            newUserData.chatList = [action.userChatData, ...newUserData.chatList];
        }
    }
    
    return newUserData;
}

export default userReducer;