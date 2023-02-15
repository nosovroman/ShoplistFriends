import React from 'react';
import Task from './Task';
import firebase from 'firebase';
import '../styles/list.css'

var db, uid, curEmail;
const homeAddress = 'http://192.168.0.102:3000/';

class BigList extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      tasks: [],
    };
  }

  addTask = (e) => {
    e.preventDefault();
    const { input } = this.state;
    if (input) {
        // Lists->List->key
        var newListKey = db.ref('Lists').push({
          'users': {
            [uid]: curEmail
          },
          'nameList': input
        }).key;

        // Users->uid->Lists->key
        db.ref('Users').child(uid)
        .child('Lists').update({
          [newListKey]: {
            'nameList': input  
          }
        })
        .then(
            result => {
                this.setState({ input: '' });
            },
            error => {
                alert(error);
            }
        );
    } else {
      alert("Нельзя создать список без названия");
    }
  }

  componentDidMount() {
    db = firebase.database();
    uid = firebase.auth().currentUser.uid;

    // получаем почту текущего пользователя
    db.ref('Users').child(uid).on('value', snapshot => {
      curEmail = snapshot.val().email;
    });

    var query = db.ref('Users').child(uid).child('Lists');
    var dataList;
    query.on("value", (snapshot) => {
      dataList = []
      snapshot.forEach(function(childSnapshot) {
        dataList.push({
          'key': childSnapshot.key,
          'value': childSnapshot.val()
        });
      });
      this.setState({
        tasks: dataList
      }, () => {
        console.log(this.state.tasks);
      });
    });
  }

  // // не робит с withRouter
  componentWillUnmount = () => {
    // this.authSubscription();
  }

  doneTask = id => {
    const index = this.state.tasks.map(task => task.id).indexOf(id);
    this.setState(state => {
      let {tasks} = state;
      tasks[index].done = true;
      return tasks;
    });
  }

  deleteTask(id, name) {
    if (window.confirm(`Вы уверены, что хотите удалить список "${name}"?`)) {
      var query = db.ref('Users').child(uid).child('Lists');
      // var usersDeletingList;

      // удаление из списков
      db.ref('Lists').child(id).child('users').once('value', snapshot => {
        //usersDeletingList = [];
        snapshot.forEach(function(childSnapshot) {
          var curUserRef = db.ref('Users').child(childSnapshot.key);

          curUserRef.child('Lists').child(id).remove();
          curUserRef.update({
            'location': 'main'
          });
        });
      }).then(result => {
        db.ref('Lists').child(id).remove();
      });
    }
  }

  toList(key) {
    db.ref('Users').child(uid).update({
      'location': key
    }).then(result=>{
      // console.log(this.props)
      // this.props.goToList;
      {window.location.replace(homeAddress + 'list')}
    });
  }

  inputChange = event => {
    this.setState({ input: event.target.value });
  };

  render() {
    const { tasks } = this.state;
    const { input } = this.state;

    return (
      <div className="list">
            <form>
              <input
                  onChange={this.inputChange}
                  placeholder={'Название списка'}
                  value={input}
              ></input>
              <button onClick={this.addTask}>Создать</button>
            </form>

            <h3 className="my_lists">Мои списки:</h3>
            
            {tasks.map(task => (
                <Task
                    // doneTask={() => this.doneTask(task.id)}
                    deleteTask={() => this.deleteTask(task.key, task.value.nameList)}
                    editTask={() => this.editTask(task.key)}
                    goToList={() => this.toList(task.key)}
                    task={task}
                    key={task.key}
                ></Task>
            ))}
      </div>
    );
  }
}

export default BigList;
