<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    public function store(Request $request, Plan $plan): RedirectResponse
    {
        $this->authorize('update', $plan);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'due_date' => ['nullable', 'date'],
            'remind_on' => ['nullable', 'date'],
            'priority' => ['required', Rule::in(config('planmaker.priorities'))],
        ]);

        $plan->tasks()->create($data);

        return back()->with('success', 'Task added.');
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'due_date' => ['nullable', 'date'],
            'remind_on' => ['nullable', 'date'],
            'priority' => ['required', Rule::in(config('planmaker.priorities'))],
        ]);

        $task->update($data);

        return back()->with('success', 'Task updated.');
    }

    public function toggle(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $done = ! $task->is_completed;
        $task->update([
            'is_completed' => $done,
            'completed_at' => $done ? now() : null,
        ]);

        return back();
    }

    public function destroy(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);
        $task->delete();

        return back()->with('success', 'Task deleted.');
    }
}
