import styled from "styled-components";

export const WidgetChatStyleWrapper = styled.div`
  .chat-widget-trigger {
    position: fixed;
    bottom: 24px;
    left: 24px;
    width: 60px;
    height: 60px;
    font-size: 24px;
    z-index: 99999;
    background: linear-gradient(
      90deg,
      hsla(147, 100%, 34%, 1) 30%,
      hsla(147, 100%, 31%, 1) 100%
    );
    border: none;
    box-shadow: 0 8px 20px rgba(46, 212, 44, 0.25);
    transition: all 0.3s ease;
  }

  .chat-widget-trigger:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 25px rgba(46, 212, 44, 0.35);
  }

  .chat-widget-trigger .anticon {
    color: #ffffff !important;
    font-size: 24px;
    line-height: 1;
  }

  .chat-widget-container {
    position: fixed;
    bottom: 100px;
    left: 24px;
    width: 400px;
    height: 600px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    z-index: 99999;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease-out;
  }

  .chat-layout {
    height: 100% !important;
    border-radius: 12px;
    flex-direction: column; /* Chế độ 1 cột */
    overflow: hidden;
  }

  .chat-sider {
    width: 100% !important;
    min-width: 100% !important;
    background: #ffffff;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .chat-content {
    height: 100%;
  }

  .chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #ffffff;
    overflow: hidden;
  }

  .chat-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
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

  .chat-header-back-btn {
    color: #6b7280;
    flex-shrink: 0;
  }
  .chat-header-back-btn:hover {
    background-color: #f3f4f6;
    color: #1f2937;
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

  .chat-sidebar-header {
    padding: 1.25rem;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
  }

  .chat-sidebar-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0; /* Xóa margin-bottom */
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .chat-sidebar-title span {
    display: none;
  }
  .chat-sidebar-title h2 {
    font-size: 1rem;
  }

  .chat-sidebar-title .anticon {
    color: #00ad4e;
    font-size: 1.5rem;
  }

  .btn-new-chat-widget {
    width: auto;
    flex-shrink: 0;
    background: linear-gradient(
      90deg,
      hsla(147, 100%, 34%, 1) 30%,
      hsla(147, 100%, 31%, 1) 100%
    );
    border: none;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(46, 212, 44, 0.08);
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
    font-size: 0.8rem;
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
    font-size: 0.8rem;
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
    max-width: 85%; /* Cho phép rộng hơn 1 chút */
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
    background: linear-gradient(
      90deg,
      hsla(147, 100%, 34%, 1) 30%,
      hsla(147, 100%, 31%, 1) 100%
    );
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
    background: linear-gradient(
      90deg,
      hsla(147, 100%, 34%, 1) 30%,
      hsla(147, 100%, 31%, 1) 100%
    );
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

  .chat-welcome-state .chat-header-back-btn {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
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
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
    width: 100%;
    max-width: 280px;
  }

  .chat-choice-buttons .ant-btn {
    height: 48px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-choice-ai {
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    color: #374151;
  }

  .btn-choice-ai:hover {
    background: #e5e7eb;
    color: #1f2937;
    border-color: #d1d5db;
  }

  .btn-choice-staff {
    background: linear-gradient(
      90deg,
      hsla(147, 100%, 34%, 1) 30%,
      hsla(147, 100%, 31%, 1) 100%
    );
    border: none;
    box-shadow: 0 4px 12px rgba(46, 212, 44, 0.08);
  }

  .btn-choice-staff:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 212, 44, 0.08);
  }

  .consultation-modal .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 1.25rem 1.5rem;
  }

  .consultation-modal .ant-modal-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .consultation-modal .ant-modal-title .anticon {
    color: #00ad4e;
  }

  .consultation-modal .ant-modal-body {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  .consultation-modal-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .consultation-modal .ant-input {
    border-radius: 8px;
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

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .custom-modal-body,
  .custom-modal-body * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
  }

  .custom-modal-body {
    padding: 1.5rem 0 0.5rem;
  }

  .custom-modal-alert {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    margin-bottom: 1.5rem;
  }
  .custom-modal-alert .alert-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    color: #065f46;
    background-color: #bbf7d0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex-shrink: 0;
    font-style: italic;
  }
  .custom-modal-alert .alert-content {
    color: #065f46;
  }
  .custom-modal-alert .alert-title {
    font-weight: 600;
    margin: 0 0 8px 0;
    font-size: 1rem;
  }
  .custom-modal-alert .alert-list {
    margin: 0;
    padding-left: 20px;
  }
  .custom-modal-alert .alert-list li {
    font-size: 0.875rem;
  }

  .custom-modal-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 1rem;
  }

  .custom-radio-list {
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .custom-radio-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .custom-radio-item:last-child {
    border-bottom: none;
  }
  .custom-radio-item:hover {
    background-color: #f9fafb;
  }

  .custom-radio-item .radio-icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #d1d5db; /* Viền xám */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s ease;
  }
  .custom-radio-item .radio-icon .radio-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: transparent;
    transition: background-color 0.2s ease;
  }

  .custom-radio-item.selected {
    background-color: #f0fdf4;
    border-left: 4px solid #00ad4e;
    padding-left: 12px;
  }
  .custom-radio-item.selected .radio-icon {
    border-color: #00ad4e;
  }
  .custom-radio-item.selected .radio-icon .radio-dot {
    background-color: #00ad4e;
  }

  .custom-radio-item .radio-content {
    display: flex;
    flex-direction: column;
  }
  .custom-radio-item .radio-title {
    font-weight: 600;
    color: #1f2937;
  }
  .custom-radio-item .radio-status {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .custom-empty-text {
    color: #6b7280;
    font-style: italic;
    padding: 1rem;
    text-align: center;
  }

  .chat-offline-message {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    background: #f9fafb;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
  }

  .chat-offline-message .chat-offline-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-family: inherit !important;
  }

  .chat-offline-message p {
    font-size: 0.95rem;
    color: #4b5563;
    max-width: 300px;
    line-height: 1.6;
    font-family: inherit !important;
  }

  .chat-header-status {
    font-size: 0.8rem;
    margin: 0;
    font-weight: 700;
  }
`;
