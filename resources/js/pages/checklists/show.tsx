import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { Checklist } from '@/types/business/checklist';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface ChecklistShowProps {
    checklist: Checklist;
}

export default function ChecklistShow({ checklist }: ChecklistShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inicio', href: '/' },
        { title: 'Listas de compra', href: route('checklists.index') },
        { title: checklist.name || `Lista #${checklist.id}`, href: '#' },
    ];

    const boughtItems = checklist.items?.filter((item) => item.was_bought) ?? [];
    const pendingItems = checklist.items?.filter((item) => !item.was_bought) ?? [];
    const total = boughtItems.reduce((sum, item) => sum + (item.total_price ?? 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={checklist.name || `Lista #${checklist.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{checklist.name || `Lista #${checklist.id}`}</h1>
                        <div className="mt-1 flex items-center gap-2">
                            <Badge style={{ backgroundColor: checklist.state?.color || undefined }}>{checklist.state?.name}</Badge>
                            <span className="text-xs text-muted-foreground">{checklist.created_at}</span>
                        </div>
                    </div>
                    <Link href={route('checklists.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver
                        </Button>
                    </Link>
                </div>

                {boughtItems.length > 0 && (
                    <Card>
                        <CardContent className="flex items-center justify-between">
                            <p className="font-medium">Total comprado</p>
                            <p className="text-lg font-semibold">${total.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                )}

                <div>
                    <h2 className="mb-2 text-lg font-medium">Comprados ({boughtItems.length})</h2>
                    <div className="flex flex-col gap-2">
                        {boughtItems.length === 0 && <p className="text-sm text-muted-foreground">Nada marcado como comprado.</p>}
                        {boughtItems.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{item.product?.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.quantity_bought} {item.unit_bought?.short_name} en {item.place?.name} · {item.purchase_date}
                                        </p>
                                    </div>
                                    <Badge variant="secondary">${item.unit_price}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {pendingItems.length > 0 && (
                    <div>
                        <h2 className="mb-2 text-lg font-medium">Sin comprar ({pendingItems.length})</h2>
                        <div className="flex flex-col gap-2">
                            {pendingItems.map((item) => (
                                <Card key={item.id}>
                                    <CardContent>
                                        <p className="font-medium">{item.product?.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Planeado: {item.quantity_planned ?? '—'} {item.unit_planned?.short_name || ''}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
