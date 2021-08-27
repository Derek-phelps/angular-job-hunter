import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, Observable, combineLatest, iif, defer } from 'rxjs';
import { map, exhaustMap, catchError, switchMap, mergeMap, tap, withLatestFrom, concatMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as CandidatesActions from './candidates.actions';
import * as AuthActions from '../../auth/store/auth.actions';
import { CandidateService, User, UserService } from '@hellotemp/rest';
import { Candidate } from '@hellotemp/models';
import { Router } from '@angular/router';

@Injectable()
export class CandidatesEffects{
    createCandidate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.createCandidate),
            withLatestFrom(this.store),
            switchMap(([action, store]) => {
                const candidate = store.candidates.candidate as Candidate;
                const user = {
                    ...store.auth.user,
                };
                return defer(() => {
                  if (candidate.lastName !== user.lastName || candidate.firstName !== user.firstName) {
                    return this.userService.patchUsersId({
                      id: candidate.userId,
                      User: {
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                      } as User,
                    }).pipe(
                      tap((res) => this.store.dispatch(AuthActions.updateUserSuccess({ user: res }))),
                      catchError(err => of(false)),
                    );
                  }
                  return of(true);
                }).pipe(
                  concatMap(() => this.candidateService.postCandidates(candidate)),
                  map((res: any) => {
                      this.store.dispatch(AuthActions.getLoggedInUser({ id: store.auth.userId as string }));
                      return CandidatesActions.createCandidateSuccess({ candidate: new Candidate(res), close: action.close })
                  }),
                  catchError((error: any) => of(CandidatesActions.createCandidateFailure({ error }))),
                );
            }),
        ),
    )

    updateCandidate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.updateCandidate),
            withLatestFrom(this.store),
            switchMap(([action, store]) => {
                const candidate = { ...store.candidates.candidate as any };
                const user = { ...store.auth.user };
                const dictionary = store.definitions.dictionary;
                if ((candidate.firstName && user.firstName !== candidate.firstName) || (candidate.lastName && user.lastName !== candidate.lastName)) {
                    user.firstName = candidate.firstName;
                    user.lastName = candidate.lastName;
                    this.store.dispatch(AuthActions.updateUser({ params: user }));
                }
                if (candidate.user) {
                    delete candidate.user;
                }
                const observables: Observable<any>[] = [];
                if (candidate.certifications) {
                    candidate.certifications.forEach((c: any) => {
                    if (c.id) {
                        observables.push(this.candidateService.patchCandidatesCandidateIdCertificationsId({ id: c.id, candidateId: candidate.id, CandidateCertification: c }));
                    } else {
                        observables.push(this.candidateService.postCandidatesCandidateIdCertifications({ candidateId: candidate.id, CandidateCertification: c }));
                    }
                    })
                }
                if (candidate.industryExperiences) {
                    candidate.industryExperiences.forEach((c: any) => {
                    if (c.id) {
                        observables.push(this.candidateService.patchCandidatesCandidateIdIndustryExperiencesId({ id: c.id, candidateId: candidate.id, CandidateIndustryExperience: c }));
                    } else {
                        observables.push(this.candidateService.postCandidatesCandidateIdIndustryExperiences({ candidateId: candidate.id, CandidateIndustryExperience: c }));
                    }
                    })
                }
                if (candidate.skills) {
                    candidate.skills.forEach((c: any) => {
                    if (c.id) {
                        observables.push(this.candidateService.patchCandidatesCandidateIdSkillsId({ id: c.id, candidateId: candidate.id, CandidateSkill: c }));
                    } else {
                        observables.push(this.candidateService.postCandidatesCandidateIdSkills({ candidateId: action.candidate.id as string, CandidateSkill: c }));
                    }
                    })
                }
                if (candidate.softwareSkills) {
                    candidate.softwareSkills.forEach((c: any) => {
                    if (c.id) {
                        observables.push(this.candidateService.patchCandidatesCandidateIdSoftwareSkillsId({ id: c.id, candidateId: candidate.id, CandidateSoftwareSkill: c }));
                    } else {
                        observables.push(this.candidateService.postCandidatesCandidateIdSoftwareSkills({ candidateId: candidate.id, CandidateSoftwareSkill: c }));
                    }
                    })
                }
                delete candidate.skills;
                delete candidate.softwareSkills;
                delete candidate.industryExperiences;
                delete candidate.certifications;
                return of(observables)
                .pipe(
                    mergeMap(arr => iif(() => arr && arr.length > 0, combineLatest(arr), of([]))),
                    mergeMap((res => {
                      return this.candidateService.patchCandidatesId({ id: candidate.id, Candidate: candidate }).pipe(
                        map(patchRes => [...res, patchRes]),
                      )
                    })),
                    map((res: any) => {
                        const response = res[observables.length];
                        response.skills = [];
                        response.softwareSkills = [];
                        response.industryExperiences = [];
                        response.certifications = [];
                        res.forEach((c: any) => {
                            if (c.skillDefinitionId) {
                                c.skillDefinition = dictionary.skills[c.skillDefinitionId];
                                response.skills.push(c);
                            }
                            if (c.softwareDefinitionId) {
                                c.softwareDefinition = dictionary.software[c.softwareDefinitionId];
                                response.softwareSkills.push(c);
                            }
                            if (c.industryDefinitionId) {
                                c.industryDefinition = dictionary.industry[c.industryDefinitionId];
                                response.industryExperiences.push(c);
                            }
                            if (c.certificationDefinitionId) {
                                c.certification = dictionary.certifications[c.certificationDefinitionId];
                                response.certifications.push(c);
                            }
                        })
                        // handling user change here because things are async.
                        return CandidatesActions.updateCandidateSuccess({ candidate: new Candidate(response), close: action.close })
                    }),
                    catchError((error: any) => of(CandidatesActions.updateCandidateFailure({ error }))),
                );
            }),
        ),
    )

    // can have "from save" in the action to differentiate button clicks if need arises
    createCandidateSuccess = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.createCandidateSuccess),
            tap((action) => action.close && this.router.navigate(['/profile'])),
        ),
        { dispatch: false },
    )

    updateCandidateSuccess = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.updateCandidateSuccess),
            tap((action) => action.close && this.router.navigate(['/profile'])),
        ),
        { dispatch: false },
    )

    updateCandidateFailure$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.updateCandidateFailure),
            tap((action) => this.router.navigate(['/profile'])),
            withLatestFrom(this.store),
            map(([action, store]) => {
                const userId = store.auth.userId as string
                const candidate = store.candidates.candidate as any;
                return CandidatesActions.getUserCandidate({ userId, candidateId: candidate.id })
            }),
        ),
    )

    getUserCandidate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.getUserCandidate),
            exhaustMap((action) => {
                // const filter = [`userId||eq||${action.userId}`];
                return this.candidateService.getCandidatesId({ id: action.candidateId})
                .pipe(
                    map((res: any) => {
                        // const candidate = res.length > 0 ? new Candidate(res[0]) : null
                        const candidate = new Candidate(res);
                        return CandidatesActions.getUserCandidateSuccess({ candidate })
                    }),
                    catchError((error: any) => {
                        return of(CandidatesActions.getUserCandidateFailure({ error }))
                    }),
                );
            }),
        ),
    )

    getUserCandidateSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.getUserCandidateSuccess),
            tap((action) => !action.candidate && this.router.navigate(['/create-profile'])),
        ),
        { dispatch: false },
    )

    createRate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.createRate),
            switchMap((action) => {
                return this.candidateService.postCandidatesCandidateIdRates({ candidateId: action.candidate.id, CandidateRate: action.rate })
                .pipe(
                    map((res: any) => {
                        this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                        return CandidatesActions.createRateSuccess({ rate: res })
                    }),
                    catchError((error: any) => {
                        console.log('create rate failure', error);
                        return of(CandidatesActions.createRateFailure({ error }))
                    }),
                )
            }),
        ),
    )

    updateRate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.updateRate),
            switchMap((action) => {
                return this.candidateService.patchCandidatesCandidateIdRatesId({ id: action.rate.id, candidateId: action.candidate.id, CandidateRate: action.rate })
                .pipe(
                    map((res: any) => {
                        this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                        return CandidatesActions.updateRateSuccess({ rate: res})
                    }),
                    catchError((error: any) => {
                        return of(CandidatesActions.updateRateFailure({ error }))
                    }),
                )
            }),
        ),
    )

    deleteRate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CandidatesActions.deleteRate),
            switchMap((action) => {
                return this.candidateService.deleteCandidatesCandidateIdRatesId({ id: action.rate.id, candidateId: action.candidate.id })
                .pipe(
                    map((res: any) => {
                        // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                        return CandidatesActions.deleteRateSuccess();
                    }),
                    catchError((error: any) => {
                        return of(CandidatesActions.deleteRateFailure({ error }))
                    }),
                )
            }),
        ),
    )

    createDegree$ = createEffect(() =>
    this.actions$.pipe(
        ofType(CandidatesActions.createDegree),
        switchMap((action) => {
            return this.candidateService.postCandidatesCandidateIdDegrees({ candidateId: action.candidate.id, CandidateDegree: action.degree })
            .pipe(
                map((res: any) => {
                    // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                    return CandidatesActions.createDegreeSuccess({ degree: res })
                }),
                catchError((error: any) => {
                    console.log('create Degree failure', error);
                    return of(CandidatesActions.createDegreeFailure({ error }))
                }),
            )
        }),
    ),
)

