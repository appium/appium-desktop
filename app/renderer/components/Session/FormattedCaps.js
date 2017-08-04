import React, { Component } from 'react';
import formatJSON from 'format-json';
import SessionCSS from './Session.css';
import { Card, Button, Alert } from 'antd';
import { getCapsObject } from '../../actions/Session.js';

export default class NewSessionForm extends Component {

  getFormattedJSON (caps) {
    return formatJSON.plain(getCapsObject(caps));
  }

  render () {
    const {caps, title, isEditingDesiredCaps, startDesiredCapsEditor, abortDesiredCapsEditor, saveRawDesiredCaps, setRawDesiredCaps, rawDesiredCaps,
      isValidCapsJson, invalidCapsJsonReason} = this.props;
    return caps && <Card title={title || "JSON Representation"}
      className={SessionCSS['formatted-caps']}>
      <div className={SessionCSS.capsEditorControls}>
        {isEditingDesiredCaps && <Button onClick={abortDesiredCapsEditor} icon='close' className={SessionCSS.capsEditorButton} /> }
        {isEditingDesiredCaps && <Button onClick={saveRawDesiredCaps} icon='save'  className={SessionCSS.capsEditorButton} /> }
        {!isEditingDesiredCaps && <Button onClick={startDesiredCapsEditor} icon='edit' /> }
      </div>
      {isEditingDesiredCaps && <div>
        <textarea rows='9' onChange={(e) => setRawDesiredCaps(e.target.value)} value={rawDesiredCaps} className={SessionCSS.capsEditor} />
        {!isValidCapsJson && <Alert message={invalidCapsJsonReason} type="error" />}
      </div>}
      {!isEditingDesiredCaps && <div>
        <pre>{this.getFormattedJSON(caps)}</pre>
      </div>}
    </Card>;
  }
}
