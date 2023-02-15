import React from 'react';
import firebase from 'firebase';
import BigList from '../components/BigList';
import Loader from '../components/Loader';
import '../styles/list.css'

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
        email: '',
        renderList: false
    }
  }

  componentDidMount() {
    // пользователь авторизовался
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      const userId = firebase.database().ref('Users').child(firebase.auth().currentUser.uid);

      // подтягиваем email
      userId.child('email').once('value', snapshot => {
        this.setState({email: snapshot.val()});
      });
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  render () {
    if (this.state.email !== '') {
      return (
          <div className="cont">
            <p className="cur_mail">
              {this.state.email}
            </p>
            <BigList className="list"/>
          </div>
      );      
    }
    else {
      return(<Loader />);
    }
  }
}

export default Main;