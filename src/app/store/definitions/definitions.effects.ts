import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import { DefinitionService, CompanyService } from '@hellotemp/rest';
import * as DefinitionsActions from './definitions.actions';
import { DictionaryEntry } from '@hellotemp/models';
import { sortByName } from '@hellotemp/util';

@Injectable()

export class DefinitionsEffects {

    job$ = createEffect(() => 
    this.action$.pipe(
        ofType(DefinitionsActions.getJobTitleDefinitions),
        exhaustMap(() => this.definitionService.getJobTitles({})
            .pipe(
                map((res: any) => {
                    const sorted = sortByName(res);
                    return DefinitionsActions.getJobTitleDefinitionsSuccess({ jobTitleDefinitions: sorted, dictionaryEntry: new DictionaryEntry(sorted) })
                }),
                catchError((error: any) => of(DefinitionsActions.getJobTitleDefinitionsFailure({ error }))),
            ),
        ),
    ),
)

    industry$ = createEffect(() => 
        this.action$.pipe(
            ofType(DefinitionsActions.getIndustryDefinitions),
            exhaustMap(() => this.definitionService.getIndustryDefinitions({})
                .pipe(
                    map((res: any) => {
                        const sorted = sortByName(res);
                        return DefinitionsActions.getIndustryDefinitionsSuccess({ industryDefinitions: sorted, dictionaryEntry: new DictionaryEntry(sorted) })
                    }),
                    catchError((error: any) => of(DefinitionsActions.getIndustryDefinitionsFailure({ error }))),
                ),
            ),
        ),
    )

    skill$ = createEffect(() => 
        this.action$.pipe(
            ofType(DefinitionsActions.getSkillDefinitions),
            exhaustMap(() => this.definitionService.getSkillDefinitions({})
                .pipe(
                    map((res: any) => {
                        const sorted = sortByName(res);
                        return DefinitionsActions.getSkillDefinitionsSuccess({ skillDefinitions: sorted, dictionaryEntry: new DictionaryEntry(sorted) })
                    }),
                    catchError((error: any) => of(DefinitionsActions.getSkillDefinitionsFailure({ error }))),
                ),
            ),
        ),
    )

    software$ = createEffect(() => 
        this.action$.pipe(
            ofType(DefinitionsActions.getSoftwareDefinitions),
            exhaustMap(() => this.definitionService.getSoftwareDefinitions({})
                .pipe(
                    map((res: any) => {
                        const sorted = sortByName(res);
                        return DefinitionsActions.getSoftwareDefinitionsSuccess({ softwareDefinitions: sorted, dictionaryEntry: new DictionaryEntry(sorted) })
                    }),
                    catchError((error: any) => of(DefinitionsActions.getSoftwareDefinitionsFailure({ error }))),
                ),
            ),
        ),
    )

    certification$ = createEffect(() => 
        this.action$.pipe(
            ofType(DefinitionsActions.getCertificationDefinitions),
            exhaustMap(() => this.definitionService.getCertificationDefinitions({})
                .pipe(
                    map((res: any) => {
                        const sorted = sortByName(res);
                        return DefinitionsActions.getCertificationDefinitionsSuccess({ certificationDefinitions: sorted, dictionaryEntry: new DictionaryEntry(sorted) })
                    }),
                    catchError((error: any) => of(DefinitionsActions.getCertificationDefinitionsFailure({ error }))),
                ),
            ),
        ),
    )

    company$ = createEffect(() => 
        this.action$.pipe(
            ofType(DefinitionsActions.getCompanies),
            exhaustMap(() => {
                const params = {
                    join: ['locations'],
                }
                return this.companyService.getCompanies(params)
                .pipe(
                    map((res: any) => {
                        const sorted = sortByName(res);
                        return DefinitionsActions.getCompaniesSuccess({ companies: sorted, dictionaryEntry: new DictionaryEntry(sorted) })
                    }),
                    catchError((error: any) => of(DefinitionsActions.getCompaniesFailure({ error }))),
                );
            }),
        ),
    )

    constructor(
        private action$: Actions,
        private definitionService: DefinitionService,
        private companyService: CompanyService,
    ) {}
}