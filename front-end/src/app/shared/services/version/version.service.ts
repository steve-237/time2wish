import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  get version(): string {
    return environment.version;
  }

  get isProduction(): boolean {
    return environment.production;
  }

  get fullVersion(): string {
    return `${this.version}${this.isProduction ? '' : '-dev'}`;
  }
}
