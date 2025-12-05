import './App.css';
import { useState, useEffect } from 'react';

export function App() {
  const [todos, setTodos] = useState([]);
  const [currVal, setCurrVal] = useState("");

  // Fetch todos on component mount
  useEffect(() => {
    fetch('http://localhost:8000/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  }, []);

  const handleTodoChange = (e) => {
    setCurrVal(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
      const res = await fetch('http://localhost:8000/todos/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: currVal }),
      });
  
    if (!res.ok) {
      console.error("Failed to create todo");
      return;
    }
  
    const newTodo = await res.json();
    setTodos(prev => [...prev, newTodo]);  // append instead of refetch
    setCurrVal("");
  };
  

  const renderTodos = () => {
    const items = [];
    for (const todo of todos) {
      items.push(
        <li key={todo.id} className="todo-item">
          <span className="todo-text">{todo.description}</span>
        </li>
      );
    }
    return items;
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">📝 My TODO List</h1>
          <p className="app-subtitle">Stay organized and get things done</p>
        </header>

        <div className="content-wrapper">
          <section className="todo-section">
            <div className="section-header">
              <h2 className="section-title">Your TODOs</h2>
              {todos.length > 0 && (
                <span className="todo-count">{todos.length} {todos.length === 1 ? 'item' : 'items'}</span>
              )}
            </div>
            
            {todos.length > 0 ? (
              <ul className="todo-list">{renderTodos()}</ul>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✨</div>
                <p className="empty-text">No todos yet. Create your first one below!</p>
              </div>
            )}
          </section>

          <section className="create-section">
            <h2 className="section-title">Create a New TODO</h2>
            <form onSubmit={handleSubmit} className="todo-form">
              <div className="form-group">
                <label htmlFor="todo" className="form-label">
                  What needs to be done?
                </label>
                <input
                  id="todo"
                  type="text"
                  className="todo-input"
                  value={currVal}
                  onChange={handleTodoChange}
                  placeholder="Enter your todo here..."
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="submit-button" disabled={!currVal.trim()}>
                <span>Add TODO</span>
                <span className="button-icon">➕</span>
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
