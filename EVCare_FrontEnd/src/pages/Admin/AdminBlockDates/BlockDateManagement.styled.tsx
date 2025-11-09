import styled from "styled-components";
import { Calendar, Button } from "antd";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 32px;
  background: linear-gradient(135deg, #f0f9f4 0%, #e6f7f0 100%);
  font-family: "Outfit", sans-serif;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(90deg, #00c656 0%, #00ad4e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Instruction = styled.p`
  font-size: 1rem;
  color: #374151;
  margin: 0;
  text-align: center;
`;

export const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.12);
  }
`;

export const CalendarColumn = styled(GlassCard)`
  padding: 8px;
  overflow: hidden;
`;

export const FormColumn = styled(GlassCard)`
  .form-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-form-item-label > label {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }

  .ant-input,
  .ant-select-selector,
  .ant-input-affix-wrapper,
  .ant-picker {
    font-family: "Outfit", sans-serif;
    font-size: 1rem;
    padding: 12px 16px !important;
    border-radius: 10px !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    background: rgba(255, 255, 255, 0.7) !important;
    color: #1f2937 !important;
    transition: all 0.3s ease;
    width: 100%;

    &:focus,
    &:hover {
      outline: none !important;
      border-color: #00ad4e !important;
      background: rgba(255, 255, 255, 1) !important;
      box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.2) !important;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .ant-input:not(textarea),
  .ant-select-selector,
  .ant-input-affix-wrapper,
  .ant-picker {
    height: 50px !important;
  }

  textarea.ant-input {
    height: auto !important;
  }

  .ant-select-arrow {
    color: #374151;
  }

  .ant-input[disabled] {
    background: rgba(230, 230, 230, 0.7) !important;
    color: #6b7280 !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
  }

  .ant-form-item-explain-error {
    color: #ef4444;
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 6px;
  }
`;

export const StyledCalendar = styled(Calendar)`
  .ant-picker-panel {
    border: none;
    background: transparent;
  }

  .ant-picker-header {
    padding: 20px 20px 12px 20px;
    border-bottom: 1px solid rgba(0, 173, 78, 0.1);

    .ant-picker-header-view {
      background: linear-gradient(90deg, #00c656 0%, #00ad4e 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-weight: 700;
      font-size: 1.2em;
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .ant-select-selector {
    font-family: "Outfit", sans-serif !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    padding: 0 10px !important;
    border-radius: 10px !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    background: rgba(255, 255, 255, 0.7) !important;
    color: #1f2937 !important;
    transition: all 0.3s ease;
    height: 36px !important;

    &:hover {
      border-color: #00ad4e56 !important;
      background: rgba(255, 255, 255, 1) !important;
    }
  }
  .ant-select-arrow {
    color: #374151;
  }

  .ant-picker-mode-switch {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    padding: 3px;

    .ant-radio-button-wrapper {
      font-family: "Outfit", sans-serif;
      font-weight: 600;
      border: none !important;
      border-radius: 8px !important;
      color: #374151;
      background: transparent !important;
      box-shadow: none !important;
      height: 30px;
      line-height: 30px;

      &:hover {
        color: #00ad4e;
      }
    }

    .ant-radio-button-wrapper-checked {
      background: #fff !important;
      color: #00ad4e37 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }
  }

  .ant-picker-prev-icon,
  .ant-picker-next-icon,
  .ant-picker-super-prev-icon,
  .ant-picker-super-next-icon {
    color: #00ad4e7e;
  }

  .ant-picker-cell-selected .ant-picker-cell-inner {
    background: #00ad4e93 !important;
    color: white !important;
    border-radius: 8px;
    font-weight: 700;
  }
  .ant-picker-cell-today .ant-picker-cell-inner {
    border: 3px solid #00ad4e !important;
    border-radius: 12px !important;
  }
  .event-marker {
    display: none;
  }

  .ant-picker-cell-in-view:has(.event-marker) .ant-picker-cell-inner {
    background: #002ead9e !important;
    color: white !important;
    font-weight: 700;
    position: relative;
    border-radius: 12px !important;
    z-index: 2;
    box-shadow: 0 4px 10px rgba(0, 173, 78, 0.3);
  }

  .ant-picker-cell-in-view:has(.event-marker).ant-picker-cell-today .ant-picker-cell-inner {
    border-color: transparent !important;
  }

  .ant-picker-cell-in-view:has(.event-marker).ant-picker-cell-selected .ant-picker-cell-inner {
    box-shadow: 0 4px 10px rgba(0, 173, 78, 0.3);
  }
`;

export const FormPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 1rem;
  font-weight: 500;

  .anticon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #d1d5db;
  }
`;

export const EvcareButton = styled(Button)`
  height: 50px !important;
  border-radius: 12px !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  font-family: "Outfit", sans-serif !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;

  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 6px 15px rgba(0, 173, 78, 0.3) !important;
  transition: all 0.3s ease !important;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 173, 78, 0.4) !important;
    background: linear-gradient(135deg, #00c853 0%, #00ad4e 100%) !important;
    color: white !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(0, 173, 78, 0.2) !important;
    color: white !important;
  }

  &:disabled {
    background: #e0e0e0 !important;
    color: #9e9e9e !important;
    box-shadow: none !important;
    cursor: not-allowed !important;
  }

  &.ant-btn-dangerous:not(:disabled) {
    background: #dc2626 !important;
    box-shadow: 0 6px 15px rgba(220, 38, 38, 0.3) !important;
    &:hover {
      background: #b91c1c !important;
      box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4) !important;
    }
    &:active {
      background: #dc2626 !important;
    }
  }
`;
