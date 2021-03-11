(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "/L3f":
/*!**************************************************!*\
  !*** ./src/app/ui/components/view-card/index.ts ***!
  \**************************************************/
/*! exports provided: ViewCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_card_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view-card.component */ "gCZD");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewCardComponent", function() { return _view_card_component__WEBPACK_IMPORTED_MODULE_0__["ViewCardComponent"]; });




/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\Users\Jandro\Files\Programming\node\spiffing\src\main.ts */"zUnb");


/***/ }),

/***/ "0nf9":
/*!********************************************************!*\
  !*** ./src/app/ui/views/settings/change-screenname.ts ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return changeScreenname; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var spiff_app_forms_validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! spiff/app/forms/validators */ "UdES");



function changeScreenname(dialogService, accountService) {
    const screennameControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](accountService.user.screenname, Object(spiff_app_forms_validators__WEBPACK_IMPORTED_MODULE_2__["valueMustNotBe"])(accountService.user.screenname));
    dialogService.openGenericDialog({
        title: 'Change Screen Name',
        submitText: 'Change',
        description: 'Please enter what you would like your new screen name to be.',
        fields: [
            {
                element: 'input',
                name: 'screenname',
                label: 'Screen Name',
                formControl: screennameControl
            }
        ],
        onSubmit: (dialog) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            dialog.loading = true;
            const updateRequest = yield accountService.patch({ screenname: screennameControl.value });
            dialog.loading = false;
            if (updateRequest.ok === true) {
                accountService.passwordChanged(screennameControl.value);
                dialog.closeDialog();
            }
        })
    });
}


/***/ }),

/***/ "2fy0":
/*!*************************************************!*\
  !*** ./src/app/ui/views/post/post.component.ts ***!
  \*************************************************/
/*! exports provided: PostComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostComponent", function() { return PostComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var interface_data_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! interface/data-types */ "fCvi");
/* harmony import */ var services_post_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! services/post.service */ "ENZJ");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var services_user_account_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! services/user-account.service */ "HEVm");
/* harmony import */ var services_snackbar_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! services/snackbar.service */ "p20J");
/* harmony import */ var api_services_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! api/services/api.service */ "YgqJ");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/progress-spinner */ "pu8Q");
/* harmony import */ var spiff_app_ui_components_rate_counter_rate_counter_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! spiff/app/ui/components/rate-counter/rate-counter.component */ "taxL");
/* harmony import */ var spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! spiff/app/ui/components */ "xXuK");
/* harmony import */ var spiff_app_pipes_date_ago_pipe__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! spiff/app/pipes/date-ago.pipe */ "6Kw5");

















function PostComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "mat-spinner");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PostComponent_ng_template_3_div_0_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "spiff-rate-counter", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("like", function PostComponent_ng_template_3_div_0_Template_spiff_rate_counter_like_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r9.likePost(); })("dislike", function PostComponent_ng_template_3_div_0_Template_spiff_rate_counter_dislike_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r11.dislikePost(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, "Submitted ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](10, "dateAgo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](17, "textarea", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "spiff-button", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("action", function PostComponent_ng_template_3_div_0_Template_spiff_button_action_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r10); const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r12.postComment(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19, "Post");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("item", ctx_r6.post)("liked", ctx_r6.state.liked)("disliked", ctx_r6.state.disliked);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r6.post.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("title", ctx_r6.numToDate(ctx_r6.post.date));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](10, 13, ctx_r6.post.date), " ago by ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", ctx_r6.linkToProfile(ctx_r6.post.author.username));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r6.post.author.username, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r6.post.content);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r6.commentsAmount + " comment" + (ctx_r6.commentsAmount === 1 ? "" : "s"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formControl", ctx_r6.commentControl);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !ctx_r6.commentControl.value)("loading", ctx_r6.postingComment);
} }
function PostComponent_ng_template_3_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Sorry, we couldn't find what you were looking for.");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "img", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Error: ", ctx_r8.errorMessage, "");
} }
function PostComponent_ng_template_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](0, PostComponent_ng_template_3_div_0_Template, 20, 15, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, PostComponent_ng_template_3_ng_template_1_Template, 6, 1, "ng-template", null, 8, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
} if (rf & 2) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](2);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.post)("ngIfElse", _r7);
} }
function PostComponent_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "mat-spinner", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("diameter", 50);
} }
function PostComponent_ng_template_6_div_0_p_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} }
function PostComponent_ng_template_6_div_0_Template(rf, ctx) { if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "spiff-rate-counter", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("like", function PostComponent_ng_template_6_div_0_Template_spiff_rate_counter_like_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r17); const comment_r14 = ctx.$implicit; const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r16.likeComment(comment_r14); })("dislike", function PostComponent_ng_template_6_div_0_Template_spiff_rate_counter_dislike_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r17); const comment_r14 = ctx.$implicit; const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r18.dislikeComment(comment_r14); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "a", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "p", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](8, "dateAgo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "p", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, PostComponent_ng_template_6_div_0_p_12_Template, 2, 0, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "reply");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
} if (rf & 2) {
    const comment_r14 = ctx.$implicit;
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("item", comment_r14)("liked", ctx_r13.isCommentLiked(comment_r14._id))("disliked", ctx_r13.isCommentDisliked(comment_r14._id));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", "/user/" + comment_r14.author.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](comment_r14.author.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("title", ctx_r13.numToDate(comment_r14.created));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](8, 9, comment_r14.created), " ago");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](comment_r14.content);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r13.isAuthor(comment_r14));
} }
function PostComponent_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](0, PostComponent_ng_template_6_div_0_Template, 15, 11, "div", 24);
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r5.comments);
} }
class PostComponent {
    constructor(title, route, post, account, snackbar, api) {
        this.state = {
            liked: false,
            disliked: false,
            postLoading: true,
            commentsLoading: true,
            commentsError: false
        };
        this.canDisplay = false;
        this.commentControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        this.postingComment = false;
        this.services = { account, api, post, route, snackbar, title };
    }
    updateRatings() {
        if (this.services.account.ratedPosts.has(this.post._id)) {
            const rating = this.services.account.ratedPosts.get(this.post._id);
            this.state.liked = rating;
            this.state.disliked = !rating;
        }
        else {
            this.state.liked = false;
            this.state.disliked = false;
        }
    }
    ngOnInit() {
        this.services.route.params.subscribe((params) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            try {
                this.post = (yield this.services.post.getPostById(params.id, true));
                this.services.title.setTitle(this.post.title);
                if (!this.services.account.user) {
                    this.services.account.events.subscribe((event) => {
                        if (event === true)
                            this.updateRatings();
                    });
                }
                else
                    this.updateRatings();
                if (this.post.comments.length) {
                    const commentsRequest = yield this.services.api.getComments({ parent: { type: 'post', id: this.post._id } }, true);
                    if (commentsRequest.ok) {
                        this.comments = commentsRequest.comments;
                        this.commentsAmount = this.comments.length;
                    }
                    else {
                        this.state.commentsError = true;
                        this.services.snackbar.push('An error occurred while retrieving the comments.');
                        console.error(commentsRequest);
                    }
                    this.state.commentsLoading = false;
                }
                else {
                    this.comments = [];
                    this.state.commentsLoading = false;
                }
            }
            catch (error) {
                if (error instanceof services_post_service__WEBPACK_IMPORTED_MODULE_3__["GetPostError"]) {
                    this.errorMessage = error.error;
                }
                else
                    throw error;
            }
            this.state.postLoading = false;
            this.canDisplay = !!this.post;
        }));
    }
    likePost() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (!this.services.account.user) {
                this.services.snackbar.push('Sorry, you must be logged in to do that.', 'OK', 5000);
                return;
            }
            if (this.state.liked) {
                const rateRequest = yield this.services.account.ratePost(this.post._id, 0);
                if (rateRequest.ok === true) {
                    this.services.account.ratedPosts.delete(this.post._id);
                    this.state.liked = false;
                    this.post.likes--;
                }
                else
                    throw new Error('Error while liking post in Post View: ' + rateRequest.error);
            }
            else {
                const rateRequest = yield this.services.account.ratePost(this.post._id, 1);
                if (rateRequest.ok === true) {
                    this.services.account.ratedPosts.set(this.post._id, true);
                    this.state.liked = true;
                    this.post.likes++;
                    if (this.state.disliked) {
                        this.state.disliked = false;
                        this.post.dislikes--;
                    }
                }
                else
                    throw new Error('Error while liking post in Post View: ' + rateRequest.error);
            }
        });
    }
    dislikePost() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (!this.services.account.user) {
                this.services.snackbar.push('Sorry, you must be logged in to do that.', 'OK', 5000);
                return;
            }
            if (this.state.disliked) {
                const rateRequest = yield this.services.account.ratePost(this.post._id, 0);
                if (rateRequest.ok === true) {
                    this.services.account.ratedPosts.delete(this.post._id);
                    this.state.disliked = false;
                    this.post.dislikes--;
                }
                else
                    throw new Error('Error while liking post in Post View: ' + rateRequest.error);
            }
            else {
                const rateRequest = yield this.services.account.ratePost(this.post._id, -1);
                if (rateRequest.ok === true) {
                    this.services.account.ratedPosts.set(this.post._id, false);
                    this.state.disliked = true;
                    this.post.dislikes++;
                    if (this.state.liked) {
                        this.state.liked = false;
                        this.post.likes--;
                    }
                }
                else
                    throw new Error('Error while liking post in Post View: ' + rateRequest.error);
            }
        });
    }
    likeComment(comment) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (!this.services.account.user) {
                this.services.snackbar.push('Sorry, you must be logged in to do that.', 'OK', 5000);
                return;
            }
            const isUnrated = !this.services.account.ratedComments.has(comment._id);
            const isDisliked = this.services.account.ratedComments.get(comment._id) === false;
            if (isUnrated || isDisliked) {
                const likeRes = yield this.services.account.rateComment(comment._id, 1);
                if (likeRes.ok) {
                    if (this.services.account.ratedComments.get(comment._id) === false)
                        comment.dislikes--;
                    this.services.account.ratedComments.set(comment._id, true);
                    comment.likes++;
                }
                else {
                    console.error(`Received an error while liking comment "${comment._id}"\n` +
                        `${JSON.stringify(likeRes)}`);
                    this.services.snackbar.push('An error occurred while liking that comment.');
                }
            }
            else {
                const unrateRes = yield this.services.account.rateComment(comment._id, 0);
                if (unrateRes.ok) {
                    this.services.account.ratedComments.delete(comment._id);
                    comment.likes--;
                }
                else {
                    console.error(`Received an error while unliking comment "${comment._id}"\n` +
                        `${JSON.stringify(unrateRes)}`);
                    this.services.snackbar.push('An error occurred while unrating that comment.');
                }
            }
        });
    }
    dislikeComment(comment) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (!this.services.account.user) {
                this.services.snackbar.push('Sorry, you must be logged in to do that.', 'OK', 5000);
                return;
            }
            const isUnrated = !this.services.account.ratedComments.has(comment._id);
            const isLiked = this.services.account.ratedComments.get(comment._id) === true;
            if (isUnrated || isLiked) {
                const dislikeRes = yield this.services.account.rateComment(comment._id, -1);
                if (dislikeRes.ok) {
                    if (this.services.account.ratedComments.get(comment._id) === true)
                        comment.likes--;
                    this.services.account.ratedComments.set(comment._id, false);
                    comment.dislikes++;
                }
                else {
                    console.error(`Received an error while disliking comment "${comment._id}"\n` +
                        `${JSON.stringify(dislikeRes)}`);
                    this.services.snackbar.push('An error occurred while disliking that comment.');
                }
            }
            else {
                const unrateRes = yield this.services.account.rateComment(comment._id, 0);
                if (unrateRes.ok) {
                    this.services.account.ratedComments.delete(comment._id);
                    comment.dislikes--;
                }
                else {
                    console.error(`Received an error while unrating comment "${comment._id}"\n` +
                        JSON.stringify(unrateRes));
                    this.services.snackbar.push('An error occurred while unrating that comment.');
                }
            }
        });
    }
    isCommentLiked(id) {
        if (!this.services.account.user)
            return false;
        if (!this.services.account.ratedComments.has(id))
            return false;
        return this.services.account.ratedComments.get(id);
    }
    isCommentDisliked(id) {
        if (!this.services.account.user)
            return false;
        if (!this.services.account.ratedComments.has(id))
            return false;
        return !this.services.account.ratedComments.get(id);
    }
    linkToProfile(username) {
        return `/user/${username}`;
    }
    postComment() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.postingComment = true;
            const response = yield this.services.account.postComment('post', this.post._id, this.commentControl.value);
            if (response.ok) {
                this.commentControl.reset();
                const commentCopy = Object.assign({}, response.comment);
                commentCopy.author = this.services.account.user;
                this.commentsAmount = this.comments.push(commentCopy);
            }
            else {
                console.error('Received an error while posting comment.\n' + JSON.stringify(response));
                this.services.snackbar.push('Something went wrong while posting your comment.', 'OK', 5000);
            }
            this.postingComment = false;
        });
    }
    numToDate(date) {
        return new Date(date * 1000).toUTCString();
    }
    isAuthor(comment) {
        var _a;
        return ((_a = this.services.account) === null || _a === void 0 ? void 0 : _a.user._id) === comment.author._id;
    }
}
PostComponent.ɵfac = function PostComponent_Factory(t) { return new (t || PostComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](services_post_service__WEBPACK_IMPORTED_MODULE_3__["PostService"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](services_user_account_service__WEBPACK_IMPORTED_MODULE_7__["UserAccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](services_snackbar_service__WEBPACK_IMPORTED_MODULE_8__["SnackbarService"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](api_services_api_service__WEBPACK_IMPORTED_MODULE_9__["ApiService"])); };
PostComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: PostComponent, selectors: [["spiff-post"]], decls: 8, vars: 4, consts: [[1, "view-container"], [1, "post-container", "section-container"], ["class", "loading-display", 4, "ngIf", "ngIfElse"], ["loaded", ""], [4, "ngIf", "ngIfElse"], ["commentsLoaded", ""], [1, "loading-display"], ["class", "loaded-post-container", 4, "ngIf", "ngIfElse"], ["cannotDisplay", ""], [1, "loaded-post-container"], [1, "post"], [3, "item", "liked", "disliked", "like", "dislike"], [1, "post-contents"], [1, "title"], [1, "submission-info"], [3, "title"], [1, "profile-link", 3, "routerLink"], [1, "post-content"], ["placeholder", "Leave a comment :-)", 1, "create-comment", 3, "formControl"], [1, "post-comment-button", 3, "disabled", "loading", "action"], [1, "not-found"], ["src", "/assets/not-found.png", 1, "public-image"], [1, "error-message"], [3, "diameter"], ["class", "comment section-container", 4, "ngFor", "ngForOf"], [1, "comment", "section-container"], [1, "comment-header"], [1, "comment-username", 3, "routerLink"], [1, "comment-content"], [1, "comment-footer"], [4, "ngIf"]], template: function PostComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, PostComponent_div_2_Template, 2, 0, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, PostComponent_ng_template_3_Template, 3, 2, "ng-template", null, 3, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, PostComponent_ng_container_5_Template, 2, 1, "ng-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, PostComponent_ng_template_6_Template, 1, 1, "ng-template", null, 5, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](4);
        const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.state.postLoading)("ngIfElse", _r1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.state.commentsLoading)("ngIfElse", _r4);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__["MatSpinner"], spiff_app_ui_components_rate_counter_rate_counter_component__WEBPACK_IMPORTED_MODULE_12__["RateCounterComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterLink"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlDirective"], spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_13__["ButtonComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterLinkWithHref"]], pipes: [spiff_app_pipes_date_ago_pipe__WEBPACK_IMPORTED_MODULE_14__["DateAgoPipe"]], styles: [".view-container[_ngcontent-%COMP%] {\n  width: 95%;\n  margin: auto;\n}\n.view-container[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  background-color: #fafafa;\n}\n.view-container[_ngcontent-%COMP%]   .section-container[_ngcontent-%COMP%] {\n  padding: 16px;\n  border-radius: 5px;\n  margin-bottom: 1em;\n  background-color: #fff;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%] {\n  border-radius: 5px;\n  box-sizing: border-box;\n  margin: 12px auto;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .not-found[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .not-found[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: auto;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .not-found[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  font-family: monospace;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%] {\n  display: flex;\n  margin-bottom: 1em;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%]   .post-contents[_ngcontent-%COMP%] {\n  margin-left: 20px;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%]   .post-contents[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%]   .post-contents[_ngcontent-%COMP%]   .submission-info[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%]   .post-contents[_ngcontent-%COMP%]   .submission-info[_ngcontent-%COMP%]   .profile-link[_ngcontent-%COMP%] {\n  color: #0064c8;\n  outline: none;\n  font-weight: 500;\n  cursor: pointer;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%]   .post-contents[_ngcontent-%COMP%]   .post-content[_ngcontent-%COMP%] {\n  padding: 5px;\n  border-radius: 5px;\n  border: 1px solid #0064c8;\n  background-color: whitesmoke;\n}\n.view-container[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .loaded-post-container[_ngcontent-%COMP%]   .create-comment[_ngcontent-%COMP%] {\n  width: 45%;\n  height: 50px;\n  border-radius: 3px;\n  border: 1px solid #0064c8;\n}\n.view-container[_ngcontent-%COMP%]   .comment.section-container[_ngcontent-%COMP%] {\n  display: flex;\n}\n.view-container[_ngcontent-%COMP%]   .comment.section-container[_ngcontent-%COMP%]   spiff-rate-counter[_ngcontent-%COMP%] {\n  margin-right: 1em;\n}\n.view-container[_ngcontent-%COMP%]   .comment.section-container[_ngcontent-%COMP%]   .comment-header[_ngcontent-%COMP%] {\n  display: flex;\n  font-size: 12px;\n}\n.view-container[_ngcontent-%COMP%]   .comment.section-container[_ngcontent-%COMP%]   .comment-header[_ngcontent-%COMP%]   a.comment-username[_ngcontent-%COMP%] {\n  font-weight: 500;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  color: #0064c8;\n  margin-right: 0.5em;\n}\n.view-container[_ngcontent-%COMP%]   .comment.section-container[_ngcontent-%COMP%]   .comment-footer[_ngcontent-%COMP%] {\n  display: flex;\n  font-size: 12px;\n}\n.view-container[_ngcontent-%COMP%]   .comment.section-container[_ngcontent-%COMP%]   .comment-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  color: #969696;\n  margin: 0 3px;\n}\n.view-container[_ngcontent-%COMP%]   .comment.section-container[_ngcontent-%COMP%]   .comment-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:hover {\n  color: initial;\n}\n.view-container[_ngcontent-%COMP%]   .comment.section-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\nmat-spinner[_ngcontent-%COMP%] {\n  margin: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxccG9zdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFVBQUE7RUFDQSxZQUFBO0FBQ0o7QUFDSTtFQUNJLHlCQUFBO0FBQ1I7QUFFSTtFQUNJLGFBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0Esc0JBQUE7RUFDQSx3Q0FBQTtBQUFSO0FBR0k7RUFDSSxrQkFBQTtFQUNBLHNCQUFBO0VBQ0EsaUJBQUE7QUFEUjtBQUdRO0VBQ0ksa0JBQUE7QUFEWjtBQUdZO0VBQ0ksMEJBQUE7RUFBQSx1QkFBQTtFQUFBLGtCQUFBO0VBQ0EsWUFBQTtBQURoQjtBQUlZO0VBQ0ksc0JBQUE7QUFGaEI7QUFNUTtFQUNJLGdCQUFBO0FBSlo7QUFNWTtFQUNJLGFBQUE7RUFDQSxrQkFBQTtBQUpoQjtBQU1nQjtFQUFJLGdCQUFBO0FBSHBCO0FBS2dCO0VBQ0ksaUJBQUE7QUFIcEI7QUFLb0I7RUFBUyxlQUFBO0FBRjdCO0FBSW9CO0VBQ0ksZUFBQTtBQUZ4QjtBQUl3QjtFQUNJLGNBQUE7RUFDQSxhQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0FBRjVCO0FBTW9CO0VBQ0ksWUFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7RUFDQSw0QkFBQTtBQUp4QjtBQVNZO0VBQ0ksVUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO0FBUGhCO0FBYUk7RUFDSSxhQUFBO0FBWFI7QUFhUTtFQUNJLGlCQUFBO0FBWFo7QUFjUTtFQUNJLGFBQUE7RUFDQSxlQUFBO0FBWlo7QUFjWTtFQUNJLGdCQUFBO0VBQ0EsMEJBQUE7RUFBQSx1QkFBQTtFQUFBLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0FBWmhCO0FBZ0JRO0VBQ0ksYUFBQTtFQUNBLGVBQUE7QUFkWjtBQWdCWTtFQUNJLDBCQUFBO0VBQUEsdUJBQUE7RUFBQSxrQkFBQTtFQUNBLGNBQUE7RUFDQSxhQUFBO0FBZGhCO0FBZ0JnQjtFQUNJLGNBQUE7QUFkcEI7QUFvQlE7RUFDSSxTQUFBO0FBbEJaO0FBd0JBO0VBQ0ksWUFBQTtBQXJCSiIsImZpbGUiOiJwb3N0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnZpZXctY29udGFpbmVyIHtcclxuICAgIHdpZHRoOiA5NSU7XHJcbiAgICBtYXJnaW46IGF1dG87XHJcblxyXG4gICAgdGV4dGFyZWEge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTAsMjUwLDI1MCk7XHJcbiAgICB9XHJcblxyXG4gICAgLnNlY3Rpb24tY29udGFpbmVyIHtcclxuICAgICAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAxZW07XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLDAsMCwgNTAlKTtcclxuICAgIH1cclxuXHJcbiAgICAucG9zdC1jb250YWluZXIge1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgICAgIG1hcmdpbjogMTJweCBhdXRvO1xyXG5cclxuICAgICAgICAubm90LWZvdW5kIHtcclxuICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG5cclxuICAgICAgICAgICAgaW1nIHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBmaXQtY29udGVudDtcclxuICAgICAgICAgICAgICAgIG1hcmdpbjogYXV0bztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLmVycm9yLW1lc3NhZ2Uge1xyXG4gICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmxvYWRlZC1wb3N0LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcblxyXG4gICAgICAgICAgICAucG9zdCB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMWVtO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgeyBtYXJnaW4tYm90dG9tOiAwOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgLnBvc3QtY29udGVudHMge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAyMHB4O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAudGl0bGUgeyBmb250LXNpemU6IDIwcHg7IH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Ym1pc3Npb24taW5mbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wcm9maWxlLWxpbmsge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHJnYigwLDEwMCwyMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC5wb3N0LWNvbnRlbnQge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiA1cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiKDAsMTAwLDIwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNDUsMjQ1LDI0NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAuY3JlYXRlLWNvbW1lbnQge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQ1JTtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogNTBweDtcclxuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYigwLDEwMCwyMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAuY29tbWVudC5zZWN0aW9uLWNvbnRhaW5lciB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuXHJcbiAgICAgICAgc3BpZmYtcmF0ZS1jb3VudGVyIHtcclxuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY29tbWVudC1oZWFkZXIge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcblxyXG4gICAgICAgICAgICBhLmNvbW1lbnQtdXNlcm5hbWUge1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBmaXQtY29udGVudDtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiByZ2IoMCwxMDAsMjAwKTtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMC41ZW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jb21tZW50LWZvb3RlciB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuXHJcbiAgICAgICAgICAgIHAge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IHJnYigxNTAsMTUwLDE1MCk7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAgM3B4O1xyXG5cclxuICAgICAgICAgICAgICAgICY6aG92ZXIge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBpbml0aWFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcCB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tYXQtc3Bpbm5lciB7XHJcbiAgICBtYXJnaW46IGF1dG87XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ "5RoO":
/*!**************************************************!*\
  !*** ./src/app/api/services/api-http.service.ts ***!
  \**************************************************/
/*! exports provided: ApiHttpService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiHttpService", function() { return ApiHttpService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var spiff_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! spiff/environments/environment */ "AytR");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");





class ApiHttpService {
    constructor(http) {
        this.http = http;
        this.apiUrl = spiff_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].apiHost;
    }
    createUrl(path, query) {
        Object.keys(query).forEach(key => { if (!query[key])
            delete query[key]; });
        let fullPath = this.apiUrl + '/';
        fullPath += path.join('/');
        if (query) {
            const queryKeys = Object.keys(query);
            if (queryKeys.length) {
                const firstKey = queryKeys.shift();
                fullPath += `?${firstKey}=${query[firstKey]}`;
                queryKeys.forEach(key => fullPath += `&${key}=${query[key]}`);
            }
        }
        return fullPath;
    }
    request(method, path, query, body, headers) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const url = this.createUrl(path, query);
            console.log(`[NET] ${method} ${url}`);
            try {
                return yield this.http.request(method, url, { body, headers }).toPromise();
            }
            catch (error) {
                if (error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpErrorResponse"]) {
                    if (error.error instanceof ProgressEvent) {
                        throw new Error('NoConnection');
                    }
                    if (error.error.hasOwnProperty('error') && error.error.hasOwnProperty('ok')) {
                        return error.error;
                    }
                }
                console.error('[NET] Request Error!');
                console.log(error);
                throw error;
            }
        });
    }
    get(path, query = {}, headers = {}) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return yield this.request('GET', path, query, {}, headers);
        });
    }
    post(path, body = {}, headers = {}) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return yield this.request('POST', path, {}, body, headers);
        });
    }
    delete(path, headers = {}) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return yield this.request('DELETE', path, {}, {}, headers);
        });
    }
    patch(path, body, headers = {}) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return yield this.request('PATCH', path, {}, body, headers);
        });
    }
}
ApiHttpService.ɵfac = function ApiHttpService_Factory(t) { return new (t || ApiHttpService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"])); };
ApiHttpService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: ApiHttpService, factory: ApiHttpService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "5o7i":
/*!**************************************************!*\
  !*** ./src/app/api/interface/responses/index.ts ***!
  \**************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_responses__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-responses */ "xIDh");
/* empty/unused harmony star reexport *//* harmony import */ var _auth_responses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth-responses */ "9T50");
/* empty/unused harmony star reexport *//* harmony import */ var _error_responses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error-responses */ "de0n");
/* empty/unused harmony star reexport */




