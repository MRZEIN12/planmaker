import { Link, router, usePage } from '@inertiajs/react';
import { CalendarPlus, Home, ListChecks, LogOut, Menu, Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Flash } from '@/Components/ui';

const links = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/plans', label: 'My Plans', icon: ListChecks },
    { href: '/plans/create', label: 'Create Plan', icon: CalendarPlus },
    { href: '/settings', label: 'Settings', icon: Settings },
];

function isCurrent(url, href) {
    const path = url.split('?')[0];
    if (href === '/plans') {
        return path === '/plans' || (path.startsWith('/plans/') && path !== '/plans/create');
    }
    return path === href;
}

export default function AppLayout({ title, children }) {
    const { auth } = usePage().props;
    const pageUrl = usePage().url;
    const [open, setOpen] = useState(false);
    const user = auth?.user;

    useEffect(() => {
        const theme = user?.theme || 'light';
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [user?.theme]);

    const initial = user?.name?.slice(0, 1).toUpperCase() || 'P';

    const nav = (
        <nav className="flex flex-1 flex-col gap-1">
            {links.map(({ href, label, icon: Icon }) => (
                <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isCurrent(pageUrl, href) ? 'bg-blue-50 text-primary dark:bg-blue-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                >
                    <Icon className="h-4 w-4" />
                    {label}
                </Link>
            ))}
        </nav>
    );

    return (
        <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
            <aside className="hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col lg:p-4">
                <Link href="/dashboard" className="px-3 py-2 text-lg font-semibold text-primary">PlanMaker</Link>
                <div className="mt-6 flex flex-1 flex-col">{nav}</div>
                <div className="mt-4 flex items-center gap-3 border-t border-slate-200 px-2 pt-4 dark:border-slate-800">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 font-semibold text-primary dark:bg-blue-950">{initial}</span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{user?.name}</p>
                        <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <button aria-label="Log out" onClick={() => router.post('/logout')} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </aside>

            <div>
                <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
                    <Link href="/dashboard" className="font-semibold text-primary">PlanMaker</Link>
                    <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-lg p-2"><Menu className="h-5 w-5" /></button>
                </header>
                {open && (
                    <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)}>
                        <div className="flex h-full w-72 flex-col bg-white p-4 dark:bg-slate-900" onClick={(event) => event.stopPropagation()}>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="font-semibold text-primary">PlanMaker</span>
                                <button aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
                            </div>
                            {nav}
                            <p className="mt-6 truncate text-sm font-semibold">{user?.name}</p>
                            <button onClick={() => router.post('/logout')} className="mt-3 text-left text-sm text-slate-500">Log out</button>
                        </div>
                    </div>
                )}
                <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <div className="mt-5">
                        <Flash />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
