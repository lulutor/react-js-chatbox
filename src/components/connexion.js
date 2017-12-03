import React from 'react';
import PropTypes from 'prop-types'

class Connexion extends React.Component {

    goToChat( event ) {

        event.preventDefault();

        // recuperer le pseudo
        const pseudo = this.pseudoInput.value;

        // changer l'url
        let url = `/pseudo/${pseudo}`;

        this.props.history.push( url );
        // window.location.assign( url );
    };

    render() {

        return (
            <div className="connexionBox" onSubmit={ this.goToChat.bind( this ) }>
                <form className="connexion">
                    <input type="text"
                        placeholder="Pseudo"
                        required
                        ref={ input => { this.pseudoInput = input } }
                    />
                    <button type="submit">Go</button>
                </form>
            </div>
        );

    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

}
export default Connexion;