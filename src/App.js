import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import Header from './components/Header';

import Home from './pages/Home';
import Registration from './pages/Registration';
import Entrance from './pages/Entrance';
import Main from './pages/Main';
import SmallList from './pages/SmallList';
import EditItem from './pages/EditItem';
import Invitation from './pages/Invitation';

class App extends React.Component {
  render () {
    return (
      <Router>
        <div>
          {<Header />}

          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/registration" component={Registration} />
            <Route exact path="/entrance" component={Entrance} />
            <Route exact path="/main" component={Main} />
            <Route exact path="/list" component={SmallList} />
            <Route exact path="/editing" component={EditItem} />
            <Route exact path="/invitation" component={Invitation} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
