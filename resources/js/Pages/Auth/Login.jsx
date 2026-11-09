import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Field, inputClass } from '@/Components/ui';

export default function Login() {
    const form = useForm({ email: '', password: '', remember: false });

    function submit(event) {
        event.preventDefault();
        form.post('/login');
    }

    return (
        <GuestLayout title="Sign in">
            <form onSubmit={submit} className="space-y-4">
                <Field label="Email" error={form.errors.email}>
                    <input className={inputClass} type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} autoFocus />
                </Field>
                <Field label="Password" error={form.errors.password}>
                    <input className={inputClass} type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input type="checkbox" checked={form.data.remember} onChange={(event) => form.setData('remember', event.target.checked)} />
                    Remember me
                </label>
                <Button className="w-full" disabled={form.processing}>Sign in</Button>
            </form>
            <p className="mt-4 text-sm text-slate-500">
                <Link className="text-primary" href="/forgot-password">Forgot password?</Link>
            </p>
            <p className="mt-2 text-sm text-slate-500">
                New here? <Link className="font-semibold text-primary" href="/register">Create an account</Link>
            </p>
        </GuestLayout>
    );
}
