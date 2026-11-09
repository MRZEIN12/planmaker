import { Link, router } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PlanCard from '@/Components/PlanCard';
import { Empty, inputClass } from '@/Components/ui';

const filters = [
    ['all', 'All Plans'],
    ['active', 'Active'],
    ['completed', 'Completed'],
];

export default function Index({ plans, filter, search }) {
    function visit(nextFilter, nextSearch) {
        router.get('/plans', { filter: nextFilter, search: nextSearch }, { preserveState: true, replace: true });
    }

    return (
        <AppLayout title="My Plans">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                    {filters.map(([value, label]) => (
                        <button key={value} onClick={() => visit(value, search)} className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === value ? 'bg-primary text-white' : 'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300'}`}>{label}</button>
                    ))}
                </div>
                <Link href="/plans/create" className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white">Create New Plan</Link>
            </div>
            <form className="mb-5" onSubmit={(event) => { event.preventDefault(); visit(filter, event.currentTarget.search.value); }}>
                <input name="search" className={inputClass} placeholder="Search plans, then press Enter" defaultValue={search} />
            </form>
            {plans.length === 0 ? (
                <Empty icon={ClipboardList} title="No plans yet" body="Start with a blank plan or pick a template. You can change everything later." action={<Link href="/plans/create" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Create New Plan</Link>} />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
                </div>
            )}
        </AppLayout>
    );
}
