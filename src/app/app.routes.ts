import { Routes } from '@angular/router';
import { AuthGuard } from './guards/route.guard';

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
        path: 'invite/:token',
        loadComponent: () => import('./pages/invite/invite').then(c => c.Invite)
    },
    {
        path: 'resetpassword',
        loadComponent: () => import('./pages/resetpassword/resetpassword').then(c => c.Resetpassword)
    },
    {
        path: '',
        loadComponent: () => import('./components/layout/layout').then(c => c.Layout),
        canActivate: [AuthGuard],
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
                path: 'workspaces',
                loadComponent: () => import('./pages/workspaces/workspaces').then(c => c.Workspaces)
            },
            {
                path: 'members',
                loadComponent: () => import('./pages/members/members').then(c => c.Members)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile').then(c => c.Profile)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/settings').then(c => c.Settings)
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'chats'
            },
        ]
    }
];
