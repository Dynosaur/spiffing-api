import { NgModule } from '@angular/core';
import { PostComponent } from 'spiff/app/ui/views/post/post.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from 'spiff/app/ui/views/landing-page';
import { ProfileComponent, SettingsComponent } from './ui/views';

const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'user/:username', component: ProfileComponent },
    { path: 'post/:id', component: PostComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
