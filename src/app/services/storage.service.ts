import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { select, Store } from '@ngrx/store';
import { filter, mergeMap, take } from 'rxjs/operators';
import { State } from '../reducers';
import { selectUser } from '../auth/store/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(
    private http: HttpClient,
    private store: Store<State>,
  ) {
  }

  uploadFile(file: File, name: string) {
    return this.store.pipe(
      select(selectUser),
      filter(user => !!user.id),
      take(1),
      mergeMap(user => {
        const body = new FormData();
        body.append('file', file, file.name);
        body.append('type', `candidate/${user.id}`);
        body.append('fileName', name);
        return this.http.post<{downloadUrl: string}>(`${environment.apiUrl}/files/upload`, body)
      }),
    );
  }

  deleteFile(type: string) {
    return this.store.pipe(
      select(selectUser),
      filter(user => !!user.id),
      take(1),
      mergeMap(user =>
        this.http.delete(`${environment.apiUrl}/files`, {
          params: {
            type: `candidate/${user.id}`,
            fileName: type,
          },
        }),
      ),
    );
  }
}
