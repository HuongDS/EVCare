import { render, screen, fireEvent, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { notification } from "antd";
import { NotificationProvider } from "../NotificationProvider";
import { useNotification } from "../useNotification";

const mockApi = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  open: vi.fn(),
  destroy: vi.fn(),
};
const mockContextHolder = <div data-testid="mock-context-holder" />;

vi.mock("antd", async (importOriginal) => {
  const actual = await importOriginal<typeof import("antd")>();
  return {
    ...actual,
    notification: {
      ...actual.notification,
      useNotification: vi.fn(),
    },
  };
});

const mockedAntdUseNotification = vi.mocked(notification.useNotification);

const TestConsumer = () => {
  const api = useNotification();

  return <button onClick={() => api.success({ message: "Test Message" })}>Call Success</button>;
};

describe("Notification Context & Provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAntdUseNotification.mockReturnValue([mockApi, mockContextHolder] as any);
  });

  it("TC01 [Provider]: should render children components", () => {
    render(
      <NotificationProvider>
        <div>Hello World</div>
      </NotificationProvider>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("TC02 [Provider]: should render the antd 'contextHolder'", () => {
    render(
      <NotificationProvider>
        <div>Hello World</div>
      </NotificationProvider>
    );
    expect(screen.getByTestId("mock-context-holder")).toBeInTheDocument();
  });

  it("TC03 [Provider]: should call antd 'useNotification' hook once", () => {
    render(
      <NotificationProvider>
        <div>Hello World</div>
      </NotificationProvider>
    );
    expect(mockedAntdUseNotification).toHaveBeenCalledTimes(1);
  });

  it("TC04 [Hook]: should provide the notification 'api' to children via context", () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    );
    fireEvent.click(screen.getByText("Call Success"));

    expect(mockApi.success).toHaveBeenCalledTimes(1);
    expect(mockApi.success).toHaveBeenCalledWith({ message: "Test Message" });
  });

  it("TC05 [Hook]: should throw error if useNotification is used outside of Provider", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const renderFailingHook = () => {
      renderHook(() => useNotification());
    };
    expect(renderFailingHook).toThrow("useNotification must be used within a NotificationProvider");

    consoleErrorSpy.mockRestore();
  });
});
