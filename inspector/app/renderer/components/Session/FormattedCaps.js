import React, { Component } from 'react';
import formatJSON from 'format-json';
import SessionCSS from './Session.css';
import { Card, Button, Alert, Tooltip } from 'antd';
import { getCapsObject } from '../../actions/Session.js';
import {
  CloseOutlined,
  SaveOutlined,
  EditOutlined
} from '@ant-design/icons';
import { remote } from 'electron';
import { HEIGHT_OF_SESSION_CONFIG_AREA } from './Layout';
import { ALERT } from '../../../../../shared/components/AntdTypes';

export default class NewSessionForm extends Component {

  getFormattedJSON (caps) {
    return formatJSON.plain(getCapsObject(caps));
  }

  render () {
    const {caps, title, isEditingDesiredCaps, startDesiredCapsEditor, abortDesiredCapsEditor, saveRawDesiredCaps, setRawDesiredCaps, rawDesiredCaps,
           isValidCapsJson, invalidCapsJsonReason, t} = this.props;
    return caps && <div className={SessionCSS.formattedCapsCont}>
      <Card
        title={title || 'JSON Representation'}
        className={SessionCSS.formattedCaps}
        bodyStyle={{maxHeight: remote.getCurrentWindow().getSize()[1] - HEIGHT_OF_SESSION_CONFIG_AREA}}>

        <div className={SessionCSS.capsEditorControls}>
          {isEditingDesiredCaps && <Tooltip title={t('Cancel')}>
            <Button
              onClick={abortDesiredCapsEditor}
              icon={<CloseOutlined/>}
              className={SessionCSS.capsEditorButton} />
          </Tooltip> }
          {isEditingDesiredCaps && <Tooltip title={t('Save')}>
            <Button
              onClick={saveRawDesiredCaps}
              icon={<SaveOutlined/>}
              className={SessionCSS.capsEditorButton} />
          </Tooltip>}
          {!isEditingDesiredCaps && <Tooltip title={t('Edit Raw JSON')} placement="topRight" >
            <Button
              onClick={startDesiredCapsEditor}
              icon={<EditOutlined/>} />
          </Tooltip> }
        </div>
        {isEditingDesiredCaps && <div>
          <textarea rows='9' onChange={(e) => setRawDesiredCaps(e.target.value)} value={rawDesiredCaps} className={SessionCSS.capsEditor} />
          {!isValidCapsJson && <Alert message={invalidCapsJsonReason} type={ALERT.ERROR} />}
        </div>}
        {!isEditingDesiredCaps && <div>
          <pre>{this.getFormattedJSON(caps)}</pre>
        </div>}
      </Card>
    </div>;
  }
}
