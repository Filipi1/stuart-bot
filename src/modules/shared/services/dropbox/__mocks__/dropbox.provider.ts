import { DropboxService } from "../dropbox.service";

export const DropboxServiceProvider = {
    provide: DropboxService,
    useValue: {
        execute: jest.fn()
    }
}