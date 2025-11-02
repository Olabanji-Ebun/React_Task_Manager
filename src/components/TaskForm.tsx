import { useState, useEffect } from 'react';
import type { Task } from '../types/database';

interface TaskFormProps {
  onSubmit: (name: string, description: string) => void;
  editingTask: Task | null;
  onCancel: () => void;
}

export function TaskForm({ onSubmit, editingTask, onCancel }: TaskFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name);
      setDescription(editingTask.description);
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Task name is required');
      return;
    }

    onSubmit(name.trim(), description.trim());
    setName('');
    setDescription('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Task Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="Enter task name"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          placeholder="Enter task description (optional)"
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