/***/ }),

/***/ "5wBu":
/*!**********************************************************!*\
  !*** ./src/app/ui/components/dialog/dialog.component.ts ***!
  \**********************************************************/
/*! exports provided: DialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DialogComponent", function() { return DialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");

class DialogComponent {
    constructor() {
        this.title = 'Dialog Title';
    }
    ngOnInit() {
    }
}
DialogComponent.ɵfac = function DialogComponent_Factory(t) { return new (t || DialogComponent)(); };
DialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: DialogComponent, selectors: [["spiff-dialog"]], inputs: { title: "title" }, decls: 9, vars: 1, consts: [["mat-dialog-title", ""], ["mat-dialog-actions", "", 1, "spiff-dialog-actions"], ["mat-button", "", "color", "primary"]], template: function DialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "lol");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "spiff-button");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Change");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.title);
    } }, styles: [".spiff-dialog-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksYUFBQTtFQUNBLDhCQUFBO0FBQ0oiLCJmaWxlIjoiZGlhbG9nLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNwaWZmLWRpYWxvZy1hY3Rpb25zIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbn0iXX0= */"] });


/***/ }),

/***/ "6H7M":
/*!***********************************************!*\
  !*** ./src/app/ui/components/button/index.ts ***!
  \***********************************************/
/*! exports provided: ButtonComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _button_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button.component */ "s5BX");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ButtonComponent", function() { return _button_component__WEBPACK_IMPORTED_MODULE_0__["ButtonComponent"]; });




/***/ }),

/***/ "6Kw5":
/*!****************************************!*\
  !*** ./src/app/pipes/date-ago.pipe.ts ***!
  \****************************************/
/*! exports provided: DateAgoPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateAgoPipe", function() { return DateAgoPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");

class DateAgoPipe {
    transform(num) {
        const now = new Date();
        const then = new Date(num * 1000);
        const seconds = Math.round((now.getTime() - then.getTime()) / 1000);
        if (seconds < 60)
            return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
        const minutes = Math.round(seconds / 60);
        if (minutes < 60)
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        const hours = Math.round(minutes / 60);
        if (hours < 24)
            return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        const days = Math.round(hours / 24);
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
}
DateAgoPipe.ɵfac = function DateAgoPipe_Factory(t) { return new (t || DateAgoPipe)(); };
DateAgoPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "dateAgo", type: DateAgoPipe, pure: true });


/***/ }),

/***/ "6Vpe":
/*!**********************************************************************!*\
  !*** ./src/app/ui/components/dialogs/create-account-dialog/index.ts ***!
  \**********************************************************************/
/*! exports provided: CreateAccountDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _create_account_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-account-dialog.component */ "Pz58");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CreateAccountDialogComponent", function() { return _create_account_dialog_component__WEBPACK_IMPORTED_MODULE_0__["CreateAccountDialogComponent"]; });




/***/ }),

/***/ "6hrT":
/*!*************************************************!*\
  !*** ./src/app/forms/validator-error-string.ts ***!
  \*************************************************/
/*! exports provided: errorsToString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "errorsToString", function() { return errorsToString; });
function errorsToString(errorObj) {
    for (const errorName of Object.keys(errorObj)) {
        switch (errorName) {
            case 'sameValue':
                return 'Does not match.';
            case 'required':
                return 'This field is required.';
            case 'mustNotEqual':
                return `Must not equal ${errorObj[errorName].mustNotEqual}.`;
            default:
                return `Error: ${errorName}`;
        }
    }
}


/***/ }),

/***/ "6uCP":
/*!*******************************************************!*\
  !*** ./src/app/ui/views/profile/profile.component.ts ***!
  \*******************************************************/
/*! exports provided: ProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileComponent", function() { return ProfileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var spiff_app_services_post_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! spiff/app/services/post.service */ "ENZJ");
/* harmony import */ var spiff_app_services_dialog_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! spiff/app/services/dialog.service */ "CzQJ");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var spiff_app_api_services_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! spiff/app/api/services/api.service */ "YgqJ");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "PDjf");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/progress-spinner */ "pu8Q");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");











