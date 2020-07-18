import * as Actions from '../actions';
import _ from 'lodash';

const initialState = {
    entities         : [],
    selectedContactId: null
};

const contactsReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_CONTACTS:
        {
            console.log('contactsReducer called');
            return {
                ...state,
                entities: [...action.payload]
            };
        }
        case Actions.SET_SELECTED_CONTACT_ID:
        {
            return {
                ...state,
                selectedContactId: action.payload
            };
        }
        case Actions.UPDATE_USER_STATUS:
        {
            return updateUserStatus(state, action, );
        }
        case Actions.GET_CHAT:
        {
            return getUpdatedContact(state, action, 0);
        }
        case Actions.RECEIVE_CHAT:
        {
            return getUpdatedContact(state, action, action.unread);
        }
        case Actions.REMOVE_SELECTED_CONTACT_ID:
        {
            return {
                ...state,
                selectedContactId: null
            };
        }
        default:
        {
            return state;
        }
    }
};

function updateUserStatus(state, action)
{
    let newUserData = _.merge({}, state);
    let userData = newUserData.entities.find(_entity => _entity.id === action.contactId);
    if ( userData )
    {
        userData.status = action.status;
        newUserData.entities = newUserData.entities.map(_entity => _entity.id === action.contactId ? userData : _entity);
    }
    else
    {
        console.log('Error: contact not found.');
    }
    return newUserData;
}

function getUpdatedContact(state, action, unread)
{
    let newContactData = _.merge({}, state);
    let userContactData = newContactData.entities.find(_entity => _entity.id == action.contactId);
    if ( userContactData )
    {
        console.log('userContactData.val: ' + unread);
        if(unread !== 0) {
            userContactData.unread = unread;
        } else {
            userContactData.unread = null;
        }
        newContactData.entities = newContactData.entities.map(_entity => _entity.id == action.contactId ? userContactData : _entity);
    }
    else
    {
        console.log('Unknown contact');
    }
    return newContactData;
}

export default contactsReducer;