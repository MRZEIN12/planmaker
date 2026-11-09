<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function update(User $user, Task $task): bool
    {
        return (int) $task->plan?->user_id === (int) $user->id;
    }

    public function delete(User $user, Task $task): bool
    {
        return (int) $task->plan?->user_id === (int) $user->id;
    }
}