function ProfileComponent_hr_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "hr");
} }
function ProfileComponent_mat_spinner_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 9);
} }
function ProfileComponent_ng_template_10_button_0_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ProfileComponent_ng_template_10_button_0_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r8.dialog.openCreatePostDialog(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Make a Post");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function ProfileComponent_ng_template_10_ng_template_1_Template(rf, ctx) { }
function ProfileComponent_ng_template_10_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h3", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const post_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", "/post/" + post_r10._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](post_r10.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](post_r10.content);
} }
function ProfileComponent_ng_template_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, ProfileComponent_ng_template_10_button_0_Template, 2, 0, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, ProfileComponent_ng_template_10_ng_template_1_Template, 0, 0, "ng-template", null, 11, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, ProfileComponent_ng_template_10_div_4_Template, 5, 3, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](2);
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r3.posts.length)("ngIfElse", _r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r3.posts);
} }
class ProfileComponent {
    constructor(title, post, dialog, route, api) {
        this.title = title;
        this.post = post;
        this.dialog = dialog;
        this.route = route;
        this.api = api;
        this.loadingPosts = true;
        this.postStream = post.postEvents.subscribe(() => this.refreshPosts());
    }
    ngOnDestroy() {
        this.postStream.unsubscribe();
    }
    ngOnInit() {
        this.route.params.subscribe((params) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.username = params.username;
            const userRequest = yield this.api.getUsers({ username: this.username });
            if (userRequest.ok === true) {
                const user = userRequest.users[0];
                this.id = user._id;
                this.screenname = user.screenname;
                this.createdTimestamp = user.created;
                this.refreshPosts();
                this.title.setTitle(`user ${this.username}`);
            }
            else
                throw new Error(userRequest.error);
        }));
    }
    refreshPosts() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const posts = yield this.getPosts();
            this.posts = posts.sort((a, b) => {
                if (a.date < b.date) {
                    return 1;
                }
                else if (b.date < a.date) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        });
    }
    getPosts() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.loadingPosts = true;
            const response = yield this.post.getPostsByUserId(this.id);
            this.loadingPosts = false;
            return response;
        });
    }
}
ProfileComponent.ɵfac = function ProfileComponent_Factory(t) { return new (t || ProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](spiff_app_services_post_service__WEBPACK_IMPORTED_MODULE_3__["PostService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](spiff_app_services_dialog_service__WEBPACK_IMPORTED_MODULE_4__["DialogService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](spiff_app_api_services_api_service__WEBPACK_IMPORTED_MODULE_6__["ApiService"])); };
ProfileComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: ProfileComponent, selectors: [["spiff-view-profile"]], decls: 12, vars: 5, consts: [[1, "container"], [1, "profile"], [1, "screen-name"], [1, "user-area"], ["src", "/assets/anon.png", 1, "profile-picture"], [1, "username"], [4, "ngIf"], ["class", "post-spinner", 4, "ngIf", "ngIfElse"], ["ngPosts", ""], [1, "post-spinner"], ["mat-raised-button", "", "color", "primary", "class", "make-post-button", 3, "click", 4, "ngIf", "ngIfElse"], ["tingy", ""], [1, "post-container"], ["class", "post", 3, "routerLink", 4, "ngFor", "ngForOf"], ["mat-raised-button", "", "color", "primary", 1, "make-post-button", 3, "click"], [1, "post", 3, "routerLink"], [1, "post-title"], [1, "post-content"]], template: function ProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-card", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "h2", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, ProfileComponent_hr_8_Template, 1, 0, "hr", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, ProfileComponent_mat_spinner_9_Template, 1, 0, "mat-spinner", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, ProfileComponent_ng_template_10_Template, 5, 3, "ng-template", null, 8, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.screenname);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.username);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loadingPosts || ctx.posts.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loadingPosts)("ngIfElse", _r2);
    } }, directives: [_angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCard"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__["MatSpinner"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgForOf"], _angular_material_button__WEBPACK_IMPORTED_MODULE_10__["MatButton"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterLink"]], styles: [".container[_ngcontent-%COMP%] {\n  padding: 0 20px;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 16px 10%;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .screen-name[_ngcontent-%COMP%] {\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: 0 auto 10px auto;\n  font-weight: 300;\n  height: 32px;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .user-area[_ngcontent-%COMP%] {\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .user-area[_ngcontent-%COMP%]   .profile-picture[_ngcontent-%COMP%] {\n  display: block;\n  border-radius: 50%;\n  max-width: 150px;\n  min-width: 75px;\n  margin: auto;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .user-area[_ngcontent-%COMP%]   .username[_ngcontent-%COMP%] {\n  display: block;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: auto;\n  font-weight: 500;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .post-spinner[_ngcontent-%COMP%] {\n  margin: auto;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .make-post-button[_ngcontent-%COMP%] {\n  display: block;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: auto;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 200px 200px 200px;\n  grid-auto-rows: 200px;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: auto;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%] {\n  overflow: hidden;\n  padding: 10px;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%]   .post-title[_ngcontent-%COMP%] {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  margin: 0;\n  font-weight: 500;\n}\n.container[_ngcontent-%COMP%]   .profile[_ngcontent-%COMP%]   .post-container[_ngcontent-%COMP%]   .post[_ngcontent-%COMP%]   .post-content[_ngcontent-%COMP%] {\n  text-overflow: ellipsis;\n}\n.post-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n}\n.post-section[_ngcontent-%COMP%]   .profile-post-preview[_ngcontent-%COMP%] {\n  max-width: 20%;\n  height: -webkit-fit-content;\n  height: -moz-fit-content;\n  height: fit-content;\n  max-height: 200px;\n  overflow: auto;\n  margin: 10px;\n}\n.post-section[_ngcontent-%COMP%]   .profile-post-preview[_ngcontent-%COMP%]   .post-title[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxccHJvZmlsZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGVBQUE7QUFDSjtBQUNJO0VBQ0ksaUJBQUE7RUFDQSxjQUFBO0VBQ0EsaUJBQUE7QUFDUjtBQUNRO0VBQ0ksMEJBQUE7RUFBQSx1QkFBQTtFQUFBLGtCQUFBO0VBQ0Esd0JBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7QUFDWjtBQUVRO0VBQ0ksMEJBQUE7RUFBQSx1QkFBQTtFQUFBLGtCQUFBO0FBQVo7QUFFWTtFQUNJLGNBQUE7RUFDQSxrQkFBQTtFQUVBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLFlBQUE7QUFEaEI7QUFJWTtFQUNJLGNBQUE7RUFDQSwwQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7QUFGaEI7QUFNUTtFQUNJLFlBQUE7QUFKWjtBQU9RO0VBQ0ksY0FBQTtFQUNBLDBCQUFBO0VBQUEsdUJBQUE7RUFBQSxrQkFBQTtFQUNBLFlBQUE7QUFMWjtBQVFRO0VBQ0ksYUFBQTtFQUNBLHdDQUFBO0VBQ0EscUJBQUE7RUFDQSwwQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7RUFDQSxZQUFBO0FBTlo7QUFRWTtFQUNJLGdCQUFBO0VBQ0EsYUFBQTtBQU5oQjtBQWVnQjtFQUVJLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFNBQUE7RUFDQSxnQkFBQTtBQWRwQjtBQWlCZ0I7RUFFSSx1QkFBQTtBQWhCcEI7QUF1QkE7RUFDSSxhQUFBO0VBQ0EsZUFBQTtBQXBCSjtBQXNCSTtFQUNJLGNBQUE7RUFDQSwyQkFBQTtFQUFBLHdCQUFBO0VBQUEsbUJBQUE7RUFDQSxpQkFBQTtFQUNBLGNBQUE7RUFDQSxZQUFBO0FBcEJSO0FBeUJRO0VBQ0ksZ0JBQUE7QUF2QloiLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb250YWluZXIge1xyXG4gICAgcGFkZGluZzogMCAyMHB4O1xyXG5cclxuICAgIC5wcm9maWxlIHtcclxuICAgICAgICBtYXgtd2lkdGg6IDEyMDBweDtcclxuICAgICAgICBtYXJnaW46IDAgYXV0bztcclxuICAgICAgICBwYWRkaW5nOiAxNnB4IDEwJTtcclxuXHJcbiAgICAgICAgLnNjcmVlbi1uYW1lIHtcclxuICAgICAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgICAgICAgICBtYXJnaW46IDAgYXV0byAxMHB4IGF1dG87XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XHJcbiAgICAgICAgICAgIGhlaWdodDogMzJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC51c2VyLWFyZWEge1xyXG4gICAgICAgICAgICB3aWR0aDogZml0LWNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICAucHJvZmlsZS1waWN0dXJlIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgICAgICAgICAgICAgLy8gd2lkdGg6IDM1JTtcclxuICAgICAgICAgICAgICAgIG1heC13aWR0aDogMTUwcHg7XHJcbiAgICAgICAgICAgICAgICBtaW4td2lkdGg6IDc1cHg7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IGF1dG87XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC51c2VybmFtZSB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBmaXQtY29udGVudDtcclxuICAgICAgICAgICAgICAgIG1hcmdpbjogYXV0bztcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5wb3N0LXNwaW5uZXIge1xyXG4gICAgICAgICAgICBtYXJnaW46IGF1dG87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAubWFrZS1wb3N0LWJ1dHRvbiB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICB3aWR0aDogZml0LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgIG1hcmdpbjogYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5wb3N0LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMjAwcHggMjAwcHggMjAwcHg7XHJcbiAgICAgICAgICAgIGdyaWQtYXV0by1yb3dzOiAyMDBweDtcclxuICAgICAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgICAgICAgICBtYXJnaW46IGF1dG87XHJcblxyXG4gICAgICAgICAgICAucG9zdCB7XHJcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMTBweDtcclxuICAgICAgICAgICAgICAgIC8vIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgICAgICAgIC8vIHdpZHRoOiAyNSU7XHJcbiAgICAgICAgICAgICAgICAvLyBoZWlnaHQ6IDEwMHB4O1xyXG4gICAgICAgICAgICAgICAgLy8gcGFkZGluZzogNXB4O1xyXG4gICAgICAgICAgICAgICAgLy8gYm9yZGVyOiAxcHggc29saWQgcmVkO1xyXG4gICAgICAgICAgICAgICAgLy8gdmVydGljYWwtYWxpZ246IHRvcDtcclxuICAgICAgICAgICAgICAgIC8vIG92ZXJmbG93OiBoaWRkZW47XHJcblxyXG4gICAgICAgICAgICAgICAgLnBvc3QtdGl0bGUge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdpZHRoOiBmaXQtY29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLnBvc3QtY29udGVudCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4ucG9zdC1zZWN0aW9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcblxyXG4gICAgLnByb2ZpbGUtcG9zdC1wcmV2aWV3IHtcclxuICAgICAgICBtYXgtd2lkdGg6IDIwJTtcclxuICAgICAgICBoZWlnaHQ6IGZpdC1jb250ZW50O1xyXG4gICAgICAgIG1heC1oZWlnaHQ6IDIwMHB4O1xyXG4gICAgICAgIG92ZXJmbG93OiBhdXRvO1xyXG4gICAgICAgIG1hcmdpbjogMTBweDtcclxuICAgICAgICAvLyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgLy8gb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAvLyBtYXJnaW46IDAgMTBweDtcclxuXHJcbiAgICAgICAgLnBvc3QtdGl0bGUge1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ== */"] });


/***/ }),

/***/ "8Fwg":
/*!************************************************!*\
  !*** ./src/app/ui/views/landing-page/index.ts ***!
  \************************************************/
/*! exports provided: LandingPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _landing_page_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./landing-page.component */ "wJhU");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LandingPageComponent", function() { return _landing_page_component__WEBPACK_IMPORTED_MODULE_0__["LandingPageComponent"]; });




/***/ }),

/***/ "9T50":
/*!***********************************************************!*\
  !*** ./src/app/api/interface/responses/auth-responses.ts ***!
  \***********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is autogenerated; changes may be overwritten.



/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false,
    apiHost: 'http://localhost:4008'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "CzQJ":
/*!********************************************!*\
  !*** ./src/app/services/dialog.service.ts ***!
  \********************************************/
/*! exports provided: DialogService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DialogService", function() { return DialogService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var spiff_app_ui_components_text_field_dialog_text_field_dialog_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! spiff/app/ui/components/text-field-dialog/text-field-dialog.component */ "aAar");
/* harmony import */ var spiff_app_ui_components_dialogs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! spiff/app/ui/components/dialogs */ "x+Ag");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/dialog */ "iELJ");
/* harmony import */ var spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! spiff/app/services/user-account.service */ "HEVm");









class DialogService {
    constructor(dialog, router, account) {
        this.dialog = dialog;
        this.router = router;
        this.account = account;
        this.urlSegments = [];
        this.router.events.subscribe(event => {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivationEnd"]) {
                this.urlSegments = event.snapshot.url.map(seg => seg.path);
            }
        });
    }
    openDialog(className, dialogParam, qParams) {
        const dialogRef = this.dialog.open(className, { width: '80%' });
        return dialogRef;
    }
    openGenericDialog(config = { title: null, cancelText: null, submitText: null, description: null, fields: [], onSubmit: null }) {
        const dialog = this.dialog.open(spiff_app_ui_components_text_field_dialog_text_field_dialog_component__WEBPACK_IMPORTED_MODULE_3__["TextFieldDialogComponent"], { width: '80%' });
        const instance = dialog.componentInstance;
        instance.dialogRef = dialog;
        if (config.title)
            instance.title = config.title;
        if (config.description)
            instance.description = config.description;
        if (config.fields && config.fields.length)
            instance.fields = config.fields;
        if (config.onSubmit)
            instance.submit.subscribe(() => config.onSubmit(instance));
        return dialog;
    }
    openCreatePostDialog() {
        const titleControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]);
        const contentControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]);
        this.openGenericDialog({
            title: 'Create Post',
            fields: [
                { element: 'input', name: 'title input', label: 'Title', formControl: titleControl },
                { element: 'text-area', name: 'content input', label: 'Content', formControl: contentControl }
            ],
            onSubmit: (ref) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                ref.loading = true;
                const createPostResponse = yield this.account.createPost(titleControl.value, contentControl.value);
                if (createPostResponse.ok === true) {
                    ref.closeDialog();
                }
                else
                    throw new Error(createPostResponse.error);
            })
        });
    }
    openRegisterDialog() {
        if (!this.registerDialog)
            this.openDialog(spiff_app_ui_components_dialogs__WEBPACK_IMPORTED_MODULE_4__["CreateAccountDialogComponent"], 'register');
    }
    openLoginDialog() {
        if (!this.loginDialog)
            this.openDialog(spiff_app_ui_components_dialogs__WEBPACK_IMPORTED_MODULE_4__["LoginDialogComponent"], 'login');
    }
    openChangeUsernameDialog() {
        this.dialog.open(spiff_app_ui_components_dialogs__WEBPACK_IMPORTED_MODULE_4__["ChangeUsernameDialogComponent"], { autoFocus: false });
    }
    openDeleteAccountDialog() {
        this.dialog.open(spiff_app_ui_components_dialogs__WEBPACK_IMPORTED_MODULE_4__["DeleteAccountConfirmDialogComponent"]);
    }
}
DialogService.ɵfac = function DialogService_Factory(t) { return new (t || DialogService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_6__["MatDialog"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_7__["UserAccountService"])); };
DialogService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({ token: DialogService, factory: DialogService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "DRYZ":
/*!***************************************************!*\
  !*** ./src/app/services/local-storage.service.ts ***!
  \***************************************************/
/*! exports provided: LOCAL_STORAGE_ACCOUNT_KEY, LocalStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOCAL_STORAGE_ACCOUNT_KEY", function() { return LOCAL_STORAGE_ACCOUNT_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalStorageService", function() { return LocalStorageService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");

const LOCAL_STORAGE_ACCOUNT_KEY = 'spf-account';
class LocalStorageService {
    write(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    read(key) {
        const data = JSON.parse(localStorage.getItem(key));
        return data || null;
    }
    delete(key) {
        localStorage.removeItem(key);
    }
}
LocalStorageService.ɵfac = function LocalStorageService_Factory(t) { return new (t || LocalStorageService)(); };
LocalStorageService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: LocalStorageService, factory: LocalStorageService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "EC8C":
/*!************************************!*\
  !*** ./src/app/util/basic-auth.ts ***!
  \************************************/
/*! exports provided: basicAuthorization */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "basicAuthorization", function() { return basicAuthorization; });
function basicAuthorization(username, password) {
    return `Basic ${btoa(`${username}:${password}`)}`;
}


/***/ }),

/***/ "ENZJ":
/*!******************************************!*\
  !*** ./src/app/services/post.service.ts ***!
  \******************************************/
/*! exports provided: GetPostError, PostService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetPostError", function() { return GetPostError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostService", function() { return PostService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var spiff_app_api_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! spiff/app/api/services/api.service */ "YgqJ");




class GetPostError extends Error {
    constructor(message, error) {
        super(message);
        this.error = error;
    }
}
class PostService {
    constructor(api) {
        this.api = api;
        this.postEvents = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
    }
    getPostsByUserId(id, includeAuthorUser = false) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const postsRequest = yield this.api.getPosts(Object.assign({ author: id }, includeAuthorUser && { include: 'authorUser' }));
            if (postsRequest.ok === true) {
                return postsRequest.posts;
            }
            else {
                console.error(`Error while requesting posts: ${postsRequest.error}`);
                return [];
            }
        });
    }
    getPostById(id, includeAuthorUser = false) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const postRequest = yield this.api.getPosts(Object.assign({ id }, includeAuthorUser && { include: 'authorUser' }));
            if (postRequest.ok === true) {
                return postRequest.posts[0];
            }
            else
                throw new GetPostError(`Error while requesting post ${id}: ${postRequest.error}`, postRequest.error);
        });
    }
}
PostService.ɵfac = function PostService_Factory(t) { return new (t || PostService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](spiff_app_api_services_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"])); };
PostService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: PostService, factory: PostService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "F33o":
/*!*************************************************************!*\
  !*** ./src/app/components/not-found/not-found.component.ts ***!
  \*************************************************************/
/*! exports provided: NotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundComponent", function() { return NotFoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");

class NotFoundComponent {
    constructor() { }
    ngOnInit() {
    }
}
NotFoundComponent.ɵfac = function NotFoundComponent_Factory(t) { return new (t || NotFoundComponent)(); };
NotFoundComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NotFoundComponent, selectors: [["app-not-found"]], decls: 2, vars: 0, template: function NotFoundComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "not-found works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJub3QtZm91bmQuY29tcG9uZW50LnNjc3MifQ== */"] });


/***/ }),

/***/ "HEVm":
/*!**************************************************!*\
  !*** ./src/app/services/user-account.service.ts ***!
  \**************************************************/
/*! exports provided: UserAccountService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserAccountService", function() { return UserAccountService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var services_local_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! services/local-storage.service */ "DRYZ");
/* harmony import */ var api_services_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! api/services/api.service */ "YgqJ");






