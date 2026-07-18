import { Head, Link } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ChecklistItem } from '@/types/business/checklist';
import { Product } from '@/types/business/product';

import { ColorBadge } from '@/components/shared/colorBadge.component';
import { Money } from '@/components/shared/money.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Pencil } from 'lucide-react';

interface ProductShowProps {
    product: Product;
    history: ChecklistItem[];
}

export default function ProductShow({ product, history }: ProductShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inicio', href: '/' },
        { title: 'Productos', href: route('products.index') },
        { title: product.name, href: '#' },
    ];

    const lastPurchase = history[0] ?? null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
                            {product.category && (
                                <ColorBadge
                                    text={product.category.name}
                                    icon={product.category.icon}
                                    bgColor={product.category.bg_color}
                                    textColor={product.category.text_color}
                                />
                            )}
                            {!product.enabled && <Badge variant="outline">Desactivado</Badge>}
                        </div>
                        {product.description && <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>}
                    </div>
                    <div className="ml-auto flex flex-wrap justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={route('products.edit', product.id)}>
                                <Pencil className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Editar</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href={route('products.index')}>
                                <ArrowLeft className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Volver</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="flex flex-col gap-1">
                        <p className="text-sm text-muted-foreground">Última compra</p>
                        {lastPurchase ? (
                            <div className="flex flex-wrap items-center gap-2">
                                <Money value={lastPurchase.total_price} className="text-xl" />
                                {lastPurchase.place && (
                                    <ColorBadge
                                        text={lastPurchase.place.name}
                                        bgColor={lastPurchase.place.bg_color}
                                        textColor={lastPurchase.place.text_color}
                                        className="px-2 py-0.5 text-xs font-medium"
                                    />
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {lastPurchase.quantity_bought} {lastPurchase.unit_bought?.short_name} · {lastPurchase.purchase_date}
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Aún no se ha comprado este producto.</p>
                        )}
                    </CardContent>
                </Card>

                <div>
                    <h2 className="mb-2 text-lg font-medium">Historial de compras ({history.length})</h2>
                    <Card>
                        <CardContent className="flex flex-col gap-2 p-0">
                            {history.length === 0 ? (
                                <p className="p-4 text-sm text-muted-foreground">No hay compras registradas todavía.</p>
                            ) : (
                                history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-1 border-b p-4 last:border-b-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 sm:p-3"
                                    >
                                        <div className="flex items-center gap-2">
                                            {item.place && (
                                                <ColorBadge
                                                    text={item.place.name}
                                                    bgColor={item.place.bg_color}
                                                    textColor={item.place.text_color}
                                                    className="px-2 py-0.5 text-xs font-medium"
                                                />
                                            )}
                                            <span className="text-xs text-muted-foreground">{item.purchase_date}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 sm:justify-end">
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity_bought} {item.unit_bought?.short_name}
                                            </p>
                                            <Money value={item.total_price} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
