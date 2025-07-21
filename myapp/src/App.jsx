import React, { useState, useEffect } from 'react';

const { ipcRenderer } = window.require('electron');

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    ipcRenderer.invoke('read-todos').then(setTodos);
  }, []);

  const addTodo = () => {
    
    const newTodos = [...todos, { text: input , data : new Date().toISOString()}];
    setTodos(newTodos);
    setInput('');

    console.log( newTodos)
    ipcRenderer.invoke('write-todos', newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    ipcRenderer.invoke('write-todos', newTodos);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo List</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button onClick={addTodo}>추가</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo.text}
            <button onClick={() => removeTodo(i)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
