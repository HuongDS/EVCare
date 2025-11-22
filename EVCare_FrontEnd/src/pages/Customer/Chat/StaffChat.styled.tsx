import styled from "styled-components";

export const StaffChatStyleWrapper = styled.div`
  .chat-layout {
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
  }

  .chat-sider {
    background: #ffffff;
    box-shadow: 4px 0 24px rgba(46, 212, 44, 0.08);
    border-radius: 12px 0 0 12px;
    width: 320px;
    min-width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .chat-content {
    position: relative;
    padding: 0;
    flex: 1;
    background: transparent;
    height: 100%;
  }

  .chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #ffffff;
    border-radius: 0 12px 12px 0;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    max-height: 94vh;
  }

  .chat-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .staff-chat-header {
    padding: 1.25rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .staff-chat-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .staff-chat-title .anticon {
    color: #00ad4e;
    font-size: 1.5rem;
  }

  .staff-status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .chat-header {
    flex-shrink: 0;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .chat-header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .chat-header-avatar {
    background: #ffffff;
    color: #00ad4e;
  }

  .chat-header-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  .chat-header-status {
    font-size: 0.8rem;
    color: #00ad4e;
    margin: 0;
    font-weight: 700;
  }

  .btn-end-conversation {
    background: #fff0f0;
    border-color: #ffccc7;
    color: #f5222d;
    box-shadow: none;
  }

  .btn-end-conversation:hover {
    background: #f5222d;
    border-color: #f5222d;
    color: #ffffff;
  }

  .chat-sidebar-header {
    padding: 1.25rem;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-sidebar-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .chat-sidebar-title .anticon {
    color: #00ad4e;
    font-size: 1.5rem;
  }

  .chat-sidebar-list {
    padding: 0;
  }

  .chat-sidebar-list .ant-list-item {
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.875rem 1rem;
    border-left: 4px solid transparent;
    border-bottom: 1px solid #f0f0f0;
    margin: 0;
  }

  .chat-sidebar-list .ant-list-item:hover {
    background-color: #f9fafb;
  }

  .chat-sidebar-list .ant-list-item.selected {
    background-color: #eff6ff;
    border-left-color: #00ad4e;
  }

  .conversation-avatar-wrapper {
    position: relative;
  }

  .conversation-avatar {
    transition: all 0.3s ease;
  }

  .conversation-avatar.selected {
    box-shadow: 0 0 0 3px #00ad4e;
  }

  .conversation-unread-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .conversation-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .conversation-name {
    font-weight: 600;
    color: #1f2937;
    transition: color 0.2s ease;
  }

  .conversation-name.selected {
    color: #00ad4e;
  }

  .conversation-time {
    font-size: 0.75rem;
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .conversation-preview {
    font-size: 0.875rem;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .conversation-preview.unread {
    font-weight: 500;
    color: #374151;
  }

  .chat-messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
    min-height: 0;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
  }

  .chat-messages-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: min-content;
  }

  .message-wrapper {
    display: flex;
    animation: fadeIn 0.3s ease;
  }

  .message-wrapper.own {
    justify-content: flex-end;
  }

  .message-wrapper.other {
    justify-content: flex-start;
  }

  .message-content {
    display: flex;
    gap: 0.5rem;
    max-width: 70%;
  }

  .message-content.own {
    flex-direction: row-reverse;
  }

  .message-avatar {
    flex-shrink: 0;
  }

  .message-bubble-container {
    display: flex;
    flex-direction: column;
  }

  .message-bubble-container.own {
    align-items: flex-end;
  }

  .message-bubble-container.other {
    align-items: flex-start;
  }

  .message-bubble {
    padding: 0.75rem 1rem;
    border-radius: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    word-wrap: break-word;
    max-width: 100%;
  }

  .message-bubble.own {
    background: linear-gradient(90deg, hsla(147, 100%, 34%, 1) 30%, hsla(147, 100%, 31%, 1) 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
  }

  .message-bubble.other {
    background: #ffffff;
    color: #1f2937;
    border: 1px solid #e5e7eb;
    border-bottom-left-radius: 4px;
  }

  .message-text {
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
  }

  .message-timestamp {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.25rem;
    padding: 0 0.5rem;
  }

  .chat-input-area {
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
    padding: 1rem;
    flex-shrink: 0;
    z-index: 10;
  }

  .chat-input-container {
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
    max-width: 64rem;
    margin: 0 auto;
  }

  .chat-input-field {
    flex: 1;
  }

  .chat-input-field .ant-input {
    border-radius: 12px;
    border-color: #d1d5db;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    padding: 0.5rem 0.875rem;
    font-size: 0.9375rem;
  }

  .chat-input-field .ant-input:hover {
    border-color: #00ad4e;
  }

  .chat-input-field .ant-input:focus {
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .btn-send-message {
    height: 42px;
    padding: 0 1.5rem;
    border-radius: 12px;
    background: linear-gradient(90deg, hsla(147, 100%, 34%, 1) 30%, hsla(147, 100%, 31%, 1) 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(46, 212, 44, 0.08);
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-send-message:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 212, 44, 0.08);
  }

  .btn-send-message:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-send-message:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .chat-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .chat-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #9ca3af;
  }

  .chat-empty-icon {
    font-size: 3rem;
    margin-bottom: 0.75rem;
  }

  .chat-welcome-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 2rem;
    background-color: #fff;
    position: relative;
  }

  .chat-welcome-icon-wrapper {
    background: #ffffff;
    border-radius: 50%;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }

  .chat-welcome-icon {
    font-size: 4rem;
    color: #00ad4e;
  }

  .chat-welcome-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .chat-welcome-description {
    color: #6b7280;
    max-width: 28rem;
    font-size: 1rem;
    line-height: 1.6;
  }

  .chat-choice-buttons {
    display: none;
  }

  .chat-messages-area::-webkit-scrollbar,
  .chat-sidebar-list::-webkit-scrollbar {
    width: 6px;
  }

  .chat-messages-area::-webkit-scrollbar-track,
  .chat-sidebar-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-messages-area::-webkit-scrollbar-thumb,
  .chat-sidebar-list::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 3px;
  }

  .chat-messages-area::-webkit-scrollbar-thumb:hover,
  .chat-sidebar-list::-webkit-scrollbar-thumb:hover {
    background: #00ad4e;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @media (max-width: 768px) {
    .chat-sider {
      position: absolute;
      left: -320px;
      top: 0;
      bottom: 0;
      z-index: 50;
      width: 280px !important;
      min-width: 280px !important;
      box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .chat-sider.open {
      left: 0;
    }

    .chat-content {
      overflow: hidden;
    }

    .chat-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 40;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .chat-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .message-content {
      max-width: 85%;
    }

    .chat-welcome-icon-wrapper {
      padding: 1.5rem;
    }

    .chat-welcome-icon {
      font-size: 3rem;
    }

    .chat-welcome-title {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 640px) {
    .chat-layout {
      border-radius: 0;
    }

    .chat-sider {
      border-radius: 0;
    }

    .chat-window {
      border-radius: 0;
    }

    .message-content {
      max-width: 90%;
    }
  }
`;
