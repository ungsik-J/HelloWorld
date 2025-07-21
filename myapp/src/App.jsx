import React, { useState, useEffect } from "react";
import { Input, Button, List, Typography, Space, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { ipcRenderer } = window.require("electron");

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    ipcRenderer.invoke("read-todos").then(setTodos);
  }, []);

  const addTodo = () => {
    if (!input.trim()) {
      message.warning("할 일을 입력해주세요.");
      return;
    }

    const newTodos = [
      ...todos,
      { text: input, date: new Date().toISOString() },
    ];
    setTodos(newTodos);
    setInput("");
    ipcRenderer.invoke("write-todos", newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    ipcRenderer.invoke("write-todos", newTodos);
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <Typography.Title level={2}>📝 Todo List</Typography.Title>

      <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          onPressEnter={addTodo}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={addTodo}>
          추가
        </Button>
      </Space.Compact>

      <List
        bordered
        dataSource={todos}
        renderItem={(todo, i) => (
          <List.Item
            actions={[
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => removeTodo(i)}
              >
                삭제
              </Button>,
            ]}
          >
            <Typography.Text>{todo.text}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
}

export default App;