class UserAccountService {
    constructor(ls, api) {
        this.ls = ls;
        this.api = api;
        this.user = null;
        this.events = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.ratedPosts = new Map();
        this.ratedComments = new Map();
    }
    login(username, password) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const authenticateRequest = yield this.api.authorize(username, password);
            if (authenticateRequest.ok) {
                this.password = password;
                const getUserRes = yield this.api.getUsers({ username });
                if (getUserRes.ok) {
                    this.user = getUserRes.users[0];
                    const getRatesRes = yield this.getRates();
                    if (getRatesRes.ok) {
                        for (const postId of getRatesRes.rates.posts.liked)
                            this.ratedPosts.set(postId, true);
                        for (const postId of getRatesRes.rates.posts.disliked)
                            this.ratedPosts.set(postId, false);
                        for (const commentId of getRatesRes.rates.comments.liked)
                            this.ratedComments.set(commentId, true);
                        for (const commentId of getRatesRes.rates.comments.disliked)
                            this.ratedComments.set(commentId, false);
                    }
                    else {
                        console.error('Received an error from the API while requesting user' +
                            'rates during login.\n' + JSON.stringify(getRatesRes));
                        return false;
                    }
                    this.events.emit('LOG_IN');
                }
                else {
                    console.error('Received an error from the API while requesting user\n' +
                        JSON.stringify(getUserRes));
                    return false;
                }
                this.ls.write(services_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LOCAL_STORAGE_ACCOUNT_KEY"], { username, password });
                return true;
            }
            return false;
        });
    }
    logOut() {
        this.user = null;
        this.ls.delete(services_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LOCAL_STORAGE_ACCOUNT_KEY"]);
        this.events.emit('LOG_OUT');
    }
    deregister() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const deregisterResponse = yield this.api.deregister(this.user.username, this.password);
            if (deregisterResponse.ok === true)
                this.logOut();
            return deregisterResponse;
        });
    }
    patch(changes) {
        return this.api.patch(this.user.username, this.password, changes);
    }
    createPost(title, content) {
        return this.api.createPost(this.user.username, this.password, title, content);
    }
    ratePost(postId, rating) {
        return this.api.ratePost(this.user.username, this.password, postId, rating);
    }
    getRates() {
        return this.api.getRates(this.user.username, this.password, this.user._id);
    }
    postComment(parentType, parentId, content) {
        return this.api.postComment(this.user.username, this.password, parentType, parentId, content);
    }
    rateComment(commentId, rating) {
        return this.api.rateComment(this.user.username, this.password, commentId, rating);
    }
    usernameChanged(newUsername) {
        this.user.username = newUsername;
        this.ls.write(services_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LOCAL_STORAGE_ACCOUNT_KEY"], { username: newUsername, password: this.password });
    }
    passwordChanged(password) {
        this.password = password;
        this.ls.write(services_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LOCAL_STORAGE_ACCOUNT_KEY"], { username: this.user.username, password: this.password });
        this.events.emit('PASSWORD_CHANGE');
    }
}
UserAccountService.ɵfac = function UserAccountService_Factory(t) { return new (t || UserAccountService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](services_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](api_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"])); };
UserAccountService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: UserAccountService, factory: UserAccountService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "JdS8":
/*!*************************************************************!*\
  !*** ./src/app/ui/components/dialogs/login-dialog/index.ts ***!
  \*************************************************************/
/*! exports provided: LoginDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _login_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login-dialog.component */ "ises");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoginDialogComponent", function() { return _login_dialog_component__WEBPACK_IMPORTED_MODULE_0__["LoginDialogComponent"]; });




/***/ }),

/***/ "LA4+":
/*!****************************************************************************************************************!*\
  !*** ./src/app/ui/components/dialogs/delete-account-confirm-dialog/delete-account-confirm-dialog.component.ts ***!
  \****************************************************************************************************************/
/*! exports provided: DeleteAccountConfirmDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteAccountConfirmDialogComponent", function() { return DeleteAccountConfirmDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ "iELJ");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var spiff_app_services_snackbar_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! spiff/app/services/snackbar.service */ "p20J");
/* harmony import */ var spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! spiff/app/services/user-account.service */ "HEVm");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");
/* harmony import */ var spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! spiff/app/ui/components */ "xXuK");








class DeleteAccountConfirmDialogComponent {
    constructor(dialog, router, snackbar, account) {
        this.dialog = dialog;
        this.router = router;
        this.snackbar = snackbar;
        this.account = account;
        this.accountDeletionInProgress = false;
    }
    deleteAccount() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.accountDeletionInProgress = true;
            const deregisterRequest = yield this.account.deregister();
            if (deregisterRequest.ok === true) {
                this.accountDeletionInProgress = false;
                this.dialog.closeAll();
                this.account.logOut();
                this.snackbar.push('Account successfully deleted.', 'OK', 3000);
                this.router.navigate(['']);
            }
            else
                throw new Error(deregisterRequest.error);
        });
    }
}
DeleteAccountConfirmDialogComponent.ɵfac = function DeleteAccountConfirmDialogComponent_Factory(t) { return new (t || DeleteAccountConfirmDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialog"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](spiff_app_services_snackbar_service__WEBPACK_IMPORTED_MODULE_4__["SnackbarService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_5__["UserAccountService"])); };
DeleteAccountConfirmDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: DeleteAccountConfirmDialogComponent, selectors: [["spiff-delete-account-confirm-dialog"]], decls: 10, vars: 2, consts: [["mat-dialog-title", ""], ["mat-dialog-content", ""], ["mat-dialog-actions", ""], ["mat-button", "", "color", "primary"], [3, "theme", "loading", "click"]], template: function DeleteAccountConfirmDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h1", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Are you sure you want to delete your account?");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "This action is irreversable! Your posts will be removed.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "spiff-button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function DeleteAccountConfirmDialogComponent_Template_spiff_button_click_8_listener() { return ctx.deleteAccount(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("theme", "warn")("loading", ctx.accountDeletionInProgress);
    } }, directives: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogTitle"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogContent"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogActions"], _angular_material_button__WEBPACK_IMPORTED_MODULE_6__["MatButton"], spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_7__["ButtonComponent"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJkZWxldGUtYWNjb3VudC1jb25maXJtLWRpYWxvZy5jb21wb25lbnQuc2NzcyJ9 */"] });


/***/ }),

/***/ "MoW2":
/*!***************************************************************!*\
  !*** ./src/app/components/form-field/form-field.component.ts ***!
  \***************************************************************/
/*! exports provided: FormFieldComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormFieldComponent", function() { return FormFieldComponent; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/form-field */ "Q2Ze");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/input */ "e6WT");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "SVse");






function FormFieldComponent_mat_error_4_span_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const error_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](error_r2);
} }
function FormFieldComponent_mat_error_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, FormFieldComponent_mat_error_4_span_1_Template, 2, 1, "span", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r0.errors);
} }
class FormFieldComponent {
    constructor() {
        this.inputType = 'text';
        this.label = 'Form Field';
        this.control = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]();
        this.errorStrategy = 'all';
        this.errorMap = new Map();
        this.errors = [];
    }
    ngOnInit() {
        this.control.setValue(this.value);
        if (this.errorStrategy === 'priority' && !this.errorPriority) {
            throw new Error('Error strategy set to "Priority" but no errorPriority was provided!');
        }
    }
    useErrorMap(error) {
        return this.errorMap.has(error) ? this.errorMap.get(error) : `Error: ${error}`;
    }
    hasErrors() {
        this.errors = [];
        switch (this.errorStrategy) {
            case 'none':
                return false;
            case 'all':
                if (this.control.errors) {
                    Object.keys(this.control.errors).forEach(error => this.errors.push(this.useErrorMap(error)));
                    return true;
                }
                else {
                    return false;
                }
            case 'priority':
                if (this.control.errors) {
                    let lastError;
                    for (const error of this.errorPriority) {
                        lastError = error;
                        if (this.control.errors[error] !== undefined) {
                            this.errors.push(this.useErrorMap(error));
                            return true;
                        }
                    }
                    throw new Error(`Error strategy set to priority but error "${lastError}" is not present in errorPriority!`);
                }
                else {
                    return false;
                }
        }
    }
}
FormFieldComponent.ɵfac = function FormFieldComponent_Factory(t) { return new (t || FormFieldComponent)(); };
FormFieldComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: FormFieldComponent, selectors: [["spiff-form-field"]], inputs: { inputType: "inputType", label: "label", value: "value", control: "control", errorStrategy: "errorStrategy", errorPriority: "errorPriority", errorMap: "errorMap" }, decls: 5, vars: 4, consts: [["matInput", "", "name", "wtf", 3, "type", "formControl"], [4, "ngIf"], ["class", "error", 4, "ngFor", "ngForOf"], [1, "error"]], template: function FormFieldComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-form-field");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "input", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, FormFieldComponent_mat_error_4_Template, 2, 1, "mat-error", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.label);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("type", ctx.inputType)("formControl", ctx.control);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.hasErrors());
    } }, directives: [_angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_3__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__["MatError"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"]], styles: [".error[_ngcontent-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxmb3JtLWZpZWxkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtBQUNKIiwiZmlsZSI6ImZvcm0tZmllbGQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZXJyb3Ige1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbn0iXX0= */"] });


/***/ }),

/***/ "NMTX":
/*!***********************************************************************!*\
  !*** ./src/app/ui/components/dialogs/change-username-dialog/index.ts ***!
  \***********************************************************************/
/*! exports provided: ChangeUsernameDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _change_username_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./change-username-dialog.component */ "RZds");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ChangeUsernameDialogComponent", function() { return _change_username_dialog_component__WEBPACK_IMPORTED_MODULE_0__["ChangeUsernameDialogComponent"]; });




/***/ }),

/***/ "Pz58":
/*!************************************************************************************************!*\
  !*** ./src/app/ui/components/dialogs/create-account-dialog/create-account-dialog.component.ts ***!
  \************************************************************************************************/
/*! exports provided: CreateAccountDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateAccountDialogComponent", function() { return CreateAccountDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ "iELJ");
/* harmony import */ var spiff_app_api_services_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! spiff/app/api/services/api.service */ "YgqJ");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ "zHaW");
/* harmony import */ var spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! spiff/app/services/user-account.service */ "HEVm");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "Q2Ze");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ "e6WT");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var spiff_app_components_form_field_form_field_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! spiff/app/components/form-field/form-field.component */ "MoW2");
/* harmony import */ var spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! spiff/app/ui/components */ "xXuK");














function CreateAccountDialogComponent_mat_error_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Please enter your username ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function CreateAccountDialogComponent_mat_error_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Please enter your password ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function CreateAccountDialogComponent_mat_error_17_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r4.registerError);
} }
class CreateAccountDialogComponent {
    constructor(dialog, api, snackbar, user, router) {
        this.dialog = dialog;
        this.api = api;
        this.snackbar = snackbar;
        this.user = user;
        this.router = router;
        this.creatingAccount = false;
        this.retypePasswordErrorMap = new Map();
        this.retypePasswordErrorPriority = ['required', 'sameValue'];
        this.usernameControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]);
        this.passwordControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]);
        this.retypePasswordControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, this.sameValueValidator(this.passwordControl)]);
        this.retypePasswordErrorMap.set('required', 'Please retype your password');
        this.retypePasswordErrorMap.set('sameValue', 'Passwords to not match');
    }
    sameValueValidator(mustMatch) {
        return (control) => {
            const sameValue = mustMatch.value === control.value;
            return sameValue ? null : { sameValue: false };
        };
    }
    createAccount() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.creatingAccount = true;
            const registerRequest = yield this.api.register(this.usernameControl.value, this.passwordControl.value);
            if (registerRequest.ok) {
                yield this.user.login(this.usernameControl.value, this.passwordControl.value);
                this.creatingAccount = false;
                this.dialog.close();
                this.snackbar.open('Successfully created new account.', 'OK', { duration: 3000 });
                this.router.navigate(['user', this.user.user.username]);
            }
            else {
                this.creatingAccount = false;
                this.registerError = registerRequest.error;
                console.log('There literally is an error but i can\'t access it: ' + registerRequest.error);
            }
        });
    }
}
CreateAccountDialogComponent.ɵfac = function CreateAccountDialogComponent_Factory(t) { return new (t || CreateAccountDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__["MatDialogRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](spiff_app_api_services_api_service__WEBPACK_IMPORTED_MODULE_4__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__["MatSnackBar"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_6__["UserAccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"])); };
CreateAccountDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: CreateAccountDialogComponent, selectors: [["spiff-create-account-dialog"]], decls: 20, vars: 10, consts: [["mat-dialog-title", ""], ["mat-dialog-content", ""], [1, "register-form"], ["matInput", "", 3, "formControl"], ["ngUsername", ""], [4, "ngIf"], ["matInput", "", "type", "password", 3, "formControl"], ["ngPassword", ""], ["label", "Retype Password", "errorStrategy", "priority", 3, "control", "errorPriority", "errorMap"], [1, "create-account-button", 3, "disabled", "loading", "click"]], template: function CreateAccountDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "h1", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Register");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "form", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "mat-form-field");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Username");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "input", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, CreateAccountDialogComponent_mat_error_9_Template, 2, 0, "mat-error", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "mat-form-field");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](13, "input", 6, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, CreateAccountDialogComponent_mat_error_15_Template, 2, 0, "mat-error", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](16, "spiff-form-field", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](17, CreateAccountDialogComponent_mat_error_17_Template, 2, 1, "mat-error", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "spiff-button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CreateAccountDialogComponent_Template_spiff_button_click_18_listener() { return ctx.createAccount(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](19, " Create Account ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formControl", ctx.usernameControl);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.usernameControl.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formControl", ctx.passwordControl);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.passwordControl.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("control", ctx.retypePasswordControl)("errorPriority", ctx.retypePasswordErrorPriority)("errorMap", ctx.retypePasswordErrorMap);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.registerError);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", !ctx.usernameControl.valid || !ctx.passwordControl.valid || !ctx.retypePasswordControl.valid)("loading", ctx.creatingAccount);
    } }, directives: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__["MatDialogTitle"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__["MatDialogContent"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgForm"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_9__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], spiff_app_components_form_field_form_field_component__WEBPACK_IMPORTED_MODULE_11__["FormFieldComponent"], spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_12__["ButtonComponent"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatError"]], styles: [".register-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n}\n.register-form[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGNyZWF0ZS1hY2NvdW50LWRpYWxvZy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDZCQUFBO0FBQ0o7QUFDSTtFQUNJLG1CQUFBO0FBQ1IiLCJmaWxlIjoiY3JlYXRlLWFjY291bnQtZGlhbG9nLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnJlZ2lzdGVyLWZvcm0ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxuXHJcbiAgICBtYXQtZm9ybS1maWVsZCB7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgIH1cclxufVxyXG5cclxuLmNyZWF0ZS1hY2NvdW50LWJ1dHRvbiB7XHJcbiAgICBcclxufVxyXG5cclxuLy8gLnNpZ24taW4tYnV0dG9uIHtcclxuLy8gICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4vLyAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4vLyAgICAgbWFyZ2luOiAwIGF1dG8gMjRweCBhdXRvO1xyXG4vLyB9XHJcblxyXG4uY3JlYXRlLWFjY291bnQtYnV0dG9uIHtcclxuICAgIC8vIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgLy8gd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgLy8gbWFyZ2luOiBhdXRvO1xyXG4gICAgLy8gd2hpdGUtc3BhY2U6IG5vcm1hbDtcclxuICAgIC8vIGxpbmUtaGVpZ2h0OiAxLjVlbTtcclxuICAgIC8vIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgLy8gbWFyZ2luOiBhdXRvO1xyXG59Il19 */"] });


/***/ }),

/***/ "RZds":
/*!**************************************************************************************************!*\
  !*** ./src/app/ui/components/dialogs/change-username-dialog/change-username-dialog.component.ts ***!
  \**************************************************************************************************/
/*! exports provided: ChangeUsernameDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChangeUsernameDialogComponent", function() { return ChangeUsernameDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! spiff/app/services/user-account.service */ "HEVm");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/dialog */ "iELJ");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var spiff_app_components_form_field_form_field_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! spiff/app/components/form-field/form-field.component */ "MoW2");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");
/* harmony import */ var spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! spiff/app/ui/components */ "xXuK");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/progress-spinner */ "pu8Q");










