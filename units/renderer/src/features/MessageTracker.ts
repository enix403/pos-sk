import { ChannelResponse, Message } from '@shared/communication'
import { isResponseSuccessful, formatResponseErrorLog } from '@/utils';


export namespace MessageTracker {
  export type State = {
    loading: boolean;
  };
  export type ResponseHandler<K> = (response: ChannelResponse<K> | null, msgState: State) => void;
  export type HandlerAlias<T> = T extends MessageTracker<infer K> ? ResponseHandler<K> : never;
}
export class MessageTracker<K = any>
{
  currentState: MessageTracker.State;
  responseFunc: MessageTracker.ResponseHandler<K>;

  constructor(private readonly message: Message<any, K>) {
    this.currentState = {
      loading: false
    }
  }

  public getState() {
    return this.currentState;
  }

  private handleResponse = (res: ChannelResponse<K>) => {
    this.currentState.loading = false;
    if (!isResponseSuccessful(res)) {
      console.error("MessageTracker::handleResponse(): Failed to complete message:", formatResponseErrorLog(res));
    }
    this.responseFunc(res, this.currentState);
  }

  public sendMessage() {
    this.currentState.loading = true;
    this.responseFunc(null, this.currentState);
    window.SystemBackend.sendMessage(this.message).then(this.handleResponse);
  }

  public watch(func: MessageTracker.ResponseHandler<K>, init = true) {
    this.responseFunc = func;
    if (init)
      this.sendMessage();
  }
}
