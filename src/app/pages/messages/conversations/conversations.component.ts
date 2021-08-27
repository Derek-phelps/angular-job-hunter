import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../../reducers';
import { FormGroup, FormControl } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import * as InterviewsActions from '../../../store/interviews/interviews.actions';
import { selectMessageParticipants } from '../../../store/interviews/intervews.selectors';
import { Subject } from 'rxjs';
import { SubscriptionService } from '../../../services/subscription.service';
import { MessagesPageService } from '../messages-page.service';

@Component({
  selector: 'hellotemp-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
})
export class ConversationsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public interviewId!: string;
  public participants!: any;
  public form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private subscriptionService: SubscriptionService,
    public messagesPageService: MessagesPageService,
  ) { }

  ngOnInit() {
    this.form = this.initForm();
    this.route.paramMap
    .pipe(
      map((paramMap: ParamMap) => paramMap ? paramMap.get('id') : null),
      takeUntil(this.destroy$),
    )
    .subscribe(id => {
      this.messagesPageService.setNavState(id ? 'closed' : 'opened');
      if (id) {
        this.store.dispatch(InterviewsActions.getMessages({ id }));
        this.interviewId = id;
        this.store.pipe(select(selectMessageParticipants, id))
        .subscribe((participants) => {
          this.participants = participants;
        })
      }
    })
  }

  ngOnDestroy() {
    this.subscriptionService.unsubscribeMessages$.next();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  initForm() {
    return new FormGroup({
      text: new FormControl(''),
    })
  }

  sendMessage(e: any) {
    const { value: { text }} = this.form;
    const message = {
      interviewId: this.interviewId,
      text,
    }
    this.store.dispatch(InterviewsActions.sendMessage({ message, interviewId: this.interviewId}))
    this.form = this.initForm();
  }

}
