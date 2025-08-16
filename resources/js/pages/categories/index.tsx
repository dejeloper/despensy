import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Categorías',
        href: '#',
    },
];

export default function CategoryIndex({ categories }: { categories: Category[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex">
                    <Button asChild variant="default" size="sm">
                        <Link href={route('categories.create')}>Crear Categoría</Link>
                    </Button>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="relative overflow-x-auto">
                        <Table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <TableCaption>Lista de todas las catergorías</TableCaption>
                            <TableHeader className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                <TableRow>
                                    <TableHead scope="col" className="px-6 py-3">
                                        Nombre
                                    </TableHead>
                                    <TableHead scope="col" className="px-6 py-3">
                                        Color de fondo
                                    </TableHead>
                                    <TableHead scope="col" className="px-6 py-3">
                                        Color de texto
                                    </TableHead>
                                    <TableHead scope="col" className="px-6 py-3">
                                        Vista Previa
                                    </TableHead>
                                    <TableHead scope="col" className="px-6 py-3">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category: Category) => (
                                    <TableRow
                                        key={category.id}
                                        className="border-b border-gray-200 odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                                    >
                                        <TableCell scope="row" className="px-6 py-4">
                                            {category.name}
                                        </TableCell>
                                        <TableCell scope="row" className="px-6 py-4" style={{ color: category.bg_color }}>
                                            {category.bg_color}
                                        </TableCell>
                                        <TableCell scope="row" className="px-6 py-4" style={{ color: category.text_color }}>
                                            {category.text_color}
                                        </TableCell>
                                        <TableCell scope="row" className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className="flex items-center gap-2 p-2"
                                                style={{ backgroundColor: category.bg_color, color: category.text_color }}
                                            >
                                                <span>{category.icon}</span> {category.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                                Edit
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {/* <TableRow
                                    key={category.id}
                                    className="border-b border-gray-200 odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                                >
                                    <TableCell scope="row" className="px-6 py-4">
                                        INV001
                                    </TableCell>
                                    <TableCell scope="row" className="px-6 py-4">
                                        Paid
                                    </TableCell>
                                    <TableCell scope="row" className="px-6 py-4">
                                        Credit Card
                                    </TableCell>
                                    <TableCell scope="row" className="px-6 py-4">
                                        $250.00
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                            Edit
                                        </a>
                                    </TableCell>
                                </TableRow> */}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
