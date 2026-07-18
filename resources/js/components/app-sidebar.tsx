import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Box, CheckCheck, ClipboardList, Github, LayoutGrid, ShoppingBasket, Sliders, Store, Tags, Weight } from 'lucide-react';
import AppLogo from './app-logo';

function useMainNavItems(): NavItem[] {
    const { openChecklistItemsCount } = usePage<SharedData>().props;

    return [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Despensy',
            href: '/despensy',
            icon: ShoppingBasket,
            badge: openChecklistItemsCount || undefined,
            items: [
                {
                    title: 'Despensa',
                    href: '/despensy',
                    icon: ShoppingBasket,
                },
                {
                    title: 'Confirmar',
                    href: '/despensy/checkout',
                    icon: CheckCheck,
                },
                {
                    title: 'Checklists',
                    href: '/dashboard/checklists',
                    icon: ClipboardList,
                },
            ],
        },
        {
            title: 'Configuraciones',
            href: '/dashboard/products',
            icon: Sliders,
            items: [
                {
                    title: 'Productos',
                    href: '/dashboard/products',
                    icon: Box,
                },
                {
                    title: 'Categorías',
                    href: '/dashboard/categories',
                    icon: Tags,
                },
                {
                    title: 'Lugares',
                    href: '/dashboard/places',
                    icon: Store,
                },
                {
                    title: 'Unidades',
                    href: '/dashboard/units',
                    icon: Weight,
                },
            ],
        },
    ];
}

const footerNavItems: NavItem[] = [
    {
        title: 'Código',
        href: 'https://github.com/dejeloper/despensy',
        icon: Github,
    },
];

export function AppSidebar() {
    const mainNavItems = useMainNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
