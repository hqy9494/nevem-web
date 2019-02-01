import React from 'react';

class ContentWrapper extends React.Component {

    render() {

        var childElement = this.props.children;

        // unwrapped pages
        if (this.props.unwrap) {
            childElement = <div className="unwrap">{this.props.children}</div>;
        }

        return (
            <div style={{height:'100%'}}>
                {childElement}
            </div>
        );
    }

}

export default ContentWrapper;
