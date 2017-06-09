// Angular references
import { trigger, transition, animate, style, state } from '@angular/core';

// FadeIn
export function FadeIn(triggerName: string, animation: string = '300ms linear') {
    return trigger(triggerName, [
        state('inactive', style({
            opacity: 0
        })),
        state('active', style({
            opacity: 1
        })),
        transition('inactive => active', animate(animation))
    ]);
}

// FadeInUp
export function FadeInUp(triggerName: string, animation: string = '300ms linear') {
    return trigger(triggerName, [
        state('inactive', style({
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)'
        })),
        state('active', style({
            opacity: 1,
            transform: 'none'
        })),
        transition('inactive => active', animate(animation))
    ]);
}

// FadeInDown
export function FadeInDown(triggerName: string, animation: string = '300ms linear') {
    return trigger(triggerName, [
        state('inactive', style({
            opacity: 0,
            transform: 'translate3d(0, -100%, 0)'
        })),
        state('active', style({
            opacity: 1,
            transform: 'none'
        })),
        transition('inactive => active', animate(animation))
    ]);
}

// FadeInRight
export function FadeInRight(triggerName: string, animation: string = '300ms linear') {
    return trigger(triggerName, [
        state('inactive', style({
            opacity: 0,
            transform: 'translate3d(100%, 0, 0)'
        })),
        state('active', style({
            opacity: 1,
            transform: 'none'
        })),
        transition('inactive => active', animate(animation))
    ]);
}

// FadeInLeft
export function FadeInLeft(triggerName: string, animation: string = '300ms linear') {
    return trigger(triggerName, [
        state('inactive', style({
            opacity: 0,
            transform: 'translate3d(-100%, 0, 0)'
        })),
        state('active', style({
            opacity: 1,
            transform: 'none'
        })),
        transition('inactive => active', animate(animation))
    ]);
}