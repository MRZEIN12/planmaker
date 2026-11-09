import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button, Card, Field, inputClass } from '@/Components/ui';

function iso(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

export default function Create({ categories, templates, selected }) {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const chosen = templates.find((item) => item.id === selected);

    const form = useForm({
        title: chosen?.name || '',
        description: chosen?.description || '',
        category: chosen?.category || categories[0],
        start_date: iso(start),
        end_date: chosen ? iso(new Date(start.getTime() + chosen.days * 86400000)) : iso(end),
        tasks: chosen?.tasks || [],
    });

    function applyTemplate(template) {
        const from = new Date();
        form.setData({
            title: template.name,
            description: template.description,
            category: template.category,
            start_date: iso(from),
            end_date: iso(new Date(from.getTime() + template.days * 86400000)),
            tasks: template.tasks,
        });
    }

    function submit(event) {
        event.preventDefault();
        form.post('/plans');
    }

    return (
        <AppLayout title="Create Plan">
            <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                    <button key={template.id} type="button" onClick={() => applyTemplate(template)} className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-primary dark:border-slate-800 dark:bg-slate-900">
                        <span className="font-semibold">{template.name}</span>
                        <span className="mt-1 block text-sm text-slate-500">{template.category} · {template.days} days</span>
                    </button>
                ))}
            </div>
            <Card>
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Plan name" error={form.errors.title}>
                        <input className={inputClass} value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} autoFocus />
                    </Field>
                    <Field label="Description" error={form.errors.description}>
                        <textarea className={inputClass} rows="3" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Category" error={form.errors.category}>
                            <select className={inputClass} value={form.data.category} onChange={(event) => form.setData('category', event.target.value)}>
                                {categories.map((category) => <option key={category}>{category}</option>)}
                            </select>
                        </Field>
                        <Field label="Start date" error={form.errors.start_date}>
                            <input className={inputClass} type="date" value={form.data.start_date} onChange={(event) => form.setData('start_date', event.target.value)} />
                        </Field>
                        <Field label="End date" error={form.errors.end_date}>
                            <input className={inputClass} type="date" value={form.data.end_date} onChange={(event) => form.setData('end_date', event.target.value)} />
                        </Field>
                    </div>
                    {form.data.tasks.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-medium">Tasks from the template</p>
                            <ul className="space-y-2">
                                {form.data.tasks.map((task, index) => (
                                    <li key={`${task.title}-${index}`}>
                                        <input
                                            className={inputClass}
                                            value={task.title}
                                            onChange={(event) => {
                                                const tasks = [...form.data.tasks];
                                                tasks[index] = { ...task, title: event.target.value };
                                                form.setData('tasks', tasks);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button disabled={form.processing}>Create Plan</Button>
                </form>
            </Card>
        </AppLayout>
    );
}
