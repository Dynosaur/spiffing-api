import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'spiff/app/api/interface';
import { Comment } from 'api/interface';

@Component({
    selector: 'spiff-rate-counter',
    templateUrl: './rate-counter.component.html',
    styleUrls: ['./rate-counter.component.scss']
})
export class RateCounterComponent implements OnInit {
    @Input() item: Post | Comment;
    @Input() liked = false;
    @Input() disliked = false;
    @Output() like = new EventEmitter<Post | Comment>();
    @Output() dislike = new EventEmitter<Post | Comment>();

    ngOnInit(): void {
        if (this.item === undefined || this.item === null) throw new Error('RateCounterComponent: item was not provided');
    }
}
