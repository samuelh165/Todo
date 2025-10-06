/**
 * Message Handler
 * Processes different types of commands and messages from WhatsApp
 */

import { parseMessageToTask } from './openai';
import { createServerClient } from './supabase';

export type MessageCommand = 
  | 'list'
  | 'done'
  | 'cancel'
  | 'help'
  | 'task';

export interface MessageHandlerResult {
  success: boolean;
  message: string;
  command?: MessageCommand;
}

/**
 * Detect if a message is a command
 */
export function detectCommand(message: string): MessageCommand {
  const lowerMessage = message.toLowerCase().trim();

  // List tasks commands
  if (lowerMessage === 'list' || 
      lowerMessage === 'show tasks' || 
      lowerMessage === 'my tasks' ||
      lowerMessage === 'tasks') {
    return 'list';
  }

  // Mark done commands (e.g., "done 1", "complete task 1")
  if (lowerMessage.startsWith('done ') || 
      lowerMessage.startsWith('complete ') ||
      lowerMessage.startsWith('finish ')) {
    return 'done';
  }

  // Cancel commands
  if (lowerMessage.startsWith('cancel ') || 
      lowerMessage.startsWith('delete ') ||
      lowerMessage.startsWith('remove ')) {
    return 'cancel';
  }

  // Help command
  if (lowerMessage === 'help' || 
      lowerMessage === 'commands' ||
      lowerMessage === '?') {
    return 'help';
  }

  // Default: treat as a task
  return 'task';
}

/**
 * Handle a message based on detected command
 */
export async function handleMessage(
  phoneNumber: string,
  message: string,
  userId: string
): Promise<MessageHandlerResult> {
  const command = detectCommand(message);

  switch (command) {
    case 'list':
      return await handleListTasks(phoneNumber, userId);
    
    case 'done':
      return await handleMarkDone(phoneNumber, message, userId);
    
    case 'cancel':
      return await handleCancelTask(phoneNumber, message, userId);
    
    case 'help':
      return await handleHelp();
    
    case 'task':
    default:
      return await handleCreateTask(phoneNumber, message, userId);
  }
}

/**
 * List user's pending tasks
 */
async function handleListTasks(
  phoneNumber: string,
  userId: string
): Promise<MessageHandlerResult> {
  const supabase = createServerClient();

  const { data: tasks, error } = await (supabase
    .from('tasks') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })
    .limit(20);

  if (error) {
    console.error('Error fetching tasks:', error);
    return {
      success: false,
      message: '❌ Sorry, I had trouble fetching your tasks.',
      command: 'list',
    };
  }

  if (!tasks || tasks.length === 0) {
    return {
      success: true,
      message: '📋 You have no pending tasks! Add one by sending a message like "Buy groceries tomorrow"',
      command: 'list',
    };
  }

  let listMessage = `📋 Your Tasks (${tasks.length}):\n\n`;

  tasks.forEach((task: any, index: number) => {
    const number = index + 1;
    const priorityEmoji = task.priority === 'high' ? '🔴' : task.priority === 'low' ? '🟢' : '🟡';
    
    listMessage += `${number}. ${priorityEmoji} ${task.content}`;
    
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dateStr;
      if (dueDate.toDateString() === today.toDateString()) {
        dateStr = 'Today';
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        dateStr = 'Tomorrow';
      } else {
        dateStr = dueDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }
      listMessage += ` (${dateStr})`;
    }
    
    listMessage += '\n';
  });

  listMessage += '\n💡 Send "done [number]" to mark complete';

  return {
    success: true,
    message: listMessage,
    command: 'list',
  };
}

/**
 * Mark a task as done
 */
