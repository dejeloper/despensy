import { ColorBadge } from '@/components/shared/colorBadge.component';
import { TopListCard } from '@/components/shared/topListCard.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, ShoppingBasket } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
];

interface ActiveChecklist {
    id: number;
    name: string | null;
    state: { name: string; color: string | null };
    itemsCount: number;
}

interface TopCategory {
    category: { id: number; name: string; icon: string | null; bg_color: string | null; text_color: string | null };
    purchases_count: number;
}

interface TopPlace {
    place: { id: number; name: string; bg_color: string | null; text_color: string | null };
    purchases_count: number;
}

interface TopProduct {
    product: { id: number; name: string };
    purchases_count: number;
}

interface DashboardProps {
    activeChecklist: ActiveChecklist | null;
    topCategories: TopCategory[];
    topPlaces: TopPlace[];
    topProducts: TopProduct[];
}

function ChecklistSummaryCard({ activeChecklist }: { activeChecklist: ActiveChecklist | null }) {
    return (
        <Card className="relative aspect-video overflow-hidden">
            <CardContent className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ClipboardList className="h-4 w-4" />
                    <span className="text-sm font-medium">Lista de compra</span>
                </div>

                {activeChecklist ? (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">{activeChecklist.name || `Lista #${activeChecklist.id}`}</span>
                            <Badge style={{ backgroundColor: activeChecklist.state.color || undefined }}>{activeChecklist.state.name}</Badge>
                        </div>
                        <p className="text-3xl font-bold">
                            {activeChecklist.itemsCount} <span className="text-sm font-normal text-muted-foreground">producto(s)</span>
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No tienes una lista de compra abierta.</p>
                )}

                <Button asChild size="sm" variant="outline" className="w-fit">
                    <Link href={route('despensy.index')}>
                        <ShoppingBasket className="mr-1 h-4 w-4" /> Ir a Despensa
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ activeChecklist, topCategories, topPlaces, topProducts }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <ChecklistSummaryCard activeChecklist={activeChecklist} />
                    <TopListCard
                        title="Top 3 categorías más compradas"
                        items={topCategories}
                        getKey={(item) => item.category.id}
                        renderItem={({ category }) => (
                            <ColorBadge text={category.name} icon={category.icon} bgColor={category.bg_color} textColor={category.text_color} />
                        )}
                    />
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <TopListCard
                        title="Top 3 lugares con más compras"
                        items={topPlaces}
                        getKey={(item) => item.place.id}
                        renderItem={({ place }) => (
                            <Badge style={{ backgroundColor: place.bg_color || undefined, color: place.text_color || undefined }}>
                                {place.name}
                            </Badge>
                        )}
                    />
                    <TopListCard
                        title="Top 5 productos más comprados"
                        items={topProducts}
                        getKey={(item) => item.product.id}
                        renderItem={({ product }) => <span className="text-sm">{product.name}</span>}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