function ChangeUsernameDialogComponent_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Your username will be changed. Your new username must be unique.");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "spiff-form-field", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "spiff-button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("action", function ChangeUsernameDialogComponent_ng_container_2_Template_spiff_button_action_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r3.changeUsername(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Change");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("label", "Username")("value", ctx_r0.getUsername())("control", ctx_r0.usernameFormControl);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", !ctx_r0.canChange());
} }
function ChangeUsernameDialogComponent_ng_template_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-spinner");
} }
class ChangeUsernameDialogComponent {
    constructor(account, dialog) {
        this.account = account;
        this.dialog = dialog;
        this.loggedIn = false;
        this.usernameFormControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
    }
    ngOnInit() {
        this.loggedIn = !!this.account.user;
        if (!this.loggedIn)
            this.account.events.subscribe((event) => this.loggedIn = event);
    }
    getUsername() {
        return this.account.user.username;
    }
    canChange() {
        return this.usernameFormControl.value !== this.account.user.username;
    }
    changeUsername() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const newUsername = this.usernameFormControl.value;
            const updateRequest = yield this.account.patch({ username: newUsername });
            if (updateRequest.ok) {
                this.account.usernameChanged(newUsername);
                this.dialog.closeAll();
            }
        });
    }
}
ChangeUsernameDialogComponent.ɵfac = function ChangeUsernameDialogComponent_Factory(t) { return new (t || ChangeUsernameDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_3__["UserAccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__["MatDialog"])); };
ChangeUsernameDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: ChangeUsernameDialogComponent, selectors: [["spiff-change-username-dialog"]], decls: 5, vars: 2, consts: [["mat-dialog-title", ""], [4, "ngIf", "ngIfElse"], ["spinner", ""], ["mat-dialog-content", ""], [3, "label", "value", "control"], ["mat-dialog-actions", "", 1, ""], ["mat-button", "", "color", "primary"], [3, "disabled", "action"]], template: function ChangeUsernameDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "h1", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Change Username");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, ChangeUsernameDialogComponent_ng_container_2_Template, 10, 4, "ng-container", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, ChangeUsernameDialogComponent_ng_template_3_Template, 1, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loggedIn)("ngIfElse", _r1);
    } }, directives: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__["MatDialogTitle"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__["MatDialogContent"], spiff_app_components_form_field_form_field_component__WEBPACK_IMPORTED_MODULE_6__["FormFieldComponent"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__["MatDialogActions"], _angular_material_button__WEBPACK_IMPORTED_MODULE_7__["MatButton"], spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_8__["ButtonComponent"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__["MatSpinner"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjaGFuZ2UtdXNlcm5hbWUtZGlhbG9nLmNvbXBvbmVudC5zY3NzIn0= */"] });


/***/ }),

/***/ "SnXW":
/*!********************************************!*\
  !*** ./src/app/pipes/comma-number.pipe.ts ***!
  \********************************************/
/*! exports provided: CommaNumberPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommaNumberPipe", function() { return CommaNumberPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");

class CommaNumberPipe {
    transform(num) {
        const numString = num.toString();
        let numOfCommas = Math.floor(numString.length / 3);
        let final = '';
        let counter = 0;
        for (let i = numString.length - 1; i >= 0; i--) {
            counter++;
            final += numString.charAt(i);
            if (counter % 3 === 0 && i !== 0)
                final += ',';
        }
        return final.split('').reverse().join('');
    }
}
CommaNumberPipe.ɵfac = function CommaNumberPipe_Factory(t) { return new (t || CommaNumberPipe)(); };
CommaNumberPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "commaNumber", type: CommaNumberPipe, pure: true });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: RootComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RootComponent", function() { return RootComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var spiff_app_services_local_storage_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! spiff/app/services/local-storage.service */ "DRYZ");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var spiff_app_services_dialog_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! spiff/app/services/dialog.service */ "CzQJ");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var spiff_app_services_snackbar_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! spiff/app/services/snackbar.service */ "p20J");
/* harmony import */ var spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! spiff/app/services/user-account.service */ "HEVm");
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/toolbar */ "l0rg");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/icon */ "Tj54");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/progress-spinner */ "pu8Q");
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/menu */ "rJgo");














function RootComponent_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function RootComponent_button_4_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r4.dialog.openCreatePostDialog(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "add");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RootComponent_button_5_mat_spinner_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-spinner", 10);
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("diameter", 30);
} }
function RootComponent_button_5_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](0, "Sign In");
} }
function RootComponent_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function RootComponent_button_5_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r9.dialog.openLoginDialog(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, RootComponent_button_5_mat_spinner_1_Template, 1, 1, "mat-spinner", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, RootComponent_button_5_ng_template_2_Template, 1, 0, "ng-template", null, 9, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](3);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.loadingUsername)("ngIfElse", _r7);
} }
function RootComponent_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "mat-menu", null, 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Profile");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Settings");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function RootComponent_ng_template_6_Template_button_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r13); const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r12.account.logOut(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Sign Out");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](3);
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("mat-menu-trigger-for", _r11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r3.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", "/user/" + ctx_r3.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", "/settings");
} }
class RootComponent {
    constructor(dialog, route, snack, account, localStorage) {
        this.dialog = dialog;
        this.route = route;
        this.snack = snack;
        this.account = account;
        this.localStorage = localStorage;
        this.username = '';
        this.signedIn = false;
        this.loadingUsername = false;
    }
    ngOnInit() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.route.queryParams.subscribe(query => {
                if (!query.dialog)
                    return;
                switch (query.dialog) {
                    case 'login':
                        this.dialog.openLoginDialog();
                        break;
                    default:
                        throw new Error(`Unknown dialog query param provided: "${query.dialog}".`);
                }
            });
            this.account.events.subscribe((event) => {
                switch (event) {
                    case 'LOG_IN':
                        this.signedIn = true;
                        this.username = this.account.user.username;
                        break;
                    case 'LOG_OUT':
                        this.signedIn = false;
                        this.username = null;
                        break;
                    case 'PASSWORD_CHANGE':
                        break;
                }
            });
            // Log the user in automatically if there is data in local storage
            try {
                const readOperation = this.localStorage.read(spiff_app_services_local_storage_service__WEBPACK_IMPORTED_MODULE_1__["LOCAL_STORAGE_ACCOUNT_KEY"]);
                if (readOperation) {
                    this.loadingUsername = true;
                    const login = yield this.account.login(readOperation.username, readOperation.password);
                    if (!login) {
                        this.snack.push('Sorry, we were unable to log you in.', 'OK', 10000);
                        this.localStorage.delete(spiff_app_services_local_storage_service__WEBPACK_IMPORTED_MODULE_1__["LOCAL_STORAGE_ACCOUNT_KEY"]);
                    }
                    this.loadingUsername = false;
                }
            }
            catch (error) {
                if (error.message === 'NoConnection') {
                    this.snack.push('Sorry, we could not connect to our services.', 'OK', 10000);
                    this.loadingUsername = false;
                }
                else {
                    throw error;
                }
            }
        });
    }
}
RootComponent.ɵfac = function RootComponent_Factory(t) { return new (t || RootComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](spiff_app_services_dialog_service__WEBPACK_IMPORTED_MODULE_3__["DialogService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](spiff_app_services_snackbar_service__WEBPACK_IMPORTED_MODULE_5__["SnackbarService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_6__["UserAccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](spiff_app_services_local_storage_service__WEBPACK_IMPORTED_MODULE_1__["LocalStorageService"])); };
RootComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: RootComponent, selectors: [["spiff-root"]], decls: 9, vars: 3, consts: [["color", "primary"], ["routerLink", "/", 1, "title"], [1, "spacer"], ["mat-icon-button", "", 3, "click", 4, "ngIf"], ["mat-button", "", 3, "click", 4, "ngIf", "ngIfElse"], ["loggedInOptions", ""], ["mat-icon-button", "", 3, "click"], ["mat-button", "", 3, "click"], ["class", "username-spinner", 3, "diameter", 4, "ngIf", "ngIfElse"], ["signInTemplate", ""], [1, "username-spinner", 3, "diameter"], ["mat-button", "", 3, "mat-menu-trigger-for"], ["accountDropdown", ""], ["mat-menu-item", "", 3, "routerLink"], ["mat-menu-item", "", 3, "click"]], template: function RootComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-toolbar", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Spiffing");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, RootComponent_button_4_Template, 3, 0, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, RootComponent_button_5_Template, 4, 2, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, RootComponent_ng_template_6_Template, 10, 4, "ng-template", null, 5, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](8, "router-outlet");
    } if (rf & 2) {
        const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.signedIn);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.signedIn)("ngIfElse", _r2);
    } }, directives: [_angular_material_toolbar__WEBPACK_IMPORTED_MODULE_7__["MatToolbar"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLink"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterOutlet"], _angular_material_button__WEBPACK_IMPORTED_MODULE_9__["MatButton"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_10__["MatIcon"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__["MatSpinner"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_12__["MatMenuTrigger"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_12__["_MatMenu"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_12__["MatMenuItem"]], styles: [".spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n\n.title[_ngcontent-%COMP%] {\n  -webkit-user-select: none;\n          user-select: none;\n  outline: none;\n  cursor: pointer;\n}\n\n.username-spinner[_ngcontent-%COMP%]     svg {\n  height: 1em;\n}\n\n.username-spinner[_ngcontent-%COMP%]     svg circle {\n  stroke: white;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtBQUNKOztBQUVBO0VBQ0kseUJBQUE7VUFBQSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0FBQ0o7O0FBSVE7RUFDSSxXQUFBO0FBRFo7O0FBRVk7RUFDSSxhQUFBO0FBQWhCIiwiZmlsZSI6ImFwcC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zcGFjZXIge1xyXG4gICAgZmxleDogMSAxIGF1dG87XHJcbn1cclxuXHJcbi50aXRsZSB7XHJcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi51c2VybmFtZS1zcGlubmVyIHtcclxuICAgIDo6bmctZGVlcCB7XHJcbiAgICAgICAgc3ZnIHtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxZW07XHJcbiAgICAgICAgICAgIGNpcmNsZSB7XHJcbiAgICAgICAgICAgICAgICBzdHJva2U6IHdoaXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19 */"] });


/***/ }),

/***/ "TMt6":
/*!*******************************************!*\
  !*** ./src/app/api/interface/response.ts ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is autogenerated; changes may be overwritten.



/***/ }),

/***/ "UdES":
/*!*************************************!*\
  !*** ./src/app/forms/validators.ts ***!
  \*************************************/
/*! exports provided: sameValueValidator, valueMustNotBe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sameValueValidator", function() { return sameValueValidator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "valueMustNotBe", function() { return valueMustNotBe; });
function sameValueValidator(mustMatch) {
    return (control) => {
        const sameValue = mustMatch.value === control.value;
        return sameValue ? null : { sameValue: { value: control.value } };
    };
}
function valueMustNotBe(value) {
    return (control) => {
        return control.value !== value ? null : {
            mustNotEqual: {
                currentValue: control.value,
                mustNotEqual: value
            }
        };
    };
}


/***/ }),

/***/ "Y1GY":
/*!*********************************************!*\
  !*** ./src/app/pipes/pretty-number.pipe.ts ***!
  \*********************************************/
/*! exports provided: PrettyNumberPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrettyNumberPipe", function() { return PrettyNumberPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");

class PrettyNumberPipe {
    transform(number) {
        if (number < 1000)
            return number.toString();
        if (number < 1000000)
            return (number / 1000).toFixed(1) + 'k';
        if (number < 1000000000)
            return (number / 1000000).toFixed(1) + 'm';
        return (number / 1000000000).toFixed(1) + 'b';
    }
}
PrettyNumberPipe.ɵfac = function PrettyNumberPipe_Factory(t) { return new (t || PrettyNumberPipe)(); };
PrettyNumberPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "prettyNumber", type: PrettyNumberPipe, pure: true });


/***/ }),

/***/ "YgqJ":
/*!*********************************************!*\
  !*** ./src/app/api/services/api.service.ts ***!
  \*********************************************/
/*! exports provided: ApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return ApiService; });
/* harmony import */ var spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! spiff/app/util/basic-auth */ "EC8C");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var api_services_api_http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! api/services/api-http.service */ "5RoO");



class ApiService {
    constructor(http) {
        this.http = http;
    }
    register(username, password) {
        return this.http.post(['api', 'user', username], {}, {
            authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password)
        });
    }
    authorize(username, password) {
        return this.http.post(['api', 'authorize'], {}, {
            authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password)
        });
    }
    deregister(username, password) {
        return this.http.delete(['api', 'user'], {
            authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password)
        });
    }
    patch(username, password, changes) {
        return this.http.patch(['api', 'user', username], changes, {
            authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password)
        });
    }
    getPosts(query) {
        return this.http.get(['api', 'posts'], query);
    }
    createPost(username, password, title, content) {
        return this.http.post(['api', 'post'], { title, content }, { authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password) });
    }
    ratePost(username, password, postId, rating) {
        return this.http.post(['api', 'rate', 'post', postId], { rating }, { authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password) });
    }
    getRates(username, password, uid) {
        return this.http.get(['api', 'rated', uid], {}, { authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password) });
    }
    getUsers(query = {}) {
        return this.http.get(['api', 'users'], Object.assign(Object.assign(Object.assign(Object.assign({}, query.id && { id: query.id }), query.ids && { ids: query.ids.join(',') }), query.username && { username: query.username }), query.usernames && { usernames: query.usernames.join(',') }));
    }
    postComment(username, password, parentType, parentId, content) {
        return this.http.post(['api', 'comment', parentType, parentId], { content }, { authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password) });
    }
    getComments(query = {}, includeAuthorUser) {
        return this.http.get(['api', 'comments'], Object.assign(Object.assign(Object.assign({}, query.parent && { parentType: query.parent.type, parentId: query.parent.id }), query.author && { author: query.author }), includeAuthorUser !== undefined && { include: 'authorUser' }));
    }
    rateComment(username, password, commentId, rating) {
        return this.http.post(['api', 'rate', 'comment', commentId], { rating }, { authorization: Object(spiff_app_util_basic_auth__WEBPACK_IMPORTED_MODULE_0__["basicAuthorization"])(username, password) });
    }
}
ApiService.ɵfac = function ApiService_Factory(t) { return new (t || ApiService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](api_services_api_http_service__WEBPACK_IMPORTED_MODULE_2__["ApiHttpService"])); };
ApiService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: ApiService, factory: ApiService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var spiff_app_pipes_date_ago_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! spiff/app/pipes/date-ago.pipe */ "6Kw5");
/* harmony import */ var spiff_app_app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! spiff/app/app.component */ "Sy1n");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var spiff_app_ui_views_post_post_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! spiff/app/ui/views/post/post.component */ "2fy0");
/* harmony import */ var spiff_app_material_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! spiff/app/material.module */ "vvyD");
/* harmony import */ var spiff_app_pipes_comma_number_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! spiff/app/pipes/comma-number.pipe */ "SnXW");
/* harmony import */ var spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! spiff/app/ui/components */ "xXuK");
/* harmony import */ var spiff_app_app_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! spiff/app/app-routing.module */ "vY5A");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ "IheW");
/* harmony import */ var spiff_app_pipes_pretty_number_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! spiff/app/pipes/pretty-number.pipe */ "Y1GY");
/* harmony import */ var spiff_app_components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! spiff/app/components/not-found/not-found.component */ "F33o");
/* harmony import */ var spiff_app_components_form_field_form_field_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! spiff/app/components/form-field/form-field.component */ "MoW2");
/* harmony import */ var spiff_app_ui_views_landing_page__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! spiff/app/ui/views/landing-page */ "8Fwg");
/* harmony import */ var spiff_app_ui_components_dialogs_login_dialog__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! spiff/app/ui/components/dialogs/login-dialog */ "JdS8");
/* harmony import */ var spiff_app_ui_components_rate_counter_rate_counter_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! spiff/app/ui/components/rate-counter/rate-counter.component */ "taxL");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/platform-browser/animations */ "omvX");
/* harmony import */ var spiff_app_components_standalone_card_standalone_card_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! spiff/app/components/standalone-card/standalone-card.component */ "cAYG");
/* harmony import */ var _ui_components_text_field_dialog_text_field_dialog_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./ui/components/text-field-dialog/text-field-dialog.component */ "aAar");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var spiff_app_ui_views__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! spiff/app/ui/views */ "f5/Q");
/* harmony import */ var _ui_components_dialogs__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./ui/components/dialogs */ "x+Ag");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/dialog */ "iELJ");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");

























