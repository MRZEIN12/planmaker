import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export function formatDate(value) {
    if (!value) return 'No date';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return 'No date';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
    const styles = {
        primary: 'bg-primary text-white hover:bg-blue-700',
        ghost: 'bg-white text-ink border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700',
        danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50 dark:bg-slate-900 dark:border-red-900',
    };

    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
            {children}
            {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
        </label>
    );
}

export const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950';

export function Card({ children, className = '' }) {
    return <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>{children}</section>;
}

export function Progress({ value }) {
    return (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
        </div>
    );
}

export function Flash() {
    const { flash } = usePage().props;
    if (!flash?.success && !flash?.reset_url) return null;

    return (
        <div className="mb-4 space-y-2">
            {flash.success && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-100">{flash.success}</p>}
            {flash.reset_url && (
                <p className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Local reset link: <a className="font-semibold text-primary" href={flash.reset_url}>{flash.reset_url}</a>
                </p>
            )}
        </div>
    );
}

export function Empty({ icon: Icon, title, body, action }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
            <Icon className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{body}</p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export function Modal({ open, title, body, confirmLabel = 'Confirm', danger = false, onConfirm, onClose }) {
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (event) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-slate-500">{body}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
                </div>
            </div>
        </div>
    );
}
