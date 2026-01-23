✅ Nimbus Phase 3 – Deployment & Reusable Intelligence Proof

(Official 90-Second Demonstration Script)

Step 1: Wake Backend Service (Render)

First, I wake up the deployed backend service hosted on Render using the health check endpoint.

https://nimbus-backend-sc34.onrender.com/api/health

As shown, the API responds successfully, confirming that the backend service is active and running.

Step 2: Backend Verification – Swagger UI

Next, I open the Swagger UI to verify all backend endpoints.

https://nimbus-backend-sc34.onrender.com/docs

These are all available backend endpoints, fully deployed and documented.
This confirms that the backend is production-ready and accessible.

Step 3: Frontend Deployment (Vercel)

Now, I open the deployed frontend application hosted on Vercel.

https://nimbus-tasks-web.vercel.app/login

Step 4: Authentication Proof

I log in using a test user account.

The login is successful, which confirms secure authentication and frontend–backend connectivity.

Step 5: Task Management (CRUD Proof)

On the user interface, I demonstrate full task management functionality.

I show:

Adding tasks

Updating tasks

Marking tasks as completed

Deleting tasks

All operations work correctly with the deployed backend.

🧠 Step 6: Reusable Intelligence – Intent Priority (English)

Now, I demonstrate the chatbot’s reusable intelligence system.

First, I explain the intent priority order used by the system:

Delete

Complete

Update

List

Add

This priority order ensures deterministic and correct intent detection.

English Demonstration (Task Set 1)

I now give commands in English using predefined tasks.

Add
“Add a new task called Neon Blast.”

→ The chatbot correctly detects the add intent and creates the task.

Add
“Add a task named Milk.”

→ The chatbot detects the add intent and creates the task.

Add
“Create a new task called Water.”

→ The chatbot detects the add intent and creates the task.

List
“Show all my tasks.”

→ The chatbot detects the list intent and displays:

Neon Blast

Milk

Water

Update
“Update the task Milk to Buy Milk.”

→ The chatbot detects the update intent and modifies the task.

Complete
“Mark Water as completed.”

→ The chatbot detects the complete intent and marks the task as done.

Delete
“Delete the task Neon Blast.”

→ The chatbot detects the delete intent and removes the task.

🧠 Step 7: Reusable Intelligence – Urdu Demonstration (Different Tasks)

Now, I repeat the same task operations using different task names in Urdu, proving multilingual and independent intent understanding.

Urdu Demonstration (Task Set 2)

Add
"ایک نیا کام شامل کرو: بل بجلی جمع کرو"

→ add intent detected correctly.

Add
"ایک نیا کام شامل کرو: کتاب خریدنی ہے"

→ add intent detected correctly.

Add
"ایک نیا کام شامل کرو: دفتر جانا ہے"

→ add intent detected correctly.

List
"میرے سارے کام دکھاؤ"

→ list intent detected and all Urdu tasks are displayed.

Update
"کتاب خریدنی ہے والے کام کا نام بدل دو"

→ update intent detected and task is updated.

Complete
"دفتر جانا ہے والا کام مکمل کر دو"

→ complete intent detected and task is marked as done.

Delete
"بل بجلی جمع کرو والا کام حذف کر دو"

→ delete intent detected and task is removed.

🧠 Step 8: Reusable Intelligence Proof (Explanation)

Now, I ask the chatbot how it understands commands.

"تم اردو اور انگریزی دونوں کیسے سمجھتے ہو؟"

The chatbot explains that it uses reusable intelligence skills for:

deterministic intent detection

language routing between English and Urdu

This confirms that the system is intelligent, modular, and reusable, not hard-coded.

Step 9: Final State Verification

Finally, I open the tasks page to show the final state after all operations.

https://nimbus-tasks-web.vercel.app/tasks

This confirms that the frontend and backend are fully deployed, connected, and working correctly.

✅ Final Confirmation

Nimbus Phase 3 successfully demonstrates:

Full deployment on Render and Vercel

Secure authentication

Complete task management

Deterministic, reusable AI intelligence

Multilingual support (English and Urdu)