<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanMakerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_sent_to_login(): void
    {
        $this->get('/plans')->assertRedirect('/login');
        $this->get('/login')->assertOk();
    }

    public function test_a_user_can_register_and_open_the_dashboard(): void
    {
        $response = $this->post('/register', [
            'name' => 'Hasan Zein',
            'email' => 'hasan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();
        $this->get('/dashboard')->assertOk();
    }

    public function test_progress_and_ownership(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();

        $plan = Plan::create([
            'user_id' => $owner->id,
            'title' => 'Learn Laravel',
            'description' => 'A short plan',
            'category' => 'Education',
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'status' => 'active',
        ]);

        $first = $plan->tasks()->create(['title' => 'Install PHP', 'priority' => 'high']);
        $plan->tasks()->create(['title' => 'Write a route', 'priority' => 'medium']);
        $plan->refresh();
        $plan->loadCount([
            'tasks',
            'tasks as completed_tasks_count' => fn ($query) => $query->where('is_completed', true),
        ]);
        $this->assertSame(0, $plan->progressPercent());

        $this->actingAs($owner)->patch(route('tasks.toggle', $first))->assertRedirect();
        $plan->refresh();
        $this->assertSame('active', $plan->status);

        $plan->loadCount([
            'tasks',
            'tasks as completed_tasks_count' => fn ($query) => $query->where('is_completed', true),
        ]);
        $this->assertSame(50, $plan->progressPercent());

        $plan->tasks()->where('is_completed', false)->first()->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
        $plan->refresh();
        $this->assertSame('completed', $plan->status);

        $this->actingAs($other)->get(route('plans.show', $plan))->assertForbidden();
    }
}
