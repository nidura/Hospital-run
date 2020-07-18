import React, {Component} from 'react';

import {
    AppBar,
    Toolbar,
    Icon,
    IconButton,
    ClickAwayListener,
    Paper,
    Avatar,
    Typography,
    withStyles
} from '@material-ui/core';
import keycode from 'keycode';
import * as Actions from './store/actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ContactList from './ContactList';
import Chat from './Chat';
import classNames from 'classnames';
import openSocket from 'socket.io-client';
var socketConnection;
const styles = theme => ({
    root : {
        width                         : 70,
        maxWidth                      : 70,
        minWidth                      : 70,
        [theme.breakpoints.down('md')]: {
            width   : 0,
            maxWidth: 0,
            minWidth: 0
        }
    },
    panel: {
        position                      : 'absolute',
        width                         : 360,
        backgroundColor               : theme.palette.background.paper,
        boxShadow                     : theme.shadows[5],
        top                           : 0,
        height                        : '100%',
        minHeight                     : '100%',
        bottom                        : 0,
        right                         : 0,
        margin                        : 0,
        zIndex                        : 1000,
        transform                     : 'translate3d(290px,0,0)',
        overflow                      : 'hidden',
        [theme.breakpoints.down('md')]: {
            transform : 'translate3d(360px,0,0)',
            boxShadow : 'none',
            '&.opened': {
                boxShadow: theme.shadows[5]
            }
        },
        transition                    : theme.transitions.create(['transform'], {
            easing  : theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard
        }),
        '&.opened'                    : {
            transform: 'translateX(0)'
        }
    }
});

class ChatPanel extends Component {
    constructor(props) {
        super(props);
        // socketConnection = openSocket(window.chatServer);
        // socketConnection.emit('change_userId', {userId : props.user.userId});
    }

    componentDidMount()
    {
        // this.props.getContacts();
    }

    componentDidUpdate(prevProps)
    {
        if ( this.props.state !== prevProps.state )
        {
            if ( this.props.state )
            {
                document.addEventListener("keydown", this.handleDocumentKeyDown);
            }
            else
            {
                document.removeEventListener('keydown', this.handleDocumentKeyDown);
            }
        }
    }

    componentWillUnmount()
    {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }

    handleDocumentKeyDown = event => {
        if ( keycode(event) === 'esc' )
        {
            this.props.closeChatPanel();
        }
    };

    render()
    {
        const {classes, openChatPanel, closeChatPanel, contacts, selectedContactId, state, user, loading} = this.props;
        if(loading) {

        } else {
            
        }
        const selectedContact = contacts.find(_contact => _contact.id === selectedContactId);

        socketConnection.once("new_message", (data) => {
            console.log(JSON.stringify(data));
            let userId = data.userId;
            let contactId = data.contactId; 
            let response = data.message;
            let unread = data.unread;
            if(contactId === user.userId) {
                this.dispatchMessage (userId, unread, response, userId === selectedContactId);
            }

        })

        socketConnection.once("user_status", (data) => {
            console.log(JSON.stringify(data));
            let userId = data.userId;
            let status = data.status; 
            if(userId !== user.userId) {
                this.props.updateStatus (userId, status);
            }
        })

        return (
            <div className={classes.root}>
                <ClickAwayListener onClickAway={() => state && closeChatPanel()}>
                    <div className={classNames(classes.panel, {'opened': state}, "flex flex-col")}>
                        <AppBar position="static">
                            <Toolbar className="pl-12 pr-8">
                                <div className="flex flex-1 items-center">
                                    {(!state || !selectedContactId) && !loading && (
                                        <React.Fragment>
                                            <IconButton color="inherit" onClick={openChatPanel}>
                                                <Icon className="text-32">chat</Icon>
                                            </IconButton>
                                            {!selectedContactId && (
                                                <Typography className="ml-16 text-16" color="inherit">Team Chat</Typography>
                                            )}
                                        </React.Fragment>
                                    )}
                                    {state && selectedContact && !loading && (
                                        <React.Fragment>
                                            <Avatar className="ml-4" src={selectedContact.avatar}/>
                                            <Typography className="ml-16 text-16" color="inherit">{selectedContact.name}</Typography>
                                        </React.Fragment>
                                    )}
                                </div>
                                <IconButton onClick={closeChatPanel} color="inherit">
                                    <Icon>close</Icon>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <Paper className="flex flex-1 flex-row min-h-px">
                            {!loading && (<ContactList className="flex flex-no-shrink"/>)}
                            {!loading && (<Chat sendMessage={this.sendMessageToSocket} className="flex flex-1 z-10"/>)}
                        </Paper>
                    </div>
                </ClickAwayListener>
            </div>
        );
    }

    sendMessageToSocket = (messageText, chatId, userId, contactId) => {
        return new Promise((resolve) => { 
            const message = {
                'who'    : userId,
                'message': messageText,
                'time'   : new Date()
            };
            socketConnection.emit('new_message', {chatId : chatId, message: message, contactId:contactId});
            this.props.sendMessage(message, contactId);
            console.log('response: ' + JSON.stringify(message));
            resolve();
        });
    }

    dispatchMessage(contactId, unread, response, isSellected) 
    {
        console.log('response: ' + JSON.stringify(response));
        if(isSellected) {
            this.props.sendMessage(response, contactId);
        } else {
            this.props.receiveMessage(response, contactId, unread);
        }
    }

}


function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        // getContacts   : Actions.getContacts,
        openChatPanel : Actions.openChatPanel,
        closeChatPanel: Actions.closeChatPanel,
        sendMessage: Actions.sendMessage,
        getMessage: Actions.getMessage,
        updateStatus: Actions.updateUserStatus,
        receiveMessage: Actions.receiveMessage
    }, dispatch);
}

function mapStateToProps({chatPanel, auth})
{
    return {
        contacts         : chatPanel.contacts.entities,
        selectedContactId: chatPanel.contacts.selectedContactId,
        state            : chatPanel.state,
        loading : chatPanel.user.isLoading,
        user: auth.user
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatPanel));
