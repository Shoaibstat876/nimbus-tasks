# MCP Tools Spec — Phase III

## Tool Laws
- Tools are stateless
- Tools enforce owner-only access
- Tools return structured output: { ok, message, data }

## Tools

### add_task
Input:
- user_id (string, required)
- title (string, required)
- description (string, optional)
Output:
- data: full task object

### list_tasks
Input:
- user_id (string, required)
- status (string, optional: "all" | "pending" | "completed")
Output:
- data: array of tasks

### complete_task
Input:
- user_id (string, required)
- task_id (int, required)
Output:
- data: updated task

### update_task
Input:
- user_id (string, required)
- task_id (int, required)
- title (optional)
- description (optional)
Output:
- data: updated task

### delete_task
Input:
- user_id (string, required)
- task_id (int, required)
- confirm (boolean, required)
Rule:
- confirm must be true AND agent must have asked for confirmation in prior turn
Output:
- data: deleted task summary
