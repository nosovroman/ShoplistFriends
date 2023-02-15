import React from 'react';
import firebase from 'firebase';
import '../styles/header.css'

const homeAddress = 'http://192.168.0.102:3000/';
var uid;

class Header extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
        email: ''
    }
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      uid = firebase.auth().currentUser.uid;
      // подтягиваем email
      firebase.database().ref('Users').child(uid).child('email').once('value', snapshot => {
        this.setState({email: snapshot.val()});
      });
    });
  }

  toMain = () => {
    if (uid) {
      window.location.replace(homeAddress + 'main');
    }
  }

  logOut = () => {
    if (uid && window.confirm("Вы уверены, что хотите выйти из аккаунта?")) {
      firebase.auth().signOut()
      .then(result => {
        window.location.replace(homeAddress);
      },
      error => {
        alert(error);
      }); 
    }
  }

  render () {
    return (
      <div className="head">
          <div className="navigation">
              <img className="img_home" src="/images/house2.svg" alt="⬅"
                onClick={this.toMain}></img>

              <h2 className="titler" onClick={this.toMain}>Список покупок</h2>

              <img className="img_out" src="/images/exit.svg" alt="🚪"
                onClick={this.logOut}></img>
          </div>
      </div>
    );
  }
}

export default Header;