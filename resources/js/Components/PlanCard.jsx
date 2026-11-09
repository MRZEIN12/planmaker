import { Link, router } from '@inertiajs/react';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card, Modal, Progress, formatDate } from '@/Components/ui';

export default function PlanCard({ plan, onDelete }) {
    const [open, setOpen] = useState(false);

    return (
        <Card>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="font-semibold">{plan.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{plan.category}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">{plan.status}</span>
            </div>
            {plan.description && <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>}
            <p className="mt-3 text-xs text-slate-500">{formatDate(plan.start_date)} – {formatDate(plan.end_date)}</p>
            <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>{plan.progress}%</span>
                    <span>{plan.completed_tasks}/{plan.total_tasks} tasks</span>
                </div>
                <Progress value={plan.progress} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/plans/${plan.id}`} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">View Plan</Link>
                <Link href={`/plans/${plan.id}/edit`} aria-label={`Edit ${plan.title}`} className="rounded-lg border border-slate-200 p-2 dark:border-slate-700"><Pencil className="h-4 w-4" /></Link>
                <button aria-label={`Duplicate ${plan.title}`} onClick={() => router.post(`/plans/${plan.id}/duplicate`)} className="rounded-lg border border-slate-200 p-2 dark:border-slate-700"><Copy className="h-4 w-4" /></button>
                <button aria-label={`Delete ${plan.title}`} onClick={() => setOpen(true)} className="rounded-lg border border-slate-200 p-2 text-red-600 dark:border-slate-700"><Trash2 className="h-4 w-4" /></button>
            </div>
            <Modal
                open={open}
                title="Delete this plan?"
                body="The plan and its tasks will be removed. This cannot be undone."
                confirmLabel="Delete plan"
                danger
                onClose={() => setOpen(false)}
                onConfirm={() => onDelete ? onDelete(plan) : router.delete(`/plans/${plan.id}`)}
            />
        </Card>
    );
}
