import {CSSTransition} from 'react-transition-group';
import React from 'react';


export const CSSCollapseTransition = ({ children, ...props }) => (
    <CSSTransition {...props}  timeout={200} classNames="collapse">
        <div>
            {children}
        </div>
    </CSSTransition>
);

export const CSSFadeTransition = ({ children, ...props }) => (
    <CSSTransition {...props}  timeout={200} classNames="fade">
        <div>
            {children}
        </div>
    </CSSTransition>
);

export const CSSZoomTransition = ({ children, ...props }) => (
    <CSSTransition {...props}  timeout={200} classNames="zoom">
        <div>
            {children}
        </div>
    </CSSTransition>
);