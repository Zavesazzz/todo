import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { randomColor } from 'randomcolor';
import Draggable from 'react-draggable';
import './App.css';

function App() {
  // State для отдельно взятой заметки
  const [item, setItem] = useState('') 
  // State для всех заметок которые мы помещаем в localstorage
  const [items, setItems] = useState(
    // По умолчанию получаем элементы из localstorage
    JSON.parse(localStorage.getItem('items')) || []
  )

  // Как только обновляется массив items, у нас срабатывает useEffect
  useEffect(() => {
    // Помещаем элементы в localstorage
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])

  // Функция которая проверяет item(значение поля input) на значение, в успешном случае добавляет в массив Items, в противном случае выводит alert
  const newItem = () => {
    if (item.trim() !== '') {
      const newItem = {
        id: uuidv4(),
        item,
        color: randomColor({
          luminosity: 'light'
        }),
        defaultPos: {
          x: 500,
          y: -500,
        }
      }
      setItems((items) => [...items, newItem])
      setItem('')
    } else {
      alert('Введите заметку!!!"')
      setItem('')
    }
  }

  // Функция удаления заметки
  const deleteNode = (id) => {
    // Удалит нам заметку если id карточки на которую мы кликнули !== id
    setItems(items.filter((item) => item.id !== id))
  }

  //Функция сохранения позиции для уже созданных заметок
  const updatePos = (data, index) => {
    let newArr = [...items]
    newArr[index].defaultPos = {x: data.x, y: data.y}
    setItems(newArr)
  }

  // Метод для определения нажатой кнопки Enter для вывода заметки
  const keyPress = (e) => {
    // Создание переменной Code для разных браузеров и проверка если нажат Enter то вызываем newItem()
    const code = e.keyCode || e.which
    if(code === 13) {
      newItem()
    }
  }

  return (
    <div className="App">
      <div className='wrapper'>
        <input
        value={item}
        placeholder='Введите заметку...'
        type="text" 
        onChange={(e) => setItem(e.target.value)}
        onKeyPress={(e) => keyPress(e)}
        />
        <button className='enter' onClick={newItem}>ВВОД</button>
      </div>

      {
        items.map((item, index) => {
          return(
            <Draggable key={index} defaultPosition={item.defaultPos} onStop={(e, data) => {
              updatePos(data, index)
            }}>
              <div className='todo_item' style={{backgroundColor: item.color}}>
                {`${item.item}`}
                <button 
                className='delete'
                onClick={() => deleteNode(item.id)}
                >X</button>
              </div>
            </Draggable>
          )
        })
      }
    </div>
  );
}

export default App;
