import React, { useState, useEffect, useCallback } from 'react';
import {
  Bot, Plus, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Lightbulb, Target, ArrowRight, Sparkles, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  type Task, type Goal, type TaskPriority, type TaskAgentState,
  getTaskAgentState, addGoal, addTasks, updateTask, deleteTask, deleteGoal,
  markTaskComplete, generateTasksFromGoal,
} from '../utils/taskStorage';

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  High: 'bg-red-500/20 text-red-300 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-300 border-green-500/30',
};

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function SmartTaskAgentPage() {
  const [state, setState] = useState<TaskAgentState>(() => getTaskAgentState());
  const [goalInput, setGoalInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [nextSuggestion, setNextSuggestion] = useState<Task | null>(null);
  const [suggestionGoalText, setSuggestionGoalText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editPriority, setEditPriority] = useState<TaskPriority>('Medium');
  const [editDueDate, setEditDueDate] = useState('');

  // Reload from storage on mount
  useEffect(() => {
    setState(getTaskAgentState());
  }, []);

  const toggleGoal = (goalId: string) => {
    setExpandedGoals(prev => {
      const next = new Set(prev);
      if (next.has(goalId)) next.delete(goalId);
      else next.add(goalId);
      return next;
    });
  };

  const handleGenerateTasks = useCallback(() => {
    const trimmed = goalInput.trim();
    if (!trimmed) return;

    setIsGenerating(true);

    // Simulate brief "thinking" delay for UX
    setTimeout(() => {
      const goalId = generateId();
      const newGoal: Goal = { id: goalId, text: trimmed, createdAt: Date.now() };
      addGoal(newGoal);

      const taskTemplates = generateTasksFromGoal(trimmed);
      const newTasks: Task[] = taskTemplates.map(t => ({
        ...t,
        id: generateId(),
        goalId,
        createdAt: Date.now(),
      }));
      const newState = addTasks(newTasks);

      setState(newState);
      setGoalInput('');
      setExpandedGoals(prev => new Set([...prev, goalId]));
      setIsGenerating(false);
    }, 800);
  }, [goalInput]);

  const handleToggleComplete = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!task.completed) {
      const { state: newState, nextSuggestion: suggestion } = markTaskComplete(taskId);
      setState(newState);
      if (suggestion) {
        setNextSuggestion(suggestion);
        const goal = newState.goals.find(g => g.id === suggestion.goalId);
        setSuggestionGoalText(goal?.text ?? '');
      }
    } else {
      const newState = updateTask(taskId, { completed: false });
      setState(newState);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const newState = deleteTask(taskId);
    setState(newState);
  };

  const handleDeleteGoal = (goalId: string) => {
    const newState = deleteGoal(goalId);
    setState(newState);
    setExpandedGoals(prev => {
      const next = new Set(prev);
      next.delete(goalId);
      return next;
    });
  };

  const handleStartEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate);
  };

  const handleSaveEditTask = (taskId: string) => {
    const newState = updateTask(taskId, { priority: editPriority, dueDate: editDueDate });
    setState(newState);
    setEditingTaskId(null);
  };

  const getGoalTasks = (goalId: string) =>
    state.tasks.filter(t => t.goalId === goalId).sort((a, b) => a.order - b.order);

  const getGoalProgress = (goalId: string) => {
    const tasks = getGoalTasks(goalId);
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl teal-gradient flex items-center justify-center flex-shrink-0">
          <Bot size={20} className="text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">Smart Task Agent</h1>
          <p className="text-white/50 text-sm mt-1">
            Enter a goal and the AI agent will break it down into actionable steps with priorities
          </p>
        </div>
      </div>

      {/* Next Step Suggestion Banner */}
      {nextSuggestion && (
        <div className="glass-card rounded-xl p-4 border border-teal/30 flex items-start gap-3">
          <Sparkles size={18} className="text-teal flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-teal font-semibold uppercase tracking-wider mb-1">Next Suggested Step</p>
            <p className="text-white text-sm font-medium">{nextSuggestion.text}</p>
            {suggestionGoalText && (
              <p className="text-white/40 text-xs mt-0.5">Goal: {suggestionGoalText}</p>
            )}
          </div>
          <button
            onClick={() => setNextSuggestion(null)}
            className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Goal Input */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Target size={16} className="text-teal" />
          <h2 className="text-sm font-semibold text-white/80">Auto-Task Generator</h2>
        </div>
        <div className="flex gap-3">
          <Textarea
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            placeholder="Enter your goal (e.g. 'Launch a digital marketing campaign for Q2', 'Grow email subscriber list to 5000')"
            className="flex-1 bg-white/5 border-teal/20 text-white placeholder:text-white/25 resize-none min-h-[72px]"
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerateTasks();
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/30">Press Ctrl+Enter to generate</p>
          <Button
            onClick={handleGenerateTasks}
            disabled={!goalInput.trim() || isGenerating}
            className="teal-gradient text-black font-semibold gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles size={14} className="animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Lightbulb size={14} />
                Generate Tasks
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Goals & Tasks */}
      {state.goals.length === 0 ? (
        <div className="text-center py-16 text-white/20">
          <Bot size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No goals yet</p>
          <p className="text-sm mt-1">Enter a goal above and click "Generate Tasks" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
            Priority Queue — {state.goals.length} Goal{state.goals.length !== 1 ? 's' : ''}
          </h2>

          {state.goals.map(goal => {
            const tasks = getGoalTasks(goal.id);
            const progress = getGoalProgress(goal.id);
            const isExpanded = expandedGoals.has(goal.id);
            const completedCount = tasks.filter(t => t.completed).length;

            return (
              <div key={goal.id} className="glass-card rounded-xl overflow-hidden">
                {/* Goal Header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/3 transition-colors"
                  onClick={() => toggleGoal(goal.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white truncate">{goal.text}</p>
                      {progress === 100 && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[160px]">
                        <div
                          className="h-full teal-gradient rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40">
                        {completedCount}/{tasks.length} tasks · {progress}%
                      </span>
                      <span className="text-xs text-white/25">{formatDate(goal.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteGoal(goal.id); }}
                      className="p-1.5 text-white/25 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-white/40" />
                    ) : (
                      <ChevronDown size={16} className="text-white/40" />
                    )}
                  </div>
                </div>

                {/* Tasks List */}
                {isExpanded && (
                  <div className="border-t border-white/5">
                    {tasks.length === 0 ? (
                      <p className="text-center text-white/25 text-sm py-6">No tasks for this goal</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {tasks.map(task => (
                          <div
                            key={task.id}
                            className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                              task.completed ? 'opacity-50' : 'hover:bg-white/2'
                            }`}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => handleToggleComplete(task.id)}
                              className="mt-0.5 flex-shrink-0 text-white/40 hover:text-teal transition-colors"
                            >
                              {task.completed ? (
                                <CheckCircle2 size={18} className="text-teal" />
                              ) : (
                                <Circle size={18} />
                              )}
                            </button>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                              {editingTaskId === task.id ? (
                                <div className="space-y-2">
                                  <div className="flex gap-2 flex-wrap">
                                    <Select
                                      value={editPriority}
                                      onValueChange={v => setEditPriority(v as TaskPriority)}
                                    >
                                      <SelectTrigger className="w-32 h-7 text-xs bg-white/5 border-teal/20 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
                                        <SelectItem value="High" className="focus:bg-teal/10 focus:text-teal text-xs">High</SelectItem>
                                        <SelectItem value="Medium" className="focus:bg-teal/10 focus:text-teal text-xs">Medium</SelectItem>
                                        <SelectItem value="Low" className="focus:bg-teal/10 focus:text-teal text-xs">Low</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="date"
                                      value={editDueDate}
                                      onChange={e => setEditDueDate(e.target.value)}
                                      className="w-40 h-7 text-xs bg-white/5 border-teal/20 text-white"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleSaveEditTask(task.id)}
                                      className="h-6 text-xs teal-gradient text-black"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingTaskId(null)}
                                      className="h-6 text-xs text-white/50 hover:text-white"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start gap-2 flex-wrap">
                                  <p className={`text-sm flex-1 min-w-0 ${task.completed ? 'line-through text-white/30' : 'text-white/85'}`}>
                                    {task.text}
                                  </p>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full border ${PRIORITY_STYLES[task.priority]}`}>
                                      {task.priority}
                                    </span>
                                    {task.dueDate && (
                                      <span className="text-xs text-white/30">
                                        Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            {editingTaskId !== task.id && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleStartEditTask(task)}
                                  className="p-1 text-white/25 hover:text-teal transition-colors"
                                  title="Edit priority & due date"
                                >
                                  <ArrowRight size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1 text-white/25 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
