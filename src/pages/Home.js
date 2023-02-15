import React from 'react';
import '../styles/home.css'

const homeAddress = 'http://192.168.0.102:3000/';

class Home extends React.Component {

  onclick () {
    window.location.replace(homeAddress+'entrance');
  }

  render () {
    return (
        <div className="container">
          <div className="home">
          <p>
            С помощью <em>Списка Покупок</em> Вы можете
            спланировать покупки перед походом в магазин.
            <ul>
              <li>✔️ Сэкономить время в магазине</li>
              <li>✔️ Организовать закупку только необходимыми продуктами</li>
              <li>✔️ Не забыть ничего купить</li>
              <li>✔️ Редактировать список вместе с друзьями</li>
            </ul>
          </p>
          <button  onClick={() => this.onclick()}>
            Зарегистрироваться или войти
          </button>
          </div>
        </div>
    );
  }
}

export default Home;
