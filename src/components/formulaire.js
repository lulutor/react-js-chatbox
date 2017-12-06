import React from 'react';
import PropTypes from 'prop-types';
// Bootstrap components
import { Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap';

class Formulaire extends React.Component {

    state = {
      length: this.props.length
    };

    componentDidUpdate() {}

    createMessage( event ) {

        event.preventDefault();

        const message = {
            message: this.message.value,
            email: this.props.email
        };

        this.props.addMessage( message );


        document.getElementById( this.messageForm.props.id ).reset();

        this.setState( { length: this.props.length } );

    }

    updateCounter( event ) {
        const length = this.props.length - this.message.value.length;
        this.setState( { length } );
    }

    onKeyDown( event ) {
        // pressing enter
        if( event.keyCode === 13 ) {
            // with alt key or ctrl key
            if( event.altKey || event.ctrlKey ) {
                // add a line
                this.message.value += '\n';
            }
            else {
                // trigger click button to submit form
                event.preventDefault();
                document.getElementById( this.submitButton.props.id ).click();
            }
        }

    }

    render() {

        return (
            <Form
                id='writingForm'
                className={ this.props.enabled ? 'form' : 'form disabled' }
                ref={ form => this.messageForm = form }
                onSubmit={ this.createMessage.bind( this ) }
            >

                <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>Your message <span className="info">{ this.state.length }</span></ControlLabel>
                    <FormControl
                        onKeyDown={ this.onKeyDown.bind( this )  }
                        required
                        maxLength={ this.props.length }
                        inputRef={ msg => {
                            if ( msg ) msg.disabled = !this.props.enabled;
                            this.message = msg;
                        }}
                        onChange={ this.updateCounter.bind( this ) }
                        componentClass="textarea"
                        placeholder="Enter a message (ctrl + enter or alt + enter for new line)" />
                </FormGroup>
                <Button
                        disabled={ !this.props.enabled }
                        id="submitButton"
                        ref={ input => this.submitButton = input  }
                        bsStyle="primary"
                        bsSize="large"
                        block
                        type="submit"><Glyphicon glyph="send" /> &nbsp; SEND</Button>

            </Form>
        );

    }

    static propTypes = {
        enabled: PropTypes.bool.isRequired,
        addMessage: PropTypes.func.isRequired,
        email: PropTypes.string.isRequired,
        length: PropTypes.number.isRequired
    };

}
export default Formulaire;