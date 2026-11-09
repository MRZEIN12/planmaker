<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Notifications\TaskReminder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $this->syncReminders($user);

        $messages = config('planmaker.messages');
        $hour = now()->hour;
        $greeting = $hour < 12 ? 'Good morning' : ($hour < 17 ? 'Good afternoon' : 'Good evening');

        $plans = $user->plansWithProgress()->latest()->get();
        $active = $plans->where('status', 'active')->take(6)->values();

        $today = Task::query()
            ->whereHas('plan', fn ($query) => $query->where('user_id', $user->id))
            ->whereDate('due_date', today())
            ->with('plan:id,title')
            ->orderBy('is_completed')
            ->orderBy('title')
            ->get();

        $attention = collect();
        if ($user->notify_deadlines) {
            $attention = Task::query()
                ->whereHas('plan', fn ($query) => $query->where('user_id', $user->id))
                ->where('is_completed', false)
                ->where(function ($query) {
                    $query->whereDate('due_date', '<', today())
                        ->orWhereBetween('due_date', [today(), today()->addDays(7)])
                        ->orWhereDate('remind_on', '<=', today());
                })
                ->with('plan:id,title')
                ->orderBy('due_date')
                ->limit(8)
                ->get();
        }

        return Inertia::render('Dashboard', [
            'greeting' => $greeting,
            'date' => now()->format('l, F j, Y'),
            'message' => $messages[now()->dayOfYear % count($messages)],
            'stats' => [
                'active_plans' => $plans->where('status', 'active')->count(),
                'completed_tasks' => (int) $plans->sum('completed_tasks_count'),
                'pending_tasks' => (int) $plans->sum(fn ($plan) => $plan->tasks_count - $plan->completed_tasks_count),
            ],
            'today' => $today->map->present()->values(),
            'plans' => $active->map->present()->values(),
            'attention' => $attention->map->present()->values(),
        ]);
    }

    private function syncReminders($user): void
    {
        if (! $user->notify_deadlines) {
            return;
        }

        $tasks = Task::query()
            ->whereHas('plan', fn ($query) => $query->where('user_id', $user->id))
            ->where('is_completed', false)
            ->where(function ($query) {
                $query->whereDate('due_date', '<=', today()->addDays(1))
                    ->orWhereDate('remind_on', '<=', today());
            })
            ->with('plan:id,title')
            ->get();

        $sent = $user->notifications()
            ->whereDate('created_at', today())
            ->get()
            ->map(fn ($notification) => $notification->data['task_id'] ?? null)
            ->filter()
            ->all();

        foreach ($tasks as $task) {
            if (! in_array($task->id, $sent, true)) {
                $user->notify(new TaskReminder($task));
            }
        }
    }
}
