<?php

return [
    'categories' => ['Personal', 'Education', 'Fitness', 'Business', 'Work', 'Finance', 'Travel', 'Other'],

    'priorities' => ['low', 'medium', 'high'],

    'messages' => [
        'A clear plan turns a busy day into a finished one.',
        'Small steps today are what make the goal real.',
        'Focus on the next task, not the whole mountain.',
        'Progress counts, even when it is quiet.',
        'One finished task is better than a perfect plan.',
    ],

    'templates' => [
        'study' => [
            'name' => '30-Day Study Plan',
            'description' => 'A simple month of study sessions, reviews, and a final check.',
            'category' => 'Education',
            'days' => 30,
            'tasks' => [
                ['title' => 'Choose the subject and gather materials', 'day' => 1, 'priority' => 'high'],
                ['title' => 'Study session: core ideas', 'day' => 2, 'priority' => 'medium'],
                ['title' => 'Review notes from the first sessions', 'day' => 7, 'priority' => 'medium'],
                ['title' => 'Practice with questions or exercises', 'day' => 14, 'priority' => 'high'],
                ['title' => 'Second review and fill the gaps', 'day' => 21, 'priority' => 'medium'],
                ['title' => 'Final review and summarize what you learned', 'day' => 30, 'priority' => 'high'],
            ],
        ],
        'fitness' => [
            'name' => 'Fitness Plan',
            'description' => 'Four weeks of short workouts and rest days you can actually keep.',
            'category' => 'Fitness',
            'days' => 28,
            'tasks' => [
                ['title' => 'Set a realistic weekly workout goal', 'day' => 1, 'priority' => 'high'],
                ['title' => 'Workout 1', 'day' => 2, 'priority' => 'medium'],
                ['title' => 'Workout 2', 'day' => 4, 'priority' => 'medium'],
                ['title' => 'Rest and note how you feel', 'day' => 7, 'priority' => 'low'],
                ['title' => 'Workout 3', 'day' => 9, 'priority' => 'medium'],
                ['title' => 'Check progress and adjust the goal', 'day' => 28, 'priority' => 'high'],
            ],
        ],
        'programming' => [
            'name' => 'Learn Programming',
            'description' => 'A starter path: basics, a tiny project, and a review.',
            'category' => 'Education',
            'days' => 21,
            'tasks' => [
                ['title' => 'Pick a language and set up the tools', 'day' => 1, 'priority' => 'high'],
                ['title' => 'Learn variables, conditions, and loops', 'day' => 3, 'priority' => 'medium'],
                ['title' => 'Build a tiny practice project', 'day' => 10, 'priority' => 'high'],
                ['title' => 'Read your code and clean it up', 'day' => 16, 'priority' => 'medium'],
                ['title' => 'Write down what to learn next', 'day' => 21, 'priority' => 'low'],
            ],
        ],
        'saving' => [
            'name' => 'Monthly Saving Plan',
            'description' => 'Track one month of saving with a target and a weekly check.',
            'category' => 'Finance',
            'days' => 30,
            'tasks' => [
                ['title' => 'Choose a saving amount for the month', 'day' => 1, 'priority' => 'high'],
                ['title' => 'Move the first amount aside', 'day' => 1, 'priority' => 'high'],
                ['title' => 'Week 1 check-in', 'day' => 7, 'priority' => 'medium'],
                ['title' => 'Week 2 check-in', 'day' => 14, 'priority' => 'medium'],
                ['title' => 'Week 3 check-in', 'day' => 21, 'priority' => 'medium'],
                ['title' => 'Review the month and set next month', 'day' => 30, 'priority' => 'high'],
            ],
        ],
        'business' => [
            'name' => 'Business Launch Plan',
            'description' => 'The first steps to describe, test, and launch a simple offer.',
            'category' => 'Business',
            'days' => 30,
            'tasks' => [
                ['title' => 'Write who the offer is for', 'day' => 1, 'priority' => 'high'],
                ['title' => 'Describe the offer in one paragraph', 'day' => 3, 'priority' => 'high'],
                ['title' => 'List the first three tasks to deliver it', 'day' => 7, 'priority' => 'medium'],
                ['title' => 'Ask two people for feedback', 'day' => 14, 'priority' => 'medium'],
                ['title' => 'Prepare the launch message', 'day' => 21, 'priority' => 'high'],
                ['title' => 'Launch and note what happened', 'day' => 30, 'priority' => 'high'],
            ],
        ],
        'growth' => [
            'name' => 'Personal Development Plan',
            'description' => 'A short plan for one habit you want to keep.',
            'category' => 'Personal',
            'days' => 21,
            'tasks' => [
                ['title' => 'Name the habit and why it matters', 'day' => 1, 'priority' => 'high'],
                ['title' => 'Do the habit for the first time', 'day' => 1, 'priority' => 'medium'],
                ['title' => 'Check in after one week', 'day' => 7, 'priority' => 'medium'],
                ['title' => 'Remove one obstacle that got in the way', 'day' => 14, 'priority' => 'medium'],
                ['title' => 'Decide whether to continue', 'day' => 21, 'priority' => 'high'],
            ],
        ],
    ],
];
