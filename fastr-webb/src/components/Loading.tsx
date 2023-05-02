import * as React from "react";
import Loader from "react-loaders";

export default class Loading extends React.Component {
    public render() {
        return (
            <div className="h-100 w-100">
                <Loader innerClassName="h-100 w-100  align-items-center d-flex" active type="square-spin" />
            </div>);
    }
}
