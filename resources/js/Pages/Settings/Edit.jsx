import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Button, Card, Field, Modal, inputClass } from '@/Components/ui';

export default function Edit({ profile }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const details = useForm({ name: profile.name, email: profile.email });
    const password = useForm({ current_password: '', password: '', password_confirmation: '' });
    const preferences = useForm({ theme: profile.theme, notify_deadlines: profile.notify_deadlines });
    const removal = useForm({ password: '' });

    function saveTheme(theme) {
        preferences.setData('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
        router.put('/settings/preferences', { theme, notify_deadlines: preferences.data.notify_deadlines }, { preserveScroll: true });
    }

    return (
        <AppLayout title="Settings">
            <div className="space-y-4">
                <Card>
                    <h2 className="font-semibold">Profile</h2>
                    <form className="mt-4 space-y-4" onSubmit={(event) => { event.preventDefault(); details.put('/settings/profile'); }}>
                        <Field label="Name" error={details.errors.name}>
                            <input className={inputClass} value={details.data.name} onChange={(event) => details.setData('name', event.target.value)} />
                        </Field>
                        <Field label="Email" error={details.errors.email}>
                            <input className={inputClass} type="email" value={details.data.email} onChange={(event) => details.setData('email', event.target.value)} />
                        </Field>
                        <Button disabled={details.processing}>Save profile</Button>
                    </form>
                </Card>

                <Card>
                    <h2 className="font-semibold">Password</h2>
                    <form className="mt-4 space-y-4" onSubmit={(event) => { event.preventDefault(); password.put('/settings/password', { onSuccess: () => password.reset() }); }}>
                        <Field label="Current password" error={password.errors.current_password}>
                            <input className={inputClass} type="password" value={password.data.current_password} onChange={(event) => password.setData('current_password', event.target.value)} />
                        </Field>
                        <Field label="New password" error={password.errors.password}>
                            <input className={inputClass} type="password" value={password.data.password} onChange={(event) => password.setData('password', event.target.value)} />
                        </Field>
                        <Field label="Confirm new password">
                            <input className={inputClass} type="password" value={password.data.password_confirmation} onChange={(event) => password.setData('password_confirmation', event.target.value)} />
                        </Field>
                        <Button disabled={password.processing}>Change password</Button>
                    </form>
                </Card>

                <Card>
                    <h2 className="font-semibold">Appearance and reminders</h2>
                    <div className="mt-4 flex gap-2">
                        {['light', 'dark'].map((theme) => (
                            <button key={theme} onClick={() => saveTheme(theme)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${preferences.data.theme === theme ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-700'}`}>{theme}</button>
                        ))}
                    </div>
                    <label className="mt-4 flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={preferences.data.notify_deadlines}
                            onChange={(event) => {
                                const notify_deadlines = event.target.checked;
                                preferences.setData('notify_deadlines', notify_deadlines);
                                router.put('/settings/preferences', { theme: preferences.data.theme, notify_deadlines }, { preserveScroll: true });
                            }}
                        />
                        Show upcoming deadlines and overdue tasks
                    </label>
                </Card>

                <Card>
                    <h2 className="font-semibold text-red-600">Delete account</h2>
                    <p className="mt-2 text-sm text-slate-500">This removes your plans, tasks, and profile.</p>
                    <Button className="mt-4" variant="danger" onClick={() => setConfirmDelete(true)}>Delete account</Button>
                </Card>
            </div>
            <Modal
                open={confirmDelete}
                title="Delete your account?"
                body="Enter your password on the next step. This cannot be undone."
                confirmLabel="Continue"
                danger
                onClose={() => setConfirmDelete(false)}
                onConfirm={() => setConfirmDelete('password')}
            />
            {confirmDelete === 'password' && (
                <form className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onSubmit={(event) => { event.preventDefault(); removal.delete('/settings/account'); }}>
                    <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-slate-900">
                        <Field label="Password" error={removal.errors.password}>
                            <input className={inputClass} type="password" value={removal.data.password} onChange={(event) => removal.setData('password', event.target.value)} autoFocus />
                        </Field>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                            <Button variant="danger" disabled={removal.processing}>Delete account</Button>
                        </div>
                    </div>
                </form>
            )}
        </AppLayout>
    );
}
