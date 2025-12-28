import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './page-not-found.component.html',
})  
export class PageNotFoundComponent {

}
