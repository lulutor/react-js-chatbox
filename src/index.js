import React        from 'react';
import { render }   from 'react-dom';

// components
import App from './components/app';
import Connexion from './components/connexion';
import NotFound from './components/not-found';

// router
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';

// css
import './index.css';


const Root = () => {

    const MyApp = props => {
        return (
            <App
                { ...props }
            />
        );
    };

    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={ withRouter(Connexion) } />
                    <Route path="/pseudo/:pseudo" component={ MyApp }/>
                    <Route component={ NotFound }/>
                </Switch>
            </div>
        </BrowserRouter>
    );


};

render(
    <Root />,
    document.getElementById('root')
);
