import React from 'react';
import firebase from 'firebase';
import Item from '../components/Item';
import Loader from '../components/Loader';
import '../styles/list.css';

const homeAddress = 'http://192.168.0.102:3000/';

var curListId = '';
var db;
var uid;

class SmallList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        input: '',
        tasks: [],
        nameList: '',
      };
    }
  
    addTask = (e) => {
        e.preventDefault();
        
        const { input } = this.state;
        if (input) {
            // вставляем в бд
            db.ref('Lists').child(curListId)
            .child('Items').push({
                'nameItem': input,
                'done': false
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
            alert("Нельзя добавить продукт без названия");
        }
    }

    componentDidMount() {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            db = firebase.database();
            uid = firebase.auth().currentUser.uid;
            
            var dataItems;

            db.ref('Users').child(uid).once('value', snapshot => {
                curListId = snapshot.val().location;
            }).then(result => {
                var query = db.ref('Lists').child(curListId);
                query.child('Items').on("value", (itemSnapshot) => {
                    dataItems = []
                    itemSnapshot.forEach(function(childSnapshot) {
                        dataItems.push({
                            'key': childSnapshot.key,
                            'nameItem': childSnapshot.val().nameItem,
                            'done': childSnapshot.val().done
                        });
                    });
                    this.setState({
                        tasks: dataItems
                    });
                })

                query.child('nameList').once('value', snapshot => {
                    if (this.state.nameList !== snapshot.val()) {
                        this.setState({nameList: snapshot.val()});
                    }
                });
            });

            db.ref('Users').child(uid).on('value', snapshot => {
                if (snapshot.val().location == 'main') {
                    window.location.replace(homeAddress + 'main');
                }
            });
        });
    }

    componentWillUnmount() {
        this.authSubscription();
    }
  
    doneTask = (id, done) => {
        db.ref('Lists').child(curListId)
        .child('Items').child(id).update({
            'done': !done
        });
    }
  
    deleteTask(id, name) {
        if (window.confirm(`Вы уверены, что хотите удалить из списка "${name}"?`)) {
            var query = db.ref('Lists').child(curListId).child('Items');

            // находим запись с id и удаляем
            query.on("value", (snapshot) => {
                snapshot.ref.child(id).remove();
            });
        }
    }

    toEditItem(key) {
      db.ref('Users').child(uid).update({
        'editItem': key
      }).then(result=>{
        {window.location.replace(homeAddress + 'editing')}
      });
    }

    inviteFriend = () => {
         window.location.replace(homeAddress + 'invitation')
    }
  
    inputChange = event => {
      this.setState({ input: event.target.value });
    };

    cancelBtn() {
        window.location.replace(homeAddress + 'main');
    }

    render() {
        if (this.state.nameList) {
            const { tasks } = this.state;
            const { input } = this.state;

            const activeItems = tasks.filter(task => !task.done);
            const passiveItems = tasks.filter(task => task.done);

            return (
                <div className="cont">
                    <div className="list">
                        <div className="listNav">
                            <h3>{this.state.nameList}</h3>
                            <img src="/images/users.svg" alt="🚪"
                                onClick={() => this.inviteFriend()}></img>
                        </div>
                        <form>
                            <input
                                onChange={this.inputChange}
                                placeholder={'Название продукта'}
                                value={input}
                            ></input>
                            <button onClick={this.addTask}>Добавить</button>
                        </form>

                        {[...activeItems, ...passiveItems].map(task => (
                            <Item
                                doneTask={() => this.doneTask(task.key, task.done)}
                                deleteTask={() => this.deleteTask(task.key, task.nameItem)}
                                toEditItem={() => this.toEditItem(task.key)}
                                curListId={curListId}
                                task={task}
                                key={task.key}
                            ></Item>
                        ))}
                    </div>
                </div>
            );
        }
        else {
            return (<Loader />);
        }
    }
  }
  
  export default SmallList;