async function handleMarkDone(
  phoneNumber: string,
  message: string,
  userId: string
): Promise<MessageHandlerResult> {
  const supabase = createServerClient();

  // Extract task number from message
  const match = message.match(/\d+/);
  if (!match) {
    return {
      success: false,
      message: '❌ Please specify a task number, e.g., "done 1"',
      command: 'done',
    };
  }

  const taskNumber = parseInt(match[0]);

  // Fetch pending tasks to find the one at this position
  const { data: tasks, error: fetchError } = await (supabase
    .from('tasks') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (fetchError || !tasks || tasks.length === 0) {
    return {
      success: false,
      message: '❌ No pending tasks found',
      command: 'done',
    };
  }

  if (taskNumber < 1 || taskNumber > tasks.length) {
    return {
      success: false,
      message: `❌ Task number must be between 1 and ${tasks.length}`,
      command: 'done',
    };
  }

  const taskToComplete = (tasks as any[])[taskNumber - 1];

  // Update task status
  const { error: updateError } = await (supabase
    .from('tasks') as any)
    .update({ status: 'completed' })
    .eq('id', taskToComplete.id);

  if (updateError) {
    console.error('Error updating task:', updateError);
    return {
      success: false,
      message: '❌ Failed to mark task as done',
      command: 'done',
    };
  }

  return {
    success: true,
    message: `✅ Marked as done: "${taskToComplete.content}"`,
    command: 'done',
  };
}

/**
 * Cancel/delete a task
 */
async function handleCancelTask(
  phoneNumber: string,
  message: string,
  userId: string
): Promise<MessageHandlerResult> {
  const supabase = createServerClient();

  // Extract task number from message
  const match = message.match(/\d+/);
  if (!match) {
    return {
      success: false,
      message: '❌ Please specify a task number, e.g., "cancel 1"',
      command: 'cancel',
    };
  }

  const taskNumber = parseInt(match[0]);

  // Fetch pending tasks to find the one at this position
  const { data: tasks, error: fetchError } = await (supabase
    .from('tasks') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true});

  if (fetchError || !tasks || tasks.length === 0) {
    return {
      success: false,
      message: '❌ No pending tasks found',
      command: 'cancel',
    };
  }

  if (taskNumber < 1 || taskNumber > tasks.length) {
    return {
      success: false,
      message: `❌ Task number must be between 1 and ${tasks.length}`,
      command: 'cancel',
    };
  }

  const taskToCancel = (tasks as any[])[taskNumber - 1];

  // Update task status
  const { error: updateError } = await (supabase
    .from('tasks') as any)
    .update({ status: 'cancelled' })
    .eq('id', taskToCancel.id);

  if (updateError) {
    console.error('Error cancelling task:', updateError);
    return {
      success: false,
      message: '❌ Failed to cancel task',
      command: 'cancel',
    };
  }

  return {
    success: true,
    message: `🗑️ Cancelled: "${taskToCancel.content}"`,
    command: 'cancel',
  };
}

/**
 * Show help message
 */
async function handleHelp(): Promise<MessageHandlerResult> {
  const helpMessage = `🤖 WhatsApp Todo AI - Commands

📝 *Add a task:*
Just send a message describing what you need to do:
• "Buy groceries tomorrow"
• "Call mom next week"
• "Submit report by Friday"

📋 *View tasks:*
• "list" or "tasks"

✅ *Mark as done:*
• "done 1" (marks task #1 as complete)

🗑️ *Cancel a task:*
• "cancel 1" (cancels task #1)
• "delete 2" (cancels task #2)

❓ *Get help:*
• "help"

💡 Tips:
- Include dates like "tomorrow", "next week", "Friday"
- Mention priority: "urgent", "important"
- Tasks are automatically organized by due date

Try it now! Send any task you'd like to remember.`;

  return {
    success: true,
    message: helpMessage,
    command: 'help',
  };
}

/**
 * Create a new task
 */
async function handleCreateTask(
  phoneNumber: string,
  message: string,
  userId: string
): Promise<MessageHandlerResult> {
  const supabase = createServerClient();

  // Parse message with AI
  const parsedTask = await parseMessageToTask(message);

  // Check if AI could extract a task
  if (!parsedTask.content || parsedTask.confidence < 0.4) {
    return {
      success: false,
      message: "👋 I couldn't quite understand that as a task. Try something like:\n\n" +
        "• Buy groceries tomorrow\n" +
        "• Call mom next week\n" +
        "• Submit report by Friday\n\n" +
        "Or send 'help' for more commands.",
      command: 'task',
    };
  }

  // Create task in database
  const { error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      content: parsedTask.content,
      due_date: parsedTask.due_date,
      priority: parsedTask.priority,
      status: 'pending',
    } as never)
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return {
      success: false,
      message: '❌ Sorry, I had trouble creating your task. Please try again.',
      command: 'task',
    };
  }

  // Build confirmation message
  let confirmationMessage = `✅ Task added: "${parsedTask.content}"`;

  if (parsedTask.due_date) {
    const dueDate = new Date(parsedTask.due_date);
    confirmationMessage += `\n📅 Due: ${dueDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })}`;
  }

  if (parsedTask.priority !== 'medium') {
    const priorityEmoji = parsedTask.priority === 'high' ? '🔴' : '🟢';
    confirmationMessage += `\n${priorityEmoji} Priority: ${parsedTask.priority}`;
  }

  return {
    success: true,
    message: confirmationMessage,
    command: 'task',
  };
}

