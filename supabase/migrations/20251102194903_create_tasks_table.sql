/*
  # Create tasks table for task management application

  ## Overview
  This migration creates the core tasks table for the task management application,
  enabling users to create, read, update, and delete tasks with persistence.

  ## New Tables
  
  ### `tasks`
  - `id` (uuid, primary key) - Unique identifier for each task
  - `name` (text, required) - The task name/title
  - `description` (text, optional) - Detailed description of the task
  - `completed` (boolean, default false) - Task completion status
  - `user_id` (uuid, required) - Reference to the user who owns the task
  - `created_at` (timestamptz, default now()) - Timestamp when task was created
  - `updated_at` (timestamptz, default now()) - Timestamp when task was last modified

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the tasks table
  - Users can only view their own tasks
  - Users can only insert tasks for themselves
  - Users can only update their own tasks
  - Users can only delete their own tasks

  ## Notes
  - All operations are restricted to authenticated users only
  - Each user has complete control over their own tasks
  - The completed field allows toggling task completion status
  - Timestamps track creation and modification times for audit purposes
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  completed boolean DEFAULT false,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);