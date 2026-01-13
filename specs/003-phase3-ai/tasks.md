# Phase III Tasks — Implementation Checklist

## A) DB
- [ ] Add Conversation model + migration/creation
- [ ] Add Message model + migration/creation

## B) MCP Tools
- [ ] Implement add_task tool
- [ ] Implement list_tasks tool
- [ ] Implement complete_task tool
- [ ] Implement update_task tool
- [ ] Implement delete_task tool with confirm flag

## C) Chat Endpoint
- [ ] POST /api/{user_id}/chat endpoint
- [ ] Load history from DB via conversation_id
- [ ] Run agent with Agents SDK
- [ ] Tool calling through MCP
- [ ] Store user + assistant messages to DB

## D) Frontend Chat UI
- [ ] Add ChatKit UI page (protected route)
- [ ] Sends messages to backend chat endpoint
- [ ] Maintains conversation_id in browser storage/state
- [ ] Reload chat history on refresh

## E) Reliability + Proof
- [ ] Restart backend proof (stateless)
- [ ] Refresh browser proof (history loads)
- [ ] Owner-only proof (user A cannot see user B)
- [ ] Destructive confirmation proof (delete/update)

## F) Submission
- [ ] README Phase III instructions
- [ ] Phase III gate checklist completed
- [ ] 90-second demo script recorded