class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [spiff_app_app_component__WEBPACK_IMPORTED_MODULE_1__["RootComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, imports: [[
            _angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"],
            spiff_app_material_module__WEBPACK_IMPORTED_MODULE_4__["MaterialModule"],
            spiff_app_app_routing_module__WEBPACK_IMPORTED_MODULE_7__["AppRoutingModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClientModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_18__["ReactiveFormsModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__["BrowserAnimationsModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵsetNgModuleScope"](AppModule, { declarations: [spiff_app_pipes_date_ago_pipe__WEBPACK_IMPORTED_MODULE_0__["DateAgoPipe"],
        spiff_app_app_component__WEBPACK_IMPORTED_MODULE_1__["RootComponent"],
        spiff_app_ui_views_post_post_component__WEBPACK_IMPORTED_MODULE_3__["PostComponent"],
        spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_6__["ButtonComponent"],
        spiff_app_pipes_comma_number_pipe__WEBPACK_IMPORTED_MODULE_5__["CommaNumberPipe"],
        spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_6__["DialogComponent"],
        spiff_app_pipes_pretty_number_pipe__WEBPACK_IMPORTED_MODULE_9__["PrettyNumberPipe"],
        spiff_app_ui_views__WEBPACK_IMPORTED_MODULE_19__["ProfileComponent"],
        spiff_app_components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_10__["NotFoundComponent"],
        spiff_app_ui_views__WEBPACK_IMPORTED_MODULE_19__["SettingsComponent"],
        spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_6__["ViewCardComponent"],
        spiff_app_components_form_field_form_field_component__WEBPACK_IMPORTED_MODULE_11__["FormFieldComponent"],
        spiff_app_ui_views_landing_page__WEBPACK_IMPORTED_MODULE_12__["LandingPageComponent"],
        spiff_app_ui_components_dialogs_login_dialog__WEBPACK_IMPORTED_MODULE_13__["LoginDialogComponent"],
        spiff_app_ui_components_rate_counter_rate_counter_component__WEBPACK_IMPORTED_MODULE_14__["RateCounterComponent"],
        spiff_app_components_standalone_card_standalone_card_component__WEBPACK_IMPORTED_MODULE_16__["StandaloneCardComponent"],
        _ui_components_text_field_dialog_text_field_dialog_component__WEBPACK_IMPORTED_MODULE_17__["TextFieldDialogComponent"],
        _ui_components_dialogs__WEBPACK_IMPORTED_MODULE_20__["CreateAccountDialogComponent"],
        _ui_components_dialogs__WEBPACK_IMPORTED_MODULE_20__["ChangeUsernameDialogComponent"],
        _ui_components_dialogs__WEBPACK_IMPORTED_MODULE_20__["DeleteAccountConfirmDialogComponent"]], imports: [_angular_forms__WEBPACK_IMPORTED_MODULE_18__["FormsModule"],
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"],
        spiff_app_material_module__WEBPACK_IMPORTED_MODULE_4__["MaterialModule"],
        spiff_app_app_routing_module__WEBPACK_IMPORTED_MODULE_7__["AppRoutingModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClientModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_18__["ReactiveFormsModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__["BrowserAnimationsModule"]] }); })();
_angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵsetComponentScope"](spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_6__["DialogComponent"], [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_22__["MatDialogTitle"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_22__["MatDialogActions"], _angular_material_button__WEBPACK_IMPORTED_MODULE_23__["MatButton"], spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_6__["ButtonComponent"]], []);


/***/ }),

/***/ "aAar":
/*!********************************************************************************!*\
  !*** ./src/app/ui/components/text-field-dialog/text-field-dialog.component.ts ***!
  \********************************************************************************/
/*! exports provided: TextFieldDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextFieldDialogComponent", function() { return TextFieldDialogComponent; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var spiff_app_forms_validator_error_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! spiff/app/forms/validator-error-string */ "6hrT");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ "iELJ");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");
/* harmony import */ var spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! spiff/app/ui/components */ "xXuK");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/form-field */ "Q2Ze");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "e6WT");











function TextFieldDialogComponent_p_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r0.description);
} }
function TextFieldDialogComponent_div_4_mat_form_field_2_mat_error_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const field_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r5.getError(field_r2));
} }
function TextFieldDialogComponent_div_4_mat_form_field_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-form-field");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "input", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, TextFieldDialogComponent_div_4_mat_form_field_2_mat_error_4_Template, 3, 1, "mat-error", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const field_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](field_r2.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("type", ctx_r3.asInput(field_r2).type)("formControl", field_r2.formControl);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", field_r2.formControl.errors);
} }
function TextFieldDialogComponent_div_4_mat_form_field_3_mat_error_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const field_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r8.getError(field_r2));
} }
function TextFieldDialogComponent_div_4_mat_form_field_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-form-field");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "textarea", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, TextFieldDialogComponent_div_4_mat_form_field_3_mat_error_4_Template, 3, 1, "mat-error", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const field_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](field_r2.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formControl", field_r2.formControl);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", field_r2.formControl.errors);
} }
function TextFieldDialogComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](1, 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, TextFieldDialogComponent_div_4_mat_form_field_2_Template, 5, 4, "mat-form-field", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, TextFieldDialogComponent_div_4_mat_form_field_3_Template, 5, 3, "mat-form-field", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const field_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitch", field_r2.element);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "input");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "text-area");
} }
class TextFieldDialogComponent {
    constructor() {
        this.title = 'Title';
        this.loading = false;
        this.submit = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.cancelButtonText = 'Cancel';
        this.submitButtonText = 'Submit';
        this.description = 'Description.';
    }
    ngOnInit() {
        if (this.dialogRef === undefined || this.dialogRef === null)
            throw new Error(`TextFieldDialogComponent: dialogRef is ${this.dialogRef}.`);
        if (this.fields === undefined || this.fields === null)
            throw new Error(`TextFieldDialogComponent: fields is ${this.fields}.`);
        if (this.title === 'Title')
            console.warn('TextFieldDialogCopmonent: title is unchanged.');
        if (this.description === 'Description.')
            console.warn('TextFieldDialogCopmonent: description is unchanged.');
        if (this.fields.length === 0)
            console.warn('TextFieldDialogComponent: fields length is 0.');
        else
            for (const field of this.fields) {
                if (field.formControl === undefined || field.formControl === null)
                    field.formControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]();
                switch (field.element) {
                    case 'input':
                        if (!field.type)
                            field.type = 'text';
                        break;
                }
            }
    }
    isValid() {
        for (const field of this.fields)
            if (!field.formControl.dirty || field.formControl.errors !== null)
                return false;
        return true;
    }
    getError(field) {
        const control = field.formControl;
        if (control.errors === null)
            throw new Error(`TextFieldDialogComponent: getError called but form control ${field.name} has no errors.`);
        return Object(spiff_app_forms_validator_error_string__WEBPACK_IMPORTED_MODULE_1__["errorsToString"])(control.errors);
    }
    closeDialog() {
        this.dialogRef.close();
    }
    asInput(input) {
        return input;
    }
}
TextFieldDialogComponent.ɵfac = function TextFieldDialogComponent_Factory(t) { return new (t || TextFieldDialogComponent)(); };
TextFieldDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: TextFieldDialogComponent, selectors: [["spiff-text-field-dialog"]], decls: 10, vars: 8, consts: [["mat-dialog-title", ""], ["mat-dialog-content", ""], [4, "ngIf"], [4, "ngFor", "ngForOf"], ["mat-dialog-actions", "", 1, "actions"], ["mat-button", "", "color", "primary", 3, "disabled", "click"], [3, "disabled", "loading", "action"], [3, "ngSwitch"], [4, "ngSwitchCase"], ["matInput", "", 3, "type", "formControl"], ["matInput", "", 3, "formControl"]], template: function TextFieldDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "h1", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, TextFieldDialogComponent_p_3_Template, 2, 1, "p", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, TextFieldDialogComponent_div_4_Template, 4, 3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function TextFieldDialogComponent_Template_button_click_6_listener() { return ctx.closeDialog(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "spiff-button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("action", function TextFieldDialogComponent_Template_spiff_button_action_8_listener() { return ctx.submit.emit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.title);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.description);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.fields);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.cancelButtonText);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", !ctx.isValid())("loading", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.submitButtonText);
    } }, directives: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__["MatDialogTitle"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__["MatDialogContent"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__["MatDialogActions"], _angular_material_button__WEBPACK_IMPORTED_MODULE_5__["MatButton"], spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_6__["ButtonComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgSwitch"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgSwitchCase"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlDirective"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatError"]], styles: [".mat-dialog-content[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.mat-dialog-content[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  height: 25vh;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcdGV4dC1maWVsZC1kaWFsb2cuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0k7RUFBSSxXQUFBO0FBQ1I7QUFDSTtFQUFXLFlBQUE7QUFFZjtBQUNBO0VBQ0ksYUFBQTtFQUNBLDhCQUFBO0FBRUoiLCJmaWxlIjoidGV4dC1maWVsZC1kaWFsb2cuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubWF0LWRpYWxvZy1jb250ZW50IHtcclxuICAgICogeyB3aWR0aDogMTAwJTsgfVxyXG5cclxuICAgIHRleHRhcmVhIHsgaGVpZ2h0OiAyNXZoOyB9XHJcbn1cclxuXHJcbi5hY3Rpb25zIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbn0iXX0= */"] });


/***/ }),

/***/ "aSfY":
/*!********************************************!*\
  !*** ./src/app/ui/views/settings/index.ts ***!
  \********************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settings_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings.component */ "jF9p");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return _settings_component__WEBPACK_IMPORTED_MODULE_0__["SettingsComponent"]; });




/***/ }),

/***/ "cAYG":
/*!*************************************************************************!*\
  !*** ./src/app/components/standalone-card/standalone-card.component.ts ***!
  \*************************************************************************/
/*! exports provided: StandaloneCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StandaloneCardComponent", function() { return StandaloneCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/card */ "PDjf");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "SVse");



function StandaloneCardComponent_mat_card_header_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h1");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.title);
} }
const _c0 = ["*"];
class StandaloneCardComponent {
    constructor() { }
    ngOnInit() {
    }
}
StandaloneCardComponent.ɵfac = function StandaloneCardComponent_Factory(t) { return new (t || StandaloneCardComponent)(); };
StandaloneCardComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: StandaloneCardComponent, selectors: [["app-standalone-card"]], inputs: { title: "title" }, ngContentSelectors: _c0, decls: 5, vars: 1, consts: [[1, "full-page-container"], [1, "standalone-card"], [4, "ngIf"]], template: function StandaloneCardComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, StandaloneCardComponent_mat_card_header_2_Template, 3, 1, "mat-card-header", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-card-content");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.title);
    } }, directives: [_angular_material_card__WEBPACK_IMPORTED_MODULE_1__["MatCard"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_1__["MatCardContent"], _angular_material_card__WEBPACK_IMPORTED_MODULE_1__["MatCardHeader"]], styles: [".full-page-container[_ngcontent-%COMP%] {\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  padding: 20px;\n  margin: auto;\n}\n.full-page-container[_ngcontent-%COMP%]   .standalone-card[_ngcontent-%COMP%] {\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: auto;\n}\n.full-page-container[_ngcontent-%COMP%]   .standalone-card[_ngcontent-%COMP%]     mat-card-content mat-card-header .mat-card-header-text {\n  display: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxzdGFuZGFsb25lLWNhcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSwwQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtBQUNKO0FBQ0k7RUFDSSwwQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7RUFDQSxZQUFBO0FBQ1I7QUFJb0I7RUFDSSxhQUFBO0FBRnhCIiwiZmlsZSI6InN0YW5kYWxvbmUtY2FyZC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5mdWxsLXBhZ2UtY29udGFpbmVyIHtcclxuICAgIHdpZHRoOiBmaXQtY29udGVudDtcclxuICAgIHBhZGRpbmc6IDIwcHg7XHJcbiAgICBtYXJnaW46IGF1dG87XHJcblxyXG4gICAgLnN0YW5kYWxvbmUtY2FyZCB7XHJcbiAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgICAgIG1hcmdpbjogYXV0bztcclxuXHJcbiAgICAgICAgOjpuZy1kZWVwIHtcclxuICAgICAgICAgICAgbWF0LWNhcmQtY29udGVudCB7XHJcbiAgICAgICAgICAgICAgICBtYXQtY2FyZC1oZWFkZXIge1xyXG4gICAgICAgICAgICAgICAgICAgIC5tYXQtY2FyZC1oZWFkZXItdGV4dCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19 */"] });


/***/ }),

/***/ "de0n":
/*!************************************************************!*\
  !*** ./src/app/api/interface/responses/error-responses.ts ***!
  \************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is autogenerated; changes may be overwritten.



/***/ }),

/***/ "f5/Q":
/*!***********************************!*\
  !*** ./src/app/ui/views/index.ts ***!
  \***********************************/
/*! exports provided: SettingsComponent, ProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "aSfY");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return _settings__WEBPACK_IMPORTED_MODULE_0__["SettingsComponent"]; });

/* harmony import */ var _profile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./profile */ "mumF");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ProfileComponent", function() { return _profile__WEBPACK_IMPORTED_MODULE_1__["ProfileComponent"]; });





/***/ }),

/***/ "fCvi":
/*!*********************************************!*\
  !*** ./src/app/api/interface/data-types.ts ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is autogenerated; changes may be overwritten.



/***/ }),

/***/ "gCZD":
/*!****************************************************************!*\
  !*** ./src/app/ui/components/view-card/view-card.component.ts ***!
  \****************************************************************/
/*! exports provided: ViewCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewCardComponent", function() { return ViewCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/card */ "PDjf");


const _c0 = ["*"];
class ViewCardComponent {
    constructor() { }
    ngOnInit() {
    }
}
ViewCardComponent.ɵfac = function ViewCardComponent_Factory(t) { return new (t || ViewCardComponent)(); };
ViewCardComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ViewCardComponent, selectors: [["spiff-view-card"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "view-card"]], template: function ViewCardComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-card", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_material_card__WEBPACK_IMPORTED_MODULE_1__["MatCard"]], styles: [".view-card[_ngcontent-%COMP%] {\n  width: 90%;\n  max-width: 600px;\n  margin: 0 auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcdmlldy1jYXJkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksVUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQUNKIiwiZmlsZSI6InZpZXctY2FyZC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi52aWV3LWNhcmQge1xyXG4gICAgd2lkdGg6IDkwJTtcclxuICAgIG1heC13aWR0aDogNjAwcHg7XHJcbiAgICBtYXJnaW46IDAgYXV0bztcclxufSJdfQ== */"] });


/***/ }),

/***/ "ises":
/*!******************************************************************************!*\
  !*** ./src/app/ui/components/dialogs/login-dialog/login-dialog.component.ts ***!
  \******************************************************************************/
/*! exports provided: LoginDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginDialogComponent", function() { return LoginDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var spiff_app_ui_components_dialogs_create_account_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! spiff/app/ui/components/dialogs/create-account-dialog */ "6Vpe");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! spiff/app/services/user-account.service */ "HEVm");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ "iELJ");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ "Q2Ze");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/input */ "e6WT");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! spiff/app/ui/components */ "xXuK");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");












