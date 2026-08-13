import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

import { ProductContainerModal } from '@/components/business/equivalences/productContainerModal';
import { UnitEquivalenceModal } from '@/components/business/equivalences/unitEquivalenceModal';
import { Button } from '@/components/ui/button';

import { formatQuantity } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { EquivalenceOption, ProductContainer, UnitEquivalence } from '@/types/business/equivalence';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Equivalencias', href: '#' },
];

interface EquivalencesProps {
    unitEquivalences: UnitEquivalence[];
    productContainers: ProductContainer[];
    units: EquivalenceOption[];
    products: EquivalenceOption[];
    places: EquivalenceOption[];
}

function Row({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="flex items-center justify-between gap-2 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/50 sm:p-3">
            <p className="min-w-0 text-sm">{children}</p>
            <div className="flex shrink-0 gap-1">
                <Button type="button" variant="outline" size="icon" title="Editar" onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button type="button" variant="destructive" size="icon" title="Eliminar" onClick={onDelete}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

function Section({ title, description, onAdd, children }: { title: string; description: string; onAdd: () => void; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Button size="sm" onClick={onAdd}>
                    <Plus className="mr-1 h-4 w-4" /> Agregar
                </Button>
            </div>
            <div className="flex flex-col rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">{children}</div>
        </div>
    );
}

export default function EquivalencesIndex({ unitEquivalences, productContainers, units, products, places }: EquivalencesProps) {
    const [equivalenceOpen, setEquivalenceOpen] = useState(false);
    const [editingEquivalence, setEditingEquivalence] = useState<UnitEquivalence | null>(null);
    const [containerOpen, setContainerOpen] = useState(false);
    const [editingContainer, setEditingContainer] = useState<ProductContainer | null>(null);

    const openEquivalence = (equivalence: UnitEquivalence | null) => {
        setEditingEquivalence(equivalence);
        setEquivalenceOpen(true);
    };

    const openContainer = (container: ProductContainer | null) => {
        setEditingContainer(container);
        setContainerOpen(true);
    };

    const deleteEquivalence = (equivalence: UnitEquivalence) => {
        if (!confirm(`¿Eliminar la equivalencia de "${equivalence.unit_name}"?`)) return;
        router.delete(route('unit-equivalences.destroy', equivalence.id), { preserveScroll: true });
    };

    const deleteContainer = (container: ProductContainer) => {
        if (!confirm(`¿Eliminar el contenedor de "${container.product_name}"?`)) return;
        router.delete(route('product-containers.destroy', container.id), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Equivalencias" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Equivalencias</h1>
                    <p className="text-sm text-muted-foreground">
                        Sirven para desglosar una compra hasta su unidad mínima: "1,64 Kg = 1640 g, el gramo a $1,49".
                    </p>
                </div>

                <Section
                    title="Entre unidades"
                    description="Universales: valen para cualquier producto y cualquier lugar."
                    onAdd={() => openEquivalence(null)}
                >
                    {unitEquivalences.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">No hay equivalencias registradas.</p>
                    ) : (
                        unitEquivalences.map((equivalence) => (
                            <Row key={equivalence.id} onEdit={() => openEquivalence(equivalence)} onDelete={() => deleteEquivalence(equivalence)}>
                                <span className="font-medium">1 {equivalence.unit_name}</span> = {formatQuantity(equivalence.factor)}{' '}
                                {equivalence.parent_unit_name}
                            </Row>
                        ))
                    )}
                </Section>

                <Section
                    title="Contenedores por producto"
                    description="Cuánto trae un empaque de un producto concreto, opcionalmente según el lugar."
                    onAdd={() => openContainer(null)}
                >
                    {productContainers.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">No hay contenedores registrados.</p>
                    ) : (
                        productContainers.map((container) => (
                            <Row key={container.id} onEdit={() => openContainer(container)} onDelete={() => deleteContainer(container)}>
                                <span className="font-medium">
                                    1 {container.container_unit_name} de {container.product_name}
                                </span>{' '}
                                <span className="text-muted-foreground">en {container.place_name ?? 'cualquier lugar'}</span> ={' '}
                                {formatQuantity(container.content_quantity)} {container.content_unit_name}
                            </Row>
                        ))
                    )}
                </Section>
            </div>

            <UnitEquivalenceModal equivalence={editingEquivalence} units={units} open={equivalenceOpen} onOpenChange={setEquivalenceOpen} />

            <ProductContainerModal
                container={editingContainer}
                products={products}
                places={places}
                units={units}
                open={containerOpen}
                onOpenChange={setContainerOpen}
            />
        </AppLayout>
    );
}
