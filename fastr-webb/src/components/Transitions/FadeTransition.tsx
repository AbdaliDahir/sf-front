import { Transition } from 'react-transition-group';
import React from 'react';

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}

const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
};

export const FadeTransition = ({ children, ...props }) => (
    <Transition {...props} timeout={duration}>
        {state => (
            <div style={{
                ...defaultStyle,
                ...transitionStyles[state]
            }}>
                {children}
            </div>
        )}
    </Transition>
);