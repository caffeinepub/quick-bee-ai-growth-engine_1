// localStorage utility for Smart Task Agent data persistence

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  goalId: string;
  text: string;
  priority: TaskPriority;
  dueDate: string; // ISO date string or empty
  completed: boolean;
  order: number;
  createdAt: number;
}

export interface Goal {
  id: string;
  text: string;
  createdAt: number;
}

export interface TaskAgentState {
  goals: Goal[];
  tasks: Task[];
}

const STORAGE_KEY = 'quick-bee-task-agent';

function getDefaultState(): TaskAgentState {
  return { goals: [], tasks: [] };
}

export function getTaskAgentState(): TaskAgentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw) as TaskAgentState;
  } catch {
    return getDefaultState();
  }
}

export function saveTaskAgentState(state: TaskAgentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function addGoal(goal: Goal): TaskAgentState {
  const state = getTaskAgentState();
  state.goals = [goal, ...state.goals];
  saveTaskAgentState(state);
  return state;
}

export function addTasks(tasks: Task[]): TaskAgentState {
  const state = getTaskAgentState();
  state.tasks = [...state.tasks, ...tasks];
  saveTaskAgentState(state);
  return state;
}

export function updateTask(taskId: string, updates: Partial<Task>): TaskAgentState {
  const state = getTaskAgentState();
  state.tasks = state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
  saveTaskAgentState(state);
  return state;
}

export function deleteTask(taskId: string): TaskAgentState {
  const state = getTaskAgentState();
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  saveTaskAgentState(state);
  return state;
}

export function deleteGoal(goalId: string): TaskAgentState {
  const state = getTaskAgentState();
  state.goals = state.goals.filter(g => g.id !== goalId);
  state.tasks = state.tasks.filter(t => t.goalId !== goalId);
  saveTaskAgentState(state);
  return state;
}

export function reorderTasks(goalId: string, taskIds: string[]): TaskAgentState {
  const state = getTaskAgentState();
  const otherTasks = state.tasks.filter(t => t.goalId !== goalId);
  const goalTasks = state.tasks.filter(t => t.goalId === goalId);
  const reordered = taskIds
    .map((id, idx) => {
      const task = goalTasks.find(t => t.id === id);
      return task ? { ...task, order: idx } : null;
    })
    .filter(Boolean) as Task[];
  state.tasks = [...otherTasks, ...reordered];
  saveTaskAgentState(state);
  return state;
}

export function markTaskComplete(taskId: string): { state: TaskAgentState; nextSuggestion: Task | null } {
  const state = updateTask(taskId, { completed: true });
  const completedTask = state.tasks.find(t => t.id === taskId);
  if (!completedTask) return { state, nextSuggestion: null };

  // Find next highest-priority incomplete task in same goal
  const priorityOrder: TaskPriority[] = ['High', 'Medium', 'Low'];
  const remaining = state.tasks
    .filter(t => t.goalId === completedTask.goalId && !t.completed && t.id !== taskId)
    .sort((a, b) => {
      const pa = priorityOrder.indexOf(a.priority);
      const pb = priorityOrder.indexOf(b.priority);
      if (pa !== pb) return pa - pb;
      return a.order - b.order;
    });

  return { state, nextSuggestion: remaining[0] ?? null };
}

export function generateTasksFromGoal(goalText: string): Omit<Task, 'id' | 'goalId' | 'createdAt'>[] {
  // Deterministic task breakdown based on goal keywords
  const lower = goalText.toLowerCase();

  const templates: Array<{ keywords: string[]; tasks: Omit<Task, 'id' | 'goalId' | 'createdAt'>[] }> = [
    {
      keywords: ['marketing', 'campaign', 'promote', 'brand', 'advertis'],
      tasks: [
        { text: 'Define target audience and buyer personas', priority: 'High', dueDate: '', completed: false, order: 0 },
        { text: 'Set campaign goals and KPIs', priority: 'High', dueDate: '', completed: false, order: 1 },
        { text: 'Create content calendar and messaging strategy', priority: 'High', dueDate: '', completed: false, order: 2 },
        { text: 'Design creatives and copy for each channel', priority: 'Medium', dueDate: '', completed: false, order: 3 },
        { text: 'Set up tracking and analytics', priority: 'Medium', dueDate: '', completed: false, order: 4 },
        { text: 'Launch campaign and monitor performance', priority: 'Medium', dueDate: '', completed: false, order: 5 },
        { text: 'Review results and optimize', priority: 'Low', dueDate: '', completed: false, order: 6 },
      ],
    },
    {
      keywords: ['lead', 'sales', 'prospect', 'convert', 'funnel'],
      tasks: [
        { text: 'Identify and qualify target leads', priority: 'High', dueDate: '', completed: false, order: 0 },
        { text: 'Create lead capture forms and landing pages', priority: 'High', dueDate: '', completed: false, order: 1 },
        { text: 'Set up CRM and lead tracking', priority: 'High', dueDate: '', completed: false, order: 2 },
        { text: 'Develop outreach email sequences', priority: 'Medium', dueDate: '', completed: false, order: 3 },
        { text: 'Schedule follow-up calls and demos', priority: 'Medium', dueDate: '', completed: false, order: 4 },
        { text: 'Analyze conversion rates and optimize funnel', priority: 'Low', dueDate: '', completed: false, order: 5 },
      ],
    },
    {
      keywords: ['content', 'blog', 'post', 'social', 'seo', 'write'],
      tasks: [
        { text: 'Research keywords and trending topics', priority: 'High', dueDate: '', completed: false, order: 0 },
        { text: 'Create content outline and structure', priority: 'High', dueDate: '', completed: false, order: 1 },
        { text: 'Write first draft', priority: 'High', dueDate: '', completed: false, order: 2 },
        { text: 'Edit, proofread and optimize for SEO', priority: 'Medium', dueDate: '', completed: false, order: 3 },
        { text: 'Add visuals and media assets', priority: 'Medium', dueDate: '', completed: false, order: 4 },
        { text: 'Publish and distribute across channels', priority: 'Medium', dueDate: '', completed: false, order: 5 },
        { text: 'Track engagement and performance metrics', priority: 'Low', dueDate: '', completed: false, order: 6 },
      ],
    },
    {
      keywords: ['website', 'landing page', 'web', 'design', 'build', 'develop'],
      tasks: [
        { text: 'Define website goals and user journey', priority: 'High', dueDate: '', completed: false, order: 0 },
        { text: 'Create wireframes and design mockups', priority: 'High', dueDate: '', completed: false, order: 1 },
        { text: 'Write copy and gather assets', priority: 'High', dueDate: '', completed: false, order: 2 },
        { text: 'Develop and build pages', priority: 'Medium', dueDate: '', completed: false, order: 3 },
        { text: 'Test across devices and browsers', priority: 'Medium', dueDate: '', completed: false, order: 4 },
        { text: 'Set up analytics and conversion tracking', priority: 'Medium', dueDate: '', completed: false, order: 5 },
        { text: 'Launch and monitor performance', priority: 'Low', dueDate: '', completed: false, order: 6 },
      ],
    },
    {
      keywords: ['email', 'newsletter', 'subscriber', 'list'],
      tasks: [
        { text: 'Define email campaign objective and audience', priority: 'High', dueDate: '', completed: false, order: 0 },
        { text: 'Segment email list by audience type', priority: 'High', dueDate: '', completed: false, order: 1 },
        { text: 'Write compelling subject lines and body copy', priority: 'High', dueDate: '', completed: false, order: 2 },
        { text: 'Design email template', priority: 'Medium', dueDate: '', completed: false, order: 3 },
        { text: 'Set up automation sequences', priority: 'Medium', dueDate: '', completed: false, order: 4 },
        { text: 'A/B test subject lines and CTAs', priority: 'Low', dueDate: '', completed: false, order: 5 },
        { text: 'Analyze open rates and click-through rates', priority: 'Low', dueDate: '', completed: false, order: 6 },
      ],
    },
  ];

  for (const template of templates) {
    if (template.keywords.some(kw => lower.includes(kw))) {
      return template.tasks;
    }
  }

  // Generic fallback
  return [
    { text: `Research and gather information about: ${goalText}`, priority: 'High', dueDate: '', completed: false, order: 0 },
    { text: 'Define success criteria and measurable outcomes', priority: 'High', dueDate: '', completed: false, order: 1 },
    { text: 'Create a detailed action plan with milestones', priority: 'High', dueDate: '', completed: false, order: 2 },
    { text: 'Identify required resources and assign responsibilities', priority: 'Medium', dueDate: '', completed: false, order: 3 },
    { text: 'Execute first phase and track progress', priority: 'Medium', dueDate: '', completed: false, order: 4 },
    { text: 'Review results and adjust strategy', priority: 'Low', dueDate: '', completed: false, order: 5 },
  ];
}
