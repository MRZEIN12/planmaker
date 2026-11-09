<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskReminder extends Notification
{
    use Queueable;

    public function __construct(public Task $task) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $overdue = $this->task->due_date && $this->task->due_date->isBefore(today());

        return [
            'task_id' => $this->task->id,
            'plan_id' => $this->task->plan_id,
            'title' => $this->task->title,
            'plan' => $this->task->plan?->title,
            'due_date' => $this->task->due_date?->toDateString(),
            'message' => $overdue
                ? $this->task->title.' is overdue.'
                : $this->task->title.' is coming up.',
        ];
    }
}
