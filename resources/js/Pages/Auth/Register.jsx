import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Field, inputClass } from '@/Components/ui';

export default function Register() {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    function submit(event) {
        event.preventDefault();
        form.post('/register');
    }

    return (
        <GuestLayout title="Create account">
            <form onSubmit={submit} className="space-y-4">
                <Field label="Name" error={form.errors.name}>
                    <input className={inputClass} value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} autoFocus />
                </Field>
                <Field label="Email" error={form.errors.email}>
                    <input className={inputClass} type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} />
                </Field>
                <Field label="Password" error={form.errors.password}>
                    <input className={inputClass} type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} />
                </Field>
                <Field label="Confirm password" error={form.errors.password_confirmation}>
                    <input className={inputClass} type="password" value={form.data.password_confirmation} onChange={(event) => form.setData('password_confirmation', event.target.value)} />
                </Field>
                <Button className="w-full" disabled={form.processing}>Create account</Button>
            </form>
            <p className="mt-4 text-sm text-slate-500">
                Already have an account? <Link className="font-semibold text-primary" href="/login">Sign in</Link>
            </p>
        </GuestLayout>
    );
}
