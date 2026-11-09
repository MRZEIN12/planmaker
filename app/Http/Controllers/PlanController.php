<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->string('filter')->toString();
        $filter = in_array($filter, ['active', 'completed'], true) ? $filter : 'all';
        $search = trim($request->string('search')->toString());

        $plans = $request->user()->plansWithProgress()
            ->when($filter !== 'all', fn ($query) => $query->where('status', $filter))
            ->when($search !== '', fn ($query) => $query->where('title', 'like', '%'.$search.'%'))
            ->orderBy('end_date')
            ->get();

        return Inertia::render('Plans/Index', [
            'plans' => $plans->map->present()->values(),
            'filter' => $filter,
            'search' => $search,
        ]);
    }

    public function create(Request $request): Response
    {
        $key = $request->string('template')->toString();
        $template = config('planmaker.templates.'.$key);

        return Inertia::render('Plans/Create', [
            'categories' => config('planmaker.categories'),
            'templates' => collect(config('planmaker.templates'))->map(fn ($item, $id) => [
                'id' => $id,
                'name' => $item['name'],
                'description' => $item['description'],
                'category' => $item['category'],
                'days' => $item['days'],
                'tasks' => $item['tasks'],
            ])->values(),
            'selected' => $template ? $key : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $plan = $request->user()->plans()->create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'category' => $data['category'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'status' => 'active',
        ]);

        foreach ($data['tasks'] ?? [] as $task) {
            $day = max(1, (int) ($task['day'] ?? 1));
            $plan->tasks()->create([
                'title' => $task['title'],
                'priority' => $task['priority'],
                'due_date' => $plan->start_date->copy()->addDays($day - 1)->toDateString(),
            ]);
        }

        $plan->refreshStatus();

        return redirect()->route('plans.show', $plan)->with('success', 'Plan created.');
    }

    public function show(Request $request, Plan $plan): Response
    {
        $this->authorize('view', $plan);
        $plan->load(['tasks' => fn ($query) => $query->orderByRaw('is_completed asc')->orderBy('due_date')->orderBy('title')]);
        $plan->loadCount([
            'tasks',
            'tasks as completed_tasks_count' => fn ($query) => $query->where('is_completed', true),
        ]);

        return Inertia::render('Plans/Show', [
            'plan' => $plan->present(),
            'tasks' => $plan->tasks->map->present()->values(),
            'priorities' => config('planmaker.priorities'),
        ]);
    }

    public function edit(Request $request, Plan $plan): Response
    {
        $this->authorize('update', $plan);

        return Inertia::render('Plans/Edit', [
            'plan' => $plan->present(),
            'categories' => config('planmaker.categories'),
        ]);
    }

    public function update(Request $request, Plan $plan): RedirectResponse
    {
        $this->authorize('update', $plan);
        $data = $this->validated($request, false);
        $plan->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'category' => $data['category'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
        ]);

        return redirect()->route('plans.show', $plan)->with('success', 'Plan updated.');
    }

    public function destroy(Request $request, Plan $plan): RedirectResponse
    {
        $this->authorize('delete', $plan);
        $plan->delete();

        return redirect()->route('plans.index')->with('success', 'Plan deleted.');
    }

    public function duplicate(Request $request, Plan $plan): RedirectResponse
    {
        $this->authorize('view', $plan);
        $plan->load('tasks');

        $copy = $plan->replicate(['status']);
        $copy->title = 'Copy of '.$plan->title;
        $copy->status = 'active';
        $copy->user_id = $request->user()->id;
        $copy->save();

        foreach ($plan->tasks as $task) {
            $copy->tasks()->create([
                'title' => $task->title,
                'due_date' => $task->due_date,
                'remind_on' => $task->remind_on,
                'priority' => $task->priority,
            ]);
        }

        $copy->refreshStatus();

        return redirect()->route('plans.show', $copy)->with('success', 'Plan duplicated.');
    }

    private function validated(Request $request, bool $withTasks = true): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category' => ['required', Rule::in(config('planmaker.categories'))],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ];

        if ($withTasks) {
            $rules['tasks'] = ['array', 'max:100'];
            $rules['tasks.*.title'] = ['required', 'string', 'max:160'];
            $rules['tasks.*.priority'] = ['required', Rule::in(config('planmaker.priorities'))];
            $rules['tasks.*.day'] = ['nullable', 'integer', 'min:1', 'max:3650'];
        }

        return $request->validate($rules);
    }
}
