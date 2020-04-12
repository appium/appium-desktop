import React from 'react';
import { Alert } from 'antd';
import styles from './ErrorBoundary.css';
import { ALERT } from '../AntdTypes';

const CREATE_ISSUE_URL = 'https://github.com/appium/appium-desktop/issues/new';

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      error: null
    };
  }

  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  render () {
    const { error } = this.state;
    if (error) {
      return (
        <div className={styles.errorBoundary}>
          <Alert
            message="Unhandled Exception"
            type={ALERT.ERROR}
            description={
              <>
                <span children={`An unexpected error occurred with message: ${error.message}.`} />
                <br />
                <span children='Please kindly open up a bug report at ' />
                <a href={CREATE_ISSUE_URL} children={CREATE_ISSUE_URL}/>.
                <pre children={error.stack} />
              </>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}
