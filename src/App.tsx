import { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { SearchFilter } from './components/SearchFilter';
import { ClipboardList, Loader2 } from 'lucide-react';
import { getAllTasks, addTask, updateTask, deleteTask } from './lib/indexeddb';
import type { Task } from './types/database';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (filter === 'active') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((task) =>
        task.name.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleAddTask = async (name: string, description: string) => {
    try {
      const newTask = await addTask({
        name,
        description,
        completed: false,
        user_id: 'local',
      } as any);
      setTasks((prev) => [newTask, ...prev]);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleUpdateTask = async (name: string, description: string) => {
    if (!editingTask) return;

    try {
      const updatedTask = await updateTask(editingTask.id, {
        name,
        description,
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? updatedTask : task))
      );
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const updatedTask = await updateTask(taskId, { completed });
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error toggling task completion:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleSubmit = (name: string, description: string) => {
    if (editingTask) {
      handleUpdateTask(name, description);
    } else {
      handleAddTask(name, description);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ClipboardList className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Task Manager</h1>
          </div>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </header>

        <TaskForm
          onSubmit={handleSubmit}
          editingTask={editingTask}
          onCancel={handleCancelEdit}
        />

        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
        />

        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            Showing {filteredTasks.length} of {tasks.length} task
            {tasks.length !== 1 ? 's' : ''}
          </p>
        </div>

        <TaskList
          tasks={filteredTasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
}

export default App;
