<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'title', 'description', 'category', 'start_date', 'end_date', 'status'])]
class Plan extends Model
{
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function progressPercent(): int
    {
        $total = $this->tasks_count ?? $this->tasks()->count();

        if ($total === 0) {
            return 0;
        }

        $done = $this->completed_tasks_count ?? $this->tasks()->where('is_completed', true)->count();

        return (int) round(($done / $total) * 100);
    }

    public function refreshStatus(): void
    {
        $total = $this->tasks()->count();
        $done = $this->tasks()->where('is_completed', true)->count();

        $this->update([
            'status' => $total > 0 && $done === $total ? 'completed' : 'active',
        ]);
    }

    public function present(): array
    {
        $total = (int) ($this->tasks_count ?? $this->tasks()->count());
        $done = (int) ($this->completed_tasks_count ?? $this->tasks()->where('is_completed', true)->count());

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'status' => $this->status,
            'progress' => $total === 0 ? 0 : (int) round(($done / $total) * 100),
            'completed_tasks' => $done,
            'total_tasks' => $total,
        ];
    }
}
