import { Link } from '@inertiajs/react';
import { Flash } from '@/Components/ui';

export default function GuestLayout({ title, children }) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <Link href="/" className="mb-6 block text-center text-xl font-semibold text-primary">PlanMaker</Link>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <div className="mt-5">
                        <Flash />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
