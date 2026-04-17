import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
                loadComponent: () => import('./pages/chat/chat').then(c => c.Chat)
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
                path: 'contacts',
                loadComponent: () => import('./pages/contacts/contacts').then(c => c.Contacts)
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
    }
];
