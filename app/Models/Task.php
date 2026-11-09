<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['plan_id', 'title', 'due_date', 'remind_on', 'priority', 'is_completed', 'completed_at'])]
class Task extends Model
{
    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'remind_on' => 'date',
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        $refresh = function (Task $task): void {
            $task->plan?->refreshStatus();
        };

        static::saved($refresh);
        static::deleted($refresh);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function present(): array
    {
        return [
            'id' => $this->id,
            'plan_id' => $this->plan_id,
            'title' => $this->title,
            'due_date' => $this->due_date?->toDateString(),
            'remind_on' => $this->remind_on?->toDateString(),
            'priority' => $this->priority,
            'is_completed' => $this->is_completed,
            'plan' => $this->relationLoaded('plan') ? $this->plan?->title : null,
        ];
    }
}
