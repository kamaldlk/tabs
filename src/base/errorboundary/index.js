import React, { Component } from 'react';
import propTypes from "prop-types";

export class ErrorBoundary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      clearCache: false
    };
  }

    /**
     * Static method get error state
     */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

    /**
     * Catch the component error
     */
  componentDidCatch(error, errorInfo) {
    console.error('Failed to load component', error, errorInfo);
  }

    /**
     * Handle the retry page loading
     */
    reloadPage = () => {
      this.setState({ clearCache: true });

      clearResourceCache()
        .then(() => console.log('==== Cleared the resource cache ==='))
        .finally(() => window.location.reload(true));
    };

    /**
     * Render the JSX elements
     */
    render() {
      const style = { width: '100%', height: '100%', display: 'grid', alignItems: 'center', justifyItems: 'center' };
        // TODO: map the proper color variable
      const linkStyle = { color: 'rgb(var(--secondary-6-main))', cursor: 'pointer' };

      if (this.state.hasError) {
        return (
          <div style={style} onClick={this.reloadPage}>
            {this.state.clearCache ? <span className='kulavai-h4'>Fetching new content...</span> :
              <span className='kulavai-h4'>New content is available. Click to
                <span style={linkStyle}>refresh.</span></span>}
          </div>
        );
      }

      return this.props.children;
    }
}

ErrorBoundary.propTypes = {
  children: propTypes.any
};

  
/**
 * Method for handling resource caches
 */
function clearResourceCache() {

  return new Promise((resolve, reject) => {
    caches.open('static-resources').then(cache => {
      cache.keys().then(keys => {
        keys.forEach(request => cache.delete(request));
        resolve(true);
      });
    }).catch(err => reject(false));
  });
}

