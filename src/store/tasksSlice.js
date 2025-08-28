import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialTasks } from '../data/task';

// Имитация асинхронной загрузки задач
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      // Имитируем задержку сети в 1 секунду
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Возвращаем наши локальные данные как будто они пришли с сервера
      return initialTasks;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке задач');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    toggleTask: (state, action) => {
      const task = state.items.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    addTask: (state, action) => {
      const newTask = {
        id: Date.now(),
        title: action.payload,
        completed: false
      };
      state.items.push(newTask);
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter(task => task.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleTask, addTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;