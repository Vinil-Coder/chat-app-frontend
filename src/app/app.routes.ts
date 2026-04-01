import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'landing',
        loadComponent: () => import('./pages/landing/landing').then(c => c.Landing)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(c => c.Login)
    },
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup').then(c => c.Signup)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./pages/resetpassword/resetpassword').then(c => c.Resetpassword)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/layout/layout').then(c => c.Layout),
        children: [
            {
                path: 'chats',
                loadComponent: () => import('./pages/chats/chats').then(c => c.Chats)
            },
            {
                path: 'groups',
                loadComponent: () => import('./pages/groups/groups').then(c => c.Groups)
            },
            {
                path: 'invites',
                loadComponent: () => import('./pages/invites/invites').then(c => c.Invites)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/settings').then(c => c.Settings)
            },
            {
                path: 'workspaces',
                loadComponent: () => import('./pages/workspaces/workspaces').then(c => c.Workspaces)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile').then(c => c.Profile)
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'chats'
            },
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'landing'
    }
];