updateDegree$ = createEffect(() =>
    this.actions$.pipe(
        ofType(CandidatesActions.updateDegree),
        switchMap((action) => {
            return this.candidateService.patchCandidatesCandidateIdDegreesId({ id: action.degree.id, candidateId: action.candidate.id, CandidateDegree: action.degree })
            .pipe(
                map((res: any) => {
                    // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                    return CandidatesActions.updateDegreeSuccess({ degree: res})
                }),
                catchError((error: any) => {
                    return of(CandidatesActions.updateRateFailure({ error }))
                }),
            )
        }),
    ),
)

deleteDegree$ = createEffect(() =>
    this.actions$.pipe(
        ofType(CandidatesActions.deleteDegree),
        switchMap((action) => {
            return this.candidateService.deleteCandidatesCandidateIdDegreesId({ id: action.degree.id, candidateId: action.candidate.id })
            .pipe(
                map((res: any) => {
                    // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                    return CandidatesActions.deleteDegreeSuccess();
                }),
                catchError((error: any) => {
                    return of(CandidatesActions.deleteDegreeFailure({ error }))
                }),
            )
        }),
    ),
)

createSkill$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.createSkill),
    switchMap((action) => {
        return this.candidateService.postCandidatesCandidateIdSkills({ candidateId: action.candidate.id, CandidateSkill: action.skill })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                return CandidatesActions.createSkillSuccess({ skill: res })
            }),
            catchError((error: any) => {
                console.log('create Skill failure', error);
                return of(CandidatesActions.createSkillFailure({ error }))
            }),
        )
    }),
),
)

