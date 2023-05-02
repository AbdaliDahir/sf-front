import { Transition } from 'react-transition-group';
import React from 'react';

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
    opacity: 0,
}

const transitionStyles = {
    entering: {
        opacity: 0,
        transform: "scale(0.9)"
},
    entered:  {
        transform: "translateX(0)",
        opacity: 1
    },
    exiting:  {
        opacity: 1
    },
    exited:  {
        opacity: 0,
        transform: "scale(0.9)"
    },
};

export const ZoomTransition = ({ children, ...props }) => (
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