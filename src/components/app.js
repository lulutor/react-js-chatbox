import React from 'react';
import Formulaire from './formulaire';
import Message from './messages';
import database from '../database';
import PropTypes from 'prop-types';

//css
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import '../animation.css';

class App extends React.Component {

    state = {
        messages: {}
    };

    componentWillMount() {
        this.ref = database.syncState( '/', {
            context: this,
            state: 'messages'
        });
    }

    componentDidUpdate() {
       // scroll down to the last message
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }

    isUser( pseudo ) {
        return pseudo === this.props.match.params.pseudo;
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

    render() {

        const messages = Object
            .keys( this.state.messages )
            .slice( 0, this.props.maxMessages )
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
                    details={ this.state.messages[ key ] }
                    isUser={ this.isUser.bind( this ) }
                />
                </CSSTransition>
            );

        return (
            <div id="page-app" className="page full-page">
                <div className="chatbox">
                    <h1>Welcome { this.props.match.params.pseudo }</h1>
                    <div className="messages">
                        <div className="messages-container" ref={ div => this.messagesDiv = div } >
                            <TransitionGroup className="group">
                                { messages }
                            </TransitionGroup>
                        </div>
                    </div>
                    <Formulaire
                        addMessage={ this.addMessage.bind( this ) }
                        pseudo={ this.props.match.params.pseudo }
                        length={ 200 }
                    />
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        database.removeBinding( this.ref );
    }

    static propTypes = {
        maxMessages: PropTypes.number,
        match: PropTypes.shape({
            params: PropTypes.shape({
                pseudo: PropTypes.string.isRequired
            })
        })
    };

    static defaultProps = {
        maxMessages: 10
    };
}
export default App;