updateSkill$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.updateSkill),
    switchMap((action) => {
        return this.candidateService.patchCandidatesCandidateIdSkillsId({ id: action.skill.id, candidateId: action.candidate.id, CandidateSkill: action.skill })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.updateSkillSuccess({ skill: res})
            }),
            catchError((error: any) => {
                return of(CandidatesActions.updateSkillFailure({ error }))
            }),
        )
    }),
),
)

deleteSkill$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.deleteSkill),
    switchMap((action) => {
        return this.candidateService.deleteCandidatesCandidateIdSkillsId({ id: action.skill.id, candidateId: action.candidate.id })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.deleteSkillSuccess();
            }),
            catchError((error: any) => {
                return of(CandidatesActions.deleteSkillFailure({ error }))
            }),
        )
    }),
),
)

createSoftwareSkill$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.createSoftwareSkill),
    switchMap((action) => {
        return this.candidateService.postCandidatesCandidateIdSoftwareSkills({ candidateId: action.candidate.id, CandidateSoftwareSkill: action.softwareSkill })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                return CandidatesActions.createSoftwareSkillSuccess({ softwareSkill: res })
            }),
            catchError((error: any) => {
                console.log('create SoftwareSkill failure', error);
                return of(CandidatesActions.createSoftwareSkillFailure({ error }))
            }),
        )
    }),
),
)

updateSoftwareSkill$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.updateSoftwareSkill),
    switchMap((action) => {
        return this.candidateService.patchCandidatesCandidateIdSoftwareSkillsId({ id: action.softwareSkill.id, candidateId: action.candidate.id, CandidateSoftwareSkill: action.softwareSkill })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.updateSoftwareSkillSuccess({ softwareSkill: res})
            }),
            catchError((error: any) => {
                return of(CandidatesActions.updateSoftwareSkillFailure({ error }))
            }),
        )
    }),
),
)

deleteSoftwareSkill$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.deleteSoftwareSkill),
    switchMap((action) => {
        return this.candidateService.deleteCandidatesCandidateIdSoftwareSkillsId({ id: action.softwareSkill.id, candidateId: action.candidate.id })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.deleteSoftwareSkillSuccess();
            }),
            catchError((error: any) => {
                return of(CandidatesActions.deleteSoftwareSkillFailure({ error }))
            }),
        )
    }),
),
)

createIndustryExperience$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.createIndustryExperience),
    switchMap((action) => {
        return this.candidateService.postCandidatesCandidateIdIndustryExperiences({ candidateId: action.candidate.id, CandidateIndustryExperience: action.industryExperience })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                return CandidatesActions.createIndustryExperienceSuccess({ industryExperience: res })
            }),
            catchError((error: any) => {
                console.log('create IndustryExperience failure', error);
                return of(CandidatesActions.createIndustryExperienceFailure({ error }))
            }),
        )
    }),
),
)

updateIndustryExperience$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.updateIndustryExperience),
    switchMap((action) => {
        return this.candidateService.patchCandidatesCandidateIdIndustryExperiencesId({ id: action.industryExperience.id, candidateId: action.candidate.id, CandidateIndustryExperience: action.industryExperience })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.updateIndustryExperienceSuccess({ industryExperience: res})
            }),
            catchError((error: any) => {
                return of(CandidatesActions.updateIndustryExperienceFailure({ error }))
            }),
        )
    }),
),
)

