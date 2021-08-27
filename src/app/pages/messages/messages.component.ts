import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../reducers';
import * as InterviewsActions from '../../store/interviews/interviews.actions';
import { selectConversations, selectMessages } from '../../store/interviews/intervews.selectors';
import { Interview } from '@hellotemp/rest';
import { DictionaryEntry } from '@hellotemp/models';
import { distinctUntilChanged, filter, mergeMap, startWith, switchMap, take } from 'rxjs/operators';
import { trackById } from '@hellotemp/util';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { MessagesPageService } from './messages-page.service';
import { combineLatest, defer, of } from 'rxjs';
import { ResponsiveService } from '../../services/responsive.service';

type PageGroup = 'all' | 'conversations' | 'offers';

@AutoUnsubscribe()
@Component({
  selector: 'hellotemp-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [MessagesPageService],
})
export class MessagesComponent implements OnInit, OnDestroy {
  conversationsSelector$ = this.store.pipe(select(selectConversations));
  conversations!: Interview[];
  jobTitles!: DictionaryEntry;
  companies!: DictionaryEntry;
  offers: Interview[] = [];
  public trackById = trackById;
  isMobile = false;
  showNav = true;
  pageGroup: PageGroup = 'all';
  constructor(
    public router: Router,
    private store: Store<State>,
    private messagesPageService: MessagesPageService,
    private responsiveService: ResponsiveService,
  ) { }

  ngOnInit() {
    combineLatest([
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        startWith(null),
      ),
      this.responsiveService.isMobile$],
    ).pipe(
      switchMap(([e, isMobile]) => defer(() => {
        if (!isMobile) {
          return of('all');
        }
        return this.router.isActive('/messages/conversation', false) ? of('conversations') : of('offers');
      })),
      distinctUntilChanged(),
    ).subscribe((v) => {
      this.pageGroup = v as 'all' | 'conversations' | 'offers';
    });
    this.conversationsSelector$.subscribe(conversationObject => {
      this.conversations = conversationObject.conversations;
      this.jobTitles = conversationObject.jobTitles;
      this.companies = conversationObject.companies;
      this.offers = conversationObject.offers;
    });

    combineLatest([
      this.responsiveService.isMobile$,
      this.messagesPageService.navState$,
    ]).subscribe(([isMobile, navState]) => {
      this.isMobile = isMobile;
      if (!isMobile) {
        this.showNav = true;
      } else {
        this.showNav = navState === 'opened';
      }
    })
  }

  ngOnDestroy() {}
  goBack() {
    this.router.navigateByUrl('/messages/conversation');
  }


  navigateToConversation(conversation: Interview) {
    // need this here because clicking on an already active message doesn't refresh those messages because the component does not get destroyed
    this.store.pipe(
        select(selectMessages),
        take(1),
      ).subscribe(messages => {
      if (messages && messages.length > 0 && messages[0].interviewId === conversation.id) {
        this.store.dispatch(InterviewsActions.getMessages({ id: conversation.id }));
      } else {
        this.store.dispatch(InterviewsActions.clearMessages())
      }
    })
    this.router.navigate(['/messages/conversation', conversation.id])
  }

  navigateToOffer(interview: Interview) {
    this.router.navigate(['/messages/offers', interview.id]);
  }

}
