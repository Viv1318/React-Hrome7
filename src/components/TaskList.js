import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, toggleTask, deleteTask, addTask } from '../store/tasksSlice';

const TaskList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.tasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      dispatch(addTask(newTaskTitle.trim()));
      setNewTaskTitle('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div>Загрузка задач...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        <div>Ошибка: {error}</div>
        <button onClick={() => dispatch(fetchTasks())}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Список задач</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Добавить новую задачу..."
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button
          onClick={handleAddTask}
          style={{ padding: '8px 16px', fontSize: '16px' }}
        >
          Добавить
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => dispatch(fetchTasks())}
          style={{ padding: '8px 16px', fontSize: '16px' }}
        >
          Обновить задачи
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Нет задач для отображения
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(task => (
            <li
              key={task.id}
              style={{
                padding: '10px',
                margin: '5px 0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: task.completed ? '#f0f0f0' : 'white',
                textDecoration: task.completed ? 'line-through' : 'none'
              }}
            >
              <span
                onClick={() => dispatch(toggleTask(task.id))}
                style={{ cursor: 'pointer', flex: 1 }}
              >
                {task.title}
              </span>
              <button
                onClick={() => dispatch(deleteTask(task.id))}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Всего задач: {items.length} | 
        Выполнено: {items.filter(task => task.completed).length} | 
        Осталось: {items.filter(task => !task.completed).length}
      </div>
    </div>
  );
};

export default TaskList;