import { useState, useEffect } from "react";

const API_URL = "https://todo-list-db-ax92.onrender.com";

const ToDoList = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => setTodos(data))
            .catch(error => console.error("Error fetching todos:", error));
    }, []);

    const addTodo = async (text) => {
        const newTodo = { text, completed: false };
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo),
        });
        const data = await response.json();
        setTodos([...todos, data]);
    }; 

    return (
        <div>
            <h2>To-Do List</h2>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.text} {todo.completed ? "✅" : ""}
                    </li>
                ))}
            </ul>
            <button onClick={() => addTodo("New Task")}>Add Task</button>
        </div>
    );
};

export default ToDoList;