const _c0 = ["templateUsernameForm"];
const _c1 = ["templatePasswordForm"];
function LoginDialogComponent_mat_error_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter your username ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function LoginDialogComponent_mat_error_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter your password ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function LoginDialogComponent_mat_error_16_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-error", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r4.errorMessage);
} }
class LoginDialogComponent {
    constructor(account, createAccountDialog, dialog) {
        this.account = account;
        this.createAccountDialog = createAccountDialog;
        this.dialog = dialog;
        this.usernameForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]);
        this.passwordForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]);
    }
    ngAfterViewInit() {
        setTimeout(() => this.templateUsernameForm.nativeElement.focus(), 0);
    }
    onUsernameKeyPress(event) {
        if (event.key !== 'Enter')
            return;
        if (this.usernameForm.valid)
            this.templatePasswordForm.nativeElement.focus();
    }
    onPasswordKeyPress(event) {
        if (event.key !== 'Enter')
            return;
        if (this.usernameForm.valid && this.passwordForm.valid)
            this.submitSignIn();
    }
    submitSignIn() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.errorMessage = null;
            this.loginInProgress = true;
            try {
                const login = yield this.account.login(this.usernameForm.value, this.passwordForm.value);
                this.loginInProgress = false;
                if (login)
                    this.dialog.close();
                else
                    this.errorMessage = 'Incorrect username or password.';
            }
            catch (error) {
                if (error.message === 'NoConnection') {
                    this.errorMessage = 'Could not connect to our services.';
                    this.loginInProgress = false;
                }
            }
        });
    }
    createNewAccount() {
        this.dialog.close();
        this.createAccountDialog.open(spiff_app_ui_components_dialogs_create_account_dialog__WEBPACK_IMPORTED_MODULE_2__["CreateAccountDialogComponent"], { width: 'fit-content' });
    }
}
LoginDialogComponent.ɵfac = function LoginDialogComponent_Factory(t) { return new (t || LoginDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_4__["UserAccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__["MatDialog"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__["MatDialogRef"])); };
LoginDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: LoginDialogComponent, selectors: [["spiff-login-dialog"]], viewQuery: function LoginDialogComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c1, 1);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.templateUsernameForm = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.templatePasswordForm = _t.first);
    } }, decls: 21, vars: 7, consts: [["mat-dialog-title", ""], ["mat-dialog-content", ""], [1, "login-form"], ["matInput", "", 3, "formControl", "keypress"], ["templateUsernameForm", ""], [4, "ngIf"], ["type", "password", "matInput", "", 3, "formControl", "keypress"], ["templatePasswordForm", ""], ["class", "error-message", 4, "ngIf"], [1, "sign-in-button", 3, "disabled", "loading", "click"], ["mat-stroked-button", "", "color", "primary", 1, "create-account-button", 3, "click"], [1, "error-message"]], template: function LoginDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h1", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Log In");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "form", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "mat-form-field");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Username");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "input", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("keypress", function LoginDialogComponent_Template_input_keypress_7_listener($event) { return ctx.onUsernameKeyPress($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, LoginDialogComponent_mat_error_9_Template, 2, 0, "mat-error", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "mat-form-field");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "input", 6, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("keypress", function LoginDialogComponent_Template_input_keypress_13_listener($event) { return ctx.onPasswordKeyPress($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](15, LoginDialogComponent_mat_error_15_Template, 2, 0, "mat-error", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](16, LoginDialogComponent_mat_error_16_Template, 2, 1, "mat-error", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "spiff-button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginDialogComponent_Template_spiff_button_click_17_listener() { return ctx.submitSignIn(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, " Sign In ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function LoginDialogComponent_Template_button_click_19_listener() { return ctx.createNewAccount(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20, "Don't have an account? Create one here!");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formControl", ctx.usernameForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.usernameForm.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formControl", ctx.passwordForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.passwordForm.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.errorMessage);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", !(ctx.usernameForm.valid && ctx.passwordForm.valid))("loading", ctx.loginInProgress);
    } }, directives: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__["MatDialogTitle"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__["MatDialogContent"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgForm"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_7__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_9__["ButtonComponent"], _angular_material_button__WEBPACK_IMPORTED_MODULE_10__["MatButton"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatError"]], styles: [".login-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n}\n\n.sign-in-button[_ngcontent-%COMP%] {\n  display: block;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: 0 auto 24px auto;\n}\n\n.create-account-button[_ngcontent-%COMP%] {\n  display: block;\n  margin: auto;\n  padding: 12px;\n  white-space: normal;\n  line-height: 1.5em;\n}\n\n.error-message[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGxvZ2luLWRpYWxvZy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDZCQUFBO0FBQ0o7O0FBRUE7RUFDSSxjQUFBO0VBQ0EsMEJBQUE7RUFBQSx1QkFBQTtFQUFBLGtCQUFBO0VBQ0Esd0JBQUE7QUFDSjs7QUFFQTtFQUNJLGNBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7QUFDSjs7QUFFQTtFQUNJLG1CQUFBO0FBQ0oiLCJmaWxlIjoibG9naW4tZGlhbG9nLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxvZ2luLWZvcm0ge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcclxufVxyXG5cclxuLnNpZ24taW4tYnV0dG9uIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgbWFyZ2luOiAwIGF1dG8gMjRweCBhdXRvO1xyXG59XHJcblxyXG4uY3JlYXRlLWFjY291bnQtYnV0dG9uIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgbWFyZ2luOiBhdXRvO1xyXG4gICAgcGFkZGluZzogMTJweDtcclxuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7XHJcbiAgICBsaW5lLWhlaWdodDogMS41ZW07XHJcbn1cclxuXHJcbi5lcnJvci1tZXNzYWdlIHtcclxuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbn0iXX0= */"] });


/***/ }),

/***/ "jF9p":
/*!*********************************************************!*\
  !*** ./src/app/ui/views/settings/settings.component.ts ***!
  \*********************************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return SettingsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "s7LF");
/* harmony import */ var _change_screenname__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./change-screenname */ "0nf9");
/* harmony import */ var spiff_app_forms_validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! spiff/app/forms/validators */ "UdES");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var spiff_app_services_dialog_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! spiff/app/services/dialog.service */ "CzQJ");
/* harmony import */ var spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! spiff/app/services/user-account.service */ "HEVm");
/* harmony import */ var spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! spiff/app/ui/components */ "xXuK");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");











class SettingsComponent {
    constructor(title, router, dialog, account) {
        this.title = title;
        this.router = router;
        this.dialog = dialog;
        this.account = account;
    }
    ngOnInit() {
        if (this.account.user === null)
            this.router.navigate(['']);
        this.title.setTitle('user settings');
        this.accountEventListener = this.account.events.subscribe(this.onUserAccountEvent.bind(this));
    }
    ngOnDestroy() {
        this.accountEventListener.unsubscribe();
    }
    onUserAccountEvent(event) {
        if (event === 'LOG_OUT')
            this.router.navigate(['']);
    }
    changePassword() {
        const passwordControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]();
        const retypeControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](null, Object(spiff_app_forms_validators__WEBPACK_IMPORTED_MODULE_3__["sameValueValidator"])(passwordControl));
        this.dialog.openGenericDialog({
            title: 'Change Password',
            submitText: 'Change',
            description: 'Please enter what you would like your new password to be.',
            fields: [
                { element: 'input', name: 'password', label: 'Password', type: 'password', formControl: passwordControl },
                { element: 'input', name: 'retype', label: 'Retype Password', type: 'password', formControl: retypeControl }
            ],
            onSubmit: (dialog) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                dialog.loading = true;
                const updateRequest = yield this.account.patch({ password: passwordControl.value });
                dialog.loading = false;
                if (updateRequest.ok === true) {
                    this.account.passwordChanged(passwordControl.value);
                    dialog.closeDialog();
                }
            })
        });
    }
    openChangeScreenname() {
        Object(_change_screenname__WEBPACK_IMPORTED_MODULE_2__["default"])(this.dialog, this.account);
    }
    changeUsername() {
        this.dialog.openChangeUsernameDialog();
    }
    deleteAccount() {
        this.dialog.openDeleteAccountDialog();
    }
}
SettingsComponent.ɵfac = function SettingsComponent_Factory(t) { return new (t || SettingsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](spiff_app_services_dialog_service__WEBPACK_IMPORTED_MODULE_7__["DialogService"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](spiff_app_services_user_account_service__WEBPACK_IMPORTED_MODULE_8__["UserAccountService"])); };
SettingsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: SettingsComponent, selectors: [["spiff-settings-view"]], decls: 25, vars: 0, consts: [[1, "settings"], [1, "banter-container"], [3, "click"], ["mat-raised-button", "", "color", "warn", 3, "click"]], template: function SettingsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "spiff-view-card");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Settings");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, "Change Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "spiff-button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function SettingsComponent_Template_spiff_button_click_8_listener() { return ctx.changePassword(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "Change");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12, "Change Screen Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "spiff-button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function SettingsComponent_Template_spiff_button_click_13_listener() { return ctx.openChangeScreenname(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "Change");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17, "Change Username");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "spiff-button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function SettingsComponent_Template_spiff_button_click_18_listener() { return ctx.changeUsername(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19, "Change");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, "Delete Account");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](23, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function SettingsComponent_Template_button_click_23_listener() { return ctx.deleteAccount(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](24, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    } }, directives: [spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_9__["ViewCardComponent"], spiff_app_ui_components__WEBPACK_IMPORTED_MODULE_9__["ButtonComponent"], _angular_material_button__WEBPACK_IMPORTED_MODULE_10__["MatButton"]], styles: [".settings[_ngcontent-%COMP%] {\n  padding: 0 10px;\n}\n.settings[_ngcontent-%COMP%]   .banter-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n}\n.settings[_ngcontent-%COMP%]   .banter-container[_ngcontent-%COMP%]   #change-username-inputs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-right: 10px;\n  opacity: 0%;\n  transition: opacity 0.5s;\n}\n.hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n}\n.opaque[_ngcontent-%COMP%] {\n  opacity: 100% !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcc2V0dGluZ3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxlQUFBO0FBQ0o7QUFDSTtFQUNJLGFBQUE7RUFDQSw4QkFBQTtFQUNBLHFCQUFBO0FBQ1I7QUFFWTtFQUNJLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLHdCQUFBO0FBQWhCO0FBTUE7RUFDSSxrQkFBQTtBQUhKO0FBTUE7RUFDSSx3QkFBQTtBQUhKIiwiZmlsZSI6InNldHRpbmdzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNldHRpbmdzIHtcclxuICAgIHBhZGRpbmc6IDAgMTBweDtcclxuXHJcbiAgICAuYmFudGVyLWNvbnRhaW5lciB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGJhc2VsaW5lO1xyXG5cclxuICAgICAgICAjY2hhbmdlLXVzZXJuYW1lLWlucHV0cyB7XHJcbiAgICAgICAgICAgIGJ1dHRvbiB7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwJTtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC41cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLmhpZGRlbiB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbn1cclxuXHJcbi5vcGFxdWUge1xyXG4gICAgb3BhY2l0eTogMTAwJSAhaW1wb3J0YW50O1xyXG59Il19 */"] });


/***/ }),

/***/ "mumF":
/*!*******************************************!*\
  !*** ./src/app/ui/views/profile/index.ts ***!
  \*******************************************/
/*! exports provided: ProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _profile_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./profile.component */ "6uCP");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ProfileComponent", function() { return _profile_component__WEBPACK_IMPORTED_MODULE_0__["ProfileComponent"]; });




/***/ }),

/***/ "p20J":
/*!**********************************************!*\
  !*** ./src/app/services/snackbar.service.ts ***!
  \**********************************************/
/*! exports provided: SnackbarService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SnackbarService", function() { return SnackbarService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/snack-bar */ "zHaW");


class SnackbarService {
    constructor(snack) {
        this.snack = snack;
        this.visibleNotifs = 0;
        this.maxVisibleNotifs = 3;
        this.notifications = [];
    }
    push(content, button, duration) {
        this.notifications.push({ content, button, duration });
        this.onSnackEvent('NEW');
    }
    onSnackEvent(event) {
        switch (event) {
            case 'NEW':
                if (this.visibleNotifs < this.maxVisibleNotifs) {
                    const notif = this.notifications.pop();
                    this.snack.open(notif.content, notif.button, { duration: notif.duration });
                    this.visibleNotifs++;
                    if (notif.duration) {
                        setTimeout(() => this.onSnackEvent('DESTROYED'), notif.duration);
                    }
                }
                break;
            case 'DESTROYED':
                this.visibleNotifs--;
        }
    }
}
SnackbarService.ɵfac = function SnackbarService_Factory(t) { return new (t || SnackbarService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"])); };
SnackbarService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: SnackbarService, factory: SnackbarService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "s5BX":
/*!**********************************************************!*\
  !*** ./src/app/ui/components/button/button.component.ts ***!
  \**********************************************************/
/*! exports provided: ButtonComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ButtonComponent", function() { return ButtonComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/progress-spinner */ "pu8Q");





function ButtonComponent_mat_spinner_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "mat-spinner", 3);
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("diameter", 30);
} }
function ButtonComponent_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](0, 0, ["#content", ""]);
} }
const _c0 = ["*"];
class ButtonComponent {
    constructor() {
        this.loading = false;
        this.action = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.theme = 'primary';
    }
    onClick() {
        if (this.disabled)
            return;
        this.action.emit(this.emitValue);
    }
}
ButtonComponent.ɵfac = function ButtonComponent_Factory(t) { return new (t || ButtonComponent)(); };
ButtonComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ButtonComponent, selectors: [["spiff-button"]], inputs: { emitValue: "emitValue", loading: "loading", disabled: "disabled", theme: "theme" }, outputs: { action: "action" }, ngContentSelectors: _c0, decls: 4, vars: 4, consts: [["mat-raised-button", "", 1, "button", 3, "color", "disabled", "click"], [3, "diameter", 4, "ngIf", "ngIfElse"], ["content", ""], [3, "diameter"]], template: function ButtonComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ButtonComponent_Template_button_click_0_listener() { return ctx.onClick(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ButtonComponent_mat_spinner_1_Template, 1, 1, "mat-spinner", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, ButtonComponent_ng_template_2_Template, 1, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("color", ctx.theme)("disabled", ctx.disabled || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading)("ngIfElse", _r1);
    } }, directives: [_angular_material_button__WEBPACK_IMPORTED_MODULE_1__["MatButton"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_3__["MatSpinner"]], styles: [".button[_ngcontent-%COMP%] {\n  display: block;\n  overflow: hidden;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYnV0dG9uLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtFQUNBLGdCQUFBO0VBQ0EsMEJBQUE7RUFBQSx1QkFBQTtFQUFBLGtCQUFBO0FBQ0oiLCJmaWxlIjoiYnV0dG9uLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmJ1dHRvbiB7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XHJcbn0iXX0= */"] });


/***/ }),

/***/ "taxL":
/*!**********************************************************************!*\
  !*** ./src/app/ui/components/rate-counter/rate-counter.component.ts ***!
  \**********************************************************************/
/*! exports provided: RateCounterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RateCounterComponent", function() { return RateCounterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ "Tj54");
/* harmony import */ var spiff_app_pipes_pretty_number_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! spiff/app/pipes/pretty-number.pipe */ "Y1GY");





const _c0 = function (a0) { return { "color": a0 }; };
class RateCounterComponent {
    constructor() {
        this.liked = false;
        this.disliked = false;
        this.like = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.dislike = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ngOnInit() {
        if (this.item === undefined || this.item === null)
            throw new Error('RateCounterComponent: item was not provided');
    }
}
RateCounterComponent.ɵfac = function RateCounterComponent_Factory(t) { return new (t || RateCounterComponent)(); };
RateCounterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: RateCounterComponent, selectors: [["spiff-rate-counter"]], inputs: { item: "item", liked: "liked", disliked: "disliked" }, outputs: { like: "like", dislike: "dislike" }, decls: 12, vars: 14, consts: [[1, "row", 3, "ngStyle"], [1, "pointer", "icon", 3, "click"], [3, "title"]], template: function RateCounterComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-icon", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RateCounterComponent_Template_mat_icon_click_1_listener() { return ctx.like.emit(ctx.item); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "keyboard_arrow_up");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](5, "prettyNumber");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "mat-icon", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RateCounterComponent_Template_mat_icon_click_7_listener() { return ctx.dislike.emit(ctx.item); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "keyboard_arrow_down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](11, "prettyNumber");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](10, _c0, ctx.liked ? "rgb(255,150,0)" : "inherit"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("title", ctx.item.likes);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](5, 6, ctx.item.likes));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](12, _c0, ctx.disliked ? "rgb(0,150,255)" : "inherit"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("title", ctx.item.dislikes);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](11, 8, ctx.item.dislikes));
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgStyle"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIcon"]], pipes: [spiff_app_pipes_pretty_number_pipe__WEBPACK_IMPORTED_MODULE_3__["PrettyNumberPipe"]], styles: [".row[_ngcontent-%COMP%] {\n  display: flex;\n}\n\n.icon[_ngcontent-%COMP%] {\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxccmF0ZS1jb3VudGVyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksYUFBQTtBQUNKOztBQUVBO0VBQ0ksZUFBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7QUFDSiIsImZpbGUiOiJyYXRlLWNvdW50ZXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucm93IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbn1cclxuXHJcbi5pY29uIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHVzZXItc2VsZWN0OiBub25lO1xyXG59Il19 */"] });


/***/ }),

/***/ "vPQ5":
/*!****************************************!*\
  !*** ./src/app/api/interface/index.ts ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-types */ "fCvi");
/* empty/unused harmony star reexport *//* harmony import */ var _response__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./response */ "TMt6");
/* empty/unused harmony star reexport *//* harmony import */ var _responses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./responses */ "5o7i");
/* empty/unused harmony star reexport */




/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var spiff_app_ui_views_post_post_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! spiff/app/ui/views/post/post.component */ "2fy0");
/* harmony import */ var _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/not-found/not-found.component */ "F33o");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var spiff_app_ui_views_landing_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! spiff/app/ui/views/landing-page */ "8Fwg");
/* harmony import */ var _ui_views__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui/views */ "f5/Q");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "8Y7J");







