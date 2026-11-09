import { Link, router, usePage } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, Empty, Progress, formatDate } from '@/Components/ui';

export default function Dashboard({ greeting, date, message, stats, today, plans, attention }) {
    const name = usePage().props.auth?.user?.name?.split(' ')[0];
    const cards = [
        ['Active Plans', stats.active_plans],
        ['Completed Tasks', stats.completed_tasks],
        ['Pending Tasks', stats.pending_tasks],
    ];

    return (
        <AppLayout title="Home">
            <p className="text-sm text-slate-500">{date}</p>
            <h2 className="mt-1 text-xl font-semibold">{greeting}{name ? `, ${name}` : ''}.</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {cards.map(([label, value]) => (
                    <Card key={label}>
                        <p className="text-sm text-slate-500">{label}</p>
                        <p className="mt-2 text-3xl font-semibold">{value}</p>
                    </Card>
                ))}
            </div>

            <section className="mt-8">
                <h2 className="text-lg font-semibold">Today’s tasks</h2>
                {today.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">Nothing is due today.</p>
                ) : (
                    <Card className="mt-3 divide-y divide-slate-100 p-0 dark:divide-slate-800">
                        {today.map((task) => (
                            <label key={task.id} className="flex cursor-pointer items-start gap-3 px-5 py-3">
                                <input type="checkbox" checked={task.is_completed} onChange={() => router.patch(`/tasks/${task.id}/toggle`, {}, { preserveScroll: true })} className="mt-1" />
                                <span>
                                    <span className={task.is_completed ? 'text-slate-400 line-through' : 'font-medium'}>{task.title}</span>
                                    <span className="mt-0.5 block text-xs text-slate-500">{task.plan} · {formatDate(task.due_date)}</span>
                                </span>
                            </label>
                        ))}
                    </Card>
                )}
            </section>

            {attention.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-lg font-semibold">Upcoming and overdue</h2>
                    <ul className="mt-3 space-y-2">
                        {attention.map((task) => (
                            <li key={task.id}>
                                <Link href={`/plans/${task.plan_id}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm hover:border-primary dark:border-slate-800 dark:bg-slate-900">
                                    <span>{task.title}<span className="block text-xs text-slate-500">{task.plan}</span></span>
                                    <span className="text-xs text-slate-500">{formatDate(task.due_date)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="mt-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Active plans</h2>
                    <Link href="/plans" className="text-sm font-semibold text-primary">View all</Link>
                </div>
                {plans.length === 0 ? (
                    <div className="mt-3">
                        <Empty icon={ClipboardList} title="No active plans" body="Create a plan and add the first task. It only takes a minute." action={<Link href="/plans/create" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Create Plan</Link>} />
                    </div>
                ) : (
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {plans.map((plan) => (
                            <Card key={plan.id}>
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="font-semibold">{plan.title}</h3>
                                    <span className="text-xs text-slate-500">{plan.category}</span>
                                </div>
                                <div className="mt-4">
                                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                                        <span>{plan.progress}%</span>
                                        <span>{plan.completed_tasks}/{plan.total_tasks}</span>
                                    </div>
                                    <Progress value={plan.progress} />
                                </div>
                                <Link href={`/plans/${plan.id}`} className="mt-4 inline-block text-sm font-semibold text-primary">View Plan</Link>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
