import React, { Component } from 'react';
import { Input } from 'antd';
import { withTranslation } from '../../util';
import { propTypes, updateArg } from './shared';
import StartButton from './StartButton';
import styles from './SimpleTab.css';

class SimpleTab extends Component {

  render () {
    const {startServer, serverArgs, serverStarting, serverVersion, t} = this.props;

    return (
      <div className={styles.form}>
        <form onSubmit={startServer}>
          <Input ref="address" defaultValue={serverArgs.address}
            addonBefore={t('Host')}
            name="address" onChange={updateArg.bind(this)}
            id="simpleHostInput"
          />
          <Input ref="port" defaultValue={serverArgs.port}
            addonBefore={t('Port')} name="port" onChange={updateArg.bind(this)}
            id="simplePortInput"
          />
          <div className="form-actions">
            <StartButton {...{serverStarting, startServer, serverVersion}} />
          </div>
        </form>
      </div>
    );
  }
}

SimpleTab.propTypes = {...propTypes};

export default withTranslation(SimpleTab);
