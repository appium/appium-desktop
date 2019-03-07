import React, { Component } from 'react';
import { SCREENSHOT_INTERACTION_MODE, INTERACTION_MODE } from './shared';
import { Card, Icon, Button, Spin, Tooltip, Modal, Tabs } from 'antd';
import Screenshot from './Screenshot';
import SelectedElement from './SelectedElement';
import Source from './Source';
import InspectorStyles from './Inspector.css';
import RecordedActions from './RecordedActions';
import Actions from './Actions';
import { clipboard } from 'electron';

const {SELECT, SWIPE, TAP} = SCREENSHOT_INTERACTION_MODE;

const { TabPane } = Tabs;

const ButtonGroup = Button.Group;

const MIN_WIDTH = 1080;
const MIN_HEIGHT = 570;

export default class Inspector extends Component {

  constructor () {
    super();
    this.didInitialResize = false;
    this.state = {};
  }

  componentDidMount () {
    const curHeight = window.innerHeight;
    const curWidth = window.innerWidth;
    const needsResize = (curHeight < MIN_HEIGHT) || (curWidth < MIN_WIDTH);
    if (!this.didInitialResize && needsResize) {
      const newWidth = curWidth < MIN_WIDTH ? MIN_WIDTH : curWidth;
      const newHeight = curHeight < MIN_HEIGHT ? MIN_HEIGHT : curHeight;
      // resize width to something sensible for using the inspector on first run
      window.resizeTo(newWidth, newHeight);
    }
    this.didInitialResize = true;
    this.props.bindAppium();
    this.props.applyClientMethod({methodName: 'source'});
    this.props.getSavedActionFramework();
  }

  screenshotInteractionChange (mode) {
    const {selectScreenshotInteractionMode, clearSwipeAction} = this.props;
    clearSwipeAction(); // When the action changes, reset the swipe action
    selectScreenshotInteractionMode(mode);
  }

  render () {
    const {screenshot, screenshotError, selectedElement = {},
           applyClientMethod, quitSession, isRecording, showRecord, startRecording,
           pauseRecording, showLocatorTestModal,
           screenshotInteractionMode,
           selectedInteractionMode, selectInteractionMode,
           showKeepAlivePrompt, keepSessionAlive, sourceXML, t} = this.props;
    const {path} = selectedElement;

    let main = [
      <div id='screenshotContainer' key='screenshotContainer'>
        {screenshot && <Screenshot {...this.props} />}
        {screenshotError && t('couldNotObtainScreenshot', {screenshotError})}
        {!screenshot && !screenshotError &&
          <Spin size="large" spinning={true}>
            <div/>
          </Spin>
        }
      </div>,
      <div id='sourceTreeContainer' key='sourceTreeContainer'>
        {showRecord &&
          <RecordedActions {...this.props} />
        }
        <Tabs activeKey={selectedInteractionMode} size="small" onChange={(tab) => selectInteractionMode(tab)}>
          <TabPane tab={t('Source')} key={INTERACTION_MODE.SOURCE}>
            <div>
              <div>
                <Card
                  title={<span><Icon type="file-text" /> {t('App Source')}</span>}>
                  <Source {...this.props} />
                </Card>
              </div>
              <div id='selectedElementContainer'>
                <Card
                  title={<span><Icon type="tag-o" /> {t('selectedElement')}</span>}>
                  {path && <SelectedElement {...this.props}/>}
                  {!path && <i>{t('selectElementInSource')}</i>}
                </Card>
              </div>
            </div>
          </TabPane>
          <TabPane tab={t('Actions')} key={INTERACTION_MODE.ACTIONS}>
            <Card
              title={<span><Icon type="thunderbolt" /> {t('Actions')}</span>}>
              <Actions {...this.props} />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    ];

    let actionControls = <div>
      <ButtonGroup size="large" value={screenshotInteractionMode}>
        <Tooltip title={t('Select Elements')}>
          <Button icon='select' onClick={() => {this.screenshotInteractionChange(SELECT);}}
            type={screenshotInteractionMode === SELECT ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title={t('Swipe By Coordinates')}>
          <Button icon='swap-right' onClick={() => {this.screenshotInteractionChange(SWIPE);}}
            type={screenshotInteractionMode === SWIPE ? 'primary' : 'default'}
          />
        </Tooltip>
        <Tooltip title={t('Tap By Coordinates')}>
          <Button icon='scan' onClick={() => {this.screenshotInteractionChange(TAP);}}
            type={screenshotInteractionMode === TAP ? 'primary' : 'default'}
          />
        </Tooltip>
      </ButtonGroup>
    </div>;

    let controls = <div>
      {actionControls}
      <ButtonGroup size="large">
        <Tooltip title={t('Back')}>
          <Button id='btnGoBack' icon='arrow-left' onClick={() => applyClientMethod({methodName: 'back'})}/>
        </Tooltip>
        <Tooltip title={t('refreshSource')}>
          <Button id='btnReload' icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}/>
        </Tooltip>
        {!isRecording &&
          <Tooltip title={t('Start Recording')}>
            <Button id='btnStartRecording' icon="eye-o" onClick={startRecording}/>
          </Tooltip>
        }
        {isRecording &&
          <Tooltip title={t('Pause Recording')}>
            <Button id='btnPause' icon="pause" type="danger" onClick={pauseRecording}/>
          </Tooltip>
        }
        <Tooltip title={t('Search for element')}>
          <Button id='searchForElement' icon="search" onClick={showLocatorTestModal}/>
        </Tooltip>
        <Tooltip title={t('Copy XML Source to Clipboard')}>
          <Button id='btnSourceXML' icon="copy" onClick={() => clipboard.writeText(sourceXML)}/>
        </Tooltip>
        <Tooltip title={t('quitSessionAndClose')}>
          <Button id='btnClose' icon='close' onClick={() => quitSession()}/>
        </Tooltip>
      </ButtonGroup>
    </div>;

    return <div style={{display: 'grid', gridTemplateColumns: '30% auto', gridTemplateRows: '8em auto'}}>
      <div style={{gridColumn: "1 / 3"}}>{controls}</div>
      {main}
      <Modal
        title={t('Session Inactive')}
        visible={showKeepAlivePrompt}
        onOk={() => keepSessionAlive()}
        onCancel={() => quitSession()}
        okText={t('Keep Session Running')}
        cancelText={t('Quit Session')}>
        <p>{t('Your session is about to expire')}</p>
      </Modal>
    </div>;
  }
}