const routes = [
    { path: '', component: spiff_app_ui_views_landing_page__WEBPACK_IMPORTED_MODULE_3__["LandingPageComponent"] },
    { path: 'user/:username', component: _ui_views__WEBPACK_IMPORTED_MODULE_4__["ProfileComponent"] },
    { path: 'post/:id', component: spiff_app_ui_views_post_post_component__WEBPACK_IMPORTED_MODULE_0__["PostComponent"] },
    { path: 'settings', component: _ui_views__WEBPACK_IMPORTED_MODULE_4__["SettingsComponent"] },
    { path: '**', component: _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_1__["NotFoundComponent"] }
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes, { relativeLinkResolution: 'legacy' })], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]] }); })();


/***/ }),

/***/ "vvyD":
/*!************************************!*\
  !*** ./src/app/material.module.ts ***!
  \************************************/
/*! exports provided: MaterialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModule", function() { return MaterialModule; });
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material/icon */ "Tj54");
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/menu */ "rJgo");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ "PDjf");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/input */ "e6WT");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ "Dxy4");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ "iELJ");
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/divider */ "BSbQ");
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/toolbar */ "l0rg");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/snack-bar */ "zHaW");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/form-field */ "Q2Ze");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/progress-spinner */ "pu8Q");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ "8Y7J");












class MaterialModule {
}
MaterialModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({ type: MaterialModule });
MaterialModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({ factory: function MaterialModule_Factory(t) { return new (t || MaterialModule)(); }, imports: [_angular_material_card__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_0__["MatIconModule"],
        _angular_material_menu__WEBPACK_IMPORTED_MODULE_1__["MatMenuModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_3__["MatInputModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_4__["MatButtonModule"],
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__["MatDialogModule"],
        _angular_material_divider__WEBPACK_IMPORTED_MODULE_6__["MatDividerModule"],
        _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_7__["MatToolbarModule"],
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__["MatSnackBarModule"],
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_9__["MatFormFieldModule"],
        _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__["MatProgressSpinnerModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](MaterialModule, { exports: [_angular_material_card__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_0__["MatIconModule"],
        _angular_material_menu__WEBPACK_IMPORTED_MODULE_1__["MatMenuModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_3__["MatInputModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_4__["MatButtonModule"],
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__["MatDialogModule"],
        _angular_material_divider__WEBPACK_IMPORTED_MODULE_6__["MatDividerModule"],
        _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_7__["MatToolbarModule"],
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__["MatSnackBarModule"],
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_9__["MatFormFieldModule"],
        _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__["MatProgressSpinnerModule"]] }); })();


/***/ }),

/***/ "w27u":
/*!***********************************************!*\
  !*** ./src/app/ui/components/dialog/index.ts ***!
  \***********************************************/
/*! exports provided: DialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dialog.component */ "5wBu");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DialogComponent", function() { return _dialog_component__WEBPACK_IMPORTED_MODULE_0__["DialogComponent"]; });




/***/ }),

/***/ "wJhU":
/*!*****************************************************************!*\
  !*** ./src/app/ui/views/landing-page/landing-page.component.ts ***!
  \*****************************************************************/
/*! exports provided: LandingPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandingPageComponent", function() { return LandingPageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var api_interface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! api/interface */ "vPQ5");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var services_post_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! services/post.service */ "ENZJ");
/* harmony import */ var services_dialog_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! services/dialog.service */ "CzQJ");
/* harmony import */ var services_user_account_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! services/user-account.service */ "HEVm");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "PDjf");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "SVse");
/* harmony import */ var spiff_app_ui_components_rate_counter_rate_counter_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! spiff/app/ui/components/rate-counter/rate-counter.component */ "taxL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "iInd");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/progress-spinner */ "pu8Q");
/* harmony import */ var spiff_app_pipes_date_ago_pipe__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! spiff/app/pipes/date-ago.pipe */ "6Kw5");













function LandingPageComponent_ng_container_1_ng_container_2_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "spiff-rate-counter", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("like", function LandingPageComponent_ng_container_1_ng_container_2_div_1_Template_spiff_rate_counter_like_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r9); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3); return ctx_r8.likePost($event); })("dislike", function LandingPageComponent_ng_container_1_ng_container_2_div_1_Template_spiff_rate_counter_dislike_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r9); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3); return ctx_r10.dislikePost($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](9, "dateAgo");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, " by ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "p", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const post_r7 = ctx.$implicit;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("item", post_r7)("liked", ctx_r6.isPostLiked(post_r7._id))("disliked", ctx_r6.isPostDisliked(post_r7._id));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", "/post/" + post_r7._id);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](post_r7.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("title", ctx_r6.toTimestamp(post_r7));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("submitted ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](9, 10, post_r7.date), " ago");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", "/user/" + post_r7.author.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" u/", post_r7.author.username, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", post_r7.comments.length + (post_r7.comments.length === 1 ? " comment" : " comments"), " ");
} }
function LandingPageComponent_ng_container_1_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, LandingPageComponent_ng_container_1_ng_container_2_div_1_Template, 15, 12, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r3.posts);
} }
function LandingPageComponent_ng_container_1_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "No posts! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LandingPageComponent_ng_container_1_ng_container_3_Template_span_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r11.dialog.openCreatePostDialog(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Why not make one?");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
} }
function LandingPageComponent_ng_container_1_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Looks like we couldn't load any posts");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "a", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LandingPageComponent_ng_container_1_ng_container_4_Template_a_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r14); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r13.fetchPosts(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Retry");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
} }
function LandingPageComponent_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](1, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, LandingPageComponent_ng_container_1_ng_container_2_Template, 2, 1, "ng-container", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, LandingPageComponent_ng_container_1_ng_container_3_Template, 5, 0, "ng-container", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, LandingPageComponent_ng_container_1_ng_container_4_Template, 5, 0, "ng-container", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitch", ctx_r0.postStatus);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "Ok");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "None");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngSwitchCase", "Error");
} }
function LandingPageComponent_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mat-spinner", 15);
} }
class LandingPageComponent {
    constructor(title, post, dialog, account) {
        this.title = title;
        this.post = post;
        this.dialog = dialog;
        this.account = account;
        this.postStatus = 'None';
    }
    ngOnInit() {
        this.title.setTitle('spiffing');
        this.fetchPosts();
    }
    fetchPosts() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.loadingPosts = true;
            try {
                this.posts = (yield this.post.getPostsByUserId(undefined, true));
                this.postStatus = this.posts.length ? 'Ok' : 'None';
            }
            catch (error) {
                if (error.message === 'NoConnection') {
                    this.posts = [];
                }
                this.postStatus = 'Error';
            }
            this.loadingPosts = false;
        });
    }
    isPostLiked(postId) {
        if (this.account.ratedPosts.has(postId))
            return this.account.ratedPosts.get(postId);
        else
            return false;
    }
    isPostDisliked(postId) {
        if (this.account.ratedPosts.has(postId))
            return !this.account.ratedPosts.get(postId);
        else
            return false;
    }
    toTimestamp(post) {
        return new Date(post.date * 1000).toLocaleString();
    }
    likePost(post) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            post = post;
            if (post === undefined || post === null)
                throw new Error('LandingPageComponent: provided post to like was ' + post);
            if (this.account.ratedPosts.get(post._id) === true) {
                const rateRequest = yield this.account.ratePost(post._id, 0);
                if (rateRequest.ok === true) {
                    this.account.ratedPosts.delete(post._id);
                    post.likes--;
                }
                else
                    throw new Error('Error while liking post in Post View: ' + rateRequest.error);
            }
            else {
                const rateRequest = yield this.account.ratePost(post._id, 1);
                if (rateRequest.ok === true) {
                    if (this.account.ratedPosts.get(post._id) === false)
                        post.dislikes--;
                    this.account.ratedPosts.set(post._id, true);
                    post.likes++;
                }
                else
                    throw new Error('Error while liking post in Post View: ' + rateRequest.error);
            }
        });
    }
    dislikePost(post) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            post = post;
            if (post === undefined || post === null)
                throw new Error('LandingPageComponent: provided post to like was ' + post);
            if (this.account.ratedPosts.get(post._id) === false) {
                const rateRequest = yield this.account.ratePost(post._id, 0);
                if (rateRequest.ok === true) {
                    this.account.ratedPosts.delete(post._id);
                    post.dislikes--;
                }
                else
                    throw new Error('Error while liking post in Post View: ' + rateRequest.error);
            }
            else {
                const rateRequest = yield this.account.ratePost(post._id, -1);
                if (rateRequest.ok === true) {
                    if (this.account.ratedPosts.get(post._id) === true)
                        post.likes--;
                    this.account.ratedPosts.set(post._id, false);
                    post.dislikes++;
                }
                else
                    throw new Error('Error while liking post in Post View: ' + rateRequest.error);
            }
        });
    }
}
LandingPageComponent.ɵfac = function LandingPageComponent_Factory(t) { return new (t || LandingPageComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](services_post_service__WEBPACK_IMPORTED_MODULE_4__["PostService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](services_dialog_service__WEBPACK_IMPORTED_MODULE_5__["DialogService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](services_user_account_service__WEBPACK_IMPORTED_MODULE_6__["UserAccountService"])); };
LandingPageComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: LandingPageComponent, selectors: [["spiff-landing-page"]], decls: 4, vars: 2, consts: [[1, "landing-page-container"], [4, "ngIf", "ngIfElse"], ["spinner", ""], [3, "ngSwitch"], [4, "ngSwitchCase"], ["class", "landing-page-post", 4, "ngFor", "ngForOf"], [1, "landing-page-post"], [3, "item", "liked", "disliked", "like", "dislike"], [1, "post-title", "hover-underline", 3, "routerLink"], [1, "user-details"], [3, "title"], ["title", "Click to go to profile", 1, "user-link", "hover-underline", 3, "routerLink"], [1, "comments-label"], [1, "underline-hover", 3, "click"], [3, "click"], [1, "landing-page-spinner"]], template: function LandingPageComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mat-card", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, LandingPageComponent_ng_container_1_Template, 5, 4, "ng-container", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, LandingPageComponent_ng_template_2_Template, 1, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loadingPosts)("ngIfElse", _r1);
    } }, directives: [_angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCard"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgSwitch"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgSwitchCase"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgForOf"], spiff_app_ui_components_rate_counter_rate_counter_component__WEBPACK_IMPORTED_MODULE_9__["RateCounterComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_10__["RouterLink"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__["MatSpinner"]], pipes: [spiff_app_pipes_date_ago_pipe__WEBPACK_IMPORTED_MODULE_12__["DateAgoPipe"]], styles: [".landing-page-container[_ngcontent-%COMP%] {\n  width: 80%;\n  margin: auto;\n  padding: 10px 15px;\n  background-color: white;\n}\n.landing-page-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.landing-page-container[_ngcontent-%COMP%]   .landing-page-spinner[_ngcontent-%COMP%] {\n  margin: auto;\n}\n.landing-page-container[_ngcontent-%COMP%]   .landing-page-post[_ngcontent-%COMP%] {\n  display: flex;\n  margin: 10px 0;\n}\n.landing-page-container[_ngcontent-%COMP%]   .landing-page-post[_ngcontent-%COMP%]   spiff-rate-counter[_ngcontent-%COMP%] {\n  margin-right: 1em;\n}\n.landing-page-container[_ngcontent-%COMP%]   .landing-page-post[_ngcontent-%COMP%]   .user-details[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  font-size: 13px;\n}\n.landing-page-container[_ngcontent-%COMP%]   .landing-page-post[_ngcontent-%COMP%]   .user-details[_ngcontent-%COMP%]   .user-link[_ngcontent-%COMP%] {\n  cursor: pointer;\n  outline: none;\n}\n.landing-page-container[_ngcontent-%COMP%]   .landing-page-post[_ngcontent-%COMP%]   .comments-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n}\n.landing-page-container[_ngcontent-%COMP%]   .landing-page-post[_ngcontent-%COMP%]   .post-title[_ngcontent-%COMP%] {\n  outline: none;\n  cursor: pointer;\n  font-weight: 500;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  height: -webkit-fit-content;\n  height: -moz-fit-content;\n  height: fit-content;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcbGFuZGluZy1wYWdlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksVUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLHVCQUFBO0FBQ0o7QUFDSTtFQUNJLFNBQUE7QUFDUjtBQUVJO0VBQ0ksWUFBQTtBQUFSO0FBR0k7RUFDSSxhQUFBO0VBQ0EsY0FBQTtBQURSO0FBR1E7RUFDSSxpQkFBQTtBQURaO0FBSVE7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0FBRlo7QUFJWTtFQUNJLGVBQUE7RUFDQSxhQUFBO0FBRmhCO0FBTVE7RUFDSSxlQUFBO0FBSlo7QUFPUTtFQUNJLGFBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSwwQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7RUFDQSwyQkFBQTtFQUFBLHdCQUFBO0VBQUEsbUJBQUE7QUFMWiIsImZpbGUiOiJsYW5kaW5nLXBhZ2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubGFuZGluZy1wYWdlLWNvbnRhaW5lciB7XHJcbiAgICB3aWR0aDogODAlO1xyXG4gICAgbWFyZ2luOiBhdXRvO1xyXG4gICAgcGFkZGluZzogMTBweCAxNXB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcblxyXG4gICAgcCB7XHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC5sYW5kaW5nLXBhZ2Utc3Bpbm5lciB7XHJcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xyXG4gICAgfVxyXG5cclxuICAgIC5sYW5kaW5nLXBhZ2UtcG9zdCB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBtYXJnaW46IDEwcHggMDtcclxuXHJcbiAgICAgICAgc3BpZmYtcmF0ZS1jb3VudGVyIHtcclxuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAudXNlci1kZXRhaWxzIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG5cclxuICAgICAgICAgICAgLnVzZXItbGluayB7XHJcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICBvdXRsaW5lOiBub25lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY29tbWVudHMtbGFiZWwge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucG9zdC10aXRsZSB7XHJcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgICAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IGZpdC1jb250ZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ== */"] });


/***/ }),

/***/ "x+Ag":
/*!************************************************!*\
  !*** ./src/app/ui/components/dialogs/index.ts ***!
  \************************************************/
/*! exports provided: LoginDialogComponent, CreateAccountDialogComponent, ChangeUsernameDialogComponent, DeleteAccountConfirmDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _login_dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login-dialog */ "JdS8");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoginDialogComponent", function() { return _login_dialog__WEBPACK_IMPORTED_MODULE_0__["LoginDialogComponent"]; });

/* harmony import */ var _create_account_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-account-dialog */ "6Vpe");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CreateAccountDialogComponent", function() { return _create_account_dialog__WEBPACK_IMPORTED_MODULE_1__["CreateAccountDialogComponent"]; });

/* harmony import */ var _change_username_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./change-username-dialog */ "NMTX");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ChangeUsernameDialogComponent", function() { return _change_username_dialog__WEBPACK_IMPORTED_MODULE_2__["ChangeUsernameDialogComponent"]; });

/* harmony import */ var _delete_account_confirm_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./delete-account-confirm-dialog */ "ygkF");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeleteAccountConfirmDialogComponent", function() { return _delete_account_confirm_dialog__WEBPACK_IMPORTED_MODULE_3__["DeleteAccountConfirmDialogComponent"]; });







/***/ }),

/***/ "xIDh":
/*!**********************************************************!*\
  !*** ./src/app/api/interface/responses/api-responses.ts ***!
  \**********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is autogenerated; changes may be overwritten.



/***/ }),

/***/ "xXuK":
/*!****************************************!*\
  !*** ./src/app/ui/components/index.ts ***!
  \****************************************/
/*! exports provided: ButtonComponent, ViewCardComponent, DialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ "6H7M");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ButtonComponent", function() { return _button__WEBPACK_IMPORTED_MODULE_0__["ButtonComponent"]; });

/* harmony import */ var _view_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view-card */ "/L3f");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewCardComponent", function() { return _view_card__WEBPACK_IMPORTED_MODULE_1__["ViewCardComponent"]; });

/* harmony import */ var _dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dialog */ "w27u");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DialogComponent", function() { return _dialog__WEBPACK_IMPORTED_MODULE_2__["DialogComponent"]; });






/***/ }),

/***/ "ygkF":
/*!******************************************************************************!*\
  !*** ./src/app/ui/components/dialogs/delete-account-confirm-dialog/index.ts ***!
  \******************************************************************************/
/*! exports provided: DeleteAccountConfirmDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _delete_account_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./delete-account-confirm-dialog.component */ "LA4+");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeleteAccountConfirmDialogComponent", function() { return _delete_account_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_0__["DeleteAccountConfirmDialogComponent"]; });




/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "cUpR");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "8Y7J");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map