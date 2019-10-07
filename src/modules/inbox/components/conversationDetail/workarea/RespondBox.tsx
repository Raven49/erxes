import { __, Alert, readFile, uploadHandler } from 'modules/common/utils';
import React from 'react';

import {
  Attachment,
  AttachmentIndicator,
  AttachmentThumb,
  EditorActions,
  FileName,
  Mask,
  MaskWrapper,
  PreviewImg,
  RespondBoxStyled,
  MailRespondBox,
  SmallEditor
} from 'modules/inbox/styles';

import asyncComponent from 'modules/common/components/AsyncComponent';
import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import Icon from 'modules/common/components/Icon';
import Tip from 'modules/common/components/Tip';
import { IAttachmentPreview } from 'modules/common/types';
import ResponseTemplate from 'modules/inbox/containers/conversationDetail/ResponseTemplate';
import { IUser } from '../../../../auth/types';
import { IIntegration } from '../../../../settings/integrations/types';
import { IResponseTemplate } from '../../../../settings/responseTemplates/types';
import { AddMessageMutationVariables, IConversation } from '../../../types';
import { FlexRow } from 'modules/settings/integrations/components/mail/styles';
import NameCard from 'modules/common/components/nameCard/NameCard';

const Editor = asyncComponent(
  () => import(/* webpackChunkName: "Editor-in-Inbox" */ './Editor'),
  { height: '137px', width: '100%', color: '#fff' }
);

type Props = {
  conversation: IConversation;
  currentUser: IUser;
  sendMessage: (
    message: AddMessageMutationVariables,
    callback: (error: Error) => void
  ) => void;
  onSearchChange: (value: string) => void;
  showInternal: boolean;
  setAttachmentPreview?: (data: IAttachmentPreview) => void;
  responseTemplates: IResponseTemplate[];
  teamMembers: IUser[];
};

type State = {
  isInactive: boolean;
  isInternal: boolean;
  sending: boolean;
  attachments: any[];
  responseTemplate: string;
  content: string;
  mentionedUserIds: string[];
  editorKey: string;
};

