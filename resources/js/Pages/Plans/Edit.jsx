import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button, Card, Field, inputClass } from '@/Components/ui';

export default function Edit({ plan, categories }) {
    const form = useForm({
        title: plan.title,
        description: plan.description || '',
        category: plan.category,
        start_date: plan.start_date,
        end_date: plan.end_date,
    });

    function submit(event) {
        event.preventDefault();
        form.put(`/plans/${plan.id}`);
    }

    return (
        <AppLayout title="Edit plan">
            <Card>
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Plan name" error={form.errors.title}>
                        <input className={inputClass} value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} />
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
                    <Button disabled={form.processing}>Save plan</Button>
                </form>
            </Card>
        </AppLayout>
    );
}
