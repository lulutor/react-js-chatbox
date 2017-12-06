import React from 'react';
import Formulaire from './formulaire';
import Message from './messages';
import { firebaseApp, database } from '../database';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import * as fakeMessages from '../assets/fakemessages';

//css
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// Bootstrap components
import { Button, ButtonGroup } from 'react-bootstrap';

import '../animation.css';

class App extends React.Component {

    state = {
        messages: {},
        user: {
            uid: null,
            email: 'fake@email.com'
        }
    };

    componentWillMount() {
        firebase.auth().onAuthStateChanged( user => user ? this.onLoginDone( { user } ) : false );
    }

    componentDidUpdate() {
        this.scrollDownMessages();
    }

    componentDidMount() {
        this.scrollDownMessages();
    }

    scrollDownMessages () {
       // scroll down to the last message
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }

    isUser( email ) {
        return email === this.state.user.email;
    }

    addMessage( message ) {

        // copy texts
        const messages = { ...this.state.messages };

        // add a timestamp to create a unique message
        const timestamp = Date.now();
        messages[ `message-${ timestamp }` ] = message;

        // creates lists of messages to add to the state
        Object.keys( messages )
            // select messages from the end of the array to [the end of the array - maximum number f messages to save]
            .slice( 0, -( this.props.maxMessages ) )
            // for each message to delete, define null will delete it from the databse
            .map( key => messages[ key ] = null );

        // update the state with the final message list
        this.setState( {  messages } );

    }

    login( provider ) {


        let authProvider = null;

        switch ( provider ) {
            case 'facebook':
                authProvider = new firebase.auth.FacebookAuthProvider();
                break;
            case 'twitter':
                authProvider = new firebase.auth.TwitterAuthProvider();
                break;
            case 'github':
                authProvider = new firebase.auth.GithubAuthProvider();
                break;
            default:
                break;
        }

        if( authProvider ){
            firebaseApp.auth().signInWithPopup( authProvider )
                .then( this.onLoginDone.bind( this ) )
                .catch( error => {
                    console.log(`Authentication error ${ error.message }`);
                    alert(`Authentication error\n${ error.message }`);
                });
        }
        else {
            console.log(`Login error: no provider found`);
            alert(`Login error: no provider found`);
        }

    }

    onLoginDone( authData ) {
      if( authData.user.uid !== null ) {
            this.refMessagesBind = database.bindToState( '/messages', {
                context: this,
                state: 'messages',
                then: this.onDataBinded.bind(this, authData)
            });
        }
    }

    onDataBinded( authData ) {
        database.removeBinding( this.refMessagesBind );
        this.refMessagesSync = database.syncState( '/messages', {
            context: this,
            state: 'messages',
            // then: ()=>{ console.log('synced') }
        });
        this.setState({
            user: {
                uid: authData.user.uid,
                email: authData.user.email,
            }
        });
    }

    logout() {
        firebase.auth().signOut()
            .then(() => {

                database.removeBinding( this.refMessagesSync );

                let oldMessages = { ...this.state.messages };
                Object.keys( oldMessages ).forEach( key => {
                    oldMessages[ key ] = null;
                });
                oldMessages = {};

                this.setState({
                    user: {
                        uid: null,
                        email: 'fake@email.com'
                    },
                    messages: oldMessages
                });
            })
            .catch( error => {
                console.log( `Logout error ${ error.message }` );
                alert(`Logout error\n${ error.message }`);
            });
    }

    renderHeader() {

        let titles, buttons = null;

        // user doesn't exist
        if ( !this.state.user.uid ) {
            titles =
                <div className="titles">
                    <h1>Welcome</h1>
                    <p>Log in to chat with people</p>
                </div>;

            buttons =
                <ButtonGroup vertical>
                    <Button
                        className="btn-login facebook-button"
                        onClick={ this.login.bind(this, 'facebook') }
                    >
                        <i className="fab fa-facebook" /> Facebook
                    </Button>
                    <Button
                        className="btn-login twitter-button"
                        onClick={ this.login.bind(this, 'twitter') }
                    >
                        <i className="fab fa-twitter" /> Twitter
                    </Button>
                    <Button
                        className="btn-login github-button"
                        onClick={ this.login.bind(this, 'github') }
                    >
                        <i className="fab fa-github" /> Github
                    </Button>
                </ButtonGroup>;
        }
        // user is logged
        else {
            titles =
                <div className="titles">
                    <h1>Welcome</h1>
                    <p>{ this.state.user.email }</p>
                </div>;

            buttons =
                <ButtonGroup vertical>
                    <Button bsStyle="primary"
                            bsSize="small"
                            onClick={ this.logout.bind( this ) } ><i className="far fa-sign-out"></i>  Logout</Button>
                </ButtonGroup>;
        }

        return <div className="chatbox-header">{ titles }{ buttons }</div>;

    }

    render() {

        let messagesList = this.state.messages;

        // fake messages if user is disconnected
        if ( !firebase.auth().currentUser ) {
            messagesList = Object.keys(fakeMessages).map(  ( key, i ) => {
                let msg = fakeMessages[key];
                if( i % 2) {
                    msg = {
                        email: this.state.user.email,
                        message: fakeMessages[key].message
                    }
                }
                return msg;
            });
        }


        const totalNbMessages = Object.keys( messagesList ).length;
        const messages = Object
            .keys( messagesList )
            .slice(
                totalNbMessages > this.props.maxMessages ? totalNbMessages - this.props.maxMessages : 0,
                totalNbMessages
            )
            .map( key =>
                <CSSTransition
                     key={ key }
                     classNames="message"
                     timeout={{
                         enter: 250,
                         exit: 250
                     }}
                >
                <Message
                    key={ key }
                    details={ messagesList[ key ] }
                    isUser={ this.isUser.bind( this ) }
                />
                </CSSTransition>
            );

        return (
            <div id="page-app" className="page full-page">
                { this.renderHeader() }

                <div className="chatbox">
                    <div className="messages">
                        <div className={ this.state.user.uid === null ? 'messages-container disabled' : 'messages-container' } ref={ div => this.messagesDiv = div } >
                            <TransitionGroup className="group">
                                { messages }
                            </TransitionGroup>
                        </div>
                    </div>
                    <Formulaire
                        enabled={ this.state.user.uid !== null }
                        addMessage={ this.addMessage.bind( this ) }
                        email={ this.state.user.email }
                        length={ 200 }
                    />
                </div>
            </div>
        );
    }

    componentWillUnmount() {}

    static propTypes = {
        maxMessages: PropTypes.number
    };

    static defaultProps = {
        maxMessages: 10
    };
}
export default App;