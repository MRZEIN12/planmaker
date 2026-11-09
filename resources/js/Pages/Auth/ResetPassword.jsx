import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Field, inputClass } from '@/Components/ui';

export default function ResetPassword({ token, email }) {
    const form = useForm({ token, email, password: '', password_confirmation: '' });

    function submit(event) {
        event.preventDefault();
        form.post('/reset-password');
    }

    return (
        <GuestLayout title="Choose a new password">
            <form onSubmit={submit} className="space-y-4">
                <Field label="Email" error={form.errors.email}>
                    <input className={inputClass} type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} />
                </Field>
                <Field label="New password" error={form.errors.password}>
                    <input className={inputClass} type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} autoFocus />
                </Field>
                <Field label="Confirm password">
                    <input className={inputClass} type="password" value={form.data.password_confirmation} onChange={(event) => form.setData('password_confirmation', event.target.value)} />
                </Field>
                <Button className="w-full" disabled={form.processing}>Update password</Button>
            </form>
        </GuestLayout>
    );
}
