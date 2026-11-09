import { Link, router, useForm } from '@inertiajs/react';
import { Copy, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Button, Card, Field, Modal, Progress, formatDate, inputClass } from '@/Components/ui';

export default function Show({ plan, tasks, priorities }) {
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(null);
    const [removing, setRemoving] = useState(null);
    const [removePlan, setRemovePlan] = useState(false);
    const add = useForm({ title: '', due_date: '', remind_on: '', priority: 'medium' });
    const edit = useForm({ title: '', due_date: '', remind_on: '', priority: 'medium' });

    function startEdit(task) {
        setEditing(task.id);
        edit.setData({ title: task.title, due_date: task.due_date || '', remind_on: task.remind_on || '', priority: task.priority });
    }

    return (
        <AppLayout title={plan.title}>
            <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="text-sm text-slate-500">{plan.category} · {formatDate(plan.start_date)} – {formatDate(plan.end_date)}</p>
                        {plan.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/plans/${plan.id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700"><Pencil className="h-4 w-4" /> Edit</Link>
                        <Button variant="ghost" onClick={() => router.post(`/plans/${plan.id}/duplicate`)}><Copy className="h-4 w-4" /> Duplicate</Button>
                        <Button variant="danger" onClick={() => setRemovePlan(true)}><Trash2 className="h-4 w-4" /> Delete</Button>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="mb-1 flex justify-between text-sm text-slate-500">
                        <span>{plan.progress}% complete</span>
                        <span>{plan.completed_tasks}/{plan.total_tasks} tasks</span>
                    </div>
                    <Progress value={plan.progress} />
                </div>
            </Card>

            <div className="mt-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <Button variant="ghost" onClick={() => setAdding((value) => !value)}><Plus className="h-4 w-4" /> Add Task</Button>
            </div>

            {adding && (
                <Card className="mt-3">
                    <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); add.post(`/plans/${plan.id}/tasks`, { preserveScroll: true, onSuccess: () => { add.reset(); setAdding(false); } }); }}>
                        <Field label="Task" error={add.errors.title}>
                            <input className={inputClass} value={add.data.title} onChange={(event) => add.setData('title', event.target.value)} />
                        </Field>
                        <Field label="Priority" error={add.errors.priority}>
                            <select className={inputClass} value={add.data.priority} onChange={(event) => add.setData('priority', event.target.value)}>
                                {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                            </select>
                        </Field>
                        <Field label="Due date" error={add.errors.due_date}>
                            <input className={inputClass} type="date" value={add.data.due_date} onChange={(event) => add.setData('due_date', event.target.value)} />
                        </Field>
                        <Field label="Reminder" error={add.errors.remind_on}>
                            <input className={inputClass} type="date" value={add.data.remind_on} onChange={(event) => add.setData('remind_on', event.target.value)} />
                        </Field>
                        <Button disabled={add.processing}>Save task</Button>
                    </form>
                </Card>
            )}

            <div className="mt-3 space-y-2">
                {tasks.length === 0 && <p className="text-sm text-slate-500">No tasks yet. Add the first one.</p>}
                {tasks.map((task) => (
                    <Card key={task.id} className="p-4">
                        <div className="flex items-start gap-3">
                            <input type="checkbox" checked={task.is_completed} onChange={() => router.patch(`/tasks/${task.id}/toggle`, {}, { preserveScroll: true })} className="mt-1" aria-label={`Mark ${task.title}`} />
                            <div className="min-w-0 flex-1">
                                <p className={task.is_completed ? 'text-slate-400 line-through' : 'font-medium'}>{task.title}</p>
                                <p className="mt-1 text-xs capitalize text-slate-500">{task.priority} · Due {formatDate(task.due_date)}{task.remind_on ? ` · Reminder ${formatDate(task.remind_on)}` : ''}</p>
                            </div>
                            <button className="text-sm text-primary" onClick={() => startEdit(task)}>Edit</button>
                            <button className="text-sm text-red-600" onClick={() => setRemoving(task)}>Delete</button>
                        </div>
                        {editing === task.id && (
                            <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); edit.put(`/tasks/${task.id}`, { preserveScroll: true, onSuccess: () => setEditing(null) }); }}>
                                <Field label="Task" error={edit.errors.title}>
                                    <input className={inputClass} value={edit.data.title} onChange={(event) => edit.setData('title', event.target.value)} />
                                </Field>
                                <Field label="Priority">
                                    <select className={inputClass} value={edit.data.priority} onChange={(event) => edit.setData('priority', event.target.value)}>
                                        {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                                    </select>
                                </Field>
                                <Field label="Due date">
                                    <input className={inputClass} type="date" value={edit.data.due_date} onChange={(event) => edit.setData('due_date', event.target.value)} />
                                </Field>
                                <Field label="Reminder">
                                    <input className={inputClass} type="date" value={edit.data.remind_on} onChange={(event) => edit.setData('remind_on', event.target.value)} />
                                </Field>
                                <Button disabled={edit.processing}>Save changes</Button>
                            </form>
                        )}
                    </Card>
                ))}
            </div>

            <Modal open={Boolean(removing)} title="Delete this task?" body={removing ? removing.title : ''} confirmLabel="Delete task" danger onClose={() => setRemoving(null)} onConfirm={() => router.delete(`/tasks/${removing.id}`, { preserveScroll: true, onFinish: () => setRemoving(null) })} />
            <Modal open={removePlan} title="Delete this plan?" body="The plan and every task in it will be removed." confirmLabel="Delete plan" danger onClose={() => setRemovePlan(false)} onConfirm={() => router.delete(`/plans/${plan.id}`)} />
        </AppLayout>
    );
}
