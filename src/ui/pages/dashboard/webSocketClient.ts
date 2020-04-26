
function setEvent(target: any, eventName: string, fn: Function) {
  const event = target.addEventListener(eventName, fn);
  const offEvent = () => {
    target.removeEventListener(eventName, fn);
  };

  return {
    nativeEvent: event,
    removeEvent: offEvent,
  };
}

class WebSocketClient {
  constructor() {
    this.count = 1; // reconnect count
  }

  private count: number;

  public onMessage: ((e: MessageEvent) => any | void) | undefined;

  public onOpen: ((e: Event) => any | void) | undefined;

  public onClose: ((e: CloseEvent) => any | void) | undefined;

  public onError: ((e: Event) => any | void) | undefined;

  public onConnectClose: (() => any | void) | undefined;

  private url: string | undefined;

  public instance: WebSocket | undefined;

  open(url: string) {
    this.url = url;
    // @ts-ignore
    const ws = new WebSocket(url);
    const onOpenEvent = setEvent(ws, 'open', (e: Event) => {
      if (this.onOpen) {
        this.onOpen(e);
      }
    });

    const onMessageEvent = setEvent(ws, 'message', (e: MessageEvent) => {
      if (this.onMessage) {
        this.onMessage(e);
      }
    });

    const onCloseEvent = setEvent(ws, 'close', (e: CloseEvent) => {
      switch (e.code) {
        case 1000: // CLOSE NORMAL
          break;
        case 1006: // CLOSED
          break;
        default:
          this.reconnect();
          break;
      }
      if (this.onClose) {
        this.onClose(e);
      }
    });

    const onErrorEvent = setEvent(ws, 'error', (e: Event) => {
      if (this.onError) {
        this.onError(e);
      }
    });

    this.instance = ws;
    this.close = () => {
      onOpenEvent.removeEvent();
      onMessageEvent.removeEvent();
      onCloseEvent.removeEvent();
      onErrorEvent.removeEvent();
      ws.close(1000);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  close() {

  }

  reconnect() {
    this.count -= 1;

    if (this.count <= 0) {
      if (this.onConnectClose) {
        this.onConnectClose();
      }
      return;
    }
    if (this.url) {
      this.open(this.url);
    }
  }
}

export default WebSocketClient;
