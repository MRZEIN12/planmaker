import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Field, inputClass } from '@/Components/ui';

export default function ForgotPassword() {
    const form = useForm({ email: '' });

    function submit(event) {
        event.preventDefault();
        form.post('/forgot-password');
    }

    return (
        <GuestLayout title="Reset password">
            <p className="mb-4 text-sm text-slate-500">Enter your email and we will prepare a reset link.</p>
            <form onSubmit={submit} className="space-y-4">
                <Field label="Email" error={form.errors.email}>
                    <input className={inputClass} type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} autoFocus />
                </Field>
                <Button className="w-full" disabled={form.processing}>Send reset link</Button>
            </form>
            <p className="mt-4 text-sm"><Link className="text-primary" href="/login">Back to sign in</Link></p>
        </GuestLayout>
    );
}
