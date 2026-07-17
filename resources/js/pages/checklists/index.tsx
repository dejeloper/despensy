import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { Checklist } from '@/types/business/checklist';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Listas de compra', href: '#' },
];

interface ChecklistIndexProps {
    checklists: Checklist[];
}

export default function ChecklistIndex({ checklists }: ChecklistIndexProps) {
    const { data, setData, post, processing, reset } = useForm({ name: '' });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('checklists.store'), { onSuccess: () => reset() });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Listas de compra" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Listas de compra</h1>
                    <Link href={route('despensy.index')}>
                        <Button variant="outline" size="sm">
                            Ver lista activa
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardContent>
                        <form onSubmit={submit} className="flex items-end gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Nombre de la lista (opcional)"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                />
                            </div>
                            <Button type="submit" disabled={processing}>
                                <Plus className="mr-1 h-4 w-4" /> Nueva lista
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-2">
                    {checklists.length === 0 && <p className="text-sm text-muted-foreground">No hay listas todavía.</p>}
                    {checklists.map((checklist) => (
                        <Link key={checklist.id} href={route('checklists.show', checklist.id)}>
                            <Card className="transition-colors hover:bg-accent">
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{checklist.name || `Lista #${checklist.id}`}</p>
                                        <p className="text-xs text-muted-foreground">{checklist.created_at}</p>
                                    </div>
                                    <Badge style={{ backgroundColor: checklist.state?.color || undefined }}>{checklist.state?.name}</Badge>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
