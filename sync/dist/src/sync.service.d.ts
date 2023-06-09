declare class Sync {
    private readonly AnonymizeCustomerService;
    private readonly CustomerModel;
    private readonly CustomerAnonymisedModel;
    private readonly TokenModel;
    private lastToken;
    private customerAnonymiseDocs;
    private timer;
    constructor();
    start(): Promise<void>;
    private syncInsert;
    syncUpdate(): Promise<void>;
    private syncDelete;
    private saveBatch;
    private getLastToken;
    setState(token: string): void;
    stop(): Promise<void>;
    saveState(): Promise<void>;
    reindex(): Promise<void>;
    private findByChunk;
}
export declare const SyncService: Sync;
export {};
