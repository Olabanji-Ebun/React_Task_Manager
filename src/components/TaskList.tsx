import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import type { Task } from '../types/database';
import { ConfirmModal } from './ConfirmModal';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  editingTaskId: string | null;
}

export function TaskList({ tasks, onEdit, onDelete, onToggleComplete, editingTaskId }: TaskListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ taskId: string; taskName: string } | null>(null);

  const handleDeleteClick = (taskId: string, taskName: string) => {
    if (editingTaskId === taskId) return;
    setDeleteConfirm({ taskId, taskName });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.taskId);
      setDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">No tasks found. Add your first task above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={`bg-white rounded-lg shadow-md p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in ${
            index === 0
              ? ''
              : index === 1
                ? 'stagger-1'
                : index === 2
                  ? 'stagger-2'
                  : index === 3
                    ? 'stagger-3'
                    : index === 4
                      ? 'stagger-4'
                      : index === 5
                        ? 'stagger-5'
                        : ''
          } ${task.completed ? 'opacity-75' : ''}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3
                className={`text-xl font-semibold text-gray-800 mb-2 transition-all duration-300 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {task.name}
              </h3>
              {task.description && (
                <p
                  className={`text-gray-600 whitespace-pre-wrap ${
                    task.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onToggleComplete(task.id, !task.completed)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                  task.completed
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
                title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.completed ? (
                  <X className="w-5 h-5 transition-transform duration-200" />
                ) : (
                  <Check className="w-5 h-5 transition-transform duration-200" />
                )}
              </button>

              <button
                onClick={() => onEdit(task)}
                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all duration-200 hover:scale-110 active:scale-95"
                title="Edit task"
              >
                <Pencil className="w-5 h-5 transition-transform duration-200" />
              </button>

              <button
                onClick={() => handleDeleteClick(task.id, task.name)}
                disabled={editingTaskId === task.id}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  editingTaskId === task.id
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110 active:scale-95'
                }`}
                title={editingTaskId === task.id ? 'Cannot delete while editing' : 'Delete task'}
              >
                <Trash2 className="w-5 h-5 transition-transform duration-200" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            <span
              className={`px-3 py-1 rounded-full font-medium ${
                task.completed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {task.completed ? 'Completed' : 'Active'}
            </span>
            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteConfirm?.taskName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="danger"
      />
    </div>
  );
}