class RespondBox extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isInactive: !this.checkIsActive(props.conversation),
      editorKey: 'editor',
      isInternal: props.showInternal || false,
      sending: false,
      attachments: [],
      responseTemplate: '',
      content: '',
      mentionedUserIds: []
    };
  }

  isContentWritten() {
    const { content } = this.state;

    // draftjs empty content
    if (content === '<p><br></p>' || content === '') {
      return false;
    }

    return true;
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.conversation._id !== nextProps.conversation._id) {
      if (this.isContentWritten()) {
        localStorage.setItem(this.props.conversation._id, this.state.content);
      } else {
        // if clear content
        localStorage.removeItem(this.props.conversation._id);
      }

      // clear previous content
      this.setState({ content: '' });
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { sending, content } = this.state;

    if (sending && content !== prevState.content) {
      this.setState({ sending: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.conversation.customer !== nextProps.conversation.customer) {
      this.setState({
        isInactive: !this.checkIsActive(nextProps.conversation)
      });
    }

    if (this.props.showInternal !== nextProps.showInternal) {
      this.setState({
        isInternal: nextProps.showInternal
      });
    }
  }

  getUnsendMessage = (id: string) => {
    return localStorage.getItem(id) || '';
  };

  // save editor current content to state
  onEditorContentChange = (content: string) => {
    this.setState({ content });
  };

  // save mentioned user to state
  onAddMention = (mentionedUserIds: string[]) => {
    this.setState({ mentionedUserIds });
  };

  onSearchChange = (value: string) => {
    this.props.onSearchChange(value);
  };

  checkIsActive(conversation: IConversation) {
    return (
      conversation.integration.kind !== 'messenger' ||
      (conversation.customer &&
        conversation.customer.messengerData &&
        conversation.customer.messengerData.isActive)
    );
  }

  hideMask = () => {
    this.setState({ isInactive: false });

    const element = document.querySelector('.DraftEditor-root') as HTMLElement;

    element.click();
  };

  onSend = (e: React.FormEvent) => {
    e.preventDefault();

    this.addMessage();

    // redrawing editor after send button, so editor content will be reseted
    this.setState({ editorKey: `${this.state.editorKey}Key` });
  };

  onSelectTemplate = (responseTemplate?: IResponseTemplate) => {
    if (!responseTemplate) {
      return null;
    }

    return this.setState({
      responseTemplate: responseTemplate.content,

      // set attachment from response template files
      attachments: responseTemplate.files || []
    });
  };

  handleFileInput = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    const { setAttachmentPreview } = this.props;

    uploadHandler({
      files,

      beforeUpload: () => {
        return;
      },

      afterUpload: ({ response, fileInfo }) => {
        // set attachments
        this.setState({
          attachments: [
            ...this.state.attachments,
            Object.assign({ url: response }, fileInfo)
          ]
        });
        // remove preview
        if (setAttachmentPreview) {
          setAttachmentPreview(null);
        }
      },

      afterRead: ({ result, fileInfo }) => {
        if (setAttachmentPreview) {
          setAttachmentPreview(Object.assign({ data: result }, fileInfo));
        }
      }
    });
  };

  cleanText(text: string) {
    return text.replace(/&nbsp;/g, ' ');
  }

  addMessage = () => {
    const { conversation, sendMessage } = this.props;
    const { isInternal, attachments, content, mentionedUserIds } = this.state;
    const message = {
      conversationId: conversation._id,
      content: this.cleanText(content) || ' ',
      internal: isInternal,
      attachments,
      mentionedUserIds
    };

    if (this.state.content && !this.state.sending) {
      this.setState({ sending: true });

      sendMessage(message, error => {
        if (error) {
          return Alert.error(error.message);
        }

        // clear attachments, content, mentioned user ids
        return this.setState({
          attachments: [],
          content: '',
          sending: false,
          mentionedUserIds: []
        });
      });
    }
  };

  toggleForm = () => {
    this.setState({
      isInternal: !this.state.isInternal
    });
  };

  renderIncicator() {
    const attachments = this.state.attachments;
    if (attachments.length > 0) {
      return (
        <AttachmentIndicator>
          {attachments.map(attachment => (
            <Attachment key={attachment.name}>
              <AttachmentThumb>
                {attachment.type.startsWith('image') && (
                  <PreviewImg
                    style={{
                      backgroundImage: `url(${readFile(attachment.url)})`
                    }}
                  />
                )}
              </AttachmentThumb>
              <FileName>{attachment.name}</FileName>
              <div>
                ({Math.round(attachment.size / 1000)}
                kB)
              </div>
            </Attachment>
          ))}
        </AttachmentIndicator>
      );
    }

    return null;
  }

  renderMask() {
    if (this.state.isInactive) {
      return (
        <Mask onClick={this.hideMask}>
          {__(
            'Customer is offline Click to hide and send messages and they will receive them the next time they are online'
          )}
        </Mask>
      );
    }

    return null;
  }

  renderEditor() {
    const { isInternal, responseTemplate } = this.state;
    const { responseTemplates, conversation } = this.props;

    let type = 'message';

    if (isInternal) {
      type = 'note';
    }

    const placeholder = __(
      `To send your ${type} press Enter and Shift + Enter to add a new line`
    );

    return (
      <Editor
        currentConversation={conversation._id}
        defaultContent={this.getUnsendMessage(conversation._id)}
        key={this.state.editorKey}
        onChange={this.onEditorContentChange}
        onAddMention={this.onAddMention}
        onAddMessage={this.addMessage}
        onSearchChange={this.onSearchChange}
        placeholder={placeholder}
        mentions={this.props.teamMembers}
        showMentions={isInternal}
        responseTemplate={responseTemplate}
        responseTemplates={responseTemplates}
        handleFileInput={this.handleFileInput}
      />
    );
  }

  renderCheckbox(kind: string) {
    const { isInternal } = this.state;

    if (kind === 'gmail') {
      return null;
    }

    return (
      <FormControl
        className="toggle-message"
        componentClass="checkbox"
        checked={isInternal}
        onChange={this.toggleForm}
      >
        {__('Internal note')}
      </FormControl>
    );
  }

  renderButtons() {
    const { conversation } = this.props;
    const integration = conversation.integration || ({} as IIntegration);
    const disabled = integration.kind === 'gmail';

    return (
      <EditorActions>
        {this.renderCheckbox(integration.kind)}

        <Tip text={__('Attach file')}>
          <label>
            <Icon icon="attach" />
            <input type="file" onChange={this.handleFileInput} />
          </label>
        </Tip>

        <ResponseTemplate
          brandId={integration.brandId}
          attachments={this.state.attachments}
          content={this.state.content}
          onSelect={this.onSelectTemplate}
        />

        <Button
          onClick={this.onSend}
          btnStyle="success"
          size="small"
          icon="send"
        >
          {!disabled && 'Send'}
        </Button>
      </EditorActions>
    );
  }

  renderContent() {
    const { isInternal } = this.state;

    return (
      <MaskWrapper>
        {this.renderMask()}
        <RespondBoxStyled
          isInternal={isInternal}
          isInactive={this.state.isInactive}
        >
          {this.renderEditor()}
          {this.renderIncicator()}
          {this.renderButtons()}
        </RespondBoxStyled>
      </MaskWrapper>
    );
  }

  renderGmailRespondBox() {
    const { currentUser } = this.props;

    return (
      <MailRespondBox>
        <FlexRow>
          <NameCard.Avatar user={currentUser} size={30} />
          <SmallEditor>
            {this.renderEditor()}
            {this.renderIncicator()}
            {this.renderButtons()}
          </SmallEditor>
        </FlexRow>
      </MailRespondBox>
    );
  }

  render() {
    const { conversation } = this.props;

    const integration = conversation.integration || ({} as IIntegration);
    const gmailIntegration = integration.kind === 'gmail';

    if (gmailIntegration) {
      return this.renderGmailRespondBox();
    }

    return this.renderContent();
  }
}

export default RespondBox;
