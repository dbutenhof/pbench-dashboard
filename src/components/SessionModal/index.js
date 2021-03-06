import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Modal, Form, Input, message } from 'antd';
import { ToolbarItem, Button } from '@patternfly/react-core';
import { ShareAltIcon } from '@patternfly/react-icons';

const { TextArea } = Input;

class SessionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
      visible: false,
      sessionUrl: '',
    };
  }

  showSuccess = () => {
    const { sessionUrl } = this.state;

    Modal.success({
      title: 'Generated session link',
      content: (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
          <Input value={sessionUrl} />
          <CopyToClipboard text={sessionUrl}>
            <Button style={{ marginLeft: 8 }} onClick={this.copyLink}>
              Copy Link
            </Button>
          </CopyToClipboard>
        </div>
      ),
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  onGenerate = () => {
    const { dispatch } = this.props;
    let { sessionConfig } = this.props;
    const { description } = this.state;
    sessionConfig = JSON.stringify(sessionConfig);

    dispatch({
      type: 'global/saveUserSession',
      payload: {
        sessionConfig,
        description,
      },
    }).then(result => {
      this.setState({
        visible: false,
        sessionUrl: `${window.location.origin}/#/dashboard/share/${result.data.createUrl.id}`,
      });
      this.showSuccess();
    });
  };

  copyLink = () => {
    const { sessionUrl } = this.state;
    message.success(`Copied the link: ${sessionUrl}`);
  };

  changeDescription = e => {
    this.setState({
      description: e.target.value,
    });
  };

  render() {
    const { visible, description } = this.state;
    const { savingSession } = this.props;

    return (
      <span>
        <ToolbarItem>
          <Button onClick={this.showModal} variant="plain">
            <ShareAltIcon />
          </Button>
        </ToolbarItem>
        <Modal
          title="Share Session Link"
          visible={visible}
          onOk={this.onGenerate}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.onGenerate} loading={savingSession}>
              Save
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Description">
              <TextArea
                rows={2}
                id="description"
                placeholder={description}
                onChange={this.changeDescription}
              />
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default SessionModal;