deleteIndustryExperience$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.deleteIndustryExperience),
    switchMap((action) => {
        return this.candidateService.deleteCandidatesCandidateIdIndustryExperiencesId({ id: action.industryExperience.id, candidateId: action.candidate.id })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.deleteIndustryExperienceSuccess();
            }),
            catchError((error: any) => {
                return of(CandidatesActions.deleteIndustryExperienceFailure({ error }))
            }),
        )
    }),
),
)

createCertification$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.createCertification),
    switchMap((action) => {
        return this.candidateService.postCandidatesCandidateIdCertifications({ candidateId: action.candidate.id, CandidateCertification: action.certification })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                return CandidatesActions.createCertificationSuccess({ certification: res })
            }),
            catchError((error: any) => {
                console.log('create Certification failure', error);
                return of(CandidatesActions.createCertificationFailure({ error }))
            }),
        )
    }),
),
)

updateCertifications$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.updateCertification),
    switchMap((action) => {
        return this.candidateService.patchCandidatesCandidateIdCertificationsId({ id: action.certification.id, candidateId: action.candidate.id, CandidateCertification: action.certification })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.updateCertificationSuccess({ certification: res})
            }),
            catchError((error: any) => {
                return of(CandidatesActions.updateCertificationFailure({ error }))
            }),
        )
    }),
),
)

deleteCertifications$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.deleteCertification),
    switchMap((action) => {
        return this.candidateService.deleteCandidatesCandidateIdCertificationsId({ id: action.certification.id, candidateId: action.candidate.id })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.deleteCertificationSuccess();
            }),
            catchError((error: any) => {
                return of(CandidatesActions.deleteCertificationFailure({ error }))
            }),
        )
    }),
),
)

createQualification$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.createQualification),
    switchMap((action) => {
        return this.candidateService.postCandidatesCandidateIdQualifications({ candidateId: action.candidate.id, CandidateQualification: action.qualification })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                return CandidatesActions.createQualificationSuccess({ Qualification: res })
            }),
            catchError((error: any) => {
                console.log('create Qualification failure', error);
                return of(CandidatesActions.createQualificationFailure({ error }))
            }),
        )
    }),
),
)

updateQualification$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.updateQualification),
    switchMap((action) => {
        return this.candidateService.patchCandidatesCandidateIdQualificationsId({ id: action.qualification.id, candidateId: action.candidate.id, CandidateQualification: action.qualification })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.updateQualificationSuccess({ qualification: res})
            }),
            catchError((error: any) => {
                return of(CandidatesActions.updateRateFailure({ error }))
            }),
        )
    }),
),
)

deleteQualification$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.deleteQualification),
    switchMap((action) => {
        return this.candidateService.deleteCandidatesCandidateIdQualificationsId({ id: action.qualification.id, candidateId: action.candidate.id })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.deleteQualificationSuccess();
            }),
            catchError((error: any) => {
                return of(CandidatesActions.deleteQualificationFailure({ error }))
            }),
        )
    }),
),
)

createReference$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.createReference),
    switchMap((action) => {
        return this.candidateService.postCandidatesCandidateIdReferences({ candidateId: action.candidate.id, Reference: action.reference })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId, candidateId: action.candidate.id }));
                return CandidatesActions.createReferenceSuccess({ Reference: res })
            }),
            catchError((error: any) => {
                console.log('create Reference failure', error);
                return of(CandidatesActions.createReferenceFailure({ error }))
            }),
        )
    }),
),
)

updateReference$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.updateReference),
    switchMap((action) => {
        return this.candidateService.patchCandidatesCandidateIdReferencesId({ id: action.reference.id, candidateId: action.candidate.id, Reference: action.reference })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.updateReferenceSuccess({ Reference: res})
            }),
            catchError((error: any) => {
                return of(CandidatesActions.updateRateFailure({ error }))
            }),
        )
    }),
),
)

deleteReference$ = createEffect(() =>
this.actions$.pipe(
    ofType(CandidatesActions.deleteReference),
    switchMap((action) => {
        return this.candidateService.deleteCandidatesCandidateIdReferencesId({ id: action.reference.id, candidateId: action.candidate.id })
        .pipe(
            map((res: any) => {
                // this.store.dispatch(CandidatesActions.getUserCandidate({ userId: action.candidate.userId }));
                return CandidatesActions.deleteReferenceSuccess();
            }),
            catchError((error: any) => {
                return of(CandidatesActions.deleteReferenceFailure({ error }))
            }),
        )
    }),
),
)

    constructor (
        private actions$: Actions,
        private store: Store<State>,
        private candidateService: CandidateService,
        private router: Router,
        private userService: UserService,
    ) {}
}
